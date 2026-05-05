let capture;

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的 HTML 影片元件
  capture.hide();
  
  // 設定影像繪製模式為中心
  imageMode(CENTER);
}

function draw() {
  // 1. 畫布背景顏色設定為 e7c6ff
  background('#e7c6ff');

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
  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
