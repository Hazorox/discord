const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;

    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't timeout that user because they're the server owner."
      );
    }
    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't mute that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't mute that user because they have the same/higher role than me."
      );
      return;
    }
    let duration = interaction.options.get("duration").value;
    let durationInt = parseInt(duration);
    let durationString = "seconds";

    if (duration.includes("d")) {
      durationInt *= 86400;
      durationString = "hours";
    }

    if (duration.includes("h")) {
      durationInt *= 3600;
      durationString = "minutes";
    }

    if (duration.includes("m")) {
      durationInt *= 60;
      durationString = "seconds";
    } else {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply(
        "Invalid duration format. Please use the format: 30m, 1h, 1d."
      );
      return;
    }

    duration = `${durationInt} ${durationString}`;
    try {
      await targetUser.timeout(durationInt, reason);
      await interaction.editReply(
        `User ${targetUser} was timed out for ${duration} .`
      );
    } catch (err) {
      console.log(err);
    }
  },

  name: "timeout",
  description: "Mutes a member from this server for a limited time.",
  options: [
    {
      name: "target-user",
      description: "The user you want to mute.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "The time you want the user to be muted for (30m, 1h, 1d).",
      type: ApplicationCommandOptionType.String,
      required: true,
      // choices:[
      //     {},{},{},{},{},{},{}
      // ]
    },
    {
      name: "reason",
      description: "The reason you want to mute the user.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
