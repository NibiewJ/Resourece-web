import React, { Component } from 'react'
import PageHead from '@/common/pageHead/index';
export default class index extends Component {
  state = { navData: this.props.location.state };
  render() {
    return (
      <div>
          <PageHead navData={{ title: '推荐', subTitle: '推荐其他资源网站' }} />
      </div>
    )
  }
}
