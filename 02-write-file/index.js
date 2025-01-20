const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);
stdout.write('Please, input some text...\n');
stdin.on('data', (data) => {
  const myBuffer = Buffer.from(data);
  if (myBuffer.toString().trim() !== 'exit') {
    output.write(data);
  } else {
    stdout.write('Thank you for the input...');
    process.exit(0);
  }
});
process.on('SIGINT', () => {
  stdout.write('Thank you for the input...');
  process.exit(0);
});
