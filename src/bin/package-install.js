const fs = require('fs');
const cp = require('child_process');
const os = require('os');
const resolve = require('path').resolve;
const dirname = require('path').dirname;
    
const libs = process.argv.slice(2);

// run all libs
for (let library of libs) {

  const path = resolve(process.cwd(), library, 'package.json');

  if (!fs.existsSync(path)) {
      return;
  }

  var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';

  // install folder
  cp.spawn(npmCmd, ['i'], {
      env: process.env,
      cwd: dirname(path),
      stdio: 'inherit'
  });
}
    