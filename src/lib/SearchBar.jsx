import React, { useState } from 'react'

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

    const updateAlbumId = async () => {
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
        thumbnail: songList[0].content[i].thumbnails[1],
        //duration: songList[0].content[i].duration,
        type: songList[0].content[i].type
        })
    }
    updateAlbumResults(newResults)
    console.log(newId)
    }

    const updateSearch = () => {
      updateSongId()
      updateArtistId()
      updateAlbumId()
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

export default SearchBar