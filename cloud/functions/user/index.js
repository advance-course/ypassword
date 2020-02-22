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
  app.router('v1/register', async(ctx, next) => {
    const { OPENID } = cloud.getWXContext()
    const { nickName, avatarUrl, city, country, gender, language, province, } = event
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

      ctx.body = {
        success: true,
        code: 200,
        message: '请求成功',
        data: userId
      }
    }
  })

  // 登陆
  app.router('v1/login', async(ctx, next) => {
    const { OPENID } = cloud.getWXContext()

    const info = await userDb.where({
      _openid: OPENID,
    }).field({_openid: false}).get()

    if (info.data.length) {
      ctx.body = {
        success: true,
        code: 200,
        message: '请求成功',
        data: info.data[0],
      }
    } else {
      ctx.body = {
        success: false,
        code: 1002,
        message: '无此用户，请注册',
      }
    }
  })

  // 查询用户信息
  app.router('v1/info', async(ctx, next) => {
    const res = await userDb.where({
      _id: event.userId,
    }).get();

    ctx.body = {
      success: true,
      code: 200,
      message: '请求成功',
      data: res
    }
  })

  return app.serve();
}