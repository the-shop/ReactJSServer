#!/bin/bash
[ `whoami` = root ] || exec su -c $0 root
echo -e "\n\n\n###################################### Setup.sh ######################################\n"
echo -e "\n\n\n###################################### Clone Platform ######################################\n"
cd /var/www/ReactJSServer/applications
git clone -b master gh-deploy:the-shop/platform.git platform.the-shop.io
cd ..
export LC_ALL=C
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node
echo -e "\n###################################### Install project dependencies & GULP & BOWER ######################################\n"
npm i
npm install -g gulp bower
touch /etc/systemd/system/platform.service /var/www/platform.sh
NP=$(which node)
NPMP=$(which npm)
ln -s ${NP} /usr/bin/node
chmod +x /var/www/platform.sh
echo -e "#!/bin/bash\ncd /var/www/ReactJSServer && ${NPMP} run start" | dd of=/var/www/platform.sh
echo -e "[Unit]\nDescription=The Shop Platform\nAfter=network.target\n\n[Service]\nUser=root\nExecStart=/var/www/platform.sh\nRestart=always\n\n[Install]\nWantedBy=multi-user.target" | dd of=/etc/systemd/system/platform.service
systemctl enable platform
systemctl start platform
echo -e "\n\n\n###################################### SetupNode.sh Complete ######################################\n"