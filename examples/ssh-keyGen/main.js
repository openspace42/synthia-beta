var syntha = require(process.env["SYNTHIA_DIR"]+"/synthia");
var synthiaSpownProcess = require(process.env["SYNTHIA_DIR"]+"/lib/process/synthiaSpownProcess")
var SyntiaApp = (() => {
	var _ = new WeakMap();
	class SyntiaApp {

		constructor() {
		}

		/**
        * 
        * @param {syntha} app 
        */
		init(app) {
			// import a libraty
			app.AddModule("progExist@ops42", app.process.env.PWD + "/sy-module")
			app.AddModule("linuxUser@ops42", app.process.env.PWD + "/sy-module")
			app.AddModule("net@ops42", app.process.env.PWD + "/sy-module")

			_.set(this,{
				// pipe process and command exec
				commandExec:(command,args)=>{
					var p = new synthiaSpownProcess(app, command,args,true,{},()=>{});
					p.stdout.pipe(process.stdout);
					process.stdin.pipe(p.stdin)
					p.startSync()
					p.stdout.unpipe(process.stdout);
					process.stdin.unpipe(p.stdin)
				}
			})
		}

		/**
		 * 
		 * @param {syntha} app 
		 */
		run(app) {
			// ceck if ssh-keygen is intalled
			if (!app.progExist.exist("ssh-keygen")) {
				app.echo = "Sorry but ssh-keygen was not found in your system.\n\nYou can try installing it with sudo apt-get install ssh-keygen"
			} else {
				// ask a username
				var user = app.prompt({name: 'user',message: 'Select the target user',limit: 10,choices: app.linuxUser.getUsers(),}, "AutoComplete");
				var v_ip = false;
				var ip =null;
				while (!v_ip) {
					// ask a ip address
					ip= app.prompt({type: 'input',name: 'ip',message: 'Select the target IP (empty for null)',});
					if (ip.ip!=""){
					v_ip=app.net.validate_ip(ip.ip)
					if (!v_ip) app.echo="IP not valid, try again";
					}else v_ip=true;
				}

				app.echo = ip.ip!=""?"generating SSH keypair for " + user + " and IP: " + ip.ip:
					"generating SSH keypair for " + user + " without IP ";

				ip.ip!=""?
				_.get(this).commandExec("ssh-keygen",['-t','rsa','-b','8192','-N','"" -f "/root/.ssh/'+user+'" -C "'+ip.ip+'"']):
				_.get(this).commandExec("ssh-keygen",['-t','rsa','-b','8192','-N','"" -f "/root/.ssh/'+user+'"']);
				_.get(this).commandExec("chmod",["600",'"/root/.ssh/'+user+'"']);

				app.echo='Stored SSH keypair files in:  /root/.ssh/'+user+'.pub';
			}
		}

		/**
        * 
        * @param {syntha} app 
        */
		quit(app) {

		}
	}

	return SyntiaApp;
})()

module.exports = SyntiaApp;

