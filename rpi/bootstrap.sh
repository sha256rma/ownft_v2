#!/bin/bash
cd /home/pi

# -- Install dependencies
sudo apt-get update
sudo apt-get install -y git screen

# -- Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

echo "export NVM_DIR=\"\$([ -z \"\${XDG_CONFIG_HOME-}\" ] && printf %s \"\${HOME}/.nvm\" || printf %s \"\${XDG_CONFIG_HOME}/nvm\")\"" >> /home/pi/.bashrc
echo "[ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" # This loads nvm" >> /home/pi/.bashrc

source /home/pi/.bashrc

# -- Install node 
nvm install node

# -- Install ipfs
wget https://dist.ipfs.io/go-ipfs/v0.8.0/go-ipfs_v0.8.0_linux-arm.tar.gz 
tar -xvf go-ipfs_v0.8.0_linux-arm.tar.gz 
cd go-ipfs
sudo ./install.sh
ipfs init 

cd /home/pi

# -- Get repo 
git clone https://github.com/sha256rma/ownft_v2.git

# -- Install project
cd ownft_v2/server
npm install

# -- Run project
screen -d -m node index.js
screen -d -m ipfs daemon

cd ../
screen -d -m npm run start
