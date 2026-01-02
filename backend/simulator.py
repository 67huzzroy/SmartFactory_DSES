import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List
from .models import MachineData
import random

class Simulator:
    def __init__(self, num_machines=500):
        self.num_machines = num_machines
        self.machines = [f"M-{i:03d}" for i in range(1, num_machines + 1)]

    def generate_data(self, hours=1, anomaly_prob=0.05) -> pd.DataFrame:
        data = []
        current_time = datetime.now()
        
        for i in range(hours):
            timestamp = current_time - timedelta(hours=i)
            for machine_id in self.machines:
                # Base values
                temp = np.random.normal(70, 5) # Normal temp around 70C
                vib = np.random.normal(50, 10) # Normal vibration around 50Hz
                power = np.random.normal(10, 2) # Normal power around 10kW
                
                # Anomaly Injection
                if random.random() < anomaly_prob:
                    type_anomaly = random.choice(['temp', 'vib', 'both'])
                    if type_anomaly == 'temp':
                        temp += np.random.uniform(20, 40)
                    elif type_anomaly == 'vib':
                        vib += np.random.uniform(50, 80)
                    else:
                        temp += np.random.uniform(20, 40)
                        vib += np.random.uniform(50, 80)

                data.append({
                    "machine_id": machine_id,
                    "timestamp": timestamp,
                    "temperature": round(temp, 2),
                    "vibration": round(vib, 2),
                    "power": round(power, 2)
                })
        
        return pd.DataFrame(data)

    def get_latest_readings(self) -> List[MachineData]:
        df = self.generate_data(hours=1)
        # Convert DataFrame rows to MachineData objects
        return [MachineData(**row) for row in df.to_dict(orient='records')]

simulator = Simulator()
