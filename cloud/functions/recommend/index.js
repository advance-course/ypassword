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
  
  const recommend = db.collection('book_recommend');
  const view = db.collection('book_view')
  const book = db.collection('book');
  const app = new TcbRouter({ event });
  
  /**
   * @description 新增收藏
   * @param book_id 书籍id
   * @desc 相关字段
   */
  app.router('v1/add', async(ctx, next) => {
    if (event.userInfo) {
      delete event.userInfo
    }
    const info = { ...event, open_id: OPENID, createTime: Date.now() };
    delete info.$url;
    try {
      const res = await recommend.add({ data: info });
      await book.doc(event.book_id).update({
        data: {
          recommend: _.inc(1)
        }
      })
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  // add view count record
  app.router('v1/view/add', async (ctx) => {
    const {book_id} = event

    try {
      const res = await view.where({book_id: book_id, open_id: OPENID}).get()
      if (res.data.length > 0) {
        ctx.body = { success: false, code: 200, message: '数据已存在', data: null }
        return
      }
      const info = { book_id: book_id, open_id: OPENID, createTime: Date.now() }
      const resp = await view.add({data: info})
      await book.doc(event.book_id).update({
        data: {
          view: _.inc(1)
        }
      })

      ctx.body = { success: true, code: 200, message: '新增成功', data: resp._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  /**
   * @param {book_id} 书籍id
   * @desc 删除收藏记录
   */
  app.router('v1/delete', async (ctx) => {
    const {book_id} = event;
    try {
      await recommend.where({
        book_id,
        open_id: OPENID
      }).remove()

      ctx.body = { success: true, code: 200, message: '删除成功', data: null}
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

  return app.serve();
}