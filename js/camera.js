function camera() {
  const video = document.getElementById("video");
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  const facingMode = "environment" || "user"; // "environment"

  const constraints = {
    audio: false,
    video: {
      facingMode: facingMode,
      width: 1920,
      // height: 720 * 1.333
    },
    zoom: 1,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const settings = stream.getVideoTracks()[0].getSettings();
      console.log(settings);
      const capabilities = stream.getVideoTracks()[0].getCapabilities();
      console.log(capabilities);
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.width = window.innerWidth;
      video.height = window.innerHeight
      video.srcObject = stream;
      try {
        appHeight()
      } catch (error) {
        
      }
    })
    .catch(() => {
      // device don't support camera → write link function here
    });
}
