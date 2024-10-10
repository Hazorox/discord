const Parser = require("rss-parser");
const NotificationConfig = require("../../models/ytNotifications");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
/** @param {import('discord.js').Client} client */
module.exports = async (client) => {
  listenForVideo();
  setInterval(listenForVideo, 5_000);
  async function listenForVideo() {
    const configs = await NotificationConfig.find({});
    console.log(configs);
    configs.forEach(async (config) => {
      try {
        const {
          notificationChannelId,
          ytChannelId,
          customMessage,
          lastCheckedVid,
        } = config;

        const parser = new Parser();
        try {
          let feed = await parser.parseURL(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${ytChannelId}`
          );
          const vid = feed.items[0];
          const vidUrl = vid.link;
          if (vidUrl === lastCheckedVid.url) {
            console.log("Same link spotted. Skipping...");
            return;
          }
          const vidTitle = vid.title;
          const channelUrl = `https://www.youtube.com/channel/${ytChannelId}`;
          const pubDate = vid.pubDate;
          const author = vid.author;
          const targetMessage = customMessage?.replace('{VID_URL}',vidUrl).replace('{VID_TITLE}',vidTitle).replace('{CHANNEL_URL}',channelUrl).replace('{CHANNEL_NAME}',author)
          // console.groupCollapsed(
          //   `%c${new Date().toLocaleTimeString()}`,
          //   "color: #3498db; font-weight: bold"
          // );
          // console.log(`Fetched video URL: ${vidUrl}`);
          // console.log(`Fetched video title: ${vidTitle}`);
          // console.log(`Fetched channel URL: ${channelUrl}`);
          // console.log(`Fetched video pubDate: ${pubDate}`);
          // console.groupEnd();
          
          // const newConfig = new NotificationConfig({
          //   guildId: config.guildId,
          //   notificationChannelId: config.notificationChannelId,
          //   ytChannelId: config.ytChannelId,
          //   customMessage: config.customMessage,
          //   lastChecked: Date.now(),
          //   lastCheckedVid: { url: vidUrl, publishDate: pubDate },
          // });
          // await newConfig.save()
          const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(vidTitle)
            .setDescription(targetMessage)
            .setFooter({ text: `Published on: ${pubDate.slice(0, 10)}` })
            .setAuthor({ name: author })
            .setTimestamp();
          const btn = new ButtonBuilder()
            .setLabel("View Video")
            .setURL(vidUrl)
            .setEmoji("🔗")
            .setStyle(ButtonStyle.Link);
          const btn2 = new ButtonBuilder()
            .setLabel("View Channel")
            .setURL(channelUrl)
            .setEmoji("🔗")
            .setStyle(ButtonStyle.Link);
          const buttons = new ActionRowBuilder().addComponents(btn, btn2);
          const channel = client.channels.cache.get(notificationChannelId);
          await channel.send({
            embeds: [embed],
            components: [buttons],
            ephemeral: false,
          });
          await config.updateOne({
            lastChecked: Date.now(),
            lastCheckedVid: { url: vidUrl, publishDate: pubDate },
          });
          
          console.log(`Checking for new video: ${vidTitle}`);
          console.log(`Last checked video url: ${config.lastCheckedVid.url}`);
          console.log(`Last checked video publish date: ${config.lastCheckedVid.publishDate}`);
          console.log(`New video url: ${vidUrl}`);
          console.log(`New video publish date: ${pubDate}`);

          // await notificationChannelId.send({
          //   embeds: [embed],
          //   components: [buttons],
          //   ephemeral: false,
          // });
        } catch (error) {
          console.error("Error parsing feed:", error);
        }
      } catch (err) {
        console.error(`Error in ${__filename}`, err);
      }
    });
  }
};
