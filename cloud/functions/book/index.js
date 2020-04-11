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
  
  const book = db.collection('book');
  const app = new TcbRouter({ event });
  
  /**
   * @description 新增书籍
   * @desc 相关字段
   */
  app.router('v1/add', async(ctx, next) => {
    const {name} = event

    if (!name) {
      ctx.body = { success: false, code: 200, message: '书籍名称不能为空', data: null }
      return
    }

    const info = { ...event, createTime: Date.now(), recommend: 0 };
    delete info.$url;
    try {
      const res = await book.add({ data: info });
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
    const {_id, $url, ...other} = event;
    try {
      await book.doc(_id).update({
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
    const {current = 1, pageSize = 10, keyword = '', gzhaoId} = event;
    const start = pageSize * (current - 1);
    
    try {
      const ins = book.aggregate()
      const res = await ins
      .limit(pageSize).skip(start)
      .lookup({
        from: 'book_recommend',
        let: {
          id: '$_id'
        },
        pipeline: $.pipeline().match(_.expr($.and([
          $.eq(['$book_id', '$$id']),
          $.eq(['$open_id', OPENID])
        ]))).done(),
        as: 'recommend_list'
      })
      .addFields({
        isRecommend: $.gt([$.size('$recommend_list'), 0])
      })
      .project({
        recommend_list: 0
      })
      .end()

      const countRes = await ins.count('total').end();
      const total = countRes.list[0].total

      let lastPage = false;
      if (current * pageSize >= total) {
        lastPage = true;
      }

      const result = { pageSize, current, lastPage, total, list: res.list };
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

  /**
   * 查询书籍详细信息
   * @param {id} 书籍id
   */
  app.router('v1/info', async (ctx) => {
    const { _id } = event;
    try {
      const res = await book.doc(_id).get()

      ctx.body = { success: true, code: 200, message: '更新成功', data: res.data }
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  app.router('v1/sbscribe/list', async (ctx) => {
    const {userid} = event;
    try {
      const res = await book.where({userid}).get();
      ctx.body = { success: true, code: 200, message: '操作成功', data: res.data }
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  return app.serve();
}