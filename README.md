# Logstash
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
- ***[Async await](https://docs.python.org/3/library/asyncio-task.html#awaitables)*** is used in ***gps.py*** and ***elastic.py***.

# RPi Service
## Create service to run logstash & python
In /etc/rc.local add following >> 
Edit file: 
``` sudo vim /etc/rc.local ```
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