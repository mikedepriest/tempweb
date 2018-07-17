import React, { Component } from 'react';
import TemperatureGauge from './TemperatureGauge';

export default class TemperatureGaugeContainer extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoaded: false,
            lastSensorReading: {
                "PublishTimestamp":"",
                "SensorId":"",
                "SensorName":"",
                "SensorDescription":"",
                "Temperature":0,
                "UOM":""
            },
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
        this.setState({ isLoaded: false, error: false });
        console.log(Date.now()+': reading api');
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

    handleSubmit(event) {
        alert('A form was submitted');
        event.preventDefault();
    }
    
    handleChange(event) {
        alert('A key was pressed');
    }

    render() {
        return(
            <TemperatureGauge sensorReading={this.state.lastSensorReading} />
        );
    }

}

