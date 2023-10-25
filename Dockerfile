FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache git openssh g++ make py3-pip
RUN yarn global add node-gyp 
RUN yarn install 
RUN yarn build
CMD  yarn dev
