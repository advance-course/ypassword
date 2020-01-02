import Taro, { useEffect } from '@tarojs/taro';
import { Canvas, View, Text } from '@tarojs/components'

import { throttle } from '../../utils/utils'
import './index.scss';

interface Options {
  bgColor:string
  circleColor:string
  lineColor:string
  lineWidth:number
}

interface Props {
  options?: Options
};


interface Point {
  x: number,
  y: number
}

let hasBindTouchStart:boolean = true  // 有没有绑定touchstart事件
let hasBindTouchMove:boolean = true  // 有没有绑定touchmove事件

let previewCanvas:any = null  // 预览context
let lineCtx:any = null  // 直线画笔context
let baseCanvasCtx:any = null  // 基础画布context
let prePointIndex:number | undefined = undefined  // 前一个选中的点的index
let circleR:number = 33  // 默认空心圆的半径
let touchRange:number = 35  // 在圆心多少范围内触碰检测
let circleArr:Point[] = []  // 九宫格圆心对象数组
let pwdArr:number[] = []  // 画图形得到的密码数组
let canvasWidth:number = 300  // 画布宽
let canvasHeight:number = 300  // 画布高
let offsetX:number = 5  // 内边距
let offsetY:number = 5  // 内边距
let circleBorderColor:string = '#717176'

let password:string = '0124678'  // 默认密码

export default function GestureLock(props:Props) {

  let options = {
    bgColor: '#323039',  // 背景颜色
    circleColor: '#292a2c',  // 圆颜色
    lineColor: '#ecd487',  // 线的颜色
    lineErrorColor: '#f56c6c',  // 错误线颜色
    lineWidth: 5,  // 线宽
  }

  let {
    bgColor,
    circleColor,
    lineColor,
    lineErrorColor,
    lineWidth,
  } = { ...options, ...props.options }

  function getCircleArr(offsetX:number, offsetY:number, diffX:number, diffY:number, circleR:number):Point[] {
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
        Taro.vibrateShort()  // 震动
        pwdArr.push(i)
        drawConnectLine(baseCanvasCtx, i)
        drawSolidCircle(baseCanvasCtx, i)
        return
      }

    }

  }, 30)

  function drawBaseCircle(ctx:any, point:Point, circleR:number) {
    ctx.setStrokeStyle(circleBorderColor)
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(point.x, point.y, circleR, 0, 2*Math.PI)
    ctx.stroke()
    ctx.draw(true)
    
    ctx.setFillStyle(circleColor)
    ctx.beginPath()
    ctx.arc(point.x, point.y, circleR-1, 0, 2*Math.PI)
    ctx.fill()
    ctx.draw(true)
  }

  function drawNineCircle(ctx:any, circleArr:Point[], circleR:number){

    circleArr.forEach((v, i) => {
      drawBaseCircle(ctx, circleArr[i], circleR)
    })
  }

  function drawSolidCircle(ctx:any, index:number) {

    const grdOutside = ctx.createCircularGradient(circleArr[index].x, circleArr[index].y, circleR-5)
    grdOutside.addColorStop(0, '#e8bb68')
    grdOutside.addColorStop(1, circleColor)
    ctx.setFillStyle(grdOutside)
    ctx.beginPath()
    ctx.arc(circleArr[index].x, circleArr[index].y, circleR-5, 0, 2*Math.PI)
    ctx.fill()
    ctx.draw(true)

  }

  function drawLine(ctx:any, touches?:any) {

    ctx.lineWidth = lineWidth;
    ctx.setStrokeStyle(lineColor)
    ctx.setLineCap('round')

    let arrLength = pwdArr.length

    let lastPoint = circleArr[pwdArr[arrLength-1]]
    
    if (touches && arrLength) {
        ctx.beginPath()
        ctx.moveTo(lastPoint.x, lastPoint.y)
        ctx.lineTo(touches.x, touches.y)
        ctx.stroke()
        ctx.draw()
    }

  }

  function drawConnectLine(ctx:any, index:number) {

    
    if (prePointIndex !== undefined) {

      ctx.beginPath()
      ctx.lineWidth = lineWidth;
      ctx.setStrokeStyle(lineColor)
      ctx.moveTo(circleArr[prePointIndex].x, circleArr[prePointIndex].y)
      ctx.lineTo(circleArr[index].x, circleArr[index].y)
      ctx.stroke()
      ctx.draw(true)

      drawBaseCircle(ctx, circleArr[prePointIndex], circleR)

      drawSolidCircle(ctx, prePointIndex)

    }

    drawBaseCircle(ctx, circleArr[index], circleR)

    drawSolidCircle(ctx, index)
    
    prePointIndex = index

  }

  function drawErrorTips(ctx:any) {

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

    drawNineCircle(baseCanvasCtx, circleArr, circleR)

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
      Taro.vibrateLong()

      Taro.showToast({
        title: '密码错误！',
        icon: 'error',
        duration: 2000
      })

      // baseCanvasCtx.clearRect(0,0,375,400);
      // baseCanvasCtx.draw()
      drawErrorTips(baseCanvasCtx)

      setTimeout(() => {
        lineCtx.draw()
        baseCanvasCtx.draw()
        pwdArr = []
        prePointIndex = undefined
        drawNineCircle(baseCanvasCtx, circleArr, circleR)

        // 绑定
        hasBindTouchStart = true
        hasBindTouchMove = true
      },2000)
    }
  }

  useEffect(() => {

    lineCtx = Taro.createCanvasContext('lineCanvas', this.$scope)
    baseCanvasCtx = Taro.createCanvasContext('baseCanvas', this.$scope)

    let query = Taro.createSelectorQuery().in(this.$scope);

    query.select('.gesture_canvas').boundingClientRect((rect) => {

      canvasWidth = rect.width
      canvasHeight = rect.height

      let diffX = (canvasWidth-offsetX*2-circleR*2*3)/2
      let diffY = (canvasHeight-offsetY*2-circleR*2*3)/2

      circleArr = getCircleArr(offsetX, offsetY, diffX, diffY, circleR)

      drawNineCircle(baseCanvasCtx, circleArr, circleR)

    }).exec();

    query.select('.gesture_preview').boundingClientRect((rect) => {

      let canvasWidth = rect.width
      let canvasHeight = rect.height

      let offsetX = 1
      let offsetY = 1
      let circleR = 5

      let diffX = (canvasWidth-offsetX*2-circleR*2*3)/2
      let diffY = (canvasHeight-offsetY*2-circleR*2*3)/2

      let circleArr = getCircleArr(offsetX, offsetY, diffX, diffY, circleR)
console.log(circleArr)
      let ctx = Taro.createCanvasContext('previewCanvas', this.$scope)

      drawNineCircle(ctx, circleArr, circleR)

    }).exec();



  }, [])

  return (
    <View className="gesture_wrap" style={{ backgroundColor: bgColor }}>
      <Canvas className="gesture_preview" canvasId="previewCanvas"></Canvas>

      <View className="tips">请绘制手势</View>

      <View className="gesture_main">
        <Canvas className="gesture_canvas" canvasId="lineCanvas"></Canvas>
        <Canvas
          className="gesture_canvas overlap"
          canvasId="baseCanvas"
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
        </Canvas>
      </View>
    </View>
  )
}

