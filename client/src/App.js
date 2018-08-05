/* jshint esversion: 6 */

import React, { Component } from 'react';
import TemperatureGaugeContainer from './TemperatureGaugeContainer';


import './App.css';

// Global constants
// const sensorsUrl = 'http://192.168.0.53:5000/v1/sensors';
// const sensorReadingsUrl = 'http://192.168.0.53:5000/v1/sensorreadings/id/';
const sensorsUrl = 'http://localhost:5001/v1/sensors';
const sensorReadingsUrl = 'http://localhost:5001/v1/sensorreadings/id/';
const sensorReadingTemplate = {
  "PublishTimestamp":"",
  "SensorId":"",
  "SensorName":"",
  "SensorDescription":"",
  "Temperature":0,
  "UOM":""
};
const sensorLimitTemplate = {
  "SensorId":"",
  "LowLimit":50,
  "LowAlarm":60,
  "Target":70,
  "HighAlarm":80,
  "HighLimit":90
};

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      response: '',
      error: false,
      isLoaded: false,
      sensors: [],
      sensorReadings: [],
      sensorLimits: [],
      displayConfig: {

      }
    };
    // Initialize one sensor for display
    this.state.sensorReadings.push(sensorReadingTemplate);
    this.state.sensorLimits.push(sensorLimitTemplate);
  }

  componentDidMount() {
    //this.intervalId = setInterval(() => this.loadData(), 1000*60);
    this.loadData(); // also load one immediately
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  loadData() {
    this.setState({ isLoaded: false, error: false });
    console.log('app.js: reading sensors api');
    fetch(sensorsUrl)
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          sensors: result.sensorList
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

  handleSubmit(event) {
    alert('A form was submitted');
    event.preventDefault();
  }

  handleChange(event) {
    alert('A key was pressed');
  }

  renderGaugeContainer(sensor) {
    var sensorid = sensor.SensorId;

    if(this.state.isLoaded) {
     return (
      <TemperatureGaugeContainer URL={sensorReadingsUrl} sensorId={sensorid} />
     );
    } else {
     return (<p>Loading...</p>);
    }
  }

  

  render() {
    
    return (
      <div className="App">
        {
          this.state.sensors.map((sensor) => this.renderGaugeContainer(sensor)) 
        }
      </div>
    );
  }
}

export default App;
