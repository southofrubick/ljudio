import React from 'react'

class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            duration: props.duration,
            currentTime: props.currentTime
        }
    }

    skipTo = (event) => {
        event.stopPropagation()
        let mouseX = event.clientX
        
        function lerp(start, end, pos) {
            let newPos = ((pos - 96) / 100) / 1535
            return (start * (1 - newPos) + end * newPos).toFixed(3)
        }

        let newTime = (lerp(0, this.state.duration, mouseX) * 100).toFixed(0)
        window.player.seekTo(newTime, true)
        this.props.newTime(this.state.duration * 1000)
    }

    render() {
        return (
            <div id="p-bar">
                <progress id="progress-bar"
                    max={this.state.duration}
                    value={this.state.currentTime}
                    onClick={(e) => this.skipTo(e) }/>
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