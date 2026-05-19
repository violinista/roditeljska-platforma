---
layout: layouts/page-article.njk
title: Savetovanje i prijava na programe
categories: [Podrška, Programi]
---
## Naši programi i usluge

{{ savetovanjeForm.intro }} Trenutno možete da se prijavite za:

<ul class="programs-list">
{%- for p in savetovanjeForm.programs %}
  <li>{{ p.label }}</li>
{%- endfor %}
</ul>

Ako niste sigurni koji je program pravi za vas, slobodno nas kontaktirajte — pomoći ćemo vam da pronađete najbolju opciju.

## Prijava

Popunite formular ispod i naš tim će vas kontaktirati u najkraćem mogućem roku.

<form id="savetovanje-form" class="php-email-form scheduling-form" action="mailto:{{ site.footer.email }}" method="post" enctype="text/plain">
  <div class="form-group">
    <label for="sv-name">Ime i prezime *</label>
    <input type="text" id="sv-name" name="name" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="sv-email">Email *</label>
    <input type="email" id="sv-email" name="email" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="sv-program">Program za koji se prijavljujete *</label>
    <select id="sv-program" name="program" class="form-select" required>
      <option value="" disabled selected>Izaberite program…</option>
{%- for p in savetovanjeForm.programs %}
      <option value="{{ p.label }}">{{ p.label }}</option>
{%- endfor %}
      <option value="Ostalo">Ostalo</option>
    </select>
  </div>
  <div class="form-group">
    <label for="sv-message">Poruka</label>
    <textarea id="sv-message" name="message" class="form-control" rows="5"></textarea>
  </div>
  <div class="form-submit">
    <button type="submit">Pošalji prijavu</button>
  </div>
</form>

<script>
  (function () {
    var form = document.getElementById('savetovanje-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var subject = 'Prijava na program: ' + form.program.value;
      var body =
        'Ime i prezime: ' + form.name.value + '\n' +
        'Email: ' + form.email.value + '\n' +
        'Program: ' + form.program.value + '\n\n' +
        'Poruka:\n' + (form.message.value || '(bez poruke)');
      window.location.href = 'mailto:{{ site.footer.email }}'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  })();
</script>
