var IModule = require(process.env["SYNTHIA_DIR"]+"/lib/core/IModule");
var Synthia = require(process.env["SYNTHIA_DIR"]+"/synthia");
var synthiaSpownProcess = require(process.env["SYNTHIA_DIR"]+"/lib/process/synthiaSpownProcess")

var progExist =(()=>{

    var _ = new WeakMap();

    class progExist extends IModule{
        /**
         * 
         * @param {Synthia} synthia 
         * @param {*} appendto 
         */
        constructor(synthia,appendto=synthia){
            super(synthia,appendto);
            _.set(this,{
                synthia:synthia
            })
        }

        /**
         * 
         * @param {String|Array[String]} names 
         * @returns {Boolean|Array[Boolean]}
         */
        exist(names){
            if (names instanceof String || typeof names == "string"){
                return this._commandExec(names)!="";
            }else if (names instanceof Array){
                var ret=[];
                names.forEach(name => {
                    ret.push(this.exist(name));
                });
                return ret
            }
            throw "[Module progExist] => exist(names), a names paramiter can be is only String | array of String"
        }
        /**
         * 
         * @param {String|Array[String]} names 
         * @returns {String|Array[String]}
         */
        execpath(names){
            //console.log(Array.isArray(names),typeof names === 'string' || names instanceof String,names);
            if (typeof names === 'string' || names instanceof String ){
                return this._commandExec(names).split("\n").join("").split("\r").join("");
            }else if (Array.isArray(names)){
                var ret=[];
                names.forEach(name => {
                    ret.push(this.execpath(name));
                });
                return ret
            }
            throw "[Module progExist] => exist(names), a names paramiter can be is only String | array of String"
        }
        /**
         * 
         * @param {String} name 
         * @returns {String}
         */
        _commandExec(name){
            var p = new synthiaSpownProcess(_.get(this).synthia, "command",["-v",name],true,{},()=>{});
            var ret="";
            p.stdout.on("data",data=>ret+=data.toString());
            p.startSync()
            return ret;
        }
        

        init() {this.init = undefined; /*console.log("progExist init")*/}
        exit() {this.exit = undefined; /*console.log("progExist exit")*/}
    }

    progExist.prototype.name=(()=>{ return "progExist" })()

    return progExist;
})();

module.exports=progExist;