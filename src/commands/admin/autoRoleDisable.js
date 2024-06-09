const {
  Client,
  InteractionCollector,
  PermissionFlagsBits,
  Interaction,
} = require("discord.js");
const AutoRoles = require("../../models/autoRoles");

module.exports = {
  name: "autorole-disable",
  // deleted: true,
  description: "Disable auto role for this server.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   *
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be used in servers.",
        ephemeral: true,
      });
      return;
    }
    try {
      await interaction.deferReply();
      if (!(await AutoRoles.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply("Auto role is not configured for this server.");
        return;
      }
      await AutoRoles.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply("Auto role has now been disabled.");
      return;
    } catch (err) {
      console.log(err);
    }
  },
};
