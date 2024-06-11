const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
// const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv/config");

module.exports = {
  name: "ask",
  description: 'Ask COT about anything "limited time" ',
  options: [
    {
      name: "question",
      description: "Your Question ",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "private",
      description: "Reply privately",
      type: ApplicationCommandOptionType.Boolean,
      default: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (interaction.user.bot) return;
    // if(interaction.channelId!==process.env.CHANNEL_ID) return;

    await interaction.deferReply();

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = interaction.options.getString("question");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    private = interaction.options.getBoolean("private");
    if(text.length > 2000) {
      await interaction.editReply("Result too long. Please try again with a shorter question.");
      return;
    }
    if (private) {
      await interaction.user.send(text);
    } else {
      await interaction.editReply(text);
    }
  },
};
