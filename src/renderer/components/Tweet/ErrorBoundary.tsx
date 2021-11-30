import * as React from "react";

const {TheMoodyBlues} = window;

export default class ErrorBoundary extends React.Component<{tweet: Twitter.Tweet}, {error?: {message: string}}> {
  constructor(props: any) {
    super(props);

    this.state = {error: undefined};
  }

  static getDerivedStateFromError(error: Error) {
    return {error: error};
  }
  componentDidCatch(error: Error, information: React.ErrorInfo) {
    TheMoodyBlues.logger.error(error.stack);
    TheMoodyBlues.logger.error(this.props.tweet);
  }
  render() {
    const {error} = this.state;
    const {children, tweet} = this.props;

    if (error) {
      return (
        <div>
          {tweet.id_str}: {error.message}
        </div>
      );
    }

    return children;
  }
}
