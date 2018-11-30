#!/bin/bash
cd -- "$(dirname "$0")"
# That tells the system to use a Bourne shell interpreter,
# and then tells OSX to run this script from the current directory.
# Don't echo these commands:
set +v

# NOTE: This script is untested

echo "-------------------------------------------"
echo "Starting webserver...echo Starting webserver at http://127.0.0.1:5000"
echo "Press Ctrl+C to stop"
echo "-------------------------------------------"

# For Mac
google-chrome "http://127.0.0.1:5000/content/"

# For Linux
google-chrome "http://127.0.0.1:5000/content/"

ruby -run -e httpd . -p 5000
