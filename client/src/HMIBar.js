import React, { Component } from 'react';

export default class HMIBar extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        limitsChanged: false,
        barHeight: 0,
        divWidth: 0
      };

      //this.handleInputChange = this.handleInputChange.bind(this);

    };

    componentDidMount() {
        const height = this.divElement.clientHeight;
        const width = this.divElement.clientWidth;
        this.setState({ barHeight: height, divWidth: width });
    }

    render() {
        
        // Pointer and range color scheme:
        //          rangeMin  lcl      lwl     uwl      ucl  rangeMax
        //                     |        |       |        |      
        // range:       none   | yellow | green | yellow | none
        // pointer:     red    | orange | green | orange | red 

        // The SVG needs to be layered like this:
        //
        // rangeMax to rangeMin gray
        // rangeMax to lcl yellow
        // rangeMax to lwl green
        // rangeMax to uwl yellow
        // rangeMax to ucl gray
        //
        let scaleRange = this.props.rangeMax-this.props.rangeMin;
        let scaleUnit = this.state.barHeight / scaleRange ;

        let lclheight=this.state.barHeight-(this.props.lcl * scaleUnit);
        let lwlheight=this.state.barHeight-(this.props.lwl * scaleUnit);
        let uwlheight=this.state.barHeight-(this.props.uwl * scaleUnit);
        let uclheight=this.state.barHeight-(this.props.ucl * scaleUnit);
        // let lclheight=100-this.props.lcl;
        // let lwlheight=100-this.props.lwl;
        // let uwlheight=100-this.props.uwl;
        // let uclheight=100-this.props.ucl;
        let ptrypos=this.state.barHeight-(this.props.value * scaleUnit);
        let ptrxwidth=0.2*this.state.divWidth;
        let ptrywidth=ptrxwidth/2;
        
        let ptrpoints='0,'+ptrypos+' '+ptrxwidth+','+(ptrypos-ptrywidth)+' '+ptrxwidth+','+(ptrypos+ptrywidth);

        let pointerColor = 'red';
        if ((this.props.value < this.props.lcl)) pointerColor='red';
        if ((this.props.value >= this.props.lcl) && (this.props.value < this.props.lwl)) pointerColor='orange';
        if ((this.props.value >= this.props.lwl) && (this.props.value < this.props.uwl)) pointerColor='green';
        if ((this.props.value >= this.props.uwl) && (this.props.value <= this.props.ucl)) pointerColor='orange';
        if ((this.props.value > this.props.ucl)) pointerColor='red';

        return(
            <div ref={ (divElement) => this.divElement = divElement}>
            <br />
            <svg width={'20%'} height={'100%'}>
            </svg>
            <svg width={'60%'} height={'100%'} >
                <rect width={'100%'} height={'100%'} fill="red" />
                <line x1={0} y1={lclheight} x2={'100%'} y2={lclheight} style={{stroke: 'black', strokeWidth: 2}} /> 
                <rect width={'100%'} height={lclheight} fill="yellow" />
                <line x1={0} y1={lwlheight} x2={'100%'} y2={lwlheight} style={{stroke: 'black', strokeWidth: 2}} /> 
                <rect width={'100%'} height={lwlheight} fill="green" />
                <line x1={0} y1={uwlheight} x2={'100%'} y2={uwlheight} style={{stroke: 'black', strokeWidth: 2}} /> 
                <rect width={'100%'} height={uwlheight} fill="yellow" />
                <line x1={0} y1={uclheight} x2={'100%'} y2={uclheight} style={{stroke: 'black', strokeWidth: 2}} /> 
                <rect width={'100%'} height={uclheight} fill="red" />
            </svg>
            <svg width={'20%'} height={'100%'}>
                <polygon points={ptrpoints} style={{fill: pointerColor}}  />
            </svg>
            </div>
        );

    };
}
/* <div className='hmibarpointer' />
                <text fontSize={10} x={0} y={(this.state.barHeight-10)} >{this.props.rangeMin}</text>
                <text fontSize={10} x={0} y={(lclheight+5)} >{this.props.lcl}</text>
                <text fontSize={10} x={0} y={(lwlheight+5)} >{this.props.lwl}</text>
                <text fontSize={10} x={0} y={(uwlheight+5)} >{this.props.uwl}</text>
                <text fontSize={10} x={0} y={(uclheight+5)} >{this.props.ucl}</text>
                <text fontSize={10} x={0} y={10} >{this.props.rangeMax}</text>

*/
