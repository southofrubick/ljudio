import React from 'react'

class SearchBar extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            songSearch: '',
            songResults: [],
            artistResults: [],
            playlistResults: []
        }
    }

    updateSongResult = async () => {
        let songList = []

        const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/songs/' + this.state.songSearch)
            .then(response => response.json())
            .then(data => songList.push(data))
        
        let newResults = []
        
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

        this.setState({ songResults: newResults }, function () {
            console.log(newId)
        })
    }

    updateArtistResult = async () => {
        let songList = []

        const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/artists/' + this.state.songSearch)
            .then(response => response.json())
            .then(data => songList.push(data))
        
        let newResults = []
        for (let i = 0; i < songList[0].content.length; i++) {
            newResults.push({
                videoId: songList[0].content[i].browseId,
                id: i,
                name: songList[0].content[i].name,
                thumbnail: songList[0].content[i].thumbnails[1].url,
                type: songList[0].content[i].type
            })
        }

        this.setState({ artistResults: newResults }, function () {
            console.log(newId)
        })
    }

    updatePlaylistResult = async () => {
        let songList = []

        const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/playlists/' + this.state.songSearch)
            .then(response => response.json())
            .then(data => songList.push(data))
        
        let newResults = []
        for (let i = 0; i < songList[0].content.length; i++) {
            newResults.push({
                videoId: songList[0].content[i].browseId,
                id: i,
                artist: songList[0].content[i].author,
                name: songList[0].content[i].title,
                thumbnail: songList[0].content[i].thumbnails[1].url,
                trackCount: songList[0].content[i].trackCount,
                type: songList[0].content[i].type
            })
        }

        this.setState({ playlistResults: newResults }, function () {
            console.log(newId)
        })
    }

    updateResults() {
        this.updateSongResult()
        this.updateArtistResult()
        this.updatePlaylistResult()
        setTimeout(() => {
            this.props.updateSearch(this.state.songResults,
                this.state.artistResults,
                this.state.playlistResults)
        }, 200);
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render(props) {
        return (
            <div id="search-bar">
                <form onSubmit={this.handleSubmit}>
                    <input value={this.state.songSearch} onChange={(e) => this.setState({ songSearch: e.target.value })} placeholder="Song title" className="prime-input" id="search-input"></input>
                    <button onClick={() => { this.updateResults() }} className="prime-button">
                        Search!
                    </button>
                </form>
            </div>
        )
    }
}



export default SearchBar

//DEPRICATED:

/*
function SearchBar(props) {
    const [songSearch, newSongSearch] = useState('Song title')
  const [songResults, updateSongResults] = useState([])
  const [artistResults, updateArtistResults] = useState([])
  const [albumResults, updateAlbumResults] = useState([])

    const updateSongId = async () => {
    let songList = []
    const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/songs/' + songSearch)
        .then(response => response.json())
        .then(data => songList.push(data))
    let newResults = []
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
    updateSongResults(newResults)
    console.log(newId)
    }

    const updateArtistId = async () => {
    let songList = []
    const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/artists/' + songSearch)
        .then(response => response.json())
        .then(data => songList.push(data))
    let newResults = []
    for (let i = 0; i < songList[0].content.length; i++) {
        newResults.push({
        browseId: songList[0].content[i].browseId,
        id: i,
        //artist: songList[0].content[i].artist.name,
        //album: songList[0].content[i].album.name,
        name: songList[0].content[i].name,
        thumbnail: songList[0].content[i].thumbnails[1].url,
        //duration: songList[0].content[i].duration,
        type: songList[0].content[i].type
        })
    }
    updateArtistResults(newResults)
    console.log(newId)
    }

    const updatePlaylistId = async () => {
    let songList = []
    const newId = await fetch('https://yt-music-api.herokuapp.com/api/yt/playlists/' + songSearch)
        .then(response => response.json())
        .then(data => songList.push(data))
    let newResults = []
    for (let i = 0; i < songList[0].content.length; i++) {
        newResults.push({
        videoId: songList[0].content[i].browseId,
        id: i,
        artist: songList[0].content[i].author,
        //album: songList[0].content[i].album.name,
        name: songList[0].content[i].title,
        thumbnail: songList[0].content[i].thumbnails[0],
        //duration: songList[0].content[i].duration,
        type: songList[0].content[i].type
        })
    }
    updateAlbumResults(newResults)
    console.log(newId)
    console.log(songList[0].content[0].thumbnails[0])
    }

    const updateSearch = () => {
      updateSongId()
      updateArtistId()
      updatePlaylistId()
    }
    
    return (
        <>
            <input value={songSearch} onChange={(e) => newSongSearch(e.target.value)}></input>
            <button onClick={() => {
                updateSearch();
                props.updateSearch(songResults, artistResults, albumResults);
            }}
            >♿</button>
        </>
    )
}

*/