:: Don't show these commands to the user
@echo off
:: Keep variables local, and expand at execution time not parse time
setlocal enabledelayedexpansion
:: Set the title of the window
title Serve as local website

echo -------------------------------------------
echo Starting webserver...echo Starting webserver at http://127.0.0.1:5000
echo Press Ctrl+C to stop
echo -------------------------------------------
start chrome "http://127.0.0.1:5000/"
call ruby -run -e httpd . -p 5000
