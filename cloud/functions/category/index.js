const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

const { OPENID, ENV} = cloud.getWXContext()

cloud.init({
  env: "release-d541f1"
})

const db = cloud.database()
const _ = db.command

const categoryDb = db.collection('category')

/**
 * event: 云函数调用时，传入的参数，包括$url
 */
exports.main = async (event, context) => {

  const app = new TcbRouter({ event })
  
  /**
   * @param {type} 1 表示用户上传   2 表示默认
   */
  app.router('v1/add', async (ctx, next) => {
    const {userid, name, imgUrl, type} = event

    if (!name) {
      ctx.body = { success: false, code: 200, message: '请输入分类名称', data: null }
      return
    }

    if (!imgUrl) {
      ctx.body = { success: false, code: 200, message: '请上传分类Logo', data: null }
      return
    }

    if (!type) {
      ctx.body = { success: false, code: 200, message: '参数type字段未上传', data: null }
      return
    }

    try {
      const s1 = await categoryDb.where(_.or([
        {name, userid},
        {name, type: 2}
      ])).get();
      
      if (s1.data.length > 0) {
        ctx.body = { success: false, code: 200, message: '已经存在同名分类', data: null }
        return 
      }

      const res = await categoryDb.add({
        data: { userid, name, imgUrl, type, createTime: new Date().getTime() }
      })
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('v1/del', async (ctx, next) => {
    try {
      const res = await categoryDb.where({
        _id: event._id
      }).remove()
      ctx.body = { success: true, code: 200, message: '删除成功', data: event._id }
    } catch(e) {
      console.error(e)
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('v1/update', async (ctx, next) => {
    const {_id, userInfo, $url, ...other} = event
    try {
      // 如果需要替换更新一条记录，可以在记录上使用 set 方法，替换更新意味着用传入的对象替换指定的记录
      // 使用 update 方法可以局部更新一个记录或一个集合中的记录，局部更新意味着只有指定的字段会得到更新，其他字段不受影响。
      const res = await categoryDb.doc(_id).update({
        data: other
      })
      ctx.body = { success: true, code: 200, message: '更新成功', data: null }
    } catch(e) {
      console.error(e)
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('v1/list', async (ctx, next) => {
    const {userid, type} = event
    try {
      let res
      if (type == 2) {
        res = await categoryDb.where({type}).get()
      }

      if (type == 1) {
        res = await categoryDb.where(_.or([
          {userid},
          {type: 2}
        ])).get()
      }
      
      ctx.body = { success: true, code: 200, message: '请求成功', data: res.data }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  /**
   * @desc 通过id查询当前分类项的详情
   */
  app.router('v1/query', async (ctx, next) => {
    try {
      const res = await categoryDb.where({
        _id: event._id
      }).get()
      if (res.data[0].length == 0) {
        ctx.body = { success: false, code: 200, message: '未查询到对应的数据', data: null }
        return
      }
      ctx.body = { success: true, code: 200, message: '', data: res.data[0] }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  return app.serve()

}