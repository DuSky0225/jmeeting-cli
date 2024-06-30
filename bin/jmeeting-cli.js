#!/usr/bin/env node

const { program } = require("commander");
const path = require('path');
const fs = require('fs');
const create = require("../lib/commands/create");
const update = require("../lib/commands/update");
// const pkg = require("../package.json"); // 自动读取 package.json 中的版本号

// 读取 package.json 中的版本号
const packageJsonPath = path.join(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

program
  .version(pkg.version) // 使用 package.json 中的版本号
  .command("create <project-name>")
  .description("create a new jmeeting project")
  .action((projectName) => {
    create(projectName);
  });

program
  .command("update")
  .description("update the CLI tool")
  .action(() => {
    update();
  });

program.parse(process.argv);
