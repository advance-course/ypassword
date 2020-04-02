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
  
  app.router('add', async (ctx, next) => {
    try {
      const res = await categoryDb.add({
        data: {
          userID: event.userID,
          name: event.name,
          imgUrl: event.imgUrl
        }
      })
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('del', async (ctx, next) => {
    try {
      const res = await categoryDb.where({
        _id: event._id
      }).remove()
      ctx.body = { success: true, code: 200, message: '删除成功', data: res._id }
    } catch(e) {
      console.error(e)
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('update', async (ctx, next) => {
    const {_id, name, imgUrl} = event
    try {
      // 如果需要替换更新一条记录，可以在记录上使用 set 方法，替换更新意味着用传入的对象替换指定的记录
      // 使用 update 方法可以局部更新一个记录或一个集合中的记录，局部更新意味着只有指定的字段会得到更新，其他字段不受影响。
      const res = await categoryDb.doc(_id).update({
        data: {
          name: name,
          imgUrl: imgUrl
        }
      })
      ctx.body = { success: true, code: 200, message: '更新成功', data: res }
    } catch(e) {
      console.error(e)
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('list', async (ctx, next) => {
    try {
      const res = await categoryDb.get({
        data: {
          userID: event.userID
        }
      })
      ctx.body = { success: true, code: 200, message: '', data: res }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  app.router('query', async (ctx, next) => {
    try {
      const res = await categoryDb.where({
        _id: event._id
      }).get({
        data: {
          userID: event.userID
        }
      })
      ctx.body = { success: true, code: 200, message: '', data: res }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  return app.serve()

}