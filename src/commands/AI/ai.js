const { Client, SlashCommandBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription('Ask COT about anything "limited time"')
    .addStringOption(option => 
      option.setName("question")
        .setDescription("Your Question")
        .setRequired(true)
    )
    .addBooleanOption(option => 
      option.setName("private")
        .setDescription("Reply privately")
        .setRequired(false)
    ),
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  run: async ({client, interaction}) => {
    // If the user is a bot, return nothin
    if (interaction.user.bot) return;
    // This line prints thinking...
    await interaction.deferReply();
    // Importing the new gemini service with my secret key :P 
    // env is a folder of secret keys not to be shared on github
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Getting the question the user inputs
    const prompt = interaction.options.getString("question");

    try {
      // asking gemini to answer the question
      const result = await model.generateContent(prompt);
      const response = await result.response;
      // getting text of response
      const text = response.text();
      // since discord max is 2k characters per message..
      // I ask gemini to make it shorter

      // I also made an option that the answer will be sent privately
      const private = interaction.options.getBoolean("private") || false;
      if (text.length > 2000) {
        await interaction.editReply("Result too long. Please try again with a shorter question.");
        return;
      }

      if (private) {
        await interaction.user.send(text);
        await interaction.deleteReply();
      } else {
        await interaction.editReply(text);
      }
    } catch (err) {
      console.error("Error generating response: ", err);
      await interaction.editReply("An error occurred while generating the response.");
    }
  }// Tada :D
};
