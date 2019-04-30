var Synthia = require("../../synthia");
var SyntiaUid = require("../core/SyntiaUid")
var fs = require("fs");


var SynthiaPipe = (() => {

    var _ = new WeakMap()

    class SynthiaPipe {
        /**
         * 
         * @param {Synthia} synthia                     : a synthia istrnce
         * @param {string} filename                     : name of file
         * @param {int} type                            : 0 in, 1 out, 2 duplex
         */
        constructor(synthia, filename = SyntiaUid(4, "pipe"), type = 0, tempdir = "/tmp/synthia/", callback = synthia.syncLine.add()) {
            if (filename == undefined || filename == null) filename = SyntiaUid(4, "pipe");
            if (tempdir == undefined || tempdir == null) filename = "/tmp/synthia/";
            _.set(this, {
                synthia: synthia,
                filename: filename,
                type: type,
                callback: callback
            })
            require("child_process").execSync("mkfifo " + tempdir + filename);
            var fd = fs.openSync(tempdir + filename, "r+");
            var s = null;
            if (type == 0)
                s = new fs.createWriteStream(tempdir + filename, { fd: fd });
            else
                s = new fs.createReadStream(tempdir + filename, { fd: fd });
            this.Stream = s;

            this.Stream.fd = fd;
            this.destroy = () => {
                if (!this.isColsed) {
                    this.isColsed = true;

                    s.on("erro", error => {
                        console.log(error)
                    })
                    s.on("close", () => {
                        //fs.closeSync(fd);
                        this.isColsed = true;
                    })
                    if (type == 1) {
                        s.removeAllListeners("data");
                        s.on("data", data => {
                            if (data == "\x04\x00") {
                                s.destroy();
                            }
                        })
                        fs.writeSync(fd, new Buffer("\x04\x00"));
                        require("child_process").execSync("rm -f " + tempdir + filename);
                  
                    }else{
                        s.destroy();
                        require("child_process").execSync("rm -f " + tempdir + filename);
                  
                    }

                }
            }
            //process.once("exit",()=>{this.destroy()});
            callback(false,{
                stream:this.Stream,
                destroy:this.destroy
            });

        }
    }

   
    return SynthiaPipe;


})();

module.exports = SynthiaPipe;