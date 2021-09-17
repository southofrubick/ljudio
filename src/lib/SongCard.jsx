import React from 'react'
import PlayVideo from './PlayVideo'

function SongCard(props) {
    let minutes = null
    let seconds = null
    let album = props.album
    if (album === props.artist) {
      album = null
    }
    if(props.duration != null){
      minutes = Math.floor(props.duration / 1000 / 60)
      seconds = (props.duration - (1000 * minutes * 60)) / 1000
      minutes = minutes + ":"
    }
    function handleClick() {
      if (props.type === "song") {
        PlayVideo(props.videoId)
      }
      else if (props.type === "playlist"){
        console.log("Clicked playlist " + props.name)
      }
      else{
        console.log("Clicked artist " + props.name)
      }
    }
  
    return (
      <>
        <div className="song-card" onClick={() => handleClick()}>
          <div className="song-image">
            <img src={props.thumbnail} />
          </div>
          <div className="about">
            <div className="image-overlay"></div>
            <div className="primary-desc">
              <span>{props.name}</span>
            </div>
            <div className="secondary-desc">
              <div>
                <span>{props.artist} </span>
                <span>{album} </span>
              </div>
              <div>
                <span>{minutes}{seconds}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default SongCard