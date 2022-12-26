# MP4Crypt
MP4 encrypt-decrypt tools with some features : 
* encrypt from file or readable stream source
* decrypt from file or readable stream source
* perform partial decrypt

Beside from MP4, another types of file are supported. Especially if partial decryption are needed.

## Instalation
Make sure Node.js and npm already installed
```
node -v
v16.14.2

npm -v
8.5.0
```

Open your terminal or `CMD` and type the following
```bat
git clone https://github.com/galaparadi/mp4crypt.git
cd mp4crypt
npm link
```

after instalation, go to your working directory, and type the following
```bat
npm link mp4crypt
```

## Usage

### Encrypt file
To encrypt a file, you can use the `encrypt` method and pipe it to `fs.createWriteStream`.
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
To encrypt data from readable stream (`stream.Readable`), use `encryptStream` method instead. To use it, pipe `encryptStream` to the plain data's readable stream, and then pipe it to writeable stream to get the encrypted data.
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
To decrypt an encrypted data, start and end byte of the plain data and your secret key must be provided.
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
To decrypt from readable stream, the iv of the encrypted data must be provided.

To get the iv, the position of the iv is required. Use `getIvPosition` method to get the iv. After getting the iv position, use the iv position to get the iv byte from the encrypted data. 
```js
const { decrypt, getValidDechiperPositionBlock, getIvPosition } = require('mp4crypt');
const { createReadbleStream, createWriteableStream, openSync } = require('fs');

const sourcePath = "<your file location>";
const secret = "<your secret key>";
const destinationPath = "<your destination file location>";
const [start, end] = getValidDechiperPositionBlock(startByte, endByte);
const fd = openSync(join(__dirname, sourcePath), 'r');
const iv = Buffer.alloc(16);
const [ivStart, _] = getIvPosition(startByte);
readSync(fd, iv, 0, 16, ivStart);

createReadableStream(sourcePath, {start, end})
    .pipe(decryptStream({secret, start, end, iv}))
    .pipe(createWriteStream(destinationPath);
```
## API
### `encrypt({sourcePath: String, secret: String}): stream.Writeable`
params : 
* sourcePath `<String>` : path location of your plain file
* secret `<String>` : your secret key

return : `<Writeable>`

### `decrypt({path: String, secret: String, start: Number, end: Number}): stream.Writeable`
params : 
* path `<String>` : path location of your encrypted file
* secret `<String>` : your secret key
* start `<Number>` : start byte of plain file
* end `<Number>` : end byte of plain file

return : `<Writeable>`

### `encryptStream({secret: String, size: Number}): stream.Duplex`
params :
* secret `<String>` : your secret key
* size `<Number>` : the size of plain data

return : `<Duplex>`

### `decryptStream({secret: String, start: Number, end: Number, iv: Buffer}): stream.Duplex`
params :
* secret `<String>` : your secret key
* size `<Number>` : the size of plain data
* start `<Number>` : start byte of plain data
* end `<Number>` : end byte of plain data
* iv `<Buffer>` : buffer iv for encrypting data

return : `<Duplex>`

## Contributing
Feel free to contribute on this repository.

## License
[MIT](https://www.google.com/)

## Author
[galaparadi](https://github.com/galaparadi/)
