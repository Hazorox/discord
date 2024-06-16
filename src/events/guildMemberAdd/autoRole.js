const { Client, GuildMember } = require('discord.js');
const AutoRoles = require('../../models/autoRoles');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (member , client ) => {
  
  try {
    let guild = member.guild;
    if (!guild) return;

    const autoRole = await AutoRoles.findOne({ guildId: guild.id });
    if (!autoRole) return;

    await member.roles.add(autoRole.roleId);
    console.log('hey')
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};