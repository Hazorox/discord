const { testServer } = require("./../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
// module.exports = async (client) => {
//     try {
//         const localCommands = getLocalCommands();
//         const applicationCommands = getApplicationCommands(client, testServer);
//         for (const localCommand of localCommands) {
//             const { name, description, options } = localCommand;
//             const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);
//             if (existingCommand) {
//                 if (localCommand.deleted) {
//                     await applicationCommands.delete(existingCommand.id);
//                     console.log(`deleted Command ${name}`);
//                     continue;
//                 }
//                 if(areCommandsDifferent(existingCommand,localCommand)){
//                     await applicationCommands.edit(existingCommand.id, {
//                         description,options,
//                     });
//                     console.log(`updated Command ${name}`);
//                 }
//             } else {
//                 if(localCommand.deleted){
//                     console.log(`skipped Command ${name}`);
//                     continue
//         }await applicationCommands.create({
//                     name,
//                     description,
//                     options,
//                 });
//                 console.log(`created Command ${name}`);
//             }
//     }}
//     } catch (err) {
//         console.error(err);
//     }
// };
module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;
      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );
      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`deleted Command ${name}`);
          continue;
        }
        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log(`updated Command ${name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(`skipped Command ${name}`);
          continue;
        }
        await applicationCommands.create({
          name: command.name,
          description: command.description,
          options: command.options,
        });
        console.log(`created Command ${name}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
