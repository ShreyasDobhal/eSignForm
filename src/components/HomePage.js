import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import firebase from '../firebase';
import {v4 as uuidv4} from 'uuid';
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
            signCanvasFocused: false,
            letterStats: null,
            data: null
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

        this.firebaseRef = firebase.firestore().collection('names');
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
            const trimmedCanvas = this.signCanvasInstance.current.getTrimmedCanvas();
            const sign = trimmedCanvas.toDataURL('image/png');

            const id = uuidv4();
            const data = _.reduce(this.inputRef, (result, ref, field) => {
                result[field] = ref.current.value;
                return result;
            }, {});
            data['sign'] = sign;

            // Save data to DB
            this.firebaseRef.doc(id).set(data).then(()=> {
                alert('Data saved');
            }).catch((err) => {
                console.log(err);
            });
        } else {
            // Do nothing
            alert('Fill all details');
        }
    }

    componentDidMount() {
        this.firebaseRef.onSnapshot((querySnapshot) => {
            const names = [];
            querySnapshot.forEach((doc) => {
                names.push(doc.data());
            });
            let message;
            if (_.isEmpty(names)) {
                message = `Be the first to sign this document`;
            } else if (names.length === 1) {
                message = `${names[0].name} has already signed this document`;
            } else {
                message = `${_.sample(names).name} and ${names.length - 1} others have already signed this document`;
            }
            this.setState({letterStats: message});
        });
    }

    handleClick = () => {
        // Subscription based query
        // this.firebaseRef.onSnapshot((querySnapshot) => {
        //     const items = [];
        //     querySnapshot.forEach((doc) => {
        //         items.push(doc.data());
        //     });
        //     this.setState({data: items});
        //     console.log(items);
        // });

        // Get request based query
        this.firebaseRef.get().then((item) => {
            const items = item.docs.map((doc) => doc.data());
            this.setState({data: items});
            console.log(items);
        })
    }

    handleSave = () => {
        const name = {
            name: 'Shreyas',
            email: 'dont@know.com'
        }
        this.firebaseRef.doc(uuidv4()).set(name).catch((err) => {
            console.log(err);
        })
    }

    render1() {
        return (
            <div>
                <button onClick={this.handleSave}>Click</button>
                <p>{this.state.data?.[0]?.name}</p>
            </div>
        );
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
                    <div className='letter-stats'>
                        <span><i class="fas fa-pencil-alt"></i></span>
                        <span className='label-small'> {this.state.letterStats}</span>
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