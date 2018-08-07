import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Collapsible from 'react-collapsible';
import HMIBar from './HMIBar';

export default class TemperatureGauge extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        sensorReading: {
          "PublishTimestamp":"",
          "SensorId":"",
          "SensorName":"",
          "SensorDescription":"",
          "Temperature":0,
          "UOM":"",
          "Max":0,
          "UCL":0,
          "UWL":0,
          "LWL":0,
          "LCL":0,
          "Min":0
        },
        limitsChanged: false
      };

    };

    componentDidMount() {
      this.setState(
        {sensorReading: this.props.sensorReading}
      );
    }

    handleSubmit(event) {
      alert('A form was submitted');
      event.preventDefault();
    }
  
    handleInputChange(e) {
      let change = {}
      change[e.target.name] = Number(e.target.value);
      this.setState(change);
      this.setState({limitsChanged: true});
      console.log("new state: "+e.target.name+" value: "+e.target.value);
      this.forceUpdate();
    }

    render() {
        let tempR = Number(this.state.sensorReading.Temperature.toFixed(1));
        let uom =  this.state.sensorReading.UOM;
        let tlabel = tempR+" "+uom;
        let label =  this.state.sensorReading.SensorName;
        let desc =  this.state.sensorReading.SensorDescription+'<br/>'+this.state.sensorReading.SensorId;
        let sensorid =  this.state.sensorReading.SensorId;
    
        //  let majorTicks = { size: '10%', interval: 10 };
        //  let minorTicks = { size: '5%', interval: 5, style: { 'stroke-width': 1, stroke: '#aaaaaa' } };
        // Pointer and range color scheme:
        //          rangeMin  lcl      lwl     uwl      ucl  rangeMax
        //                     |        |       |        |      
        // range:       none   | yellow | green | yellow | none
        // pointer:     red    | orange | green | orange | red 
        // let ranges =
        //   [
        //       { startValue: this.state.lcl, endValue: this.state.lwl, style: { fill: 'yellow', stroke: 'yellow' } }, //LCL-LWL
        //       { startValue: this.state.lwl, endValue: this.state.uwl, style: { fill: 'green', stroke: 'green' } }, //LWL-UWL
        //       { startValue: this.state.uwl, endValue: this.state.ucl, style: { fill: 'yellow', stroke: 'yellow' } }, //UWL-UCL
        //   ];
        let buttonColor = 'red';
        if ((tempR < this.state.sensorReading.LCL)) buttonColor='red';
        if ((tempR >= this.state.sensorReading.LCL) && (tempR < this.state.sensorReading.LWL)) buttonColor='orange';
        if ((tempR >= this.state.sensorReading.LWL) && (tempR < this.state.sensorReading.UWL)) buttonColor='green';
        if ((tempR >= this.state.sensorReading.UWL) && (tempR <= this.state.sensorReading.UCL)) buttonColor='orange';
        if ((tempR > this.state.sensorReading.UCL)) buttonColor='red';

        // Human factors: white text against red and green, black otherwise
        let buttonTextColor='white';
        if (buttonColor!=='green' && buttonColor!=='red') buttonTextColor='black';

        return (
          <div className="LinearGauge">
            <form id={sensorid}>
            <HMIBar 
              rangeMin={this.state.sensorReading.Min} rangeMax={this.state.sensorReading.Max} 
              lcl={this.state.sensorReading.LCL} lwl={this.state.sensorReading.LWL} uwl={this.state.sensorReading.UWL} ucl={this.state.sensorReading.UCL}
              value={tempR}
               />
              <p data-tip={desc} data-for={sensorid}>{label}</p>
              <ReactTooltip multiline id={sensorid} />
              <Collapsible trigger={tlabel} triggerStyle={{background: buttonColor, color: buttonTextColor}}>
                <p>
                  Range Max: <input name='Max' type='number' value={this.state.sensorReading.Max} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  UCL: <input name='UCL' type='number' value={this.state.sensorReading.UCL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  UWL: <input name='UWL' type='number' value={this.state.sensorReading.UWL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  LWL: <input name='LWL' type='number' value={this.state.sensorReading.LWL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  LCL: <input name='LCL' type='number' value={this.state.sensorReading.LCL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  Range Min: <input name='Min' type='number' value={this.state.sensorReading.Min} onChange={this.handleInputChange.bind(this)} />
                </p>
                <p>
                  {this.state.sensorReading.PublishTimestamp}
                </p>               
              </Collapsible>
            </form>
          </div>
         );
        
    }
}
//