import { SCRIPT_FUNCTIONS } from './common';

export const INITIAL_SCRIPT = /* js */ `(function() {
  ${SCRIPT_FUNCTIONS}
  const sliderButton = document.querySelector('[type="submit"]');
  sliderButton.scrollIntoView({ block: 'center'});

})();`;

export const CHECK_CURRENT_URL = /* js */ `(function() {
  ${SCRIPT_FUNCTIONS}
  const pathName = window.location.pathname;
  if (pathName.includes('/dispatchFlow.do')) {
    _consoleLog('in enquiry page', 'can enquire');
    return;
  }

})();`;
