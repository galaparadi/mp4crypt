const { encryp, decryp, encryptStream, decryptStream, getValidDechiperPositionBlock, getIvPosition } = require('./src/transf')

exports.middleware = {
    encrypt() { },
    decrypt() { },
}

exports.encrypt = ({ sourcePath, destinationPath, secret }) => {
    return encryp({ sourcePath, destinationPath, secret });
}

exports.decrypt = ({ path, secret, start = 0, end }) => {
    return decryp({ path, secret, start, end })
}

exports.encryptStream = ({ secret, size }) => {
    return encryptStream({ secret, size })
}

exports.decryptStream = ({ secret, start, end, iv }) => {
    return decryptStream({ secret, start, end, iv })
}

exports.getValidDechiperPositionBlock = (start, end) => {
    return getValidDechiperPositionBlock(start, end)
}

/**
 * get iv position start index and end index
 * @param {Number} start start byte of plain file
 * @returns {[]} tupple of iv start index and iv end index
 */
exports.getIvPosition = (start) => {
    return getIvPosition(start);
}