import pandas as pd
from typing import List, Dict
from .models import MachineData, SimulationResult

class DSSEngine:
    def analyze_trends(self, data: pd.DataFrame) -> Dict:
        """
        Analyze data for simple trends. 
        Returns summary stats and potential issues.
        """
        summary = {
            "avg_temp": data['temperature'].mean(),
            "avg_vib": data['vibration'].mean(),
            "power_draw": data['power'].sum(),
            "bottlenecks": []
        }
        
        # Simple bottleneck detection: Machines with consistently high utilization (approximated by power)
        high_power_machines = data[data['power'] > 14]['machine_id'].unique().tolist()
        if high_power_machines:
            summary['bottlenecks'] = high_power_machines
            
        return summary

    def run_simulation(self, machine_id: str, parameter: str, value: float, current_data: MachineData) -> SimulationResult:
        """
        Run a what-if simulation.
        E.g. If specific machine capacity (parameter) is increased to X (value).
        """
        # Assumed logic: 
        # Capacity increase -> Linearly increases power and temperature risk
        
        original_value = 60.0 # Assumed base capacity %
        
        # Simple formulas for simulation
        if parameter == "capacity":
            # Ratio of increase
            ratio = value / original_value
            new_power = current_data.power * ratio * 1.1 # 10% inefficiency overhead
            output_impact = ratio * 100 # percentage of original output
            
            return SimulationResult(
                machine_id=machine_id,
                original_value=original_value,
                new_value=value,
                energy_impact=round(new_power - current_data.power, 2),
                output_impact=round(output_impact, 2)
            )
        
        return None

dss_engine = DSSEngine()
