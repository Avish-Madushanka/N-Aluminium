// Script to start the backend server
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const command = isWindows ? 'npm.cmd' : 'npm';
const backendPath = path.join(__dirname, 'Backend');

console.log('Starting backend server from directory:', backendPath);

const backend = spawn(command, ['run', 'dev'], { 
  cwd: backendPath,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('Failed to start backend server:', err);
});

process.on('SIGINT', () => {
  console.log('Shutting down backend server...');
  backend.kill('SIGINT');
  process.exit();
}); 