
from utils.serial_reader import save_data_to_supabase

import time
while True:
    try:
        save_data_to_supabase()
    except Exception as e:
        print(f"Error while saving to Supabase: {e}")
    
    time.sleep(4) 