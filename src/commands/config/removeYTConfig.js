const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  Interaction
} = require("discord.js");
const ytNotifications = require("../../models/ytNotifications");
const data = new SlashCommandBuilder()
  .setName("yt-config-remove")
  .setDMPermission(false)
  .setDescription("Remove a notification setting from a channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("yt-channel-id")
      .setDescription(
        "The ID of the channel you want to remove notifications from"
      )
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("notification-channel")
      .setDescription("The channel you want to remove notifications from")
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      .setRequired(true)
  );
/** @param {Interaction} interaction */
const run = async ({ interaction }) => {
  const targetYTChannel = interaction.options.getString('yt-channel-id')
  const notificationChannel = interaction.options.getChannel(
    "notification-channel"
  ).id;
  await interaction.deferReply({ ephemeral: true });
  const targetConfig = await ytNotifications
    .findOne({
      ytChannelId: targetYTChannel,
      notificationChannelId: notificationChannel,
    })
    .catch((err) => {
      console.error(`error in ${__filename}`, err);
      return;
    });
  if (!targetConfig) {
    await interaction.editReply({
      content: `No configuration found for ${targetYTChannel} on ${notificationChannel}`,
      ephemeral: true,
    });
    return;
  }
  await targetConfig.deleteOne();

  await interaction.editReply({
    content: `Removed notification from ${targetYTChannel} on ${notificationChannel}`,
    ephemeral: true,
  });
};
module.exports = {
  data,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  run,
};
