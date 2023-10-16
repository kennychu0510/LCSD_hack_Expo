import { SCRIPT_FUNCTIONS } from './common';

export const MapScript = /* js */ `(function() {
  ${SCRIPT_FUNCTIONS}

  const canvas = document.querySelector('canvas')

  const mapContainer = document.querySelector('.map__container')
  const enquireButtonStyles = 'background: #456990;border: 1px solid #456990;border-radius: 6px;box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;box-sizing: border-box;color: #FFFFFF;cursor: pointer;display: inline-block;font-family: nunito,roboto,proxima-nova,&quot;proxima nova&quot;,sans-serif;font-size: 14px;font-weight: 800;line-height: 14px;;outline: 0;padding: 12px;text-align: center;text-rendering: geometricprecision;text-transform: none;user-select: none;-webkit-user-select: none;touch-action: manipulation;vertical-align: middle;'

  let isPopoverOpen = false
  let facilityName = ''
  
  function listenForPopup() {
        const observer = new MutationObserver(mutations => {
          const popover = document.querySelector('.popover-body')
          if (popover && !isPopoverOpen) {
              isPopoverOpen = true;
              popover.querySelector('.map-popup__contact').remove()
              popover.querySelector('.map-popup__actions').remove()
              const buttonContainer = document.createElement('div')
              buttonContainer.style = "display: flex;justify-content: center;"
              
              const enquireButton = document.createElement('button')
              enquireButton.textContent = 'Enquire'
              enquireButton.style = enquireButtonStyles
              buttonContainer.appendChild(enquireButton)
              facilityName = popover.querySelector('.map-popup__title').textContent
              
              enquireButton.addEventListener('click', () => {
                  _consoleLog(facilityName, 'enquireVenue')
              })
              popover.appendChild(buttonContainer)
              
          }
          if (!popover) {
              isPopoverOpen = false
          }
        })
        
        observer.observe(mapContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeOldValue: true,
          characterData: true,
          characterDataOldValue: true
        })
    }
  
 
  try {
    const stickyTool = document.querySelector('.sticky-tool')
    const map = document.querySelector('.map-filter__container');
    const elementsToRemove = document.querySelectorAll('.rte-template, .inner-top__inner, .page-head, section.inner-top, footer')
    elementsToRemove.forEach(element => element.remove());
    stickyTool.remove();
    listenForPopup()

  } catch (error) {
    _consoleLog('error occurred')
  }

})();`;
