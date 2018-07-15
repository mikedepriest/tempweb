/* jshint esversion: 6 */

import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import './App.css';
// import the component
//import ReactSpeedometer from "react-d3-speedometer";
import JqxLinearGauge from './jqwidgets-react/react_jqxlineargauge.js';


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      isLoaded: false,
      sensorreadings: [],
      error: false,
    };
    // Create space for 10 sensors by default
    var i=0;
    for (i=0; i<10; i++) {
      this.state.sensorreadings.push(
        {
	        "PublishTimestamp":"",
          "SensorId":"",
          "SensorName":"",
          "SensorDescription":"",
          "Temperature":0,
          "UOM":""
        });
     };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.loadData(), 1000*60);
    this.loadData(); // also load one immediately
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  loadData() {
    this.setState({ isLoaded: false, error: false });
    console.log(Date.now()+': reading api');
    fetch('http://192.168.0.53:5000/sensorreadings')
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          sensorreadings: result.sensorreadings
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: false,
          error: true
        });
      }
    )
  }

  renderSpeedo(sensorreading) {
    var temp = sensorreading.Temperature;
    var tempR = temp.toFixed(1);
    var uom = sensorreading.UOM;
    var label = sensorreading.SensorName;
    var desc = sensorreading.SensorDescription+'<br/>'+sensorreading.SensorId;
    var sensorid = sensorreading.SensorId;

    let majorTicks = { size: '10%', interval: 10 };
        let minorTicks = { size: '5%', interval: 5, style: { 'stroke-width': 1, stroke: '#aaaaaa' } };
        let ranges =
            [
                { startValue: 50, endValue: 60, style: { fill: '#FFF157', stroke: '#FFF157' } },
                { startValue: 60, endValue: 75, style: { fill: '#FFA200', stroke: '#FFA200' } },
            ];
    if(this.state.isLoaded) {
     return (
      <div className="LinearGauge">
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
      </div>
     );
    } else {
     return (<div className="Speedo">Loading...</div>);
    }
  }

  render() {
    
    return (
      <div className="App">
        {
          this.state.sensorreadings.map((sensorreading) => this.renderSpeedo(sensorreading)) 
        }
      </div>
    );
  }
}

export default App;
