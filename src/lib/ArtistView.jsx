import React from 'react'
import SongCard from './SongCard'

class ArtistView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            artistResults: [],
            id: props.id
        }
    }

    updateArtistResult = async () => {
        let artistId = []
        let songList = []
        let newResults = []

        const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/artist/'
            + this.state.id)
            .then(response => response.json())
            .then(data => artistId.push(data))
            .then(
                async () => {
                    const newerId = await fetch('https://yt-music-api.herokuapp.com/api/yt/playlist/' + artistId[0].products.songs.browseId.slice(2))
                        .then(response => response.json())
                        .then(data => songList.push(data))

                    for (let i = 0; i < songList[0].content.length; i++) {
                        let newSong = songList[0].content[i]
                        
                        newResults.push({
                            videoId: newSong.videoId,
                            id: i,
                            name: newSong.name,
                            artist: newSong.author.name,
                            duration: newSong.duration,
                            thumbnail: newSong.thumbnails[1].url,
                            type: "song"
                        })
                    }
                })

        if(this.state.artistResults.length !== newResults.length)
        this.setState({ artistResults: newResults })
    }

    render() {
        this.updateArtistResult()
        return (
            <>
                <div id="column">
                    <ul id="songList">
                        {this.state.artistResults.map(song =>
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

export default ArtistView