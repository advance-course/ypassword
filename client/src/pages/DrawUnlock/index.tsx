import Taro, { Component, chooseInvoiceTitle } from '@tarojs/taro';
import { Canvas } from '@tarojs/components'

import './index.scss';

interface DrawUnlockProps {};
interface DrawUnlockState {};

interface Point {
  x: number,
  y: number
}

export class DrawUnlock extends Component<DrawUnlockProps, DrawUnlockState> {

  // private lineCanvas:HTMLCanvasElement | null
  // private hollowCircleCanvas:HTMLCanvasElement | null
  // private drawSolidCircleCanvas:HTMLCanvasElement | null

  hasBindTouchStart:boolean = true  // 有没有绑定touchstart事件
  hasBindTouchMove:boolean = true  // 有没有绑定touchmove事件

  lineCtx:any = null  // 直线画笔context
  drawSolidCircleCtx:any = null  // 实心圆画笔context
  circleR:number = 20  // 默认空心圆的半径
  circleArr:Point[] = []  // 九宫格圆心对象数组
  pwdArr:number[] = []  // 画图形得到的密码数组
  canvasWidth:number = 375  // 画布宽
  canvasHeight:number = 500  // 画布高

  password:string = '0124678'  // 默认密码


  getCircleArr(offsetX:number, offsetY:number, diffX:number, diffY:number):Point[] {
    let circleArr:Point[] = []

    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        let positionObj:Point = {
          x: offsetX+row*diffX+(2*row+1)*this.circleR,
          y: offsetY+col*diffY+(2*col+1)*this.circleR
        }

        circleArr.push(positionObj)
      }
    }

    return circleArr

  }

  getPwdArr(touches:any) {

    for(let i = 0, length = this.circleArr.length; i < length; i++){
      let xDiff = this.circleArr[i].x - touches.x
      let yDiff = this.circleArr[i].y - touches.y

      let dir = Math.sqrt(xDiff*xDiff + yDiff*yDiff)

      if (this.pwdArr.indexOf(i) >= 0 || dir > this.circleR ) {
        continue;
      } else {
        this.pwdArr.push(i)
        return
      }

    }

  }

  drawHollowCircle(ctx:any){

    this.circleArr.forEach((v) => {
      ctx.setStrokeStyle('#627eed')
      ctx.beginPath()
      ctx.arc(v.x, v.y, this.circleR, 0, 2*Math.PI)
      ctx.stroke()
      ctx.draw(true)

    })
  }

  drawSolidCircle(ctx:any, circleR:number) {
    this.pwdArr.forEach((v) => {
      ctx.setFillStyle('#627eed')
      ctx.beginPath()
      ctx.arc(this.circleArr[v].x, this.circleArr[v].y, circleR, 0, 2*Math.PI)
      ctx.fill()
      ctx.draw(true)
    })
  }

  drawLine(ctx:any, touches?:any) {

    ctx.lineWidth = 10;
    ctx.setStrokeStyle('#627eed')

    let arrLength = this.pwdArr.length

    if (arrLength) {

      if (touches) {
        let lastPoint = this.circleArr[this.pwdArr[arrLength-1]]

        ctx.beginPath()
        ctx.moveTo((lastPoint as Point).x, (lastPoint as Point).y)
        ctx.lineTo(touches.x, touches.y)
        ctx.stroke()
        ctx.draw()
      }

      this.pwdArr.reduce((a, b) => {
        ctx.beginPath()
        ctx.moveTo(this.circleArr[a].x, this.circleArr[a].y)
        ctx.lineTo(this.circleArr[b].x, this.circleArr[b].y)
        ctx.stroke()
        ctx.draw(true)
        return b
      })

    }
  }

  touchStart(e:any) {
    if (!this.hasBindTouchStart) return  // 判断事件绑定

    this.getPwdArr(e.touches[0])
    this.drawSolidCircle(this.drawSolidCircleCtx, 10)
  }

  touchMove(e:any) {
    if (!this.hasBindTouchMove) return  // 判断事件绑定

    this.getPwdArr(e.touches[0])
    this.drawSolidCircle(this.drawSolidCircleCtx, 10)
    // this.lineCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
    this.drawLine(this.lineCtx, e.touches[0])
  }

  touchEnd() {
    this.lineCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
    this.drawLine(this.lineCtx)

    this.checkPwd()

    // 解除绑定
    this.hasBindTouchStart = false
    this.hasBindTouchMove = false
  }

  checkPwd() {
    if (this.pwdArr.join('') === this.password) {
      Taro.switchTab({
        url: '/pages/index/index'
      })
    } else {
      Taro.showToast({
        title: '密码错误！',
        icon: 'error',
        duration: 2000
      })
    }
  }

  componentDidMount() {

    let query = Taro.createSelectorQuery();

    query.select('.canvas').boundingClientRect((rect) => {

      this.canvasWidth = rect.width
      this.canvasHeight = rect.height

    }).exec();

    
    let offsetX:number = 30
    let offsetY:number = 30

    this.lineCtx = Taro.createCanvasContext('lineCanvas', this.$scope)
    let hollowCircleCtx = Taro.createCanvasContext('hollowCircleCanvas', this.$scope)
    this.drawSolidCircleCtx = Taro.createCanvasContext('drawSolidCircleCanvas', this.$scope)

    let diffX = (this.canvasWidth-offsetX*2-this.circleR*2*3)/2
    let diffY = (this.canvasHeight-offsetY*2-this.circleR*2*3)/2

    this.circleArr = this.getCircleArr(offsetX, offsetY, diffX, diffY)

    this.drawHollowCircle(hollowCircleCtx)

  }
  
  
  render() {
    return (
      <div>
        <Canvas className="canvas" canvasId="lineCanvas"></Canvas>
        <Canvas className="canvas" canvasId="hollowCircleCanvas"></Canvas>
        <Canvas
          className="canvas"
          canvasId="drawSolidCircleCanvas"
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={this.touchEnd}
        >
        </Canvas>
      </div>
    )
  }
}

export default DrawUnlock
