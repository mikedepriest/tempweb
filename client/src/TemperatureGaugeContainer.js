import React, { Component } from 'react';
import TemperatureGauge from './TemperatureGauge';
//import ReactTooltip from 'react-tooltip';
import Collapsible from 'react-collapsible';

export default class TemperatureGaugeContainer extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoaded: false,
            sensorReading: {
                PublishTimestamp:"",
                SensorId:"",
                SensorName:"",
                SensorDescription:"",
                Temperature:0,
                UOM:"",
                Max:9999,
                UCL:0,
                UWL:0,
                LWL:0,
                LCL:0,
                Min:-9999
            },
            sensorReadingUrl: this.props.host+this.props.readingApi+this.props.sensorId,
            sensorChangeUrl: this.props.host+this.props.changeApi+this.props.sensorId,
            error: false
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
                    sensorReading: result.sensorreading
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

    handleFormSubmit(e) {  
        e.preventDefault();
      
        const formPayload = {
          SensorId: this.state.sensorReading.SensorId,
          SensorName: this.state.sensorReading.SensorName,
          SensorDescription: this.state.sensorReading.SensorDescription,
          UOM: this.state.sensorReading.UOM,
          Max: this.state.sensorReading.Max,
          UCL: this.state.sensorReading.UCL,
          UWL: this.state.sensorReading.UWL,
          LWL: this.state.sensorReading.LWL,
          LCL: this.state.sensorReading.LCL,
          Min: this.state.sensorReading.Min,
        };
      
        console.log('Send this in a POST request:', formPayload);
        this.setState({ error: false });

        console.log('temperaturegaugecontainer.js: setting patch api for sensor '+formPayload.SensorId);
        fetch(this.state.sensorChangeUrl, {
            method: 'PATCH',
            body: JSON.stringify(formPayload),
            headers: { "Content-Type": "application/json; charset=utf-8" }
        })
        .then(response => response.json())
        .then(
            (result) => {
                console.log('PATCH succeeded');
                this.loadData();
            },
            (error) => {
                console.log('PATCH failed: '+error)
                this.setState({
                    isLoaded: false,
                    error: true
                });
            }
        )
    }

    handleInputChange(e) {
        let change = this.state.sensorReading;
        change[e.target.name] = Number(e.target.value);
        this.setState(change);
        console.log("new state: "+e.target.name+" value: "+e.target.value);
    }

    render() {
        if (this.state.isLoaded) {

            // Pointer and range color scheme:
            //          rangeMin  lcl      lwl     uwl      ucl  rangeMax
            //                     |        |       |        |      
            // range:       none   | yellow | green | yellow | none
            // pointer:     red    | orange | green | orange | red 
            let buttonColor = 'red';
            if ((this.state.sensorReading.Temperature < this.state.sensorReading.LCL)) buttonColor='red';
            if ((this.state.sensorReading.Temperature >= this.state.sensorReading.LCL) && (this.state.sensorReading.Temperature < this.state.sensorReading.LWL)) buttonColor='orange';
            if ((this.state.sensorReading.Temperature >= this.state.sensorReading.LWL) && (this.state.sensorReading.Temperature < this.state.sensorReading.UWL)) buttonColor='green';
            if ((this.state.sensorReading.Temperature >= this.state.sensorReading.UWL) && (this.state.sensorReading.Temperature <= this.state.sensorReading.UCL)) buttonColor='orange';
            if ((this.state.sensorReading.Temperature > this.state.sensorReading.UCL)) buttonColor='red';

            // Human factors: white text against red and green, black otherwise
            let buttonTextColor='white';
            if (buttonColor!=='green' && buttonColor!=='red') buttonTextColor='black';

            let tlabel = this.state.sensorReading.Temperature.toFixed(1)+' '+this.state.sensorReading.UOM;

            return(
                <div className="LinearGauge">
                <form id={this.state.sensorReading.SensorId} className='TemperatureGaugeForm' onSubmit={this.handleFormSubmit} >
                    <TemperatureGauge sensorReading={this.state.sensorReading} />
                    <Collapsible trigger={tlabel} triggerStyle={{background: buttonColor, color: buttonTextColor}}>
                        <p>
                        Range Max: <input name='Max' type='number' style={{width: '4em'}} value={this.state.sensorReading.Max} onChange={this.handleInputChange.bind(this)} />
                        </p>               
                        <p>
                        UCL: <input name='UCL' type='number' style={{width: '4em'}} value={this.state.sensorReading.UCL} onChange={this.handleInputChange.bind(this)} />
                        </p>               
                        <p>
                        UWL: <input name='UWL' type='number' style={{width: '4em'}} value={this.state.sensorReading.UWL} onChange={this.handleInputChange.bind(this)} />
                        </p>               
                        <p>
                        LWL: <input name='LWL' type='number' style={{width: '4em'}} value={this.state.sensorReading.LWL} onChange={this.handleInputChange.bind(this)} />
                        </p>               
                        <p>
                        LCL: <input name='LCL' type='number' style={{width: '4em'}} value={this.state.sensorReading.LCL} onChange={this.handleInputChange.bind(this)} />
                        </p>               
                        <p>
                        Range Min: <input name='Min' type='number' style={{width: '4em'}} value={this.state.sensorReading.Min} onChange={this.handleInputChange.bind(this)} />
                        </p>
                        <p>
                        {this.state.sensorReading.PublishTimestamp}
                        </p>
                        <button type='submit' value='Submit' />               
                    </Collapsible>
                </form>
                </div>
            );
        } else {
            return(null);
        }
    }
    

}

//<p data-tip={desc} data-for={sensorid}>{label}</p>
//<ReactTooltip multiline id={sensorid} />

