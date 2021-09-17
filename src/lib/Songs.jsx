import React from 'react'
import SongCard from './SongCard'

function Songs(props) {
    return (
        <ul id="songList">
            {props.results.map(d => (<li key={d.id}>
                <SongCard thumbnail={d.thumbnail}
                name={d.name}
                artist={d.artist}
                album={d.album}
                duration={d.duration}
                videoId={d.videoId}
                type={d.type}/>
            </li>))}
        </ul>
    )
}

export default Songs