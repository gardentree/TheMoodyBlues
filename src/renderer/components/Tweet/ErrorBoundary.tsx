import * as React from "react";

const {facade} = window;

interface Props {
  tweet: Twitter.Tweet;
}

export default class ErrorBoundary extends React.Component<{tweet: Twitter.Tweet}, {error?: {message: string}}> {
  constructor(props: Props) {
    super(props);

    this.state = {error: undefined};
  }

  static getStateFromError(error: Error) {
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
