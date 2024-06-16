const User = require("../../models/user");
const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const dailyAmount = Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward"),
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  run: async ({client, interaction}) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "This command can only be used in servers.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          await interaction.editReply("You have already collected your dailies today. Come back tomorrow!");
          return;
        }

        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      await interaction.editReply({
        content: `You have claimed ${dailyAmount} coins!\nYour new balance is ${user.balance}`,
        ephemeral: true,
      });
    } catch (err) {
      console.error("Error claiming daily reward: ", err);
      await interaction.editReply("An error occurred while claiming your daily reward.");
    }
  }
};
