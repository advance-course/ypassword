import Taro, { Component } from '@tarojs/taro'
import { CoverView, CoverImage } from '@tarojs/components'
import './index.scss'

class customTabBar extends Component {

  state = {
    selected: 0,
    color: '#666',
    selectedColor: '#ed6c00',
    list: [
      {
        text: '',
        pagePath: '/pages/index/index',
        iconPath: '/assets/navigations/home_default@2x.png',
        selectedIconPath: '/assets/navigations/home_active@2x.png'
      },
      {
        text: '',
        pagePath: '/pages/Category/index',
        iconPath: '/assets/navigations/message_default@2x.png',
        selectedIconPath: '/assets/navigations/message_active@2x.png'
      },
      {
        text: '',
        pagePath: '/pages/Profile/index',
        iconPath: '/assets/navigations/profile_default@2x.png',
        selectedIconPath: '/assets/navigations/profile_active@2x.png'
      },
    ]
  }

  switchTab = (item) => {
    const url = item.pagePath
    Taro.switchTab({
      url
    })
  }

  // jumpIntellect = () => {
  //   Taro.navigateTo({ url: '/pages/intellect/intellect' })
  // }

  componentDidMount() {
    // this.setState({
    //   selected: this.props.index
    // })
  }

  // 自定义 tabBar的页面
  render() {
    console.log(this.state.selected)
    return (
      <CoverView className='tab-bar'>
        <CoverView className='tab-bar-wrap'>
          {
            this.state.list.map((item, index) => {
              return <CoverView className='tab-bar-wrap-item'
                onClick={this.switchTab.bind(this, item)}
                data-path={item.pagePath}
                key={item.text}
              >
                <CoverImage
                  className='tab-bar-wrap-item-icon'
                  src={this.state.selected === index ? item.selectedIconPath : item.iconPath} />
                <CoverView className='tab-bar-wrap-item-btn'
                  style={{ color: this.state.selected === index ? this.state.selectedColor : this.state.color }}
                >{item.text}
                </CoverView>
              </CoverView>
            })
          }
        </CoverView>
        {/* <CoverImage className='intellect-icon' src={Intellect} onClick={this.jumpIntellect} /> */}
      </CoverView>
    )
  }
}
export default customTabBar
