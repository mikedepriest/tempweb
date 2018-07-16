/* jshint esversion: 6 */

import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import './App.css';
import JqxLinearGauge from './jqwidgets-react/react_jqxlineargauge.js';

// Global constants
const sensorsUrl = 'http://192.168.0.53:5000/v1/sensors';
const sensorReadingsUrl = 'http://192.168.0.53:5000/v1/sensorreadings';
const sensorsMaxCount = 10;

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      response: '',
      error: false,
      isLoaded: false,
      sensors: [],
      sensorReadings: [],
      displayConfig: {

      }
    };
    // Create space for sensors
    var i=0;
    for (i=0; i<sensorsMaxCount; i++) {
      this.state.sensorReadings.push(
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
    fetch(sensorReadingsUrl)
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          sensorReadings: result.sensorreadings
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

  renderSpeedo(sensorReading) {
    var temp = sensorReading.Temperature;
    var tempR = temp.toFixed(1);
    var uom = sensorReading.UOM;
    var label = sensorReading.SensorName;
    var desc = sensorReading.SensorDescription+'<br/>'+sensorReading.SensorId;
    var sensorid = sensorReading.SensorId;

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
          this.state.sensorReadings.map((sensorreading) => this.renderSpeedo(sensorreading)) 
        }
      </div>
    );
  }
}

export default App;
