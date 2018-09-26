import * as React from "react";
import {connect} from 'react-redux'
import * as subcontents from '../modules/subcontents'

class User extends React.Component<any,{}> {
  render() {
    const {screenName,key} = this.props;
    return (
      <span className='mention' onClick={this.props.onClick} key={key}>
        @{screenName}
      </span>
    )
  }
}

const mapDispatchToProps = {
  onClick: (event: React.SyntheticEvent) => {
    const target = event.target as HTMLElement;
    return subcontents.displayUserTimeline(target.textContent!)
  }
}

export default connect(null,mapDispatchToProps)(User);
