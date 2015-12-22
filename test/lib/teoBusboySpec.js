/*!
 * Multipart spec
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 12/21/15
 */

"use strict";

const Stream = require("stream"),
    Multipart = require("../../"),
    isArray = Array.isArray;

describe("TeoBusboy Tests", () => {

    let req, multipart, onFinishSpy, cleanupSpy, validateFileStub, validateFieldStub;

    beforeEach(() => {

        req = mockRequest();
        onFinishSpy = sinon.spy(Multipart.prototype, "onFinish");
        cleanupSpy = sinon.spy(Multipart.prototype, "cleanup");

        validateFileStub = sinon.stub();
        validateFileStub.returns(true);

        validateFieldStub = sinon.stub();
        validateFieldStub.returns(true);

        multipart = new Multipart(req, {
            validateFile: validateFileStub,
            validateField: validateFieldStub
        });

    });

    afterEach(() => {

        req = multipart = null;
        onFinishSpy.restore();
        cleanupSpy.restore();

    });

    it("Should parse request", function* () {

        let part;

        while (part = yield multipart.form) {

            if (isArray(part)) {    // field
                assert.equal(part.length, 4);
            }
            else {
                assert.instanceOf(part, Stream);
                part.resume();
            }
        }

        assert.isTrue(onFinishSpy.calledOnce);
        assert.isTrue(cleanupSpy.calledOnce);

    });

    it("Should validate file", function* () {
        let part;

        while (part = yield multipart.form) {
            if (isArray(part)) {
                // ...
            }
            else {
                part.resume();
            }
        }

        assert.isTrue(multipart.validateFile.calledTwice);

    });

    it("Should throw error if file is not valid", function* () {

        validateFileStub.returns(false);
        let teoBusboy = new Multipart(mockRequest(), {
            validateFile: validateFileStub
        });
        let errCount = 0;

        try {
            let part;
            while (part = yield teoBusboy.form) {
                if (isArray(part)) {
                    // ...
                }
                else {
                    part.resume();
                }
            }
        } catch(err) {
            assert.equal(err.message, "File is not valid");
            errCount++;
        }

        assert.isTrue(validateFileStub.called);
        assert.equal(validateFileStub.args[0].length, 5);
        assert.equal(errCount, 1);

    });

});

function mockRequest() {
    let stream = new Stream.PassThrough();

    stream.headers = {
        'content-type': 'multipart/form-data; boundary=---------------------------paZqsnEHRufoShdX6fh0lUhXBP4k'
    };

    stream.end([
        '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
        'Content-Disposition: form-data; name="file_name_0"',
        '',
        'super alpha file',
        '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
        'Content-Disposition: form-data; name="file_name_1"',
        '',
        'super beta file',
        '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
        'Content-Disposition: form-data; name="upload_file_0"; filename="1k_a.dat"',
        'Content-Type: application/octet-stream',
        '',
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
        'Content-Disposition: form-data; name="upload_file_1"; filename="1k_b.dat"',
        'Content-Type: application/octet-stream',
        '',
        'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k--'
        ].join('\r\n')
    );

    return stream;
}