import { encodeBase64Url, decodeBase64Url } from './base64Url'

export async function createRegisterCredential(options) {

    // TODO: Add an ability to create a passkey: Create a credential.
    // Base64URL decode some values
    options.user.id = decodeBase64Url(options.user.id)
    options.challenge = decodeBase64Url(options.challenge)

    if (options.excludeCredentials) {
        for (let credential of options.excludeCredentials) {
            credential.id = decodeBase64Url(credential.id);
        }
    }

    // Use platform authenticator and discoverable credential
    options.authenticatorSelection = {
        authenticatorAttachment: 'platform',
        requireResidentKey: true
    }

    // Invoke WebAuthn create
    const cred = await navigator.credentials.create({
        publicKey: options,
    });

    const credential = {};
    credential.id = cred.id;
    // Base64URL encode `rawId`
    credential.rawId = encodeBase64Url(cred.rawId);
    credential.type = cred.type;

    // `authenticatorAttachment` in PublicKeyCredential is a new addition in WebAuthn L3
    if (cred.authenticatorAttachment) {
        credential.authenticatorAttachment = cred.authenticatorAttachment;
    }

    // Base64URL encode some values
    const clientDataJSON = encodeBase64Url(cred.response.clientDataJSON);
    const attestationObject = encodeBase64Url(cred.response.attestationObject);

    // Obtain transports if they are available.
    const transports = cred.response.getTransports ? cred.response.getTransports() : [];

    credential.response = {
        clientDataJSON,
        attestationObject,
        transports
    };

    return credential
}

export async function authenticateWithPasskey(options, conditional = false) {
    // Base64URL decode the challenge
    options.challenge = decodeBase64Url(options.challenge);

    // `allowCredentials` empty array invokes an account selector by discoverable credentials.
    options.allowCredentials = [];

    // Invoke WebAuthn get
    const cred = await navigator.credentials.get({
        publicKey: options,
        // Request a conditional UI
        mediation: conditional ? 'conditional' : 'optional'
    });

    const credential = {};
    credential.id = cred.id;
    credential.type = cred.type;
    // Base64URL encode `rawId`
    credential.rawId = encodeBase64Url(cred.rawId);

    // Base64URL encode some values
    const clientDataJSON = encodeBase64Url(cred.response.clientDataJSON);
    const authenticatorData = encodeBase64Url(cred.response.authenticatorData);
    const signature = encodeBase64Url(cred.response.signature);
    const userHandle = encodeBase64Url(cred.response.userHandle);

    credential.response = {
        clientDataJSON,
        authenticatorData,
        signature,
        userHandle,
    };
    return credential
}