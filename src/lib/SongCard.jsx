import React from 'react'
import { Redirect } from 'react-router-dom'

class SongCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      song: props.song,
      Redirect: null
    }
  }

  getMinutesAndSeconds = () => {
    let minutes = Math.floor(this.state.song.duration / 60000)
    let seconds = (this.state.song.duration - (1000 * minutes * 60)) / 1000

    if (this.state.song.duration != null)
      return minutes + ":" + seconds
    if (this.state.song.trackCount != null)
      return this.state.song.trackCount + " Tracks"
  }

  handleClick(song, target) {
    this.sendToParent(song, target)
    if (song.type === "artist") {
      this.setState({ Redirect: "/" + song.videoId + "/artist" })
    }
    if (song.type === "playlist") {
      this.setState({ Redirect: "/" + song.videoId + "/playlist" })
    }
  }
  
  //SPLIT: Does everything need to be sent to parent?
  sendToParent = async (song, target) => {
    target.disabled = true
    if (song.type === "song") {
      this.props.timeFunction(this.state.song.duration)
      this.props.addSongToPlaylist(song)
    }
    if (song.type === "playlist") {
      console.log(song.videoId)

      //DEPRICATED: This adds the entire playlist into the players playlist - Could be useful
      /*
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
      console.log(newId)
      this.props.addSongToPlaylist(newResults)
      */
    }
    if (song.type === "artist") {
      this.props.setArtistId(song.videoId)
    }
  }

  handleShare = (event, song) => {
    event.stopPropagation()
    if (song.type === "song") {
      navigator.clipboard.writeText("localhost:3000/" + song.videoId + "/" + song.type)
      alert("Song URL copied to clipboard")
    }
    else if (song.type === "artist") {
      navigator.clipboard.writeText("localhost:3000/" + song.videoId + "/" + song.type)
      alert("Artist URL copied to clipboard")
    }
    else {
      navigator.clipboard.writeText("localhost:3000/" + song.videoId.slice(2) + "/" + song.type)
      alert("Playlist URL copied to clipboard")
    }
  }

  render(props) {
    if (this.state.Redirect) {
      return <Redirect to={this.state.Redirect} />
    }
    return (
      <>
        <div className="song-card" onClick={(e) => {
          this.handleClick(this.state.song, e.target)
        }}>
          <div className="song-image">
            <img src={this.state.song.thumbnail} alt="" />
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
          <button className="fa fa-share-alt" onClick={(e) => this.handleShare(e, this.state.song)}></button>
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