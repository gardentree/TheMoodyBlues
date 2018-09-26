import * as React from "react";
import * as ReactDOM from "react-dom";
import {connect} from 'react-redux'
import * as screen from "../modules/screen";
import Timeline from "./Timeline";
import Search from "./Search";
import SubContent from "./SubContent";
import {update as updateSubContent} from "../modules/subcontents";

class Principal extends React.Component<any,any> {
  render() {
    const contents = [Timeline,Search]
    const current = this.props.current

    const {subcontents} = this.props;
    const container = document.querySelector(`.window-content[data-name='${current}']`)!;

    return (
      <div id='principal' className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>
        <div className="tab-group">
          {
            contents.map((content) => {
              return (
                <div key={content.name} className={`tab-item${current == content.name ? ' active':''}`} onClick={() => {this.props.dispatch(screen.select(content.name))}}>{content.name}</div>
              )
            })
          }
        </div>
        {
          contents.map((content) => {
            return (
              <div key={content.name} className="window-content" style={{display: current == content.name ? 'block':'none'}} data-name={content.name}>
                {
                  React.createElement(
                     content as React.ClassType<any,any,any>,{
                      twitter: this.props.twitter,
                    }
                  )
                }
              </div>
            )
          })
        }
        {
          subcontents.tweets && ReactDOM.createPortal(
            <SubContent tweets={subcontents.tweets} onClose={() => this.props.dispatch(updateSubContent(null))} />
            ,container
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    current: state.screen.name||Timeline.name,
    subcontents: state.subcontents,
  }
}
export default connect(mapStateToProps)(Principal);
