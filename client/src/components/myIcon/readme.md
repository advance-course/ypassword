### 参考
1. taro-ui 的 AtIcon 组件（链接：https://github.com/NervJS/taro-ui/blob/dev/src/components/icon/index.js）
2. taro-ui 的 style 文件（链接：https://github.com/NervJS/taro-ui/blob/b512d32a122fcfb9f97e9cb06e46f852e02c545b/docs/components/iconlist/style.scss）

### 解决思路
1. 自己书写 MyIcon 组件
2. 现在思考如果引入字体样式呢？
>参考2得知，使用 @font-face 属性声明字体即可，注意src 中 src 是 base64 格式，所以文件中的文件链接，删掉即可（我没有这样做，而是[打开链接](https://transfonter.org/)，打开 base64 开关，导入 ttf 文件，下载转换文件，就可以得到 @font-face 声明部分，替换掉 iconfont.css 文件中的 @font-face部分），更改 css 为 scss，在 MyIcon.tsx，引入即可
3. 接下来就是测试了（我实现的比较简单，嘻嘻）

4. 而 DIN 字体是一样的处理过程
