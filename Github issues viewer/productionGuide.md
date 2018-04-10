# Production Guide

## Table of Contents
1. [Create SSH key](#sshKey)
2. [Add SSH to Digital Ocean](#sshToDG)
3. [Create a Droplet](#createDroplet)
4. [Create a new remote to you repository](#newRemote)
5. [Install PM2](#pm2)
6. [Create self-signed HTTPS certificate](#https)
7. [Setup Nginx](#nginx)

## Create SSH key <a name="sshKey"></a>
1. Open terminal and type in: `ssh-keygen -t rsa`
2. Next step press enter to save file in the default folder.
3. Next type in your passphrase
4. Last, add the private SSH key to the SSH-agent:
  * Start SSH-agent: `eval "$(ssh-agent -s)"`
  * Add the key: `ssh-add ~/.shh/id_rsa`

## Add SSH to Digital Ocean <a name="sshToDG"></a>
1. Login to your account on Digital Ocean
2. Go to Settigns and then Security
3. Click on Add SSH Key
4. Paste in the content from the local file into the field and give it a name

## Create a Droplet <a name="createDroplet"></a>
1. Login to your account on Digital Ocean and press Create Droplet
2. Choose NodeJS within the One-click apps in the section "Choose an image"
3. Choose a size thats suites your appliction
4. Choose Frankfurt as your datacenter region
5. Add your SSH key that you've set up before
6. Choose a name for your Droplet and then press "Create"
7. Open the terminal and type in: `ssh root@yourdropletipnumber`
8. Type in password that you got from Digital Ocean and then a new one

## Create a new remote to your repository <a name="newRemote"></a>
1. Open terminal and type in: `ssh root@your_droplet_ip_number`
2. Then type:
```
cd /var
mkdir www && mkdir www/appName
mkdir repo && cd repo
mkdir site.git && cd site.git
git init --bare
```
3. Create a hook by typing (in your repo):
```
cd site.git/hooks
touch post-receive
nano post-receive
```
4. In the file type:
```
#!/bin/sh
git --work-tree=/var/www/appName --git-dir=/var/repo/site.git checkout -f
```
5. Make the file executable by typing: `chmod +x post-receive`
6. Add a new remote by open a new terminal and go to your project folder and type:
`git remote add production ssh://root@your_droplet_ip_number/var/repo/site.git`
Now you can push to your production server by typing: `git push production`

## Install PM2 <a name="pm2"></a>
1. Install the process manager (PM2) globally by typing: `npm install pm2 -g`
2. Start pm2: `pm2 start server.js (your server file)`

## Create self-signed HTTPS certificate <a name="https"></a>
1. Copy the script in https://github.com/meanjs/mean/blob/master/scripts/generate-ssl-certs.sh
2. Create a folder called something like dev-script and create a .sh file within and put the script there
3. Make the file executable by typing: `chmod +x ./dev-script/generate-ssl.sh`
4. Run it: `./dev-script/generate-ssl.sh`
5. Now you can fill in data, but you can just press enter
6. Now is the cert and key created in the folder config

## Setup Nginx <a name="nginx"></a>
1. First update: `apt-get update`
2. Install Nginx: `apt-get install nginx`
3. In the project open the default file: 
```
cd /etc/nginx/sites-available
nano default
```
4. Remove the data in the file and paste the data from https://gist.github.com/thajo/d5db8e679c1237dfdb76 and replace row 4, 5, 17 to suite your application
5. Close file `ctrl + x` and restart Nginx: `service nginx restart`

## Security and Personal Access Token
* Go to your production directory and create a file that contains your personal access token secret string andt then type `source "yourSecretFile"` to set your environment variables to your personal access token secret string. In the code you will fetch the string by typing: `process.env.secretKey`.
* After you have installed the npm dependencies that belongs to the project, install Node Security Platform `npm install nsp -global` to check if there's any known vulnerabilities in the packages.

## Done
When all this is set up, and your server is running through pm2, you're all done and can develope your project.