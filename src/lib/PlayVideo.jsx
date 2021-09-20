//TODO: Slim this down into less code

function PlayVideo(videoID) {
    let player = window.player
    player.loadVideoById(videoID)
    player.playVideo()
    document.getElementById("player-controls").style.visibility = "visible"
}
  
export default PlayVideo