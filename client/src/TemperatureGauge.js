import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Collapsible from 'react-collapsible';
import JqxLinearGauge from './jqwidgets-react/react_jqxlineargauge';

export default class TemperatureGauge extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        temp: 0
      }
    };

    componentDidMount() {
      this.setState();
    }
    shouldComponentUpdate(nextProps) {
        return (this.props.sensorReading.Temperature !== nextProps.sensorReading.Temperature);
    }

    handleSubmit(event) {
      alert('A form was submitted');
      event.preventDefault();
    }
  
    handleChange(event) {
      alert('A key was pressed');
    }

    render() {
        let tempR = Number(this.props.sensorReading.Temperature.toFixed(1));
        let uom =  this.props.sensorReading.UOM;
        let tlabel = tempR+" "+uom;
        let label =  this.props.sensorReading.SensorName;
        let desc =  this.props.sensorReading.SensorDescription+'<br/>'+this.props.sensorReading.SensorId;
        let sensorid =  this.props.sensorReading.SensorId;
    
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
                min={0} max={100} value={tempR}
                pointer={{ pointerType: 'arrow', size: '20%' }}
                colorScheme={'scheme05'} orientation={'vertical'}
                labels={{ interval: 10 }} ticksMajor={majorTicks}
                ticksMinor={minorTicks} ranges={ranges}
              />
              <p data-tip={desc} data-for={sensorid}>{label}</p>
              <ReactTooltip multiline id={sensorid} />
              <Collapsible trigger={tlabel}>
                
                <p>{tempR} {uom}</p>
                <input type="text" value={sensorid}/>
               
                
              </Collapsible>
            </form>
          </div>
         );
        
    }
}
// <ReactTooltip multiline id={sensorid} />