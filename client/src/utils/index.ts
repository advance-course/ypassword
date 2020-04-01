export function throttle (fn: any, delay = 30) {
  let timer: any = 0;

  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = 0;
      }, delay)
    }
  }
}

// 获取唯一值
export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}