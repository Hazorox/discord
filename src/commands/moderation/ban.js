const { SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from this server.")
    .addMentionableOption(option =>
      option.setName("target-user")
        .setDescription("The user you want to ban.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("The reason you want to ban.")
        .setRequired(false)
    ),
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

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
        await interaction.editReply("You can't ban that user because they're the server owner.");
        return;
      }
      const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      const targetUserRolePosition = member.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = botMember.roles.highest.position;

      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply("You can't ban that user because they have the same or higher role than you.");
        return;
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply("I can't ban that user because they have the same or higher role than me.");
        return;
      }

      // Ban the targetUser
      await targetUser.ban({ reason });
      await interaction.editReply(`User ${targetUser.user.tag} was banned.\nReason: ${reason}`);
    } catch (error) {
      console.error(`There was an error when banning: ${error}`);
      await interaction.editReply("There was an error when banning the user.");
    }
  }
};
