module.exports=async (client,guilId)=>{
    let applicationCommands;
    if(guilId){
        const guild=await client.guilds.fetch(guilId);
        applicationCommands=await guild.commands
    }else{
        applicationCommands=await client.application.commands
    }
    await applicationCommands.fetch()
    return applicationCommands
}