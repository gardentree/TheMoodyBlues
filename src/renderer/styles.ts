import {library, config} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import createCache from "@emotion/cache";

(() => {
  require("photon/dist/css/photon.css");
  require("@fortawesome/fontawesome-svg-core/styles.css");
  require("./style.scss");

  config.autoAddCss = false;
  library.add(fab, faSpinner);
})();

export function createStyleCache() {
  return createCache({
    key: "the-moody-blues",
    nonce: "WWvF+wAkbaqRKw52+C4eZ12x4WDR9TEVVScZgKVrwAI=",
  });
}
