const listenForYTVideo = () => {

}
module.exports = listenForYTVideo

//Embeds and buttons
/*
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
*/