const { expect } = require('chai');
const { encryp, decryp } = require('../src/transf');
const { join } = require('path');
const { createReadStream, statSync } = require('fs');
const secret = 'aaa';

describe("encrypt mp4", () => {
    it("should has filesize byte", function (done) {
        const sourcePath = join(__dirname, './sample_1080p.mp4')
        let { size } = statSync(sourcePath);
        let firstChunk = true;

        const encrypt = encryp({ sourcePath, secret });
        encrypt.on('data', (chunk) => {
            if (firstChunk) {
                firstChunk = false;
                expect(chunk.readUint32LE(0)).eq(size);
                done()
            }
        });
    })
})

describe("encrypt mp4 stream", () => {
    xit("should has filesize byte", function (done) {
        const sourcePath = join(__dirname, './sample_1080p.mp4')
        let { size } = statSync(sourcePath);
        let firstChunk = true;

        const decrypt = decryp({ path: './decrypt', secret, start: 0, end: size - 1 })
        encrypt.on('data', (chunk) => {
            if (firstChunk) {
                firstChunk = false;
                expect(chunk.readUint32LE(0)).eq(size);
                done()
            }
        });
    })

    xit("should has iv byte", function () {

    })
})
