import React, { Component } from 'react';
import _ from 'lodash';

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFocused: false
        }
    }

    render() {
        return (
            <div className={`letter-input${
                    this.state.isFocused
                        ? ' input-focused'
                        : !_.isNull(this.props.error) ? ' input-error' : '' 
                 }`}
                 onFocus={() => {
                    this.setState({isFocused: true});
                    if (this.props.onFocus) {
                        this.props.onFocus(this.props.forwardedRef);
                    }
                 }}
                 onBlur={() => {
                    this.setState({isFocused: false});
                    if (this.props.onBlur) {
                        this.props.onBlur(this.props.forwardedRef);
                    }
                 }}>
                <h3>{this.props.label}: <sup> *</sup></h3>
                <input type='text' ref={this.props.forwardedRef} />
                {
                    !_.isNull(this.props.error) && !this.state.isFocused? (
                        <p className='error-message'>{this.props.error}</p>
                    ) : null
                }
            </div>
        )
    }
}

export default React.forwardRef((props, ref) => {
    return <Input {...props} forwardedRef={ref} />
});