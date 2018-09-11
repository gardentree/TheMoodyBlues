import {ipcRenderer} from 'electron';
import * as React from "react";
import {Timeline} from "./Timeline";
import {Search} from "./Search";
import {OperationTower} from "./OperationTower";

interface Property {
  twitter: any
}

export class Principal extends React.Component<Property,{current: string,style: {fontSize: string}}> {
  private contents: any = {}

  constructor(property: Property) {
    super(property)

    this.state = {current: Timeline.name,style: {fontSize: 'inherit'}}

    this.changeFontSize = this.changeFontSize.bind(this);
    ipcRenderer.on('zoom in',(event: string,arugments: any) => {
      this.changeFontSize(1)
    });
    ipcRenderer.on('zoom out',(event: string,arugments: any) => {
      this.changeFontSize(-1)
    });
    ipcRenderer.on('zoom reset',(event: string,arugments: any) => {
      this.changeFontSize(null)
    });
    ipcRenderer.on('reload',(event: string,arugments: any) => {
      this.contents[this.state.current].reload();
    });
    ipcRenderer.on('force reload',(event: string,arugments: any) => {
      this.contents[this.state.current].forceReload();
    });
  }

  changeFontSize(offset: number|null) {
    if (offset) {
      const content = document.getElementById('principal')
      const size = window.getComputedStyle(content!).fontSize;if (size === null) throw "font size is null";
      const matcher = size.match(/(\d+)px/);if (matcher === null) throw size;

      this.setState({style: {fontSize: `${Number(matcher[1]) + offset}px`}})
    }
    else {
      this.setState({style: {fontSize: 'inherit'}})
    }
  }

  componentDidMount() {
    OperationTower.listen('search',(query: string) => {
      this.setState({current: Search.name})

      this.contents[Search.name].search(query);
    })
  }

  render() {
    const components = [Timeline,Search]

    return (
      <div id='principal' className="window" style={this.state.style}>
        <header className="toolbar toolbar-header">
          <h1 className="title">The Moody Blues</h1>
        </header>

        <div className="tab-group">
          {
            components.map((component) => {
              return (
                <div key={component.name} className={`tab-item${this.state.current == component.name ? ' active':''}`} onClick={() => {this.setState({current: component.name})}}>{component.name}</div>
              )
            })
          }
        </div>
        {
          components.map((component) => {
            return (
              <div key={component.name} className="window-content" style={{display: this.state.current == component.name ? 'block':'none'}} data-name={component.name}>
                {
                  React.createElement(
                     component as React.ClassType<any,any,any>,{
                      twitter: this.props.twitter,
                      ref: (reference) => {this.contents[component.name] = reference},
                    }
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}
