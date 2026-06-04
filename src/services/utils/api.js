const BASE_URL = import.meta.env.VITE_GLPI_BASE_URL || "";
const TOKEN_PATH =
    import.meta.env.VITE_GLPI_TOKEN_PATH || "/api.php/v2.3/token";
const GRANT_TYPE = import.meta.env.VITE_GLPI_GRANT_TYPE || "password";
const CLIENT_ID = import.meta.env.VITE_GLPI_CLIENT_ID || "";
const CLIENT_SECRET = import.meta.env.VITE_GLPI_CLIENT_SECRET || "";
const USERNAME = import.meta.env.VITE_GLPI_USERNAME || "";
const PASSWORD = import.meta.env.VITE_GLPI_PASSWORD || "";
const SCOPE = import.meta.env.VITE_GLPI_SCOPE || "";

let _token = typeof window !== "undefined" ? sessionStorage.getItem("glpi_token") : null;
let _isRefreshing = false;
let _refreshPromise = null;

const _queue = [];

function _setToken(t) {
    _token = t;
    try {
        if (t) sessionStorage.setItem("glpi_token", t);
        else sessionStorage.removeItem("glpi_token");
    } catch (e) {
        console.warn("Failed to access sessionStorage:", e);
    }
}

function _clearToken() {
    _setToken(null);
}

function _drainQueue(err) {
    while (_queue.length) {
        const { resolve, reject } = _queue.shift();
        if (err) reject(err);
        else resolve();
    }
}

async function refreshToken() {
    if (_isRefreshing) return _refreshPromise;
    _isRefreshing = true;

    _refreshPromise = (async () => {
        try {
            const url = `${BASE_URL}${TOKEN_PATH}`;
            const params = new URLSearchParams();
            if (GRANT_TYPE) params.append("grant_type", GRANT_TYPE);
            if (CLIENT_ID) params.append("client_id", CLIENT_ID);
            if (CLIENT_SECRET) params.append("client_secret", CLIENT_SECRET);
            if (USERNAME) params.append("username", USERNAME);
            if (PASSWORD) params.append("password", PASSWORD);
            if (SCOPE) params.append("scope", SCOPE);

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
                mode: "cors",
                credentials: "omit",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Token refresh failed: ${res.status} ${text}`);
            }

            const data = await res.json();
            const newToken = data?.access_token || data?.token || null;
            if (!newToken) throw new Error("No access_token in response");

            _setToken(newToken);
            _drainQueue(null);
            return newToken;
        } catch (err) {
            _clearToken();
            _drainQueue(err);
            throw err;
        } finally {
            _isRefreshing = false;
            _refreshPromise = null;
        }
    })();

    return _refreshPromise;
}

function _enqueueRequest() {
    return new Promise((resolve, reject) => {
        _queue.push({ resolve, reject });
    });
}

function buildUrl(endpoint, resourceId = null, query = {}) {
    const path = resourceId !== null && resourceId !== undefined && resourceId !== ""
        ? `${endpoint}/${resourceId}`
        : endpoint;
    const url = new URL(`${BASE_URL}/api.php/v2.3/${path}`, window.location.origin);

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
}

async function apiCall(method, endpoint, resourceId = null, data = null, options = {}) {
    const query = method === "DELETE" ? { force: options.force ?? true } : options.query || {};
    const url = buildUrl(endpoint, resourceId, query);
    const headers = { Accept: "application/json" };

    if (_token) {
        headers["Authorization"] = `Bearer ${_token}`;
    }

    if (method === "POST" || method === "PUT" || method === "PATCH") {
        headers["Content-Type"] = "application/json";
    }

    const opts = {
        method,
        headers,
        mode: "cors",
        credentials: "omit",
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
        opts.body = typeof data === "string" ? data : JSON.stringify(data);
    }

    try {
        let res = await fetch(url, opts);

        if (res.status === 401 || res.status === 403 || res.status === 400) {
            const body = await res.json().catch(() => ({}));
            const isTokenError = body?.status === "ERROR_INVALID_PARAMETER"
                && body?.title?.toLowerCase().includes("token");

            if (res.status === 400 && !isTokenError) {
                return { error: true, status: 400, message: JSON.stringify(body) };
            }

            if (_isRefreshing) {
                await _enqueueRequest();
            } else {
                try {
                    await refreshToken();
                } catch (err) {
                    console.error("Token refresh failed:", err);
                    return { error: true, message: "Token refresh failed", status: 401 };
                }
            }
            return apiCall(method, endpoint, resourceId, data, options);
        }

        if (res.ok) {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) return await res.json();
            return await res.text();
        }

        const body = await res.text();
        return { error: true, status: res.status, message: body };
    } catch (err) {
        if (err instanceof TypeError) {
            return {
                error: true,
                message: "CORS or network error",
                details: err.message,
            };
        }
        return { error: true, message: String(err?.message || err) };
    }
}

export const get = (endpoint, resourceId = null, options = {}) =>
    apiCall("GET", endpoint, resourceId, null, options);
export const post = (endpoint, data, resourceId = null, options = {}) =>
    apiCall("POST", endpoint, resourceId, data, options);
export const put = (endpoint, data, resourceId = null, options = {}) =>
    apiCall("PUT", endpoint, resourceId, data, options);
export const patch = (endpoint, data, resourceId = null, options = {}) =>
    apiCall("PATCH", endpoint, resourceId, data, options);
export const del = (endpoint, resourceId = null, options = {}) =>
    apiCall("DELETE", endpoint, resourceId, null, options);
export const refreshTokenManually = () => refreshToken();
export const getToken = () => _token;

export default { get, post, put, patch, del, refreshTokenManually, getToken };
