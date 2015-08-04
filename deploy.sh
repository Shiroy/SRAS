#!/bin/sh

gulp

zip -r sras-win32.zip sras-win32-ia32
zip -r sras-win64.zip sras-win32-x64

cp sras-win32.zip /var/www/html
cp sras-win64.zip /var/www/html

cp sras-win32-ia32/resources/app.asar /var/www/html

date +%s >> /var/www/html/app.time
