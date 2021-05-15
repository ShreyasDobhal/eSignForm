import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import SignatureCanvas from 'react-signature-canvas';
import CanvasOptions from './CanvasOptions';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.signCanvasInstance = React.createRef();
    }

    handleSignClear = () => {
        this.signCanvasInstance.current.clear();
    }

    handleSignSubmit = () => {
        if (this.signCanvasInstance.current.isEmpty()) {
            alert('Please enter your signature');
        } else {
            alert('Your sign has been submitted');
        }
        this.signCanvasInstance.current.clear();
    }

    render() {
        return (
            <div className='App'>
                <div className='letter-container'>
                    <div>
                        <h1><img className='letter-icon' src='icon.png' />Abbott</h1>
                        <p>Hey</p>
                    </div>
                    <div className='sign-container'>
                        <h3>Signature:</h3>
                        <SignatureCanvas 
                            penColor='#2c3345'
                            ref={this.signCanvasInstance}
                            canvasProps={{
                                // width: 500,
                                // height: 500,
                                className: 'signCanvas'
                            }}
                            // onEnd={this.handleSignEnd} 
                        />
                        <CanvasOptions
                            onClear={this.handleSignClear}
                            onSubmit={this.handleSignSubmit}
                        />   
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;