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

## Licence

The MIT License (MIT)

Copyright (c) 2015 Antyfive

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
