# Setup Elastic & Kibana

1. Download [Elasticsearch](https://www.elastic.co/downloads/elasticsearch) and [Kibana](https://www.elastic.co/downloads/kibana) & install it..
2. Copy **elasticsearch.yml** from ELK Config folder and paste in Elasticsearch/Config folder.
3. Copy **kibana.yml** from ELK Config folder and paste in Kibana/config folder.

# Frontend - Angular

## Steps Enable x-pack for API calls

1. Open **elasticsearch.yml** and this line `xpack.security.enabled: true` in file & Restart Elastic service.
2. Run `bin/elasticsearch-setup-passwords interactive` to setup password indivisually for all componenet.
3. Add below code in **elasticsearch.yml** for CORS.

```
http.cors.enabled : true
http.cors.allow-origin: "*"
http.cors.allow-methods: OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers: X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true
```

- Refrences
  - User Create API - https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-put-user.html
  - Setup Password to ELK - https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-passwords.html#setup-passwords
  - API call from Angular -
    ```
    postCreateUser(
      username: string,
      password: string,
      fullName: string,
      email: string
    ) {
      const postJson = {
        password: password,
        roles: ['kibana_dashboard_only_user'],
        full_name: fullName,
        email: email,
        metadata: {
          intelligence: 7,
        },
      };
      const header = new HttpHeaders({
        'Authorization': 'Basic ' + btoa(username:password), //username password of ELK
      });
      return this.http.post(
        'http://localhost:9200/_security/user/' + username,
        postJson,
        { headers: header }
      );
    }
    ```

# RPi

## Below is Raspberry pi side information

# Logstash

Install Logstash in Raspberry Pi follow this link https://toddysm.com/2020/06/09/learn-more-about-your-home-network-with-elastic-siem-part-1-setting-up-elastic-siem/

## Persistent Queue

To add persisted queue follow this link
https://www.elastic.co/guide/en/logstash/current/persistent-queues.html

change to be done in /etc/logstash/logstash.yml

queue.type: persisted
queue.max_bytes: 4gb

**Note: To add queue you need to access logstash.yml from root user**

# Python

- Using socket sending data to logstash.
- Timestamp formate is used in ISO 8601 with Local TimeZone without microseconds

```
import datetime
datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()
```

- **_[Async await](https://docs.python.org/3/library/asyncio-task.html#awaitables)_** is used in **_gps.py_** and **_elastic.py_**.

# RPi Service

## Create service to run logstash & python

In /etc/rc.local add following >>
Edit file:
`sudo vim /etc/rc.local`
add following content

```
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi
alias python=python3
#!/bin/sh
sudo /usr/share/logstash/bin/logstash -f /home/pi/pothole-sensors-py/logstash-filter.conf & >> /home/pi/Desktop/log1.txt 2>&1
sudo python3 /home/pi/pothole-sensors-py/elasticsenddata.py & >> /home/pi/Desktop/log2.txt
#/homae/pi/pothole-sensors-py/Logstash&py.sh & > /home/pi/Desktop/log.txt 2>&1
exit 0
```
