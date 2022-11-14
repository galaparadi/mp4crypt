require('dotenv').config();
const app = require('express')();
const { decryp } = require('./src/transf');

const enhandler = (req, res) => {
    const fs = require('fs');
    const { join } = require('path');
    const path = `envid`
    const fd = fs.openSync('envid', 'r');
    const bufferFileSize = Buffer.alloc(4);
    fs.readSync(fd, bufferFileSize, 0, 4, 0);
    const fileSize = bufferFileSize.readUint32LE(0);
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1

        if (start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            return
        }

        const chunksize = (end - start) + 1
        const chiperFile = decryp({ path: join(__dirname, path), secret: 'dudungmmamat', start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        chiperFile.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head);
        const chiperFile = decryp({ path: join(__dirname, path), secret: 'dudungmmamat', start: 0, end: fileSize - 1 })
        chiperFile.pipe(res)
    }
}

app.get('/', (req, res) => {
    res.json({ name: 'yes' })
})

app.get('/videosen', enhandler)

app.listen(4000, () => {
    console.log('listening to port 4000')
});