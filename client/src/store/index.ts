import accounts from "pages/Accounts/model"
import global from './global'
import article from 'pages/toB/articles/model'
import book from 'pages/Home/model'
import subscription from 'pages/Profile/subpages/Subscribtion/model'
import feeds from 'pages/Feeds/model'
import category from 'pages/Category/model'

import toBUserinfo from 'pages/toB/users/model'

export default [
  accounts,
  global,
  book,
  toBUserinfo,
  article,
  subscription,
  feeds,
  category
];
