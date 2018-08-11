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
        //sensorReading: props.sensorReading,
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
      let change = this.state.sensorReading;
      change[e.target.name] = Number(e.target.value);
      this.setState(change);
      this.setState({limitsChanged: true});
      console.log("new state: "+e.target.name+" value: "+e.target.value);
      this.forceUpdate();
    }

    render() {
        let theReading = this.props.sensorReading;

        let tempR = Number(theReading.Temperature.toFixed(1));
        let uom =  theReading.UOM;
        let tlabel = tempR+" "+uom;
        let label =  theReading.SensorName;
        let desc =  theReading.SensorDescription+'<br/>'+theReading.SensorId;
        let sensorid =  theReading.SensorId;
    
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
        if ((tempR < theReading.LCL)) buttonColor='red';
        if ((tempR >= theReading.LCL) && (tempR < theReading.LWL)) buttonColor='orange';
        if ((tempR >= theReading.LWL) && (tempR < theReading.UWL)) buttonColor='green';
        if ((tempR >= theReading.UWL) && (tempR <= theReading.UCL)) buttonColor='orange';
        if ((tempR > theReading.UCL)) buttonColor='red';

        // Human factors: white text against red and green, black otherwise
        let buttonTextColor='white';
        if (buttonColor!=='green' && buttonColor!=='red') buttonTextColor='black';

        return (
          <div className="LinearGauge">
            <form id={sensorid}>
            <HMIBar 
              rangeMin={theReading.Min} rangeMax={theReading.Max} 
              lcl={theReading.LCL} lwl={theReading.LWL} uwl={theReading.UWL} ucl={theReading.UCL}
              value={tempR}
               />
              <p data-tip={desc} data-for={sensorid}>{label}</p>
              <ReactTooltip multiline id={sensorid} />
              <Collapsible trigger={tlabel} triggerStyle={{background: buttonColor, color: buttonTextColor}}>
                <p>
                  Range Max: <input name='Max' type='number' style={{width: '4em'}} value={theReading.Max} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  UCL: <input name='UCL' type='number' style={{width: '4em'}} value={theReading.UCL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  UWL: <input name='UWL' type='number' style={{width: '4em'}} value={theReading.UWL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  LWL: <input name='LWL' type='number' style={{width: '4em'}} value={theReading.LWL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  LCL: <input name='LCL' type='number' style={{width: '4em'}} value={theReading.LCL} onChange={this.handleInputChange.bind(this)} />
                </p>               
                <p>
                  Range Min: <input name='Min' type='number' style={{width: '4em'}} value={theReading.Min} onChange={this.handleInputChange.bind(this)} />
                </p>
                <p>
                  {theReading.PublishTimestamp}
                </p>               
              </Collapsible>
            </form>
          </div>
         );
        
    }
}
//