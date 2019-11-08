# DNSPOD-DDNS-NODEJS
一个Nodejs应用，更新腾讯云解析中的对应公网IP地址。
Application which can modify DNSPod DNS record automatically

# 参数说明
* secretId:xxx 
* secretKey:xxx
* domain:xxx
* sub_domain:xxx 
* interval:10 检查时间间隔，默认10分钟

# Linux/Mac/Windows中启动
node index.js secretId:xxx secretKey:xxx domain:xxx sub_domain:xxx interval:10

# 通过forever管理
npm install -g forever
forever start -f -a -o ./stdout.log -d -v --minUptime 300000 --spinSleepTime 300000 index.js secretId:xxx secretKey:xxx domain:xxx sub_domain:xxx interval:10
forever list

# 在Docker容器内启动
制作image
docker build -t ddns-dndpos-myapp .
导出image（可选）
docker save -o ddns-dndpos-myapp.tar ddns-dndpos-myapp
装载image（可选）
docker load -i ddns-dndpos-myapp.tar
启动image
docker run ddns-dndpos-myapp secretId:xxx secretKey:xxx domain:xxx sub_domain:xxx interval:10
查看docker日志（可选）
docker logs {docker_container_id}

# 在群晖系统中启动
待补充

# 后续扩展
1. 增加对阿里云的支持
2. 增加自动添加一条Record记录
3. 增加容器内通过forever启动daemon，并将日志输出到控制台
4. 增加说明如何在群晖NAS系统中启动服务的说明

# 如何联系我
semonwang@163.com

# 请我喝咖啡
if you find this app helpful, you can choose to buy me a coffee.

![wechat](./wechat_re.jpg)