const cases = [
  {name:'Неоновый старт', price:49, type:'popular', color:'#52d7ff', icon:'◈', tag:'Лёгкий'},
  {name:'Кобра', price:149, type:'popular', color:'#c8ff3d', icon:'✦', tag:'Хит'},
  {name:'Аметист', price:299, type:'new', color:'#b98cff', icon:'◇', tag:'Новый'},
  {name:'Метеорит', price:599, type:'premium', color:'#ff9d4d', icon:'✧', tag:'Премиум'},
  {name:'Чёрный лёд', price:799, type:'premium', color:'#80aaff', icon:'⬡', tag:'Редкий'},
  {name:'Аркана', price:999, type:'new', color:'#ff6e9a', icon:'✹', tag:'Новый'},
  {name:'Хищник', price:1299, type:'popular', color:'#ff5e55', icon:'◈', tag:'Хит'},
  {name:'Золотой век', price:2499, type:'premium', color:'#f5cf55', icon:'★', tag:'Легенда'}
];
let activeFilter = 'all';
let balance = 1250;
const $ = (selector) => document.querySelector(selector);
const grid = $('#casesGrid');
function renderCases() {
  const query = ($('#caseSearch')?.value || '').trim().toLowerCase();
  const visible = cases.filter(item => (activeFilter === 'all' || item.type === activeFilter) && item.name.toLowerCase().includes(query));
  grid.innerHTML = visible.map((item, index) => `<article class="case-card" data-index="${cases.indexOf(item)}" style="--case-color:${item.color}" tabindex="0" role="button" aria-label="Открыть кейс ${item.name}"><div class="case-top"><span>${String(index + 1).padStart(2, '0')} / 08</span><span class="tag">${item.tag}</span></div><div class="case-art">${item.icon}</div><div class="case-info"><h3>${item.name}</h3><div class="case-meta"><span>открытие кейса</span><b>${item.price.toLocaleString('ru-RU')} ₽</b></div></div></article>`).join('');
  $('#emptyState').classList.toggle('hidden', visible.length > 0);
  grid.querySelectorAll('.case-card').forEach(card => { card.addEventListener('click', () => openCase(cases[Number(card.dataset.index)])); card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') openCase(cases[Number(card.dataset.index)]); }); });
}
function openCase(item) {
  $('#modalContent').innerHTML = `<p class="eyebrow">ОТКРЫТИЕ КЕЙСА</p><h2 id="modalTitle">${item.name}</h2><div class="result" style="color:${item.color}">${item.icon}</div><p>Стоимость открытия — <strong>${item.price.toLocaleString('ru-RU')} ₽</strong>. Твой шанс получить редкий предмет зависит от содержимого кейса.</p><button class="primary-button" id="confirmOpen">Открыть за ${item.price.toLocaleString('ru-RU')} ₽ <span>→</span></button>`;
  $('#modal').classList.remove('hidden');
  $('#confirmOpen').addEventListener('click', () => { if (balance < item.price) { showNotice('Недостаточно средств', 'Попробуй пополнить баланс или выбери кейс дешевле.'); return; } balance -= item.price; $('#balance').textContent = balance.toLocaleString('ru-RU'); showNotice('Кейс открыт', `Тебе выпал предмет из кейса «${item.name}». Проверь инвентарь в Steam.`); });
}
function showNotice(title, text) { $('#modalContent').innerHTML = `<div class="result">✓</div><h2 id="modalTitle">${title}</h2><p>${text}</p><button class="primary-button" id="noticeClose">Продолжить <span>→</span></button>`; $('#noticeClose').addEventListener('click', closeModal); }
function closeModal() { $('#modal').classList.add('hidden'); }
$('.filters').addEventListener('click', event => { const button = event.target.closest('.filter'); if (!button) return; activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button)); renderCases(); });
$('#modalClose').addEventListener('click', closeModal); $('#modal').addEventListener('click', event => { if (event.target === $('#modal')) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
$('#searchToggle').addEventListener('click', () => { $('#searchPanel').classList.toggle('hidden'); if (!$('#searchPanel').classList.contains('hidden')) $('#caseSearch').focus(); });
$('#caseSearch').addEventListener('input', renderCases);
$('#loginButton').addEventListener('click', () => { $('#modalContent').innerHTML = `<p class="eyebrow">АВТОРИЗАЦИЯ</p><h2 id="modalTitle">Войти через Steam</h2><p>В демо-режиме вход работает без редиректа: создай профиль, чтобы сохранять предметы и историю открытий.</p><button class="primary-button" id="steamContinue">Продолжить как игрок <span>↗</span></button>`; $('#modal').classList.remove('hidden'); $('#steamContinue').addEventListener('click', () => showNotice('Добро пожаловать', 'Профиль игрока создан. Теперь все выигрыши будут доступны в инвентаре.')); });
$('#balanceButton').addEventListener('click', () => showNotice('Пополнение баланса', 'Платёжная форма подключается к защищённому провайдеру. В демо-режиме баланс уже доступен для тестирования.'));
$('#upgradeButton').addEventListener('click', () => showNotice('Апгрейд готов', 'Выбери предмет в своём инвентаре, чтобы начать настоящий апгрейд.'));
$('#tickerTrack').innerHTML = [...cases, ...cases].map(item => `<span><b>${item.name}</b> · выпал предмет на ${Math.round(item.price * (1.4 + Math.random() * 5)).toLocaleString('ru-RU')} ₽</span>`).join('');
renderCases();
