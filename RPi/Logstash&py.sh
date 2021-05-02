#!/bin/sh
sudo /usr/share/logstash/bin/logstash -f /home/pi/pothole-sensors-py/logstash-filter.conf  
python3 -B /home/pi/pothole-sensors-py/elasticsenddata.py