import React from 'react'
import SongCard from './SongCard'

class PlaylistView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playlistResults: [],
            id: props.id
        }
    }

    updatePlaylistResult = async () => {
        let songList = []

        const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/playlist/' +
            this.state.id)
            .then(response => response.json())
            .then(data => songList.push(data))
        
        let newResults = []
        console.log(songList[0])
        for (let i = 0; i < songList[0].content.length; i++) {
            let newSong = songList[0].content[i]
            console.log(newSong)
            
            newResults.push({
                videoId: newSong.videoId,
                id: i,
                name: newSong.name,
                artist: newSong.author.name,
                thumbnail: newSong.thumbnails.url,
                type: "song",
                duration: newSong.duration
            })
        }

        if(this.state.playlistResults.length !== newResults.length)
        this.setState({ playlistResults: newResults })
    }

    render() {
        this.updatePlaylistResult()
        return (
            <>
                <div id="column">
                    <ul id="songList">
                        {this.state.playlistResults.map(song =>
                            <li key={song.id}>
                                <SongCard song={song} key={song.name}
                                    timeFunction={this.props.timeFunction}
                                    addSongToPlaylist={this.props.addSongToPlaylist} />
                            </li>
                        )}
                    </ul>
                </div>
            </>
        )
    }
}

export default PlaylistView