const { Client, Interaction, SlashCommandBuilder, AttachmentBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Level = require("../../models/level");
const canvacord = require("canvacord");
const calcXP = require("../../utils/calcXP");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your or someone's level.")
    .addMentionableOption(option => 
      option.setName("target-user")
        .setDescription("The user you want to see the level of.")
        .setRequired(false)
    ),
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

    await interaction.deferReply();

    const targetUser = interaction.options.getMentionable("target-user") || interaction.user;
    const targetMember = await interaction.guild.members.fetch(targetUser.id);
    const fetchedLevel = await Level.findOne({
      userId: targetMember.id,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      if (targetMember.user.bot) {
        await interaction.editReply("This user doesn't have any levels because they are a bot.");
      } else {
        await interaction.editReply(
          `${targetMember.user.displayName} doesn't have any levels yet. Try again when they chat a little more.`
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

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetMember.id);
    const status = targetMember.presence?.status || "offline";
    const rank = new canvacord.Rank()
      .setAvatar(targetMember.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank + 1)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calcXP(fetchedLevel.level))
      .setStatus(status)
      .setProgressBar("#FFC300", "COLOR")
      .setUsername(targetMember.user.username)
      .setDiscriminator(targetMember.user.discriminator);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data, { name: "rank.png" });
    await interaction.editReply({ files: [attachment] });
  }
};
