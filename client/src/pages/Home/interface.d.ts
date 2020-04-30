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

    /**
      1. 如果是书：book_id
      2. 如果是文章：article_id
      3. 如果是评论：comment_id
    **/
    key?: string,
    like?: number,
    openid?: string,
    comment?: number,
  }
}
