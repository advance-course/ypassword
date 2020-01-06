export interface Point {
  x: number,
  y: number
}

export const lockConfig = {
  /** 画布宽 */
  canvasWith: 300,
  /** 画布高 */
  canvasHeight: 300,
  /** x内边距 */
  offsetX: 40,
  /** y内边距 */
  offsetY: 5,
  /** 圆半径 */
  circleR: 33,
  /** 在圆心多少范围内触碰检测 */
  touchRange: 35,
  /** 圆形边框颜色 */
  circleBorderColor: "#717176",
  /** 圆颜色 */
  circleColor: "#292a2c",
  /** 背景颜色 */
  bgColor: "#323039",
  /** 线条颜色 */
  lineColor: "#ecd487",
  /** 错误线条颜色 */
  lineErrorColor: "#f56c6c",
  lineWidth: 5,  // 线宽
};

/**
 * 根据边距和间距获取圆心坐标位置
 */
export function getCircleArr(offsetX: number, offsetY: number, diffX: number, diffY: number, circleR:number): Point[] {
  const circleArr: Point[] = [];

  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      circleArr.push({
        x: offsetX + row * diffX + (2 * row + 1) * circleR,
        y: offsetY + col * diffY + (2 * col + 1) * circleR
      });
    }
  }

  return circleArr;
}

export interface BaseConfig {
  circleR: number,
  circleBorderColor?: string,
  circleColor?: string
}

// 画基础圆
export function drawBaseCircle(ctx: Taro.CanvasContext, point: Point, config: BaseConfig) {
  const {circleR, circleBorderColor = lockConfig.circleBorderColor, circleColor = lockConfig.circleColor} = config;
  ctx.setStrokeStyle(circleBorderColor);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, circleR, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.draw(true);

  ctx.setFillStyle(circleColor);
  ctx.beginPath();
  ctx.arc(point.x, point.y, circleR - 1, 0, 2 * Math.PI);
  ctx.fill();
  ctx.draw(true);
}

// 画九个圆
export function drawNineCircle(ctx: Taro.CanvasContext, circleArr: Point[], config: BaseConfig) {
  circleArr.forEach((v, i) => {
    drawBaseCircle(ctx, circleArr[i], config);
  });
}

// 画激活的圆心
export function drawSolidCircle(ctx: Taro.CanvasContext, point: Point, config: BaseConfig) {
  const {circleR, circleColor = lockConfig.circleColor} = config;
  const grdOutside = ctx.createCircularGradient(point.x, point.y, circleR - 5)
  grdOutside.addColorStop(0, '#e8bb68')
  grdOutside.addColorStop(1, circleColor)
  ctx.setFillStyle(grdOutside)
  ctx.beginPath()
  ctx.arc(point.x, point.y, circleR-5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.draw(true)
}

// 画最近点到手指的线
export function drawLine(ctx:Taro.CanvasContext, config: {
  x: number,
  y: number,
  lineWidth: number,
  lineColor?: string,
  pwdArr: number[],
  circleArr: Point[]
}) {
  const {x, y, lineWidth, lineColor = lockConfig.lineColor, pwdArr, circleArr} = config;
  ctx.lineWidth = lineWidth;
  ctx.setStrokeStyle(lineColor)
  ctx.setLineCap('round')
  let arrLength = pwdArr.length
  let lastPoint = circleArr[pwdArr[arrLength - 1]]

  if (arrLength) {
    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.draw()
  }
}

// 画错误提示
export function drawErrorTips(ctx: Taro.CanvasContext, config: {
  pwdArr: number[],
  circleArr: Point[],
  lineWidth?: number,
  lineErrorColor?: string,
  circleR?: number,
  circleColor?: string,
  circleBorderColor?: string
}) {
  const {
    pwdArr, 
    circleArr, 
    lineWidth = lockConfig.lineWidth,
    lineErrorColor = lockConfig.lineErrorColor,
    circleR = lockConfig.circleR,
    circleColor = lockConfig.circleColor,
    circleBorderColor = lockConfig.circleBorderColor
  } = config;
  // 画错误的线
  pwdArr.length && pwdArr.reduce((a,b) => {
    ctx.beginPath()
    ctx.lineWidth = lineWidth;
    ctx.setStrokeStyle(lineErrorColor)
    ctx.moveTo(circleArr[a].x, circleArr[a].y)
    ctx.lineTo(circleArr[b].x, circleArr[b].y)
    ctx.stroke()
    ctx.draw(true)

    return b
  })

  drawNineCircle(ctx, circleArr, {circleR, circleColor, circleBorderColor});

  // 画错误的激活点
  pwdArr.forEach((v) => {
    ctx.setFillStyle('#F56C6C')
    ctx.beginPath()
    ctx.arc(circleArr[v].x, circleArr[v].y, 10, 0, 2*Math.PI)
    ctx.fill()
    ctx.draw(true)
  })
}

// 画连接线
export function drawConnectLine(ctx:any, config: {
  pointA: Point, 
  pointB: Point
  lineWidth?: number,
  lineColor?: string
}) {
  const {pointA, pointB, lineWidth, lineColor} = config;
  ctx.beginPath();
  ctx.lineWidth = lineWidth || lockConfig.lineWidth;
  ctx.setStrokeStyle(lineColor || lockConfig.lineWidth);
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.stroke();
  ctx.draw(true);
}

export function checkCrash(circleArr, touchRange, {moveX, moveY} ):number {
  
  let index = -1
  
  for(let i = 0, length = circleArr.length; i < length; i++){

    let xDiff = Math.abs(circleArr[i].x - moveX)
    let yDiff = Math.abs(circleArr[i].y - moveY)

    let dir = Math.sqrt(xDiff*xDiff + yDiff*yDiff);

    if (dir < touchRange) {
      index = i
      break
    }
  }

  return index
}