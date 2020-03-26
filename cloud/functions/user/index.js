const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');

/**
 * event: 云函数调用时，传入的参数，包括$url
 */
exports.main = async (event, context) => {
  const { OPENID, ENV } = cloud.getWXContext()
  console.log(OPENID, ENV);
  cloud.init({
    env: ENV == 'local' ? "release-d541f1" : 'prod-d541f1'
  });

  const db = cloud.database();
  const user = db.collection('user');
  const app = new TcbRouter({ event });
  
  /**
   * @description 注册
   */
  app.router('v1/register', async(ctx, next) => {
    const _info = {
      openid: OPENID,
      nickName: '',
      avatarUrl: '',
      city: '',
      country: '',
      gender: 1,
      language: 'zh_CN',
      province: '',
      isLock: true,  // 是否启用加锁
      isFingerprintLock: false, // 是否启用指纹解锁
      isNinecaseLock: false, // 是否启用九宫格解锁
      type: 3  // 1: 超级管理员  2: 管理员  3：普通用户  4：付费用户
    }

    let userInfo = await user.where({
      openid: OPENID,
    }).get();

    if (userInfo.data.length > 0) {
      ctx.body = { success: false, code: 200, message: '当前用户已经存在！', data: null }
      return
    }
    const info = { ..._info, ...event };
    delete info.$url;
    try {
      const res = await user.add({ data: info });
      ctx.body = { success: true, code: 200, message: '注册成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  /**
   * @description 登陆
   */
  app.router('v1/login', async(ctx, next) => {
    try {
      const info = await user.where({
        openid: OPENID,
      }).field({ openid: false }).get()

      if (info.data.length) {
        ctx.body = { success: true, code: 200, message: '请求成功', data: info.data[0], }
        return
      }

      ctx.body = { success: false, code: 1002, message: '无此用户，请注册' }
    } catch (e) {
      ctx.body = {success: false, code: errCode, message: errMsg}
    }
  })

  /**
   * @description 查询用户基本信息
   * @param {userid} 用户id
   */
  app.router('v1/info', async(ctx, next) => {
    try {
      const res = await user.doc(event.userid).get();
      ctx.body = { success: true, code: 200, message: '请求成功', data: res.data }
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  // 修改某用户信息的内容
  app.router('v1/update/info', async (ctx) => {
    const {userid, $url, ...other} = event;
    try {
      await user.doc(userid).update({
        data: {
          ...other
        }
      })

      ctx.body = { success: true, code: 200, message: '更新成功', data: null}
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })
  
  /**
   * 查询用户信息分页列表
   * @param {current} 当前页，默认值1
   * @param {pageSize} 每一页大小 默认值10
   */
  app.router('v1/list', async (ctx) => {
    const {current = 1, pageSize = 10} = event;
    try {
      const count = await user.count();
      const total = count.total;
      let lastPage = false;
      if (current * pageSize >= total) {
        lastPage = true;
      }
      const start = pageSize * (current - 1);
      const list = await user.skip(start).limit(pageSize).get();

      const result = { pageSize, current, lastPage, total, list: list.data };
      ctx.body = {
        success: true,
        code: 200,
        message: '请求成功',
        data: result
      }
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  return app.serve();
}