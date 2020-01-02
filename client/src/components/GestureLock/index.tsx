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

let lineCtx:any = null  // 直线画笔context
let lineCacheCtx:any = null  // 缓存直线的context
let baseCanvasCtx:any = null  // 基础画布context
let prePointIndex:number | null = null  // 前一个选中的点的index
let circleR:number = 33  // 默认空心圆的半径
let touchRange:number = 35  // 在圆心多少范围内触碰检测
let circleArr:Point[] = []  // 九宫格圆心对象数组
let pwdArr:number[] = []  // 画图形得到的密码数组
let canvasWidth:number = 300  // 画布宽
let canvasHeight:number = 300  // 画布高
let offsetX:number = 40  // 内边距
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

  // 初始数据和画布
  function initData() {
    // 清空画布
    lineCtx.draw()
    lineCacheCtx.draw()
    baseCanvasCtx.draw()
    pwdArr = []
    prePointIndex = null
    
    drawNineCircle(baseCanvasCtx, circleArr, circleR)

    // 绑定
    changeEventBind(true)
  }

  function changeEventBind(isBind:boolean) {
    hasBindTouchStart = isBind
    hasBindTouchMove = isBind
  }

  // 获取九个圆心位置
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

  // 碰撞检测，得到密码，及相应操作
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
        drawConnectLine(lineCacheCtx, i)
        drawSolidCircle(baseCanvasCtx, i)
        return
      }

    }

  }, 30)

  // 画基础圆
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

  // 画九个圆
  function drawNineCircle(ctx:any, circleArr:Point[], circleR:number){

    circleArr.forEach((v, i) => {
      drawBaseCircle(ctx, circleArr[i], circleR)
    })
  }

  // 画激活的圆心
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

  // 画最近点到手指的线
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

  // 画连接线
  function drawConnectLine(ctx:any, index:number) {

    
    if (prePointIndex !== null) {

      ctx.beginPath()
      ctx.lineWidth = lineWidth;
      ctx.setStrokeStyle(lineColor)
      ctx.moveTo(circleArr[prePointIndex].x, circleArr[prePointIndex].y)
      ctx.lineTo(circleArr[index].x, circleArr[index].y)
      ctx.stroke()
      ctx.draw(true)

    }
    
    prePointIndex = index

  }

  // 画错误提示
  function drawErrorTips(ctx:any) {

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

    // 画九个圆
    drawNineCircle(baseCanvasCtx, circleArr, circleR)

    // 画错误的激活点
    pwdArr.forEach((v) => {
      ctx.setFillStyle('#F56C6C')
      ctx.beginPath()
      ctx.arc(circleArr[v].x, circleArr[v].y, 10, 0, 2*Math.PI)
      ctx.fill()
      ctx.draw(true)
    })
  }


  // 手指点击
  function touchStart(e:any) {
    if (!hasBindTouchStart) return  // 判断事件绑定

    getPwdArr(e.touches[0])
  }

  // 手指移动
  function touchMove(e:any) {

    if (!hasBindTouchMove) return  // 判断事件绑定

    getPwdArr(e.touches[0])

    drawLine(lineCtx, e.touches[0])

  }

  // 手指离开
  function touchEnd() {
    lineCtx.draw()

    checkPwd()

    // 解除绑定
    changeEventBind(false)
  }

  // 检测密码
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

      drawErrorTips(baseCanvasCtx)

      // 重置
      setTimeout(initData, 2000)
    }
  }

  useEffect(() => {

    lineCtx = Taro.createCanvasContext('lineCanvas', this.$scope)
    lineCacheCtx = Taro.createCanvasContext('lineCacheCanvas', this.$scope)
    baseCanvasCtx = Taro.createCanvasContext('baseCanvas', this.$scope)

    let query = Taro.createSelectorQuery().in(this.$scope);

    query.select('.gesture_canvas').boundingClientRect((rect) => {

      canvasWidth = rect.width
      canvasHeight = rect.height

      let diffX = (canvasWidth-offsetX*2-circleR*2*3)/2
      let diffY = (canvasHeight-offsetY*2-circleR*2*3)/2

      circleArr = getCircleArr(offsetX, offsetY, diffX, diffY, circleR)

      // 初始化
      initData()

    }).exec();

  }, [])

  return (
    <View className="gesture_wrap" style={{ backgroundColor: bgColor }}>
      <View className="gesture_preview"></View>

      <View className="tips">请绘制手势</View>

      <View className="gesture_main">
        <Canvas className="gesture_canvas" canvasId="lineCanvas"></Canvas>
        <Canvas className="gesture_canvas" canvasId="lineCacheCanvas"></Canvas>
        <Canvas
          className="gesture_canvas"
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

