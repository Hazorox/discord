const { REST, Routes,ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'hello',
        description: 'Says hello',
        
    },
    {
        name: 'ping',
        description: 'Pong!',
        
    },
    {
        name:'addition',
        description:'Adds Two Numbers',
        
        options:[
            {
                name:'first_number',
                description:'No Need for a description huh',
                type:ApplicationCommandOptionType.Number,
                required:true,
                choices:[
                    {
                        name:'modernAddition',
                        value:'27493274962378463897467891648732618794362781463789214673892648792164',
                    }
                ],
            },
            {
                name:'second_number',
                description:'No Need for a description huh',
                type:ApplicationCommandOptionType.Number,
                required:true,
                choices:[
                    {
                        name:'modernAddition',
                        value:'27493274962378463897467891648732618794362781463789214673892648792164',
                    }
                ],
            }
        ]
    }
    
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Attempting to register commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Commands registered! ✅');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
})();