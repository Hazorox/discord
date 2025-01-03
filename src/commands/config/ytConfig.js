const ytNotifications = require("../../models/ytNotifications");
const Parser = require("rss-parser");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const data = new SlashCommandBuilder()
  .setName("youtube-notifications-config")
  .setDescription("Configure notifications for a YT channel in your server")
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName("yt-channel-id")
      .setDescription(
        "The ID of the channel you want to receive notifications from"
      )
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("notification-channel")
      .setDescription("The channel you want to send notifications to")
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("custom-message")
      .setDescription(
        "Templates: {VID_URL} {VID_TITLE} {CHANNEL_NAME} {CHANNEL_URL}"
      )
      .setRequired(false)
  );
/**  @param {import('commandkit').SlashCommandProps}  param0 */
const run = async ({ interaction }) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const targetYTChannel = interaction.options.getString("yt-channel-id");
    const notificationChannel = interaction.options.getChannel(
      "notification-channel"
    );
    const customMessage =
      interaction.options.getString("custom-message") ||
      "YOOOOO IT WORKED AMIGO";
    const duplicateExists = await ytNotifications.exists({
      ytChannelId: targetYTChannel,
      notificationChannelId: notificationChannel.id,
    });
    if (duplicateExists) {
      await interaction.followUp({
        content:
          "The YouTube Channel has already been configured for that channel\nRun `/notifcations-remove` first  ",
        ephemeral: true,
      });
      return;
    }
    let parser = new Parser();
    const fetchYouTubeFeed = async () => {
      try {
        let feed = await parser.parseURL(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${targetYTChannel}`
        );
        const vid = feed.items[0];
        const vidUrl = vid.link;
        const pubDate = vid.pubDate;
        const newConfig = new ytNotifications({
          guildId: interaction.guild.id,
          notificationChannelId: notificationChannel.id,
          ytChannelId: targetYTChannel,
          customMessage: customMessage,
          lastChecked: new Date(),
          lastCheckedVid: {
            url: vidUrl,
            publishDate: pubDate,
          },
        });
        await newConfig.save();
        interaction.followUp("Success!");
      } catch (error) {
        console.error("Error parsing feed:", error);
      }
    };

    // Call the function
    fetchYouTubeFeed();
  } catch (err) {
    console.log(`Error in ${__filename} : ${err}`);
  }
};

module.exports = {
  data,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  run,
};
