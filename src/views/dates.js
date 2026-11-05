// Dedicated date converter route — Nepali (BS) <-> English (AD).
import { icon } from '../ui/dom.js';
import { renderDateConverter } from '../ui/dateConverter.js';

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('calendar')} Date Converter</div></div>
    <div class="hero" style="padding:18px">
      <h1 style="font-size:21px">Nepali ↔ English dates</h1>
      <p>Convert any date from 1900 AD / 1956 BS right up to today — with real Bikram Sambat month lengths.</p>
    </div>
    <div id="date-converter-host" class="mt-14"></div>
  `;
  renderDateConverter(view.querySelector('#date-converter-host'));
}
