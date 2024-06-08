const {ActivityType}=require("discord.js")
module.exports = (client,arg) => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity(" You", { type: ActivityType.Watching });
    const generalChannel = client.channels.cache.find(channel => channel.name === "general");
    // if (generalChannel) {
    //   generalChannel.send("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDVmMXg5aTB0bWlkMWJrYzEwZWJ0YnBrMzRyMHY4M3NjN2Y5ajU5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3V0lsGtTMSB5YNgc/giphy.gif");
    // } else {
    //   console.log("The general channel hehehe.");
    // }
  }

