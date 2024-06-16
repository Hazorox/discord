const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Mutes a member from this server for a limited time.")
    .addMentionableOption(option =>
      option.setName("target-user")
        .setDescription("The user you want to mute.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("duration")
        .setDescription("The time you want the user to be muted for (30m, 1h, 1d).")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("The reason you want to mute the user.")
        .setRequired(false)
    ),
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  run: async ({client, interaction}) => {
    const targetUserId = interaction.options.getMentionable("target-user").id;
    const reason = interaction.options.getString("reason") || "No reason provided";
    const duration = interaction.options.getString("duration");

    await interaction.deferReply();

    try {
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }

      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply("You can't timeout that user because they're the server owner.");
        return;
      }
      const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      const targetUserRolePosition = targetUser.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = botMember.roles.highest.position;
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply("You can't mute that user because they have the same or higher role than you.");
        return;
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply("I can't mute that user because they have the same or higher role than me.");
        return;
      }

      let durationInt = parseInt(duration);
      let durationString = "seconds";

      if (duration.endsWith("d")) {
        durationInt *= 86400;
        durationString = "days";
      } else if (duration.endsWith("h")) {
        durationInt *= 3600;
        durationString = "hours";
      } else if (duration.endsWith("m")) {
        durationInt *= 60;
        durationString = "minutes";
      } else {
        await interaction.editReply("Invalid duration format. Please use the format: 30m, 1h, 1d.");
        return;
      }

      // Mute the targetUser
      await targetUser.timeout({ duration: durationInt * 1000, reason });
      await interaction.editReply(`User ${targetUser.user.tag} was timed out for ${durationInt} ${durationString}.\nReason: ${reason}`);
    } catch (error) {
      console.error(`There was an error when timing out: ${error}`);
      await interaction.editReply("Something went wrong. Could not mute the user.");
    }
  }
};
