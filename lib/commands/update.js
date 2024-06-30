const { exec } = require('child_process');
const pkg = require('../../package.json');

module.exports = () => {
  console.log('Updating the CLI tool...');
  
  const packageName = pkg.name;

  exec(`npm install -g ${packageName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error updating the CLI tool: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
    console.log('CLI tool updated successfully.');
  });
};
