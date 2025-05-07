// Script to check and fix backend configuration
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Paths
const backendDir = path.join(__dirname, 'Backend');
const envPath = path.join(backendDir, '.env');

// Check if .env file exists, create if not
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file in Backend directory...');
  
  // Check if MongoDB connection is working - use existing value if available
  let mongoURI = process.env.MONGO_URI || 'mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdatabase';
  let jwtSecret = process.env.JWT_SECRET || 'n-aluminium-secret-key-' + Math.random().toString(36).substring(2);
  
  // Generate default .env content
  const envContent = `PORT=5003
MONGO_URI=${mongoURI}
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=30d
NODE_ENV=development
`;

  // Write the file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('Created .env file successfully!');
    console.log('⚠️ Note: You may need to edit the .env file with your actual MongoDB connection string');
  } catch (err) {
    console.error('Failed to create .env file:', err.message);
    console.log('⚠️ Please create the .env file manually in the Backend directory with:');
    console.log(envContent);
  }
}

// Function to check MongoDB URI
function checkMongoURI() {
  try {
    // Read and parse the .env file
    const envContent = fs.readFileSync(envPath, 'utf8');
    const mongoLine = envContent.split('\n').find(line => line.startsWith('MONGO_URI='));
    
    if (mongoLine && mongoLine.includes('yourusername')) {
      console.log('⚠️ Warning: Default MongoDB URI detected in .env file');
      console.log('⚠️ Please update with your actual MongoDB connection string');
    }
  } catch (err) {
    console.error('Failed to check MongoDB URI:', err.message);
  }
}

// Start the backend server
function startBackend() {
  console.log('\n=== Starting N-Aluminium Backend Server ===');
  console.log('Backend directory:', backendDir);
  
  // Check MongoDB URI before starting
  checkMongoURI();
  
  console.log('\nStarting backend server...');
  try {
    const child = spawn('npm', ['run', 'dev'], {
      cwd: backendDir,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('error', (err) => {
      console.error('Failed to start backend:', err.message);
    });
    
    process.on('SIGINT', () => {
      console.log('\nShutting down backend server...');
      child.kill('SIGINT');
      process.exit();
    });
  } catch (err) {
    console.error('Error starting backend:', err.message);
  }
}

// Run the start function
startBackend(); 