export function encodeBase64Url(buffer) {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function decodeBase64Url(str) {
    const base64 = str
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .replace(/=/g, '');
    const binStr = window.atob(base64)
    const bin = new Uint8Array(binStr.length)
    for(let i = 0; i < binStr.length; i++) {
        bin[i] = binStr.charCodeAt(i)
    }
    return bin.buffer
}