//TODO: Slim this down into less code

function PlayVideo(videoID) {
    let player = window.player
    player.loadVideoById(videoID)
    setTimeout(() => {
        player.playVideo()
    }, 200);
    document.getElementById("player-controls").style.visibility = "visible"
}
  
export default PlayVideo