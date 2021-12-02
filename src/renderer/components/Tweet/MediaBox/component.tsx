import * as React from "react";
import Modal from "react-modal";
import {Carousel} from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";

if (process.env.NODE_ENV !== "test") Modal.setAppElement("#app");

interface Property {
  medias: Twitter.Media[];
}

export default class MediaBox extends React.Component<Property, {modalIsOpen: boolean; selectedItem: number}> {
  constructor(property: Property) {
    super(property);

    this.state = {modalIsOpen: false, selectedItem: 0};

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(selectedItem: number) {
    this.setState({modalIsOpen: true, selectedItem: selectedItem});
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    const {medias} = this.props;
    if (medias.length <= 0) return <div />;

    const thumbnails = medias.map((media, index: number) => {
      return (
        <img
          key={media.id_str}
          className="photo"
          src={media.media_url_https}
          onClick={() => {
            this.openModal(index);
          }}
        />
      );
    });

    const elements = medias.map((media, index: number) => {
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
        <div className="media">{thumbnails}</div>
        <div onClick={(event) => event.stopPropagation()}>
          <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
            <div className="modal-container">
              <Carousel selectedItem={this.state.selectedItem} showArrows={true} showThumbs={false} showIndicators={false}>
                {elements}
              </Carousel>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
