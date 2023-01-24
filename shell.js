const { ChildProcess } = require('child_process');
const inquirer = require('inquirer')
const exec = require('child_process').exec
const spawn = require('child_process').spawn


async function main(){
    let {input} = await inquirer.prompt({
        name : "input",
        message : __dirname + ">"
    })
    commLine = await command(input);
    if(commLine.comm.trim() == ''){
        commLine.comm = 'null';
    }
    if(!(commLine.comm in func)){
        commLine.comm = 'err';
    }
    func[commLine.comm](commLine.args, commLine.bg)
    .then(main())
    .catch(function (error){
        console.log('\x1b[31m' + error + '\x1b[0m');
        main();
    });
    
}

//exit shell with ctrl+p
process.stdin.on('data', data => {
    if (data.toString('hex') == '10'){
        exit();
    }
})


//input parser
function command(input){
    let commLine = input.split(" ");
    let comm = commLine.shift();
    let bg;
    if(commLine[commLine.length-1] == "!"){
        commLine.pop();
        bg = "&";
    }else{
        bg = "";
    }
    let args = commLine;
    return {comm, args, bg};
}

let func = {
    //run a process in the foreground
    open : function(app, bg){
        return new Promise(function(resolve, reject){
            exec(String(app, bg), function(error, stdout, stdin){
                if(error){
                    return reject (error);
                }
            })
        });
    },
    //list running processes 
    ls : function(bg){
        return new Promise(function(resolve, reject){
            exec('ps ax' + String(bg), function(error, stdout, stderr){
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(error){
                    return reject (error); 
                } 
            })
        });
    },
    //kill,pause, resume a process
    bing : function(arg, bg){
        let f;
        let b = true;
        switch (String(arg[0])){
            case "-k":
                f = 'kill -15 ';
                break;
            case "-p":
                f = 'kill -s stop ';
                break;
            case "-c":
                f = 'kill -s cont ';
                break;
            default:
                b = false; 
                break;
        }
        if(b){
            return new Promise(function(resolve, reject){
                exec(f + String(arg[1]) + String(bg), function(error, stdout, stderr){
                    if(stdout){
                        console.log('stdout: ' + stdout);
                    }
                    if(stderr){
                        console.log('stderr: ' + stderr);
                    }
                    if(error){
                        return reject (error); 
                    } 
                })
            });
        } else {
            func.err();
     } 
        
    },
    //detach a process from the terminal 
    keep : function(app, bg){
        return new Promise(function(resolve, reject){
            exec('nohup ' + String(app, bg), function(error, stdout, stderr){
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(stderr){
                    console.log('stderr: ' + stderr);
                }
                if(error){
                    return reject (error); 
                } 
            })
        });
    },
    //display the current directory
    dir : function(){
        return new Promise(function(resolve, reject){
            console.log('\x1b[33m' + __dirname + 'x1b[0m');
        
        })
    },
    //create a new file in the current directory
    new : function(args){
        return new Promise(function(resolve, reject){
            exec('touch ' + String(args), function(error, stdout, stderr){
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(stderr){
                    console.log('stderr: ' + stderr);
                }
                if(error){
                    return reject(error);
                } 
            })
        });
    },
    /*move a file from the current directory
    to the specified directory*/
    move : function(args){
        return new Promise(function(resolve, reject){
            exec('mv ' + String(args[0] + " " +  args[1]), function(error, stdout, stderr){
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(stderr){
                    console.log('stderr: ' + stderr);
                }
                if(error){
                    return reject (error);
                } 
            })
        });
    },
    //remove a file in the current directory
    remove : function(args){
        return new Promise(function(resolve, reject){
            exec('rm ' + String(args[0]), function(error, stdout, stderr){
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(stderr){
                    console.log('stderr: ' + stderr);
                }
                if(error){
                    return reject (error);
                } 
            })
        });
    },
    //if the user don't write anything
    null : function(){
        return new Promise(function(resolve, reject){
            
        })
    },
    //unknown command handler
    err : function(){
        return new Promise(function(resolve, reject){
            error = 'command not found';
            return reject(error);
        })
    }
}

main()
