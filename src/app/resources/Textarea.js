import { UI, diacritic, supportedLanguages } from '../config';
import { createElement } from '../utils/createElement';

const EMPTY_STRING = '';
export default class Textarea {
  constructor(langIndex, element) {
    this.index = langIndex;
    this.element = element;
  }

  updateLanguage(lang) {
    this.index = lang;
    this.element.value = EMPTY_STRING;
    this.element.placeholder = UI.placeholder[this.index];
  }

  update(input) {
    this.element.focus();

    const start = this.element.selectionStart;
    const end = this.element.selectionEnd;

    if (input) {
      this.element.value = `${this.element.value.substring(
        0,
        start
      )}${input}${this.element.value.substring(
        end,
        this.element.value.length
      )}`;
      this.handleDiacritic();

      this.element.selectionStart = start + input.length;
      this.element.selectionEnd = start + input.length;
    } else this.element.value = EMPTY_STRING;
  }

  backspace() {
    this.element.focus();

    const start = this.element.selectionStart;
    const end = this.element.selectionEnd;

    const value =
      this.element.value.substring(0, start - 1) +
      this.element.value.substring(end, this.element.value.length);

    this.element.value = value;
    this.element.selectionStart = start - 1;
    this.element.selectionEnd = start - 1;
  }

  handleArrowNavigation(arrow) {
    const arrowCode = arrow.getAttribute('code');

    switch (arrowCode) {
      case 'ArrowUp':
        break;
      case 'ArrowDown':
        break;
      case 'ArrowLeft':
        if (this.element.selectionEnd > 0) this.element.selectionEnd -= 1;
        break;
      case 'ArrowRight':
        this.element.selectionStart += 1;
        break;
      default:
        break;
    }
  }

  handleDiacritic() {
    let value = this.element.value;
    const charFromEnd = (index) => value.charCodeAt(value.length - index);
    const vowels = [97, 101, 105, 111, 117];

    if (
      charFromEnd(2) >= 768 &&
      charFromEnd(2) <= 879 &&
      vowels.includes(charFromEnd(1))
    ) {
      const arr = value.split('');
      [arr[arr.length - 2], arr[arr.length - 1]] = [
        arr[arr.length - 1],
        arr[arr.length - 2],
      ];
      this.element.value = arr.join('');
    }
  }

  saveAsFile() {
    if (this.element.value === EMPTY_STRING) return;
    const blob = new Blob([this.element.value], { type: 'text/plain' });

    const downloadLink = document.createElement('a');
    downloadLink.download = 'virtual-keyboard.txt';
    if (window.webkitURL != null) {
      downloadLink.href = window.webkitURL.createObjectURL(blob);
    } else {
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.onclick = document.body.removeChild(event.target);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }
}
