const {Client,Message}=require('discord.js')

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports=async(client,message)=>{
    if(message.author.bot&&message.content.includes('appeared')){
        client.users.send('689105021413228652', 'A COUWNTY BALL APPEARED FATHER GO CATCH IT FAST\nUwU\nhttps://giphy.com/gifs/party-raccoon-racoon-ZJPSFNLmADueHvzoZ8');
    }
    
}