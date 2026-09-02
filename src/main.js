import './style.css';

const tg = window.Telegram?.WebApp;
const state = {
  balance: Number(localStorage.getItem('gram-balance')) || 47.32,
  energy: Number(localStorage.getItem('gram-energy')) || 68,
  mined: Number(localStorage.getItem('gram-mined')) || 12.84,
  jumps: Number(localStorage.getItem('gram-jumps')) || 8,
  combo: 1,
  claimed: localStorage.getItem('gram-claimed') === 'true',
};

const el = (id) => document.getElementById(id);
const format = (value) => value.toFixed(2);
const toast = (message) => {
  const node = el('toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove('show'), 2100);
};

function persist() {
  localStorage.setItem('gram-balance', state.balance);
  localStorage.setItem('gram-energy', state.energy);
  localStorage.setItem('gram-mined', state.mined);
  localStorage.setItem('gram-jumps', state.jumps);
  localStorage.setItem('gram-claimed', state.claimed);
}

function render() {
  el('headerBalance').textContent = format(state.balance);
  el('energyText').textContent = `${Math.round(state.energy)} / 100`;
  el('energyMeter').style.width = `${state.energy}%`;
  el('combo').textContent = `×${state.combo}`;
  el('minedToday').innerHTML = `${format(state.mined)} <small>G</small>`;
  el('missionTitle').textContent = state.jumps >= 50 ? 'Jump protocol complete' : `Run ${Math.max(0, 50 - state.jumps)} more jumps`;
  el('missionProgress').textContent = `${Math.min(state.jumps, 50)} / 50 complete`;
  const claim = el('claimButton');
  claim.disabled = state.claimed;
  claim.innerHTML = state.claimed ? 'CLAIMED<br /><strong>SEE YOU TOMORROW</strong>' : 'CLAIM<br /><strong>+3.20 G</strong>';
}

function tapCore(event) {
  if (state.energy < 2) return toast('Core recharging...');
  const critical = Math.random() > 0.88;
  const gain = (critical ? 0.48 : 0.12) * state.combo;
  state.balance += gain;
  state.mined += gain;
  state.energy -= 2.25;
  state.jumps += 1;
  state.combo = Math.min(8, state.combo + 1);
  persist(); render();
  tg?.HapticFeedback?.impactOccurred(critical ? 'heavy' : 'light');
  const copy = el('tapCopy');
  copy.textContent = `${critical ? 'CRIT! ' : '+'}${gain.toFixed(2)} G`;
  copy.style.left = `${Math.max(16, Math.min(72, (event.offsetX / event.currentTarget.offsetWidth) * 100))}%`;
  copy.classList.remove('rise'); void copy.offsetWidth; copy.classList.add('rise');
  event.currentTarget.classList.remove('boost'); void event.currentTarget.offsetWidth; event.currentTarget.classList.add('boost');
}

function initTelegram() {
  if (!tg) return;
  tg.ready(); tg.expand();
  tg.setHeaderColor('#0a1029'); tg.setBackgroundColor('#0a1029');
  const user = tg.initDataUnsafe?.user;
  if (user) {
    const name = user.first_name || 'STAR PILOT';
    el('playerName').textContent = name.toUpperCase();
    el('avatar').textContent = name[0].toUpperCase();
  }
  tg.BackButton.onClick(() => toast('You are already at base.'));
}

el('reactor').addEventListener('click', tapCore);
el('claimButton').addEventListener('click', () => {
  if (state.claimed) return;
  state.claimed = true; state.balance += 3.2; state.mined += 3.2;
  persist(); render(); tg?.HapticFeedback?.notificationOccurred('success'); toast('3.20 GRAM transferred to your vault');
});
el('balanceButton').addEventListener('click', () => toast(`${format(state.balance)} GRAM secured in your vault`));
el('profileButton').addEventListener('click', () => toast('Pilot profile synced with Telegram'));
document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.dock .active').classList.remove('active'); button.classList.add('active');
  const tab = button.dataset.tab;
  if (tab === 'RIGS') toast('Rig bay online — upgrades arrive at level 10.');
  if (tab === 'QUESTS') toast(`${Math.max(0, 50 - state.jumps)} jumps until your next reward.`);
  if (tab === 'VAULT') toast(`${format(state.balance)} GRAM available.`);
  if (tab === 'RUN') toast('Flight controls restored. Tap the core!');
}));

setInterval(() => {
  if (state.energy < 100) { state.energy = Math.min(100, state.energy + 1); persist(); render(); }
  else state.combo = 1;
}, 1000);

initTelegram(); render();
