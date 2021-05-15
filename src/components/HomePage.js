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
                'designation': null,
                'mobile': null,
                'sign': null
            },
            signCanvasFocused: false
        };

        this.inputRef = {
            'email': React.createRef(),
            'name': React.createRef(),
            'upi': React.createRef(),
            'eid': React.createRef(),
            'hq': React.createRef(),
            'designation': React.createRef(),
            'mobile': React.createRef()
        }
        this.signCanvasInstance = React.createRef();
    }

    handleSignClear = () => {
        this.signCanvasInstance.current.clear();
        this.setState({signCanvasFocused: false});
    }

    validateEnteredData = (data, field) => {
        if (_.isEmpty(data)) {
            return 'This field cannot be empty';
        }
        return null;
    }

    validateInput = (element) => {
        const field = _.find(_.keys(this.inputRef), (field) => this.inputRef[field] === element);
        const inputElement = element.current;
        this.setState({
            error: {
                ...this.state.error,
                [field]: this.validateEnteredData(inputElement.value, field)
            }
        });
    }

    onSubmit = () => {
        // Check all input elements
        const error = _.cloneDeep(this.state.error);
        _.forEach(this.inputRef, (ref, field) => {
            const inputElement = ref.current;
            error[field] = this.validateEnteredData(inputElement.value, field);
        });

        if (this.signCanvasInstance.current.isEmpty()) {
            error['sign'] = this.validateEnteredData('', 'sign');
        } else {
            error['sign'] = null;
        }

        this.setState({error});

        const isValid = _.reduce(error, (result, value) => {
            result = result && _.isNull(value);
            return result;
        }, true);

        if (isValid) {
            // Submit the form
            alert('Form submitted successfully');
        } else {
            // Do nothing
            alert('Fill all details');
        }
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
                            ref={this.inputRef['name']} 
                            label='Name'
                            error={this.state.error['name']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['email']}
                            label='Email'
                            error={this.state.error['email']}
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
                            ref={this.inputRef['designation']} 
                            label='Designation' 
                            error={this.state.error['designation']}
                            onBlur={this.validateInput} />
                        <Input 
                            ref={this.inputRef['mobile']} 
                            label='Mobile Number' 
                            error={this.state.error['mobile']}
                            onBlur={this.validateInput} />
                    </div>
                    <div className={`sign-container${
                            this.state.signCanvasFocused
                                ? ' sign-focused'
                                : this.state.error['sign'] ? ' sign-error' : ''}`} >
                        <h3>Signature:</h3>
                        <SignatureCanvas 
                            penColor='#2c3345'
                            ref={this.signCanvasInstance}
                            canvasProps={{
                                className: this.state.signCanvasFocused ? 'signCanvas' : 'signCanvasPlaceholder'
                            }}
                            clearOnResize={false}
                            onBegin={() => this.setState({signCanvasFocused: true})}
                        />
                    </div>
                    <CanvasOptions onClear={this.handleSignClear} />   
                    <div className='letter-submit'>
                        <button className='submit-btn' onClick={this.onSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;