# webauthn-encoding

A JavaScript library for decoding/encoding WebAuthn API arguments/returns from/to plain objects.

## Usage

```javascript
const enc = new WebauthnEncoding({
    base64Safe: true,
    base64NoPadding: true
})

// 1. Registration

// fetch JSON from backend service
const res1 = await fetch("/api/sign_up/init")

// create
const res2 = await navigator.credentials.create(
    enc.decodeCreationRequest(res1.json())   
)

// send back data to backend service
await fetch("/api/sign_up/finish", {
    method:'POST',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(enc.encodeCreationResponse(res2))
})

// 2. Validation

// fetch JSON from backend service
const res3 = await fetch("/api/sign_in/init")

// create
const res4 = await navigator.credentials.get(
    enc.decodeCredentialRequest(res3.json())
)

// send back data to backend service
await fetch("/api/sign_in/finish", {
    method:'POST',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(enc.encodeCredentialResponse(res4))
})


```

## Compatible Backend Service

* https://github.com/go-webauthn/webauthn

## Donation

View https://guoyk.xyz/donation

## Credits

Guo Y.K., MIT License