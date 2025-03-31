import { addClasses, removeClasses, toggleClass } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { isExpandedView } from './settingsHelper';

export const bubbleSVG = `
  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
    fill="white" stroke="none">
    <path d="M2505 4673 c-45 -10 -91 -34 -340 -179 l-260 -151 -3 -422 c-1 -239
    2 -421 7 -421 4 0 145 79 312 177 167 97 311 178 319 180 16 4 623 -344 1263
    -723 180 -107 334 -197 342 -200 13 -5 15 42 15 378 l0 384 -26 52 c-14 29
    -43 66 -63 83 -20 17 -344 210 -721 430 -732 426 -748 434 -845 412z"/>
    <path d="M1369 4011 c-304 -175 -364 -221 -392 -305 -15 -45 -17 -134 -17
    -937 0 -862 1 -890 20 -941 12 -33 36 -69 62 -94 35 -34 413 -262 523 -316 30
    -15 30 -15 380 193 192 114 351 212 352 216 2 5 -141 92 -317 193 l-320 185 0
    977 c0 537 -4 979 -8 982 -5 3 -132 -66 -283 -153z"/>
    <path d="M3440 2617 l0 -414 -407 -238 c-225 -131 -426 -250 -448 -264 -22
    -14 -202 -123 -400 -241 l-360 -215 -3 -374 c-2 -322 0 -377 13 -397 35 -53
    40 -51 437 184 205 121 625 367 933 547 944 552 882 512 924 605 20 43 21 65
    21 426 l0 380 -342 205 c-188 112 -348 205 -355 207 -11 3 -13 -72 -13 -411z"/>
  </g>
`;
export const body = document.getElementsByTagName('body')[0];
export const widgetHolder = document.createElement('div');

export const bubbleHolder = document.createElement('div');
export const chatBubble = document.createElement('button');
export const closeBubble = document.createElement('button');
export const notificationBubble = document.createElement('span');

export const setBubbleText = bubbleText => {
  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.getElementById('woot-widget--expanded__text');
    textNode.innerText = bubbleText;
  }
};

export const createBubbleIcon = ({ className, contentSvg, target }) => {
  let bubbleClassName = `${className} woot-elements--${window.$chatwoot.position}`;
  const bubbleIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  bubbleIcon.setAttributeNS(null, 'id', 'woot-widget-bubble-icon');
  bubbleIcon.setAttributeNS(null, 'width', '512.000000pt');
  bubbleIcon.setAttributeNS(null, 'height', '512.000000pt');
  bubbleIcon.setAttributeNS(null, 'viewBox', '0 0 512.000000 512.000000');
  bubbleIcon.setAttributeNS(null, 'fill', 'none');
  bubbleIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  bubbleIcon.innerHTML = contentSvg
  target.appendChild(bubbleIcon);

  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.createElement('div');
    textNode.id = 'woot-widget--expanded__text';
    textNode.innerText = '';
    target.appendChild(textNode);
    bubbleClassName += ' woot-widget--expanded';
  }

  target.className = bubbleClassName;
  target.title = 'Open chat window';
  return target;
};

export const createBubbleHolder = hideMessageBubble => {
  if (hideMessageBubble) {
    addClasses(bubbleHolder, 'woot-hidden');
  }
  addClasses(bubbleHolder, 'woot--bubble-holder');
  bubbleHolder.id = 'cw-bubble-holder';
  body.appendChild(bubbleHolder);
};

export const onBubbleClick = (props = {}) => {
  const { toggleValue } = props;
  const { isOpen } = window.$chatwoot;
  if (isOpen !== toggleValue) {
    const newIsOpen = toggleValue === undefined ? !isOpen : toggleValue;
    window.$chatwoot.isOpen = newIsOpen;

    toggleClass(chatBubble, 'woot--hide');
    toggleClass(closeBubble, 'woot--hide');
    toggleClass(widgetHolder, 'woot--hide');
    IFrameHelper.events.onBubbleToggle(newIsOpen);

    if (!newIsOpen) {
      chatBubble.focus();
    }
  }
};

export const onClickChatBubble = () => {
  bubbleHolder.addEventListener('click', onBubbleClick);
};

export const addUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  addClasses(holderEl, 'has-unread-view');
};

export const removeUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  removeClasses(holderEl, 'has-unread-view');
};
