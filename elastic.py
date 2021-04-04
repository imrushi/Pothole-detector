import RPi.GPIO as GPIO
from gps import *
import requests
import time
import datetime
import socket
import json
import serial
import asyncio

GPIO.setmode(GPIO.BCM)

TRIG = 23
ECHO = 24
# inital_clearance=30.00 #cm
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)
GPIO.setwarnings(False)

Log_PORT = 5400
Log_HOST = '127.0.0.1'


def timeStampLogic():
    currentTimestamp = datetime.datetime.now(
    ).astimezone().replace(microsecond=0).isoformat()
    return currentTimestamp


print("Distance Measurement In Progress")

lat_in_degrees = 0
long_in_degrees = 0


async def main():
    try:
        while True:
            while True:
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.connect((Log_HOST, Log_PORT))
                    break
                except socket.error:
                    print("Connection Failed, Retrying..")
                    time.sleep(1)
            GPIO.output(TRIG, False)
            time.sleep(0.2)

            GPIO.output(TRIG, True)
            time.sleep(0.00001)
            GPIO.output(TRIG, False)

            while GPIO.input(ECHO) == 0:
                pulse_start = time.time()

            while GPIO.input(ECHO) == 1:
                pulse_end = time.time()

            pulse_duration = pulse_end - pulse_start

            distance = pulse_duration * 17150

            distance = round(distance, 2)

            print("Distance", distance, "cm")
            # gps
            locList = await mainGPS()
            print(locList[0], locList[1])
            timestamp = timeStampLogic()

            jdata = {'displacement': distance, 'location': {
                'lat': locList[0], 'lon': locList[1]}, 'timestamp': timestamp}

            data = json.dumps(jdata)
            s.send(bytes(data, encoding="utf-8"))
            s.send(bytes('\n', encoding="utf-8"))

    except KeyboardInterrupt:
        print("Cleaning up!")
        GPIO.cleanup()


asyncio.run(main())
