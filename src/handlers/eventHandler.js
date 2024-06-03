// const getAllFiles = require("../utils/getAllFiles")
// const path = require("path")

// module.exports=(client)=>{
//     const eventFolders=getAllFiles('./src/events',true)
// //    eventFolders.forEach(eventFolder=>{
// //     const eventFiles=getAllFiles(eventFolder)
// //     console.log(eventFiles)   
// //    })
//     for (const eventFolder of eventFolders) {
//         const eventFiles=getAllFiles(eventFolder)
//         eventFiles.sort((a,b)=> a>b)
//         console.log(eventFiles)
//         const eventName=eventFolder.replace(/^.*[\\\/]/, '').split('/').pop()
//         console.log(eventName)
//         client.on(eventName,async arg=>{
//                 for(const eventFile of eventFiles){
//                     const eventFunction=require(eventFile)
//                     await eventFunction(client,arg)
//                 }
//         })
//     }
// }
const getAllFiles = require("../utils/getAllFiles");
const path = require("path");

module.exports = (client) => {
  const eventFolders = getAllFiles('./src/events', true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);
    const eventName = eventFolder.replace(/\\/g, '').split('/').pop();


    client.on(eventName, async (arg) => {
      try {
        for (const eventFile of eventFiles) {
          const eventFunction = require(eventFile);
          await eventFunction(client, arg);
        }
      } catch (error) {
        console.error(`Error in event function: ${error}`);
      }
    });
  }
};
