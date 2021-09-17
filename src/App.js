import React, { useState } from 'react'
import Artists from './lib/Artists'
import Playlists from './lib/Playlists'
import Songs from './lib/Songs'
import SearchBar from './lib/SearchBar'

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

  function handleSearchUpdate(songs, artists, albums) {
    console.log("CALLED")
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
      <Playlists results={albumResults}/>
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

export default App;