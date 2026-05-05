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
    
    // --- A. 背景遮罩 (在影像區域內，將輪廓外填滿 fdf0d5) ---
    fill('#fdf0d5');
    noStroke();
    beginShape();
    // 繪製一個蓋住影像範圍的矩形 (相對於中心點)
    vertex(-videoW / 2, -videoH / 2);
    vertex(videoW / 2, -videoH / 2);
    vertex(videoW / 2, videoH / 2);
    vertex(-videoW / 2, videoH / 2);
    
    // 內部孔洞：臉部輪廓 (利用反向繪製達成遮罩)
    let silhouette = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
    beginContour();
    for (let i of silhouette) {
      let p = face.keypoints[i];
      vertex(map(p.x, 0, capture.width, -videoW / 2, videoW / 2), map(p.y, 0, capture.height, -videoH / 2, videoH / 2));
    }
    endContour();
    endShape(CLOSE);

    // --- B. 繪製螢光藍色臉部輪廓 ---
    stroke('#00FFFF'); // 螢光藍
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i of silhouette) {
      let p = face.keypoints[i];
      vertex(map(p.x, 0, capture.width, -videoW / 2, videoW / 2), map(p.y, 0, capture.height, -videoH / 2, videoH / 2));
    }
    endShape();

    // --- C. 繪製雙眼 ---
    // 右眼節點：外圈 (247附近), 內圈 (246附近)
    let rightEyeOuter = [226, 247, 30, 29, 28, 27, 190, 244, 233, 232, 231, 230, 229, 228, 31, 226];
    let rightEyeInner = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33];
    // 左眼節點：外圈 (467附近), 內圈 (466附近)
    let leftEyeOuter = [463, 467, 260, 259, 258, 257, 414, 464, 453, 452, 451, 450, 449, 448, 261, 463];
    let leftEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249, 263];

    // 1. 繪製黑眼圈 (外圈)
    stroke(70); // 灰色偏黑
    strokeWeight(15);
    drawLines(face, rightEyeOuter, videoW, videoH);
    drawLines(face, leftEyeOuter, videoW, videoH);

    // 2. 繪製眼部內圈
    stroke(255, 0, 0); // 紅色
    strokeWeight(1);
    drawLines(face, rightEyeInner, videoW, videoH);
    drawLines(face, leftEyeInner, videoW, videoH);

    // --- D. 繪製嘴唇 ---
    let lipSets = [
      [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
      [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184]
    ];
    stroke(255, 0, 0); 
    strokeWeight(1);
    for (let points of lipSets) {
      drawLines(face, points, videoW, videoH);
    }
  }
  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
