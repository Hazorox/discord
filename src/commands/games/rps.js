const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  ActionRow,
} = require("discord.js");
const timeout = require("../moderation/timeout");
const choices = [
  {
    name: "rock",
    emoji: "🪨",
    beats: "scissors",
  },
  {
    name: "scissors",
    emoji: "✂",
    beats: "paper",
  },
  {
    name: "paper",
    emoji: "📄",
    beats: "rock",
  },
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play Rock Paper Scissors a friend!")
    .setDMPermission(false)
    .addMentionableOption((option) =>
      option
        .setName("target-user")
        .setDescription("The user you want to play with!.")
        .setRequired(true)
    ),

  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  devOnly: true,
  /**
   *
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction }) => {
    try {
      const target = interaction.options.getMentionable("target-user").user;
      const user = interaction.user;
      if (target.bot) {
        await interaction.reply({
          content: "You can't play with bots!",
          ephemeral: true,
        });
        return;
      }
      if (target.id === user.id) {
        await interaction.reply({ content: "So Lonely?", ephemeral: true });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor("#46377a")
        .setTitle("Rock Paper Scissors")
        .setDescription(`It's currently ${target}'s turn.`)
        .setTimestamp(new Date());

      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setCustomId(choice.name)
          .setEmoji(choice.emoji)
          .setLabel(choice.name)
          .setStyle("Primary");
      });
      const row = new ActionRowBuilder().addComponents(buttons);
      const reply = await interaction.reply({
        content: `${target} ,you have been challenged to a rock paper scissors by ${interaction.user}`,
        embeds: [embed],
        components: [row],
      });
      const targetInteraction = await reply
        .awaitMessageComponent({
          timeout: 30000,
          filter: (i) => i.user.id === target.id,
        })
        .catch(async (err) => {
          embed.setDescription(`Game Over. ${target} didn't respond`);
          await reply.edit({ embeds: [embed], components: [] });
          return;
        });
        if (!targetInteraction) return;
        const targetUserChoice = choices.find(
            (choice)=>choice.name === targetInteraction.customId
        )
        await targetInteraction.reply({
            content:`You picked ${targetUserChoice.name}${targetUserChoice.emoji}`,
            ephemeral:true
        }
        )
        embed.setDescription(`It's currently ${interaction.user}'s turn.`);
        await reply.edit({content:`${interaction.user}, it's your turn now to play.`,ephemeral:true,embeds:[embed]})
        const mainUserInteraction = await reply
        .awaitMessageComponent({
          timeout: 30_000,
          filter: (i) => i.user.id === interaction.user.id,
        })
        .catch(async (err) => {
          embed.setDescription(`Game Over. ${interaction.user} didn't respond`);
          await reply.edit({ embeds: [embed], components: [] });
          return;
        });
        if (!mainUserInteraction) return;
        const mainUserChoice = choices.find(
            (choice)=>choice.name === mainUserInteraction.customId
        )
        await mainUserInteraction.reply({
            content:`You picked ${mainUserChoice.name}${mainUserChoice.emoji}`,
            ephemeral:true
        }
        )
        let result;
        if(targetUserChoice.beats===mainUserChoice.name){
            result=`${targetUser} Wins!`
        }
        if(targetUserChoice.name===mainUserChoice.beats){
            result=`${interaction.user} Wins!`
        }
        if(targetUserChoice.name===mainUserChoice.name){
            result=`It's a tie!`
        }
        embed.setDescription(`${targetUser} picked ${targetUserChoice.name+targetUserChoice.emoji}\n${interaction.user} picked ${mainUserChoice.name+mainUserChoice.emoji}\n\n${result}`)
        reply.edit({embeds:[embed],components:[]})
    } catch (error) {
      console.log(`error with /rps ${error}`);
      console.error(error);
      await interaction.editReply("An Error Occured :/");
      return;
    }
  },
};
