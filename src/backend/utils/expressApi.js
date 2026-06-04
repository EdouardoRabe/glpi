const BASE = '/express';

export async function call(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
    }

    return res.status === 204 ? null : res.json();
}

export const get = (path) => call('GET', path);
export const post = (path, body) => call('POST', path, body);
export const put = (path, body) => call('PUT', path, body);
export const del = (path) => call('DELETE', path);