#!/usr/bin/env bash

eval "$(ssh-agent -s)"
if [ -z `ssh-keygen -F $deploy_host` ]; then
    ssh-keyscan -H $deploy_host >> ~/.ssh/known_hosts
fi

echo -e $deploy_key >> ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa

cp .env.dist .env