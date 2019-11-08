FROM node:latest
RUN mkdir -p /home/Service
WORKDIR /home/Service
COPY package*.json ./
RUN npm install
RUN npm install -g forever
COPY . .
EXPOSE 8000
ENTRYPOINT ["node", "index.js"]
CMD ["secretId:","secretKey:"," domain:"," sub_domain:","interval:10"]