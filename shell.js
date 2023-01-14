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
    keep : function(app, bg){
        exec('nohup ' + String(app+bg) , function(error, stdout, stderr){
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
    null : function(){
        main();
    },
    err : function(){
        console.log('Error : Command not found');
        main();
    }
}

main()