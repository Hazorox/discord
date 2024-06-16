const path=require("path")
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  // ActivityType,
} = require("discord.js");
// import {CommandHandler} from "djs-commander"
// const {CommandHandler} = require("djs-commander")
const {CommandKit}=require('commandkit')
// const eventHandler = require("./handlers/eventHandler");
require("dotenv").config();
const mongoose = require("mongoose");
(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    // eventHandler(client);
  } catch (err) {
    console.error(err);
  }
})();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
  ],
});

new CommandKit({
  client,
  commandsPath: path.join(__dirname, "commands"),
  eventsPath:path.join(__dirname, "events"),
  devUserIds:['689105021413228652']
  
})

// eventHandler(client);
client.login(process.env.TOKEN);
client.on('guildCreate', (guild) => {
  console.log(`Joined a new server: ${guild.name} (${guild.id})`);
  // eventHandler(client);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    await interaction.deferReply({ ephemeral: true });
    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      interaction.editReply({ content: "Role not found" }); // This should never happen
      return;
    }
    const hasRole = interaction.member.roles.cache.has(role.id);
    if (hasRole) {
      await interaction.member.roles.remove(role.id);
      await interaction.editReply({
        content: `Removed ${role.name}`,
        ephemeral: true,
      });
      return;
    }
    await interaction.member.roles.add(role.id);
    await interaction.editReply({
      content: `Added ${role.name}`,
      ephemeral: true,
    });
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case "hello":
      // Code to execute for the 'hello' command
      await interaction.reply("Hello World!");
      break;

    case "addition":
      // Code to execute for the 'addition' command
      const firstNumber = interaction.options.getNumber("first_number");
      const secondNumber = interaction.options.getNumber("second_number");
      await interaction.reply(String(firstNumber + secondNumber));
      break;

    case "info":
      // Code to execute for the 'info' command

      try {
        const embed = new EmbedBuilder()
          .setTitle("Test Cat")
          .setDescription(
            "Cute Cat that will be gone soon coz I dont need it anymore >:) "
          )
          .setColor("Random")
          .addFields({
            name: "Who are you?",
            value: "Stop Stalking me 😾",
            inline: true,
          });
        await interaction.reply({ embeds: [embed] });
      } catch (err) {
        console.log(err);
      }
      break;
    default:
      break;
  }
});

client.on("messageCreate", function (message) {
  if (
    message.content.toUpperCase().includes("SON") &&
    message.author.bot == false
  ) {
    message.reply("Father?");
  } else if (
    message.content.toUpperCase().includes("CAT") &&
    message.author.bot == false
  ) {
    message.reply("💢💢 Stop Stalking the cute cat 💢💢");
    const embed = new EmbedBuilder()
      .setTitle("Test Cat")
      .setDescription(
        "Cute Cat that will be gone soon coz I dont need it anymore >:) "
      )
      .setColor("Random")
      .addFields({
        name: "Who are you?",
        value: "Stop Stalking me 😾",
        inline: true,
      });
    message.reply({ embeds: [embed] });
  }
});
