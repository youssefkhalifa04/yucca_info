import {supabase} from "../integration/supabase/supabase";
const useApi = () => {
    const getAnalytics = async () => {
        const { data, error } = await supabase
            .from("sensor_data")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1);

        if (error) {
            console.error("Error fetching data:", error);
        } else {
            console.log("Data fetched:", data);
        }
        return  data ;
    }

    const sendSettings = async (settings) => {
        try {
            const response = await fetch('http://localhost:3000/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            const data = await response.json();
            console.log('Settings saved successfully:', data);
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        }
    }


    const getCurrentAutoSettings = async (egg) => {
        const {data , error } = await supabase
        .from("egg_type")
        .select('target_temp, target_hum, rotation_interval')
        .eq('egg_type', egg);
        if (error)
            throw new error ('error while reading egg info')

        
        return data
    }

    const sendEggType = async (egg) => {
        try {
            const response = await fetch('http://localhost:3000/api/EggType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(egg)
            });

            if (!response.ok) {
                throw new Error('Failed to send current eggtype');
            }

      
          
        } catch (error) {
            
            toast.error('Failed to save settings');
        }
    }

    const SendMode = async(mode) => {

        try {
            const response = await fetch('http://localhost:3000/api/controlMode' ,
                
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mode) 

            });
            if (!response.ok) {
                throw new Error('Failed to send current eggtype');
            }
        }
        
        catch (error){
            console.error('error sending control mode')
        }
    }

    return { getAnalytics, sendSettings , getCurrentAutoSettings , sendEggType , SendMode};
};

export default useApi;
