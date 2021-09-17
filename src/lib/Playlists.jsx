import React from 'react'
import SongCard from './SongCard'

function Playlists(props) {
    return (
        <ul id="playlistList">
          {props.results.map(d => (<li key={d.id}>
            <SongCard thumbnail={d.thumbnail}
                name={d.name}
                artist={d.artist}
                videoId={d.videoId}
                type={d.type}/>
            </li>))}
        </ul>
    )
}

export default Playlists