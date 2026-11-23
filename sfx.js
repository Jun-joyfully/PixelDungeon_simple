// ===== 효과음 (ZzFX: vendor/zzfx, MIT License - Frank Force) =====
// 소리 파일 없이 코드로 8비트 효과음을 만든다. 사용: sfx('hit'), sfx('coin', 150) ← 150ms 뒤 재생
// 각 배열은 zzfx 인자 순서: [볼륨, 랜덤, 주파수, 어택, 서스테인, 릴리즈, 파형, 파형곡선, 슬라이드, 델타슬라이드,
//                          피치점프, 점프시간, 반복시간, 노이즈, 변조, 비트크러시, 딜레이, 서스테인볼륨, 디케이, 트레몰로, 필터]
// 소리를 바꾸고 싶으면 https://killedbyapixel.github.io/ZzFX/ 에서 만들어 배열을 붙여넣으면 된다.
const SFX = {
  hit:       [.9, .05, 90, , .01, .06, 4, , , , , , , 9, 50, .2, , .3, .01],       // 기본 공격
  crit:      [1.1, .05, 140, , .02, .12, 4, 1.4, , , , , , 9, 70, .3, , .5, .02],    // 치명타
  skill:     [.7, .05, 320, .02, .1, .22, 1, 1.6, 7, , 180, .06, , , , , , .8, .04], // 스킬 시전
  enemyHit:  [.9, .05, 60, , .02, .1, 4, , , , , , , 9, 35, .3, , .3, .02],          // 몬스터 반격
  breath:    [1, .1, 55, .05, .25, .45, 4, 2, -2, , , , , 1, , .4, .08, .6, .1],     // 보스 브레스
  heal:      [.6, 0, 520, .02, .12, .2, 0, 1.5, , , 260, .07, .07, , , , , .7, .04], // 물약
  coin:      [.7, 0, 1675, , .06, .24, 1, 1.82, , , 837, .06],                     // 승리 · 골드
  bossDown:  [1.2, .05, 333, .01, 0, .9, 4, 1.9, , , , , , .5, , .6],               // 보스 처치
  death:     [.8, .05, 300, .02, .2, .6, 2, 1, -3, , , , , , , , .1, .6, .1],       // 패배
  tap:       [.5, .03, 1800, 0, .005, .12, 1, 2, , , , , , , 120, , , .4, .01],     // 망치질
  success:   [.7, 0, 400, .02, .18, .3, 0, 1.5, , , 400, .1, .1, , , , , .8, .05],  // 강화 성공
  fail:      [.7, .05, 200, .02, .1, .3, 2, 1, -4, , , , , , , , , .6, .05],       // 강화 실패
  fanfare:   [1, 0, 523, .02, .4, .5, 0, 1.5, , , 262, .12, .12, , , , , .8, .1],   // 승급 · 각성
  chest:     [.6, 0, 800, .01, .05, .2, 1, 1.5, , , 600, .05, , , , , , .7],       // 상자 열기
  chestRare: [.8, 0, 1200, .02, .2, .4, 0, 1.8, , , 800, .06, .06, , , , , .7, .05, .2], // 영웅 이상
  click:     [.25, 0, 900, , .005, .02, 1, , , , , , , , , , , .5],                 // 버튼
};

const SFX_KEY = 'PD_SFX_V1';
const SFX_LEVELS = [1, .5, 0]; // 🔊 → 🔉 → 🔇
const sfxState = { vol: 1, last: {} };
try { const v = JSON.parse(localStorage.getItem(SFX_KEY) || '{}').vol; if (SFX_LEVELS.includes(v)) sfxState.vol = v; } catch (e) { }

function sfx(name, delayMs = 0) {
  if (delayMs > 0) return void setTimeout(() => sfx(name), delayMs);
  const p = SFX[name];
  if (!p || !sfxState.vol || typeof zzfx !== 'function') return;
  // 같은 소리가 한꺼번에 겹치지 않게 (연속 단조 등)
  const now = performance.now();
  if (now - (sfxState.last[name] || 0) < 45) return;
  sfxState.last[name] = now;
  try {
    if (zzfxX.state !== 'running') return; // 첫 클릭 전에는 브라우저가 소리를 막음
    const a = p.slice(); a[0] = (a[0] ?? 1) * sfxState.vol;
    zzfx(...a);
  } catch (e) { }
}

// 브라우저 자동재생 정책: 첫 사용자 입력 때 오디오 켜기
function sfxUnlock() { try { if (typeof zzfxX !== 'undefined' && zzfxX.state !== 'running') zzfxX.resume(); } catch (e) { } }
['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, sfxUnlock, { capture: true, passive: true }));

// 버튼 클릭음 (전투 기술 버튼은 각자 효과음이 있으므로 제외)
document.addEventListener('click', (e) => { const b = e.target.closest?.('.btn'); if (b && !b.disabled) sfx('click'); }, true);

// 상단 바 음량 버튼
function sfxIcon() { return sfxState.vol >= 1 ? '🔊' : sfxState.vol > 0 ? '🔉' : '🔇'; }
function sfxCycle() {
  sfxState.vol = SFX_LEVELS[(SFX_LEVELS.indexOf(sfxState.vol) + 1) % SFX_LEVELS.length];
  try { localStorage.setItem(SFX_KEY, JSON.stringify({ vol: sfxState.vol })); } catch (e) { }
  const b = document.getElementById('sfx-btn'); if (b) { b.textContent = sfxIcon(); b.title = `효과음 ${Math.round(sfxState.vol * 100)}%`; }
  sfx('click');
}
function sfxMountButton() {
  const chips = document.querySelector('#top-bar .chips'); if (!chips || document.getElementById('sfx-btn')) return;
  const b = document.createElement('button');
  b.id = 'sfx-btn'; b.className = 'chip'; b.type = 'button'; b.style.cursor = 'pointer'; b.style.color = 'var(--text)';
  b.textContent = sfxIcon(); b.title = `효과음 ${Math.round(sfxState.vol * 100)}%`;
  b.addEventListener('click', sfxCycle);
  chips.appendChild(b);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', sfxMountButton) : sfxMountButton();
