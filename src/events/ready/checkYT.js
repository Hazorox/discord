const Parser = require("rss-parser");
const ytNotifications = require("../models/ytNotifications");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
/** @param {import('discord.js').Client} client */
module.exports = async (client) => {
  listenForVideo();
  setInterval(listenForVideo, 5000);
  const listenForVideo = async () => {
    const configs = await ytNotifications.find({});
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
            console.log(`VidUrl : ${vidUrl}`);
            console.log(`lastCheckedVidUrl : ${lastCheckedVid.url}`);

            console.log("Same link spotted. Skipping...");
            return;
          }
          const vidTitle = vid.title;
          const channelUrl = `https://www.youtube.com/channel/${ytChannelId}`;
          const pubDate = vid.pubDate;
          const author = vid.author;
          console.groupCollapsed(
            `%c${new Date().toLocaleTimeString()}`,
            "color: #3498db; font-weight: bold"
          );
          console.log(`Fetched video URL: ${vidUrl}`);
          console.log(`Fetched video title: ${vidTitle}`);
          console.log(`Fetched channel URL: ${channelUrl}`);
          console.log(`Fetched video pubDate: ${pubDate}`);
          console.groupEnd();
          const embed = new EmbedBuilder()
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTitle(vidTitle)
            .setDescription(customMessage)
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
          const guild = client.guilds.cache.get(config.guildId);
          const channel = client.channels.cache.get(notificationChannelId);
          await channel.send({
            embeds: [embed],
            components: [buttons],
            ephemeral: false,
          });

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
  };
};
