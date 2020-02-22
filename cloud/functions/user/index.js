const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');

/**
 * event: 云函数调用时，传入的参数，包括$url
 */
exports.main = async (event, context) => {
  const { OPENID, ENV } = cloud.getWXContext()
  cloud.init({
    env: ENV == 'local' ? "release-d541f1" : 'prod-d541f1'
  });

  const db = cloud.database();
  const user = db.collection('user');
  const app = new TcbRouter({ event });
  
  // 注册
  app.router('v1/register', async(ctx, next) => {
    const { nickName, avatarUrl, city, country, gender, language, province, } = event;
    let userInfo = await user.where({
      _openid: OPENID,
    }).get();

    if (!userInfo.data.length) {
      // 新建用户
      const userId = await user.add({
        data: { _openid: OPENID, nickName, avatarUrl, city, country, gender, language, province }
      })
      ctx.body = { success: true, code: 200, message: '注册成功', data: userId }
    } else {
      ctx.body = { success: false, code: 200, message: '当前用户已经存在！', data: userId }
    }
  })

  // 登陆
  app.router('v1/login', async(ctx, next) => {
    const info = await user.where({
      _openid: OPENID,
    }).field({_openid: false}).get()

    if (info.data.length) {
      ctx.body = { success: true, code: 200, message: '请求成功', data: info.data[0], }
    } else {
      ctx.body = { success: false, code: 1002, message: '无此用户，请注册' }
    }
  })

  // 查询指定用户的信息
  app.router('v1/info', async(ctx, next) => {
    const res = await user.where({
      _id: event.userId,
    }).get();

    ctx.body = { success: true, code: 200, message: '请求成功', data: res.data }
  })
  
  /**
   * 查询用户信息分页列表
   * @param {current} 当前页，默认值1
   * @param {pageSize} 每一页大小 默认值10
   */
  app.router('v1/list', async (ctx) => {
    const {current = 1, pageSize = 10} = event;
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
  })

  return app.serve();
}