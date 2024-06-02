const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const roles = [
  {
    id: "1246757045626077205",
    label: "BALUEEE",
  },
  {
    id: "1246757115352059935",
    label: "YALLOW",
  },
  {
    id: "1246757278556753931",
    label: "BURBLE",
  },
  {
    id: "1246756945478684693",
    label: "RAD",
  },
];

client.login(process.env.TOKEN);
client.once("ready", async (c) => {
    try {
      const channel = await client.channels.cache.get("1203741443991277690");
      if (!channel) return;
  
      const row = new ActionRowBuilder();
      roles.forEach((role) => {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.label)
            .setStyle(ButtonStyle.Secondary)
        );
      });
  
      await channel.send({
        content: 'Claim your RAWL @everyone OwO',
        components: [row],
      });
    } catch (err) {
      console.log(err);
    }
  });
