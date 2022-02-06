import * as React from "react";

const {facade} = window;

interface Properties {
  tweet: Twitter.Tweet;
}

export default class ErrorBoundary extends React.Component<{tweet: Twitter.Tweet}, {error?: {message: string}}> {
  constructor(props: Properties) {
    super(props);

    this.state = {error: undefined};
  }

  static getDerivedStateFromError(error: Error) {
    return {error: error};
  }
  componentDidCatch(error: Error, information: React.ErrorInfo) {
    facade.logger.error(error.stack);
    facade.logger.error(this.props.tweet);
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
