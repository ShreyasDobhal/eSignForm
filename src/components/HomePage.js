import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import SignatureCanvas from 'react-signature-canvas';
import CanvasOptions from './CanvasOptions';
import Input from './Input';
import _ from 'lodash';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: {
                'email': null,
                'name': null,
                'upi': null,
                'eid': null,
                'hq': null,
                'mobile': null,
            }
        };

        this.inputRef = {
            'email': React.createRef(),
            'name': React.createRef(),
            'upi': React.createRef(),
            'eid': React.createRef(),
            'hq': React.createRef(),
            'mobile': React.createRef()
        }
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

    validateInput = (element) => {
        const field = _.find(_.keys(this.inputRef), (field) => this.inputRef[field] === element);
        const inputElement = element.current;
        if (_.isEmpty(inputElement.value)) {
            this.setState({
                error: {
                    ...this.state.error,
                    [field]: 'This field cannot be empty'
                }
            });
        } else if (!_.isNull(this.state.error[field])) {
            this.setState({
                error: {
                    ...this.state.error,
                    [field]: null
                }
            });
        }
        console.log(field, element);
    }

    render() {
        return (
            <div className='App'>
                <div className='letter-container'>
                    <div className='letter-header'>
                        <h1><img className='letter-icon' src='icon.png' alt='Abbott logo' />Abbott</h1>
                        <p>All India Abbott Employees Union</p>
                    </div>
                    <div className='letter-body'>
                        <p><b>Subject: </b>Comred Amit Mehta continue as a President.</p>
                        <p>
                            I confirm my approval that Com. Amit Mehta continue as a president
                            of Abbott all India Employee's union and to give his honorary
                            service even after his retirement.
                        </p>
                    </div>
                    <div className='letter-form'>
                        <Input 
                            ref={this.inputRef['email']}
                            label='Email'
                            error={this.state.error['email']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['name']} 
                            label='Name'
                            error={this.state.error['name']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['upi']} 
                            label='UPI ID' 
                            error={this.state.error['upi']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['eid']} 
                            label='Employee Id' 
                            error={this.state.error['eid']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['hq']} 
                            label='Head Quarter' 
                            error={this.state.error['hq']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['mobile']} 
                            label='Mobile Number' 
                            error={this.state.error['mobile']}
                            onBlur={this.validateInput} />
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