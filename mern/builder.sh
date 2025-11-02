#!/bin/bash
# Navigate to the server folder
cd "$(dirname "$0")/server" || { 
    echo "Error: server directory not found"; 
    exit 1; 
}

# Install dependencies
npm install

# Build or start server if needed
# Uncomment one of these depending on your setup
# npm run build
# npm start
