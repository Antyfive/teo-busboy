/*!
 * Drops writable stream
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 12/20/15
 */

"use strict";

const Writable = require("stream").Writable;

/**
 * Omits all incoming data
 */
class DropStream extends Writable {
    constructor() {
        super();
    }

    _write(chunk, encoding, callback) {
        callback();
    }
}

module.exports = DropStream;