import {Command} from "commander";

const program = new Command();

program
  .version(require('../package.json').version, '-v, -V', '输出当前框架的版本')
  .description('查看版本号')
  .usage('<command> [options]');

program.command('help')
  .alias('-h')
  .description('帮助命令')
  .action(function(name, other) {
      console.log(`
waffle-cli

支持的命令:
version, -v,-V 输出当前框架的版本
help,-h 输出帮助程序
Example call:
 waffle-cli <command> --help`)
  });

program.command('dev').description('框架开发命令').action(function() {
  const {
      dev
  } = require('./dev');
  dev();
});

program.parse(process.argv);
