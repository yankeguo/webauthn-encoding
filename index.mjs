export class WebauthnEncoding {
    base64Safe = false
    base64NoPadding = false

    constructor(options) {
        if (typeof options === 'object') {
            this.base64Safe = !!options.base64Safe
            this.base64NoPadding = !!options.base64NoPadding
        }
    }

    decodeUint8Array(s) {
        // compatible url-safe or std base64
        const b = atob(s.replace(/_/g, '/').replace(/-/g, '+'))
        return Uint8Array.from(b, function (c) {
                return c.charCodeAt(0)
            }
        )
    }

    encodeArrayBuffer(data) {
        let a = btoa(String.fromCharCode.apply(null, new Uint8Array(data)))
        if (this.base64Safe) {
            a = a.replace(/\+/g, "-").replace(/\//g, "_")
        }
        if (this.base64NoPadding) {
            a = a.replace(/=/g, "")
        }
        return a
    }

    /**
     * Decode a Plain Object from backend service and convert it to a valid argument for navigator.credentials.create(options)
     * @param req Plain Object from backend service
     * @returns a valid argument for navigator.credentials.create(options)
     */
    decodeCreationRequest(req) {
        // deep clone
        req = JSON.parse(JSON.stringify(req))

        if (typeof req.publicKey === 'object') {
            const publicKey = req.publicKey
            if (publicKey.challenge) {
                publicKey.challenge = this.decodeUint8Array(publicKey.challenge)
            }
            if (typeof publicKey.user === 'object') {
                const user = publicKey.user
                if (user.id) {
                    user.id = this.decodeUint8Array(user.id)
                }
            }
        }
        return req
    }

    /**
     * Encode a response from navigator.credentials.create(options) to a Plain Object
     * @param src response from navigator.credentials.create(options)
     * @returns a Plain Object suitable for sending back to backend service
     */
    encodeCreationResponse(src) {
        const dst = {
            id: src.id,
            rawId: src.rawId,
            type: src.type,
        }
        if (dst.rawId) {
            dst.rawId = this.encodeArrayBuffer(dst.rawId)
        }

        if (src.response) {
            const response = {}

            for (const key of ['attestationObject', 'clientDataJSON']) {
                if (src.response[key]) {
                    response[key] = this.encodeArrayBuffer(src.response[key])
                }
            }

            dst.response = response
        }
        return dst
    }

    /**
     * Decode a Plain Object from backend service and convert it to a valid argument for navigator.credentials.get(options)
     * @param req Plain Object from backend service
     * @returns a valid argument for navigator.credentials.get(options)
     */
    decodeCredentialRequest(req) {
        // deep clone
        req = JSON.parse(JSON.stringify(req))

        if (typeof req.publicKey === 'object') {
            const publicKey = req.publicKey
            if (publicKey.challenge) {
                publicKey.challenge = this.decodeUint8Array(publicKey.challenge)
            }
            if (Array.isArray(publicKey.allowCredentials)) {
                for (const ac of publicKey.allowCredentials) {
                    ac.id = this.decodeUint8Array(ac.id)
                }
            }
        }

        return req
    }

    /**
     * Encode a response from navigator.credentials.get(options) to a Plain Object
     * @param src response from navigator.credentials.get(options)
     * @returns a Plain Object suitable for sending back to backend service
     */
    encodeCredentialResponse(src) {
        const dst = {
            id: src.id,
            rawId: src.rawId,
            type: src.type,
        }
        if (dst.rawId) {
            dst.rawId = this.encodeArrayBuffer(dst.rawId)
        }

        if (src.response) {
            const response = {}

            for (const key of ['authenticatorData', 'clientDataJSON', 'signature', 'userHandle']) {
                if (src.response[key]) {
                    response[key] = this.encodeArrayBuffer(src.response[key])
                }
            }

            dst.response = response
        }
        return dst
    }

}