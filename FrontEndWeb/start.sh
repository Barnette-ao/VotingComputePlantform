#拉取代码
git pull
#安装依赖
npm install --registry=https://registry.npm.taobao.org&&npm run build
#停止容器
docker stop frontEndWeb
#删除容器
docker rm frontEndWeb
#启动容器
docker run -d --restart=on-failure:5\
    -p 8080:80 \
    -v $PWD/dist:/usr/share/nginx/html \
    --name frontEndWeb nginx
