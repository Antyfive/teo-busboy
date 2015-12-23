# teo-busboy
Yieldable [Busboy](https://github.com/mscdex/busboy) multipart wrapper.

## Requirements
* Node.js >= 4

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
