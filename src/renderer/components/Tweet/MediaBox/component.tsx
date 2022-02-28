import React, {useState} from "react";
import Modal from "react-modal";
import {Carousel} from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";

if (process.env.NODE_ENV !== "test") Modal.setAppElement("#app");

interface Props {
  media: Twitter.Media[];
}

const MediaBox = (props: Props) => {
  const {media} = props;
  if (media.length <= 0) return <div />;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const openModal = (selectedItem: number) => {
    setModalIsOpen(true);
    setSelectedItem(selectedItem);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const onAfterOpen: Modal.OnAfterOpenCallback = (target) => {
    target!.contentEl.querySelector<HTMLElement>(".carousel-root")!.focus();
  };

  const thumbnails = media.map((media, index: number) => {
    return (
      <img
        key={media.id_str}
        className="photo"
        src={media.media_url_https}
        onClick={() => {
          openModal(index);
        }}
      />
    );
  });

  const elements = media.map((media, index: number) => {
    switch (media.type) {
      case "video":
        const variants = media.video_info?.variants.slice().sort((a: Twitter.MediaVideoVariant, b: Twitter.MediaVideoVariant) => (b.bitrate || 0) - (a.bitrate || 0));
        let url;
        if (variants) {
          url = variants[0].url;
        } else {
          //Version 2 does not yet support video.
          url = media.media_url_https;
        }
        return (
          <div key={media.id_str}>
            <video src={url} poster={media.media_url_https} preload="metadata" playsInline controls controlsList="nodownload" />
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
        <Modal isOpen={modalIsOpen} onAfterOpen={onAfterOpen} onRequestClose={closeModal} parentSelector={() => document.querySelector("#modals")!}>
          <div className="modal-container">
            <Carousel selectedItem={selectedItem} showArrows={true} useKeyboardArrows={true} showThumbs={false} showIndicators={false}>
              {elements}
            </Carousel>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default MediaBox;
