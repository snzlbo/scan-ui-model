async function modelLoad() {
  model = await tf.loadGraphModel("indexeddb://yakult_model_2404");
  return model;
}

async function loadTensorFlowModel(modelDBPath, modelFilePath) {
  const mPromise = new Promise(async (resolve, reject) => {
    let mModel;
    try {
      mModel = await tf.loadGraphModel(modelDBPath);
      // モデルの読み込みに成功した場合の処理
      console.log("モデルの読み込みに成功しました。");
      resolve(mModel);
    } catch (error) {
      // エラーハンドリング
      mModel = await tf.loadGraphModel(modelFilePath);
      await mModel.save(modelDBPath);
      console.log("モデルのキャッシュに入れました");
      resolve(mModel);
    }
  });
  const result = await mPromise;
  return result;
}


// TfJSの計算
function xywh2xyxy(x) {
  //Convert boxes from [x, y, w, h] to [x1, y1, x2, y2] where xy1=top-left, xy2=bottom-right
  var y = [];
  y[0] = x[0] - x[2] / 2; //top left x
  y[1] = x[1] - x[3] / 2; //top left y
  y[2] = x[0] + x[2] / 2; //bottom right x
  y[3] = x[1] + x[3] / 2; //bottom right y
  return y;
}

// TfJSの計算
function non_max_suppression(
  res,
  conf_thresh = 0.5,
  iou_thresh = 0.2,
  max_det = 300
) {
  // Initialize an empty list to store the selected boxes
  const selected_detections = [];

  for (let i = 0; i < res.length; i++) {
    // Check if the box has sufficient score to be selected
    if (res[i][4] < conf_thresh) {
      continue;
    }

    var box = res[i].slice(0, 4);
    const cls_detections = res[i].slice(5);
    var klass = cls_detections.reduce(
      (imax, x, i, arr) => (x > arr[imax] ? i : imax),
      0
    );
    const score = res[i][klass + 5];

    let object = xywh2xyxy(box);
    let addBox = true;

    // Check for overlap with previously selected boxes
    for (let j = 0; j < selected_detections.length; j++) {
      let selectedBox = xywh2xyxy(selected_detections[j]);

      // Calculate the intersection and union of the two boxes
      let intersectionXmin = Math.max(object[0], selectedBox[0]);
      let intersectionYmin = Math.max(object[1], selectedBox[1]);
      let intersectionXmax = Math.min(object[2], selectedBox[2]);
      let intersectionYmax = Math.min(object[3], selectedBox[3]);
      let intersectionWidth = Math.max(0, intersectionXmax - intersectionXmin);
      let intersectionHeight = Math.max(0, intersectionYmax - intersectionYmin);
      let intersectionArea = intersectionWidth * intersectionHeight;
      let boxArea = (object[2] - object[0]) * (object[3] - object[1]);
      let selectedBoxArea =
        (selectedBox[2] - selectedBox[0]) * (selectedBox[3] - selectedBox[1]);
      let unionArea = boxArea + selectedBoxArea - intersectionArea;

      // Calculate the IoU and check if the boxes overlap
      let iou = intersectionArea / unionArea;
      if (iou >= iou_thresh) {
        addBox = false;
        break;
      }
    }

    // Add the box to the selected boxes list if it passed the overlap check
    if (addBox) {
      const row = box.concat(score, klass);
      selected_detections.push(row);
    }
  }

  return selected_detections;
}

// TfJSの計算
function shortenedCol(arrayofarray, indexlist) {
  return arrayofarray.map(function (array) {
    return indexlist.map(function (idx) {
      return array[idx];
    });
  });
}

function calculatePrediction(scores_data, classes_data) {
  const labels = ["face"];
  const threshold = 0.5;
  const target_products = ["face"];
  let calculation_result = {
    face: 0,
  };
  for (let i = 0; i < scores_data.length; ++i) {
    if (scores_data[i] > threshold) {
      const _class = labels[classes_data[i]];
      if (target_products.includes(_class)) {
        calculation_result[_class] = scores_data[i][0];
      }
    }
  }
  return calculation_result;
}

async function checkProductTFJS(canvas, video, mainModel) {
  let result = 0
  tf.engine().startScope()
  const mCanvas = captureCanvas(canvas, video);
  let mainModelImage = tf.browser
    .fromPixels(mCanvas, 3)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()
    .div(255.0); // RGB -> BGR
  let predictions = await mainModel.predict(mainModelImage).data();
  tf.dispose(mainModelImage);
  tf.engine().endScope()
  // {'background': 0,
  //  'new_yakult': 1,
  //  'tenpo_yakult_1000': 2,
  //  'yakult_1000': 3,
  //  'yakult_400': 4,
  //  'yakult_400LT': 5,
  //  'yakult_400W': 6,
  //  'yakult_calorie_half': 7,
  //  'yakult_five': 8}
  // let product_result = predictions[3];
  result = Math.max(predictions[6], predictions[3])
  return result;
}
async function checkFaceTFJS(canvas, video, faceModel) {
  let result = 0
  const mCanvas = captureCanvasForFace(canvas, video);
  // ENABLE FOR CHECK FACE CANVAS
  // mCanvas.toBlob((blob) => {
  //   const tempUrl = URL.createObjectURL(blob);
  //   window.location = tempUrl
  // })
  tf.engine().startScope()
  let faceModelImage = tf.browser
    .fromPixels(mCanvas, 3)
    .resizeNearestNeighbor([640, 640])
    .div(255.0)
    .transpose([2, 0, 1])
    .expandDims(0);
  const tensorPredictions = await faceModel.executeAsync(faceModelImage);
  tf.dispose(faceModelImage);
  let res = tensorPredictions.arraySync()[0];
  tf.engine().endScope()
  const detections = non_max_suppression(res);
  // const boxes = shortenedCol(detections, [0, 1, 2, 3]);
  const scores = shortenedCol(detections, [4]);
  const class_detect = shortenedCol(detections, [5]);
  const face_result = calculatePrediction(scores, class_detect);
  result = face_result.face;

  return result;
}
