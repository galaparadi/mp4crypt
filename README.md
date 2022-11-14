# MP4Crypt
MP4 encrypt-decrypt tools with some features : 
* encrypt from file or readable stream source
* decrypt from file or readable stream source
* perform partial decrypt

Beside from MP4, another types of file are supported. Especially if partial decryption are needed.

## Instalation
Make sure Node.js already installed
```
node -v
v16.14.2
```

Open your terminal or `CMD` and type the following
```bat
git clone blah blah blah
cd mp4crypt
npm link
```

after instalation, go to your working directory, and type the following
```bat
cd <your work directory>
npm link mp4crypt
```

## Usage

### Encrypt file
```js
const { encrypt } = require('mp4crypt');
const { createWriteableStream } = require('fs');

const sourcePath = "<your file location>";
const secret = "<your secret key>";
const destinationPath = "<your destination file location>"

encrypt({sourcePath, secret})
    .pipe(createWriteStream(destinationPath);
```

### Encrypt file from readable stream
```js
const { encryptStream } = require('mp4crypt');
const { createReadableStream } = require('fs')
const { createWriteableStream } = require('fs');

const sourcePath = "<your file location>";
const secret = "<your secret key>";
const destinationPath = "<your destination file location>"
const size = "<filesize>"

createReadableStream(sourcePath)
    .pipe(encryptStream({size, secret}))
    .pipe(createWriteStream(destinationPath);
```
### Decrypt file
```js
const { decrypt, getValidDechiperPositionBlock } = require('mp4crypt');
const { createWriteableStream } = require('fs');

const sourcePath = "<your file location>";
const secret = "<your secret key>";
const destinationPath = "<your destination file location>";
const start = "<your start byte of plain file>";
const end = "<your end byte of plain file>";

decrypt({sourcePath, secret, start, end})
    .pipe(createWriteStream(destinationPath);
```

### Decrypt file from readable stream
FIXME:
```js
const { decrypt, getValidDechiperPositionBlock } = require('mp4crypt');
const { createReadbleStream, createWriteableStream } = require('fs');

const sourcePath = "<your file location>";
const secret = "<your secret key>";
const destinationPath = "<your destination file location>";
const [start, end] = getValidDechiperPositionBlock(startByte, endByte);

createReadableStream(sourcePath, {start, end})
    .pipe()
decrypt({sourcePath, secret, start, end})
    .pipe(createWriteStream(destinationPath);
```
## API
### `encrypt({sourcePath: String, destinationPath: String, secret: String}): stream.Writeable`
params : 
* sourcePath : jfkfjkj
### decrypt: stream.Writeable
### encryptStream: stream.Duplex
### decryptStream: stream.Duplex

## License
[MIT](https://www.google.com/)

## Author
[galaparadi](https://github.com/galaparadi/)
