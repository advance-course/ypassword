const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

const { OPENID, ENV} = cloud.getWXContext()

cloud.init({
  env: "release-d541f1"
})

const db = cloud.database()

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
          userID: event.userid,
          name: event.name,
          imgUrl: event.imgUrl
        }
      })
      ctx.body = { success: true, code: 200, message: '添加成功', data: res._id }
    } catch (e) {
      ctx.body = { success: false, code: e.errCode, message: e.errMsg }
    }
  })

  return app.serve()

}