/*!
 * Teo-busboy lib
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 12/21/15
 */

"use strict";

const
    Busboy = require("busboy"),
    _ = require("lodash"),
    DropStream = require("./dropStream"),
    chan = require("chan");

module.exports = class TeoBusboy {
    constructor(req, options) {

        _.extend(this, {validateFile: () => true, validateField: () => true, req: req}, options);
        _.bindAll(this, ["onFile", "onField", "onFinish", "onError", "onClose"]);

        options = options || {};

        options.headers = req.headers;

        this.form = chan();
        this.busboy = new Busboy(options);
        this.busboy
            .on("file", this.onFile)
            .on("field", this.onField)
            .on("finish", this.onFinish)
            .on("error", this.onError)
            .on("close", this.onClose)
            .on("partsLimit", () => {
                // 413
            })
            .on("filesLimit", () => {
                // 413
            })
            .on("fieldsLimit", () => {
                // 413
            });

        req.on("close", this.onClose);
        req.pipe(this.busboy);
    }

    onFile(fieldName, file, fileName, encoding, mimeType) {
        let valid = this.validateFile.apply(this, [].slice.call(arguments));
        if (!valid) {
            let dropStream = new DropStream();
            file.pipe(dropStream);  // prevent further writing
            let error = new Error("File is not valid");
            // immediate error
            this.form(error);
            return;
        }
        file.fieldName = fieldName;
        file.fileName = fileName;
        file.encoding = encoding;
        file.mimeType = file.mime = mimeType;

        this.form(file);
    }

    onField(fieldName, val, fieldNameTruncated, valTruncated, encoding, mimeType) {
        let valid = this.validateField.apply(this, [].slice.call(arguments));

        if (!valid) {
            let error = new Error("Field is not valid");
            // immediate error
            this.form(error);
            return;
        }
        // pass field names as array
        this.form([fieldName, val, fieldNameTruncated, valTruncated, encoding, mimeType]);
    }

    onFinish() {
        this.cleanup();
        this.form();
    }

    onError(err) {
        this.form(err);
    }

    onClose() {
        this.onFinish();
    }

    cleanup() {
        this.req.removeListener("close", this.onClose);

        this.busboy
            .removeListener("file", this.onFile)
            .removeListener("field", this.onField)
            .removeListener("finish", this.onFinish)
            .removeListener("error", this.onError)
            .removeListener("close", this.onClose);
    }
};