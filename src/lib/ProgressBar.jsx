import React from 'react'

class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            duration: props.duration,
            currentTime: props.currentTime
        }
    }
    render() {
        return (
            <div id="p-bar">
                <progress id="progress-bar"
                    max={this.state.duration}
                    value={this.state.currentTime} />
                <span>
                    {Math.floor(this.state.currentTime / 60) + ":" + 
                    (Math.floor(this.state.currentTime - Math.floor(this.state.currentTime / 60) * 60))}/
                    {Math.floor(this.state.duration / 60) + ":" +
                        (this.state.duration - Math.floor(this.state.duration / 60) * 60)}</span>
            </div>
        )
    }
}

export default ProgressBar