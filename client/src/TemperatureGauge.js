import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import JqxLinearGauge from './jqwidgets-react/react_jqxlineargauge';

export default class TemperatureGauge extends Component {
  
    // constructor(props) {
    //   super(props);
    // };

    render() {
        var temp = this.props.sensorReading.Temperature;
        var tempR = temp.toFixed(1);
        var uom =  this.props.sensorReading.UOM;
        var label =  this.props.sensorReading.SensorName;
        var desc =  this.props.sensorReading.SensorDescription+'<br/>'+this.props.sensorReading.SensorId;
        var sensorid =  this.props.sensorReading.SensorId;
    
        let majorTicks = { size: '10%', interval: 10 };
            let minorTicks = { size: '5%', interval: 5, style: { 'stroke-width': 1, stroke: '#aaaaaa' } };
            let ranges =
                [
                    { startValue: 50, endValue: 60, style: { fill: '#FFF157', stroke: '#FFF157' } },
                    { startValue: 60, endValue: 75, style: { fill: '#FFA200', stroke: '#FFA200' } },
                ];
         return (
          <div className="LinearGauge">
            <form id={sensorid}>
              <JqxLinearGauge
                min={0} max={100} value={temp}
                pointer={{ pointerType: 'arrow', size: '20%' }}
                colorScheme={'scheme05'} orientation={'vertical'}
                labels={{ interval: 10 }} ticksMajor={majorTicks}
                ticksMinor={minorTicks} ranges={ranges}
              />
              <p data-tip={desc} data-for={sensorid}>{label}</p>
              <p>{tempR} {uom}</p>
              <ReactTooltip multiline id={sensorid} />
              <input type="text" value={sensorid}/>
            </form>
          </div>
         );
        
    }
}
