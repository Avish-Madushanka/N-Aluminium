# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## N-Aluminium Application

An application for managing aluminum recycling operations.

## Setup Instructions

1. Install dependencies:
```bash
npm install
cd Backend
npm install
cd ..
```

2. Configure the Backend Server:

The backend requires a MongoDB database and environment configuration. You can set this up in one of two ways:

**Option A: Use the automatic setup script**
```bash
# On Windows
fix-and-start-backend.bat

# On other platforms
npm run fix:backend
```

**Option B: Manual configuration**
Create a file named `.env` in the `Backend` directory with the following content:
```
PORT=5003
MONGO_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdatabase
JWT_SECRET=your-secret-key-for-jwt-authentication
JWT_EXPIRE=30d
NODE_ENV=development
```
Replace the MongoDB URI with your actual MongoDB connection string.

3. Start the application:

**Option 1: Start both frontend and backend together**
```bash
npm run start:all
```

**Option 2: Start them separately**

For backend:
```bash
# Using one of these methods:
npm run start:backend
npm run fix:backend
fix-and-start-backend.bat
```

For frontend:
```bash
npm run dev
```

## Port Configuration

- Backend server runs on port 5003
- Frontend development server runs on port 5173

## Common Issues and Troubleshooting

### Backend Connection Refused
If you see "ERR_CONNECTION_REFUSED" errors or "Backend server appears to be offline":

1. Make sure the backend server is running on port 5003
2. Check the console for any MongoDB connection errors
3. Verify your `.env` file has the correct MongoDB URI
4. Try running the `fix-and-start-backend.bat` file

### Authentication Errors
If you encounter "Not authorized" or "token verification failed" errors:

1. Clear your browser's local storage or logout and login again
2. Check that the JWT_SECRET in your .env file hasn't changed
3. Verify that your MongoDB connection is working

### Port Already in Use
If port 5003 is already in use:

1. Find and close the application using the port
2. Or change the PORT value in the Backend/.env file and update apiConfig.js accordingly
