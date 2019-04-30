var IModule = require(process.env["SYNTHIA_DIR"]+"/lib/core/IModule");
var Synthia =  require(process.env["SYNTHIA_DIR"]+"/synthia");
var synthiaSpownProcess =  require(process.env["SYNTHIA_DIR"]+"/lib/process/synthiaSpownProcess")

var net =(()=>{

    var _ = new WeakMap();

    class net extends IModule{
        /**
         * 
         * @param {Synthia} synthia 
         * @param {*} appendto 
         */
        constructor(synthia,appendto=synthia){
            super(synthia,appendto);
            _.set(this,{
                synthia:synthia,
                commandExec:(prog,args)=>{
                    var p = new synthiaSpownProcess(_.get(this).synthia, prog,args,false,{},()=>{});
                    var ret="";
                    p.stdout.on("data",data=>ret+=data.toString());
                    p.startSync()
                    return ret;
                }
            })
        }

        get_public_ipv4(){
            return _.get(this).commandExec("curl",["-s","http://whatismyip.akamai.com/"]);
        }
        /**
         * 
         * @param {String} ip 
         * @param {Number} version 
         */
        validate_ip(ip,version=4){
            ip=ip.split("\n").join("").split("\r").join();
            if (version!=4 && version!=6)
                throw "[Module net] => validate_ip(ip,version), a version paramiter can be is only 4 or 6"
            if (typeof ip !== 'string' && !(ip instanceof String))
                throw "[Module net] => validate_ip(ip,version), a ip paramiter can be is only a string"
            if (version==4) return ( /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$\b/.test(ip)) 
            else return ( /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/s.test(ip))
        }
        
        validate_domain(domain,top_level_only=false){
            if (typeof domain !== 'string' && !(domain instanceof String))
                throw "[Module net] => validate_domain(domain,top_level_only), a domain paramiter can be is only a String"
            if (typeof domain !== 'boolean' && !(domain instanceof Boolean))
                throw "[Module net] => validate_domain(domain,top_level_only), a top_level_only paramiter can be is only a Boolean"
            if(top_level_only)
                return ( /(?=^.{4,253}$)(^(?:[a-zA-Z0-9](?:(?:[a-zA-Z0-9\-]){0,61}[a-zA-Z0-9])?\.)[a-zA-Z]{2,})$/g.test(domain)) 
            else 
                return ( /(?=^.{4,253}$)(^(?:[a-zA-Z0-9](?:(?:[a-zA-Z0-9\-]){0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/g.test(domain)) 
        }


        init() {this.init = undefined;}
        exit() {this.exit = undefined;}
    }

    net.prototype.name=(()=>{ return "net" })()

    return net;
})();

module.exports=net;