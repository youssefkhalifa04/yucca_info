import serial

def active_motor():
    ser = serial.Serial('COM3', 9600)
    ser.write(b'M1')
    ser.close()

def stop_motor():
    try : 
        ser = serial.Serial('COM3', 9600)
        ser.write(b'M0')
        ser.close()
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
def active_heater():
    try : 
        ser = serial.Serial('COM3', 9600)
        ser.write(b'H1')
        ser.close()
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")

    
def stop_heater():
    try : 
        ser = serial.Serial('COM3', 9600)
        ser.write(b'H0')
        ser.close()
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")

    
def active_fan():
    try : 
        ser = serial.Serial('COM3', 9600)
        ser.write(b'F1')
        ser.close()
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
   
def stop_fan():
    try : 
        ser = serial.Serial('COM3', 9600)
        ser.write(b'F0')
        ser.close()
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
    
