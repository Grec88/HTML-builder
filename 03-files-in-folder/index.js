const fs = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

const readFolder = async (dirPath) => {
  const files = await fs.readdir(dirPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      const extension = path.extname(filePath).slice(1);
      const fileName = path.basename(filePath, path.extname(filePath));
      const fileStats = await fs.stat(filePath);
      console.log(`${fileName} - ${extension} - ${fileStats.size}b`);
    }
  }
};

readFolder(dirPath);
