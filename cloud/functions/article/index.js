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
  const article = db.collection('article');
  const app = new TcbRouter({ event });
  
  /**
   * @description 新增文章
   * @desc 相关字段 author gzhaoId gzhaoLogo gzhaoName original tag thumb time title url
   */
  app.router('v1/add', async(ctx, next) => {
    const {title, url} = event

    if (!title || !url) {
      ctx.body = { success: false, code: 200, message: '文章标题或链接不能为空', data: null }
      return
    }
    if (event.userInfo) {
      delete event.userInfo
    }
    const info = { ...event, createTime: Date.now() };
    delete info.$url;
    try {
      const res = await article.add({ data: info });
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  /**
   * @param {_id} 文章id
   * @desc 更新配置
   */
  app.router('v1/update', async (ctx) => {
    const {_id, $url, userInfo, ...other} = event;
    try {
      await article.doc(_id).update({
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
    const {current = 1, pageSize = 10, keyword = '', userid, subscription_id} = event;
    try {
      let x = article;
      if (userid) {
        x = await article.where({
          subscription: {
            userid
          }
        })
      }
      if (subscription_id) {
        x = await article.where({
          subscription: {
            _id: subscription_id
          }
        })
      }
      if (keyword) {
        x = await article.where(db.command.or([
          {
            title: db.RegExp({
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
      const list = await x.orderBy('createTime', 'desc').skip(start).limit(pageSize).get();

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

  app.router('v1/book/list', async (ctx) => {
    const {book_id} = event;
    try {
      const res = await article.where({
        book: {
          _id: book_id
        }
      }).get();
      ctx.body = { success: true, code: 200, message: '操作成功', data: res.data }
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  return app.serve();
}