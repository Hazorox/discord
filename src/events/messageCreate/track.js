const { Client, Message } = require('discord.js');
/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (msg, client) => {
    // I totally forgot xd
    // bad try ik
    if (msg.author.bot) return null
    console.log(`${msg.author.username} \n ${msg.content}`)

}
// later :P