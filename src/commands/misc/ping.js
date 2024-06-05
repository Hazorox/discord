const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'u dont wanna try :3',
  devOnly: false,
  testOnly: true,
  options: [
    {
      name: 'targetUser',
      description: 'try this on ur friend',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'try this on ur friend :)',
      type: ApplicationCommandOptionType.String,
    },
  ],
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  callback: (client, interaction) => {
    interaction.reply('Pong 🏓');
  },
};
