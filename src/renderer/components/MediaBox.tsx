import * as React from "react";
import * as Modal from "react-modal";
import {Carousel} from "react-responsive-carousel";
import * as twitter from "../others/twitter";

import "react-responsive-carousel/lib/styles/carousel.min.css";

if (process.env.NODE_ENV !== "test") Modal.setAppElement("#app");
// ariaHideApp={ !process.env.NODE_ENV === 'test' }

export class MediaBox extends React.Component<{medias: twitter.Media[]}, {medias: twitter.Media[]; modalIsOpen: boolean}> {
  constructor(property: {medias: twitter.Media[]}) {
    super(property);

    this.state = {medias: property.medias, modalIsOpen: false};

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    if (this.state.medias.length <= 0) return <div />;

    const medias = this.state.medias.map((media) => {
      return <img key={media.id_str} className="photo" src={media.media_url_https} />;
    });

    const elements = this.state.medias.map((media) => {
      switch (media.type) {
        case "video":
          const variants = media.video_info.variants.slice().sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
          return (
            <div key={media.id_str}>
              <video src={variants[0].url} poster={media.media_url_https} preload="metadata" playsInline controls controlsList="nodownload" />
            </div>
          );
        case "photo":
        default:
          return (
            <div key={media.id_str}>
              <img src={media.media_url_https} />
            </div>
          );
      }
    });

    return (
      <React.Fragment>
        <div className="media" onClick={this.openModal}>
          {medias}
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
            <div className="modal-container">
              <Carousel showArrows={true} showThumbs={false}>
                {elements}
              </Carousel>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
