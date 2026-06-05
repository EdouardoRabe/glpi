const BASE_URL    = import.meta.env.VITE_GLPI_BASE_URL || "";
const APP_TOKEN   = import.meta.env.VITE_GLPI_APP_TOKEN || "";
const USERNAME    = import.meta.env.VITE_GLPI_USERNAME  || "";
const PASSWORD    = import.meta.env.VITE_GLPI_PASSWORD  || "";

const SESSION_STORAGE_KEY = "glpi_v1_session_token";

let _sessionToken = sessionStorage.getItem(SESSION_STORAGE_KEY);


async function initSession() {
    const credentials = btoa(`${USERNAME}:${PASSWORD}`);

    const headers = {
        "Content-Type":  "application/json",
        "Authorization": `Basic ${credentials}`,
    };
    if (APP_TOKEN) headers["App-Token"] = APP_TOKEN;

    const res = await fetch(`${BASE_URL}/apirest.php/initSession`, {
        method: "GET",
        headers,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(`initSession V1 failed: ${res.status} — ${JSON.stringify(body)}`);
    }

    const data = await res.json();
    _sessionToken = data.session_token;
    sessionStorage.setItem(SESSION_STORAGE_KEY, _sessionToken);
    return _sessionToken;
}


async function killSession() {
    if (!_sessionToken) return;

    const headers = {
        "Content-Type":  "application/json",
        "Session-Token": _sessionToken,
    };
    if (APP_TOKEN) headers["App-Token"] = APP_TOKEN;

    await fetch(`${BASE_URL}/apirest.php/killSession`, {
        method: "GET",
        headers,
    });

    _sessionToken = null;
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

async function apiCall(method, path, body = null) {
    if (!_sessionToken) await initSession();

    const makeHeaders = () => {
        const h = {
            "Content-Type":  "application/json",
            "Session-Token": _sessionToken,
        };
        if (APP_TOKEN) h["App-Token"] = APP_TOKEN;
        return h;
    };

    const makeOpts = () => {
        const opts = { method, headers: makeHeaders() };
        if (body && method !== "GET" && method !== "DELETE") {
            opts.body = JSON.stringify(body);
        }
        return opts;
    };

    let res = await fetch(`${BASE_URL}/apirest.php/${path}`, makeOpts());

    if (res.status === 401) {
        await initSession();
        res = await fetch(`${BASE_URL}/apirest.php/${path}`, makeOpts());
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            `V1 API Error ${res.status} on ${method} ${path} — ${JSON.stringify(err)}`
        );
    }

    if (res.status === 204) return null;

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    return res.text();
}


export const getV1  = (path)             => apiCall("GET",    path);
export const postV1 = (path, body)       => apiCall("POST",   path, body);
export const patchV1 = (path, body)      => apiCall("PATCH",  path, body);
export const delV1  = (path)             => apiCall("DELETE", path);
export const killSessionV1 = killSession;
export const initSessionV1 = initSession;

export default { getV1, postV1, patchV1, delV1, killSessionV1, initSessionV1 };