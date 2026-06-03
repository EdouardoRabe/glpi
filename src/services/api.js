const BASE_URL = import.meta.env.VITE_GLPI_BASE_URL || "";
const TOKEN_PATH =
    import.meta.env.VITE_GLPI_TOKEN_PATH || "/api.php/v2.3/token";
const GRANT_TYPE = import.meta.env.VITE_GLPI_GRANT_TYPE || "password";
const CLIENT_ID = import.meta.env.VITE_GLPI_CLIENT_ID || "";
const CLIENT_SECRET = import.meta.env.VITE_GLPI_CLIENT_SECRET || "";
const USERNAME = import.meta.env.VITE_GLPI_USERNAME || "";
const PASSWORD = import.meta.env.VITE_GLPI_PASSWORD || "";
const SCOPE = import.meta.env.VITE_GLPI_SCOPE || "";

let _token =
    typeof window !== "undefined" ? sessionStorage.getItem("glpi_token") : null;
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

async function apiCall(method, endpoint, data = null) {
    const url = `${BASE_URL}/api.php/v2.3/${endpoint}`;
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

        if (res.status === 401 || res.status === 403) {
            if (_isRefreshing) {
                // Attendre le refresh en cours
                await _enqueueRequest();
            } else {
                // Lancer le refresh
                try {
                    await refreshToken();
                } catch (err) {
                    console.error("Token refresh failed:", err);
                    return { error: true, message: "Token refresh failed", status: 401 };
                }
            }
            // Dans les DEUX cas, rappeler apiCall au complet avec le nouveau token
            return apiCall(method, endpoint, data);
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

export const get = (endpoint) => apiCall("GET", endpoint);
export const post = (endpoint, data) => apiCall("POST", endpoint, data);
export const put = (endpoint, data) => apiCall("PUT", endpoint, data);
export const patch = (endpoint, data) => apiCall("PATCH", endpoint, data);
export const del = (endpoint, data) => apiCall("DELETE", endpoint, data);
export const refreshTokenManually = () => refreshToken();
export const getToken = () => _token;

export default { get, post, put, patch, del, refreshTokenManually, getToken };
