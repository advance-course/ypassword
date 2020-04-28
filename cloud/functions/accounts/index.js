const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');

/**
 * event: 云函数调用时，传入的参数，包括$url, 自动注入的 userInfo
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

  const accounts = db.collection('accounts');
  const app = new TcbRouter({ event });
  
  /**
   * @description add account
   */
  app.router('v1/add', async(ctx, next) => {
    let _accounts = await accounts.where({
      userid: event.userid,
      uuid: event.uuid,
    }).get();

    if (_accounts.data.length > 0) {
      ctx.body = { success: false, code: 200, message: '当前账户已经存在！', data: null }
      return
    }

    const {$url, userInfo, ...other} = event

    if (!other.userid) {
      ctx.body = { success: false, code: 200, message: '必须传入userid', data: null }
      return
    }

    if (!other.title || !other.username) {
      ctx.body = { success: false, code: 200, message: '请至少传入标题和账户名', data: null }
      return
    }
    
    other.createTime = new Date().getTime()
    
    try {
      const res = await accounts.add({ data: other });
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  // update accounts
  app.router('v1/update/info', async (ctx) => {
    const {$url, userInfo, ...other} = event;
    try {
      await accounts.doc(other._id).update({
        data: {
          ...other
        }
      })

      ctx.body = { success: true, code: 200, message: '更新成功', data: null}
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  // account must have userid field
  app.router('v1/sync', async (ctx, next) => {
    const { keys, account } = event;
    try {
      for (let i = 0; i < keys.length; i++) {
        const uuid = keys[i]
        const curAccount = account[uuid]

        const _account = await accounts.where({ uuid }).get()

        if (_account.data.length > 0) {
          await accounts.doc(_account.data[0]._id).update({ data: curAccount })
        }
        if (_account.data.length == 0) {
          curAccount.createTime = new Date().getTime()
          await accounts.add({ data: curAccount });
        }
      }

      ctx.body = { success: true, code: 200, message: '同步成功', data: null }
      
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  // delete
  app.router('v1/delete', async (ctx) => {
    try {
      await accounts.where({ uuid: event.uuid }).remove()
      ctx.body = { success: true, code: 200, message: '删除成功', data: event._id }
    } catch (e) {
      console.error(e)
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })
  
  /**
   * search the user's all list
   */
  app.router('v1/list', async (ctx) => {
    try {
      const res = await accounts.where({userid: event.userid}).get()
      ctx.body = {
        success: true,
        code: 200,
        message: '请求成功',
        data: res.data
      }
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  return app.serve();
}