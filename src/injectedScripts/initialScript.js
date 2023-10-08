import { PATH_NAMES } from "../utilities/constants";
import { SCRIPT_FUNCTIONS } from "./common";

export const INITIAL_SCRIPT = /* js */`(function() {
  ${SCRIPT_FUNCTIONS}
  const sliderButton = document.querySelector('[type="submit"]');
  sliderButton.scrollIntoView({ block: 'center'});

  if (path.includes(${PATH_NAMES.SELECT_PAGE})) {
    // _consoleLog('current page is ' + path, 'can enquire')
    _consoleLog(path, 'can enquire');
  }

  _consoleLog('hello')

})();`;