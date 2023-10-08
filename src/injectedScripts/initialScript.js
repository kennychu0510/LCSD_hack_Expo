import { SCRIPT_FUNCTIONS } from "./common";

export const INITIAL_SCRIPT = /* js */`(function() {
  ${SCRIPT_FUNCTIONS}
  const sliderButton = document.querySelector('[type="submit"]');
  sliderButton.scrollIntoView({ block: 'center'});

})();`;