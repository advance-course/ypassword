// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init({
  env: "release-d541f1"
});

const db = cloud.database()

const userConfigDb = db.collection('userConfig')

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({ event });

  // 添加配置
  app.router('add', async(ctx, next) => {
    ctx.body = await userConfigDb.add({
      data: {
        userId: event.userId,
        isLock: false,
        isFingerprintLock: false,
        isNinecaseLock: false,
        isLocking: false,
      }
    })
  })

  // 获取配置信息
  app.router('getInfo', async(ctx, next) => {
    const res = await userConfigDb.where({
      userId: event.userId,
    }).get()

    ctx.body = res.data.length ? res.data[0] : null
  })

  // 设置解锁总开关
  app.router('updateIsLock', async(ctx, next) => {

    const res = await userConfigDb.where({
      userId: event.userId,
    }).update({
      data: {
        isLock: event.isLock
      }
    })

    ctx.body = res
  })

  // 设置指纹解锁
  app.router('updateIsFingerprintLock', async(ctx, next) => {

    const res = await userConfigDb.where({
      userId: event.userId,
    }).update({
      data: {
        isFingerprintLock: event.isFingerprintLock
      }
    })

    ctx.body = res
  })

  // 设置手势解锁
  app.router('updateIsNinecaseLock', async(ctx, next) => {

    const res = await userConfigDb.where({
      userId: event.userId,
    }).update({
      data: {
        isNinecaseLock: event.isNinecaseLock
      }
    })

    ctx.body = res
  })

  return app.serve();

}