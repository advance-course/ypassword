import Taro, { useEffect, useState, createCanvasContext } from '@tarojs/taro';
import { Canvas, View } from '@tarojs/components';
import {getCircleArr, lockConfig, Point, drawNineCircle, drawSolidCircle, drawLine, drawErrorTips, drawConnectLine} from './utils';
import { ITouchEvent } from "@tarojs/components/types/common";
import {throttle} from 'utils';
import './index.scss';

let password = '0124678'  // 默认密码

export default function GestureLock(props: typeof lockConfig) {
  let {bgColor, circleColor, lineColor, lineWidth,
    offsetX, offsetY, touchRange, circleR, circleBorderColor,
  } = { ...lockConfig, ...props };
  let [circleArr] = useState<Point[]>([]);
  const [lineCtx] = useState(createCanvasContext('lineCanvas', this.$scope));
  const [lineCacheCtx] = useState(createCanvasContext('lineCacheCanvas', this.$scope));
  const [baseCanvasCtx] = useState(createCanvasContext('baseCanvas', this.$scope));
  let [isTouching] = useState(false);
  let [pwdArr] = useState<number[]>([]);
  let [prePointIndex] = useState<number>(-1);

  useEffect(() => {
    Taro.createSelectorQuery().in(this.$scope)
      .select(".gesture_canvas")
      .boundingClientRect((rect: Taro.SelectorQuery.clientRectElement) => {
        const {width, height} = rect;
        const diffX = (width - offsetX * 2 - circleR * 2 * 3) / 2;
        const diffY = (height - offsetY * 2 - circleR * 2 * 3) / 2;
        circleArr = getCircleArr(offsetX, offsetY, diffX, diffY, circleR);

        // 初始化
        initData();
      }).exec();
  }, []);

  // 初始数据和画布
  function initData() {
    // 清空画布
    lineCtx.draw()
    lineCacheCtx.draw()
    baseCanvasCtx.draw()
    pwdArr = []
    prePointIndex = -1;
    
    drawNineCircle(baseCanvasCtx, circleArr, {circleR, circleBorderColor, circleColor});
    isTouching = true;
  }

  // 碰撞检测，得到密码，及相应操作
  const getPwdArr: any = throttle((x: number, y: number) => {
    for(let i = 0, length = circleArr.length; i < length; i++){
      let xDiff = circleArr[i].x - x;
      let yDiff = circleArr[i].y - y;

      let dir = Math.sqrt(xDiff*xDiff + yDiff*yDiff);

      if (pwdArr.indexOf(i) >= 0 || dir > touchRange ) {
        continue;
      } else {
        Taro.vibrateShort()  // 震动
        pwdArr.push(i)
        prePointIndex >= 0 && drawConnectLine(lineCacheCtx, {
          pointA: circleArr[prePointIndex],
          pointB: circleArr[i],
          lineWidth, 
          lineColor
        });
        prePointIndex = i;
        drawSolidCircle(baseCanvasCtx, circleArr[i], {circleR, circleColor});
        return
      }
    }
  }, 30)

  // 检测密码
  function checkPwd() {
    if (pwdArr.join('') === password) {
      return Taro.switchTab({
        url: '/pages/index/index'
      })
    }

    Taro.vibrateLong();
    Taro.showToast({
      title: "密码错误！",
      icon: "error",
      duration: 2000
    });
    drawErrorTips(baseCanvasCtx, {pwdArr, circleArr, ...props});
    setTimeout(initData, 2000);
  }

  // 手指移动
  function touchMove(e: ITouchEvent) {
    if (isTouching) {
      const { x, y } = e.changedTouches[0];
      getPwdArr(x, y);
      drawLine(lineCtx, {x, y, lineWidth, lineColor, pwdArr, circleArr});
    }
  }

  // 手指离开
  function touchEnd() {
    if (isTouching) {
      lineCtx.draw();
      checkPwd();
      isTouching = false;
    }
  }

  return (
    <View className="gesture_wrap" style={{ backgroundColor: bgColor }}>
      <View className="gesture_preview"></View>

      <View className="tips">请绘制手势</View>

      <View className="gesture_main">
        <Canvas className="gesture_canvas" canvasId="lineCanvas" />
        <Canvas className="gesture_canvas" canvasId="lineCacheCanvas" />
        <Canvas
          className="gesture_canvas"
          canvasId="baseCanvas"
          onTouchStart={touchMove}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        />
      </View>
    </View>
  );
}

