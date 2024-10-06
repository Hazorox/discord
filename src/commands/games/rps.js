//TODO: Fix the 'Role not found.' issue
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  
} = require("discord.js");
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
    .addUserOption((option) =>
      option
        .setName("target-user")
        .setDescription("The user you want to play with!.")
        .setRequired(true)
    ),
    

  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  /**
   *
   * @param {Object} param0
   * @param {ChatInputCommandInteraction} param0.interaction
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({ interaction }) => {
    try {
      const target = interaction.options.getUser("target-user");
      const user = interaction.user;
      let targetChoice;
      let userChoice;
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
        .setDescription(`Waiting for both players to choose...`)
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
        content: `${target} ,you have been challenged to a rock paper scissors by ${user}`,
        embeds: [embed],
        components: [row],
      });
      
      const targetCollector =  reply.createMessageComponentCollector({
        time:50_000,
        filter: (i) => i.user.id === target.id,
      })
      // Collect target Choice
      targetCollector.on('collect',async i =>{
         targetChoice = choices.find((choice) => choice.name === i.customId);
        targetCollector.stop()
      })
      targetCollector.on('end',async i=>{
        if(i.size==0){
      embed.setTitle('Game Over')
        .setDescription(`${target} didn't respond :(`)
        .setColor('Grey')
        await interaction.editReply({embeds:[embed],components:[]})
        return;}
      })
      // Collect user choice
      const userCollector =  reply.createMessageComponentCollector({
        time:50_000,
        filter: (i) => i.user.id === user.id,
      })
      userCollector.on('collect',async i =>{
         userChoice = choices.find((choice) => choice.name === i.customId);
        userCollector.stop()
      })
      userCollector.on('end',async i=>{
        if(i.size==0){
      embed.setTitle('Game Over')
      .setDescription(`${user} didn't respond :(`)
      .setColor('Grey')
        await interaction.editReply({embeds:[embed],components:[]})
        return;}
      })
      // Check both choices and evaluate results
      Promise.all([
        new Promise(resolve => targetCollector.on('end', resolve)),
        new Promise(resolve => userCollector.on('end', resolve))
    ]).then(async () => {
        
        if (!targetChoice || !userChoice) {
            embed.setTitle('Game Over')
                .setDescription(`${!targetChoice ? `${target}` : `${user}`} didn't respond :(`)
                .setColor('Grey');
            await interaction.editReply({ embeds: [embed], components: [] });
            return;
        }

        // Evaluate results
        if (userChoice.beats === targetChoice.name) {
            embed.setTitle(`${user.displayName} Won!`)
                .setDescription(`${target} chose ${targetChoice.name} ${targetChoice.emoji}\n${user} chose ${userChoice.name} ${userChoice.emoji}\nGGs :P`)
                .setColor('Green');
        } else if (targetChoice.beats === userChoice.name) {
            embed.setTitle(`${target.displayName} Won!`)
                .setDescription(`${target} chose ${targetChoice.name} ${targetChoice.emoji}\n${user} chose ${userChoice.name} ${userChoice.emoji}\nGGs :P`)
                .setColor('Green');
        } else {
            embed.setTitle('Tie')
                .setDescription(`Both players chose ${targetChoice.name} ${targetChoice.emoji}\nGGs :/`);
        }
        
        await interaction.editReply({ embeds: [embed], components: [] });
    });
    } catch (error) {
      console.log(`error with /rps ${error}`);
      console.error(error);
      await interaction.editReply("An Error Occured :/");
      return;
    }
  },
};
