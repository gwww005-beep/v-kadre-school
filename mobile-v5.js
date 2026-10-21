(() => {
  const grid = document.querySelector('.package-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.package-card')];
  const mobile = matchMedia('(max-width: 620px)');
  const tabs = document.createElement('div');
  tabs.className = 'plan-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Выберите программу');
  grid.before(tabs);
  let selected = 0;
  cards.forEach((card, i) => {
    card.id = 'plan-panel-' + i;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'plan-tab-' + i;
    button.textContent = card.querySelector('h3').textContent;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', card.id);
    tabs.append(button);
    button.addEventListener('click', () => { selected = i; sync(); });
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % cards.length;
      if (event.key === 'ArrowLeft') next = (i + cards.length - 1) % cards.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = cards.length - 1;
      if (next === undefined) return;
      event.preventDefault(); selected = next; sync(); tabs.children[next].focus();
    });
    const details = document.createElement('details');
    details.className = 'plan-details';
    const summary = document.createElement('summary');
    summary.textContent = 'Что входит в программу';
    details.append(summary, card.querySelector('.package-features'), card.querySelector('.package-scope'));
    card.append(details);
  });
  const disclosures = [];
  document.querySelectorAll('.parents-grid article, .journey-grid li').forEach(item => {
    const heading = item.querySelector('h3,h4');
    if (!heading) return;
    const details = document.createElement('details');
    details.className = 'compact-disclosure';
    const summary = document.createElement('summary');
    summary.append(heading);
    details.append(summary);
    [...item.children].filter(x => !x.classList.contains('step-number')).forEach(x => details.append(x));
    item.append(details); disclosures.push(details);
  });
  function sync() {
    tabs.hidden = !mobile.matches;
    cards.forEach((card, i) => {
      const active = i === selected;
      card.hidden = mobile.matches && !active;
      if (mobile.matches) {
        card.setAttribute('role', 'tabpanel');
        card.setAttribute('aria-labelledby', 'plan-tab-' + i);
      } else { card.removeAttribute('role'); card.removeAttribute('aria-labelledby'); }
      tabs.children[i].setAttribute('aria-selected', String(active));
      tabs.children[i].tabIndex = active ? 0 : -1;
      card.querySelector('.plan-details').open = !mobile.matches;
    });
    disclosures.forEach(d => { d.open = !mobile.matches; });
  }
  mobile.addEventListener('change', sync);
  sync();
})();
