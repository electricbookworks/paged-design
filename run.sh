#!/bin/bash
cd -- "$(dirname "$0")"
# That tells the system to use a Bourne shell interpreter,
# and then tells OSX to run this script from the current directory.
# Don't echo these commands:
set +v

# Build the CSS
sass sass --watch sass --watch default/main.scss:css/themes/default/main.css themes/template/main.scss:css/themes/template/main.css themes/wip/main.scss:css/themes/wip/main.css --style compressed --sourcemap=none

# Serve the page so that paged.js can fetch over http
echo "-------------------------------------------"
echo "Starting webserver...echo Starting webserver at http://127.0.0.1:5000"
echo "Press Ctrl+C to stop"
echo "-------------------------------------------"

awhile=2
sleep $awhile && google-chrome "http://127.0.0.1:5000/" &
ruby -run -e httpd . -p 5000
