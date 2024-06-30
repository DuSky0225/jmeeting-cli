const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const inquirer = require("inquirer");

module.exports = async (projectName) => {
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`Project ${projectName} already exists`);
    process.exit(1);
  }

  // 询问用户选择模板
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: ['my-jmeeting-web', 'my-jmeeting-h5'],
    }
  ]);

  // const templatePath = path.join(__dirname, "../../templates/my-jmeeting-web");
  const templatePath = path.join(__dirname, '../../templates', template);

  try {
    await fs.copy(templatePath, projectPath);
    console.log(`Project ${projectName} created at ${projectPath}`);

    // 询问用户是否需要安装依赖和启动服务器
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "install",
        message: "Do you want to install dependencies?",
        default: false,
      },
      {
        type: "confirm",
        name: "serve",
        message: "Do you want to start the development server?",
        default: false,
        when: (answers) => answers.install,
      },
    ]);

    if (answers.install) {
      console.log("Installing dependencies...");
      exec("npm install", { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing dependencies: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`npm install stderr: ${stderr}`);
          return;
        }
        console.log(stdout);

        if (answers.serve) {
          console.log("Starting the development server...");
          exec("npm run serve", { cwd: projectPath }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error starting the server: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`npm run serve stderr: ${stderr}`);
              return;
            }
            console.log(stdout);
          });
        }
      });
    } else {
      console.log(`cd ${projectName}`);
      console.log("npm install");
      console.log("npm run serve");
    }
  } catch (err) {
    console.error(err);
  }
};
