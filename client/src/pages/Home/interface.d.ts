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
}
