declare namespace com {
  /** 
   * 1: 账号密码
   * 2: 银行卡
   * 3：信用卡
   */
  type AccountType = 1 | 2;

  interface Account {
    title?: string,
    username?: string,
    password?: string,
    /**
     * 账户归属：表示该账户是属于某个网站，或者App等
     * */
    who?: string,

    /**
     * type
     */
    type?: AccountType,
    /**
     * 目标的图标
     */
    icon?: string,

    /** 其他一些可能存在的字段 */
    phone?: string,
    email?: string,
    url?: string,

    [key: string]: any
  }
}