
export function throttle (fn, delay = 30) {
  let timer:number = 0

  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments)

        timer = 0
      }, delay)
    }
  }
}