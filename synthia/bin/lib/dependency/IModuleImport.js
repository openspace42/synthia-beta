var IModule = require("./../core/IModule");
var Synthia = require("./../../synthia");
var fs = require('fs');
var path = require('path')
const listFolders = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())
var syConf = require("./../core/syConf");

var IModuleImport = (() => {

    var _ = new WeakMap();

    class IModuleImport extends IModule {

        constructor(synthia,appendto=synthia) {
            super(synthia, synthia, "ModuleImporter");
            _.set(this, {
                modules: [],
                synthia: synthia,
                appendto:appendto
            })
        }

        add(name, path = null) {
            var paths = [];
            if (path != null) {

                if (fs.existsSync(path + "/sy-conf.json")) {
                    paths.push(path)
                } else {
                    var list=listFolders(path);
                    //console.log(list);
                    list.forEach(p => {
                        if (fs.existsSync(path+"/"+p+"/sy-conf.json"))
                            paths.push(path+"/"+p)
                    });
                }
            }
            paths.forEach(p=>{
                var conf=syConf.byFile(p+"/sy-conf.json");
                if (conf.search.includes(name)){
                    if (conf.type=="module"){
                        // is module
                        var proto = require(p+"/"+conf.mainFile)
                        if (proto.prototype instanceof IModule){
                            _.get(this).modules.push(new proto(_.get(this).synthia,_.get(this).appendto));
                        }else{
                            throw "Sorry but a module "+proto.toString()+" isn't istance of IModule";
                        }
                        
                    }
                }
               // console.log(conf);
            })
            //console.log(paths);
        }

        init() {
            this.init = undefined;
            _.get(this).modules.forEach(m=>m.init())
        }
        exit() { 
            this.exit = undefined;
            _.get(this).modules.forEach(m=>m.exit())
         }
    }

    IModuleImport.prototype.name = (() => { return "IModule" })()

    return IModuleImport;
})();

module.exports = IModuleImport;