// const fs = require("fs");
// const path = require("path");

// module.exports = (directory, foldersOnly = false) => {
//   let fileNames = [];
//   const files = fs.readdirSync(directory, {
//     withFileTypes: true,
//   });
//   for (const file of files) {
//     const filePath = path.join(directory, file.name);

//     if (foldersOnly) {
//       if (file.isDirectory()) {
//         fileNames.push(filePath);
//       } else {
//         if (file.isFile()) {
//           fileNames.push(filePath);
//         }
//       }
//     }
// }
// return fileNames;
// };

const fs = require("fs");
const path = require("path");

module.exports = (directory, foldersOnly = false) => {
  let fileNames = [];
  const files = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        fileNames.push(filePath);
      } else {
        // Recursively get files in subdirectory
        fileNames = fileNames.concat(module.exports(filePath, foldersOnly));
      }
    } else if (!foldersOnly && file.isFile()) {
      fileNames.push(filePath);
    }
  }

  return fileNames;
};
