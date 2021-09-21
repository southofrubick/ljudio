import React from 'react'
import PlayVideo from './PlayVideo'

class MediaControls extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playlist: props.currentPlaylist,
            index: props.currentPlayIndex,
            isPlaying: props.isPlaying
        }
    }

    sendToParent = () => {
        this.props.updateMedia(this.state.playlist, this.state.index)
        setTimeout(() => {
            console.log(this.state.playlist[this.state.index].duration)
            this.props.timeFunction(this.state.playlist[this.state.index].duration)
        }, 500);
    }

    sendPlayToParent = (value) => {
        this.props.updateIsPlaying(value)
    }

    render() {
        return (
            <div id="media-controls">
                <button className="fa fa-fast-backward" onClick={() =>
                    skipOrRewind("rewind", this.state.index, this.state.playlist, this)}></button>
                <PlayOrPause isPlaying={this.state.isPlaying}
                    updateIsPlaying={this.sendPlayToParent} />
                <button className="fa fa-fast-forward" onClick={() =>
                    skipOrRewind("forward", this.state.index, this.state.playlist, this)}></button>
            </div>
        )
    }
}

export default MediaControls

function PlayOrPause(props) {
    function togglePlay(play) {
        if (play) {
            window.player.playVideo()
            props.updateIsPlaying(true)
        } else {
            window.player.pauseVideo()
            props.updateIsPlaying(false)
        }
    }
    return (
        <>
            {props.isPlaying ?
                <button className="fa fa-pause" onClick={() => togglePlay(false)}></button> :
                <button className="fa fa-play" onClick={() => togglePlay(true)}></button>}
        </>
    )
}
  
function skipOrRewind(type, idx, list, parent) {
    if (type === "rewind") {
        if (idx > 0) {
            PlayVideo(list[idx - 1].videoId)
            parent.setState({ index: idx - 1 }, function () {
                parent.sendToParent()
            })
            let parentEle = document.querySelector("#side-bar-playlist")
            let childEle = document.querySelector(".playing-now")
            if (document.querySelector(".playing-now") != null)
                document.querySelector(".playing-now").className = ""
            setTimeout(() => {
                let childIndex = Array.prototype.indexOf.call(parentEle.children, childEle)
                parentEle.children[childIndex - 1].className = "playing-now"
                parent.sendPlayToParent(true)
            }, 100);
        }
    }
    if (type === "forward") {
        if (list.length > idx + 1) {
            PlayVideo(list[idx + 1].videoId)
            parent.setState({ index: idx + 1 }, function () {
                parent.sendToParent()
            })
            let parentEle = document.querySelector("#side-bar-playlist")
            let childEle = document.querySelector(".playing-now")
            if (document.querySelector(".playing-now") != null)
                document.querySelector(".playing-now").className = ""
            setTimeout(() => {
                let childIndex = Array.prototype.indexOf.call(parentEle.children, childEle)
                parentEle.children[childIndex + 1].className = "playing-now"
                parent.sendPlayToParent(true)
            }, 100);
        }
    }
}
  