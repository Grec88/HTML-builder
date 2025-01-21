const fs = require('fs/promises');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const assetDir = path.join(__dirname, 'assets');
const stylesDestDir = path.join(__dirname, 'project-dist');
const assetDestDir = path.join(__dirname, 'project-dist/assets');
const componentsDir = path.join(__dirname, 'components');

const getDirData = async (srcDir) => {
  const files = await fs.readdir(srcDir, { withFileTypes: true });
  const filesData = [];

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(srcDir, file.name);
      const fileData = await fs.readFile(filePath, 'utf-8');
      filesData.push(fileData);
    }
  }

  return filesData;
};

const makeStyle = async (srcDir, destDir) => {
  const filesData = await getDirData(srcDir);
  const bundleFileDir = path.join(destDir, 'style.css');

  const bundleData = filesData.join('\n');
  await fs.writeFile(bundleFileDir, bundleData, 'utf-8');
};

const copyDir = async (srcDir, destDir) => {
  const files = await fs.readdir(srcDir, { withFileTypes: true });
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const file of files) {
    if (file.isFile()) {
      const copyFilePath = path.join(srcDir, file.name);
      const copiedFilePath = path.join(destDir, file.name);
      try {
        await fs.copyFile(copyFilePath, copiedFilePath);
        console.log(`${file.name} was copied to ${copiedFilePath}.`);
      } catch {
        console.error(`${file.name} could not be copied.`);
      }
    } else if (file.isDirectory()) {
      const srcSubDirPath = path.join(srcDir, file.name);
      const destSubDirPath = path.join(destDir, file.name);
      await copyDir(srcSubDirPath, destSubDirPath);
    }
  }
};

const buildPage = async () => {
  await fs.rm(stylesDestDir, { recursive: true, force: true });
  await fs.mkdir(stylesDestDir, { recursive: true });

  const templatePath = path.join(__dirname, 'template.html');
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const componentFiles = await fs.readdir(componentsDir, {
    withFileTypes: true,
  });

  let htmlContent = templateContent;

  for (const file of componentFiles) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentName = `{{${path.basename(file.name, '.html')}}}`;
      const componentContent = await fs.readFile(
        path.join(componentsDir, file.name),
        'utf-8',
      );
      htmlContent = htmlContent.replaceAll(componentName, componentContent);
    }
  }

  const indexHtmlPath = path.join(stylesDestDir, 'index.html');
  await fs.writeFile(indexHtmlPath, htmlContent, 'utf-8');

  await makeStyle(stylesDir, stylesDestDir);
  await copyDir(assetDir, assetDestDir);
};

buildPage();
