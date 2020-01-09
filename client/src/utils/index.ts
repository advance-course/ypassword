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