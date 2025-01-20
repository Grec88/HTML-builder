const fs = require('fs/promises');
const path = require('path');
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

const copyFiles = async (srcDir, destDir) => {
  const files = await fs.readdir(srcDir, { withFileTypes: true });
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const file of files) {
    if (file.isFile()) {
      const copyFilePath = path.join(srcDir, file.name);
      const copiedFilePath = path.join(destDir, file.name);
      try{
        await fs.copyFile(copyFilePath, copiedFilePath);
        console.log(`${file.name} was copied to ${copiedFilePath}.`)
      } catch{
        console.error(`${file.name} could not be copied.`)
      };
    }
  }
};

copyFiles(srcDir, destDir);
