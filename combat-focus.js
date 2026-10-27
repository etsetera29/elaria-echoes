/* Combat-only presentation, layered after all battle and story extensions.
   It does not change battle results, movement coordinates or save state. */
(function () {
  'use strict';

  const MODE_CLASS = 'elaria-combat-mode';
  const previousRender = render;
  let lastMode = null;

  function combatLog() {
    const battleView = document.getElementById('battleUI');
    if (!battleView) return;

    let panel = document.getElementById('elariaCombatLog');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'elariaCombatLog';
      panel.className = 'elaria-combat-log';
      panel.setAttribute('aria-label', 'Recent battle actions');

      const heading = document.createElement('h4');
      heading.textContent = '✦ Battle Journal';
      panel.appendChild(heading);
      const entries = document.createElement('div');
      entries.className = 'elaria-combat-log-entries';
      panel.appendChild(entries);
      battleView.appendChild(panel);
    }

    const entries = panel.querySelector('.elaria-combat-log-entries');
    if (!entries) return;
    entries.replaceChildren();

    const recent = Array.isArray(state?.log) ? state.log.slice(0, 5) : [];
    if (!recent.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Your next action will appear here.';
      entries.appendChild(empty);
    } else {
      for (const line of recent) {
        const p = document.createElement('p');
        p.textContent = String(line);
        entries.appendChild(p);
      }
    }
  }

  function syncCombatView() {
    const inBattle = Boolean(state && battle);
    const body = document.body;
    if (!body) return;

    body.classList.toggle(MODE_CLASS, inBattle);
    const map = document.getElementById('world');
    const battleView = document.getElementById('battleUI');

    if (map) map.setAttribute('aria-hidden', inBattle ? 'true' : 'false');
    if (battleView) {
      battleView.setAttribute('aria-hidden', inBattle ? 'false' : 'true');
      if (inBattle) {
        battleView.setAttribute('tabindex', '-1');
        combatLog();
      }
    }

    if (lastMode !== inBattle) {
      lastMode = inBattle;
      // Move the viewport to the beginning of the newly displayed screen.
      // No game coordinates are changed; victory resumes on the same tile.
      if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
      if (inBattle && battleView && !document.getElementById('modal')?.classList.contains('hidden')) {
        // Respect a story/result dialog if it is already open.
        return;
      }
      if (inBattle && battleView && typeof battleView.focus === 'function') {
        battleView.focus({ preventScroll: true });
      }
    }
  }

  render = function () {
    if (!state) return;
    previousRender();
    syncCombatView();
  };

  // Narrative and damage messages can be added outside a render call.
  const previousNote = note;
  note = function (...args) {
    const result = previousNote(...args);
    if (state && battle && document.body.classList.contains(MODE_CLASS)) {
      combatLog();
    }
    return result;
  };

  if (state) syncCombatView();
})();
