import React from 'react'
import PlayVideo from './PlayVideo'

class SongCard extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      song: props.song,
    }
  }

  getMinutesAndSeconds = () => {
    let minutes = Math.floor(this.state.song.duration / 60000)
    let seconds = (this.state.song.duration - (1000 * minutes * 60)) / 1000

    if(this.state.song.duration != null)
      return minutes + ":" + seconds
    if (this.state.song.trackCount != null)
      return this.state.song.trackCount + " Tracks"
  }
  
  //SPLIT: Does everything need to be sent to parent?
  sendToParent = async (song, target) => {
    target.disabled = true
    if (song.type === "song") {
      this.props.timeFunction(this.state.song.duration)
      this.props.addSongToPlaylist(song)
    }
    if (song.type === "playlist") {
      let songList = []
      let browseId = song.videoId.slice(2)

      const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/playlist/' + browseId)
        .then(response => response.json())
        .then(data => songList.push(data))
        
      let newResults = []
      let counter = songList[0].content.length
      if (counter > 20)
        counter = 20
      for (let i = 0; i < counter; i++) {
        if (!Array.isArray(songList[0].content[i].videoId)) {
          newResults.push({
            videoId: songList[0].content[i].videoId,
            id: songList[0].content[i].videoId,
            artist: songList[0].content[i].author.name,
            name: songList[0].content[i].name,
            thumbnail: songList[0].content[i].thumbnails.url,
            duration: songList[0].content[i].duration,
            type: songList[0].content[i].type
          })
        }
      }
      console.log(newResults)
      this.props.addSongToPlaylist(newResults)
    }
  }

  render(props) {
    return (
      <>
        <div className="song-card" onClick={(e) => {
          this.sendToParent(this.state.song, e.target)
        }}>
          <div className="song-image">
            <img src={this.state.song.thumbnail}/>
          </div>
          <div className="about">
            <div className="image-overlay" />
            <div className="primary-desc">
              <span>{this.state.song.name}</span>
            </div>
            <div className="secondary-desc">
              <div>
                <span>{this.state.song.artist}</span>
                <span>{this.state.song.album}</span>
              </div>
              <div>
                <span>{this.getMinutesAndSeconds()}</span>
              </div>
            </div>
          </div>

        </div>
      </>
    )
  }
}

export default SongCard


//DEPRICATED
/*
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
            <img src={props.thumbnail} alt=""/>
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
*/