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

/**
 * Upload multipart/form-data vers un endpoint GLPI V1.
 * Utilisé pour les endpoints qui n'acceptent pas application/json,
 * comme POST /Document (upload de fichier).
 *
 * @param {string} path          - Endpoint relatif, ex: "Document"
 * @param {object} manifest      - Objet JSON placé dans le champ uploadManifest
 * @param {Blob|File} fileBlob   - Le fichier binaire à envoyer
 * @param {string} filename      - Nom du fichier (ex: "PC-ADM-001.png")
 * @returns {Promise<object>}    - Réponse JSON de GLPI (ex: { id, message, upload_result })
 */
async function uploadMultipart(path, manifest, fileBlob, filename) {
    if (!_sessionToken) await initSession();
 
    const formData = new FormData();
    // Le manifest doit être une string JSON, pas un objet
    formData.append("uploadManifest", JSON.stringify(manifest));
    // Le fichier — le navigateur génère automatiquement le boundary multipart
    formData.append("filename[0]", fileBlob, filename);
 
    // IMPORTANT : ne pas mettre Content-Type manuellement,
    // le navigateur le génère avec le bon boundary
    const headers = { "Session-Token": _sessionToken };
    if (APP_TOKEN) headers["App-Token"] = APP_TOKEN;

    let res = await fetch(`${BASE_URL}/apirest.php/${path}`, {
        method: "POST",
        headers,
        body: formData,
    });
 
    if (res.status === 401) {
        await initSession();
        headers["Session-Token"] = _sessionToken;
        res = await fetch(`${BASE_URL}/apirest.php/${path}`, {
            method: "POST",
            headers,
            body: formData,
        });
    }
 
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            `V1 Multipart Error ${res.status} on POST ${path} — ${JSON.stringify(err)}`
        );
    }
 
    if (res.status === 204) return null;
 
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    return res.text();
}

export async function getDocumentBlobV1(documentId) {
    if (!_sessionToken) await initSession();

    const headers = { "Session-Token": _sessionToken };
    if (APP_TOKEN) headers["App-Token"] = APP_TOKEN;

    const res = await fetch(`${BASE_URL}/apirest.php/Document/${documentId}?alt=media`, {
        method: "GET",
        headers,
    });

    if (!res.ok) throw new Error(`getDocumentBlob failed: ${res.status}`);

    const blob = await res.blob();
    console.log(`Blob du document #${documentId} récupéré :`, blob);
    const url = URL.createObjectURL(blob);
    console.log(`URL du blob pour document #${documentId} :`, url);
    return url;
}

export const getV1  = (path)             => apiCall("GET",    path);
export const postV1 = (path, body)       => apiCall("POST",   path, body);
export const patchV1 = (path, body)      => apiCall("PATCH",  path, body);
export const delV1  = (path)             => apiCall("DELETE", path);
export const killSessionV1 = killSession;
export const initSessionV1 = initSession;
export const uploadMultipartV1 = (path, manifest, fileBlob, filename) => uploadMultipart(path, manifest, fileBlob, filename);

export default { getV1, postV1, patchV1, delV1, killSessionV1, initSessionV1, uploadMultipartV1, getDocumentBlobV1 };