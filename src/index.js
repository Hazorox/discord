const {Client,IntentsBitField}=require('discord.js')
require('dotenv').config()
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.login(
  process.env.TOKEN
);
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`)
});


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
      case 'hello':
          // Code to execute for the 'hello' command
          await interaction.reply('Hello World!');
          break;
      case 'ping':
          // Code to execute for the 'ping' command
          await interaction.reply('pong 🏓');
          break;
      case 'addition':
          // Code to execute for the 'addition' command
          const firstNumber = interaction.options.getNumber('first_number');
          const secondNumber = interaction.options.getNumber('second_number');
          await interaction.reply(String(firstNumber + secondNumber));
          break;
      default:
          // Default case if the command name doesn't match any specific case
          await interaction.reply('Unknown command');
          break;
  }
});

client.on('messageCreate', function(message) {
    if (message.content.toUpperCase() === 'SON' &&  (message.author.bot==false)   ) {
        message.reply('Father?');
    }
});
