let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // 載入 ml5 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的 HTML 影片元件
  capture.hide();
  
  // 設定影像繪製模式為中心
  imageMode(CENTER);

  // 開始偵測臉部
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 1. 畫布背景顏色設定為 e7c6ff
  background('#e7c6ff');

  // 1.1 顯示文字串
  fill(0); // 設定文字顏色為黑色
  textSize(32); // 設定文字大小
  textAlign(CENTER, CENTER); // 設定水平與垂直置中
  text("教科414730894", width / 2, height * 0.15); // 顯示在畫布上方 15% 的位置

  // 2. 計算影像顯示的寬高 (整個畫布寬高的 50%)
  let videoW = width * 0.5;
  let videoH = height * 0.5;

  // 3. 處理影像顯示 (置中且左右顛倒)
  push();
  // 將繪圖原點移至畫布中央
  translate(width / 2, height / 2);
  // 執行水平翻轉 (左右顛倒)
  scale(-1, 1);
  
  // 繪製影像，座標設為 (0, 0) 以配合 translate 置中
  image(capture, 0, 0, videoW, videoH);

  // 4. 繪製臉部特定節點連線
  if (faces.length > 0) {
    let face = faces[0];
    let points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    
    stroke(255, 0, 0); // 設定線條為紅色
    strokeWeight(15);   // 設定線條粗細為 15
    noFill();

    for (let i = 0; i < points.length - 1; i++) {
      let p1 = face.keypoints[points[i]];
      let p2 = face.keypoints[points[i + 1]];

      // 將辨識座標映射到畫布中央 50% 大小的影像區域
      let x1 = map(p1.x, 0, capture.width, -videoW / 2, videoW / 2);
      let y1 = map(p1.y, 0, capture.height, -videoH / 2, videoH / 2);
      let x2 = map(p2.x, 0, capture.width, -videoW / 2, videoW / 2);
      let y2 = map(p2.y, 0, capture.height, -videoH / 2, videoH / 2);

      line(x1, y1, x2, y2);
    }
  }
  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
