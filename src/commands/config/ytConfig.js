const ytNotifications = require("../../models/ytNotifications");
const notificationConfigSchema = require("../../models/ytNotifications");
const Parser = require("rss-parser");
const {
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    const customMessage = interaction.options.getString("custom-message");
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
        const vidTitle = vid.title;
        const channelUrl = `https://www.youtube.com/channel/${targetYTChannel}`;
        const pubDate = vid.pubDate;
        const author = vid.author
        // if (vid['media:group'] && vid['media:group']['media:thumbnail']) {
        //   console.log(`Thumbnail URL: ${vid['media:group']['media:thumbnail'].$.url}`);
        // }
  
        // // Sometimes, it's also included in 'enclosure' or 'media:content' for other feeds
        // if (vid.enclosure && vid.enclosure.url) {
        //   console.log(`Enclosure URL: ${vid.enclosure.url}`);
        // } 
        console.groupCollapsed(
          `%c${new Date().toLocaleTimeString()}`,
          "color: #3498db; font-weight: bold"
        );
        console.log(`Fetched video URL: ${vidUrl}`);
        console.log(`Fetched video title: ${vidTitle}`);
        console.log(`Fetched channel URL: ${channelUrl}`);
        console.log(`Fetched video pubDate: ${pubDate}`);
        console.groupEnd();
        // Set the Embed with details
        const embed = new EmbedBuilder()
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTitle(vidTitle)
        .setDescription(customMessage||`${author} just dropped a new Video! Check it out!`)
        .setFooter({ text: `Published on: ${pubDate.slice(0,10)}` })
        .setAuthor({ name: author })
        .setTimestamp();
        const btn = new ButtonBuilder()
        .setLabel("View Video")
        .setURL(vidUrl)
        .setEmoji("🔗")
        .setStyle(ButtonStyle.Link)
        const btn2 = new ButtonBuilder()
        .setLabel("View Channel")
        .setURL(channelUrl)
        .setEmoji("🔗")
        .setStyle(ButtonStyle.Link)
        
        const buttons = new ActionRowBuilder().addComponents(btn,btn2)
        await notificationChannel.send({
          embeds: [embed],
          components: [buttons],
          ephemeral:false,
        })
        interaction.followUp('Success!')
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
