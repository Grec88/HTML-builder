const fs = require('fs/promises');
const path = require('path');
const srcDir = path.join(__dirname, 'styles');
const destDir = path.join(__dirname, 'project-dist');

const makeBundle = async (srcDir, destDir) => {
  const files = await fs.readdir(srcDir, { withFileTypes: true });
  const filesData = [];
  const bundleFileDir = path.join(destDir, 'bundle.css');

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(srcDir, file.name);
      const fileData = await fs.readFile(filePath, 'utf-8');
      filesData.push(fileData);
    }
  }

  const bundleData = filesData.join('\n');
  await fs.writeFile(bundleFileDir, bundleData, 'utf-8');
};

makeBundle(srcDir, destDir);
