const path = require('path');
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '../events'), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a.localeCompare(b));

    console.log('Event Files:', eventFiles); // Debug: List event files
    const eventName = path.basename(eventFolder);
    console.log('Event Name:', eventName); // Debug: Event name

    client.on(eventName, async (arg) => {
      try {
        console.log(`Event triggered: ${eventName}`); // Debug: Event trigger
        for (const eventFile of eventFiles) {
          const eventFilePath = path.resolve(eventFile);
          console.log(`Executing file: ${eventFilePath}`); // Debug: Executing file
          const eventFunction = require(eventFilePath);
          await eventFunction(client, arg);
        }
      } catch (error) {
        console.error(`Error in event function for event: ${eventName}`, error);
      }
    });
  }
};
