declare namespace book {
  interface Item {
    _id?: string,
    author?: string,
    author_avatar?: string,
    cover?: string,
    name?: string,
    introduction?: string,
    recommend?: number,
    isRecommend?: boolean, // 当前用户是否推荐这本书是否推荐
    reward_code?: string,
    star?: number,
    view?: number,
    comment?: number,
    userid?: string,
    subscription?: subscribe.Info,
    articles?: article.Item[]
  }

  interface Comment {
    _id?: string,
    content?: string,
    avatarUrl?: string,
    gender?: number,
    nickName?: string,
    /** 
   * 1： 超级管理员
   * 2： 管理员
   * 3： 普通用户
   * 4： 付费用户
   * 5: 签约作者
   */
    type?: 1 | 2 | 3 | 4 | 5,
    /**
      1. 如果是书：book_id
      2. 如果是文章：article_id
      3. 如果是评论：comment_id
    **/
    key?: string,
    like?: number,
    openid?: string,
    comment?: number,
    createTime?: number,
    isLiked?: boolean // 当前用户是否点赞过当条评论/书籍
  }
}
