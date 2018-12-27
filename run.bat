:: Don't show these commands to the user
@echo off
:: Keep variables local, and expand at execution time not parse time
setlocal enabledelayedexpansion
:: Set the title of the window
title Run book CSS creator

:: Serve the page so that paged.js can fetch over http
echo -------------------------------------------
echo Starting webserver...echo Starting webserver at http://127.0.0.1:5000
echo Press Ctrl+C in the webserver's command-line window to stop
echo -------------------------------------------
start chrome "http://127.0.0.1:5000/"
start ruby -run -e httpd . -p 5000

:: Build the CSS
start sass --watch main.scss:css/main.css --style compressed --sourcemap=none
