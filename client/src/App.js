/* jshint esversion: 6 */

import React, { Component } from 'react';
import TemperatureGaugeContainer from './TemperatureGaugeContainer';


import './App.css';

// Global constants
const sensorHost = 'http://localhost:5001';
// const sensorHost = 'http://192.168.0.53:5001';
const sensorListApi = '/v1/sensors';
const sensorChangeApi = '/v1/sensors/id/';
const sensorReadingApi = '/v1/sensorreadings/id/';
const sensorReadingTemplate = {
  "PublishTimestamp":"",
  "SensorId":"",
  "SensorName":"",
  "SensorDescription":"",
  "Temperature":0,
  "UOM":"",
  "Min":0,
  "LCL":50,
  "LWL":60,
  "UWL":70,
  "UCL":80,
  "Max":90
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
      sensorsUrl: sensorHost+sensorListApi
    };
    // Initialize one sensor for display
    this.state.sensorReadings.push(sensorReadingTemplate);
  }

  componentDidMount() {
    this.loadData(); 
  }

  loadData() {
    this.setState({ isLoaded: false, error: false });
    console.log('app.js: reading sensors api');
    fetch(this.state.sensorsUrl)
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

  renderGaugeContainer(sensor) {
    var sensorid = sensor.SensorId;

    if(this.state.isLoaded) {
     return (
      <TemperatureGaugeContainer host={sensorHost} changeApi={sensorChangeApi} readingApi={sensorReadingApi} sensorId={sensorid} />
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
