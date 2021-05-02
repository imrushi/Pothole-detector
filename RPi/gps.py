import serial
from time import sleep
import sys
import asyncio

ser = serial.Serial("/dev/ttyUSB0")  # Open port with baud rate
gpgga_info = "$GPGGA"
GPGGA_buffer = 0
NMEA_buff = 0


def convert_to_degrees(raw_value):
    decimal_value = raw_value/100.00
    degrees = int(decimal_value)
    mm_mmmm = (decimal_value - int(decimal_value))/0.6
    position = degrees + mm_mmmm
    position = "%.20f" % (position)
    return position


async def mainGPS():
    try:
        while True:
            received_data = (str)(ser.readline())  # read NMEA string received
            GPGGA_data_available = received_data.find(
                gpgga_info)  # check for NMEA GPGGA string
            if (GPGGA_data_available > 0):
                # store data coming after “$GPGGA,” string
                GPGGA_buffer = received_data.split("$GPGGA", 1)[1]
                NMEA_buff = (GPGGA_buffer.split(','))
                # print(NMEA_buff)
                nmea_time = []
                nmea_latitude = []
                nmea_longitude = []
                nmea_time = NMEA_buff[0]  # extract time from GPGGA string
                # extract latitude from GPGGA string
                nmea_latitude = NMEA_buff[2]
                # extract longitude from GPGGA string
                nmea_longitude = NMEA_buff[4]
                # print("NMEA Time: ", nmea_time, '\n')
                lat = (float)(nmea_latitude)
                lat = convert_to_degrees(lat)
                longi = (float)(nmea_longitude)
                longi = convert_to_degrees(longi)
                # print("NMEA Latitude: ", lat, "NMEA Longitude: ", longi, '\n')
                return [lat, longi]

    except KeyboardInterrupt:
        sys.exit(0)
