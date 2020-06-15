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
  
  const comment = db.collection('comment')
  const commentLike = db.collection('comment_like')
  const app = new TcbRouter({ event });
  
  /**
   * @description add new comment
   * @param {key}
   * @param {content}
   */
  app.router('v1/add', async(ctx, next) => {
    const {key, content} = event

    if (!key || !content) {
      ctx.body = { success: false, code: 200, message: '请完善参数', data: null }
      return
    }
    
    const info = { key, content, createTime: Date.now(), openid: OPENID, like: 0 };

    try {
      const res = await comment.add({ data: info });
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  /**
   * @desc update content
   * @param {_id}
   * @param {content}
   * @param {}
   */
  app.router('v1/update', async (ctx) => {
    const {_id, content} = event;
    try {
      const res = comment.doc(_id).get()
      console.log(res)
      await comment.doc(_id).update({
        data: { content }
      })

      ctx.body = { success: true, code: 200, message: '更新成功', data: null}
    } catch (e) {
      ctx.body = { success: false, code: errCode, message: errMsg }
    }
  })

  app.router('v1/remove', async (ctx) => {
    const {_id} = event

    try {
      const c = comment.doc(_id)
      const r1 = await c.get()
      
      if (!r1.data) {
        ctx.body = { success: false, code: 200, message: '你要删除的评论不存在' }
        return
      }

      if (r1.data.openid != OPENID) {
        ctx.body = { success: false, code: 200, message: '你不能删除别人的评论' }
        return
      }
      await c.remove()
      ctx.body = { success: true, code: 200, message: '删除成功' }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.message }
    }
  })

  app.router('v1/like', async (ctx) => {
    const { _id } = event
    
    try {
      const r1 = await commentLike.where({ commentid: _id, openid: OPENID }).get()

      if (r1.data.length > 0) {
        ctx.body = { success: false, code: 200, message: '您已赞过啦' }
        return
      }

      const r2 = await commentLike.add({data: {
        commentid: _id,
        openid: OPENID,
        createTime: Date.now()
      }})
      await comment.doc(_id).update({
        data: {
          like: _.inc(1)
        }
      })
      ctx.body = {success: true, code: 200, message: '添加成功', data: r2._id}
    } catch (e) {
      ctx.body = { success: false, code: 200, message: '添加成功' }
    }
  })
  
  /**
   * search comments
   * @param {current} 当前页，默认值1
   * @param {pageSize} 每一页大小 默认值10
   * @param {key} who book or article or comment
   * @param 
   */
  app.router('v1/list', async (ctx) => {
    const {current = 1, pageSize = 10, key } = event;
    const start = pageSize * (current - 1);
    
    try {
      const ins = comment.aggregate().match({ key }).sort({like: -1})
      const res = await ins
      .limit(pageSize).skip(start)
      .lookup({
        from: 'user',
        localField: 'openid',
        foreignField: 'openid',
        as: 'author'
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$author', 0]), '$$ROOT'])
      })
      .lookup({
        from: 'comment',
        localField: '_id',
        foreignField: 'key',
        as: 'children'
      })
      .addFields({
        comment: $.size('$children')
      })
      .project({
        author: 0,
        city: 0,
        country: 0,
        isFingerprintLock: 0,
        isLock: 0,
        isNinecaseLock: 0,
        language: 0,
        password: 0,
        privateKey: 0,
        province: 0,
        publicKey: 0,
        children: 0
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
      ctx.body = { success: false, code: e.errCode || 200, message: e.message }
    }
  })

  return app.serve();
}