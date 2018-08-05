import React, { Component } from 'react';
import TemperatureGauge from './TemperatureGauge';

export default class TemperatureGaugeContainer extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoaded: false,
            lastSensorReading: [{
                "PublishTimestamp":"",
                "SensorId":"",
                "SensorName":"",
                "SensorDescription":"",
                "Temperature":0,
                "UOM":"",
                "Max":9999,
                "UCL":0,
                "UWL":0,
                "LWL":0,
                "LCL":0,
                "Min":-9999,
            }],
            sensorReadingUrl: this.props.URL+this.props.sensorId
        };
    };

    componentDidMount() {
        this.intervalId = setInterval(() => this.loadData(), 1000*60);
        this.loadData(); // also load one immediately
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    loadData() {
        this.setState({ error: false });
        console.log('temperaturegaugecontainer.js: reading api for sensor '+this.props.sensorId);
        fetch(this.state.sensorReadingUrl)
        .then(response => response.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    lastSensorReading: result.sensorreadings
                });
            },
            (error) => {
                this.setState({
                    isLoaded: false,
                    error: true
                });
            }
        )
    }

    render() {
        if (this.state.isLoaded) {
            return(<TemperatureGauge sensorReading={this.state.lastSensorReading} /> );
        } else {
            return(null);
        }
    }
    

}

