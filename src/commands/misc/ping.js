const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the bot ping!"),
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  run: async ({client, interaction}) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
    );
  }
};
