import React, { useEffect } from 'react'
import SongCard from './lib/SongCard'
import ArtistView from './lib/ArtistView'
import PlaylistView from './lib/PlaylistView'
import SearchBar from './lib/SearchBar'
import ProgressBar from './lib/ProgressBar'
import PlayVideo from './lib/PlayVideo'
import MediaControls from './lib/MediaControls'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect
} from 'react-router-dom'

//TODO: Give songs independent urls - searchParam that fetches from API
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
      currentPlayIndex: 0,
      mediaState: 1001
    }
  }

  handleSearchUpdate = (songs, artists, playlists) => {
    this.setState({ songResults: songs })
    this.setState({ artistResults: artists })
    this.setState({ playlistResults: playlists })
  }

  setCurrentTimeFromProgressBar = (dur) => {
    this.handleTimers(dur)
  }

  handleTimers = (dur) => {
    setTimeout(() => {
      let i = 0
      let self = this
      function loop() {
        setTimeout(() => {
          self.setState({
            currentTime: window.player.getCurrentTime() })
          if (i < dur) {
            loop()
          }
        }, 100);
      }

      loop()
    }, 500);
    this.setState({ duration: dur / 1000 })
  }

  updateIsPlaying = (play) => {
    this.setState({ isPlaying: play })
    if (play) {
      this.setState({ mediaState: 1001 })
    }
    else {
      this.setState({ mediaState: 1002 })
    }
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

  updateMedia = (playlist, index) => {
    this.setState({ currentPlaylist: playlist })
    this.setState({ currentPlayIndex: index })
    setTimeout(() => {
      this.setState({ duration: window.player.getDuration() })
    }, 100);
  }
  
  addSongToPlaylist = (songs) => {
    let newPlaylist = [...this.state.currentPlaylist]
    document.getElementById("side-bar").style.visibility = "visible"

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
        this.updateIsPlaying("true")
      }, 100);
  }

  setArtistId = (artistId) => {
    this.setState({ artistQuery: artistId })
  }

  render(props) {
    return (
      <div className="App">
        <Router>
          <header id="App-header">
            <h3 id="title">Ljudio</h3>
            <div>
              <SearchBar
                updateSearch={this.handleSearchUpdate} />
            </div>
          </header>
          <div id="hero">
            <Switch>
              <Route path="/:id/artist">
                <ArtistComp
                  timeFunction={this.handleTimers}
                  addSongToPlaylist={this.addSongToPlaylist}
                  that={this}/>
              </Route>
              <Route path="/:id/playlist">
                <PlaylistComp
                  timeFunction={this.handleTimers}
                  addSongToPlaylist={this.addSongToPlaylist}
                  that={this}/>
              </Route>
              <Route path="/:id/song">
                <SongComp
                  timeFunction={this.handleTimers}
                  addSongToPlaylist={this.addSongToPlaylist}/>
              </Route>
              <Route path="/">
                <SearchComp that={this}/>
              </Route>
            </Switch>
            <div id="side-bar">
              <ul id="side-bar-playlist">
                {this.state.currentPlaylist.map(song =>
                  <li key={song.id} onClick={(e) => {
                    if (document.querySelector(".playing-now") != null)
                      document.querySelector(".playing-now").className = ""
                    e.target.parentElement.className = "playing-now"
                    let parent = e.target.parentElement
                    setTimeout(() => {
                      let childIndex = Array.prototype.indexOf.call(parent.children, e.target.parentElement)
                      this.setState({ currentPlayIndex: childIndex })
                    }, 100);
                    PlayVideo(song.videoId)
                    this.handleTimers(song.duration)
                  }}>
                    <div onClick={(e) => e.stopPropagation}>
                      <img src={song.thumbnail} id="plist-img" alt="" />
                      <span id="plist-span">{song.name}</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <footer id="player-controls">
            <ProgressBar
              duration={this.state.duration} currentTime={this.state.currentTime}
              key={this.state.currentTime} newTime={this.setCurrentTimeFromProgressBar}/>
            <MediaControls currentPlaylist={this.state.currentPlaylist}
              currentPlayIndex={this.state.currentPlayIndex}
              updateIsPlaying={this.updateIsPlaying}
              updateMedia={this.updateMedia}
              isPlaying={this.state.isPlaying}
              timeFunction={this.handleTimers}
              key={this.state.mediaState}
            />
          </footer>
        </Router>
      </div>
    )
  }
}

function SearchComp(props) {
  return (
    <div id="column">
    <div className="category-select">
      <span className="selected" onClick={() => props.that.updateSelectedCategory("songs")}>
        Songs
    </span>
      <span onClick={() => props.that.updateSelectedCategory("artists")}>
        Artists
    </span>
      <span onClick={() => props.that.updateSelectedCategory("playlists")}>
        Playlists
    </span>
    </div>
    <ShowCategory
        selected={props.that.state.selectedCategory}
        songResults={props.that.state.songResults}
        artistResults={props.that.state.artistResults}
        playlistResults={props.that.state.playlistResults}
        handleTimers={props.that.handleTimers}
        addSongToPlaylist={props.that.addSongToPlaylist}
        setArtistId={props.that.setArtistId}/>
  </div>
  )
}

function SongComp(props) {
  const { id } = useParams()
  let newResults = []
  let changeUrl = false

  async function getSong() {
    let songList = []

    const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/songs/' + id)
      .then(response => response.json())
      .then(data => songList.push(data))
      
    for (let i = 0; i < songList[0].content.length; i++) {
      newResults.push({
        videoId: songList[0].content[i].videoId,
        id: i,
        artist: songList[0].content[i].artist.name,
        album: songList[0].content[i].album.name,
        name: songList[0].content[i].name,
        thumbnail: songList[0].content[i].thumbnails[1].url,
        duration: songList[0].content[i].duration,
        type: songList[0].content[i].type
      })
    }

    setTimeout(() => {
      props.timeFunction(newResults[0].duration)
      props.addSongToPlaylist(newResults[0])
      changeUrl = true
    }, 1000);
  }

  useEffect(() => {
    getSong()
  }, [])

  return (
    <>
      <Redirect to="/" />
    </>
  )
}

function ArtistComp(props) {
  const { id } = useParams()
  
  return (
    <>
      <Link to="/" className="fa fa-undo"
        onClick={() => props.that.updateSelectedCategory("songs")}></Link>
      <ArtistView id={id}
        timeFunction={props.timeFunction}
        addSongToPlaylist={props.addSongToPlaylist}/>
    </>
  )
}

function PlaylistComp(props) {
  const { id } = useParams()
  
  return (
    <>
    <Link to="/" className="fa fa-undo"
        onClick={() => props.that.updateSelectedCategory("songs")}></Link>
      <PlaylistView id={id}
        timeFunction={props.timeFunction}
        addSongToPlaylist={props.addSongToPlaylist}/>
    </>
  )
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
          <SongCard song={song} key={song.name} timeFunction={props.handleTimers}
            setArtistId={props.setArtistId}/>
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

export default App;