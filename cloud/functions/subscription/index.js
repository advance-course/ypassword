const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');

/**
 * @param {event} 云函数调用时，传入的参数，包括$url
 */
exports.main = async (event, context) => {
  const { OPENID, ENV } = cloud.getWXContext()
  console.log(OPENID, ENV);
  cloud.init({
    // env: ENV == 'local' ? "release-d541f1" : 'prod-d541f1'
    env: "release-d541f1"
  });

  const db = cloud.database();
  const _ = db.command
  const $ = _.aggregate
  
  const subscription = db.collection('subscription');
  const app = new TcbRouter({ event });
  
  /**
   * @description 新增订阅号
   * @param {userid}
   */
  app.router('v1/add', async(ctx, next) => {
    const {name, userid} = event

    if (!name || !userid) {
      ctx.body = { success: false, code: 200, message: '参数异常', data: null }
      return
    }

    const info = { ...event, createTime: Date.now() };
    delete info.$url;
    try {
      const res = await subscription.add({ data: info });
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  /**
   * @param {_id}
   * @desc 更新订阅号
   */
  app.router('v1/update', async (ctx) => {
    const {_id, $url, ...other} = event;
    try {
      await subscription.doc(_id).update({
        data: { ...other }
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
   * @param {keyword} 通过关键字模糊匹配用户
   */
  app.router('v1/list', async (ctx) => {
    const { current = 1, pageSize = 10, keyword = '' } = event;
    try {
      let x = subscription;
      if (keyword) {
        x = await subscription.where(db.command.or([
          {
            nickName: db.RegExp({
              regexp: keyword
            })
          },
          {
            _id: db.RegExp({
              regexp: keyword
            })
          }
        ]))
      }
      const count = await x.count();
      const total = count.total || 0;
      let lastPage = false;
      if (current * pageSize >= total) {
        lastPage = true;
      }
      const start = pageSize * (current - 1);
      const list = await x.field({ openid: false, userInfo: false }).skip(start).limit(pageSize).get();

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