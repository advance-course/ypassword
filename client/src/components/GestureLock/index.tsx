import Taro, { useEffect, useState, useRef, createCanvasContext } from '@tarojs/taro';
import { useDispatch } from '@tarojs/redux';
import { Canvas, View } from '@tarojs/components';
import { ITouchEvent } from "@tarojs/components/types/common";
import {
  getCircleArr,
  lockConfig,
  Point,
  drawNineCircle,
  drawSolidCircle,
  drawLine,
  drawErrorTips,
  drawConnectLine,
  checkCrash,
} from './utils';
import {throttle} from 'utils';
import './index.scss';

let password = '0124678'  // 默认密码

export default function GestureLock(props: typeof lockConfig) {

  let {
    bgColor,
    circleColor,
    lineColor,
    lineWidth,
    offsetX,
    offsetY,
    touchRange,
    circleR,
    circleBorderColor,
  } = { ...lockConfig, ...props };
  let [pwdArr,setPwdArr] = useState<number[]>([]);
  let [tipsIndex, setTipsIndex] = useState(0)

  const [lineCtx] = useState(createCanvasContext('lineCanvas', this.$scope));
  const [lineCacheCtx] = useState(createCanvasContext('lineCacheCanvas', this.$scope));
  const [baseCanvasCtx] = useState(createCanvasContext('baseCanvas', this.$scope));

  let circleArrRef = useRef<Point[]>([]);
  let isTouchingRef = useRef(false);
  let prePointIndexRef = useRef<number>(-1);

  const dispatch = useDispatch()

  let tipsObj = ['请绘制图形', '请重新绘制', '密码错误'];

  useEffect(() => {
    Taro.createSelectorQuery().in(this.$scope)
      .select(".gesture_canvas")
      .boundingClientRect((rect: Taro.SelectorQuery.clientRectElement) => {
        const {width, height} = rect;
        const diffX = (width - offsetX * 2 - circleR * 2 * 3) / 2;
        const diffY = (height - offsetY * 2 - circleR * 2 * 3) / 2;
        circleArrRef.current = getCircleArr(offsetX, offsetY, diffX, diffY, circleR);

        // 初始化
        initData();
      }).exec();
  }, []);

  // 初始数据和画布
  function initData() {
    let circleArr = circleArrRef.current
    
    setTipsIndex(0)

    // 清空画布
    lineCtx.draw()
    lineCacheCtx.draw()
    baseCanvasCtx.draw()
    pwdArr.length > 0 && setPwdArr([])
    prePointIndexRef.current = -1;
    
    drawNineCircle(baseCanvasCtx, circleArr, {circleR, circleBorderColor, circleColor});
    isTouchingRef.current = true;
  }

  // 碰撞检测，得到密码，及相应操作
  const getPwdArr: any = throttle((x: number, y: number) => {
    let circleArr = circleArrRef.current
    let prePointIndex = prePointIndexRef.current

    let length = pwdArr.length

    let currentPwdArr = [...pwdArr]

    let index = checkCrash(circleArr, touchRange, {moveX:x, moveY:y})
    if (index >= 0) {
      
      if (length) {
        let prePointer = circleArr[pwdArr[length-1]]

        let centerIndex = checkCrash(circleArr, touchRange, {moveX: (x+prePointer.x)/2, moveY: (y+prePointer.y)/2})

        if (centerIndex >= 0) {
          if (pwdArr.indexOf(centerIndex) < 0) {

            currentPwdArr.push(centerIndex)

            drawSolidCircle(baseCanvasCtx, circleArr[centerIndex], {circleR, circleColor});

          }
        }
      }

      if (pwdArr.indexOf(index) < 0) {
        Taro.vibrateShort()  // 震动

        currentPwdArr.push(index)
        
        prePointIndex >= 0 && drawConnectLine(lineCacheCtx, {
          pointA: circleArr[prePointIndex],
          pointB: circleArr[index],
          lineWidth, 
          lineColor
        });
  
        drawSolidCircle(baseCanvasCtx, circleArr[index], {circleR, circleColor});
        
        prePointIndexRef.current = index;

        setPwdArr(currentPwdArr)
      }
      
    }

  }, 30)

  // 检测密码
  function checkPwd() {
    let circleArr = circleArrRef.current

    if (pwdArr.join('') === password) {
      dispatch({type: 'setIsVerified', isVerified: true})

      return Taro.switchTab({
        url: '/pages/index/index'
      })
    }

    Taro.vibrateLong();
    
    setTipsIndex(2)

    drawErrorTips(baseCanvasCtx, {pwdArr, circleArr, ...props});
    setTimeout(initData, 2000);
  }

  // 手指移动
  function touchMove(e: ITouchEvent) {
    let circleArr = circleArrRef.current
    let isTouching = isTouchingRef.current

    if (isTouching) {
      const { x, y } = e.changedTouches[0];
      getPwdArr(x, y);

      drawLine(lineCtx, {x, y, lineWidth, lineColor, pwdArr, circleArr});
    }
  }

  // 手指离开
  function touchEnd() {
    let isTouching = isTouchingRef.current
    
    if (isTouching) {
      lineCtx.draw();
      checkPwd();
      isTouchingRef.current = false;
    }
  }

  return (
    <View className="gesture_wrap" style={{ backgroundColor: bgColor }}>
      <View className="gesture_preview">
        {
          Array.from({length:9}).map((v, i) => (
            <View key={i} className="pointer_wrap">
              <View className={`pointer ${pwdArr.indexOf(i) > -1 ? 'active' : ''}`}></View>
            </View>
          ))
        }
      </View>

      <View className="tips">{tipsObj[tipsIndex]}</View>

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

