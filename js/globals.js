function apiUri() {
  // staging server | comment line 3 if it's production environment
  return "https://yakult.dev2.purchase-proof.com"
  // uncomment line 5 on production environment
  // return "https://api.purchase-proof.com";
}

const MAIN_MODEL_DB_PATH = "indexeddb://yakult_model_2404";
const MAIN_MODEL_FILE_PATH = 'models/model.json';
const FACE_MODEL_DB_PATH = "indexeddb://face_model";
const FACE_MODEL_FILE_PATH = "face_model/model.json";

const captureCanvas = (canvas, video) => {
  const size = Math.min(video.clientWidth, video.clientHeight);
  canvas.width = size;
  canvas.height = size;

  // Calculate the center of the video frame
  const centerX = video.videoWidth / 2;
  const centerY = video.videoHeight / 2;

  // Calculate the top-left corner of the square region
  const startX = centerX - size / 2;
  const startY = centerY - size / 2;

  // Draw the current video frame onto the canvas
  canvas
      .getContext("2d")
      .drawImage(video, startX, startY, size, size, 0, 0, size, size);
  return canvas;
};
const captureCanvasForFace = (canvas, video) => {
  const size = Math.min(video.clientWidth, video.clientHeight);
  canvas.width = size;
  canvas.height = size;
  canvas
    .getContext("2d")
    .drawImage(video, 0, 0, size, size);
  return canvas;
};

function getAnimation() {
  const currentDate = new Date();
  const animationA = `/animation/yakult_${params.size}_A.gif`
  const animationB = `/animation/yakult_${params.size}_B.gif`
  const animationC = `/animation/yakult_${params.size}_C.gif`
  const STG_START_DATE = new Date("2024-04-24T14:59:59");
  // DEV ANIMATION
  if (currentDate <= STG_START_DATE) {
    const ANIMATION_A_END_DATE = new Date("2024-04-16T14:59:59");
    const ANIMATION_B_START_DATE = new Date("2024-04-16T15:00:00");
    const ANIMATION_B_END_DATE = new Date("2024-04-17T14:59:59");
    if (currentDate <= ANIMATION_A_END_DATE) {
      return animationA
    } else if (currentDate >= ANIMATION_B_START_DATE && currentDate <= ANIMATION_B_END_DATE) {
      return animationB
    } else {
      return animationC
    }
  } else {
    // STG ANIMATION
    const ANIMATION_A_START_DATE = new Date("2024-04-24T15:00:00");
    const ANIMATION_A_END_DATE = new Date("2024-04-25T14:59:59");
    const ANIMATION_B_START_DATE = new Date("2024-04-25T15:00:00");
    const ANIMATION_B_END_DATE = new Date("2024-04-26T14:59:59");
    const ANIMATION_C_START_DATE = new Date("2024-04-26T15:00:00");
    if (currentDate >= ANIMATION_A_START_DATE && currentDate <= ANIMATION_A_END_DATE) {
      return animationA
    } else if (currentDate >= ANIMATION_B_START_DATE && currentDate <= ANIMATION_B_END_DATE) {
      return animationB
    } else {
      return animationC
    }
  }
}
function preloadBasedOnDate() {
  const imagePath = getAnimation(); // This holds the path determined by checkDate
  var preloadLink = document.createElement("link");
  preloadLink.href = imagePath; // Specify the resource you want to preload
  preloadLink.rel = "preload";
  preloadLink.as = "image"; // Specify the type of content to preload

  document.head.appendChild(preloadLink);
}