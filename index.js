/*!
 * Teo multipart
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 12/20/15
 */

"use strict";

const
    EventEmitter = require("events").EventEmitter,
    Busboy = require("busboy"),
    _ = require("lodash"),
    dropStream = require("./lib/dropStream");

module.exports = class TeoMultipart extends EventEmitter {
    constructor(req, options) {

        _.bindAll(this, ["onFile", "onField", "onFinish", "onError", "onClose"]);

        this.busboy = new Busboy({headers: req.headers});
        this.busboy
            .on("file", this.onFile)
            .on("field", this.onField)
            .on("finish", this.onFinish)
            .on("error", this.onError)
            .on("close", this.onClose)
            .("partsLimit", () => {
                // 413
            })
            .("filesLimit", () => {
                // 413
            })
            .("fieldsLimit", () => {
                // 413
            });
    }

    onFile(fieldname, file, filename, encoding, mimetype) {

    }
    onField(fieldname, val, fieldNameTruncated, valTruncated) {

    }

    onFinish() {}

    onError() {}

    onClose() {}
};