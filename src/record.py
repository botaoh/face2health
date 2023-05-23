import numpy as np
from serial import SerialException
import threading
import time
import serial
import peakutils
import scipy.io
import sys
import os

class Session:
    def __init__(self, port:int):
        self.port = None # the port number
        self.serialOpen = False # whether the serial is open
        self.ifRecording = False # whether the recording is on
        self.serialDataRecorded = [] # the data recorded
        self.dataSaveNum = 0 # the number of data saved
        self.savePath = "./" # the path to save the data
        self.init_serial(port)
    
    def __read_from_port(self, ser):
        while self.ifRecording == True:
            try:
                print("Recording start")
                reading = float(ser.readline().strip())
            except:
                reading = 0
            self.serialDataRecorded.append(reading)
            if len(self.serialDataRecorded) >= 9000:
                print('SAVED!')
                dataProcessed = self.__process_data(self.serialDataRecorded)
                self.__save_data(dataProcessed)
                self.dataSaveNum+=1
                self.serialDataRecorded = []
        print("Recording ended")
        
    def init_serial(self, port):
        self.port = port
    
    def connect_serial(self):
        try:
            self.ser = serial.Serial('COM' + str(self.port), 9600, timeout=20)
            self.ser.close()
            self.ser.open()
            self.thread = threading.Thread(target=self.__read_from_port, args=(self.ser,))
            self.thread.start()
            print('thread started')
            self.serialOpen = True
        except SerialException:
            print("Error: wrong port?")
            exit()
            
    def start_recording(self):
        self.ifRecording = True
        self.thread = threading.Thread(target=self.read_from_port, args=(self.ser,))
        self.thread.start()
        print('thread started')
    
    def stop_recording(self):
        if self.ifRecording == True:
            self.ifRecording = False
            self.thread.join()
            dataProcessed = self.__process_data(self.serialDataRecorded)
            self.__save_data(dataProcessed)
            print("Recording ended")
        else:
            print("Recording not started")
            
    def kill_serial(self):
        if self.serialOpen == True:
            self.serialOpen = False
            time.sleep(1)
            self.ser.close()
            print('serial closed')
        else:
            print("Serial not opened")
    
    def __process_data(self,data):
        z=scipy.signal.savgol_filter(data,11,3)
        data2 = np.asarray(z, dtype=np.float32)
        base = peakutils.baseline(data2,2)
        y = data2 - base
        return y
    
    def __save_data(self,data):
        filename=os.path.join(self.savePath,'ECGP{}_{}-{}.mat'.format(self.dataSaveNum,self.dataSaveNum*0,self.dataSaveNum*9000))
        scipy.io.savemat(filename,mdict={'val':data})
        

class Recorder:
    def __init__(self):
        self.threads = []
        self.session = []
        pass
    
    
if __name__ =="__main__":
    portNum = input("Please input the port number: ")
    portNum = int(portNum)
    ses = Session(port=portNum)
    ses.connect_serial()
    ses.start_recording()
    time.sleep(10)
    ses.stop_recording()
    ses.kill_serial()
    