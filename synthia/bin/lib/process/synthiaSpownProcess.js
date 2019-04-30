var synthia = require("./../../synthia");
var synthiaStdio = require("./../IO/synthiaStdio");
var { WriteStream, ReadStream } = require("fs");
var SyntiaUid = require("../core/SyntiaUid")
const EventEmitter = require('events');
var synthiaSpownProcess = (() => {

    var _ = new WeakMap();
    class synthiaSpownProcess  {
        /**
         * 
         * @param {synthia} synthia 
         * @param {string} process 
         * @param {String[]} paramiters 
         * @param {boolean} tty 
         * @param {*} options 
         * @param {Function} callback 
         */
        constructor(synthia, process, paramiters, tty = false, options = {}, callback=()=>{}) {

            /*script -qfec '' */
            if (tty){
                paramiters=["-qfec",process+" "+paramiters.join(" ")];
                process = "script";
            }
            var SIO = new synthiaStdio(synthia);
            if (options.stdio == undefined) {
                options.stdio = [SIO.stdin, SIO.stdout, SIO.stderr];
            }
            _.set(this, {
                synthia: synthia,
                process: process,
                paramiters: paramiters,
                tty: tty,
                options: options,
                callback: callback,
                stdio: SIO,
                stdin: SIO.stdin,
                stdout: SIO.stdout,
                stderr: SIO.stderr,
                running:false,
                UID:SyntiaUid(2,"proc")
            })
        }

        /**
         * @returns {WritableStream}
         */
        get stdin() {
            return _.get(this).stdin;
        }

        /**
         * @returns {ReadableStream}
         */
        get stdout() {
            return _.get(this).stdout;
        }

        /**
         * @returns {ReadableStream}
         */
        get stderr() {
            return _.get(this).stderr;
        }

        /**
         * @returns {boolean}
         */
        get isRunned(){
            return _.get(this).running;
        }
        
        /**
         * @returns {null|number}                                   : if null the proces not is tunned, use *.start() to run;
         */
        get exitCode(){ 
            if (this.isRunned)
                return _.get(this).synthia.syncLine.get(this.UID+"ExCode").code;
            else 
                return null;
        }

        /**
         * @returns {string}
         */
        get UID(){
            return _.get(this).UID;
        }

        start() {
            _.get(this).running=true;
            const process = require('child_process').spawn(
                _.get(this).process,  _.get(this).paramiters,  _.get(this).options 
            ).on("error",(...e)=>{
               console.log(e)
            })
            process.on('close',(code)=>{
                _.get(this).stdio.destroy();
                this.stdin.destroy();
                this.stderr.destroy();
                this.stdout.destroy();
                _.get(this).synthia.syncLine.set(this.UID+"ExCode")(false,{code:code});
                _.get(this).callback(false);
            })
        }
        startSync(){
            this.start();
            return this.exitCode;
        }
    }
    return synthiaSpownProcess;
})();
module.exports = synthiaSpownProcess;