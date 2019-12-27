import Taro, { Component } from '@tarojs/taro';

import './index.scss';

interface DrawUnlockProps {};
interface DrawUnlockState {};

interface Point {
  x: number,
  y: number
}

export class DrawUnlock extends Component<DrawUnlockProps, DrawUnlockState> {

  private lineCanvas:HTMLCanvasElement | null
  private hollowCircleCanvas:HTMLCanvasElement | null
  private drawSolidCircleCanvas:HTMLCanvasElement | null

  getCircleArr(offsetX:number, offsetY:number, diffX:number, diffY:number, circleR:number):Point[] {
    let circleArr:Point[] = []

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let positionObj:Point = {
          x: offsetX+row*diffX+(2*row+1)*circleR,
          y: offsetY+col*diffY+(2*col+1)*circleR
        }

        circleArr.push(positionObj)
      }
    }

    return circleArr

  }

  getPwdArr(touches:any, circleArr:Point[], circleR:number, pwdArr:number[]) {

    for(let i = 0, length = circleArr.length; i < length; i++){
      let xDiff = (circleArr[i] as Point).x - touches.pageX
      let yDiff = (circleArr[i] as Point).y - touches.pageY

      let dir = Math.sqrt(xDiff*xDiff + yDiff*yDiff)

      if (pwdArr.indexOf(i) >= 0 || dir > circleR ) {
        continue;
      } else {
        pwdArr.push(i)
        return
      }

    }

  }

  drawHollowCircle(ctx:any, circleR:number, circleArr:Point[]){
    circleArr.forEach((v, i) => {
      ctx.strokeStyle = "#627eed"
      ctx.beginPath()
      ctx.arc((v as Point).x, (v as Point).y, circleR, 0, 2*Math.PI)
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle='#fff'
      ctx.arc((v as Point).x, (v as Point).y, circleR-1, 0, 2*Math.PI)
      ctx.fill()
    })
  }

  drawSolidCircle(ctx:any, circleR:number, circleArr:Point[], pwdArr:number[]) {
    pwdArr.forEach((v, i) => {
      ctx.fillStyle = "#627eed"
      ctx.beginPath()
      ctx.arc((circleArr[v] as Point).x, (circleArr[v] as Point).y, circleR, 0, 2*Math.PI)
      ctx.fill()
    })
  }

  drawLine(ctx:any, circleArr:Point[], pwdArr:number[], touches?:any) {

    ctx.lineWidth = 10;
    ctx.strokeStyle = "#627eed";

    if (pwdArr.length) {

      if (touches) {
        let lastPoint = circleArr[pwdArr[pwdArr.length-1]]

        ctx.beginPath()
        ctx.moveTo((lastPoint as Point).x, (lastPoint as Point).y)
        ctx.lineTo(touches.pageX, touches.pageY)
        ctx.stroke()
      }

      pwdArr.reduce((a, b) => {
        ctx.beginPath()
        ctx.moveTo((circleArr[a] as Point).x, (circleArr[a] as Point).y)
        ctx.lineTo((circleArr[b] as Point).x, (circleArr[b] as Point).y)
        ctx.stroke()
        return b
      })

    }
  }

  bindEvent(canvas:any, lineCtx:any, drawSolidCircleCtx:any, circleR:number, circleArr:Point[], pwdArr:[], canvasWidth:number, canvasHeight:number) {

    const start = (e:any) => {
      this.getPwdArr(e.touches[0], circleArr, circleR, pwdArr)
      this.drawSolidCircle(drawSolidCircleCtx, 10, circleArr, pwdArr)
    }

    const move = (e:any) => {
      this.getPwdArr(e.touches[0], circleArr, circleR, pwdArr)
      this.drawSolidCircle(drawSolidCircleCtx, 10, circleArr,pwdArr)
      lineCtx.clearRect(0,0,canvasWidth,canvasHeight);
      this.drawLine(lineCtx, circleArr, pwdArr, e.touches[0])
    }

    const end = (e:any) => {
      lineCtx.clearRect(0,0,canvasWidth,canvasHeight);
      this.drawLine(lineCtx, circleArr, pwdArr)
      
      console.log(pwdArr)

      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove', move)
    }

    canvas.addEventListener('touchstart', start)
    canvas.addEventListener('touchmove', move)
    canvas.addEventListener('touchend', end)

  }

  componentWillMount() {
    
    let canvasWidth:number = 400
    let canvasHeight:number = 400
    let offsetX:number = 30
    let offsetY:number = 30
    let circleR:number = 30
    let pwdArr:number[] = []
    let circleArr:Point[] = []

    // let offsetTop = lineCanvas.offsetTop

    // this.lineCanvas!.width = this.hollowCircleCanvas!.width = this.drawSolidCircleCanvas!.width = canvasWidth


    // this.lineCanvas!.height = this.hollowCircleCanvas!.height = this.drawSolidCircleCanvas!.height = canvasHeight

    let lineCtx = this.lineCanvas!.getContext('2d')
    let hollowCircleCtx = this.hollowCircleCanvas!.getContext('2d')
    let drawSolidCircleCtx = this.drawSolidCircleCanvas!.getContext('2d')

    let diffX = (canvasWidth-offsetX*2-circleR*2*3)/2
    let diffY = (canvasHeight-offsetY*2-circleR*2*3)/2

    circleArr = this.getCircleArr(offsetX, offsetY, diffX, diffY, circleR)

    this.drawHollowCircle(hollowCircleCtx, circleR, circleArr)

    this.bindEvent(this.drawSolidCircleCanvas, lineCtx, drawSolidCircleCtx, circleR, circleArr, pwdArr, canvasWidth, canvasHeight)
  }
  
  
  render() {
    return (
      <div>
        <canvas id="lineCanvas" ref={(r) => this.lineCanvas = r}></canvas>
        <canvas id="hollowCircleCanvas"></canvas>
        <canvas id="drawSolidCircleCanvas"></canvas>
      </div>
    )
  }
}

export default DrawUnlock
