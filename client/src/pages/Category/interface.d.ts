declare namespace category {
  interface Info {
    _id?: string,
    imgUrl?: string,
    name?: string,
    userid?: string,
    /**
     * 2: 系统默认
     * 1： 用户自己上传
     */
    type?: number
  }
}