import React from 'react'
import SongCard from './lib/SongCard'
import SearchBar from './lib/SearchBar'
import ProgressBar from './lib/ProgressBar'
import PlayVideo from './lib/PlayVideo'

//TODO: Add view for clicked playlist (what i did was dumb, but could be useful)
//TODO: The same as above, but for artists
//TODO: Give songs, artists and playlists independent urls - searchParam that fetches from API
//TODO: Time on song sets to where on timeline you click

//SPLIT: Turn into smaller components.. He getting chonky
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      songResults: [],
      artistResults: [],
      playlistResults: [],
      currentTime: 0,
      duration: 100,
      isPlaying: true,
      selectedCategory: 'songs',
      currentPlaylist: [],
      currentPlayIndex: 0
    }
  }

  handleSearchUpdate = (songs, artists, playlists) => {
    this.setState({ songResults: songs })
    this.setState({ artistResults: artists })
    this.setState({ playlistResults: playlists })
  }

  handleTimers = (duration) => {
    setTimeout(() => {
      let i = 0
      let self = this
      function loop() {
        setTimeout(() => {
          self.setState({ currentTime: window.player.getCurrentTime() })
          if (i < duration)
            loop()
        }, 100);
      }

      loop()
    }, 500);
    this.setState({ duration: duration / 1000 })
  }

  updateIsPlaying = (play) => {
    this.setState({ isPlaying: play })
  }

  updateSelectedCategory(whatCat) {
    this.setState({ selectedCategory: whatCat },
      function () {
        document.getElementsByClassName("selected")[0].className = ""
        if (whatCat === "songs") {
          document.querySelector(".category-select").children[0].className = "selected"
        }
        else if (whatCat === "artists") {
          document.querySelector(".category-select").children[1].className = "selected"
        }
        else {
          document.querySelector(".category-select").children[2].className = "selected"
        }
      })
  }

  //UPDATE:
  addSongToPlaylist = (songs) => {
    let newPlaylist = [...this.state.currentPlaylist]

    if (Array.isArray(songs)) {
      songs.forEach(song => {
        newPlaylist.push(song)
      });
    }
    else {
      newPlaylist.push(songs)
      PlayVideo(songs.videoId)
      this.setState({ currentPlayIndex: this.state.currentPlaylist.length })
    }
    let currentPlaylist = newPlaylist

    let counter = []
    currentPlaylist.forEach(song => {
      if (counter.includes(song)) {
        let idx = currentPlaylist.indexOf(song)
        currentPlaylist.splice(idx, 1)
      }
      else
        counter.push(song)
    })

    this.setState({ currentPlaylist })
    
    if (!Array.isArray(songs))
      setTimeout(() => {
        if (document.querySelector(".playing-now") != null)
          document.querySelector(".playing-now").className = ""
        document.querySelector("#side-bar-playlist").lastChild.className = "playing-now"
      }, 100);
  }

  render(props) {
    return (
      <div className="App">
        <header id="App-header">
          <h3 id="title">Ljudio</h3>
          <div>
            <SearchBar
              updateSearch={this.handleSearchUpdate} />
          </div>
        </header>
        <div id="hero">
          <div id="column">
            <div className="category-select">
              <span class="selected" onClick={() => this.updateSelectedCategory("songs")}>
                Songs
              </span>
              <span onClick={() => this.updateSelectedCategory("artists")}>
                Artists
              </span>
              <span onClick={() => this.updateSelectedCategory("playlists")}>
                Playlists
              </span>
            </div>
            <ShowCategory selected={this.state.selectedCategory}
              songResults={this.state.songResults}
              artistResults={this.state.artistResults}
              playlistResults={this.state.playlistResults}
              handleTimers={this.handleTimers}
              addSongToPlaylist={this.addSongToPlaylist}/>
          </div>
          <div id="side-bar">
            <span>History</span>
            <ul id="side-bar-playlist">
              {this.state.currentPlaylist.map(song => 
                <li key={song.id} onClick={(e) => {
                  if(document.querySelector(".playing-now") != null)
                    document.querySelector(".playing-now").className = ""
                  e.target.parentElement.className = "playing-now"
                  let parent = e.target.parentElement.parentElement
                  setTimeout(() => {
                    let childIndex = Array.prototype.indexOf.call(parent.children, e.target.parentElement)
                    this.setState({ currentPlayIndex: childIndex })
                  }, 100);
                  PlayVideo(song.videoId)
                }}>
                  <img src={song.thumbnail}/>
                  <span>{song.name}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <footer id="player-controls">
          <ProgressBar
            duration={this.state.duration} currentTime={this.state.currentTime}
            key={this.state.currentTime} />
          {/*//SPLIT: Media controls should be it's own component*/}
          <div id="media-controls">
            <button class="fa fa-fast-backward" onClick={() =>skipOrRewind("rewind", this.state.currentPlayIndex, this.state.currentPlaylist, this)}></button>
            <PlayOrPause isPlaying={this.state.isPlaying}
              updateIsPlaying={this.updateIsPlaying} />
            <button class="fa fa-fast-forward" onClick={() =>skipOrRewind("forward", this.state.currentPlayIndex, this.state.currentPlaylist, this)}></button>
          </div>
        </footer>
      </div>
    )
  }
}

function ShowCategory(props) {
  if (props.selected === "songs") {
    return (
      <ul id="songList">
      {props.songResults.map(song => 
        <li key={song.id}>
          <SongCard song={song} key={song.name} timeFunction={props.handleTimers}
            addSongToPlaylist={props.addSongToPlaylist}/>
        </li>
        )}
    </ul>
    )
  }
  else if (props.selected === "artists") {
    return (
      <ul id="songList">
      {props.artistResults.map(song => 
        <li key={song.id}>
          <SongCard song={song} key={song.name} timeFunction={props.handleTimers}/>
        </li>
        )}
    </ul>
    )
  }
  else {
    return (
      <ul id="songList">
      {props.playlistResults.map(song => 
        <li key={song.id}>
          <SongCard song={song} key={song.name} timeFunction={props.handleTimers}
            addSongToPlaylist={props.addSongToPlaylist}/>
        </li>
        )}
    </ul>
    )
  }
}

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
        <button class="fa fa-pause" onClick={() => togglePlay(false)}></button> :
        <button class="fa fa-play" onClick={() => togglePlay(true)}></button>}
    </>
  )
}

function skipOrRewind(type, index, list, parent) {
  if (type === "rewind") {
    if (index > 0) {
      PlayVideo(list[index - 1].videoId)
      parent.setState({currentPlayIndex: index - 1})
      let parentEle = document.querySelector("#side-bar-playlist")
      let childEle = document.querySelector(".playing-now")
      if(document.querySelector(".playing-now") != null)
        document.querySelector(".playing-now").className = ""
      setTimeout(() => {
        let childIndex = Array.prototype.indexOf.call(parentEle.children, childEle)
        parentEle.children[childIndex - 1].className = "playing-now"
        parent.updateIsPlaying(true)
      }, 100);
    }
  }
  if (type === "forward") {
    if (list.length > index + 1) {
      PlayVideo(list[index + 1].videoId)
      parent.setState({currentPlayIndex: index + 1})
      let parentEle = document.querySelector("#side-bar-playlist")
      let childEle = document.querySelector(".playing-now")
      if(document.querySelector(".playing-now") != null)
        document.querySelector(".playing-now").className = ""
      setTimeout(() => {
        let childIndex = Array.prototype.indexOf.call(parentEle.children, childEle)
        parentEle.children[childIndex + 1].className = "playing-now"
        parent.updateIsPlaying(true)
      }, 100);
    }
  }
}

export default App;



//DEPRICATED
/*

//<Songs results={this.state.songResults}/>
function App() {
  const [songResults, updateSongResults] = useState([])
  const [artistResults, updateArtistResults] = useState([])
  const [albumResults, updateAlbumResults] = useState([])
  const [songSearch, newSongSearch] = useState('Song title')
  
  let duration
  let currentTime
  setTimeout(() => {
    duration = window.player.getDuration()
    currentTime = window.player.getCurrentTime()
  }, 1000);

  function handleSearchUpdate(songs, artists, playlists) {
    console.log(songs)
    updateSongResults(songs)
    updateArtistResults(artists)
    updateAlbumResults(albums)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Hi there!</h3>
        <div>
          <SearchBar
            updateSearch={handleSearchUpdate}
            songSearch={songSearch}
            newSongSearch={newSongSearch}/>
        </div>
      </header>
      <h2>Artists</h2>
      <Artists results={artistResults}/>
      <h2>Playlists</h2>
      <Playlists results={albumResults} />
      <h2>Songs</h2>
      <Songs results={songResults}/>
      <footer id="player-controls">
        <ProgressBar
          key={currentTime || 0}
          currentTime={Math.floor(currentTime) || 0}
          duration={Math.floor(duration) || 100}
        />
      </footer>
    </div>
  )
}

function ProgressBar(props) {
  const [currentTime, setCurrentTime] = useState(props.currentTime)
  const [duration, setDuration] = useState(props.duration)

  const onCurrentTime = () => {
    setCurrentTime(props.currentTime)
    return currentTime
  }

  const onDuration = () => {
    setDuration(props.duration)
    return duration
  }

  let currentMinutes = Math.floor(currentTime / 60)
  let currentSeconds = (currentTime - (currentMinutes * 60))
  if (currentSeconds < 10)
    currentSeconds = "0" + currentSeconds
  currentMinutes += ":"
  let durMinutes = Math.floor(duration / 60)
  let durSeconds = (duration - (durMinutes * 60))
  if (durSeconds < 10)
    durSeconds = "0" + durSeconds
  durMinutes += ":"
  let newCurrentTime = currentMinutes + currentSeconds
  let newDuration = durMinutes + durSeconds
  
  return (
    <>
      <div id="progress-bar">
        <div key={currentTime} id="progress-fill"></div>
      </div>
      <span key={props.getCurrentTime} id="progress-span">{newCurrentTime + "/" + newDuration}</span>
    </>
  )
}

//<button onClick={() => playVideo(vidId)}>▶</button>
*/