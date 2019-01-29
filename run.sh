#!/bin/bash
cd -- "$(dirname "$0")"
# That tells the system to use a Bourne shell interpreter,
# and then tells OSX to run this script from the current directory.
# Don't echo these commands:
set +v

# Build the CSS
# Add any new themes here to build them, too:
# copy a line below starting with 'theme/' and change the theme name.
sass --watch --style compressed --sourcemap=none \
	default/main.scss:css/themes/default/main.css \
	themes/template/main.scss:css/themes/template/main.css \
	themes/density/main.scss:css/themes/density/main.css \
    themes/beatrix/main.scss:css/themes/beatrix/main.css \
	&

# User guidance
echo "-------------------------------------------"
echo "Starting webserver at http://127.0.0.1:5000"
echo "Press Ctrl+C to stop"
echo "-------------------------------------------"

# Start Chrome, but wait three secs for the server to start
awhile=3
if [[ "$OSTYPE" == "darwin"* ]]; then
	sleep $awhile && open -a "Google Chrome" "http://127.0.0.1:5000/" &
else
	sleep $awhile && google-chrome "http://127.0.0.1:5000/" &
fi

# Run a webserver at 127.0.0.1:5000
ruby -run -e httpd . -p 5000 &&

# Kill all processes when we're done
killall -9 ruby
