require('dotenv').config()
const { createReadStream, createWriteStream, openSync, readSync, statSync } = require('fs');
const { createDecipheriv, randomBytes, createHash, createCipheriv } = require('crypto')
const { join } = require('path');
const { tra, decryp, encryp, getIvPosition, encryptStream, decryptStream, getValidDechiperPositionBlock } = require('./src/transf');

/**
 * TODO:
 * make custom chiper stream that : 
 * 1. add file size
 * 2. add iv
 * 
 */

console.log(encryptStream({secret:'dudung',size:10}).constructor.name)
return;

function encryptMerge() {
    let { size: fileSize } = statSync(join(__dirname, 'src/sample_1080p.mp4'))
    let buffFileSize = Buffer.alloc(4);
    buffFileSize.writeUint32LE(fileSize);

    let mergeBin = createWriteStream(join(__dirname, 'merge'));
    mergeBin.write(buffFileSize);
    mergeBin.write(randomBytes(16))

    createReadStream(join(__dirname, 'note.txt')).pipe(mergeBin);
}

function decrypt() {
    let chiperStream = createReadStream(join(__dirname, 'merge'));
    //readsync filesize and iv
    //slice chunk if first chunk
}

let startByte = 25167
let endByte = 754166
// let endByte = 10891926
let { size } = statSync(join(__dirname, 'sample-discord.mp4'))

const [start, end] = getValidDechiperPositionBlock(startByte, endByte);
const fileStream = createReadStream(join(__dirname, 'envid2'), { start, end });
const fd = openSync(join(__dirname, 'envid2'), 'r');
const iv = Buffer.alloc(16);
const [ivStart, _] = getIvPosition(startByte);
readSync(fd, iv, 0, 16, ivStart);

fileStream
    .pipe(decryptStream({ secret: "dudungmamat", start: startByte, end: endByte, iv }))
    .pipe(createWriteStream(join(__dirname, 'vid2.mp4')))

// createReadStream(join(__dirname, 'sample-discord.mp4'))
//     .pipe(strem)
//     .pipe(createWriteStream(join(__dirname, 'envid2')))

// encryp({ sourcePath: join(__dirname, 'sample-discord.mp4'), destinationPath: join(__dirname, 'envid'), secret: "dudungmmamat" });
decryptStream({ path: join(__dirname, 'envid2'), dest: "vid2.mp4", secret: "dudungmamat", start: startByte, end: endByte })
    .pipe(createWriteStream(join(__dirname, 'vid2.mp4')))   