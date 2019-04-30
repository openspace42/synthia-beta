var Synchronizer = require("./lib/asyncblock/asyncblock/asyncblock")
var IModuleImport = require("./lib/dependency/IModuleImport");
var enquirer = require("./lib/enquirer/index");
var Synthia = (() => {
    class Synthia {
        constructor(userApplication, interactive = false) {
            this.process=process;
            this.synchronizer = Synchronizer;
            this.synchronizer.enableTransform(module);
            this.syncLine = null;
            this._prompt=enquirer;
            this._promptC=0;
            this._promptR=null;
            this._userApplivation = new userApplication();
            this._IModuleImport = null;


            //#region INTERACTIVE CODE
            this._isInteractive = interactive;
            this.InteractivePrintDefault = false;
            this.CLIDefPrint = false;
            this.CLIPrompt = ((no_color = false) => {
                return this._CLIPromptDefault(no_color);
            })
            this._CLIPromptDefault = ((no_color = false) => {
                const c = (color, s) => `\x1b[${color}m${s}\x1b[0m`;
                return "[ " + (this.CLIDefPrint ? (no_color ? "✔️" : c(32, "✔️")) : (no_color ? "❌" : c(31, "❌"))) + " ] " +
                    "[ n:" + (no_color ? process.version : c(33, process.version)) + " ] " +
                    (no_color ? "Synthia CLI" : c(32, "Synthia CLI")) + " " +
                    "( b:" + (no_color ? "0.2" : c(33, "0.2")) + " ) >"

                return "Syhtnia >"
            })
            this._iVm = require('vm'),
                require('vm').runInThisContext
            this._isandbox = require('vm').createContext({
                require: require,
                process: process,
                console: console,
                module: module,

                app: this,
                global: global,

            })
            this.CLIPromptOPC = ((spaces, no_color = false) => {
                var r = "";
                //console.log(spaces.buff);
                spaces.buff.forEach(e => {
                    r += (no_color ? "" : "\u001b[38;5;228m") + e + (no_color ? "" : "\u001b[39m") + " ";
                })
                var p = r.split(""); p.pop();
                r = p.join("");
                return (no_color ? "" : "\u001b[1m\u001b[38;5;118m") + "m:" + (no_color ? "" : "\u001b[39m\u001b[0m") + " " + r + "      " + " ".repeat(spaces.subContext)
            });
            this.CLIWelcome = () => {
                var logo = '\n' +
                    '⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⠀⠀⢀⠀⠀⠀⠀⠀⢀⢀⢀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⢀⠀⠀⠀⣷⣤⣀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⢀⠀⠀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⠀⠀⠀⢀⢀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⢀⢀⠀⠀⢀⢀⢀⢀⠀⠀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀⢀' + "\n" +
                    '⢸⣿⣿⣿⣿⣿⣿⣿⣮⣻⣿⣦⣀⠙⠦⣀⠀⠀⠀⠘⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀⣿⣿⣿⣿⣶⣤⣀⢀⠀⠀⠀⠀⠀⣿⣿⣿⡇⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠀⠀⠀⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⣿⣿⣿⣿⠀⠀⠘⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿' + "\n" +
                    '⢸⣿⣿⣿⡿⡿⡿⡿⡿⡿⡮⡻⡿⡦⡀⠙⠦⠀⠀⠀⠘⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⡇⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣀⣀⠀⣿⣿⣿⡇⠀⠸⡿⡿⡿⡿⡿⣿⣿⣿⡿⡿⡿⡿⡿⠟⠁⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⢼⣿⣿⣿⠀⠀⣿⣿⣿⣿⠀⠀⠀⠀⠙⠻⡿⡿⡿⡿⡿⡿⡿⡿⡿⣿⣿⣿⣿' + "\n" +
                    '⢸⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⡆⠀⠀⠀⠈⢿⣿⣿⣿⣶⣶⣶⣶⣶⣶⣶⣾⣿⣿⣿⡇⠀⠐⠿⣿⣿⡟⠻⠿⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠐⠿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢐⠿⣿⣿⡇⠀⠀⢀⣴⣶⣶⣶⣶⣿⣿⣿⣿⠀⠀⠿⣿⣿⣿⠀⠀⣶⣶⣶⣶⣶⣶⣶⣶⣶⣦⣀⠀⠀⠿⣿⣿⣿' + "\n" +
                    '⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠐⣦⣙⠿⡇⠀⠀⠈⠙⠻⠿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠐⣦⣙⠿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣦⣙⠿⣇⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⣷⣝⠿⣿⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⣷⣝⠿⣿' + "\n" +
                    '⢨⣭⣭⣭⣭⣭⣭⣭⣭⣭⣭⣭⣭⣽⣿⣿⣿⡇⠀⠠⣀⠀⠠⣬⣍⠩⣭⣭⣭⣭⣭⣭⣭⣽⣿⣿⣿⡇⠀⠀⠻⣿⣦⡁⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠻⣿⣦⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣦⡉⠉⠉⠉⠉⠉⠉⠉⠉⣻⣿⣿⣿⠀⠀⠙⠿⣷⣝⠀⠀⣿⣿⣿⣿⠉⠉⠉⠉⠉⠉⠉⠉⠉⠙⠿⣷⣍' + "\n" +
                    '⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠈⠢⣀⠙⠿⣷⣌⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠄⠈⠻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠄⠈⠻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠈⠻⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠦⣀⠙⠿⠀⠀⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⣀⠙⠿' + "\n" +
                    '⠘⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠃⠀⠀⠀⠀⠈⠂⠀⠙⠛⠓⠈⠛⠛⠛⠛⠛⠛⠛⠛⠃⠀⠀⠀⠑⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠑⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠛⠛⠀⠀⠀⠙⠦⣀⠀⠀⠛⠛⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠦⣀' + "\n" +
                    "\n";
                const c = (color, s) => `\x1b[${color}m${s}\x1b[0m`;
                const user = c(35, process.env.USER);
                const cwd = c(33, process.cwd());
                const banner = "\n" + logo + "\n\tHello, " + user + "\n\tyou are running " + c(32, "Syntia CLI beta 2.0") + "\n\tYou\'re running in " + cwd + "\n\n" +
                    "\tpress " + c("38;5;202", "Ctrl+Alt+C") + " for exit\n\n";
                const help = "" +
                    "  ╭───────────────────────────────── if true the cli print output to default use (app.CLIDefPrint=true) to set\n" +
                    "  │     ╭─────────────────────────── Node Version\n" +
                    "  │     │                         ╭─ synthia cli version\n" +
                    "  │     │                         │\n"
                process.stdout.write(banner + help);
            }
            this.CLIExit = () => {
                const c = (color, s) => `\x1b[${color}m${s}\x1b[0m`;
                const user = c(35, process.env.USER);
                process.stdout.write("\n\n\tGoodbye, " + user + "\n\n");
            };
            this.CLIRepeatforExit = () => {
                const c = (color, s) => `\x1b[${color}m${s}\x1b[0m`;
                const user = c(33, "Press again ctrl+alt+c for exti 😔");
                process.stdout.write("\n" + user + "\n");
            }
            this._iteraction = {
                buffer: [],
                bufferRow: 0,
                bufferStoric: [],
                iPrint: (() => { return this.InteractivePrintDefault }),
                cursorx: 0,
                cursory: 0,
                ch: 0,
                isExec: false,
            }
            //#endregion 
            process.on("exit", () => {
                this._userApplivation.quit(this);
                this._IModuleImport.exit();
            })
        }

        prompt(arg,type=""){
            this._promptC++;
           /* var r=null;
            this._prompt.prompt(arg).then( this.syncLine.add("q"+this._promptC)).then(answer => {r= answer}).catch(console.error);
            this.syncLine.wait("q"+this._promptC);*/
            if (type.toLowerCase()=="autocomplete"){
                var q = new this._prompt.AutoComplete(arg);
                q.run().then(answer => {this._promptR=answer}).then( this.syncLine.add("q"+this._promptC))
                .catch(console.error);
                this.syncLine.wait("q"+this._promptC);
            }else if (type.toLowerCase()=="snippet"){
                var q = new this._prompt.Snippet(arg);
                q.run().then(answer => {this._promptR=answer}).then( this.syncLine.add("q"+this._promptC))
                .catch(console.error);
                this.syncLine.wait("q"+this._promptC);
            }else{
                this._prompt.prompt(arg)
                .then(answer => {this._promptR=answer}).then( this.syncLine.add("q"+this._promptC))
                .catch(console.error);
                this.syncLine.wait("q"+this._promptC);
            }

            return  this._promptR;
        }

        start() {
            this.synchronizer((line) => {
                this.syncLine = line;
                this._IModuleImport = new IModuleImport(this);
                this._userApplivation.init(this);
                this._IModuleImport.init();
                this._userApplivation.run(this);
                this._isandbox.process = process;
                //#region INTERACTIVE CODE
                if (this._isInteractive) {
                    this._isandbox.app.syncLine = line
                    global.app = this;
                    this.CLIWelcome();
                    this._iteraction.ch = process.stdout.rows;
                    var FixCursor = (() => {
                        process.stdout.write("\u001b\u0038")// + "\u001b[1B".repeat(this._iteraction.cursory));
                        process.stdout.write("\u001b[1A".repeat(this._iteraction.buffer.length - this._iteraction.cursory - 1));
                        var buffer = []
                        for (var ii = 0; ii < this._iteraction.cursory; ii++) {
                            buffer.push(this._iteraction.buffer[ii])
                        }
                        var r = detectOPC(buffer)
                        if (this._iteraction.cursory != 0)
                            process.stdout.write("\u001b[1C".repeat(this.CLIPromptOPC(r, true).length + this._iteraction.cursorx));
                        else
                            process.stdout.write("\u001b[1C".repeat(this.CLIPrompt(true).length + this._iteraction.cursorx));
                    });
                    var cr = () => {
                        if (!this._iteraction.isExec) {
                            if (this._iteraction.ch < process.stdout.rows)
                                process.stdout.write("\u001b[1B".repeat(process.stdout.rows - this._iteraction.ch))
                            process.stdout.write("\u001b[1D".repeat(process.stdout.columns));
                            this._iteraction.ch = process.stdout.rows
                            process.stdout.write("\u001b\u0037");
                        }
                        process.stdout.once('resize', cr);
                    }
                    process.stdout.once('resize', cr);
                    this._iLoop(this.syncLine.add("cliexit"));
                } else
                    process.exit();
                //#endregion

                if (this._isInteractive) {
                    this.syncLine.wait("cliexit");
                }

                //console.log("XXXXXXXXXXXXXXXXXXXXXXXX")
            });
        }
        //#region INTERACTIVE CODE
        _iLoop(cbak) {
            if (this._isinSync==undefined) this._isinSync=false;
            process.stdout.write("\u001b\u0037");
            this._iteraction.isExec = false;
            // var GetCurrentPosition=(()=>{
            // var err=false;
            //  var a = require('child_process').execSync('echo -en "\\e[6n";read  CURPOS;CURPOS=${CURPOS#*[};echo;echo "${CURPOS}"');
            //      console.log(a);
            //});
            //GetCurrentPosition();
            var LastKey = [];
            var detectOPC = ((buffer) => {
                var temp = buffer.join("\n");
                var isOpen = false, strOpen = false, strOpenC = "";
                var contextOpener = [
                    { o: "(", c: ")" }, { o: "{", c: "}" }, { o: "[", c: "]" },
                    { r: /for *\([\d-\D]* in [\d-\D]*\)[ \n]*$/i, c: 1, d: "for" },       // for(var x in y)
                    { r: /for *\([\d-\D]*;[\d-\D]*;[\d-\D]*\)[ \n]*$/i, c: 1, d: "for" }, // for(var i = 0 ; i!=y;t++)
                    { r: /if *\([\d-\D]*\)[ \n]*$/i, c: 1, d: "if" },                     // if (xx==xx)
                ];
                var stringOpen = false;
                var stringOpenC = "";
                var StringOpener = [
                    { o: "\"", c: "\"", skip: ["\\\"", "'", "\\'", "`", "\\`"] },
                    { o: "'", c: "'", skip: ["\\\"", "\"", "\\'", "`", "\\`"] },
                    { o: "`", c: "`", skip: ["\\\"", "\"", "\\'", "'", "\\`"] }
                ]

                var error = "";
                var contextOpened = [];
                var buffer = temp.split("");
                buffer.forEach((c, i) => {
                    if (!stringOpen)
                        contextOpener.forEach(rule => {
                            if (rule.o != undefined)
                                if (c == rule.o)
                                    contextOpened.push(c);
                            //console.log(contextOpener);
                        });
                    if (!stringOpen)
                        StringOpener.forEach(rule => {
                            if (rule.o != undefined)
                                if (c == rule.o) {
                                    stringOpenC = c;
                                    stringOpen = true;
                                }
                        });
                    else
                        StringOpener.forEach(rule => {
                            if (rule.c != undefined && rule.o != undefined)
                                if (c == rule.c && stringOpenC == rule.o) {
                                    if (rule.skip != undefined) {
                                        var fSkip = false;
                                        rule.skip.forEach(e => {
                                            var st = "";
                                            e.split("").forEach((e2, i) => {
                                                st += buffer[i - (e.length + 1)];
                                            })
                                            if (!fSkip && st == e) fSkip = true;
                                        })
                                        if (!fSkip) {
                                            stringOpenC = "";
                                            stringOpen = false;
                                        }
                                    } else {
                                        stringOpenC = "";
                                        stringOpen = false;
                                    }
                                }
                        });
                    if (!stringOpen)
                        contextOpener.forEach(rule => {
                            if (rule.c != undefined)
                                if (c == rule.c)
                                    if (contextOpened[contextOpened.length - 1] == rule.o) {
                                        contextOpened.pop();
                                    } else
                                        error = "you can't close context with " + c + "if you before not open with " + rule.o
                        });


                });
                if (!stringOpen)
                    contextOpener.forEach(rule => {
                        if (rule.r != undefined)
                            if (rule.r.test(temp))
                                contextOpened.push(rule.d)
                    });

                if (stringOpen)
                    contextOpened.push(stringOpenC);
                return { open: contextOpened.length + (stringOpen ? -1 : 0) != 0, subContext: contextOpened.length + (stringOpen ? -1 : 0), error: error, buff: contextOpened }
            });
            var BufferPrint = (() => {
                var colorPattern = [
                    { r: /(["'`])(?:(?=(\\?))\2.)*?\1/sg, b: "\u001b[38;5;211m", a: "\u001b[0m" },
                    { r: /(?:\/\*)((.|[\r\n])*?)(?:\*\/)/s, b: "\u001b[38;5;40m", a: "\u001b[0m" },
                    { r: /(?:\/\/)(.*?)(?:\n|$)/sg, b: "\u001b[38;5;40m", a: "\u001b[0m" }
                ]
                var t = "";

                // (?s)(?=\/\*).*?(?<=\*\/)
                //process.stdout.write("\u001b\u0038" +"\u001bA".repeat(this._iteraction.cursory));
                //process.stdout.write("\u001b\u0038" +"\u001bA".repeat(this._iteraction.buffer.length -this._iteraction.cursory ));
                // process.stdout.write("\u001b\u0038" +"\u001bA".repeat(this._iteraction.buffer.length-1 != this._iteraction.cursory ? this._iteraction.cursory:this._iteraction.buffer.length-1));
                t += ("\u001b\u0038")//+"\u001bA".repeat(this._iteraction.buffer.length));
                if (this._iteraction.buffer.length != 1)
                    t += ("\u001b[1A".repeat(this._iteraction.buffer.length - 1))
                //  if (this._iteraction.buffer.length!=0)
                // process.stdout.write("\u001b\u0038" +"\u001b[1A".repeat(this._iteraction.buffer.length -this._iteraction.cursory ));
                // process.stdout.write("\u001b\u0038" +"\u001b[1B".repeat(this._iteraction.buffer.length-1 != this._iteraction.cursory ? 1:0));
                var r = {};
                var rold = {};

                var ColoredBuffer = this._iteraction.buffer.join("\n");

                colorPattern.forEach(e => {
                    ColoredBuffer = ColoredBuffer.replace(e.r, (d) => {
                        var ret = "";
                        var dd = d.split("\n");
                        dd.forEach((a, i) => {
                            ret += e.b + a + e.a + (i == dd.length - 1 ? "" : "\n")
                        })
                        return ret
                    });
                });

                var ColoredBuffer = ColoredBuffer.split("\n")

                for (var i = 0; i < this._iteraction.buffer.length; i++) {
                    t += ("\u001b[2K");
                    var buffer = []
                    for (var ii = 0; ii < i + 1; ii++) {
                        buffer.push(this._iteraction.buffer[ii])
                    }
                    var r = detectOPC(buffer);
                    if (i == 0) {
                        t += (this.CLIPrompt() + ColoredBuffer[i] + (i + 1 == this._iteraction.buffer.length ? "" : "\n"));
                        var r = detectOPC(buffer);
                        rold = r;
                    } else {

                        t += (this.CLIPromptOPC(rold) + ColoredBuffer[i] + (i + 1 == this._iteraction.buffer.length ? "" : "\n"));
                        rold = r;
                    }
                }



                process.stdout.write(t);
                FixCursor();
            });
            var FixCursor = (() => {
                process.stdout.write("\u001b\u0038")// + "\u001b[1B".repeat(this._iteraction.cursory));
                process.stdout.write("\u001b[1A".repeat(this._iteraction.buffer.length - this._iteraction.cursory - 1));
                var buffer = []
                for (var ii = 0; ii < this._iteraction.cursory; ii++) {
                    buffer.push(this._iteraction.buffer[ii])
                }
                var r = detectOPC(buffer)
                if (this._iteraction.cursory != 0)
                    process.stdout.write("\u001b[1C".repeat(this.CLIPromptOPC(r, true).length + this._iteraction.cursorx));
                else
                    process.stdout.write("\u001b[1C".repeat(this.CLIPrompt(true).length + this._iteraction.cursorx));
            });

            this._iteraction.buffer = [""]
            BufferPrint();
            var reader = (key, skip_r = false) => {
                var skip_r = skip_r;
                this._iteraction.buffer.forEach(e => {
                    e.split("").forEach(c => {
                        //console.log(c.charCodeAt(0).toString(16))
                    })
                    //console.log(e.toString(16))
                })
                key = key.toString();
                var Kkey = key.split("");
                for (let i = 0; i < Kkey.length; i++) {
                    var key = Kkey[i];
                    LastKey.unshift(key);
                    if (LastKey[1] == '\u001b' && LastKey[0] == '\u0003') {
                        // ctrl + c
                        if (this._iteraction.buffer.length - 1 != 0) {
                            //  process.stdout.write("\u001b[1C".repeat((this._iteraction.buffer.length-this._iteraction.cursory)));
                            // process.stdout.write("\n");
                            //  if (this._iteraction.buffer.length-1-this._iteraction.cursory!=0)
                            skip_r = true;
                            process.stdout.write("\n".repeat((this._iteraction.buffer.length - this._iteraction.cursory)))
                            this._iteraction.cursory = 0;
                            this._iteraction.cursorx = 0;
                            this._iteraction.buffer = [""];
                            this._iteraction.bufferRow = 0;
                            this._iLoop(cbak);
                        } else if (LastKey[3] == '\u001b' && LastKey[2] == '\u0003') {
                            this.CLIExit();
                            cbak(false)
                            process.exit();
                        } else {
                            this.CLIRepeatforExit();
                            //process.stdout.write("\nPress again ctrl+alt+c for exti 😔\n");
                        }
                    } else if (
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u005b" && LastKey[0] == "\u0044") ||
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u004f" && LastKey[0] == "\u0044")) {
                        if (this._iteraction.cursorx > 0)
                            this._iteraction.cursorx--;
                        //LEFT
                        //process.stdout.write("left");
                    } else if (
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u005b" && LastKey[0] == "\u0043") ||
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u004f" && LastKey[0] == "\u0043")) {
                        if (this._iteraction.cursorx < this._iteraction.buffer[this._iteraction.cursory].length)
                            this._iteraction.cursorx++;
                        //RIGHT
                        //process.stdout.write("right");
                    } else if (
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u005b" && LastKey[0] == "\u0042") ||
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u004f" && LastKey[0] == "\u0042")) {
                        //DOWN
                        if (this._iteraction.cursory != this._iteraction.buffer.length - 1) {
                            var buffer = []
                            for (var ii = 0; ii < this._iteraction.cursory; ii++) {
                                buffer.push(this._iteraction.buffer[ii])
                            }
                            if (this._iteraction.cursory != 0)
                                var r = this.CLIPromptOPC(detectOPC(buffer), true)
                            else
                                var r = this.CLIPrompt(detectOPC(buffer), true)
                            var buffer = []
                            for (var ii = 0; ii < this._iteraction.cursory + 1; ii++) {
                                buffer.push(this._iteraction.buffer[ii])
                            }
                            if (this._iteraction.cursory + 1 != 0)
                                var r2 = this.CLIPromptOPC(detectOPC(buffer), true)
                            else
                                var r2 = this.CLIPrompt(detectOPC(buffer), true)
                            this._iteraction.cursory++;
                            var dif = r.length - r2.length
                            this._iteraction.cursorx += dif;
                            if (this._iteraction.cursorx > this._iteraction.buffer[this._iteraction.cursory].length)
                                this._iteraction.cursorx = this._iteraction.buffer[this._iteraction.cursory].length
                            if (this._iteraction.cursorx < 0)
                                this._iteraction.cursorx = 0;
                        } else {
                            if (this._iteraction.bufferRow > 0) {
                                process.stdout.write("\u001b\u0038")
                                var s = this._iteraction.buffer.length - 1;
                                process.stdout.write("\u001b[1A\u001b[2K".repeat(s));
                                process.stdout.write("\u001b\u0038")
                                this._iteraction.buffer = [""];
                                this._iteraction.cursory = 0;
                                this._iteraction.cursorx = 0;
                                this._iteraction.bufferRow--;
                                skip_r = true;
                                reader(this._iteraction.bufferStoric[this._iteraction.bufferRow].join("\n"))
                                //process.stdout.write("\u001b\u0037");
                                //this._iteraction.buffer = this._iteraction.bufferStoric[this._iteraction.bufferRow];
                                /*this._iteraction.cursory=this._iteraction.buffer.length-1;
                                if (this._iteraction.cursorx > this._iteraction.buffer[this._iteraction.cursory].length)
                                this._iteraction.cursorx = this._iteraction.buffer[this._iteraction.cursory].length
                                if (this._iteraction.cursorx < 0)
                                    this._iteraction.cursorx = 0;
                                */
                            } else if (this._iteraction.buffer.join("") != "" && this._iteraction.buffer.length == 1) {
                                this._iteraction.bufferRow = 0;
                                process.stdout.write("\n")
                                this._iteraction.buffer = [""];
                                this._iteraction.cursory = 0;
                                this._iteraction.cursorx = 0;
                            }
                        }
                        //process.stdout.write("down");
                    } else if (
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u005b" && LastKey[0] == "\u0041") ||
                        (LastKey[2] == "\u001b" && LastKey[1] == "\u004f" && LastKey[0] == "\u0041")) {
                        //UP
                        if (this._iteraction.cursory > 0) {
                            var buffer = []
                            for (var ii = 0; ii < this._iteraction.cursory; ii++) {
                                buffer.push(this._iteraction.buffer[ii])
                            }
                            if (this._iteraction.cursory != 0)
                                var r = this.CLIPromptOPC(detectOPC(buffer), true)
                            else
                                var r = this.CLIPrompt(detectOPC(buffer), true)
                            var buffer = []
                            for (var ii = 0; ii < this._iteraction.cursory - 1; ii++) {
                                buffer.push(this._iteraction.buffer[ii])
                            }
                            if (this._iteraction.cursory - 1 != 0)
                                var r2 = this.CLIPromptOPC(detectOPC(buffer), true)
                            else
                                var r2 = this.CLIPrompt(detectOPC(buffer), true)
                            this._iteraction.cursory--;
                            var dif = r.length - r2.length
                            this._iteraction.cursorx += dif;
                            if (this._iteraction.cursorx > this._iteraction.buffer[this._iteraction.cursory].length)
                                this._iteraction.cursorx = this._iteraction.buffer[this._iteraction.cursory].length
                            if (this._iteraction.cursorx < 0)
                                this._iteraction.cursorx = 0;

                        } else {
                            if (this._iteraction.bufferRow < this._iteraction.bufferStoric.length) {
                                process.stdout.write("\u001b\u0038")
                                var s = this._iteraction.buffer.length - 1;
                                process.stdout.write("\u001b[1A\u001b[2K".repeat(s));
                                process.stdout.write("\u001b\u0038")
                                // process.stdout.write("\n".repeat(this._iteraction.bufferStoric[this._iteraction.bufferRow].length-1));
                                //process.stdout.write("\u001b\u0038")
                                this._iteraction.buffer = [""];
                                this._iteraction.cursory = 0;
                                this._iteraction.cursorx = 0;

                                reader(this._iteraction.bufferStoric[this._iteraction.bufferRow].join("\n"), true)
                                if (this._iteraction.bufferRow > 0) {
                                    var sp = s - this._iteraction.bufferStoric[this._iteraction.bufferRow].length - 1;
                                    if (sp < 0) sp = sp * -1;
                                    process.stdout.write("\u001b[1A".repeat(sp))
                                    //process.stdout.write("\u001b\u0037")
                                }
                                process.stdout.write("\u001b\u0037")
                                //BufferPrint();
                                /* if (this._iteraction.bufferRow>1){
                                 var sp =s-this._iteraction.bufferStoric[this._iteraction.bufferRow].length-1;
                                 if (sp<0)sp=sp*-1;
                                 process.stdout.write("\u001b[1A".repeat(sp))
                                 process.stdout.write("\u001b\u0037")
                                 }*/
                                //this._iteraction.buffer=this._iteraction.bufferStoric[this._iteraction.bufferRow];
                                // this._iteraction.cursory=0;
                                // this._iteraction.cursorx=0;
                                //reader(this._iteraction.bufferStoric[this._iteraction.bufferRow].join("\n"),true)
                                //process.stdout.write("\u001b\u0037");
                                //this._iteraction.buffer = this._iteraction.bufferStoric[this._iteraction.bufferRow];
                                this._iteraction.bufferRow++;
                                /*this._iteraction.cursory=this._iteraction.buffer.length-1;
                                if (this._iteraction.cursorx > this._iteraction.buffer[this._iteraction.cursory].length)
                                this._iteraction.cursorx = this._iteraction.buffer[this._iteraction.cursory].length
                                if (this._iteraction.cursorx < 0)
                                    this._iteraction.cursorx = 0;
                                */
                            }
                        }
                        //process.stdout.write("up");
                    } else if (
                        (LastKey[0] == "\u007F") || (LastKey[0] == "\u0008")) {
                        //DEL
                        if (this._iteraction.cursorx > 0) {
                            this._iteraction.buffer[this._iteraction.cursory] =
                                this._iteraction.buffer[this._iteraction.cursory].substr(0, this._iteraction.cursorx - 1) +
                                this._iteraction.buffer[this._iteraction.cursory].substr(this._iteraction.cursorx)
                            this._iteraction.cursorx--;
                        }
                        //process.stdout.write("del");
                    } else if (
                        (LastKey[3] == "\u001b" && LastKey[2] == "\u005b" && LastKey[1] == "\u0033" && LastKey[0] == "\u007e")) {
                        //CANC
                        if (this._iteraction.cursorx < this._iteraction.buffer[this._iteraction.cursory].length) {
                            this._iteraction.buffer[this._iteraction.cursory] =
                                this._iteraction.buffer[this._iteraction.cursory].substr(0, this._iteraction.cursorx) +
                                this._iteraction.buffer[this._iteraction.cursory].substr(this._iteraction.cursorx + 1)
                            //this._iteraction.cursorx--;
                        }
                        //process.stdout.write("canc");
                    } else if (LastKey[0] == "\u000a" || LastKey[0] == "\u000d") {
                        // \n
                        var r = detectOPC(this._iteraction.buffer)
                        if (!r.open) {
                            this.synchronizer((linebis) => {
                                this._isinSync=true;
                                var t = this.syncLine;
                                this.syncLine = linebis;
                                process.stdin.setRawMode(false);
                                process.stdin.pause();
                                process.stdout.write("\u001b[1B".repeat(this._iteraction.buffer.length - this._iteraction.cursory));
                                process.stdout.write("\n")
                                skip_r = true;
                                this._iteraction.cursory = 0
                                this._iteraction.cursorx = 0;
                                this._iteraction.isExec = true;
                                try {

                                    var result = this._iVm.runInContext(this._iteraction.buffer.join("\n"), this._isandbox);
                                    if (this.CLIDefPrint) {
                                        console.log(result);
                                    }

                                } catch (e) {
                                    process.stdout.write("[ Synthia CLI VM ]\x1b[31m Error => " + e + "\x1b[0m\n");
                                }
                                
                                this._iteraction.bufferStoric.unshift(this._iteraction.buffer);
                                this._iteraction.bufferRow = 0;
                                this.syncLine = t;
                                this._iLoop(cbak);
                                BufferPrint();
                                this._isinSync=false;
                            })
                        } else {
                            process.stdout.write("\u001b[1B".repeat(this._iteraction.buffer.length - this._iteraction.cursory))
                            process.stdout.write("\n");
                            process.stdout.write("\u001b\u0038");
                            process.stdout.write("\u001b[1B")
                            process.stdout.write("\u001b\u0037");
                            this._iteraction.cursory++;
                            this._iteraction.buffer.splice(this._iteraction.cursory, 0, this._iteraction.buffer[this._iteraction.cursory - 1].substr(this._iteraction.cursorx));
                            this._iteraction.buffer[this._iteraction.cursory - 1] = this._iteraction.buffer[this._iteraction.cursory - 1].substr(0, this._iteraction.cursorx)
                            //this._iteraction.buffer.insert(this._iteraction.cursory, "");
                            //this._iteraction.buffer.push("");
                            this._iteraction.cursorx = 0;
                        }
                        //process.stdout.write("enter");
                    } else if ((LastKey[0] > '\u001F' && LastKey[0] < '\u007F') &&
                        (LastKey[1] != "\u001b") &&
                        !(LastKey[2] == "\u001b" && LastKey[1] == "\u005b" && LastKey[0] == "\u0033")) {
                        // printable
                        this._iteraction.buffer[this._iteraction.cursory] =
                            this._iteraction.buffer[this._iteraction.cursory].substr(0, this._iteraction.cursorx) +
                            key + this._iteraction.buffer[this._iteraction.cursory].substr(this._iteraction.cursorx)
                        this._iteraction.cursorx++;
                        //process.stdout.write("pintable");
                    }
                }
                if (!this._isinSync)
                BufferPrint();
                if (!skip_r)
                    process.stdin.once('data', reader);
            }
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.once('data', reader);
        }
        //#endregion
        /**
         * you can import a module with this istruction
         * 
         * @param {string} string 
         */
        AddModule(string, path = null) {
            //console.log(path);
            this.ModuleImporter.add(string, path);
        }

        get os() {
            var osvar = process.platform;

            if (osvar == 'darwin') {
                return "MACOS"
            } else if (osvar == 'win32') {
                return "WINOS"
            } else {
                return "UNIXOS"
            }
        }
        set echo(v) {console.log(v);}
    } (
        Synthia.prototype.IsInteractive = (() => { return Synthia._isInteractive; }))()
    return Synthia;
})();
module.exports = Synthia;
