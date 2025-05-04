#!/bin/bash

# Create bin directory if it doesn't exist
mkdir -p bin

# Compile all Java files
echo "Compiling Java files..."
javac -d bin src/com/frauddetection/*.java src/com/frauddetection/*/*.java

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "Compilation successful!"
    echo "Running the application..."
    # Run the application
    java -cp bin com.frauddetection.FraudDetectionApp
else
    echo "Compilation failed!"
fi