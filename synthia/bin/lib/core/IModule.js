var Synthia = require("../../synthia");
var StatusResult = require("./statusResult");
var IModule=(()=>{
    /**
     * @since 0.2
     * @author Gianfracesco Aurecchia <gianfri@aurecchia.it>
     * @version 1.0
     */
    class IModule{

        /**
         * a standard constructor of same synthia module
         * 
         * @param {Synthia} synthia 
         */
        constructor(synthia, mountObject,namemout=this.name) {
            this._synthia =synthia;
            mountObject[namemout]=this;
        }

        /**
         * a standard inizialization for modules
         * @returns {StatusResult}                      a status
         */
        init(){return new StatusResult(0,"nothing happened")}

        /**
         * a standard exiting for modules
         * @returns {StatusResult}                      a status
         */
        exit(){return new StatusResult(0,"nothing happened")}
    }

    IModule.prototype.name=(()=>{ return "IModule" })()

    return IModule;

})();

module.exports=IModule;