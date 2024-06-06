const { testServer } = require("./../../../config.json");
const getLocalCommands = require("./../../utils/getLocalCommands");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, testServer);

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;
      const existingCommand = applicationCommands.cache.find((cmd) => cmd.name === name);

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log(`Updated command ${name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(`Skipped command ${name}`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });
        console.log(`Created command ${name}`);
      }
    }
  } catch (err) {
    console.error("Error processing commands:", err);
  }
};
