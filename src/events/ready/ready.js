const {ActivityType}=require("discord.js")
module.exports = (client,arg) => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity(" You", { type: ActivityType.Watching });
    // const user = client.users.cache.get("747177875236454550"); // Replace with the user's ID
    // if (user) {
    //   user.send(`Happy Eid Bud🎊🎊🎉🎉\nhttps://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXRtZGZteDV1OG96OW10OWhid2JuZ3oxYTQ3bG1wYzczaW42ejIyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TE6ac6InwlRY9gCG0m/giphy.gif\nFrom Hamza and His Son "Cot"`);
    // } else {
    //   console.error("User not found");
    // }
    // const generalChannel = client.channels.cache.find(channel => channel.name==="general");
    // const generalChannel = client.channels.cache.get("1215744779779047456");
    // if (generalChannel) {
      // generalChannel.send("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDVmMXg5aTB0bWlkMWJrYzEwZWJ0YnBrMzRyMHY4M3NjN2Y5ajU5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3V0lsGtTMSB5YNgc/giphy.gif");
    // generalChannel.send(`Happy Eid All My Fellas\nhttps://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXRtZGZteDV1OG96OW10OWhid2JuZ3oxYTQ3bG1wYzczaW42ejIyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TE6ac6InwlRY9gCG0m/giphy.gif\nFrom Hamza and His Son "Cot"\n@everyone`)
    // } else {
    //   console.log("The general channel hehehe.");
    // }
    
  } 

