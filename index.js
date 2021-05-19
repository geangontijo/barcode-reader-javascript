new Vue({
  el: "#app",
  vuetify: new Vuetify(),

  data() {
    return {
      listaCodBarrasLidos: [],
    };
  },

  mounted() {
    let videoDiv = document.getElementById("video");
    let video = document.createElement("video");
    var image = document.createElement("img");
    image.classList.add("d-none");
    video.muted = true;
    video.id = "video-html";
    (async () => {
      try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        devices = devices.filter((device) => device.kind === "videoinput");
        let deviceId = devices[1].deviceId;
        let stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId,
          },
        });
        video.srcObject = stream;
        let barcodeDetector = new BarcodeDetector();
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
        video.addEventListener("timeupdate", () => {
          let canvas = document.createElement("canvas");
          let video = document.getElementById("video-html");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          image.src = canvas.toDataURL();
          var barcodeDetector = new BarcodeDetector();
          barcodeDetector
            .detect(image)
            .then((barcodes) => {
              barcodes.forEach((barcode) => {
                window.navigator.vibrate(200);
                this.listaCodBarrasLidos.push(barcode.rawValue);
              });
            })
            .catch((err) => alert(err));
        });
        videoDiv.append(video);
      } catch (error) {
        alert(error);
      }
    })();
  },
});
