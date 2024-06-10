const {Client,Interaction, ApplicationCommandOptionType, PermissionFlagsBits, Message}=require('discord.js');
const {Configuration,OpenAIApi}=require('openai');
require('dotenv/config')

module.exports={
    name:'ask',
    description:'Ask COT about anything "limited time" ',
    options:[
        {
            name:'question',
            description:'Your Question ',
            type:ApplicationCommandOptionType.String,
            required:true
        },{
            name:'private',
            description:'Reply privately',
            type:ApplicationCommandOptionType.Boolean,
        }
        
    ],permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages],
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (interaction.user.bot) return;
        // if(interaction.channelId!==process.env.CHANNEL_ID) return;
        
        await interaction.deferReply();

        const config=new Configuration({
            apiKey:process.env.API_KEY
        })
        const openAi=new OpenAIApi(config)
        let conversationLog = [
            { role: 'system', content: 'You are a friendly chatbot.' },
          ];
          conversationLog.push({ role: 'user', content: interaction.options.getString('question') });
          const result = await openAi.createChatCompletion({
              model: 'gpt-3.5-turbo',
              messages: conversationLog
          })
          private=interaction.options.getBoolean('private')
          if(private){
            await interaction.user.send(result.data.choices[0].message.content)
          }else{
            await interaction.editReply(result.data.choices[0].message.content)
          }
       
    },
}