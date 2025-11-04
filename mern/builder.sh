#!/bin/bash

cd "$(dirname "$0")/server" || { 
    echo "Error: server directory not found"; 
    exit 1; 
}


npm install

