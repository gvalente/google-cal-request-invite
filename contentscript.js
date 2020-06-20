const GCAL_EVENT_MODAL_CONTAINER_ID = "yDmH0d";
const GCAL_EVENT_MENU_JSCONTROLLER = "IJBtxc";
const GCAL_EVENT_MENU_SPAN_JSNAME = "lbYRR";
let isMenuItemAdded = false;

// Go do the mail stuff
function requestInvite() {
  console.log('request invite');

  const to = encodeURIComponent('to@to.com');
  const subject = encodeURIComponent('Subject line');
  const body = encodeURIComponent('Hey, can I get an invite to this calendar event?');

  const mailTo = `mailto:${to}?subject=${subject}&body=${body}`;
  window.open(mailTo, '_blank');
}

// Clone, customize, and add new menu span item with custom click handler
function addRequestMenuItem() {
  console.log('addRequestMenuItem');

  const listNode = document.querySelector(`[jscontroller='${GCAL_EVENT_MENU_JSCONTROLLER}']`).firstChild.firstChild; // TODO: Cleaner way to select instead of children?
  let copySpanNode = listNode.firstElementChild.nextSibling.cloneNode(true);

  copySpanNode.querySelector(`[jsname='${GCAL_EVENT_MENU_SPAN_JSNAME}']`).firstChild.innerHTML = "Request invite";
  copySpanNode.setAttribute('aria-label', 'Request invite');
  copySpanNode.onclick = () => requestInvite();

  // Remove jsname from children to prevent event hooks
  for (let child of copySpanNode.children) {
    child.removeAttribute('jsname');
  }

  listNode.insertBefore(copySpanNode, listNode.firstElementChild.nextSibling);
  isMenuItemAdded = true;
}

// Observe event modal node to know when context menu is created
function observeEventModal() {
  const eventMenuNode = document.getElementById(GCAL_EVENT_MODAL_CONTAINER_ID);
  const config = { childList: true };
  const callback = (mutationList, observer) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if menu is open and add request item
        if (!isMenuItemAdded && eventMenuNode.childElementCount == 1) {
          addRequestMenuItem();
        } else {
          isMenuItemAdded = false;
        }
      }
    });
  };

  const observer = new MutationObserver(callback);
  observer.observe(eventMenuNode, config);
}

// Start observing for the modal on load
window.onload = () => {
  observeEventModal();
};