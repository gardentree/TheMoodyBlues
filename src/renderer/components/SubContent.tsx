import * as React from "react";
import {TweetList} from "./TweetList";

export default class SubContent extends React.Component<any,any> {
  constructor(property: any) {
    super(property);
  }

  render() {
    const {tweets,onClose} = this.props
    const display = tweets ? 'block':'none';

    return (
      <div className='subcontent' style={{display: display}}>
        <div className='header'>
          <button className="btn btn-default">
            <span className="icon icon-cancel" onClick={onClose}></span>
          </button>
        </div>
        <TweetList tweets={tweets||[]} />
      </div>
    )
  }
}
