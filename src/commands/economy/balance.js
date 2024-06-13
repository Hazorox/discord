const User = require("../../models/user");
const { Client, Interaction, ApplicationCommandOptionType } = require("discord.js");
// // module.exports = {
// //   /**
// //    *
// //    * @param {Client} client
// //    * @param {Interaction} interaction
// //    */
// //   callback: async (client, interaction) => {
// //     if (!interaction.inGuild()) {
// //       interaction.reply({
// //         content: "This command can only be used in servers.",
// //         ephemeral: true,
// //       });
// //       return;
// //     }
// //     await interaction.deferReply();
// //     const targetUser =
// //      await interaction.options.get("target-user")?.value || interaction.user.id;
// //     // const targetUserId=targetUser.id||interaction.user.id
// //     const targetMember = await interaction.guild.members.fetch(targetUser);
// //     const fetchedBalance = await User.findOne({
// //       userId: targetMember.id,
// //       guildId: interaction.guild.id,
// //     });
// //     if (!fetchedBalance) {
// //         await interaction.editReply(
// //           targetMember
// //             ? `${targetMember.user.displayName} doesn't have any coins yet.Tell them to claim their daily!`
// //             : "You don't have any coins yet. Chat a little more and try again."
// //         );
// //         if (targetMember.user.bot) {
// //           await interaction.editReply(
// //             "This user doesnt have any coins because they are a bot"
// //           );
// //         }
// //         return;
// //       }else{
// //         await interaction.editReply(`**${targetMember.user.tag}** has ${fetchedBalance.balance} coins.`)
// //       }
// //   },
// //   name: "balance",
// //   description: "Check a user's balance",
// //   options: [
// //     {
// //       name: "target-user  ",
// //       description: "Check a user's balance",
// //       type: ApplicationCommandOptionType.Mentionable,
// //       required: false,
// //     },
// //   ],
// // };
// const User = require("../../models/user");
// const {
//   Client,
//   Interaction,
//   ApplicationCommandOptionType,
// } = require("discord.js");

// module.exports = {
//   /**
//    *
//    * @param {Client} client
//    * @param {Interaction} interaction
//    */
//   callback: async (client, interaction) => {
//     if (!interaction.inGuild()) {
//       interaction.reply({
//         content: "This command can only be used in servers.",
//         ephemeral: true,
//       });
//       return;
//     }

//     await interaction.deferReply();

//     const targetUser =
//       interaction.options.getUser("target-user") || interaction.user;
//     const targetUserId = targetUser.id;

//     try {
//       const targetMember = await interaction.guild.members.fetch(targetUserId);
//       const fetchedBalance = await User.findOne({
//         userId: targetUserId,
//         guildId: interaction.guild.id,
//       });

//       if (!fetchedBalance) {
//         if (targetMember.user.bot) {
//           await interaction.editReply(
//             "This user doesn't have any coins because they are a bot."
//           );
//         } else {
//           await interaction.editReply(
//             `${targetMember.displayName} doesn't have any coins yet. Tell them to claim their daily!`
//           );
//         }
//       } else {
//         await interaction.editReply(
//           `**${targetMember.user.tag}** has ${fetchedBalance.balance} coins.`
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       await interaction.editReply(
//         "An error occurred while fetching the user's balance."
//       );
//     }
//   },

//   name: "balance",
//   description: "Check a user's balance",
//   options: [
//     {
//       name: "target-user",
//       description: "Check a user's balance",
//       type: ApplicationCommandOptionType.Mentionable,
//       required: false,
//     },
//   ],
// };
const { SlashCommandBuilder  } = require('discord.js');

const User = require("../../models/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check a user\'s balance')
    .addMentionableOption(option =>
      option.setName('target-user')
        .setDescription('Check a user\'s balance')
        .setRequired(false)
    ),
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "This command can only be used in servers.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const targetUser = interaction.options.getMentionable('target-user') || interaction.user;
    const targetUserId = targetUser.id;

    try {
      const targetMember = await interaction.guild.members.fetch(targetUserId);
      const fetchedBalance = await User.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id,
      });

      if (!fetchedBalance) {
        if (targetMember.user.bot) {
          await interaction.editReply(
            "This user doesn't have any coins because they are a bot."
          );
        } else {
          await interaction.editReply(
            `${targetMember.displayName} doesn't have any coins yet. Tell them to claim their daily`
          );
        }
      } else {
        await interaction.editReply(
          `**${targetMember.user.tag}** has ${fetchedBalance.balance} coins.`
        );
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "An error occurred while fetching the user's balance."
      );
    }
  },
};