declare namespace com {
  /** 
   * 1: 账号密码
   * 2: 银行卡 | 信用卡
   */
  type AccountType = 1 | 2;

  interface Account {
    uuid?: string,
    title?: string,
    username?: string,
    password?: string,
    /**
     * 账户归属：表示该账户是属于某个网站，或者App等，数据中，根据归属来分类
     * */
    who?: string,
    /**
     * 目标的图标
     */
    icon?: string,

    /**
     * type
     */
    type?: AccountType,
    
    /** 其他一些可能存在的字段 */
    phone?: string,
    email?: string,
    url?: string,

    [key: string]: any
  }
}