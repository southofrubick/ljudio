import React,{ useState } from "react";

function App() {
  const [results, updateResults] = useState([])
  const [songSearch, newSongSearch] = useState('Song title')

  const updateSongId = async () => {
    let songList = []
    const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/songs/' + songSearch)
      .then(response => response.json())
      .then(data => songList.push(data))
    let newResults = []
    for (let i = 0; i < songList[0].content.length; i++){
      newResults.push({
        videoId: songList[0].content[i].videoId,
        id: i,
        artist: songList[0].content[i].artist.name,
        album: songList[0].content[i].album.name,
        name: songList[0].content[i].name,
        thumbnail: songList[0].content[i].thumbnails[1].url,
        duration: songList[0].content[i].duration,
      })
  }
  console.log(newResults)
    console.log(songList[0].content)
    updateResults(newResults)
  }

  const updateResultList = (list) => {
    console.log(list)
  }

  calculateProgressBar()

  return (
    <div className="App">
      <header className="App-header">
        <h3>Hi there!</h3>
      </header>
      <div>
        <input value={songSearch} onChange={(e) => newSongSearch(e.target.value)}></input>
        <button onClick={updateSongId}>♿</button>
      </div>
      <ul>
        {results.map(d => (<li key={d.id}>
          <SongCard thumbnail={d.thumbnail}
            name={d.name}
            artist={d.artist}
            album={d.album}
            duration={d.duration}
            videoId={d.videoId}/>
        </li>))}
      </ul>
      <footer id="player-controls">
        <div id="progress-bar">
          <div id="progress-fill"></div>
        </div>
        <div id="progress-thumb"></div>
      </footer>
    </div>
  );
}

//<button onClick={() => playVideo(vidId)}>▶</button>

function playVideo(videoID) {
  window.player.loadVideoById(videoID)
  window.player.playVideo()
  document.getElementById("player-controls").style.filter="opacity(100)"
}

function calculateProgressBar() {
  let i = 0;
}

function SongCard(props) {
  let minutes = Math.floor(props.duration / 1000 / 60)
  let seconds = (props.duration - (1000 * minutes * 60)) / 1000
  return (
    <>
      <div className="song-card" onClick={() => playVideo(props.videoId)}>
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
              <span>{props.album} </span>
            </div>
            <div>
              <span>{minutes}:{seconds}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;