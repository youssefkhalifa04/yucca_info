import serial
motors_status = {
    'motor' : True , 
    'heater' : True , 
    'fan' : True , 
    'hum' : True ,
}
   

def active_motor(com , baudrate):
    try : 
        ser = serial.Serial(com , baudrate)
        ser.write(b'M1')
        ser.close()
        if not motors_status.get('motor') :
            motors_status['motor'] = True
        
    except : 
        print('error')

def stop_motor(com , baudrate):
    try : 
        ser = serial.Serial(com , baudrate)
        ser.write(b'M0')
        ser.close()
        if  motors_status.get('motor') :
            motors_status['motor'] = False
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
def active_heater(com , baudrate):
    try : 
        ser = serial.Serial(com , baudrate)
        ser.write(b'H1')
        ser.close()
        if not motors_status.get('heater') :
            motors_status['heater'] = True
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")

    
def stop_heater(com , baudrate):
    try : 
        ser = serial.Serial(com , baudrate)
        ser.write(b'H0')
        ser.close()
        if  motors_status.get('heater') :
            motors_status['heater'] = False
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")

    
def active_fan(com , baudrate):
    try : 
        ser = serial.Serial(com , baudrate)
        ser.write(b'F1')
        ser.close()
        if not motors_status.get('fan') :
            motors_status['fan'] = True
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
   
def stop_fan(com , baudrate):
    try : 
        ser = serial.Serial (com , baudrate)
        ser.write(b'F0')
        ser.close()
        if  motors_status.get('fan') :
            motors_status['fan'] = False
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
    
def hum_increase(com , baudrate):
    try : 
        ser = serial.Serial(com , baudrate)
        ser.write(b'C1')
        ser.close()
        if not motors_status.get('hum') :
            motors_status['hum'] = True
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
   
def hum_decrease(com , baudrate):
    try : 
        ser = serial.Serial (com , baudrate)
        ser.write(b'C0')
        ser.close()
        if  motors_status.get('hum') :
            motors_status['hum'] = False
    except Exception as e:
        print(f"error connecting to serial [error message : {e}]")
def humIncreasing ()  : 
    global motors_status
    return motors_status.get['hum']
def getMotorStatus() :
    global motors_status
    return motors_status.get['motor']
def getFanStatus () : 
    global motors_status 
    return motors_status.get['fan']
def getHeaterStatus() : 
    global motors_status 
    return motors_status.get['heater']
def setMotorStatus(component , action):
    global motors_status
    motors_status[component] = bool(action)
