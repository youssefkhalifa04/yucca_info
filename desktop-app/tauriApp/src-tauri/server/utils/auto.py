from integration.supabase import supabase
from utils.serial_reader import latest_data
from utils.controller import active_fan , active_heater , active_motor , stop_fan , stop_heater , stop_motor , getFanStatus , getHeaterStatus ,getMotorStatus , setMotorStatus , humIncreasing , hum_increase , hum_decrease
import time

def getEggTarget(egg) : 
    response = supabase.table('egg_info').select('target_temp, target_hum').eq('egg_type', egg).execute()
    rows = response.data or []
    return rows[0] if rows else {}

async def auto(egg , com , bd, stop_event=None) : 
    global latest_data
    targets = getEggTarget(egg)
    print(f'auto mode for {egg} egg')
    target_temp = targets.get('target_temp')
    target_hum = targets.get('target_hum')
    while True:
        if stop_event is not None and stop_event.is_set():
            break
        current_temp = latest_data.get('temperature')
        current_hum  = latest_data.get('humidity')
        if current_temp is None or current_hum is None:
            time.sleep(1)
            continue
        if target_temp is not None and current_temp > target_temp:
            if not getFanStatus and getHeaterStatus:
                active_fan(com , bd)
                stop_heater(com , bd)
                while latest_data.get('temperature') is not None and latest_data.get('temperature') > target_temp : 
                    if stop_event is not None and stop_event.is_set():
                        break
                    time.sleep(1)
            elif getFanStatus and not getHeaterStatus : 
                active_fan(com , bd)
                while latest_data.get('temperature') is not None and latest_data.get('temperature') > target_temp : 
                    if stop_event is not None and stop_event.is_set():
                        break
                    time.sleep(1)
        if target_temp is not None and current_temp < target_temp :
            if getFanStatus and not getHeaterStatus :
                stop_fan(com  , bd)
                active_heater(com , bd)
                while latest_data.get('temperature') is not None and latest_data.get('temperature') < target_temp :
                    if stop_event is not None and stop_event.is_set():
                        break
                    time.sleep(1)
            elif not getFanStatus and getHeaterStatus : 
                active_heater(com , bd)
                while latest_data.get('temperature') is not None and latest_data.get('temperature') < target_temp :
                    if stop_event is not None and stop_event.is_set():
                        break
                    time.sleep(1)
        if target_hum is not None and current_hum < target_hum :
            if humIncreasing : 
                pass 
            else :
                hum_increase(com , bd)
        else : 
            if humIncreasing : 
                hum_decrease(com , bd)
        time.sleep(1)

            

            

    
              


    