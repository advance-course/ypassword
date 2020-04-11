declare namespace article {
  interface Item {
    _id?: string,
    original?: boolean,
    tag?: string,
    thumb?: string,
    time?: string,
    title?: string,
    url?: string,
    book?: book.Item,
    subscription?: subscribe.Info
  }
}
