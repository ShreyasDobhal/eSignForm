import React, { Component } from 'react';

class CanvasOptions extends Component {
    render() {
        return (
            <div className='canvas-icon-container'>
                <span className='canvas-icon' onClick={this.props.onClear}><i class="fas fa-eraser"></i></span>
            </div>
        );
    }
}

export default CanvasOptions;