// const AutoRoles = require("../../models/autoRoles");

// const {
//   Client,
//   Interaction,
//   ApplicationCommandOptionType,
//   PermissionFlagsBits,
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
//     try {
//       await interaction.deferReply();
//       const roleId = interaction.options.getRole("role").value;
//       const autoRole = await AutoRoles.findOne({
//         guildId: interaction.guild.id,
//         //   roleId: roleId
//       });

//       if (autoRole) {
//         if (autoRole.roleId === roleId) {
//           interaction.editReply(
//             "Auto role has already been configured for that role. To disable run `/autorole-disable`"
//           );
//           return;
//         }

//         autoRole.roleId = roleId;
//       } else {
//         autoRole = new AutoRoles({
//           guildId: interaction.guild.id,
//           roleId: roleId,
//         });
//       }

//       await autoRole.save();
//       interaction.editReply(
//         "Autorole has now been configured. To disable run `/autorole-disable`"
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   name: "autorole-configure",
//   description: "Configure your auto-role for this server.",
//   options: [
//     {
//       name: "role",
//       description: "The role you want users to get on join.",
//       type: ApplicationCommandOptionType.Role,
//       required: true,
//     },
//   ],
//   permissionsRequired: [PermissionFlagsBits.Administrator],
//   botPermissions: [PermissionFlagsBits.ManageRoles],
// };
// const AutoRoles = require("../../models/autoRoles");

// const {
//   Client,
//   Interaction,
//   ApplicationCommandOptionType,
//   PermissionFlagsBits,
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
//     try {
//       await interaction.deferReply();
//       const roleId = interaction.options.getRole("role").value;
//       const autoRole = await AutoRoles.findOne({
//         guildId: interaction.guild.id,
//         //   roleId: roleId
//       });

//       if (autoRole) {
//         if (autoRole.roleId === roleId) {
//           interaction.editReply(
//             "Auto role has already been configured for that role. To disable run `/autorole-disable`"
//           );
//           return;
//         }

//         autoRole.roleId = roleId;
//       } else {
//         autoRole = new AutoRole({
//           guildId: interaction.guild.id,
//           roleId: roleId,
//         });
//       }

//       await autoRole.save();
//       interaction.editReply(
//         "Autorole has now been configured. To disable run `/autorole-disable`"
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   name: "autorole-configure",
//   description: "Configure your auto-role for this server.",
//   options: [
//     {
//       name: "role",
//       description: "The role you want users to get on join.",
//       type: ApplicationCommandOptionType.Role,
//       required: true,
//     },
//   ],
//   permissionsRequired: [PermissionFlagsBits.Administrator],
//   botPermissions: [PermissionFlagsBits.ManageRoles],
// };
const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const AutoRoles = require("../../models/autoRoles");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole-configure")
    .setDescription("Configure your auto-role for this server.")
    .addRoleOption(option => 
      option.setName("role")
        .setDescription("The role you want users to get on join.")
        .setRequired(true)
    ),
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

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
      const roleId = interaction.options.getRole("role").id;
      let autoRole = await AutoRoles.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        if (autoRole.roleId === roleId) {
          await interaction.editReply("Auto role has already been configured for that role. To disable, run `/autorole-disable`.");
          return;
        }
        autoRole.roleId = roleId;
      } else {
        autoRole = new AutoRoles({
          guildId: interaction.guild.id,
          roleId: roleId,
        });
      }

      await autoRole.save();
      await interaction.editReply("Autorole has now been configured. To disable, run `/autorole-disable`.");
    } catch (err) {
      console.error("Error executing autorole-configure command: ", err);
      await interaction.editReply("An error occurred while configuring the autorole.");
    }
  }
};
