// ispirated by https://github.com/signicode/rw-stream/
var { promisify } = require("util");

var fs = require("fs");
var [open, close, read, write] = [
    promisify(fs.open),
    promisify(fs.close),
    promisify(fs.read),
    promisify(fs.write),
];

var { Readable, Writable } = require("stream");
var logbuff = process.env.DEBUG && process.env.DEBUG.match(/\bsy-pupe-buffer-log\b/);
var logpipe = process.env.DEBUG && process.env.DEBUG.match(/\bsy-pupe-file-log\b/);
var logall = process.env.DEBUG && process.env.DEBUG.match(/\bsy-pupe-all-log\b/);

var log = (level, ...data) => {
    switch (level) {
        case 1:
            if (logbuff||logall) console.log("Synthia pipe LOG ---------------------\n",...data,"\nEND Synthia pipe LOG -----------------");
            break;
        case 2:
            if (logpipe||logall) console.log("Synthia pipe LOG ---------------------\n",...data,"\nEND Synthia pipe LOG -----------------");
            break;
        case 3:
            if (logall) console.log("Synthia pipe LOG ---------------------\n",...data,"\nEND Synthia pipe LOG -----------------");
            break;

        default:
            break;
    }

}

//var log = (...data) => console.error(...data);

module.exports = (async (file, { readStart, writeStart } = {}, cbak) => {
    require("child_process").execSync("mkfifo " + file);
    // fs.writeFileSync(file,"");
    var fd = await open(file, "r+");
    log(2,`File ${file} open`);

    var readIndex = +readStart || 0;
    var writeIndex = +writeStart || 0;

    var _updateReadPosition = () => 0;
    var _readPositonUpdated;
    function advanceReadPosition(pos) {
        var lastReadPromise = _updateReadPosition;
        if (pos > 0) {
            readIndex += pos;
            _readPositonUpdated = new Promise(res => _updateReadPosition = res);
        } else {
            readIndex = Infinity;
        }
        log(3,`Advance read position by ${pos}`);
        lastReadPromise(pos);
    }
    advanceReadPosition(0);
    var rsexitseq = false;
    if (readStart < writeStart) throw new Error("Read index MUST come before write index.");
    var cancelr = () => { };
    var readStream = new Readable({
        async read(size) {
            try {
                if (!rsexitseq) {
                    var ret = Buffer.alloc(size);
                    var { bytesRead } = await read(fd, ret, 0, size, readIndex);
                    log(3,`Read ${bytesRead} from ${readIndex} --` + (bytesRead));
                    advanceReadPosition(bytesRead);

                    if (!bytesRead)
                        return this.push(null);

                    var a = ret.slice(0, bytesRead)
                    log(1,a, "<<--buffer");
                    if (a.equals(new Buffer("\x04\x00")))
                        rsexitseq = true
                    this.push(a);
                }
            } catch (e) {
                log(e);
                this.emit("error", e);
            }
        }
    });

    var _writePromise;
    var writeStream = new Writable({
        writev(chunks, callback) {
            return this._write(
                Buffer.concat(
                    chunks.map(({ chunk, encoding }) => Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding))
                ),
                "binary",
                callback
            );
        },
        write(chunk, encoding, callback) {
            _writePromise = (async () => {
                try {
                    var toWrite = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
                    var currentIndex = 0;
                    while (true) { /* eslint-disable-line no-varant-condition */
                        var maxWrite = Math.min(readIndex - (writeIndex + currentIndex), toWrite.length - currentIndex);
                        if (maxWrite === 0) {
                            log(3,`Awaiting for advance of read position at ${writeIndex + currentIndex} wanting write ${toWrite}`);

                            if (await _readPositonUpdated === 0 && toWrite.length === currentIndex) return;
                            continue;
                        }

                        var { bytesWritten } = await write(fd, toWrite, currentIndex, maxWrite, writeIndex + currentIndex);
                        log(3,`Wrote ${bytesWritten} at ${writeIndex + currentIndex}`);

                        currentIndex += bytesWritten;
                        if (currentIndex === toWrite.length) break;
                    }

                    writeIndex += currentIndex;
                    callback();
                } catch (e) {
                    log(3,e);
                    callback(e);
                }
            })();
        },
        flush(callback) {
            _writePromise
                .then(() => close(fd))
                .then(callback);
        }
    });
    //console.log(cbak)
    cbak(false, {
        fd,
        readStream,
        writeStream,
        destroy: () => {
            log(2,fd + " chiuso")
            readStream.removeAllListeners("data")
            fs.writeSync(fd, new Buffer("\x04\x00"));
            fs.closeSync(fd);
            readStream = undefined
            writeStream = undefined
            require("child_process").execSync("rm " + file);

        }
    });

});
