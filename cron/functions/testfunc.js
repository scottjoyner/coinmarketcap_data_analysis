const shell = require('shelljs');
// Run external tool synchronously
if (shell.exec('node logMarketConditions.js 10').code !== 0) {
    shell.echo('Error: Git commit failed')
    shell.exit(1)
  }