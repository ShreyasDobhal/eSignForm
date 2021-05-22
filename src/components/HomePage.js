import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import firebase from '../firebase';
import {v4 as uuidv4} from 'uuid';
import SignatureCanvas from 'react-signature-canvas';
import CanvasOptions from './CanvasOptions';
import Input from './Input';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import _ from 'lodash';
import $ from 'jquery';
import jsPDF from 'jspdf';

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
            otherNames: [],
            showPDFPreview: false,
            downloadStart: false,
            data: null,
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

    signatureStarted = () => {
        _.forEach(this.inputRef, (ref) => {
            ref.current.blur();
        });
        this.setState({signCanvasFocused: true});
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

        // Check sign
        if (this.signCanvasInstance.current.isEmpty()) {
            error['sign'] = this.validateEnteredData('', 'sign');
        } else {
            error['sign'] = null;
        }

        // Update error field
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
            const date = new Date();
            data['date'] = date.toDateString() + ', ' + date.toLocaleTimeString();

            this.setState({data});

            this.setState({showPDFPreview: true});
            return;
            // Save data to DB
            this.firebaseRef.doc(id).set(data).then(()=> {
                this.setState({showPDFPreview: true});
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
            this.setState({
                letterStats: message,
                otherNames: _.map(names, (name) => name.name)
            });
        });
    }

    onSave = () => {
        this.setState({downloadStart: true}, () => {
            setTimeout(() => {
                window.print();
                this.setState({downloadStart: false});
            }, 1000);
        });
        // window.html2canvas = html2canvas;
        // const doc = document.getElementById('pdf-preview');
        // const pdf = new jsPDF();;
        // pdf.fromHTML(doc);
        // pdf.save();

        // const doc = new jsPDF();
        
        // doc.text("Hello World", 10, 10);
        // doc.save("a4.pdf");
        
        // const doc = new jsPDF("p", "mm", "a4");
        // const doc = new jsPDF();
        // doc.fromHTML(document.getElementById('pdf-preview').innerHTML, 15, 15, {
        //     width: 170,
        //     callback: () => {
        //         doc.save();
            
        // });
        // doc.output("dataurlnewwindow");
        // doc.save();
        // doc.setFontSize(8);

        // doc.addHTML($('#pdf-preview')[0], () => {
        //     doc.save('test.pdf');
        // })
        // doc.html(document.getElementById('pdf-preview').innerHTML, {
        //     callback: (doc) => {
        //         doc.save('test.pdf');
        //     },
        //     x: 10,
        //     y: 10
        // });

        // let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

        // mywindow.document.write(`<html><head><title>Abbott</title>`);
        // mywindow.document.write('</head><body >');
        // mywindow.document.write(document.getElementById('pdf-preview').innerHTML);
        // mywindow.document.write('</body></html>');

        // mywindow.document.close(); // necessary for IE >= 10
        // mywindow.focus(); // necessary for IE >= 10*/

        // mywindow.print();
        // mywindow.close();

    }

    render() {
        if (this.state.showPDFPreview) {
            return (
            <div className='App'>
                <div id='pdf-preview' className='letter-container'>
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
                    </div>
                    <div className='letter-preview'>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Name:</p>
                            <p className='letter-value'>{this.state.data?.['name']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Email:</p>
                            <p className='letter-value'>{this.state.data?.['email']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>UPI ID:</p>
                            <p className='letter-value'>{this.state.data?.['upi']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Employee ID:</p>
                            <p className='letter-value'>{this.state.data?.['eid']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Head Quarter:</p>
                            <p className='letter-value'>{this.state.data?.['hq']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Designation:</p>
                            <p className='letter-value'>{this.state.data?.['designation']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Mobile Number:</p>
                            <p className='letter-value'>{this.state.data?.['mobile']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Date:</p>
                            <p className='letter-value'>{this.state.data?.['date']}</p>
                        </div>
                        <div className='letter-value-container'>
                            <p className='letter-field'>Signature:</p>
                            <img className='letter-value' src={this.state.data?.['sign']} alt={this.state.data?.['name'] ?? 'sign'} />
                        </div>
                    </div>
                    {
                        !this.state.downloadStart ? (
                            <div className='letter-submit'>
                                <button className='submit-btn' onClick={this.onSave}>Print</button>
                            </div>
                        ) : null
                    }
                </div>
            </div>
            );
        }
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
                        <span><i className="fas fa-pencil-alt"></i></span>
                        <OverlayTrigger 
                            placement='bottom'
                            overlay={
                                <Tooltip>
                                    <div className='tooltip'>
                                        {_.concat(
                                            _.slice(_.map(_.uniq(this.state.otherNames), (name, i) => <p key={i}>{name}</p>), 0, 5),
                                            this.state.otherNames.length > 5 ? [<p key={5}>...</p>] : []
                                        )}
                                    </div>
                                </Tooltip>
                            }>
                            <span className='label-small'> {this.state.letterStats}</span>
                        </OverlayTrigger>
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
                            onBegin={this.signatureStarted}
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