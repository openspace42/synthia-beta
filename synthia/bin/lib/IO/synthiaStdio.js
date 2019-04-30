var Synthia = require("./../../synthia");
var synthiaPipe = require("././synthiaPipe");
var SyntiaUid = require("./../core/SyntiaUid");

var fs = require('fs');

var synthiaStdio = (() => {
    /**
     * Synthia/lib/IO/synthiaStdio
     * @namespace
     */
    class synthiaStdio {
        /**
         * 
         * @param {Synthia} synthia 
         */
        constructor(synthia, callback = synthia.syncLine.add(), async = false) {
            var uid = ""; var folder = "/tmp/synthia/";
            if (!fs.existsSync("/tmp/synthia/"))
                fs.mkdirSync("/tmp/synthia/");
            if (uid == "")
                do {
                    var uid = SyntiaUid(8, "pipe");
                } while (fs.existsSync(folder + uid + ""));
            var file = folder + uid;

            this.stdin = new synthiaPipe(synthia, uid + "_in", 0, folder, !async ? synthia.syncLine.set(uid + "_in") : () => { });
            var in_d = synthia.syncLine.get(uid + "_in").destroy;
            this.stdin = synthia.syncLine.get(uid + "_in").stream;

            this.stdout = new synthiaPipe(synthia, uid + "_out", 1, folder, !async ? synthia.syncLine.set(uid + "_out") : () => { });
            var out_d = synthia.syncLine.get(uid + "_out").destroy;
            this.stdout = synthia.syncLine.get(uid + "_out").stream;

            this.stderr = new synthiaPipe(synthia, uid + "_err", 1, folder, !async ? synthia.syncLine.set(uid + "_err") : () => { });
            var err_d = synthia.syncLine.get(uid + "_err").destroy;
            this.stderr = synthia.syncLine.get(uid + "_err").stream;

            this.destroy = () => {
                in_d();
                out_d();
                err_d();
            }
            callback();
            if (!async) synthia.syncLine.wait();
        }
    }
    return synthiaStdio;

})()

module.exports = synthiaStdio;