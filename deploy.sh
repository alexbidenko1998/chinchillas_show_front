docker-compose down
docker-compose up --build -d
rm -rf /etc/nginx/conf.d/chinchillas-show.conf || true
cp chinchillas-show.conf /etc/nginx/conf.d
service nginx reload