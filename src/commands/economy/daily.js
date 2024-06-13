const User = require("../../models/user");
const { Client, Interaction } = require("discord.js");
const dailyAmount = Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "This command can only be used in servers.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();
      let query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };
      let user =await User.findOne(query);
      //   if (user) {
      //     if (user.lastDaily) {
      //       let now = new Date();
      //       let lastDaily = new Date(user.lastDaily);
      //       let diff = now - lastDaily;
      //       let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      //       if (days < 1) {
      //         interaction.editReply({
      //           content:
      //             "You can only claim your daily reward once every 24 hours.",
      //           ephemeral: true,
      //         });
      //       }
      //     }
      //   }
      if (user) {
        const lastDailyDate = user.lastDaily.toDateString()
        const currentDate = new Date().toDateString()

        if (lastDailyDate === currentDate) {
          await interaction.editReply(
            "You have already collected your dailies today. Come back tomorrow!"
          );
          return;
        }

        user.lastDaily = new Date();
      } else {
        user =await  new User({
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
      console.log(err);
    }
  },
  name: "daily",
  description: "Claim your daily reward",
  permissionsRequired: ["SendMessages"],
  botPermissions: ["SendMessages"],
};
