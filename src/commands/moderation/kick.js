const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a member from this server.")
    .addMentionableOption(option =>
      option.setName("target-user")
        .setDescription("The user you want to kick.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("The reason you want to kick.")
        .setRequired(false)
    ),
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  run: async ({client, interaction}) => {
    const targetUserId = interaction.options.getMentionable("target-user").id;
    const reason = interaction.options.getString("reason") || "No reason provided";

    await interaction.deferReply();

    try {
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }

      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply("You can't kick that user because they're the server owner.");
        return;
      }
      const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      const targetUserRolePosition = targetUser.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = botMember.roles.highest.position;
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply("You can't kick that user because they have the same or higher role than you.");
        return;
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply("I can't kick that user because they have the same or higher role than me.");
        return;
      }

      // Kick the targetUser
      await targetUser.kick(reason);
      await interaction.editReply(`User ${targetUser.user.tag} was kicked.\nReason: ${reason}`);
    } catch (error) {
      console.error(`There was an error when kicking: ${error}`);
      await interaction.editReply("There was an error when kicking the user.");
    }
  }
};
