
var Synthia = require("./synthia");

var nodeExecDir = process.argv[0];
var SynthiaExecDir = process.argv[1];
var ProgramExecDir = process.argv[2];
var ENV_APPEND = {
    "NODE_DIR": nodeExecDir,
    "SYNTHIA_DIR": SynthiaExecDir.replace("/run.js", ""),
    "SYNTHIA_USER_APPLICATION_MAIN": ProgramExecDir,
}
for (var envp in ENV_APPEND) { process.env[envp] = ENV_APPEND[envp]; }
var args = []
for (var i = process.argv.length - 1; i > 2; i--) {
    args.push(process.argv[i]);
}
interactiveApp = false
args.forEach(e => {
    switch (e) {
        case "-i": case "--interactive": case "--cli": case "--console":
            interactiveApp = true;
            break;
        default:
            if (e.includes("--env_extend=")) {
                e = e.replace("--env_extend=", "")
                try {
                    var je = JSON.parse(e);
                    for (var i in je) {
                        process.env[i] = je[i];
                    }
                } catch (e) { "sorry but --env_extend= apcect only json" }
            } else
                throw "sorry but I do not know the parameter: " + e;
    }
});
var UserApplication = null;

if (ProgramExecDir.charAt(0) == "/")
    UserApplication = ProgramExecDir;
else
    try {
        ProgramExecDir=ProgramExecDir.replace("./","/");
        UserApplication = require("path").resolve(process.env.PWD + ProgramExecDir);
    } catch (e) { throw "sorry but i cant resolve a path: " + process.env.PWD + ProgramExecDir }
try {
    var ProtoUserApplication = require(""+UserApplication);
} catch (e) {
    throw "sorry but i cant find " + UserApplication + " or isnt a synthia program!"+e;
}

var synthia = new Synthia(ProtoUserApplication, interactiveApp);
synthia.start();
module.exports = {
    app: () => {
        return synthia;
    }
};
