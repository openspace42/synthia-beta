var IModule = require(process.env["SYNTHIA_DIR"]+"/lib/core/IModule");
var Synthia = require(process.env["SYNTHIA_DIR"]+"/synthia");
var synthiaSpownProcess = require(process.env["SYNTHIA_DIR"]+"/lib/process/synthiaSpownProcess")

var linuxUser =(()=>{

    var _ = new WeakMap();

    class linuxUser extends IModule{
        /**
         * 
         * @param {Synthia} synthia 
         * @param {*} appendto 
         */
        constructor(synthia,appendto=synthia){
            super(synthia,appendto);
            _.set(this,{
                synthia:synthia,
                /**
                 * 
                 * @param {String} name 
                 * @returns {String}
                 */
                commandExec:(name,params)=>{
                    var p = new synthiaSpownProcess(_.get(this).synthia, name,params,true,{},()=>{});
                    var ret="";
                    p.stdout.on("data",data=>ret+=data.toString());
                    p.startSync()
                    return ret;
                }
            })
        }

        getUsers(){
            return _.get(this).commandExec("cut",["-d:","-f1","/etc/passwd"]).split("\r\n").filter(n => n);
        }
        

        init() {this.init = undefined;}
        exit() {this.exit = undefined;}
    }

    linuxUser.prototype.name=(()=>{ return "linuxUser" })()

    return linuxUser;
})();

module.exports=linuxUser;