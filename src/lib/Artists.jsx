import React from 'react'
import SongCard from './SongCard'

function Artists(props) {
    return (
        <ul id="artistList">
          {props.results.map(d => (<li key={d.id}>
            <SongCard thumbnail={d.thumbnail}
              name={d.name}
              artist={d.artist}
              album={d.album}
              duration={d.duration}
              videoId={d.videoId}/>
          </li>))}
        </ul>
    )
}

export default Artists