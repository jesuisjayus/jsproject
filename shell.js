const inquirer = require('inquirer')
const exec = require('child_process').exec

async function main(){
    let {input} = await inquirer.prompt({
        name : "input",
        message : __dirname + ">"
    })
    commLine = await command(input);
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
        exec(String(app+bg) , (error, stdout, stderr) => {
            if(error){console.log("error : " + error.message);}
            if(stderr){
                console.log("stderr : " + stderr);
                return;
            }
            console.log("stdout : " + stdout);
        });
        main();
    },
    ls : function(bg){
        exec('ps ax' + String(bg), (error, stdout, stderr) => {
            if(error){console.log("error : " + error.message);}
            if(stderr){
                console.log("stderr : " + stderr);
                return;
            }
            console.log("stdout : " + stdout);
        });
        main();
    },
    bing : function(){
        console.log("you type bing");
        main();
    },
    keep : function(){
        console.log("you type keep");
        main();
    }
}

main()