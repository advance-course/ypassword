import Taro from "@tarojs/taro";

interface Response<T> {
  success: boolean,
  code: number,
  data: T,
  message: string
}

interface CloudResult<T> extends Taro.cloud.CallFunctionResult {
  requestID: string,
  result: Response<T>
}

function http<T>(url: string, data?: {}): Promise<Response<T>> {
  let name = '';
  let $url = url.replace(/(^[a-z]+)\//, (m, $1, $2) => {
    name = $1;
    return ''
  });

  return new Promise((resolve, reject) => {
    if (!name) {
      reject(createError('url格式有误，请检查', 10001));
    }

    Taro.cloud.callFunction({
      name, data: { $url, ...data }
    }).then((res: CloudResult<T>) => {
      if (res.result.success) {
        return resolve(res.result);
      }
      const {message, code} = res.result;
      reject(createError(message, code));
    }).catch(err => {
      reject(err);
    })
  });
}

function createError(desc: string, code: number) {
  const error = new Error();
  error.message = error.name = desc;
  // @ts-ignore
  error.code = code;
}

// 在这个引用场景，get，post，delete仅用作语义化的区分，功能上其实没有差别
export default {
  get: http,
  post: http,
  delete: http,
  put: http
}
