function onYouTubeIframeAPIReady() {
    window.player = new YT.Player('yt-player', {
      height: '0',
      width: '0',
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  }
  function onPlayerStateChange(event) {
    if (event.data != YT.PlayerState.PLAYING) return
  }