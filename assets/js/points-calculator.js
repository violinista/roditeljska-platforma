/**
 * Kalkulator bodova za upis u srednju školu (form.points-calculator, rendered
 * by _includes/partials/points-calculator.njk from _data/pointsCalculator.json).
 *
 * Each input carries its own rule: data-min / data-max (the allowed range),
 * data-step (the value must be a multiple of it) and data-factor (the
 * coefficient that turns it into admission points). Values may be typed with
 * a decimal comma or a point. Points are kept as whole hundredths, so the
 * parts shown always add up exactly to the total.
 *
 * Empty fields count as 0 (a note says so); an invalid value blanks the sums
 * until it is fixed. The numbers update while typing; screen readers get one
 * polite summary when a field is left (the change event), not every keystroke.
 */
(function () {
  "use strict";

  const form = document.querySelector('.points-calculator');
  if (!form) return;

  const NONE = '—';
  const format = new Intl.NumberFormat('sr-Latn-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const show = (hundredths) => format.format(hundredths / 100);
  const maxPoints = Number(form.dataset.maxPoints);
  // A dash for "nothing to show yet" is muted (.is-none), so it can't pass for a value.
  const put = (output, text) => {
    output.value = text;
    output.classList.toggle('is-none', text === NONE);
  };

  const fields = Array.from(form.querySelectorAll('input[data-factor]'), input => ({
    input,
    group: input.closest('[data-group]').dataset.group,
    output: form.querySelector('output[for="' + input.id + '"]'),
    error: document.getElementById(input.id + '-error'),
    min: Number(input.dataset.min),
    max: Number(input.dataset.max),
    step: Number(input.dataset.step),
    factor: Number(input.dataset.factor),
  }));
  const groups = Array.from(form.querySelectorAll('[data-group]'), el => el.dataset.group);
  const total = form.querySelector('[data-total]');
  const status = form.querySelector('[data-status]');
  const noteEmpty = form.querySelector('[data-note="empty"]');
  const noteInvalid = form.querySelector('[data-note="invalid"]');

  // "4,57", "4.57", "17", "17,5"; a trailing separator ("4,") is fine while typing.
  const NUMBER = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/;

  function read(f) {
    const raw = f.input.value.trim();
    if (raw === '') return { state: 'empty', points: 0 };
    const n = NUMBER.test(raw) ? Number(raw.replace(',', '.')) : NaN;
    const steps = n / f.step;
    const ok = n >= f.min && n <= f.max && Math.abs(steps - Math.round(steps)) < 1e-6;
    return ok
      ? { state: 'valid', points: Math.round(n * f.factor * 100) }
      : { state: 'invalid', points: 0 };
  }

  function update() {
    const results = fields.map(f => {
      const r = read(f);
      const invalid = r.state === 'invalid';
      put(f.output, r.state === 'valid' ? show(r.points) : NONE);
      f.error.hidden = !invalid;
      if (invalid) {
        f.input.setAttribute('aria-invalid', 'true');
        f.input.setAttribute('aria-describedby', f.error.id);
      } else {
        f.input.removeAttribute('aria-invalid');
        f.input.removeAttribute('aria-describedby');
      }
      return { group: f.group, state: r.state, points: r.points };
    });

    const anyInvalid = results.some(r => r.state === 'invalid');
    const filled = results.filter(r => r.state !== 'empty').length;
    let sum = 0;
    groups.forEach(group => {
      const own = results.filter(r => r.group === group);
      const points = own.reduce((s, r) => s + r.points, 0);
      const blank = own.some(r => r.state === 'invalid') || own.every(r => r.state === 'empty');
      put(form.querySelector('[data-sum="' + group + '"]'), blank ? NONE : show(points));
      // Segment width = share of all possible points (points are hundredths,
      // so points / maxPoints is already a percentage); a part at 0 draws nothing.
      const bar = form.querySelector('[data-bar="' + group + '"]');
      bar.hidden = anyInvalid || points === 0;
      bar.style.flexBasis = points / maxPoints + '%';
      sum += points;
    });

    put(total, anyInvalid || filled === 0 ? NONE : show(sum));
    noteEmpty.hidden = anyInvalid || filled === 0 || filled === fields.length;
    noteInvalid.hidden = !anyInvalid;
    return { anyInvalid, filled, sum };
  }

  form.addEventListener('input', update);
  form.addEventListener('change', e => {
    const field = fields.find(f => f.input === e.target);
    if (!field) return;
    const { anyInvalid, filled, sum } = update();
    if (!field.error.hidden) status.textContent = field.error.textContent.trim();
    else if (anyInvalid) status.textContent = noteInvalid.textContent.trim();
    else if (filled) status.textContent = 'Ukupno bodova: ' + show(sum) + ' od ' + maxPoints + '.';
    else status.textContent = '';
  });
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => {
    // The fields are cleared only after the reset event, so recalculate on the next tick.
    setTimeout(() => {
      update();
      status.textContent = 'Uneti podaci su obrisani.';
    });
  });

  form.hidden = false;
  update();
})();
