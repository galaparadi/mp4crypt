const { Transform, pipeline, PassThrough, Duplex } = require('stream');
const { createReadStream, createWriteStream, openSync, closeSync, readSync, statSync } = require('fs');
const { createCipheriv, createDecipheriv, randomBytes, createHash } = require('crypto')
const CHUNK_SIZE = 65536

function _postDechiper(start, end) {
    let chunkSize = 0;
    return new Transform({
        defaultEncoding: 'utf-8',
        transform(chunk, encoding, cb) {
            chunkSize += chunk.length
            let tempChunk = chunk;

            //check if chunk are the first chunk
            if (chunkSize <= CHUNK_SIZE)
                tempChunk = tempChunk.slice(start % 16);

            //check if chunk are the end of stream
            if ((chunk.length < CHUNK_SIZE) && (end % 16 != 0))
                tempChunk = tempChunk.slice(0, -(15 - (end % 16)));

            this.push(tempChunk);
            cb();
        },
        flush(cb) {
            cb();
        }
    })
}

/**
 * Get specific chiper block
 * @param {integer} start - start byte of plain file
 * @param {integer} end - end byte of plain file
 * @returns [] - position of decrypted block
 */
exports.getValidDechiperPositionBlock = function (start, end) {
    const IV_FILE_SIZE_BLOCK_LENGTH = 20;
    const CHIPER_BLOCK_SIZE = 16;
    const CHIPER_BLOCK_OFFSET = 15;

    const blockOfchiper = parseInt(start / CHIPER_BLOCK_SIZE);
    const blockOfEndChiper = parseInt(end / CHIPER_BLOCK_SIZE);
    start = IV_FILE_SIZE_BLOCK_LENGTH + (blockOfchiper * CHIPER_BLOCK_SIZE);
    end = IV_FILE_SIZE_BLOCK_LENGTH + ((blockOfEndChiper * CHIPER_BLOCK_SIZE) + 15);

    return [start, end]
}

/**
 * get iv position start index and end index
 * @param {Number} start start byte of plain file
 * @returns {[]} tupple of iv start index and iv end index
 */
exports.getIvPosition = function (start) {
    const blockOfChiper = parseInt(start / 16);
    if (blockOfChiper > 0) return [
        20 + ((blockOfChiper - 1) * 16),
        (20 + ((blockOfChiper - 1) * 16)) + 15
    ];
    return [4, 19];
}

/**
 * encrypt stream
 * @param {Object} param0 config
 * @param {Number} param0.secret secret key
 * @returns {Stream}
 */
exports.encryptStream = function ({ secret, size }) {
    const pumpify = require('pumpify')
    const iv = randomBytes(16);
    let buffFileSize = Buffer.alloc(4);
    buffFileSize.writeUint32LE(size);
    let postChiperFirstChunk = true;

    let chiperStream = createCipheriv('aes-192-cbc', createHash('sha256')
        .update(String(secret))
        .digest('base64')
        .substring(0, 24), iv)

    const postChiper = new Transform({
        defaultEncoding: 'utf-8',
        transform(chunk, encoding, cb) {
            if (postChiperFirstChunk) {
                this.push(buffFileSize);
                this.push(iv);
                postChiperFirstChunk = !postChiperFirstChunk;
            }

            this.push(chunk);
            cb();
        },
        flush(cb) {
            cb();
        }
    })

    return pumpify(
        chiperStream,
        postChiper,
    )
}

/**
 * 
 * @param {Object} config - Config for decrypting video.
 * @param {integer} config.secret - Encryption key.
 * @param {integer} config.start - start byte of plain video.
 * @param {integer} config.end - end byte of plain video.
 * @param {integer} config.fileSize - plain video file size.
 * @param {integer} config.iv - iv for encrypted video file.
 * @returns {Duplex}
 */
// Before decrypt, make sure the encrypted block is valid
exports.decryptStream = function ({ secret, start, end, iv }) {
    const pumpify = require('pumpify');

    const dechiper = createDecipheriv('aes-192-cbc', createHash('sha256')
        .update(String(secret))
        .digest('base64')
        .substring(0, 24), iv);
    dechiper.setAutoPadding(false);

    const postDechiper = _postDechiper(start, end);

    return pumpify(
        dechiper,
        postDechiper
    );
}

exports.encryp = function ({ sourcePath, secret }) {
    const iv = randomBytes(16);
    let { size } = statSync(sourcePath);
    let buffFileSize = Buffer.alloc(4);

    buffFileSize.writeUint32LE(size);
    let postChiperFirstChunk = true;

    let chiperStream = createReadStream(sourcePath)
        .pipe(createCipheriv('aes-192-cbc', createHash('sha256')
            .update(String(secret))
            .digest('base64')
            .substring(0, 24), iv))

    let destStrewam = new Transform({
        defaultEncoding: 'utf-8',
        transform(chunk, encoding, cb) {
            if (postChiperFirstChunk) {
                this.push(buffFileSize);
                this.push(iv);
                postChiperFirstChunk = !postChiperFirstChunk;
            }
            this.push(chunk);
            cb();
        },
        flush(cb) {
            cb();
        }
    });

    return chiperStream.pipe(destStrewam);
}

exports.decryp = function ({ path, secret, start, end }) {
    //TODO: add error management
    if (!start) start = 0;
    // if(!end) end = 1;
    const blockOfChiper = parseInt(start / 16);
    const blockOfEndChiper = parseInt(end / 16);
    let buffFileSize = Buffer.alloc(4);
    let buffIv = Buffer.alloc(16);

    const fd = openSync(path, 'r');
    readSync(fd, buffFileSize, 0, 4, 0);
    if (blockOfChiper > 0) {
        readSync(fd, buffIv, 0, 16, 20 + ((blockOfChiper - 1) * 16));
    } else {
        readSync(fd, buffIv, 0, 16, 4);
    }
    closeSync(fd);
    let fileSize = buffFileSize.readUint32LE(0);

    const dechiper = createDecipheriv('aes-192-cbc', createHash('sha256')
        .update(String(secret))
        .digest('base64')
        .substring(0, 24), buffIv);
    dechiper.setAutoPadding(false);

    const postDechiper = _postDechiper(start, end);

    const startFile = 20 + (blockOfChiper * 16);
    const endFile = 20 + ((blockOfEndChiper * 16) + 15);
    return createReadStream(path, { start: startFile, end: endFile })
        .pipe(dechiper)
        .pipe(postDechiper)
}
