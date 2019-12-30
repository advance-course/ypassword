import Taro, { useEffect } from '@tarojs/taro';
import { Canvas } from '@tarojs/components'

import './index.scss';

interface DrawUnlockProps {};

interface Point {
  x: number,
  y: number
}


let hasBindTouchStart:boolean = true  // 有没有绑定touchstart事件
let hasBindTouchMove:boolean = true  // 有没有绑定touchmove事件

let lineCtx:any = null  // 直线画笔context
let drawSolidCircleCtx:any = null  // 实心圆画笔context
let circleR:number = 20  // 默认空心圆的半径
let circleArr:Point[] = []  // 九宫格圆心对象数组
let pwdArr:number[] = []  // 画图形得到的密码数组
let canvasWidth:number = 375  // 画布宽
let canvasHeight:number = 500  // 画布高

let password:string = '0124678'  // 默认密码

export default function DrawUnlock(props):DrawUnlockProps {

  function getCircleArr(offsetX:number, offsetY:number, diffX:number, diffY:number):Point[] {
    let circleArr:Point[] = []

    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        let positionObj:Point = {
          x: offsetX+row*diffX+(2*row+1)*circleR,
          y: offsetY+col*diffY+(2*col+1)*circleR
        }

        circleArr.push(positionObj)
      }
    }
    console.log(circleArr)
    return circleArr

  }

  function getPwdArr(touches:any) {

    for(let i = 0, length = circleArr.length; i < length; i++){
      let xDiff = circleArr[i].x - touches.x
      let yDiff = circleArr[i].y - touches.y

      let dir = Math.sqrt(xDiff*xDiff + yDiff*yDiff)

      if (pwdArr.indexOf(i) >= 0 || dir > circleR ) {
        continue;
      } else {
        pwdArr.push(i)
        drawSolidCircle(drawSolidCircleCtx, 10)
        return
      }

    }

  }

  function drawHollowCircle(ctx:any){

    circleArr.forEach((v) => {
      ctx.setStrokeStyle('#627eed')
      ctx.beginPath()
      ctx.arc(v.x, v.y, circleR, 0, 2*Math.PI)
      ctx.stroke()
      ctx.draw(true)

    })
  }

  function drawSolidCircle(ctx:any, circleR:number) {
    pwdArr.forEach((v) => {
      ctx.setFillStyle('#627eed')
      ctx.beginPath()
      ctx.arc(circleArr[v].x, circleArr[v].y, circleR, 0, 2*Math.PI)
      ctx.fill()
      ctx.draw(true)
    })
  }

  function drawLine(ctx:any, touches?:any) {

    ctx.lineWidth = 10;
    ctx.setStrokeStyle('#627eed')

    let arrLength = pwdArr.length

    if (arrLength) {

      if (touches) {
        let lastPoint = circleArr[pwdArr[arrLength-1]]

        ctx.beginPath()
        ctx.moveTo(lastPoint.x, lastPoint.y)
        ctx.lineTo(touches.x, touches.y)
        ctx.stroke()
        ctx.draw()
      }

      pwdArr.reduce((a, b) => {
        ctx.beginPath()
        ctx.moveTo(circleArr[a].x, circleArr[a].y)
        ctx.lineTo(circleArr[b].x, circleArr[b].y)
        ctx.stroke()
        ctx.draw(true)
        return b
      })

    }
  }

  function touchStart(e:any) {
    if (!hasBindTouchStart) return  // 判断事件绑定

    getPwdArr(e.touches[0])
    drawSolidCircle(drawSolidCircleCtx, 10)
  }

  function touchMove(e:any) {

    if (!hasBindTouchMove) return  // 判断事件绑定

    getPwdArr(e.touches[0])
    // this.lineCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight);

    drawLine(lineCtx, e.touches[0])

  }

  function touchEnd() {
    lineCtx.clearRect(0,0,canvasWidth,canvasHeight);
    drawLine(lineCtx)

    checkPwd()

    lineCtx.clearRect(0,0,canvasWidth,canvasHeight);

    // 解除绑定
    hasBindTouchStart = false
    hasBindTouchMove = false
  }

  function checkPwd() {
    if (pwdArr.join('') === password) {
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

  useEffect(() => {
    let query = Taro.createSelectorQuery();

    query.select('.canvas').boundingClientRect((rect) => {

      canvasWidth = rect.width
      canvasHeight = rect.height

      let offsetX:number = 30
      let offsetY:number = 30

      lineCtx = Taro.createCanvasContext('lineCanvas', this.$scope)
      let hollowCircleCtx = Taro.createCanvasContext('hollowCircleCanvas', this.$scope)
      drawSolidCircleCtx = Taro.createCanvasContext('drawSolidCircleCanvas', this.$scope)

      let diffX = (canvasWidth-offsetX*2-circleR*2*3)/2
      let diffY = (canvasHeight-offsetY*2-circleR*2*3)/2
      console.log(diffY)
      circleArr = getCircleArr(offsetX, offsetY, diffX, diffY)

      drawHollowCircle(hollowCircleCtx)

    }).exec();

  }, [])

  return (
    <div>
      <Canvas className="canvas" canvasId="lineCanvas"></Canvas>
      <Canvas className="canvas" canvasId="hollowCircleCanvas"></Canvas>
      <Canvas
        className="canvas"
        canvasId="drawSolidCircleCanvas"
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
      </Canvas>
    </div>
  )
}

