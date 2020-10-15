FROM node:12-alpine
RUN npm install -g npm
CMD ./docker-command.sh