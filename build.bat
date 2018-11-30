:: Don't show these commands to the user
@echo off
:: Keep variables local, and expand at execution time not parse time
setlocal enabledelayedexpansion
:: Set the title of the window
title Build CSS

sass --watch main.scss:css/main.css --style compressed --sourcemap=none
