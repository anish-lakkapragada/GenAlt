
const { spawn } = require('child_process');

const cmds = [
  'zip -r firefox.zip images popup dist manifest.json'
]; 

spawn(
  'sh',
  [
    '-c',
    cmds.join(' && ')
  ]
);