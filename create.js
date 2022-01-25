
const { spawn } = require('child_process');

const cmds = [
  'zip -r extension.zip images popup dist manifest.json usage.html background.bundle.js altify.bundle.js LICENSE'
]; 

spawn(
  'sh',
  [
    '-c',
    cmds.join(' && ')
  ]
);