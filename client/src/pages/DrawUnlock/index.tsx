import Taro, { useEffect } from '@tarojs/taro';
import { Canvas } from '@tarojs/components'

import { throttle } from '../../utils/utils'
import './index.scss';

interface DrawUnlockProps {};

interface Point {
  x: number,
  y: number
}


let hasBindTouchStart:boolean = true  // 有没有绑定touchstart事件
let hasBindTouchMove:boolean = true  // 有没有绑定touchmove事件

let lineCtx:any = null  // 直线画笔context
let cacheCanvasCtx:any = null  // 实心圆画笔context
let prePointIndex:number | undefined = undefined  // 前一个选中的点的index
let circleR:number = 20  // 默认空心圆的半径
let touchRange:number = 30  // 在圆心多少范围内触碰检测
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

  const getPwdArr = throttle((touches:any) => {

    for(let i = 0, length = circleArr.length; i < length; i++){
      let xDiff = circleArr[i].x - touches.x
      let yDiff = circleArr[i].y - touches.y

      let dir = Math.sqrt(xDiff*xDiff + yDiff*yDiff)

      if (pwdArr.indexOf(i) >= 0 || dir > touchRange ) {
        continue;
      } else {
        pwdArr.push(i)
        drawSolidCircle(cacheCanvasCtx, 10, i)
        drawConnectLine(cacheCanvasCtx, i)
        return
      }

    }

  }, 30)

  function drawHollowCircle(ctx:any){

    circleArr.forEach((v) => {
      ctx.setStrokeStyle('#627eed')
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(v.x, v.y, circleR, 0, 2*Math.PI)
      ctx.stroke()
      ctx.draw(true)
      
      ctx.setFillStyle('#fff')
      ctx.beginPath()
      ctx.arc(v.x, v.y, circleR-1, 0, 2*Math.PI)
      ctx.fill()
      ctx.draw(true)
    })
  }

  function drawSolidCircle(ctx:any, circleR:number, index:number) {

    ctx.setFillStyle('#627eed')
    ctx.beginPath()
    ctx.arc(circleArr[index].x, circleArr[index].y, circleR, 0, 2*Math.PI)
    ctx.fill()
    ctx.draw(true)

  }

  function drawLine(ctx:any, touches?:any) {

    ctx.lineWidth = 10;
    ctx.setStrokeStyle('#627eed')
    ctx.setLineCap('round')

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

    }
  }

  function drawConnectLine(ctx:any, index?:number) {

    if (prePointIndex !== undefined) {
      ctx.beginPath()
      ctx.lineWidth = 10;
      ctx.setStrokeStyle('#627eed')
      ctx.moveTo(circleArr[prePointIndex].x, circleArr[prePointIndex].y)
      ctx.lineTo(circleArr[index].x, circleArr[index].y)
      ctx.stroke()
      ctx.draw(true)
    }
    
    prePointIndex = index

  }

  function drawErrorTips(ctx:any) {

    pwdArr.reduce((a,b) => {
      ctx.beginPath()
      ctx.lineWidth = 10;
      ctx.setStrokeStyle('#F56C6C')
      ctx.moveTo(circleArr[a].x, circleArr[a].y)
      ctx.lineTo(circleArr[b].x, circleArr[b].y)
      ctx.stroke()
      ctx.draw(true)

      return b
    })

    drawHollowCircle(cacheCanvasCtx)

    pwdArr.forEach((v) => {
      ctx.setFillStyle('#F56C6C')
      ctx.beginPath()
      ctx.arc(circleArr[v].x, circleArr[v].y, 10, 0, 2*Math.PI)
      ctx.fill()
      ctx.draw(true)
    })
  }


  function touchStart(e:any) {
    if (!hasBindTouchStart) return  // 判断事件绑定

    getPwdArr(e.touches[0])
  }

  function touchMove(e:any) {

    if (!hasBindTouchMove) return  // 判断事件绑定

    getPwdArr(e.touches[0])
    // this.lineCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight);

    drawLine(lineCtx, e.touches[0])

  }

  function touchEnd() {
    // lineCtx.clearRect(0,0,canvasWidth,canvasHeight);
    lineCtx.draw()

    checkPwd()

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

      // cacheCanvasCtx.clearRect(0,0,375,400);
      cacheCanvasCtx.draw()
      drawErrorTips(cacheCanvasCtx)
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
      cacheCanvasCtx = Taro.createCanvasContext('cacheCanvas', this.$scope)

      let diffX = (canvasWidth-offsetX*2-circleR*2*3)/2
      let diffY = (canvasHeight-offsetY*2-circleR*2*3)/2
      console.log(diffY)
      circleArr = getCircleArr(offsetX, offsetY, diffX, diffY)

      drawHollowCircle(cacheCanvasCtx)

    }).exec();

  }, [])

  return (
    <div>
      <Canvas className="canvas" canvasId="lineCanvas"></Canvas>
      <Canvas
        className="canvas"
        canvasId="cacheCanvas"
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
      </Canvas>
    </div>
  )
}

