// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init({
  env: "release-d541f1"
});

const db = cloud.database()

const userDb = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({ event })
  
  // 注册
  app.router('register', async(ctx, next) => {
    const { OPENID } = cloud.getWXContext()

    const {
      nickName,
      avatarUrl,
      city,
      country,
      gender,
      language,
      province,
    } = event

    let user = await userDb.where({
      _openid: OPENID,
    }).get()

    if(!user.data.length) {

      // 新建用户
      const userId = await userDb.add({
        data: {
          _openid: OPENID,
          nickName,
          avatarUrl,
          city,
          country,
          gender,
          language,
          province,
        }
      })

      ctx.body = userId

    }
  })

  // 登陆
  app.router('login', async(ctx, next) => {
    const { OPENID } = cloud.getWXContext()

    const info = await userDb.where({
      _openid: OPENID,
    }).field({_openid: false}).get()

    ctx.body = info.data.length ? info.data[0] : null
  })

  // 查询用户信息
  app.router('info', async(ctx, next) => {
    ctx.body = await userDb.where({
      _id: event.userId,
    }).get();
  })

  return app.serve();
}