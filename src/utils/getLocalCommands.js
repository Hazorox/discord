const path=require('path')
const getAllFiles = require("../utils/getAllFiles");
module.exports=(exceptions)=>{
    let localCommands=[]
    let commandCategories=getAllFiles(path.join(__dirname,'../commands'),true)
    console.log(commandCategories)
    for (const commandCategory of commandCategories) {
        const commandFiles=getAllFiles(commandCategory)
        console.log(commandFiles)
    }
    return localCommands
}