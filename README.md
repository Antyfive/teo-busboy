# teo-busboy
Yieldable [Busboy](https://github.com/mscdex/busboy) multipart wrapper.

## Requirements
* Node.js >= 4

## Installation
```bash
$ npm i -S teo-busboy
```
## Usage example
```javascript 
const teoBusboy = require("teo-busboy");
// your middleware
function* (req, res, next) {
    let multipart = new teoBusboy(req);
        part;
  
    while (part = yield multipart.form) {
        // if array, then it's a field
        if (Array.isArray(part)) {
            // work with your field ...  
        }
        else {  // it's a stream
            part.pipe(fs.createWriteStream("myfile"));
        }
    }
  
    // parsing of form is finished
}
```
## Validation example
```javascript
const teoBusboy = require("teo-busboy");
// your middleware
function* (req, res, next) {
    let multipart = new teoBusboy(req, {
            validateFile: function(fieldName, file, fileName, encoding, mimeType) {
                // return boolean 
            },
            validateField: function(fieldName, val, fieldNameTruncated, valTruncated, encoding, mimeType) {
                return true;    // file is valid
            }
        });
    let part;
  
    while (part = yield multipart.form) {
        // if array, then it's a field
        if (Array.isArray(part)) {
            // work with your field ...  
        }
        else {  // it's a stream
            part.pipe(fs.createWriteStream("myfile"));
        }
    }
  
    // parsing of form is finished
}
```

If validation is not passed, the error will be thrown immediately. So please, wrap with `try{} catch() {}` your form parsing.
