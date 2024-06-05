const { ApplicationCommandOptionType } = require("discord.js");

const command = {
    name: 'ban',
    description: 'u dont wanna try ',
    options: [
      {
        name: 'target',
        description: 'The user to ban',
        type:ApplicationCommandOptionType.Mentionable,
        required: true,
      },{
        name: 'reason',
        description: 'The reason for banning the user',
        type:ApplicationCommandOptionType.String,

        required: true,
      },
    ],
  };

module.exports = command