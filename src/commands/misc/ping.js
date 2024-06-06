module.exports = {
  name: 'ping',
  description: 'Pong!',
  // devOnly: Boolean,
  testOnly: true,
  // options: Object[],
  // deleted: Boolean,

  callback:  (client, interaction) => {
    
    // const reply=await interaction.fetchReply()
    // const ping=reply.createdTimestamp-interaction.createdTimestamp
    interaction.reply(`Pong ${ping}!|||| ${client.ws.ping}ms`);
  },
};