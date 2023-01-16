const inquirer = require('inquirer')
const exec = require('child_process').exec

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
    func[commLine.comm](commLine.args, commLine.bg);
    
}

//exit shell with ctrl+p
process.stdin.on('data', data => {
    if(data.toString('hex') == ''){
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
        exec(String(app+bg) , function(error, stdout, stderr){
            if(stdout){
                console.log('stdout: ' + stdout);
            }
            if(stderr){
                console.log('stderr: ' + stderr);
            }
            if(error){
                console.log('exec error: ' + error);
                main();
            }
        });
        main();
        
    },
    //list running processes 
    ls : function(bg){
        exec('ps ax' + String(bg) , function(error, stdout, stderr){
            if(stdout){
                console.log('stdout: ' + stdout);
            }
            if(stderr){
                console.log('stderr: ' + stderr);
            }
            if(error){
                console.log('exec error: ' + error);
                main();
            }
        });
        main();
    },
    //kill,pause, resume a process
    bing : function(arg, bg){
        let f;
        let b = true;
        switch (String(arg[0])){
            case "-k":
                f = 'kill -s kill ';
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
            exec(f + + String(arg[1]) + String(bg) , function(error, stdout, stderr){
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(stderr){
                    console.log('stderr: ' + stderr);
                }
                if(error){
                    console.log('exec error: ' + error);
                    main();
                }
            });
            main(); 
        } else {
            func.err();
        } 
        
    },
    //detach a process from the terminal 
    keep : function(app, bg){
        exec('nohup ' + String(app+bg) , function(error, stdout, stderr){
            if(stdout){
                console.log('stdout: ' + stdout);
            }
            if(stderr){
                console.log('stderr: ' + stderr);
            }
            if(error){
                console.log('exec error: ' + error);G
                main();
            }
        });
        main();
    },
    //display the current directory
    dir : function(){
        console.log('\x1b[33m' + __dirname +   '\x1b[0m');
        main();
    },
    //create a new file in the current directory
    new : function(args){
        exec('touch ' + String(args) , function(error, stdout, stderr){
            if(stdout){
                console.log('stdout: ' + stdout);
            }
            if(stderr){
                console.log('stderr: ' + stderr);
            }
            if(error){
                console.log('exec error: ' + error);G
                main();
            }
        });
        main();
    },
    /*move a file from the current directory
    to the specified directory*/
    move : function(args){
        exec('mv ' + String(args[0] + " " +  args[1]) , function(error, stdout, stderr){
            if(stdout){
                console.log('stdout: ' + stdout);
            }
            if(stderr){
                console.log('stderr: ' + stderr);
            }
            if(error){
                console.log('exec error: ' + error);
                main();
            }
        });
        main();
    },
    //if the user don't write anything
    null : function(){
        main();
    },
    //unknown command handler
    err : function(){
        console.log('Error : Command not found');
        main();
    }
}

main()