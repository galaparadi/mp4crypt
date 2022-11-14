require('dotenv').config()
const { createReadStream, createWriteStream } = require('fs');
const { createCipheriv, randomBytes, createHash } = require('crypto')
const { join } = require('path');
const secret = Buffer.from(process.env.secret);
const iv = Buffer.from(process.env.iv);

createReadStream(join(__dirname, process.argv[2]))
    .pipe(createCipheriv('aes-192-cbc', createHash('sha256')
        .update(String(secret))
        .digest('base64')
        .substring(0, 24), iv))
    .pipe(createWriteStream(join(__dirname, process.argv[3])))