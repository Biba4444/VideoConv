const video = document.querySelector("#video");
const asciiElement = document.querySelector("#ascii");
const asciiCharacters = "I love Maria";

const inputCamera = document.querySelector("#playVideo");
const outputCamera = document.querySelector("#stopVideo");
let videoStream = null;

const isCameraActive = () => {
  if (videoStream && videoStream.getVideoTracks().length > 0) {
    return videoStream.getVideoTracks()[0].readyState === "live";
  }
  return false;
};

const startCamera = () => {
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    videoStream = stream;
    asciiElement.style.visibility = "visible";
  });
};

const stopCamera = () => {
  if (videoStream) {
    let tracks = videoStream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    asciiElement.style.visibility = "hidden";
  }
};

outputCamera.onclick = stopCamera;

inputCamera.onclick = startCamera;

//! for ascii
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  processVideo();
});

const processVideo = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 80;
  canvas.height = 60;

  const drawFrame = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const asciiImage = convertToASCII(ImageData);
    asciiElement.textContent = asciiImage;
    requestAnimationFrame(drawFrame);
  };

  drawFrame();
};

const convertToASCII = ImageData => {
  let asciiString = "";
  const pixels = ImageData.data;

  for (let y = 0; y < ImageData.height; y++) {
    for (let x = 0; x < ImageData.width; x++) {
      const offset = (y * ImageData.width + x) * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];

      const brightness = (r + g + b) / 3;
      const charIndex = Math.floor(
        (brightness / 255) * (asciiCharacters.length - 1)
      );
      asciiString += asciiCharacters[charIndex];
    }
    asciiString += "\n";
  }
  return asciiString;
};
