
var fs = require('fs');
var syConf=(()=>{

    class syConf{
        constructor(json){
            if (json["module-type"]==undefined) throw "module type is required (module-type)";
            this.type=json["module-type"];
            if (json["module-version"]==undefined) throw "module version is required (module-version)";
            this.version=json["module-version"];
            if (json["module-org"]==undefined) throw "module org is required (module-org)";
            this.org=json["module-org"];
            if (json["module-name"]==undefined) throw "module name is required (module-name)";
            this.name=json["module-name"];
            if (json["mainFile"]==undefined) throw "mainFile is required (mainFile)";
            this.mainFile=json["mainFile"];

            this.search=[];
            this.search.push(this.name);
            this.search.push(this.name+"@"+this.org);
            this.search.push(this.name+"@"+this.org+"#"+this.version);
            this.search.push(this.name+"#"+this.version);
        }
        /**
         * 
         * @param {String} path;
         * @returns {syConf}
         */
        static byFile(path){
            try{
                var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
                var ret=new syConf(obj);
                return ret;
            }catch(e){
                return e;
            }
        }

    }

    return syConf;

})();

module.exports=syConf;