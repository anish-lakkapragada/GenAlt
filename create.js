
const { spawn } = require('child_process');

const cmds = [
  'zip -r extension.zip images popup dist manifest.json usage.html LICENSE'
]; 

spawn(
  'sh',
  [
    '-c',
    cmds.join(' && ')
  ]
);