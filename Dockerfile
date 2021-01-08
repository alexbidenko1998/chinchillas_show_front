FROM node:12-alpine
WORKDIR /app
COPY . .
RUN \
  yarn install && \
  yarn build
EXPOSE 3333
CMD ["yarn", "start"]
