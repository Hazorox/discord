const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/level");
const canvacord = require("canvacord");
const calcXP = require("../../utils/calcXP");
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.editReply("This command can only be used in servers.", {
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply();
    const targetUser =
      interaction.options.get("target-user")?.value || interaction.user.id;
    // const targetUserId=targetUser.id||interaction.user.id
    const targetMember = await interaction.guild.members.fetch(targetUser);
    const fetchedLevel = await Level.findOne({
      userId: targetMember.id,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      await interaction.editReply(
        targetMember
          ? `${targetMember.user.displayName} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
      if (targetMember.user.bot) {
        await interaction.editReply(
          "This user doesnt have any levels because they are a bot"
        );
      }
      return;
    }

    const allLevels = await Level.find({
      guildId: interaction.guild.id,
    }).select("-_id userId level xp");

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });
    let currentRank = allLevels.findIndex(
      (lvl) => lvl.userId === targetMember.id
    );
    try {
      status=targetMember.presence.status
    } catch (err) {
      status="offline"
    }
    const rank = new canvacord.Rank()
      .setAvatar(targetMember.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank + 1)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calcXP(fetchedLevel.level))
      .setStatus(status || "online")
      .setProgressBar("#FFC300", "COLOR")
      .setUsername(targetMember.user.username)
      .setDiscriminator(targetMember.user.discriminator);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },
  name: "level",
  description: "Shows your or someone's level.",
  permissionsRequired: ["SendMessages"],
  botPermissions: ["SendMessages"],
  options: [
    {
      name: "target-user",
      description: "The user you want to see the level of.",
      type: ApplicationCommandOptionType.Mentionable,
      required: false,
    },
  ],
};
