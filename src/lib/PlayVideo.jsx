function PlayVideo(videoID) {
    let player = window.player
    player.loadVideoById(videoID)
    document.getElementById("player-controls").style.visibility = "visible"
  
    setTimeout(() => {
      player.playVideo()
      let e = document.getElementById("progress-fill")
      e.style.transition = "all " + 0 + "s"
      e.style.width = 0 + "px"
      setTimeout(() => {
        e.style.transition = "all " + window.player.getDuration() + "s"
        e.style.width = 100 + "%"
      }, 500);
      
    }, 1000);
}
  
export default PlayVideo