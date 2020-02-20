# ypasswrod
个人密码管理工具

# 项目升级方式
将taro-js/cli安装在当前项目中，作为当前项目的私有cli，避免被全局cli影响。

```bash
$ yarn add -D @tarojs/cli@2.0.3
```

然后在我们的项目目录里运行以下命令来升级依赖：

```bash
# 如果你使用 NPM
$ node ./node_modules/.bin/taro update project 2.0.3

# 如果你使用 Yarn
$ yarn taro update project 2.0.3
```