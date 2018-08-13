import React, { Component } from 'react';
import HMIBar from './HMIBar';

export default class TemperatureGauge extends Component {
  
    
    render() {
        let theReading = this.props.sensorReading;

        let tempR = Number(theReading.Temperature.toFixed(1));

    
        
        return (
          
            <HMIBar 
              rangeMin={theReading.Min} rangeMax={theReading.Max} 
              lcl={theReading.LCL} lwl={theReading.LWL} uwl={theReading.UWL} ucl={theReading.UCL}
              value={tempR}
               />
          
         );
        
    }
}
//