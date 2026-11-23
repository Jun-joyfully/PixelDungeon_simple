const HERO_ATLAS = {"cellW":87,"cellH":93,"anims":{"idle_right":[[0,0,87,93],[87,0,87,93],[174,0,87,93]],"walk_right":[[0,93,87,93],[87,93,87,93],[174,93,87,93],[261,93,87,93]],"run_right":[[0,186,87,93],[87,186,87,93],[174,186,87,93],[261,186,87,93]],"attack_right":[[0,279,87,93],[87,279,87,93],[174,279,87,93],[261,279,87,93]],"guard_right":[[0,372,87,93],[87,372,87,93],[174,372,87,93],[261,372,87,93]],"hit_right":[[0,465,87,93],[87,465,87,93],[174,465,87,93],[261,465,87,93]],"death_right":[[0,558,87,93],[87,558,87,93],[174,558,87,93],[261,558,87,93],[348,558,87,93],[435,558,87,93]],"skill_right":[[0,651,87,93],[87,651,87,93],[174,651,87,93],[261,651,87,93],[348,651,87,93],[435,651,87,93],[522,651,87,93]]}}; // 게임은 오른쪽 방향만 사용 → 시트도 오른쪽 8줄만 남김
const HERO_ATLAS_URI = 'assets/hero_atlas.png';
// ===== 게임 데이터 테이블 =====
const SAVE_KEY = 'PIXEL_DUNGEON_VIBE_SAVE_V7';
const GRADES = ['일반', '희귀', '영웅', '전설', '신화'];
const GRADE_COLOR = { '일반': '#b2bec3', '희귀': '#00cec9', '영웅': '#a55eea', '전설': '#f5b942', '신화': '#ff5e97', '보스 전용': '#ff5e97', '없음': '#6c758d' };
const GRADE_CLASS = { '일반': 'common', '희귀': 'rare', '영웅': 'epic', '전설': 'legendary', '신화': 'mythic', '보스 전용': 'mythic' };
const GRADE_ALIAS = { Rare: '희귀', Epic: '영웅', Heroic: '영웅', Legendary: '전설', Mythic: '신화' };
function rankOf(g) {
  g = GRADE_ALIAS[g] || g;
  return { '없음': 0, '일반': 1, '희귀': 2, '영웅': 3, '전설': 4, '신화': 5, '보스 전용': 6 }[g] ?? 1;
}

const TRAIN = [
  { key: 'atk', label: '공격력 (ATK)', icon: '⚔️', base: 85, step: 65, inc: 13, unit: '' },
  { key: 'def', label: '방어력 (DEF)', icon: '🛡️', base: 85, step: 65, inc: 13, unit: '' },
  { key: 'maxHp', label: '최대 체력 (HP)', icon: '❤️', base: 85, step: 65, inc: 75, unit: '' },
  { key: 'critRate', label: '치명타 확률', icon: '🎯', base: 130, step: 95, inc: 1.5, unit: '%', max: 54 },
  { key: 'critDmg', label: '치명타 피해', icon: '💥', base: 130, step: 95, inc: 8, unit: '%' },
  { key: 'bossDmg', label: '보스 추가 피해', icon: '👑', base: 150, step: 110, inc: 5, unit: '%', max: 1000 },
  { key: 'dropRate', label: '아이템 드랍률', icon: '🍀', base: 130, step: 95, inc: 2, unit: '%', max: 50 },
];

const CHEST_LV = [
  null,
  { req: 6, r: [68.0, 28.0, 3.8, 0.2, 0.0] },
  { req: 14, r: [62.0, 31.0, 6.2, 0.7, 0.1] },
  { req: 26, r: [56.0, 33.0, 9.5, 1.3, 0.2] },
  { req: 45, r: [50.0, 34.5, 13.0, 2.1, 0.4] },
  { req: 75, r: [45.0, 35.0, 16.5, 2.9, 0.6] },
  { req: 120, r: [40.0, 35.0, 20.0, 4.0, 1.0] },
  { req: 190, r: [36.0, 34.5, 22.8, 5.3, 1.4] },
  { req: 300, r: [32.0, 34.0, 25.2, 6.9, 1.9] },
  { req: 480, r: [28.0, 33.5, 27.2, 8.8, 2.5] },
  { req: 0, r: [24.0, 33.0, 29.0, 11.0, 3.0] },
];

const EQUIP = {
  '일반': { sword: '철 단검', armor: '가죽 흉갑', sBase: 15, sStep: 5, aBase: 10, aStep: 4, cost: 70, fail: 5, sTitle: '일반 검', aTitle: '일반 가죽갑옷' },
  '희귀': { sword: '백은 기사의 롱소드', armor: '강철 사슬 갑옷', sBase: 75, sStep: 18, aBase: 50, aStep: 13, cost: 150, fail: 15, sTitle: '희귀 장검', aTitle: '희귀 사슬갑옷' },
  '영웅': { sword: '루미너스 플랑베르주', armor: '성기사의 판금 갑옷', sBase: 220, sStep: 45, aBase: 150, aStep: 32, cost: 320, fail: 25, sTitle: '영웅의 대검', aTitle: '영웅의 판금갑' },
  '전설': { sword: '드래곤 슬레이어', armor: '흑룡의 비늘 갑옷', sBase: 560, sStep: 105, aBase: 380, aStep: 75, cost: 680, fail: 35, sTitle: '전설의 성검', aTitle: '전설의 용린갑' },
  '신화': { sword: '창공의 엑스칼리버', armor: '아이기스의 성갑', sBase: 1300, sStep: 230, aBase: 880, aStep: 165, cost: 1450, fail: 45, sTitle: '신화의 광검', aTitle: '신화의 성갑' },
};
// 판매 보상: 숫자는 골드, {keys}는 열쇠
const SELL = { '일반': { gold: 30 }, '희귀': { gold: 95 }, '영웅': { gold: 260 }, '전설': { keys: 3 }, '신화': { keys: 8 } };
const SKILL_REFUND = { '일반': { gold: 50 }, '희귀': { gold: 140 }, '영웅': { gold: 340 }, '전설': { keys: 3 }, '신화': { keys: 8 } };

// 스킬 테이블: 일반/희귀/영웅 스탯 및 계수 대폭 상향 패치
const SKILLS = [
  ['화염 강타', '일반', 450, 2.40, 2, '🔥'], ['얼음 송곳', '일반', 480, 2.50, 2, '❄️'], ['질풍 베기', '일반', 380, 2.10, 1, '🌪️'],
  ['바위 투척', '일반', 520, 2.60, 2, '🪨'], ['전격 찌르기', '일반', 460, 2.45, 2, '⚡'], ['수류 강타', '일반', 500, 2.55, 2, '🌊'],
  ['번개 일격', '희귀', 1250, 3.60, 2, '⚡'], ['맹독 파동', '희귀', 1450, 3.90, 3, '🧪'], ['서리 폭풍', '희귀', 1350, 3.75, 2, '🌨️'],
  ['화염 폭발', '희귀', 1550, 4.10, 3, '💥'], ['칼날 선풍', '희귀', 1300, 3.70, 2, '⚔️'], ['영혼 흡수격', '희귀', 1400, 3.80, 2, '👻'],
  ['대지 분쇄', '영웅', 2600, 4.80, 3, '⛰️'], ['암흑 참격', '영웅', 2900, 5.10, 3, '🌑'], ['뇌신 강림', '영웅', 2500, 4.60, 2, '🌩️'],
  ['빙결 파멸창', '영웅', 3100, 5.30, 3, '🧊'], ['용염 브레스', '영웅', 3400, 5.60, 3, '🐉'], ['성광 일섬', '영웅', 2800, 4.90, 2, '✨'],
  ['성스러운 심판', '전설', 5500, 6.40, 3, '☀️'], ['메테오 스트라이크', '전설', 6800, 7.30, 3, '☄️'], ['절대영도 붕괴', '전설', 5900, 6.70, 3, '💠'],
  ['심연의 어둠폭풍', '전설', 6300, 7.00, 3, '🌀'], ['천벌의 뇌창', '전설', 5100, 6.00, 2, '🔱'],
  ['차원 절단', '신화', 16500, 14.5, 3, '🌌'], ['창세의 빛: 오메가', '신화', 19000, 16.0, 3, '🌟'], ['종말의 별똥별', '신화', 22000, 17.5, 3, '🌠'],
  ['신살의 붉은 섬광', '신화', 15500, 14.0, 2, '🩸'], ['시공 붕괴: 빅뱅', '신화', 25500, 19.0, 4, '🪐'],
].map(([name, grade, baseDmg, atkRatio, maxCooldown, icon]) => ({ name, grade, baseDmg, atkRatio, maxCooldown, icon }));

// ===== 신규 콘텐츠 데이터 테이블 =====
// 1. 펫 시스템 데이터
const PET_TYPES = [
  { id: 'slime', name: '아기 슬라임', grade: '일반', icon: '🟢', role: '말랑 힐', desc: '3턴마다 영웅 최대 HP의 12%를 즉시 회복합니다.', col: '#2ed573' },
  { id: 'bat', name: '꼬마 박쥐', grade: '일반', icon: '🦇', role: '흡혈 초음파', desc: '3턴마다 적에게 음파 피해를 입히고 일부를 흡혈합니다.', col: '#a55eea' },
  { id: 'baby_dragon', name: '꼬마 화룡', grade: '희귀', icon: '🐉', role: '작은 화염구', desc: '3턴마다 적에게 맹렬한 화염 폭발 공격을 가합니다.', col: '#ff7924' },
  { id: 'frost_wolf', name: '서리 늑대', grade: '희귀', icon: '🐺', role: '빙결 냉기', desc: '3턴마다 적에게 냉기 피해를 주고 적 방어력을 25% 깎습니다.', col: '#00cec9' },
  { id: 'thunder_beast', name: '뇌수 키린', grade: '영웅', icon: '⚡', role: '연쇄 벼락', desc: '3턴마다 강력한 번개로 적을 강타하여 감전 피해를 줍니다.', col: '#f5b942' },
  { id: 'forest_fairy', name: '숲의 요정', grade: '영웅', icon: '🧚', role: '생명의 결계', desc: '3턴마다 HP를 20% 회복하고 영웅을 가호합니다.', col: '#2ed573' },
  { id: 'phoenix', name: '불사조 피닉스', grade: '전설', icon: '🦅', role: '전설의 업화', desc: '3턴마다 성스러운 화염으로 적을 불사르고 영웅 HP를 25% 회복합니다.', col: '#ff5e97' },
  { id: 'cerberus', name: '지옥견 케르베로스', grade: '전설', icon: '🐕', role: '심연의 3연격', desc: '3턴마다 적 방어력을 50% 관통하는 3연속 암흑 참격을 가합니다.', col: '#ff4757' },
];
const PET_BY_ID = Object.fromEntries(PET_TYPES.map(p => [p.id, p]));

// 2. 코스튬 상점 데이터 (골드 소모처)
const COSTUMES = {
  skins: [
    { id: 'skin_default', name: '방랑 모험가', grade: '일반', cost: 0, desc: '기본 가죽 로브와 두건을 두른 모험가의 모습입니다.', bonus: {} },
    { id: 'skin_dark_knight', name: '칠흑의 암흑기사', grade: '희귀', cost: 50000, desc: '어둠의 심연을 걸어 나온 기사의 갑주입니다.', bonus: { atkPct: 8, critDmg: 20 } },
    { id: 'skin_paladin', name: '백은의 성기사', grade: '영웅', cost: 150000, desc: '성스러운 성광의 가호를 받는 고귀한 판금 갑주입니다.', bonus: { defPct: 12, hpPct: 15 } },
    { id: 'skin_blood_slayer', name: '혈월의 광전사', grade: '전설', cost: 450000, desc: '붉은 달의 힘으로 한계를 돌파하는 학살자의 외형입니다.', bonus: { atkPct: 16, bossDmg: 25 } },
    { id: 'skin_celestial', name: '창공의 천상 기사', grade: '신화', cost: 1200000, desc: '천상의 빛으로 빚어낸 전설적인 신들의 의복입니다.', bonus: { allPct: 12, goldPct: 35 } },
  ],
  auras: [
    { id: 'aura_none', name: '오라 없음', cost: 0, desc: '무기에 별도의 기운이 감돌지 않습니다.', bonus: {} },
    { id: 'aura_fire', name: '🔥 홍련의 화염 오라', grade: '희귀', cost: 30000, desc: '무기 날에 타오르는 불꽃이 감돕니다.', bonus: { atkPct: 5 } },
    { id: 'aura_frost', name: '❄️ 만년설 빙결 오라', grade: '영웅', cost: 80000, desc: '서릿발과 냉기가 적의 숨통을 조입니다.', bonus: { critRate: 5 } },
    { id: 'aura_holy', name: '✨ 황금 성광 오라', grade: '전설', cost: 250000, desc: '찬란한 신성 광채가 무기를 감쌉니다.', bonus: { skillPct: 10 } },
    { id: 'aura_void', name: '🌌 공허의 암흑 오라', grade: '신화', cost: 700000, desc: '시공간을 왜곡하는 암흑 성운이 소용돌이칩니다.', bonus: { bossDmg: 20, atkPct: 8 } },
  ],
  circles: [
    { id: 'circle_none', name: '마법진 없음', cost: 0, desc: '발밑에 마법진이 전개되지 않습니다.', bonus: {} },
    { id: 'circle_rune', name: '🌀 고대 룬 결계진', grade: '희귀', cost: 40000, desc: '영웅의 발밑에 신비로운 청록빛 룬진이 회전합니다.', bonus: { defPct: 6 } },
    { id: 'circle_flame', name: '🔥 연옥 화염 연성진', grade: '영웅', cost: 150000, desc: '작열하는 붉은 불꽃의 기하학 마법진이 펼쳐집니다.', bonus: { critDmg: 15 } },
    { id: 'circle_cosmos', name: '🪐 시공간 차원진', grade: '신화', cost: 600000, desc: '은하수가 소용돌이치는 궁극의 차원 게이트 마법진입니다.', bonus: { hpPct: 10, allPct: 5 } },
  ]
};

// 3. 업적 시스템 데이터 (열쇠 & 골드 핵심 수급처)
const ACHIEVEMENTS = [
  { id: 'stage', name: '던전 정복자', icon: '🏰', desc: '최고 층수 {v}층 도달', tiers: [10, 25, 50, 75, 100], rew: [{ keys: 10, gold: 10000 }, { keys: 20, gold: 30000 }, { keys: 35, gold: 80000 }, { keys: 50, gold: 180000 }, { keys: 100, gold: 500000 }] },
  { id: 'kills', name: '몬스터 학살자', icon: '⚔️', desc: '몬스터 누적 {v}마리 처치', tiers: [10, 50, 200, 500, 1500], rew: [{ keys: 5, gold: 5000 }, { keys: 15, gold: 15000 }, { keys: 25, gold: 40000 }, { keys: 45, gold: 90000 }, { keys: 80, gold: 250000 }] },
  { id: 'enhances', name: '명장의 경지', icon: '🔨', desc: '대장간 강화/승급 누적 {v}회', tiers: [10, 30, 80, 200, 500], rew: [{ keys: 5, gold: 8000 }, { keys: 15, gold: 25000 }, { keys: 30, gold: 60000 }, { keys: 50, gold: 150000 }, { keys: 90, gold: 350000 }] },
  { id: 'goldSpent', name: '황금의 거부', icon: '🪙', desc: '골드 누적 {v}G 소모', tiers: [10000, 100000, 500000, 2000000, 10000000], rew: [{ keys: 10, gold: 0 }, { keys: 25, gold: 0 }, { keys: 50, gold: 0 }, { keys: 80, gold: 0 }, { keys: 150, gold: 0 }] },
  { id: 'raids', name: '차원 토벌자', icon: '👹', desc: '차원 레이드 보스 {v}회 토벌', tiers: [1, 5, 15, 30, 50], rew: [{ keys: 15, gold: 50000, shards: 1 }, { keys: 30, gold: 120000, shards: 1 }, { keys: 50, gold: 300000, shards: 2 }, { keys: 80, gold: 600000, shards: 2 }, { keys: 150, gold: 1500000, shards: 3 }] },
  { id: 'codex', name: '만물 박물관장', icon: '📖', desc: '도감 수집 항목 {v}개 해금', tiers: [10, 25, 50, 80, 120], rew: [{ keys: 10, gold: 20000 }, { keys: 20, gold: 50000 }, { keys: 40, gold: 120000 }, { keys: 70, gold: 250000 }, { keys: 120, gold: 600000 }] },
];

// 4. 차원 레이드 보스 데이터 (열쇠 입장 + 무지개별 조각 파밍)
const RAID_BOSSES = [
  { id: 'hydra', name: '심연의 3두룡 히드라', grade: '영웅', keyReq: 3, hp: 1800000, atk: 1900, def: 650, icon: '🐉', col: '#00cec9', desc: '3개의 머리에서 치명적인 맹독을 뿜어내는 심연의 맹수', pattern: '맹독 3연 브레스 (지속 중독)', goldRew: 150000, shardRew: 1, petRew: 3 },
  { id: 'archangel', name: '타락한 대천사 루시엘', grade: '전설', keyReq: 4, hp: 5500000, atk: 4600, def: 1600, icon: '👼', col: '#f5b942', desc: '성광을 잃고 어둠에 물든 고위 천사. 방어력을 관통하는 멸망광선 시전', pattern: '종말의 심판광선 (방어 50% 관통)', goldRew: 450000, shardRew: 2, petRew: 6 },
  { id: 'void_dragon', name: '공허의 파멸룡 아포칼립스', grade: '신화', keyReq: 5, hp: 15000000, atk: 9800, def: 3500, icon: '🪐', col: '#ff5e97', desc: '차원의 틈새를 찢고 현현한 우주의 지배룡. 시공간을 뒤틀어 파멸을 선사', pattern: '시공간 붕괴: 블랙홀 (절대 파멸)', goldRew: 1200000, shardRew: 3, petRew: 12 },
];

// 5. 도감 달성률 구간별 보상
const CODEX_REWARDS = [
  { pct: 10, bonus: { atkPct: 5 }, keys: 10, gold: 5000, shards: 0, label: '초보 수집가' },
  { pct: 25, bonus: { hpPct: 8, defPct: 5 }, keys: 20, gold: 20000, shards: 0, label: '숙련 모험가' },
  { pct: 50, bonus: { atkPct: 10, critRate: 5 }, keys: 40, gold: 50000, shards: 1, label: '보물 사냥꾼' },
  { pct: 75, bonus: { goldPct: 25, bossDmg: 15 }, keys: 60, gold: 150000, shards: 2, label: '고대 유적 발굴자' },
  { pct: 90, bonus: { allPct: 15, critDmg: 30 }, keys: 100, gold: 300000, shards: 3, label: '신화의 계승자' },
  { pct: 100, bonus: { finalDmgPct: 25 }, keys: 200, gold: 1000000, shards: 5, label: '궁극의 모험가 (전설 칭호)' },
];
const SKILL_ICON_MOD = {}, SKILL_PAL_MOD = {};
const SKILL_BY_NAME = Object.fromEntries(SKILLS.map(s => [s.name, s]));

const REROLL_COST = { '일반': 400, '희귀': 1000, '영웅': 2500, '전설': 6000, '신화': 15000 };
const OPT_RANKS = [['C', 42], ['B', 30], ['A', 18], ['S', 7.5], ['SS', 2.5]];
const OPT_TYPES = {
  finalDmgPct: { label: '최종 피해량 증폭', r: [[15, 22], [23, 34], [35, 50], [51, 70], [71, 95]] },
  defIgnore: { label: '적 방어력 관통', r: [[15, 22], [23, 32], [33, 44], [45, 56], [57, 75]] },
  critBonus: { label: '스킬 치명타 확률', r: [[10, 15], [16, 22], [23, 30], [31, 40], [41, 55]] },
  critDmgAdd: { label: '스킬 치명타 피해', r: [[25, 40], [41, 65], [66, 95], [96, 130], [131, 180]] },
  bossBonus: { label: '보스 대상 추가피해', r: [[20, 32], [33, 48], [49, 68], [69, 92], [93, 125]] },
  lifesteal: { label: '피해량 생명력 흡수', r: [[3, 5], [6, 8], [9, 11], [12, 15], [16, 22]] },
  cdResetCh: { label: '시전 후 쿨1턴 단축', r: [[15, 22], [23, 32], [33, 42], [43, 55], [56, 70]] },
};

const RUNE_TYPES = [
  { id: 'power', name: '힘의 룬', stat: '공격력', icon: '⚔️', color: '#ff7924', base: 8, key: 'atk' },
  { id: 'vitality', name: '활력의 룬', stat: '최대 HP', icon: '❤️', color: '#2ed573', base: 40, key: 'hp' },
  { id: 'guard', name: '수호의 룬', stat: '방어력', icon: '🛡️', color: '#4deeea', base: 6, key: 'def' },
];
const RUNE_TIERS = [
  ['⚪ 일반', '#b2bec3', 1], ['🔵 희귀', '#00cec9', 3.2], ['🟣 영웅', '#a55eea', 10], ['🟡 전설', '#f5b942', 32],
  ['🌈 신화 ★☆☆☆☆', '#ff5e97', 100], ['🌈 신화 ★★☆☆☆', '#ff5e97', 310], ['🌈 신화 ★★★☆☆', '#ff5e97', 960],
  ['🌈 신화 ★★★★☆', '#ff5e97', 3000], ['🌈 신화 ★★★★★', '#ff5e97', 9500],
].map(([badge, color, mult]) => ({ badge, color, mult }));
const RUNE_SETS = [
  ['⚪ 일반 3종 세트', 60, 15, 10, 0], ['🔵 희귀 3종 세트', 200, 50, 35, 0], ['🟣 영웅 3종 세트', 650, 160, 110, 0],
  ['🟡 전설 3종 세트', 2000, 500, 350, 0], ['🌈 신화 ★☆☆☆☆ (무지개 1별) 세트', 6000, 1500, 1000, 6],
  ['🌈 신화 ★★☆☆☆ (무지개 2별) 세트', 18000, 4500, 3000, 12], ['🌈 신화 ★★★☆☆ (무지개 3별) 세트', 50000, 12500, 8500, 20],
  ['🌈 신화 ★★★★☆ (무지개 4별) 세트', 140000, 35000, 24000, 30], ['🌈 신화 ★★★★★ (무지개 5별) 세트', 400000, 100000, 70000, 50],
].map(([label, hp, atk, def, fin]) => ({ label, hp, atk, def, fin }));

const CODEX_ENGRAVE_BASE = { '일반': 300, '희귀': 800, '영웅': 2000, '전설': 5000, '신화': 12000 };
const SKILL_CODEX_PCT = { '일반': 4, '희귀': 6, '영웅': 9, '전설': 13, '신화': 18 };
// stat 키: atkPct defPct hpPct critRate critDmg bossDmg skillPct dropRate goldPct
const CODEX = {
  swords: GRADES.map((g, i) => ({ id: EQUIP[g].sword, name: EQUIP[g].sword, grade: g, fx: [[['atkPct', 3], ['atkPct', 5], ['critDmg', 12], ['bossDmg', 15], ['atkPct', 15]][i]] })),
  armors: GRADES.map((g, i) => ({ id: EQUIP[g].armor, name: EQUIP[g].armor, grade: g, fx: [[['hpPct', 4]], [['defPct', 5]], [['hpPct', 8]], [['defPct', 12]], [['hpPct', 15], ['defPct', 15]]][i] })),
  skills: SKILLS.map(s => ({ id: s.name, name: s.name, grade: s.grade, icon: s.icon, fx: [['skillPct', SKILL_CODEX_PCT[s.grade]]] })),
  monsters: [
    ['slime', '맹독 초원 슬라임', '일반', '🟢', 'goldPct', 5], ['goblin', '던전 정찰 고블린', '일반', '👺', 'goldPct', 5],
    ['skeleton', '고대 해골 병사', '일반', '💀', 'atkPct', 3], ['bat', '심연 흡혈 박쥐', '희귀', '🦇', 'critRate', 1.5],
    ['troll', '청록 몽둥이 트롤', '희귀', '🧌', 'hpPct', 6], ['lich', '망령 리치 흑마법사', '영웅', '🧙', 'skillPct', 8],
    ['golem', '화강암 룬 골렘', '영웅', '🗿', 'defPct', 8], ['elite', '정예 엘리트 수호자', '전설', '⭐', 'dropRate', 3],
    ['boss', '던전 거대 군주/드래곤', '신화', '🐉', 'bossDmg', 18],
  ].map(([id, name, grade, icon, k, v]) => ({ id, name, grade, icon, fx: [[k, v]] })),
  pets: PET_TYPES.map(p => ({ id: p.id, name: p.name, grade: p.grade, icon: p.icon, fx: [['allPct', p.grade === '전설' ? 5 : p.grade === '영웅' ? 3 : p.grade === '희귀' ? 2 : 1]] })),
  costumes: [
    ...COSTUMES.skins,
    ...COSTUMES.auras.filter(a => a.id !== 'aura_none'),
    ...COSTUMES.circles.filter(c => c.id !== 'circle_none')
  ].map(c => ({ id: c.id, name: c.name, grade: c.grade || '희귀', icon: '🎭', fx: Object.entries(c.bonus || {}).map(([k, v]) => [k, v]) })),
};
CODEX.swords.forEach((e, i) => e.fx = [e.fx[0]]);
const STAT_DESC = {
  atkPct: '영구 공격력 +{v}% / 각인Lv', defPct: '영구 방어력 +{v}% / 각인Lv', hpPct: '영구 최대 체력 +{v}% / 각인Lv',
  critRate: '영구 치명타 확률 +{v}% / 각인Lv', critDmg: '영구 치명타 피해 +{v}% / 각인Lv', bossDmg: '영구 보스 추가피해 +{v}% / 각인Lv',
  skillPct: '영구 스킬 피해 +{v}% / 각인Lv', dropRate: '영구 드랍률 +{v}% / 각인Lv', goldPct: '영구 골드 획득 +{v}% / 각인Lv',
};
const STAT_SHORT = { atkPct: '공격력', defPct: '방어력', hpPct: '체력', critRate: '치확', critDmg: '치피', bossDmg: '보스피해', skillPct: '스킬피해', dropRate: '드랍률', goldPct: '골드획득' };

const RELICS = [
  ['whetstone', '고대 병사의 숫돌', '일반', 'flatAtk', 18, '영구 공격력 +18 / Lv'],
  ['shield_crest', '수호자의 청동 문장', '일반', 'flatDef', 18, '영구 방어력 +18 / Lv'],
  ['chalice', '생명의 이슬 성배', '일반', 'flatHp', 90, '영구 최대 체력 +90 / Lv'],
  ['gold_coin', '탐욕의 황금 주화', '희귀', 'goldPct', 3, '골드 획득량 +3% / Lv'],
  ['clover', '행운의 클로버 브로치', '희귀', 'dropRate', 1.5, '아이템 드랍률 +1.5% / Lv'],
  ['crimson_dagger', '암살자의 붉은 단검날', '영웅', 'critDmg', 6, '치명타 피해 +6% / Lv'],
  ['mana_orb', '현자의 마력 수정구', '영웅', 'skillPct', 3.5, '모든 스킬 피해 +3.5% / Lv'],
  ['dragon_seal', '용살자의 맹세 인장', '전설', 'bossDmg', 4.5, '보스 추가 피해 +4.5% / Lv'],
  ['phoenix_feather', '불사조의 잿빛 깃털', '전설', 'potionPct', 0.5, '물약 회복 효율 +0.5% / Lv'],
  ['chronos_hourglass', '크로노스 모래시계', '신화', 'allPct', 2.5, '공·방·체 전체 증폭 +2.5% / Lv'],
].map(([id, name, grade, stat, val, desc]) => ({ id, name, grade, stat, val, desc }));
const RELIC_RATES = [['일반', 42], ['희귀', 30], ['영웅', 18], ['전설', 8], ['신화', 2]];

const NORMAL_MONSTERS = [
  ['맹독 초원 슬라임', '🟢', 'slime'], ['던전 정찰 고블린', '👺', 'goblin'], ['고대 해골 병사', '💀', 'skeleton'],
  ['심연 흡혈 박쥐', '🦇', 'bat'], ['청록 몽둥이 트롤', '🧌', 'troll'], ['망령 리치 흑마법사', '🧙', 'lich'],
];
const ELITE_MONSTERS = [['⭐ [정예] 룬 수호자 고블린 킹', '👺', 'goblin'], ['⭐ [정예] 청록 어둠의 트롤 대장', '🧌', 'troll'], ['⭐ [정예] 화강암 룬 골렘', '🗿', 'golem']];
const BOSS_MONSTERS = [
  ['용암 심연의 고대 드래곤', '🐉', '드래곤 로드 블레이드', '붉은 용비늘 판금갑'],
  ['지하 군주 암흑 데스나이트', '💀', '데스나이트 소울 이터', '저주받은 칠흑 갑주'],
  ['심연의 파괴신 발록', '👹', '지옥불 대검 아포칼립스', '발록의 용암 흉갑'],
];

// 등급별 장비 이름 풀: 모드가 추가한 무기/방어구도 여기 들어가 상자에서 나온다
const SWORD_POOL = Object.fromEntries(GRADES.map(g => [g, [EQUIP[g].sword]]));
const ARMOR_POOL = Object.fromEntries(GRADES.map(g => [g, [EQUIP[g].armor]]));
const ITEM_ICON_MOD = {};
// 월드: normal/elite/boss 목록과 배경 색. 'normal'(일반 맵)이 기본
const WORLDS = [{ id: 'normal', name: '일반 맵', icon: '🏰', desc: '지하 던전 복도', normal: NORMAL_MONSTERS, elite: ELITE_MONSTERS, boss: BOSS_MONSTERS, mult: 1, colors: null }];

// ===== 상태 · 공식 · 시스템 (DOM 없음) =====
const r1 = (v) => Math.round(v * 10) / 10;
const fmt = (n) => Math.floor(n).toLocaleString('en-US');
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function newEquip(kind, grade, name) {
  const e = EQUIP[grade];
  return { name: name || e[kind], grade, baseStat: kind === 'sword' ? e.sBase : e.aBase, sellPrice: SELL[grade].gold || 0, enhanceLevel: 0, starTier: 0, starCount: 0, pityBonus: 0 };
}
function newSkill(name) {
  const s = SKILL_BY_NAME[name];
  return { name, grade: s.grade, baseDmg: s.baseDmg, atkRatio: s.atkRatio, level: 1, maxCooldown: s.maxCooldown, cooldown: 0, icon: s.icon, specialOption: null };
}
function defaultState() {
  return {
    hero: {
      name: 'Foer', maxHp: 140, hp: 140, baseAtk: 14, baseDef: 5, gold: 500, keys: 5, potionCooldown: 0,
      statLevels: { atk: 0, def: 0, maxHp: 0, critRate: 0, critDmg: 0, bossDmg: 0, dropRate: 0 },
      sword: newEquip('sword', '일반'), armor: newEquip('armor', '일반'),
      bossSword: { name: '없음', grade: '없음', attackBonus: 0, sellPrice: 0 },
      bossArmor: { name: '없음', grade: '없음', defenseBonus: 0, sellPrice: 0 },
      skills: [newSkill('화염 강타')], equippedSkills: ['화염 강타'], autoCast: true,
      runeCounts: { power: Array(9).fill(0), vitality: Array(9).fill(0), guard: Array(9).fill(0) },
      rainbowShards: 0,
      costumes: { owned: ['skin_default', 'aura_none', 'circle_none'], skin: 'skin_default', aura: 'aura_none', circle: 'circle_none' },
      pets: { owned: {}, equipped: null },
    },
    chestLevel: 1, chestExp: 0,
    codex: { swords: {}, armors: {}, skills: {}, monsters: {}, pets: {}, costumes: {} },
    codexRewards: {},
    achievements: { kills: 0, enhances: 0, goldSpent: 0, raids: 0, claimed: {} },
    relics: {},
    stage: 1, maxStage: 1, repeatStage: null, world: 'normal', battleSpeed: 1, forgeTarget: 'sword',
    battle: { inBattle: false, isRaid: false, raidTurnsLeft: 15, monster: null, turn: 1, isPlayerTurn: true },
  };
}
let S = defaultState();

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { } }
function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { d = null; }
  const def = defaultState();
  S = d && d.hero ? { ...def, ...d, hero: { ...def.hero, ...d.hero } } : def;
  sanitize();
}
function sanitize() {
  const h = S.hero, def = defaultState();
  h.statLevels = { ...def.hero.statLevels, ...(h.statLevels || {}) };
  for (const t of TRAIN) if (t.max) h.statLevels[t.key] = Math.min(t.max, h.statLevels[t.key]);
  for (const k of ['sword', 'armor']) {
    const e = h[k] = { ...def.hero[k], ...(h[k] || {}) };
    e.grade = GRADE_ALIAS[e.grade] || e.grade;
    if (!EQUIP[e.grade]) Object.assign(e, newEquip(k, '일반'));
    e.baseStat = k === 'sword' ? EQUIP[e.grade].sBase : EQUIP[e.grade].aBase;
  }
  h.bossSword = { ...def.hero.bossSword, ...(h.bossSword || {}) };
  h.bossArmor = { ...def.hero.bossArmor, ...(h.bossArmor || {}) };
  h.skills = (Array.isArray(h.skills) ? h.skills : []).filter(s => s && SKILL_BY_NAME[s.name]).map(s => {
    const b = SKILL_BY_NAME[s.name];
    return { ...newSkill(s.name), level: Math.min(10, Math.max(1, s.level || 1)), cooldown: 0, specialOption: s.specialOption || null, grade: b.grade };
  });
  const owned = new Set(h.skills.map(s => s.name));
  h.equippedSkills = [...new Set((h.equippedSkills || []).filter(n => owned.has(n)))].slice(0, 4);
  if (!h.equippedSkills.length && h.skills.length) h.equippedSkills = [h.skills[0].name];
  h.runeCounts = h.runeCounts || {};
  for (const t of RUNE_TYPES) { const a = h.runeCounts[t.id]; h.runeCounts[t.id] = Array.from({ length: 9 }, (_, i) => (a && a[i]) | 0); }
  h.rainbowShards = Math.max(0, h.rainbowShards | 0);
  h.costumes = h.costumes || { owned: ['skin_default', 'aura_none', 'circle_none'], skin: 'skin_default', aura: 'aura_none', circle: 'circle_none' };
  if (!h.costumes.owned) h.costumes.owned = ['skin_default', 'aura_none', 'circle_none'];
  if (!h.costumes.skin) h.costumes.skin = 'skin_default';
  if (!h.costumes.aura) h.costumes.aura = 'aura_none';
  if (!h.costumes.circle) h.costumes.circle = 'circle_none';
  h.pets = h.pets || { owned: {}, equipped: null };
  if (!h.pets.owned) h.pets.owned = {};
  S.achievements = S.achievements || { kills: 0, enhances: 0, goldSpent: 0, raids: 0, claimed: {} };
  if (!S.achievements.claimed) S.achievements.claimed = {};
  S.codexRewards = S.codexRewards || {};
  S.chestLevel = Math.min(10, Math.max(1, S.chestLevel | 0));
  S.chestExp = S.chestExp | 0;
  S.codex = { swords: {}, armors: {}, skills: {}, monsters: {}, pets: {}, costumes: {}, ...(S.codex || {}) };
  S.relics = S.relics || {};
  S.stage = Math.max(1, S.stage | 0); S.maxStage = Math.max(S.stage, S.maxStage | 0);
  if (![1, 2, 'skip'].includes(S.battleSpeed)) S.battleSpeed = 1;
  if (!WORLDS.some(w => w.id === S.world)) S.world = 'normal';
  S.battle = { inBattle: false, isRaid: false, raidTurnsLeft: 15, monster: null, turn: 1, isPlayerTurn: true };
  unlockCodex('swords', h.sword.name, true);
  unlockCodex('armors', h.armor.name, true);
  for (const s of h.skills) unlockCodex('skills', s.name, true);
  if (h.pets.equipped) unlockCodex('pets', h.pets.equipped, true);
  h.costumes.owned.forEach(cid => unlockCodex('costumes', cid, true));
  h.maxHp = maxHp(); h.hp = Math.min(Math.max(1, h.hp | 0), h.maxHp);
}
function unlockCodex(cat, id, silent) {
  const c = S.codex[cat][id] = S.codex[cat][id] || { unlocked: false, engraveLv: 0, count: 0 };
  c.unlocked = true;
  if (!silent) c.count++;
}

// --- 보너스 집계 ---
function codexBonus() {
  const b = {};
  for (const cat of Object.keys(CODEX)) for (const e of CODEX[cat]) {
    const lv = S.codex[cat][e.id]?.engraveLv || 0;
    if (lv) for (const [k, v] of e.fx) b[k] = (b[k] || 0) + v * lv;
  }
  return b;
}
function relicBonus() {
  const b = {};
  for (const r of RELICS) { const lv = S.relics[r.id] || 0; if (lv) b[r.stat] = (b[r.stat] || 0) + r.val * lv; }
  return b;
}
function runeSetTier() {
  let T = 9;
  for (const t of RUNE_TYPES) { const a = S.hero.runeCounts[t.id]; let hi = -1; a.forEach((n, i) => { if (n > 0) hi = i; }); T = Math.min(T, hi); }
  return T;
}
function runeBonus() {
  const b = { atk: 0, hp: 0, def: 0, fin: 0 };
  for (const t of RUNE_TYPES) S.hero.runeCounts[t.id].forEach((n, i) => { b[t.key] += n * Math.floor(t.base * RUNE_TIERS[i].mult); });
  const T = runeSetTier();
  for (let i = 0; i <= T; i++) { const s = RUNE_SETS[i]; b.hp += s.hp; b.atk += s.atk; b.def += s.def; b.fin += s.fin; }
  return b;
}
// 코스튬 보너스: 장착 효과 + 보유 컬렉션 패시브
function costumeBonus() {
  const b = {};
  const c = S.hero.costumes || {};
  const sItem = COSTUMES.skins.find(x => x.id === c.skin);
  const aItem = COSTUMES.auras.find(x => x.id === c.aura);
  const cirItem = COSTUMES.circles.find(x => x.id === c.circle);
  [sItem, aItem, cirItem].forEach(item => {
    if (item && item.bonus) for (const [k, val] of Object.entries(item.bonus)) b[k] = (b[k] || 0) + val;
  });
  (c.owned || []).forEach(id => {
    const it = [...COSTUMES.skins, ...COSTUMES.auras, ...COSTUMES.circles].find(x => x.id === id);
    if (it && it.cost > 0) {
      b.atkPct = (b.atkPct || 0) + 1;
      b.hpPct = (b.hpPct || 0) + 1;
    }
  });
  return b;
}

// 도감 달성률 구간 수집 보상 보너스
function codexRewardBonus() {
  const b = {};
  for (const tier of CODEX_REWARDS) {
    if (S.codexRewards?.[tier.pct]) {
      for (const [k, v] of Object.entries(tier.bonus)) b[k] = (b[k] || 0) + v;
    }
  }
  return b;
}

// 펫 동행 패시브 스탯
function petBonus() {
  const b = { atkPct: 0, hpPct: 0, defPct: 0 };
  const ep = S.hero.pets?.equipped;
  if (ep && S.hero.pets.owned[ep]) {
    const lv = S.hero.pets.owned[ep].level || 1;
    b.atkPct += lv * 1.5;
    b.hpPct += lv * 2.0;
    b.defPct += lv * 1.0;
  }
  return b;
}

function totalSteps(e) {
  if (e.starTier === 0) return e.enhanceLevel;
  if (e.starTier <= 3) return 10 + (e.starTier - 1) * 5 + e.starCount;
  if (e.starTier === 4) return 26;
  return 35; // 큰 무지개별 완성
}
function equipBonus(kind, e = S.hero[kind]) {
  const q = EQUIP[e.grade], step = kind === 'sword' ? q.sStep : q.aStep;
  const mult = e.starTier >= 5 ? 3.5 : (1 + e.starTier * 0.35);
  return Math.floor((e.baseStat + totalSteps(e) * step) * mult);
}
function stats() {
  const C = codexBonus(), R = relicBonus(), U = runeBonus(), Cos = costumeBonus(), CR = codexRewardBonus(), P = petBonus();
  const L = S.hero.statLevels, h = S.hero;
  const v = (x) => x || 0;
  const all = v(R.allPct) + v(Cos.allPct) + v(CR.allPct);
  const finAmp = (1 + v(CR.finalDmgPct) / 100);
  return {
    maxHp: Math.floor((140 + L.maxHp * 75 + v(R.flatHp) + U.hp) * (1 + (v(C.hpPct) + v(Cos.hpPct) + v(CR.hpPct) + v(P.hpPct) + all) / 100)),
    atk: Math.floor((14 + L.atk * 13 + equipBonus('sword') + h.bossSword.attackBonus + v(R.flatAtk) + U.atk) * (1 + (v(C.atkPct) + v(Cos.atkPct) + v(CR.atkPct) + v(P.atkPct) + all) / 100) * finAmp),
    def: Math.floor((5 + L.def * 13 + equipBonus('armor') + h.bossArmor.defenseBonus + v(R.flatDef) + U.def) * (1 + (v(C.defPct) + v(Cos.defPct) + v(CR.defPct) + v(P.defPct) + all) / 100)),
    critRate: Math.min(100, 20 + L.critRate * 1.5 + v(C.critRate) + v(Cos.critRate) + v(CR.critRate)),
    critDmg: Math.floor(150 + L.critDmg * 8 + v(C.critDmg) + v(R.critDmg) + v(Cos.critDmg) + v(CR.critDmg)),
    bossDmg: Math.floor(Math.min(1000, L.bossDmg) * 5 + v(C.bossDmg) + v(R.bossDmg) + v(Cos.bossDmg) + v(CR.bossDmg)),
    dropRate: r1(L.dropRate * 2 + v(C.dropRate) + v(R.dropRate)),
    goldPct: Math.floor(v(C.goldPct) + v(R.goldPct) + v(Cos.goldPct) + v(CR.goldPct)),
    skillAmp: r1(v(C.skillPct) + v(R.skillPct) + v(Cos.skillPct)),
    runeMult: 1 + U.fin / 100,
    potion: Math.min(0.95, 0.40 + v(R.potionPct) / 100),
  };
}
const maxHp = () => stats().maxHp;
const dmgReduction = (def) => Math.min(def / (1500 + def), 0.75);
// 최대 체력이 오르면 현재 체력도 같은 만큼 오름
function withHpDelta(fn) {
  const before = maxHp(); const r = fn(); const after = maxHp();
  S.hero.maxHp = after;
  if (after > before) S.hero.hp = Math.min(after, S.hero.hp + after - before);
  S.hero.hp = Math.min(S.hero.hp, after);
  return r;
}

// --- 훈련 ---
const trainCost = (t, lv) => Math.floor(t.base + lv * t.step + Math.pow(lv, 1.38) * 18);
function buyTrain(key, n) {
  const t = TRAIN.find(x => x.key === key); let bought = 0;
  withHpDelta(() => {
    for (let i = 0; i < n; i++) {
      const lv = S.hero.statLevels[key];
      if (t.max && lv >= t.max) break;
      const c = trainCost(t, lv); if (S.hero.gold < c) break;
      S.hero.gold -= c; S.hero.statLevels[key]++; bought++;
    }
  });
  save(); return bought;
}

// --- 몬스터 ---
const curWorld = () => WORLDS.find(w => w.id === S.world) || WORLDS[0];
function makeMonster(stage) {
  const W = curWorld();
  const boss = stage % 10 === 0, elite = !boss && stage % 5 === 0, boss50 = stage % 50 === 0;
  const s = stage - 1, m = Math.floor(stage / 50), e = Math.max(0, stage - 25), q = Math.max(0, s - 5);
  const hpS = (1 + 0.22 * s + 0.085 * Math.pow(q, 1.55)) * Math.pow(1.024, e) * Math.pow(1.80, m) * (boss50 ? 1.35 : 1);
  const atkS = (1 + 0.14 * s + 0.038 * Math.pow(q, 1.32)) * Math.pow(1.018, e) * Math.pow(1.50, m) * (boss50 ? 1.22 : 1);
  const defS = (1 + 0.15 * s + 0.045 * Math.pow(q, 1.36)) * Math.pow(1.020, e) * Math.pow(1.55, m) * (boss50 ? 1.22 : 1);
  let base, name, icon, type, gold, bossInfo = null;
  if (boss) {
    base = [320, 22, 14]; gold = Math.floor(220 + 35 * stage + 400 * m);
    bossInfo = W.boss[(Math.floor(stage / 10) - 1) % W.boss.length];
    [name, icon] = bossInfo; type = bossInfo[4] || 'boss';
    if (boss50) { name = `🔥 [${stage}층 심연 대군주] ` + name; icon = '🔥'; }
  } else if (elite) {
    base = [145, 15, 9]; gold = Math.floor(80 + 15 * stage + 120 * m);
    [name, icon, type] = W.elite[(Math.floor(stage / 5) - 1) % W.elite.length];
  } else {
    base = [50, 8, 4]; gold = Math.floor(28 + 6.5 * stage + 45 * m);
    [name, icon, type] = W.normal[(stage - 1) % W.normal.length];
  }
  const k = W.mult || 1, hp = Math.floor(base[0] * hpS * k);
  return { name, icon, type, isBoss: boss, isElite: elite, is50: boss50, hp, maxHp: hp, atk: Math.floor(base[1] * atkS * k), def: Math.floor(base[2] * defS * k), gold: Math.floor(gold * k), bossWeapon: bossInfo?.[2], bossArmor: bossInfo?.[3] };
}
const monsterTaken = (raw, mDef, ign = 0) => Math.max(1, Math.floor(raw * 300 / (300 + Math.max(0, mDef * (1 - Math.min(0.9, ign / 100))))));
const heroTaken = (raw) => Math.max(1, Math.floor(raw * (1 - dmgReduction(stats().def))));

// --- 스킬 ---
const ownedSkill = (n) => S.hero.skills.find(s => s.name === n);
function skillEst(sk, st = stats()) {
  let d = Math.floor((sk.baseDmg + st.atk * sk.atkRatio) * (1 + (sk.level - 1) * 0.25) * (1 + st.skillAmp / 100));
  if (sk.specialOption?.type === 'finalDmgPct') d = Math.floor(d * (1 + sk.specialOption.value / 100));
  return d;
}
function basicAttack(mon) {
  const st = stats(), crit = Math.random() * 100 < st.critRate;
  const raw = Math.floor(st.atk * (crit ? st.critDmg / 100 : 1) * (mon.isBoss ? 1 + st.bossDmg / 100 : 1) * st.runeMult);
  return { dmg: monsterTaken(raw, mon.def), crit };
}
function castSkill(sk, mon) {
  const st = stats(), o = sk.specialOption || {}, ov = (t) => (o.type === t ? o.value : 0);
  let raw = Math.floor((sk.baseDmg + st.atk * sk.atkRatio) * (1 + (sk.level - 1) * 0.25) * (mon.isBoss ? 1 + st.bossDmg / 100 : 1) * (1 + st.skillAmp / 100) * st.runeMult);
  if (ov('finalDmgPct')) raw = Math.floor(raw * (1 + ov('finalDmgPct') / 100));
  if (mon.isBoss && ov('bossBonus')) raw = Math.floor(raw * (1 + ov('bossBonus') / 100));
  const crit = Math.random() * 100 < Math.min(100, st.critRate + ov('critBonus'));
  if (crit) raw = Math.floor(raw * (st.critDmg / 100 + ov('critDmgAdd') / 100));
  const dmg = monsterTaken(raw, mon.def, ov('defIgnore'));
  let heal = 0;
  if (ov('lifesteal')) { heal = Math.max(1, Math.floor(dmg * ov('lifesteal') / 100)); heal = Math.min(heal, st.maxHp - S.hero.hp); S.hero.hp += heal; }
  const cdCut = ov('cdResetCh') && Math.random() * 100 < ov('cdResetCh');
  sk.cooldown = cdCut ? Math.max(1, sk.maxCooldown - 1) : sk.maxCooldown;
  return { dmg, crit, heal, cdCut };
}
function rollOption() {
  let r = Math.random() * 100, ri = 0;
  for (let i = 0; i < OPT_RANKS.length; i++) { r -= OPT_RANKS[i][1]; if (r < 0) { ri = i; break; } ri = i; }
  const type = pick(Object.keys(OPT_TYPES)), [a, b] = OPT_TYPES[type].r[ri];
  return { type, rank: OPT_RANKS[ri][0], value: rint(a, b) };
}
const optText = (o) => (o ? `[${o.rank}] ${OPT_TYPES[o.type].label} +${o.value}%` : '미각성 (옵션 없음)');
function sortedSkills(mode) {
  const st = stats(), list = S.hero.skills.slice();
  if (mode === 'atk') list.sort((a, b) => skillEst(b, st) - skillEst(a, st) || rankOf(b.grade) - rankOf(a.grade));
  if (mode === 'grade') list.sort((a, b) => rankOf(b.grade) - rankOf(a.grade) || skillEst(b, st) - skillEst(a, st));
  return list;
}

// --- 상자 ---
// 상자 확률 재조정:
// 1) 검/방어구: 전설/신화 제외, 하위~영웅 100% 정규화
// 2) 스킬: 전설/신화 대폭 하향(희소성 극대화)
function rollGrade(type) {
  const rawRates = CHEST_LV[S.chestLevel].r;
  let rates = rawRates.slice();
  if (type === 'sword' || type === 'armor') {
    if (S.chestLevel === 10) {
      const legP = 0.1, mythP = 0.01;
      const rem = 100 - (legP + mythP); // 99.89%
      const sum = rates[0] + rates[1] + rates[2];
      rates = [rates[0] / sum * rem, rates[1] / sum * rem, rates[2] / sum * rem, legP, mythP];
    } else {
      const sum = rates[0] + rates[1] + rates[2];
      rates = [rates[0] / sum * 100, rates[1] / sum * 100, rates[2] / sum * 100, 0, 0];
    }
  } else if (type === 'skill') {
    const legP = Math.min(1.8, rates[3] * 0.2);
    const mythP = Math.min(0.4, rates[4] * 0.15);
    const lowSum = rates[0] + rates[1] + rates[2];
    const rem = 100 - (legP + mythP);
    rates = [rates[0] / lowSum * rem, rates[1] / lowSum * rem, rates[2] / lowSum * rem, legP, mythP];
  }
  const r = Math.random() * 100; let acc = 0;
  for (let i = 0; i < 5; i++) { acc += rates[i]; if (r < acc) return GRADES[i]; }
  return '일반';
}

function getChestMultiPulls(keys) {
  const pulls = [1];
  if (keys >= 10) pulls.push(10);
  if (keys >= 100) pulls.push(100);
  if (keys >= 1000) pulls.push(1000);
  if (keys >= 10000) pulls.push(10000);
  if (keys >= 100000) pulls.push(100000);
  return pulls;
}
function getChestButtons(type) {
  const pulls = getChestMultiPulls(S.hero.keys);
  return pulls.map(p => {
    const cls = p === 1 ? '' : p === 10 ? 'cyan' : p === 100 ? 'gold' : p === 1000 ? 'orange' : 'purple';
    return `<button class="btn ${cls}" onclick="openChest('${type}',${p})">${fmt(p)}회 (🗝️${fmt(p)})</button>`;
  }).join('');
}
function addChestExp() {
  if (S.chestLevel >= 10) { S.chestExp = 0; return false; }
  S.chestExp++; let up = false;
  while (S.chestLevel < 10 && S.chestExp >= CHEST_LV[S.chestLevel].req) { S.chestExp -= CHEST_LV[S.chestLevel].req; S.chestLevel++; up = true; }
  if (S.chestLevel >= 10) S.chestExp = 0;
  return up;
}
const rewardText = (r) => (r.keys ? `열쇠 🗝️ +${r.keys}개` : `${r.gold}G`);
function grantReward(r) { if (r.keys) S.hero.keys += r.keys; else S.hero.gold += r.gold; }
// 결과: {kind, grade, name, statText, tag, tagType:'equip'|'sell'|'key', banner, gold, keys}
function openOne(type) {
  const grade = rollGrade(type), h = S.hero;
  if (type === 'sword' || type === 'armor') {
    const name = pick((type === 'sword' ? SWORD_POOL : ARMOR_POOL)[grade]), cat = type === 'sword' ? 'swords' : 'armors', word = type === 'sword' ? '검' : '방어구';
    unlockCodex(cat, name);
    const statText = `${type === 'sword' ? '기본 공격력' : '기본 방어력'} +${type === 'sword' ? EQUIP[grade].sBase : EQUIP[grade].aBase}`;
    if (rankOf(grade) > rankOf(h[type].grade)) {
      const old = h[type].sellPrice || 0; h.gold += old;
      withHpDelta(() => { h[type] = newEquip(type, grade, name); });
      return { kind: type, grade, name, statText, tag: `✨ 장착! (구장비 +${old}G)`, tagType: 'equip', banner: `더 높은 등급의 ${word}을 획득하여 즉시 장착! (이전 장비 판매 +${old}G)`.replace('방어구을', '방어구를'), gold: old, keys: 0 };
    }
    const rw = SELL[grade]; grantReward(rw);
    return rw.keys
      ? { kind: type, grade, name, statText, tag: `🗝️ 열쇠 +${rw.keys}개`, tagType: 'key', banner: `고등급 중복 보상! 소환 열쇠 +${rw.keys}개 획득!`, gold: 0, keys: rw.keys }
      : { kind: type, grade, name, statText, tag: `🪙 판매 +${rw.gold}G`, tagType: 'sell', banner: `${type === 'sword' ? '중복 장비' : '중복 방어구'} 자동 판매! +${rw.gold}G 획득!`, gold: rw.gold, keys: 0 };
  }
  const pool = SKILLS.filter(s => s.grade === grade), sk = pick(pool), statText0 = `기본피해 ${sk.baseDmg} + 공격력×${sk.atkRatio}`;
  unlockCodex('skills', sk.name);
  const own = ownedSkill(sk.name);
  if (!own) {
    h.skills.push(newSkill(sk.name)); let slot = '';
    if (h.equippedSkills.length < 4) { h.equippedSkills.push(sk.name); slot = ` (${h.equippedSkills.length}번 슬롯 자동 장착!)`; }
    return { kind: 'skill', grade, name: sk.name, icon: sk.icon, statText: statText0, tag: '🆕 신규 스킬 습득!', tagType: 'equip', banner: `신규 스킬 습득! [8. 스킬 장착 & 옵션 재조정]에서 슬롯을 관리하세요.${slot}`, gold: 0, keys: 0 };
  }
  if (own.level < 10) {
    own.level++;
    return { kind: 'skill', grade, name: sk.name, icon: sk.icon, statText: `스킬 Lv.${own.level} 승급!`, tag: `⬆️ Lv.${own.level} 강화!`, tagType: 'equip', banner: `중복 스킬 흡수! [${sk.name}] 레벨이 Lv.${own.level}로 상승했습니다!`, gold: 0, keys: 0 };
  }
  const rw = SKILL_REFUND[grade]; grantReward(rw);
  return { kind: 'skill', grade, name: sk.name, icon: sk.icon, statText: '최대 Lv.10 도달!', tag: rw.keys ? `🗝️ 열쇠 +${rw.keys}개` : `🪙 환급 +${rw.gold}G`, tagType: rw.keys ? 'key' : 'sell', banner: `만렙 스킬 중복 환급! ${rewardText(rw)} 획득!`, gold: rw.gold || 0, keys: rw.keys || 0 };
}

// --- 강화 & 등급 승급 & 무지개별 ---
const STAR_NAMES = ['', '🥉동별', '🥈은별', '🥇금별'];
function isMaxed(e) {
  if (e.grade === '일반' || e.grade === '희귀') return e.starTier === 3 && e.starCount >= 5;
  if (e.grade === '영웅' || e.grade === '전설') return e.starTier === 3 && e.starCount >= 5; // 승급 대기
  return e.starTier >= 5; // 신화 등급 큰 무지개별
}
function canRankUp(e) {
  return (e.grade === '영웅' || e.grade === '전설') && e.starTier === 3 && e.starCount >= 5;
}
function rankUpTarget(e) {
  return e.grade === '영웅' ? '전설' : e.grade === '전설' ? '신화' : null;
}
function rankUpCost(e) {
  return 0; // 무료 승급
}
function doRankUp(kind) {
  const e = S.hero[kind];
  if (!canRankUp(e)) return false;
  const cost = rankUpCost(e);
  if (cost > 0 && S.hero.gold < cost) { alert(`골드가 부족합니다! (승급 비용: ${fmt(cost)}G)`); return false; }
  const nextGrade = rankUpTarget(e);
  withHpDelta(() => {
    if (cost > 0) {
      S.hero.gold -= cost;
      S.achievements.goldSpent = (S.achievements.goldSpent || 0) + cost;
    }
    S.achievements.enhances = (S.achievements.enhances || 0) + 1;
    e.grade = nextGrade;
    e.name = EQUIP[nextGrade][kind];
    e.baseStat = kind === 'sword' ? EQUIP[nextGrade].sBase : EQUIP[nextGrade].aBase;
    e.enhanceLevel = 0;
    e.starTier = 0;
    e.starCount = 0;
    e.pityBonus = 0;
    unlockCodex(kind === 'sword' ? 'swords' : 'armors', e.name);
  });
  save();
  return true;
}
function canInfuseRainbow(e) {
  return e.grade === '신화' && ((e.starTier === 3 && e.starCount >= 5) || e.starTier === 4) && e.starTier < 5;
}
function doInfuseRainbow(kind) {
  const e = S.hero[kind];
  if (!canInfuseRainbow(e)) return false;
  if ((S.hero.rainbowShards || 0) < 5) {
    alert(`무지개별 조각이 부족합니다! (필요: 5개 / 현재 보유: ${S.hero.rainbowShards || 0}개)\n차원 레이드 보스를 토벌하여 조각을 획득하세요!`);
    return false;
  }
  withHpDelta(() => {
    S.hero.rainbowShards -= 5;
    e.starTier = 5;
    e.starCount = 1;
    e.pityBonus = 0;
    S.achievements.enhances = (S.achievements.enhances || 0) + 1;
  });
  save();
  return true;
}
function enhanceStatus(e) {
  if (e.starTier === 0) return `+${e.enhanceLevel}강`;
  if (e.starTier <= 3) return `+10 [${STAR_NAMES[e.starTier]} ${'★'.repeat(e.starCount)}${'☆'.repeat(5 - e.starCount)}]`;
  if (e.starTier === 4) return `+10 [🌈 무지개별 조각 ${S.hero.rainbowShards || 0}/5개 준비]`;
  return '+10 [🌟 큰 무지개별 완성 (MAX)]';
}
function nextStepLabel(e) {
  if (e.starTier >= 5) return '🌟 큰 무지개별 완성 (MAX)';
  if (canRankUp(e)) return `👑 [${e.grade === '영웅' ? '전설' : '신화'}] 등급 무료 승급 가능!`;
  if (canInfuseRainbow(e)) return `🌈 무지개별 조각 5개 주입 → 큰 무지개별 각성!`;
  if (e.starTier === 0) return e.enhanceLevel < 10 ? `+${e.enhanceLevel + 1}강` : '🥉 동별 1성 초월 진입';
  const c = e.starCount;
  if (e.starTier === 1) return c < 5 ? `🥉 동별 ${c + 1}성` : '🥈 은별 1성 승급';
  if (e.starTier === 2) return c < 5 ? `🥈 은별 ${c + 1}성` : '🥇 금별 1성 승급';
  if (e.starTier === 3) return c < 5 ? `🥇 금별 ${c + 1}성` : '👑 상위 등급 승급 대기';
  return '🌟 큰 무지개별 각성';
}
function starBadge(e) {
  if (e.starTier === 0) return '일반 강화 구간 (+0 ~ +10)';
  if (e.starTier <= 3) return `${['', '🥉 동별', '🥈 은별', '🥇 금별'][e.starTier]} 초월 구간 (${e.starCount}/5성)`;
  if (e.starTier === 4) return `🌈 무지개별 조각 주입 대기 (${S.hero.rainbowShards || 0}/5개)`;
  return '🌟 큰 무지개별 초월 완성 (MAX)';
}
function stepUp(e) {
  if (e.starTier === 0) {
    if (e.enhanceLevel < 10) e.enhanceLevel++;
    else { e.starTier = 1; e.starCount = 1; }
    return;
  }
  if (e.starTier <= 3) {
    if (e.starCount < 5) e.starCount++;
    else if (e.starTier < 3) { e.starTier++; e.starCount = 1; }
    else if (e.grade === '신화' && e.starTier === 3) {
      e.starTier = 4;
    }
    return;
  }
}
function enhanceInfo(e) {
  const q = EQUIP[e.grade], steps = totalSteps(e);
  const cost = Math.floor(q.cost * (1 + steps * 0.45 + Math.pow(steps, 1.4) * 0.15));
  const base = Math.max(12, r1(100 - Math.min(88, q.fail + steps * 2.1)));
  return { cost, base, final: Math.min(100, r1(base + e.pityBonus)) };
}
// 1회 시도: 골드 차감 후 판정
function enhanceTry(kind) {
  const e = S.hero[kind], info = enhanceInfo(e);
  if (isMaxed(e) || S.hero.gold < info.cost) return null;
  S.hero.gold -= info.cost;
  const ok = Math.random() * 100 < info.final;
  let gain = 0;
  withHpDelta(() => {
    if (ok) { stepUp(e); e.pityBonus = 0; }
    else { gain = r1(Math.max(3.0, (100 - info.final) * 0.22)); e.pityBonus = Math.min(100, r1(e.pityBonus + gain)); }
  });
  save();
  return { ok, cost: info.cost, gain, pity: e.pityBonus, status: enhanceStatus(e) };
}

// --- 룬 ---
function synthRune(id, tier) {
  const a = S.hero.runeCounts[id];
  if (tier >= 8 || a[tier] < 3) return false;
  withHpDelta(() => { a[tier] -= 3; a[tier + 1]++; });
  save(); return true;
}
function synthAll() {
  let total = 0; const parts = [];
  withHpDelta(() => {
    for (const t of RUNE_TYPES) {
      const a = S.hero.runeCounts[t.id]; let hi = -1;
      for (let i = 0; i < 8; i++) { const n = Math.floor(a[i] / 3); if (n) { a[i] -= n * 3; a[i + 1] += n; total += n; hi = i + 1; } }
      if (hi >= 0) parts.push(`${t.icon} ${t.name} → ${RUNE_TIERS[hi].badge}`);
    }
  });
  save(); return { total, parts };
}
function grantRunes(n) {
  const got = {};
  for (let i = 0; i < n; i++) { const t = pick(RUNE_TYPES); S.hero.runeCounts[t.id][0]++; got[t.name] = (got[t.name] || 0) + 1; }
  return Object.entries(got).map(([k, v]) => `⚪ 일반 ${k} ×${v}`).join(', ');
}

// --- 도감 각인 ---
const engraveCost = (grade, lv) => Math.floor(CODEX_ENGRAVE_BASE[grade] * Math.pow(1.65, lv));
function engrave(cat, id) {
  const e = CODEX[cat].find(x => x.id === id), c = S.codex[cat][id];
  if (!c?.unlocked || c.engraveLv >= 10) return 'na';
  const cost = engraveCost(e.grade, c.engraveLv);
  if (S.hero.gold < cost) return cost;
  withHpDelta(() => { S.hero.gold -= cost; c.engraveLv++; });
  save(); return true;
}
function engraveAll() {
  let n = 0;
  for (; ;) {
    let best = null;
    for (const cat of Object.keys(CODEX)) for (const e of CODEX[cat]) {
      const c = S.codex[cat][e.id];
      if (!c?.unlocked || c.engraveLv >= 10) continue;
      const cost = engraveCost(e.grade, c.engraveLv);
      if (!best || cost < best.cost) best = { cat, id: e.id, cost };
    }
    if (!best || best.cost > S.hero.gold) break;
    engrave(best.cat, best.id); n++;
  }
  return n;
}
const codexTotal = () => Object.values(CODEX).reduce((n, a) => n + a.length, 0);
const codexCount = () => Object.keys(CODEX).reduce((n, cat) => n + CODEX[cat].filter(e => S.codex[cat][e.id]?.unlocked).length, 0);

// --- 유물 ---
function excavate(n) {
  if (RELICS.every(r => (S.relics[r.id] || 0) >= 100)) return { err: 'max' };
  const cost = n * 1000;
  if (S.hero.gold < cost) return { err: 'gold', cost };
  const lines = {}; let refund = 0;
  withHpDelta(() => {
    S.hero.gold -= cost;
    for (let i = 0; i < n; i++) {
      let r = Math.random() * 100, g = '일반';
      for (const [gr, p] of RELIC_RATES) { r -= p; if (r < 0) { g = gr; break; } }
      const rel = pick(RELICS.filter(x => x.grade === g)), lv = S.relics[rel.id] || 0;
      if (lv >= 100) { refund += 500; continue; }
      S.relics[rel.id] = lv + 1; lines[rel.id] = (lines[rel.id] || 0) + 1;
    }
    S.hero.gold += refund;
  });
  save();
  return { lines, refund };
}

// ===== 픽셀 아트: 몬스터 · 아이콘 · 배경 (직접 작성한 그리드/도형) =====
function grid(ctx, rows, pal, ox = 0, oy = 0, s = 1) {
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
    const c = pal[rows[y][x]]; if (!c) continue;
    ctx.fillStyle = c; ctx.fillRect(ox + x * s, oy + y * s, s, s);
  }
}
const R = (ctx, c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
function shadow(ctx, cx, cy, rx, ry) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function prep(cv, w, h) { cv.width = w; cv.height = h; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.clearRect(0, 0, w, h); return c; }

// --- 몬스터 (64x64 캔버스, 아트는 1px 단위) ---
const MON = {
  slime: {
    y: 38, pal: { O: '#05190d', r: '#10ac84', b: '#2ed573', H: '#a3ffcb', d: '#096638', Y: '#fffa65' }, rows: [
      '..........OOOOOOOOOOOO..........',
      '.......OOOrrrrrrrrrrrrOOO.......',
      '.....OOrrbbbbbbbbbbbbbbrrOO.....',
      '....OrrbbHHHbbbbbbbbbbbbbrrO....',
      '...OrbbHHHHbbbbbbbbbbbbbbbbrO...',
      '..OrbbbHHbbbbbbbbbbbbbbbbbbbrO..',
      '..ObbbbbbbbbbbbbbbbbbbbbbbbbbO..',
      '.ObbbbbbOOObbbbbbbbbOOObbbbbbbO.',
      '.ObbbbbbOYObbbbbbbbbOYObbbbbbbO.',
      '.ObbbbbbOOObbbbbbbbbOOObbbbbbbO.',
      '.ObbbbbbbbbbbbbbbbbbbbbbbbbbbbO.',
      '.ObbbbbbbbOOOOOOOOOOOObbbbbbbbO.',
      '.ObbbbbbbbbbOOOOOOOObbbbbbbbbbO.',
      '.OdbbbbbbbbbbbbbbbbbbbbbbbbbbdO.',
      '.OddddbbbbbbbbbbbbbbbbbbbbddddO.',
      '..OOddddddddddddddddddddddddOO..',
      '....OOOOOOOOOOOOOOOOOOOOOOOO....']
  },
  goblin: {
    y: 22, pal: { O: '#0b1406', g: '#558b2f', G: '#7cb342', r: '#ff4757', w: '#ffffff', k: '#1a0f08', t: '#5d4037', T: '#7a5548', s: '#b2bec3', h: '#6d4c41', B: '#3e2723' }, rows: [
      '..........OOOOOOOOOO............',
      'OO.......OGGGGGGGGGGO.......OO..',
      'OgOO....OGGGgggggggGGO....OOgO..',
      '.OggOO.OGgggggggggggggO.OOggO...',
      '..OgggOOgggrOgggggOrgggOOgggO...',
      '...OOgggggggOgggggOggggggOO.....',
      '.....OOgggggggggggggggggO.......',
      '.......OggkkkkkkkkkkggO.........',
      '.......OggkwkwkwkwkwggO.........',
      '........OOggggggggggOO..........',
      '.....s...OOtttttttOO............',
      '.....s..OggTtttttTggO...........',
      '.....s.OggOtttttttOggO..........',
      '.....s.OgOttttttttOOgO..........',
      '....hhhOgOtttttttttOgO..........',
      '.....h..OOtttttttttOO...........',
      '.........OggO..OggO.............',
      '.........OggO..OggO.............',
      '........OBBBO..OBBBO............',
      '........OOOOO..OOOOO............']
  },
  skeleton: {
    y: 18, pal: { O: '#101214', w: '#dfe6e9', W: '#ffffff', k: '#1e272e', r: '#ff4757', g: '#636e72', s: '#b2bec3', y: '#f5b942' }, rows: [
      '...........OOOOOOOO.............',
      '.........OOwwwwwwwwOO...........',
      '........OwwWWwwwwwwwwO..........',
      '........OwWkkkwwkkkwwO..........',
      '........OwwkrkwwkrkwwO..........',
      '........OwwkkkwwkkkwwO..........',
      '.........OwwwwkkwwwwO...........',
      '.........OwkwkwkwkwkO...........',
      '..........OOwwwwwwOO............',
      '.....s....OggOwwOggO............',
      '.....s...OgggOwwOgggO...........',
      '.....s...OOOwOwwOwOOO...........',
      '.....s.....OwwwwwwO.............',
      '.....s....OwOwwwwOwO............',
      '.....s.....OwwwwwwO.............',
      '.....s....OwOwwwwOwO............',
      '....yyy....OOwwwwOO.............',
      '.....k......OwOOwO..............',
      '............OwO.OwO.............',
      '............OwO.OwO.............',
      '...........OwwO.OwwO............',
      '...........OOOO.OOOO............']
  },
  bat: {
    y: 24, pal: { O: '#0e0a18', p: '#4b3869', P: '#6a5590', l: '#8c7ae6', r: '#ff4757', w: '#ffffff' }, rows: [
      '..........O.........O...........',
      '..........OO.......OO...........',
      'OOO.......OlO.....OlO.......OOO.',
      'OppOO.....OlllllllllO.....OOppO.',
      'OPpppOO..OllwlllllwllO..OOpppPO.',
      '.OPppppOOOlllllrlllllOOOppppPO..',
      '.OPPppppppOllllrllllOppppppPPO..',
      '..OPPpppppplllllllllppppppPPO...',
      '...OPPppppppOlllllOppppppPPO....',
      '....OOPpOpppOOlllOOpppOpPOO.....',
      '......OO.OpO..OOO..OpO.OO.......',
      '..........O.........O...........']
  },
  troll: {
    y: 12, pal: { O: '#03201c', t: '#009485', T: '#00b8a2', d: '#006358', r: '#ff4757', c: '#ffeaa7', b: '#6d4c41', B: '#4e342e', s: '#95a5a6' }, rows: [
      '...........OOOOOOOOO............',
      '.........OOTTTTTTTTTOO..........',
      '........OTTttttttttttTO.........',
      '........OTtrOttttttOrtO.........',
      '........OtttttttttttttO.........',
      '........OttcOOOOOOOcttO.........',
      '.........OtcttttttttcO..........',
      '.......OOOtttttttttttOOO........',
      '.....OOtttttttttttttttttOO......',
      '....OTttttttttttttttttttttO.....',
      '...OTtttOttttttttttttOtttttO....',
      '.sbOttttOttttttttttttOttttdO....',
      '.bbOtttOOttttttttttttOOtttdO....',
      '.sbOOtOO.OttttttttttO.OOtdO.....',
      '.bbOtOO..ObbbbbbbbbbO..OOO......',
      '.sbOO....OBbbbbbbbbBO...........',
      '.bb......OttttOOttttO...........',
      '.bb......OttttO.OtttO...........',
      '.bb......OttttO.OtttO...........',
      '.OO.....OddddO..OddddO..........',
      '........OOOOOO..OOOOOO..........']
  },
  lich: {
    y: 14, pal: { O: '#0b0614', p: '#4b2c78', P: '#6c40a8', k: '#160b26', c: '#4deeea', y: '#f5b942', b: '#6d4c41', w: '#ffffff', C: '#a0ffff' }, rows: [
      '..OOO.......OOOOOO..............',
      '.OCwCO....OOPPPPPPOO............',
      '.OcCcO...OPPppppppPPO...........',
      '..OOO...OPppkkkkkkppPO..........',
      '...b....OPpkkckkckkpPO..........',
      '...b....OPpkkkkkkkkpPO..........',
      '...b.....OppkkkkkkppO...........',
      '...b....OyyyyyyyyyyyyO..........',
      '...b...OPppppppppppppPO.........',
      '...b..OPppppppppppppppPO........',
      '...b.OPpppOppppppppOppppO.......',
      '...bOOppppOppppppppOppppO.......',
      '...bkkOpppOppppppppOpppO........',
      '...b..OpppppppppppppppPO........',
      '...b..OPpppppppppppppppPO.......',
      '...b.OPpppppppppppppppppPO......',
      '...b.OPpppppppppppppppppPO......',
      '...bOPpppppppppppppppppppPO.....',
      '...OPpPpPpPpPpPpPpPpPpPpPpO.....',
      '....OOOOOOOOOOOOOOOOOOOOOO......']
  },
  golem: {
    y: 12, pal: { O: '#101216', g: '#57606f', G: '#7a8494', d: '#3b4250', o: '#ff7924', y: '#fffa65' }, rows: [
      '...........OOOOOOOOOO...........',
      '..........OGGGGGGGGGGO..........',
      '..........OGgggggggggO..........',
      '..........OgoyogggoyoO..........',
      '..........OggggoooggdO..........',
      '.....OOOOOOOggggggggOOOOOOO.....',
      '....OGGGGGGOOOOOOOOOGGGGGGGO....',
      '...OGgggggggggggggggggggggdO....',
      '...OgggggOgggooyoogggOgggggdO...',
      '...OgggggOggoyyyyyogOggggdddO...',
      '...OggggdOgggooyoogggOgggddO....',
      '...OOgggdOggggggggggggOggdOO....',
      '...OGgggOOgggggggggggOOgggdO....',
      '...OGggdO.OddddddddddO.OggdO....',
      '...OOOOO..OggggOOggggO..OOOO....',
      '..........OggggO.OgggO..........',
      '..........OggggO.OgggO..........',
      '.........OddddO..OddddO.........',
      '.........OOOOOO..OOOOOO.........']
  },
};
// 드래곤(보스): 주인공 쪽(왼쪽)을 보는 용, 64x64 꽉 채움
const DRAGON = [
  '..........................OO.........OO.......................',
  '.........................OwwO.......OwwO......................',
  '........................OwWWwO.....OwWWwO.....................',
  '.......................OwWWWWwOOOOOwWWWWwO....................',
  '......................OwWWWWWWwwwwwWWWWWWwO...................',
  '.....................OwWWWWWWWWWWWWWWWWWWWwO..................',
  '..........OO........OwWWWWWWWWWWWWWWWWWWWWWwO.................',
  '.........OGGO......OwWWWWWWWWWWWWWWWWWWWWWWWwO................',
  '........OGgO.......OwWWWWWWWWWWWWWWWWWWWWWWWWwO...............',
  '.......OGgO.OOOO..OwWWWWOWWWWWWWWOWWWWWWWWWWWWwO..............',
  '......OGgOOOccccOOwWWWWO.OWWWWWWO.OWWWWWWWWWWWwO..............',
  '......OgOOccccccccOwWWO...OWWWWO...OWWWWWWWWWWWO..............',
  '.....OOOccccCCCCcccOwO.....OWWO.....OWWWWWWWWWO...............',
  '...OOccccCCCCCCCCccOO.......OO.......OWWWWWWWO................',
  '.OOcYYcCCCCCCCCCCCcO.................OWWWWWO..................',
  'OccYRYcCCCCCCCCCCCCcO.................OWWWO...................',
  'OcccccCCCCCCCCCCCCCCcO.................OOO....................',
  '.OkOkOkcCCCCCCCCCCCCcO........................................',
  '..OwOwOOCCCCCCCCCCCCcO........................................',
  '...O.O..OcCCCCCCCCCCcO........................................',
  '.........OcCCCCCCCCCCcOOOOO...................................',
  '.........OcCCbbbbbbCCCcccccOOO................................',
  '..........OcCbbbBBbbbCCCCCCcccOO..............................',
  '..........OcCbbBBBBbbCCCCCCCCCccOO............................',
  '..........OcCbbBBBBbbCCCCCCCCCCCccO...........................',
  '.........OcCCbbbBBbbbCCCCCCCCCCCCCcO..........................',
  '........OccOCbbbbbbbCCCCCCCCCCCCCCcO.......OOO................',
  '.......OcCO.OCbbbbbCCCCOCCCCCCCCCCcO.....OOcccO...............',
  '......OcCCO..OCCCCCCCCO.OCCCCCCCCccO...OOccCCcO...............',
  '......OGOGO..OCCCCCCCO...OCCCCCCccOOOOOccCCCcO................',
  '..............OCCCCCO.....OcCCCCcccccccCCCccO.................',
  '..............OcCCCcO.....OcCCCCCCCCCCCCccOO..................',
  '.............OccCCccO....OccCCCcOOOOOOOOOO....................',
  '............OGOGOGOGO...OGOGOGOGO.............................',
  '............OOOOOOOOO...OOOOOOOOO.............................'];
function drawDragon(ctx) {
  shadow(ctx, 30, 61, 26, 4);
  grid(ctx, DRAGON, { O: '#090406', w: '#45202c', W: '#2a121a', c: '#5e0f18', C: '#8b1824', b: '#ff7924', B: '#ffeaa7', G: '#f5b942', g: '#ff7924', Y: '#fffa65', R: '#ff4757', k: '#090406' }, 1, 26);
  // 불꽃 숨결이 새어 나오는 입
  R(ctx, '#ff4757', 0, 42, 2, 2); R(ctx, '#ff9f43', 0, 43, 1, 1);
}
function drawMonster(cv, type, isBoss) {
  const ctx = prep(cv, 64, 64);
  if (type === 'raid_hydra') {
    shadow(ctx, 32, 60, 24, 4);
    R(ctx, '#0b2626', 14, 34, 36, 24); R(ctx, '#00cec9', 16, 36, 32, 20); R(ctx, '#4deeea', 20, 40, 24, 12);
    R(ctx, '#0b2626', 8, 14, 12, 22); R(ctx, '#00cec9', 9, 12, 10, 10); R(ctx, '#ff4757', 10, 15, 3, 2); R(ctx, '#badc58', 6, 17, 4, 3);
    R(ctx, '#0b2626', 26, 8, 12, 28); R(ctx, '#00cec9', 27, 6, 10, 12); R(ctx, '#ff4757', 28, 9, 3, 2); R(ctx, '#ff4757', 33, 9, 3, 2); R(ctx, '#badc58', 29, 13, 6, 4);
    R(ctx, '#0b2626', 44, 14, 12, 22); R(ctx, '#00cec9', 45, 12, 10, 10); R(ctx, '#ff4757', 51, 15, 3, 2); R(ctx, '#badc58', 54, 17, 4, 3);
    return;
  }
  if (type === 'raid_archangel') {
    shadow(ctx, 32, 60, 20, 4);
    R(ctx, '#14071c', 2, 16, 20, 32); R(ctx, '#2d1040', 4, 18, 16, 26);
    R(ctx, '#14071c', 42, 16, 20, 32); R(ctx, '#2d1040', 44, 18, 16, 26);
    R(ctx, '#8b1824', 24, 6, 16, 4); R(ctx, '#ff4757', 26, 7, 12, 2);
    R(ctx, '#2d3436', 24, 14, 16, 42); R(ctx, '#dfe6e9', 26, 16, 12, 38);
    R(ctx, '#f5b942', 28, 20, 8, 10); R(ctx, '#ff4757', 29, 23, 2, 3); R(ctx, '#ff4757', 33, 23, 2, 3);
    R(ctx, '#ffd073', 48, 8, 4, 48); R(ctx, '#ff4757', 49, 10, 2, 42);
    return;
  }
  if (type === 'raid_void_dragon') {
    shadow(ctx, 32, 61, 28, 4);
    grid(ctx, DRAGON, { O: '#090406', w: '#2a123a', W: '#1a0826', c: '#4b2c78', C: '#6c40a8', b: '#a55eea', B: '#f5c8ff', G: '#ff5e97', g: '#c56cf0', Y: '#4deeea', R: '#ff5e97', k: '#090406' }, 1, 26);
    R(ctx, '#ff5e97', 24, 40, 6, 6); R(ctx, '#4deeea', 25, 41, 4, 4); R(ctx, '#fff', 26, 42, 2, 2);
    return;
  }
  if (isBoss || type === 'boss') return drawDragon(ctx);
  const m = MON[type] || MON.golem;
  shadow(ctx, 32, 58, 16, 4);
  if (m.draw) return m.draw(ctx);
  const h = m.rows.length;
  grid(ctx, m.rows, m.pal, 16, Math.min(m.y, 57 - h), 1);
}

// 펫 픽셀 드로잉 (32x32)
function drawPet(cv, petId) {
  if (!cv || !petId) return;
  const ctx = prep(cv, 32, 32);
  const p = PET_BY_ID[petId];
  if (!p) return;
  shadow(ctx, 16, 29, 10, 3);
  const t = Math.sin(Date.now() / 260) * 2;
  const py = 12 + t;
  if (petId === 'slime') {
    R(ctx, '#0b3d1e', 8, py, 16, 12); R(ctx, '#2ed573', 9, py + 1, 14, 10);
    R(ctx, '#badc58', 11, py + 2, 4, 3); R(ctx, '#000', 11, py + 5, 2, 3); R(ctx, '#000', 17, py + 5, 2, 3);
    R(ctx, '#fff', 11, py + 5, 1, 1); R(ctx, '#fff', 17, py + 5, 1, 1);
  } else if (petId === 'bat') {
    R(ctx, '#220835', 6, py - 2, 20, 14); R(ctx, '#a55eea', 10, py, 12, 10);
    R(ctx, '#fffa65', 12, py + 3, 2, 2); R(ctx, '#fffa65', 16, py + 3, 2, 2);
    R(ctx, '#fff', 13, py + 7, 1, 2); R(ctx, '#fff', 16, py + 7, 1, 2);
  } else if (petId === 'baby_dragon') {
    R(ctx, '#8b1824', 8, py - 4, 16, 16); R(ctx, '#ff7924', 9, py - 3, 14, 14);
    R(ctx, '#ffeaa7', 11, py + 3, 10, 6); R(ctx, '#ff4757', 12, py + 2, 2, 2); R(ctx, '#ff4757', 16, py + 2, 2, 2);
  } else if (petId === 'frost_wolf') {
    R(ctx, '#192a56', 7, py - 3, 18, 15); R(ctx, '#00cec9', 8, py - 2, 16, 13);
    R(ctx, '#ffffff', 10, py + 2, 4, 3); R(ctx, '#ffffff', 16, py + 2, 4, 3);
    R(ctx, '#0984e3', 11, py + 3, 2, 2); R(ctx, '#0984e3', 17, py + 3, 2, 2);
  } else if (petId === 'thunder_beast') {
    R(ctx, '#8c5b0b', 8, py - 4, 16, 16); R(ctx, '#f5b942', 9, py - 3, 14, 14);
    R(ctx, '#4deeea', 10, py - 6, 2, 4); R(ctx, '#4deeea', 18, py - 6, 2, 4);
    R(ctx, '#000', 12, py + 3, 2, 2); R(ctx, '#000', 16, py + 3, 2, 2);
  } else if (petId === 'forest_fairy') {
    R(ctx, '#2ed573', 4, py - 2, 24, 10); R(ctx, '#badc58', 11, py - 2, 10, 14);
    R(ctx, '#ffffff', 13, py + 2, 2, 2); R(ctx, '#ffffff', 17, py + 2, 2, 2);
  } else if (petId === 'phoenix') {
    R(ctx, '#ff4757', 4, py - 4, 24, 16); R(ctx, '#f5b942', 9, py - 2, 14, 12);
    R(ctx, '#fffa65', 12, py, 8, 8); R(ctx, '#ff5e97', 6, py + 10, 20, 4);
  } else if (petId === 'cerberus') {
    R(ctx, '#160b26', 4, py - 2, 24, 14); R(ctx, '#ff4757', 6, py, 6, 8);
    R(ctx, '#ff4757', 13, py - 2, 6, 8); R(ctx, '#ff4757', 20, py, 6, 8);
    R(ctx, '#fffa65', 7, py + 2, 2, 2); R(ctx, '#fffa65', 15, py, 2, 2); R(ctx, '#fffa65', 22, py + 2, 2, 2);
  }
}

// --- 검 아이콘 (32x32) ---
const SWORD_STYLE = [
  null,
  { edge: '#ffffff', body: '#b2bec3', shade: '#636e72', guard: '#d4a359', gem: '#d4a359', grip: '#6d4c41', w: 2 },
  { edge: '#ffffff', body: '#4deeea', shade: '#0097e6', guard: '#4deeea', gem: '#a0ffff', grip: '#1e3a5f', w: 2, notch: true, spark: ['#a0ffff'] },
  { edge: '#f5c8ff', body: '#a55eea', shade: '#6c2fa2', guard: '#4b2c78', gem: '#ff5e97', grip: '#2d1b40', w: 2, wave: true, spark: ['#ff5e97', '#f5c8ff'] },
  { edge: '#ffeaa7', body: '#ffeaa7', shade: '#ff7924', guard: '#f5b942', gem: '#ff4757', grip: '#6d4c41', w: 3, spike: true, spark: ['#fffa65', '#ff9f43'] },
  { edge: '#ffffff', body: '#4deeea', shade: '#a55eea', guard: '#4deeea', guard2: '#ff5e97', gem: '#ffeaa7', grip: '#2f3542', w: 3, multi: true, spark: ['#ffffff', '#4deeea', '#ff5e97'] },
  { edge: '#fffa65', body: '#ff4757', shade: '#8b1824', guard: '#3d3d46', gem: '#f5b942', grip: '#1e1e24', w: 3 },
];
function drawSwordIcon(cv, rank) {
  const ctx = prep(cv, 32, 32), O = '#0b0c10';
  if (!rank) { ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 1; ctx.strokeRect(14.5, 3.5, 3, 18); ctx.strokeRect(9.5, 21.5, 13, 2); ctx.strokeRect(14.5, 24.5, 3, 5); return; }
  const s = SWORD_STYLE[Math.min(6, rank)], bw = s.w, bx = 16 - Math.ceil(bw / 2);
  R(ctx, O, bx - 1, 2, bw + 2, 21);
  for (let y = 3; y < 22; y++) {
    const off = s.wave ? ((y >> 1) % 2 ? 1 : 0) : 0;
    R(ctx, s.multi ? ['#4deeea', '#ff5e97', '#a55eea', '#ffeaa7'][y % 4] : s.body, bx + off, y, bw, 1);
    R(ctx, s.shade, bx + bw - 1 + off, y, 1, 1);
    R(ctx, s.edge, bx + off, y, 1, 1);
  }
  R(ctx, s.edge, bx, 2, bw, 1);
  if (s.notch) { R(ctx, O, bx - 2, 9, 1, 2); R(ctx, O, bx + bw + 1, 13, 1, 2); }
  if (s.spike) { R(ctx, s.shade, bx - 2, 12, 2, 2); R(ctx, s.shade, bx + bw, 12, 2, 2); }
  R(ctx, O, 8, 21, 16, 4); R(ctx, s.guard, 9, 22, 7, 2); R(ctx, s.guard2 || s.guard, 16, 22, 7, 2); R(ctx, s.gem, 15, 22, 2, 2);
  if (s.multi) { R(ctx, s.guard, 6, 20, 3, 2); R(ctx, s.guard2, 23, 20, 3, 2); }
  R(ctx, O, 14, 25, 4, 5); R(ctx, s.grip, 15, 25, 2, 4); R(ctx, s.gem === s.guard ? '#d4a359' : s.guard, 15, 29, 2, 2);
  (s.spark || []).forEach((c, i) => { R(ctx, c, [7, 24, 10, 22][i % 4], [6, 9, 15, 4][i % 4], 1, 1); R(ctx, c, [24, 6][i % 2], [16, 12][i % 2], 1, 1); });
}

// --- 갑옷 아이콘 (32x32): 하나의 템플릿, 등급별 색 ---
const ARMOR_ROWS = [
  '...OOOO..........OOOO...',
  '..OsssmO........OmsssO..',
  '.OsmmmmmOOOOOOOOmmmmmsO.',
  '.OsmmmmmhmmmmmmhmmmmmsO.',
  '.OOsmmmhhmmmmmmhhmmmsOO.',
  '..OOsmmhmmmggmmmhmmsOO..',
  '...OsmmmmmmggmmmmmmsO...',
  '...OsmmmmmmmmmmmmmmsO...',
  '...OssmmmmmmmmmmmmssO...',
  '...OsmmmmmmmmmmmmmmsO...',
  '...OsmmmmmmmmmmmmmmsO...',
  '...OssmmmmmmmmmmmmssO...',
  '....OsmmmmmmmmmmmmsO....',
  '....OssssmmmmmmssssO....',
  '....OsmmmmmmmmmmmmsO....',
  '.....OOOOOOOOOOOOOO.....'];
const ARMOR_PAL = [null,
  { O: '#1a0f08', s: '#4a3222', m: '#7c5338', h: '#b07d56', g: '#d4a359' },
  { O: '#11141a', s: '#3b4354', m: '#647287', h: '#c8d6e5', g: '#4deeea' },
  { O: '#120b1e', s: '#4b3869', m: '#8c7ae6', h: '#f5f6fa', g: '#ff5e97' },
  { O: '#1e0505', s: '#6e1414', m: '#c23616', h: '#f5b942', g: '#fffa65' },
  { O: '#2a1a05', s: '#c28b22', m: '#f5b942', h: '#ffffff', g: '#4deeea' },
  { O: '#050607', s: '#1e272e', m: '#485460', h: '#ff4757', g: '#f5b942' }];
function drawArmorIcon(cv, rank) {
  const ctx = prep(cv, 32, 32);
  if (!rank) { grid(ctx, ARMOR_ROWS, { O: '#2f3542' }, 4, 8); return; }
  grid(ctx, ARMOR_ROWS, ARMOR_PAL[Math.min(6, rank)], 4, 8);
  if (rank >= 4) { const h = ARMOR_PAL[Math.min(6, rank)].h; R(ctx, h, 7, 11, 1, 3); R(ctx, h, 24, 11, 1, 3); }
}

// --- 스킬 아이콘 (32x32): 이름 키워드로 분류 ---
const has = (n, ks) => ks.some(k => n.includes(k));
function skillKind(n) {
  if (has(n, ['화염', '용염', '메테오'])) return 'fire';
  if (has(n, ['얼음', '서리', '빙결', '절대영도'])) return 'ice';
  if (has(n, ['번개', '전격', '뇌신', '뇌창'])) return 'bolt';
  if (has(n, ['맹독'])) return 'poison';
  if (has(n, ['대지', '바위'])) return 'earth';
  if (has(n, ['질풍', '선풍', '수류'])) return n.includes('수류') ? 'water' : 'wind';
  if (has(n, ['암흑', '심연', '영혼'])) return 'dark';
  if (has(n, ['심판', '성광', '창세'])) return 'holy';
  if (has(n, ['차원', '종말', '신살', '시공'])) return n.includes('신살') ? 'blood' : 'void';
  return 'plain';
}
function drawSkillIcon(cv, name, grade = '일반') {
  const ctx = prep(cv, 32, 32), k = skillKind(name), O = '#0b0c10';
  if (SKILL_ICON_MOD[name]) return SKILL_ICON_MOD[name](ctx);
  const disc = (cx, cy, r, c) => { ctx.fillStyle = c; for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); ctx.fillRect(cx - w, cy + y, w * 2, 1); } };
  if (k === 'fire') { disc(16, 19, 9, '#7a0f0f'); disc(16, 19, 8, '#ff4757'); disc(16, 20, 6, '#ff9f43'); disc(16, 21, 4, '#ffeaa7'); disc(16, 22, 2, '#ffffff'); for (let i = 0; i < 9; i++) R(ctx, i < 3 ? '#7a0f0f' : '#ff4757', 15 - (i >> 2), 4 + i, 3 + (i >> 1), 1); }
  else if (k === 'ice') { R(ctx, '#192a56', 14, 2, 4, 28); R(ctx, '#192a56', 4, 14, 24, 4); R(ctx, '#0097e6', 15, 3, 2, 26); R(ctx, '#0097e6', 5, 15, 22, 2); R(ctx, '#4deeea', 15, 6, 2, 20); R(ctx, '#4deeea', 8, 15, 16, 2); R(ctx, '#ffffff', 16, 8, 1, 16); for (const [x, y] of [[9, 9], [22, 9], [9, 22], [22, 22]]) R(ctx, '#4deeea', x, y, 2, 2); }
  else if (k === 'bolt') { const pts = [[18, 2], [10, 16], [16, 16], [12, 30], [24, 12], [17, 12], [22, 2]]; ctx.fillStyle = '#192a56'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill(); ctx.fillStyle = '#f5b942'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x + (x < 16 ? 1 : -1), y + (y < 16 ? 1 : -1)) : ctx.moveTo(x, y + 1)); ctx.fill(); R(ctx, '#ffffff', 17, 6, 1, 4); R(ctx, '#ffffff', 15, 18, 1, 4); }
  else if (k === 'poison') { disc(16, 18, 10, '#0b3d1e'); disc(16, 18, 9, '#10ac84'); disc(15, 16, 6, '#2ed573'); R(ctx, O, 11, 16, 3, 3); R(ctx, O, 18, 16, 3, 3); R(ctx, O, 12, 22, 8, 2); disc(9, 6, 2, '#badc58'); disc(20, 4, 1, '#badc58'); disc(24, 8, 2, '#badc58'); }
  else if (k === 'earth') { disc(16, 17, 12, '#3e2723'); disc(16, 17, 11, '#5d4037'); disc(13, 13, 6, '#8d6e63'); R(ctx, '#ff7924', 12, 16, 9, 2); R(ctx, '#ff7924', 19, 18, 2, 6); R(ctx, '#fffa65', 14, 16, 4, 1); }
  else if (k === 'wind' || k === 'water') { const cs = k === 'wind' ? ['#0b3d1e', '#2ed573', '#badc58'] : ['#192a56', '#0984e3', '#4deeea']; for (let i = 0; i < 3; i++) { const y = 8 + i * 7, x = 4 + (i % 2) * 4; R(ctx, cs[0], x, y, 22, 4); R(ctx, cs[1], x + 1, y + 1, 20, 2); R(ctx, cs[2], x + 4, y + 1, 10, 1); R(ctx, cs[1], x + 20, y - 2, 2, 3); } }
  else if (k === 'dark') { disc(16, 16, 12, '#220835'); disc(16, 16, 11, '#6c2fa2'); disc(16, 16, 9, '#a55eea'); disc(20, 13, 9, '#0b0712'); R(ctx, '#ff5e97', 6, 14, 1, 6); R(ctx, '#ff5e97', 8, 22, 3, 1); }
  else if (k === 'holy') { R(ctx, '#1a1406', 4, 4, 24, 24); R(ctx, '#f39c12', 13, 5, 6, 22); R(ctx, '#f39c12', 5, 13, 22, 6); R(ctx, '#fffa65', 14, 6, 4, 20); R(ctx, '#fffa65', 6, 14, 20, 4); R(ctx, '#ffffff', 15, 8, 2, 16); R(ctx, '#ffffff', 8, 15, 16, 2); }
  else if (k === 'void' || k === 'blood') { R(ctx, k === 'blood' ? '#3a0710' : '#120826', 4, 4, 24, 24); R(ctx, '#a55eea', 5, 5, 22, 1); const c = k === 'blood' ? '#ff4757' : '#4deeea'; for (let i = 0; i < 20; i++) { R(ctx, c, 6 + i, 25 - i, 2, 2); if (i % 3 === 0) R(ctx, '#ff5e97', 7 + i, 27 - i, 1, 1); } R(ctx, '#ffffff', 15, 15, 2, 2); R(ctx, '#ffffff', 22, 8, 1, 1); }
  else { const p = { '일반': ['#636e72', '#dfe6e9'], '희귀': ['#0984e3', '#a0ffff'], '영웅': ['#6c2fa2', '#f5c8ff'], '전설': ['#d63031', '#ffeaa7'], '신화': ['#a55eea', '#ffffff'] }[grade] || ['#636e72', '#dfe6e9']; R(ctx, p[0], 9, 9, 14, 14); R(ctx, p[1], 13, 13, 6, 6); }
}

// --- 유물 아이콘 ---
function drawRelicIcon(cv, id) {
  const ctx = prep(cv, 32, 32), O = '#0b0c10';
  const box = (c, x, y, w, h) => { R(ctx, O, x - 1, y - 1, w + 2, h + 2); R(ctx, c, x, y, w, h); };
  switch (id) {
    case 'whetstone': box('#7f8c8d', 6, 12, 20, 8); R(ctx, '#b2bec3', 7, 13, 18, 2); break;
    case 'shield_crest': box('#cd7f32', 9, 6, 14, 18); R(ctx, '#f5b942', 10, 7, 12, 3); R(ctx, '#ffffff', 15, 9, 2, 13); R(ctx, O, 12, 24, 8, 2); R(ctx, '#cd7f32', 13, 24, 6, 1); break;
    case 'chalice': box('#f5b942', 8, 6, 16, 9); R(ctx, '#4deeea', 9, 7, 14, 4); R(ctx, '#f5b942', 14, 15, 4, 8); box('#f5b942', 10, 23, 12, 3); break;
    case 'gold_coin': box('#f5b942', 8, 8, 16, 16); R(ctx, '#c28b22', 14, 10, 4, 12); R(ctx, '#ffeaa7', 10, 10, 2, 2); break;
    case 'clover': for (const [x, y] of [[9, 7], [17, 7], [9, 15], [17, 15]]) box('#2ed573', x, y, 6, 6); R(ctx, '#10ac84', 15, 21, 2, 7); break;
    case 'crimson_dagger': box('#ff4757', 15, 4, 3, 16); R(ctx, '#ffb3b8', 15, 5, 1, 14); box('#f5b942', 10, 20, 13, 2); box('#6d4c41', 15, 23, 3, 5); break;
    case 'mana_orb': box('#6c2fa2', 8, 8, 16, 16); R(ctx, '#a55eea', 9, 9, 14, 14); R(ctx, '#f5c8ff', 11, 11, 4, 4); R(ctx, '#ffffff', 12, 12, 2, 2); break;
    case 'dragon_seal': box('#8b1824', 7, 7, 18, 18); R(ctx, '#f5b942', 11, 11, 10, 10); R(ctx, '#fffa65', 14, 14, 4, 4); break;
    case 'phoenix_feather': for (let i = 0; i < 14; i++) { R(ctx, i % 2 ? '#ff7924' : '#ffeaa7', 9 + i, 22 - i, 5, 3); } R(ctx, '#ffffff', 8, 24, 10, 1); break;
    case 'chronos_hourglass': box('#f5b942', 8, 4, 16, 3); box('#f5b942', 8, 25, 16, 3); R(ctx, '#2f3542', 10, 7, 12, 18); R(ctx, '#4deeea', 12, 8, 8, 5); R(ctx, '#4deeea', 15, 13, 2, 5); R(ctx, '#ff5e97', 11, 20, 10, 4); break;
  }
}
// 장비 아이콘 공통
function drawItemIcon(cv, kind, grade, name) {
  if (name && ITEM_ICON_MOD[name]) return ITEM_ICON_MOD[name](prep(cv, 32, 32));
  if (kind === 'sword') return drawSwordIcon(cv, rankOf(grade));
  if (kind === 'armor') return drawArmorIcon(cv, rankOf(grade));
  return drawSkillIcon(cv, name, grade);
}

// --- 배경 ---
function drawTitleBackdrop(cv) {
  const ctx = prep(cv, 320, 200);
  const g = ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, '#070912'); g.addColorStop(0.55, '#151a2e'); g.addColorStop(1, '#0b0d14');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 320, 200);
  ctx.fillStyle = '#ffeaa7'; ctx.beginPath(); ctx.arc(245, 42, 18, 0, 7); ctx.fill();
  ctx.fillStyle = '#151a2e'; ctx.beginPath(); ctx.arc(252, 38, 16, 0, 7); ctx.fill();
  for (const [x, y] of [[30, 20], [75, 35], [120, 15], [180, 28], [285, 22], [50, 60]]) R(ctx, '#ffffff', x, y, 2, 2);
  const K = '#121624';
  R(ctx, K, 105, 65, 110, 95); R(ctx, K, 120, 42, 26, 30); R(ctx, K, 174, 42, 26, 30); R(ctx, K, 148, 28, 24, 42);
  for (let x = 105; x < 215; x += 10) R(ctx, '#080a10', x, 62, 6, 4);
  R(ctx, '#ff7924', 130, 52, 4, 6); R(ctx, '#ff7924', 184, 52, 4, 6); R(ctx, '#ff7924', 158, 38, 4, 7);
  R(ctx, '#191c26', 0, 148, 320, 52);
  for (let row = 0, y = 152; y < 200; y += 12, row++) for (let x = row % 2 ? -12 : 0; x < 320; x += 26) R(ctx, '#262b3b', x, y, 22, 8);
  for (const x of [52, 268]) { R(ctx, '#3c4256', x - 6, 95, 12, 55); R(ctx, '#ff4757', x - 5, 84, 10, 11); R(ctx, '#fffa65', x - 3, 86, 6, 7); }
}
function drawBattleBackdrop(cv, stage) {
  const ctx = prep(cv, 320, 180), boss = stage % 10 === 0, mile = !boss && stage >= 50;
  const g = ctx.createLinearGradient(0, 0, 0, 180);
  const wc = !boss && curWorld().colors, C = wc || {};
  const cs = boss ? ['#1d070b', '#2c0d14', '#0b0709'] : wc ? wc.sky : mile ? ['#120822', '#1f1136', '#0a0712'] : ['#0b0e17', '#171c2b', '#090b10'];
  g.addColorStop(0, cs[0]); g.addColorStop(0.6, cs[1]); g.addColorStop(1, cs[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, 320, 180);
  for (let x = 8; x < 320; x += 64) {
    R(ctx, boss ? '#240a0e' : C.pillar || '#121622', x, 15, 22, 115); R(ctx, boss ? '#3a1017' : C.pillarHi || '#1d2336', x + 3, 15, 4, 115);
    R(ctx, boss ? '#ff4757' : C.torch || (mile ? '#c56cf0' : '#ff9f43'), x + 9, 46, 4, 6); R(ctx, '#fffa65', x + 10, 47, 2, 3);
  }
  R(ctx, boss ? '#1c0b0e' : C.floor || '#161a24', 0, 128, 320, 52);
  for (let row = 0, y = 132; y < 180; y += 10, row++) for (let x = row % 2 ? -14 : 0; x < 320; x += 28) R(ctx, boss ? '#2e1217' : C.brick || '#222736', x, y, 24, 7);
}
function drawForgeBackdrop(cv) {
  const ctx = prep(cv, 320, 200);
  R(ctx, '#0e0b14', 0, 0, 320, 200); R(ctx, '#261a24', 105, 115, 110, 55);
  R(ctx, '#ff4757', 120, 128, 80, 26); R(ctx, '#ff9f43', 130, 132, 60, 18); R(ctx, '#ffeaa7', 142, 136, 36, 10);
  R(ctx, '#191c26', 0, 165, 320, 35);
  R(ctx, '#3c4256', 125, 148, 70, 10); R(ctx, '#3c4256', 138, 158, 44, 12); R(ctx, '#3c4256', 120, 170, 80, 8);
}

// ===== 주인공: 제공된 스프라이트 시트에서 잘라낸 아틀라스로 애니메이션 =====
// HERO_ATLAS = { cellW, cellH, anims: { 'idle_right': [[x,y,w,h],...], ... } }, HERO_ATLAS_URI = 스프라이트 시트 PNG 경로 (assets/hero_atlas.png)
const heroImg = new Image();
let heroReady = false;
const heroViews = new Set();
heroImg.onload = () => { heroReady = true; heroViews.forEach(v => v.draw()); };
heroImg.onerror = () => {
  console.warn('[hero] 아틀라스 이미지(assets/hero_atlas.png) 로드 지연 또는 실패: 절차적 픽셀 도트 렌더러로 안전 전환됩니다.');
  heroReady = false;
  heroViews.forEach(v => v.draw());
};
heroImg.src = HERO_ATLAS_URI;

const HERO_FPS = { idle: 5, walk: 8, run: 12, attack: 16, guard: 6, hit: 14, death: 8, skill: 16 };
class HeroView {
  constructor(cv, dir = 'right', still = false) {
    this.still = still; this.cv = cv; this.dir = dir; this.anim = 'idle'; this.t = 0; this.loop = true; this.onEnd = null; this.hold = false;
    cv.width = HERO_ATLAS.cellW; cv.height = HERO_ATLAS.cellH;
    this.ctx = cv.getContext('2d'); this.ctx.imageSmoothingEnabled = false;
    heroViews.add(this); this.draw();
  }
  frames() { return HERO_ATLAS.anims[this.anim + '_' + this.dir] || HERO_ATLAS.anims['idle_' + this.dir]; }
  // anim 재생. loop=false면 마지막 프레임 후 onEnd 호출(hold=true면 마지막 프레임 유지)
  play(anim, { loop = false, onEnd = null, hold = false } = {}) {
    this.anim = anim; this.t = 0; this.loop = loop; this.onEnd = onEnd; this.hold = hold; this.draw();
  }
  idle() { this.play('idle', { loop: true }); }
  step(dt) {
    if (this.still) return;
    if (!this.cv.isConnected || !this.cv.offsetParent) return;
    const n = this.frames().length, before = Math.floor(this.t * HERO_FPS[this.anim]);
    this.t += dt;
    let f = Math.floor(this.t * HERO_FPS[this.anim]);
    if (!this.loop && f >= n) {
      if (this.hold) { this.t = (n - 0.001) / HERO_FPS[this.anim]; f = n - 1; }
      const cb = this.onEnd; this.onEnd = null;
      if (!this.hold) { this.idle(); f = 0; }
      if (cb) cb();
    }
    if (f !== before) this.draw();
  }
  draw() {
    if (!heroReady) {
      const cw = HERO_ATLAS.cellW || 87, ch = HERO_ATLAS.cellH || 93;
      this.ctx.clearRect(0, 0, cw, ch);
      drawFallbackHero(this.ctx, cw, ch, this.dir, this.anim, this.t);
      return;
    }
    const fr = this.frames(), n = fr.length;
    let i = Math.floor(this.t * HERO_FPS[this.anim]);
    i = this.loop ? i % n : Math.min(n - 1, i);
    const [x, y, w, h] = fr[i];
    this.ctx.clearRect(0, 0, w, h);

    const c = S.hero?.costumes;
    // 발밑 마법진 (Circle)
    if (c && c.circle && c.circle !== 'circle_none') {
      const col = c.circle === 'circle_rune' ? '#4deeea' : c.circle === 'circle_flame' ? '#ff4757' : '#c56cf0';
      const angle = (Date.now() / 600) % (Math.PI * 2);
      this.ctx.save();
      this.ctx.translate(w / 2, h - 8);
      this.ctx.scale(1, 0.35);
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.rotate(angle);
      this.ctx.strokeRect(-16, -16, 32, 32);
      this.ctx.restore();
    }

    this.ctx.drawImage(heroImg, x, y, w, h, 0, 0, w, h);

    // 스킨 틴트
    if (c && c.skin && c.skin !== 'skin_default') {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'source-atop';
      const skinCol = {
        skin_dark_knight: 'rgba(34, 15, 55, 0.38)',
        skin_paladin: 'rgba(235, 240, 255, 0.30)',
        skin_blood_slayer: 'rgba(215, 30, 45, 0.38)',
        skin_celestial: 'rgba(255, 230, 120, 0.35)',
      }[c.skin];
      if (skinCol) {
        this.ctx.fillStyle = skinCol;
        this.ctx.fillRect(0, 0, w, h);
      }
      this.ctx.restore();
    }

    // 무기 오라
    if (c && c.aura && c.aura !== 'aura_none') {
      const auraCol = {
        aura_fire: '#ff7924', aura_frost: '#a0ffff', aura_holy: '#fffa65', aura_void: '#ff5e97'
      }[c.aura];
      if (auraCol) {
        const t2 = Date.now() / 250;
        this.ctx.fillStyle = auraCol;
        for (let k = 0; k < 4; k++) {
          const px = (w / 2 + 10) + Math.sin(t2 + k * 1.5) * 8;
          const py = (h / 2 - 4) + Math.cos(t2 * 1.3 + k) * 12;
          this.ctx.fillRect(px, py, 2, 2);
        }
      }
    }
  }
}
let heroLast = 0;
function heroTick(now) {
  const dt = Math.min(0.1, (now - (heroLast || now)) / 1000); heroLast = now;
  heroViews.forEach(v => v.step(dt));
  requestAnimationFrame(heroTick);
}
requestAnimationFrame(heroTick);
// 이모트 아이콘(시트의 기타 칸): 'icons' 0=얼굴 1=검 2=방패 3=망토 4=물약
function drawFallbackHero(ctx, w, h, dir, anim, t) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const cx = Math.floor(w / 2), cy = Math.floor(h / 2);
  const bob = anim === 'run' ? Math.sin(t * 16) * 3 : (anim === 'walk' ? Math.sin(t * 10) * 2 : Math.sin(t * 4) * 1);
  const flip = dir === 'left' ? -1 : 1;
  ctx.translate(cx, cy + bob);
  ctx.scale(flip, 1);
  
  // 망토 (어두운 보라/갈색)
  ctx.fillStyle = '#2d1b36';
  ctx.fillRect(-14, -6, 28, 30);
  // 몸통 코트 (다크 브라운)
  ctx.fillStyle = '#4a2d1d';
  ctx.fillRect(-10, -4, 20, 22);
  // 가죽 벨트 & 버클
  ctx.fillStyle = '#1e130b'; ctx.fillRect(-10, 4, 20, 4);
  ctx.fillStyle = '#f5b942'; ctx.fillRect(-3, 4, 6, 4);
  // 후드 (어두운 보라)
  ctx.fillStyle = '#3a2347';
  ctx.fillRect(-12, -26, 24, 22);
  // 얼굴 그림자 속 어둠
  ctx.fillStyle = '#12081a';
  ctx.fillRect(-8, -20, 16, 12);
  // 빛나는 눈빛
  ctx.fillStyle = '#fffa65';
  ctx.fillRect(1, -16, 3, 2);
  // 허리 숏소드
  ctx.fillStyle = '#b2bec3';
  ctx.fillRect(8, -2, 4, 18);
  ctx.fillStyle = '#f5b942';
  ctx.fillRect(6, -4, 8, 3);
  // 발/부츠
  ctx.fillStyle = '#22150d';
  ctx.fillRect(-9, 18, 7, 7);
  ctx.fillRect(2, 18, 7, 7);
  ctx.restore();
}

function drawSheetIcon(cv, idx) {
  const go = () => {
    if (!HERO_ATLAS.anims?.icons?.[idx]) return; const [x, y, w, h] = HERO_ATLAS.anims.icons[idx];
    cv.width = w; cv.height = h; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(heroImg, x, y, w, h, 0, 0, w, h);
  };
  heroReady ? go() : heroImg.addEventListener('load', go, { once: true });
}

// ===== pixelfx 연동: 캔버스 해상도를 화면 크기에 맞추고, 실제 DOM 위치를 이펙트 좌표로 변환 =====
const PAL = {
  common: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#ffffff'],
  rare: ['#192a56', '#0984e3', '#00cec9', '#4deeea', '#a0ffff', '#ffffff'],
  epic: ['#220835', '#6c2fa2', '#a55eea', '#c56cf0', '#f5c8ff', '#ffffff'],
  legendary: ['#631010', '#d63031', '#e17055', '#fdcb6e', '#ffeaa7', '#ffffff'],
  mythic: ['#120826', '#a55eea', '#ff5e97', '#4deeea', '#ffffff'],
  fire: ['#2c0505', '#c0392b', '#ff4757', '#ff8c00', '#fff275', '#ffffff'],
  holy: ['#d35400', '#f39c12', '#f5cd79', '#fffa65', '#ffffff'],
  earth: ['#1e130b', '#4a2d1d', '#8d5524', '#d1a56e', '#f7d794'],
  venom: ['#0b3d1e', '#10ac84', '#2ed573', '#badc58', '#dff9fb'],
  volt: ['#0984e3', '#4deeea', '#f5b942', '#fffa65', '#ffffff'],
  ice: ['#101a40', '#1f4fa0', '#3a8bd8', '#7fd0f4', '#d8f4ff', '#ffffff'],
  water: ['#0a1e3c', '#124a8a', '#1f7fd0', '#4cb8f0', '#a8e4ff', '#ffffff'],
  shadow: ['#06030c', '#1e0b36', '#4b1d86', '#8a3fd8', '#c890ff', '#f2e6ff'],
  blood: ['#2a0306', '#6e0a12', '#b0141e', '#ff3040', '#ff9aa0', '#ffffff'],
  wind: ['#0b2e1e', '#1f7a4c', '#3cc47a', '#9ef0b8', '#ecfff2'],
};
const gradePal = (g) => ({ '신화': PAL.mythic, '전설': PAL.legendary, '영웅': PAL.epic, '희귀': PAL.rare }[g] || PAL.common);
function skillPal(name, grade) {
  if (SKILL_PAL_MOD[name]) return SKILL_PAL_MOD[name];
  const k = skillKind(name);
  return { fire: PAL.fire, ice: PAL.ice, bolt: PAL.volt, poison: PAL.venom, earth: PAL.earth, wind: PAL.wind, water: PAL.water, dark: PAL.shadow, holy: PAL.holy, void: PAL.mythic, blood: PAL.blood }[k] || gradePal(grade);
}

const FX = {
  live: [], surf: {}, frozenUntil: 0, last: 0,
  // 캔버스 화면 크기에서 픽셀 배율을 정하고 내부 해상도를 맞춤 (정사각 픽셀 유지)
  surface(id) {
    const cv = document.getElementById(id); if (!cv) return null;
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return null;
    const scale = Math.max(1, Math.min(2.5, Math.round((h / 200) * 2) / 2));
    const W = Math.round(w / scale), H = Math.round(h / scale);
    let s = this.surf[id];
    if (!s || s.W !== W || s.H !== H) {
      cv.width = W; cv.height = H;
      s = this.surf[id] = { cv, W, H, scale, frame: PFXLib.createFrame(W, H), img: new ImageData(W, H), dirty: false };
    }
    return s;
  },
  // 요소의 상대 지점(fx: 0..1 가로, fy: 0..1 세로)을 캔버스 좌표로
  at(id, el, fx = 0.5, fy = 1) {
    const s = this.surface(id); if (!s || !el) return { x: 0, y: 0 };
    const c = s.cv.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: (r.left + r.width * fx - c.left) / s.scale, y: (r.top + r.height * fy - c.top) / s.scale };
  },
  spawn(id, name, opts, { speed = 1, cut = Infinity, delay = 0, move = null } = {}) {
    if (!this.surface(id)) return;
    const mod = PFXLib.FX[name]; if (!mod) return console.warn('fx missing', name);
    const fx = PFXLib.createFx(mod, { seed: (Math.random() * 1e6) | 0, ...opts });
    this.live.push({ id, fx, speed, cut, delay, t: 0, move });
    this.wake();
  },
  // 이펙트가 없으면 루프를 멈췄다가, 새 이펙트가 생기면 다시 시작 (유휴 시 CPU/배터리 절약)
  running: false,
  wake() { if (this.running) return; this.running = true; this.last = 0; requestAnimationFrame(t => this.tick(t)); },
  clearAll() { this.live = []; },
  async hitStop(ms) { if (ms <= 0) return; this.frozenUntil = performance.now() + ms; await new Promise(r => setTimeout(r, ms)); },
  shake(elId, dur = 160, amp = 6) {
    const el = document.getElementById(elId); if (!el) return;
    const t0 = performance.now();
    const f = (now) => {
      const e = now - t0;
      if (e >= dur) { el.style.transform = ''; return; }
      const k = amp * (1 - e / dur);
      el.style.transform = `translate(${Math.round((Math.random() * 2 - 1) * k)}px,${Math.round((Math.random() * 2 - 1) * k)}px)`;
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  },
  tick(now) {
    let dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    if (now < this.frozenUntil) dt = 0;
    const used = new Set(this.live.map(e => e.id));
    for (const id in this.surf) {
      const s = this.surf[id];
      if (!used.has(id)) { if (s.dirty) { s.cv.getContext('2d').clearRect(0, 0, s.W, s.H); s.dirty = false; } continue; }
      PFXLib.clearFrame(s.frame);
      for (const e of this.live) {
        if (e.id !== id) continue;
        if (e.delay > 0) { e.delay -= dt; continue; }
        const d = dt * e.speed; e.t += d;
        if (e.move) { const p = e.move(e.t); e.fx.options.x = p.x; e.fx.options.y = p.y; }
        e.fx.update(d);
        if (e.t >= e.cut) e.fx.stop();
        e.fx.draw(s.frame);
      }
      PFXLib.composite(s.frame, s.img.data, null);
      s.cv.getContext('2d').putImageData(s.img, 0, 0);
      s.dirty = true;
    }
    this.live = this.live.filter(e => e.delay > 0 || !e.fx.done());
    // 남은 이펙트가 없으면 한 프레임 더 돌려 캔버스를 지운 뒤 잠듦
    if (!this.live.length && !Object.values(this.surf).some(s => s.dirty)) { this.running = false; return; }
    requestAnimationFrame(t => this.tick(t));
  },
};
FX.wake();

// ===== 전투 연출 =====
const BFX = 'battle-fx-canvas';
// 주인공/몬스터의 발 위치와 몸 중심 (이펙트 좌표)
function battleAnchors() {
  const hc = document.getElementById('hero-battle-canvas'), mc = document.getElementById('monster-battle-canvas');
  const hf = FX.at(BFX, hc, 0.5, 0.99), mf = FX.at(BFX, mc, 0.5, 60 / 64);
  const s = FX.surf[BFX], mh = mc ? mc.getBoundingClientRect().height / (s?.scale || 1) : 60;
  const hh = hc ? hc.getBoundingClientRect().height / (s?.scale || 1) : 60;
  return { h: { x: hf.x + hh * 0.05, y: hf.y, cy: hf.y - hh * 0.38 }, m: { x: mf.x, y: mf.y, cy: mf.y - mh * 0.32 }, mh, hh };
}
const sp = (name, o, t) => FX.spawn(BFX, name, o, t);

// 평타: 시트의 초승달 베기 + 별 폭발. 영웅 이상은 엇갈린 2연격
function fxHeroSlash(grade, crit) {
  const { h, m } = battleAnchors(), pal = gradePal(grade), r = rankOf(grade), T = 0.16;
  // 검기: 주인공 앞에서 몬스터까지 날아감
  const from = { x: h.x + 34, y: h.cy - 4 }, to = { x: m.x - 8, y: m.cy };
  sp('swordWave', { palette: pal, radius: 16 + r * 2, light: 0.9 }, { cut: T, move: (t) => { const k = Math.min(1, t / T); return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k }; } });
  if (r >= 3) sp('swordWave', { palette: pal, radius: 12 + r * 2, light: 0.7 }, { cut: T, delay: 0.07, move: (t) => { const k = Math.min(1, t / T); return { x: from.x + (to.x - from.x) * k, y: from.y + 10 + (to.y - from.y) * k }; } });
  sp('crescentSlash', { x: m.x - 34, y: m.cy + 40, palette: pal, radius: 26 + r * 2, light: 0.8 }, { delay: T });
  sp('starPop', { x: m.x - 4, y: m.cy, size: crit ? 24 : 13, palette: crit ? PAL.legendary : pal, light: 0.6 }, { delay: T + 0.04 });
  if (crit) sp('critHit', { x: m.x, y: m.y, light: 0.8 }, { delay: T });
  sp('dustKick', { x: m.x - 18, y: m.y, size: 7, count: 3 }, { delay: T });
}
// 몬스터 공격: 할퀴기 + 붉은 별, 보스는 화염 숨결
function fxEnemyHit() {
  const { h } = battleAnchors();
  sp('clawSwipe', { x: h.x + 46, y: h.y, flip: true, light: 0.7 }, { speed: 1.2 });
  sp('starPop', { x: h.x + 4, y: h.cy, size: 12, palette: PAL.fire }, { delay: 0.07 });
}
function fxBossBreath() {
  const { h, m, mh } = battleAnchors(), mx = m.x - mh * 0.44, my = m.y - mh * 0.28, reach = mx - h.x;
  // fire-breath는 오른쪽으로 ~150px, 거리가 멀면 숨결을 이어 붙임
  const n = Math.max(1, Math.ceil(reach / 140));
  for (let i = 0; i < n; i++) sp('fireBreath', { x: mx - i * 140, y: my + (h.cy - my) * (i / n), flip: true, light: 0.7, angle: -0.12 }, { cut: 0.7, delay: i * 0.06 });
  sp('fireRing', { x: h.x, y: h.y, light: 0.6 }, { speed: 2.2, cut: 0.5, delay: 0.25 });
}
function fxPotion() { const { h } = battleAnchors(); sp('heal', { x: h.x, y: h.y, light: 0.8 }, { speed: 1.2 }); }
function fxVictory(isBoss) {
  const { m } = battleAnchors();
  if (isBoss) sp('smallExplosion', { x: m.x, y: m.y, light: 0.8 }, { speed: 1.6, cut: 2.2 });
  else sp('poof', { x: m.x, y: m.y, light: 0.6 }, { speed: 1.1 });
  sp('coinDrop', { x: m.x, y: m.y, coins: isBoss ? 14 : 7 }, { speed: 1.3, delay: 0.15 });
}
function fxHeroDeath() { const { h } = battleAnchors(); sp('dustKick', { x: h.x - 10, y: h.y, size: 10, count: 4 }, { delay: 0.35 }); }
function fxRunIn() { const { h } = battleAnchors(); sp('dustKick', { x: h.x - 30, y: h.y, flip: true, size: 6, count: 3 }); }

// ===== 스킬 28종: 이름의 표현에 맞춘 연출 =====
// h/m: 시전자/대상의 발(x,y)과 몸 중심(cy). P: 스킬 팔레트(어두움→밝음)
function projectile(name, from, to, dur, opts, after) {
  sp(name, { ...opts, x: from.x, y: from.y }, { cut: dur, move: (t) => { const k = Math.min(1, t / dur); return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k }; } });
  if (after) setTimeout(after, dur * 1000);
}
const SKILL_FX = {
  '화염 강타': (h, m, P) => { sp('crescentSlash', { x: m.x - 34, y: m.cy + 30, palette: P, radius: 30 }); sp('fireRing', { x: m.x, y: m.y }, { speed: 1.8, cut: 0.9, delay: 0.08 }); sp('starPop', { x: m.x, y: m.cy, size: 16, palette: P }, { delay: 0.06 }); },
  '얼음 송곳': (h, m, P) => projectile('iceLance', { x: h.x + 30, y: h.cy }, { x: m.x - 6, y: m.cy }, 0.22, {}, () => sp('iceShatter', { x: m.x, y: m.y }, { speed: 1.6, cut: 1.2 })),
  '질풍 베기': (h, m, P) => { sp('spinSlash', { x: m.x, y: m.y, palette: P }, { speed: 1.2 }); sp('leafStorm', { x: m.x, y: m.y }, { cut: 0.8, speed: 1.4 }); },
  '바위 투척': (h, m, P) => { const d = m.x - h.x; sp('boulder', { x: m.x - 130, y: m.y }, { speed: 1.5 }); sp('dustKick', { x: m.x - 10, y: m.y, size: 10 }, { delay: 0.45 }); },
  '전격 찌르기': (h, m, P) => { sp('thrust', { x: m.x - 120, y: m.cy + 40, palette: P }, { speed: 1.1 }); sp('zapHit', { x: m.x, y: m.y }, { delay: 0.1 }); },
  '수류 강타': (h, m, P) => { sp('waterJet', { x: m.x - 150, y: m.cy }, { cut: 0.5 }); sp('splash', { x: m.x, y: m.y }, { delay: 0.25, speed: 1.4, cut: 1.3 }); },
  '번개 일격': (h, m, P) => sp('lightningStrike', { x: m.x, y: m.y }, { speed: 2, cut: 0.9 }),
  '맹독 파동': (h, m, P) => { sp('acidSplash', { x: m.x, y: m.y }, { speed: 1.5 }); sp('poisonCloud', { x: m.x, y: m.y }, { cut: 1.0, speed: 1.3 }); },
  '서리 폭풍': (h, m, P) => { sp('snowflakeBurst', { x: m.x, y: m.y }, { speed: 1.4 }); sp('frostNova', { x: m.x, y: m.y }, { speed: 1.8, cut: 1.4 }); },
  '화염 폭발': (h, m, P) => sp('smallExplosion', { x: m.x, y: m.y, light: 0.8 }, { speed: 1.8, cut: 2.2 }),
  '칼날 선풍': (h, m, P) => { sp('spinSlash', { x: m.x, y: m.y, palette: P }); sp('doubleSlash', { x: m.x - 60, y: m.y + 6, palette: P }, { delay: 0.18 }); },
  '영혼 흡수격': (h, m, P) => { sp('crescentSlash', { x: m.x - 34, y: m.cy + 30, palette: PAL.shadow, radius: 30 }); sp('soulRise', { x: m.x, y: m.y }, { speed: 1.5, delay: 0.1 }); sp('heal', { x: h.x, y: h.y, palette: PAL.shadow }, { speed: 1.5, delay: 0.45 }); },
  '대지 분쇄': (h, m, P) => { sp('groundSlam', { x: m.x, y: m.y }, { speed: 1.8, cut: 1.2 }); sp('earthSpike', { x: m.x, y: m.y }, { speed: 1.8, cut: 1.5, delay: 0.1 }); },
  '암흑 참격': (h, m, P) => { sp('heavyCleave', { x: m.x - 76, y: m.y, palette: P }, { speed: 1.3 }); sp('shadowTendrils', { x: m.x, y: m.y }, { speed: 1.8, cut: 1.2, delay: 0.2 }); },
  '뇌신 강림': (h, m, P) => { sp('lightningStrike', { x: m.x, y: m.y }, { speed: 2, cut: 0.9 }); sp('thunderclap', { x: m.x, y: m.y }, { speed: 1.6, delay: 0.25 }); },
  '빙결 파멸창': (h, m, P) => projectile('iceLance', { x: h.x + 30, y: h.cy }, { x: m.x, y: m.cy }, 0.2, {}, () => { sp('iceSpikes', { x: m.x - 50, y: m.y }, { speed: 1.7, cut: 1.4 }); sp('iceShatter', { x: m.x, y: m.y }, { speed: 1.6 }); }),
  '용염 브레스': (h, m, P) => { const n = Math.max(1, Math.ceil((m.x - h.x - 20) / 140)); for (let i = 0; i < n; i++) sp('fireBreath', { x: h.x + 26 + i * 140, y: h.cy - 4, light: 0.8 }, { cut: 0.8, delay: i * 0.06 }); sp('fireRing', { x: m.x, y: m.y }, { speed: 2, cut: 0.7, delay: 0.3 }); },
  '성광 일섬': (h, m, P) => { sp('arcaneBeam', { x: m.x - 230, y: m.cy + 10, palette: P }, { cut: 0.45 }); sp('crescentSlash', { x: m.x - 34, y: m.cy + 30, palette: P, radius: 32 }, { delay: 0.12 }); },
  '성스러운 심판': (h, m, P) => { sp('holyPillar', { x: m.x, y: m.y }, { speed: 2, cut: 1.2 }); sp('smite', { x: m.x, y: m.y }, { speed: 1.6, delay: 0.3 }); },
  '메테오 스트라이크': (h, m, P) => sp('meteor', { x: m.x, y: m.y, light: 0.9 }, { speed: 1.7, cut: 2.4 }),
  '절대영도 붕괴': (h, m, P) => { sp('icicleFall', { x: m.x - 16, y: m.y }, { speed: 2 }); sp('icicleFall', { x: m.x + 18, y: m.y }, { speed: 2, delay: 0.12 }); sp('frostNova', { x: m.x, y: m.y }, { speed: 1.8, cut: 1.5, delay: 0.2 }); },
  '심연의 어둠폭풍': (h, m, P) => { sp('blackHole', { x: m.x, y: m.cy + 40 }, { cut: 1.0, speed: 1.3 }); sp('shadowTendrils', { x: m.x, y: m.y }, { speed: 1.6, cut: 1.3, delay: 0.15 }); },
  '천벌의 뇌창': (h, m, P) => { projectile('iceLance', { x: h.x + 30, y: h.cy }, { x: m.x, y: m.cy }, 0.18, { palette: PAL.volt }); sp('lightningStrike', { x: m.x, y: m.y }, { speed: 2.2, cut: 0.8, delay: 0.16 }); sp('zapHit', { x: m.x, y: m.y }, { delay: 0.2 }); },
  '차원 절단': (h, m, P) => { sp('timeStop', { x: m.x, y: m.y, palette: P }, { speed: 2.4, cut: 1.2 }); sp('doubleSlash', { x: m.x - 60, y: m.y + 6, palette: P }, { delay: 0.35 }); sp('crescentSlash', { x: m.x + 30, y: m.cy + 30, flip: true, palette: P, radius: 34 }, { delay: 0.45 }); },
  '창세의 빛: 오메가': (h, m, P) => { sp('holyPillar', { x: m.x, y: m.y }, { speed: 2, cut: 1.3 }); sp('sunburst', { x: m.x, y: m.cy }, { cut: 0.9, speed: 1.4, delay: 0.2 }); sp('plasmaExplosion', { x: m.x, y: m.cy, palette: P }, { speed: 1.4, delay: 0.4 }); },
  '종말의 별똥별': (h, m, P) => { sp('starFall', { x: m.x, y: m.y }, { speed: 1.5 }); sp('meteor', { x: m.x, y: m.y, light: 0.9 }, { speed: 1.8, cut: 2.2, delay: 0.2 }); },
  '신살의 붉은 섬광': (h, m, P) => { for (let i = 0; i < 3; i++) sp('crescentSlash', { x: m.x + (i % 2 ? 30 : -34), y: m.cy + 30 - i * 6, flip: i % 2 === 1, palette: P, radius: 30 + i * 4 }, { delay: i * 0.09 }); sp('critHit', { x: m.x, y: m.y, palette: P }, { delay: 0.25 }); },
  '시공 붕괴: 빅뱅': (h, m, P) => { sp('blackHole', { x: m.x, y: m.cy + 40 }, { cut: 0.8, speed: 1.4 }); sp('plasmaExplosion', { x: m.x, y: m.cy, palette: P }, { speed: 1.2, delay: 0.55 }); sp('smallExplosion', { x: m.x, y: m.y }, { speed: 1.8, cut: 2, delay: 0.6 }); },
};
function fxSkill(sk, crit) {
  const { h, m } = battleAnchors(), P = skillPal(sk.name, sk.grade);
  sp('skillSigil', { x: h.x, y: h.y, palette: P, radius: 26 }, { speed: 1.4 });
  (SKILL_FX[sk.name] || ((h, m, P) => sp('crescentSlash', { x: m.x - 34, y: m.cy + 30, palette: P })))(h, m, P);
  if (crit) sp('starPop', { x: m.x, y: m.cy, size: 24, palette: PAL.legendary }, { delay: 0.2 });
}

// ===== 대장간 · 상자 =====
const FFX = 'forge-fx-canvas';
function forgeAnchor() { return FX.at(FFX, document.getElementById('forge-item-canvas'), 0.5, 0.6); }
function fxForgeTap() { const a = forgeAnchor(); FX.spawn(FFX, 'anvilSparks', { x: a.x, y: a.y, count: 18 }, { speed: 1.2 }); }
function fxForgeSuccess(auto) {
  const a = forgeAnchor();
  FX.spawn(FFX, 'heal', { x: a.x, y: a.y + 30, light: 0.8 }, { speed: 1.4 });
  if (!auto) FX.spawn(FFX, 'levelUp', { x: a.x, y: a.y + 65, text: 'SUCCESS!', light: 0.7 }, { speed: 1.5, cut: 1.6 });
}
function fxForgeFail(auto) { const a = forgeAnchor(); FX.spawn(FFX, 'poof', { x: a.x, y: a.y + 20 }, { speed: auto ? 1.6 : 1.1 }); }
function fxChest(canvasId, grade, sold, multi) {
  const s = FX.surface(canvasId); if (!s) return;
  const x = s.W / 2, y = s.H * (multi ? 0.8 : 0.78), P = gradePal(grade);
  FX.spawn(canvasId, 'lootBeam', { x, y, palette: P, light: 0.8 }, { speed: 1.2, cut: 1.5 });
  if (rankOf(grade) >= 3) FX.spawn(canvasId, 'confetti', { x, y: y - 10 }, { speed: 1.2 });
  if (sold) FX.spawn(canvasId, 'collectBurst', { x, y: y - 30, palette: PAL.legendary }, { delay: 0.2 });
}

// ===== 화면 · 입력 · 전투 진행 =====
const $ = (id) => document.getElementById(id);
const UI = { sort: 'default', query: '', codexTab: 'swords', pending: null, rerollName: null, runeBanner: '', forgeBusy: false, autoTimer: null };
const gcol = (g) => GRADE_COLOR[g] || '#b2bec3';
const gtag = (g, text = g) => `<span class="tag ${GRADE_CLASS[g] || 'common'}">${text}</span>`;
const optPill = (o) => (o ? `<span class="opt ${o.rank}">${optText(o)}</span>` : '');
const swordTitle = (e) => `${EQUIP[e.grade].sTitle} (${e.name})`;
const armorTitle = (e) => `${EQUIP[e.grade].aTitle} (${e.name})`;
const stageKind = (s) => (s % 50 === 0 ? 'b50' : s % 10 === 0 ? 'boss' : s % 5 === 0 ? 'elite' : 'normal');
const speedUnlocked = () => S.maxStage > 10;
const actionDelay = () => (S.battleSpeed === 'skip' ? 10 : S.battleSpeed === 2 ? 240 : 480);
const hs = (ms) => (S.battleSpeed === 2 ? 35 : ms);
let heroMenu, heroChar, heroBattle;

// ----- 모달 -----
const modalStack = [];
function openModal(id, width, title, html, { noX = false } = {}) {
  let m = $('m-' + id);
  if (!m) { m = document.createElement('div'); m.className = 'modal'; m.id = 'm-' + id; m.addEventListener('click', (e) => { if (e.target === m && id !== 'result') closeModal(id); }); $('modals').appendChild(m); }
  m.innerHTML = `<div class="mframe" style="max-width:${width}px"><div class="mtitle"><span>${title}</span>${noX ? '' : `<button class="btn mini" onclick="closeModal('${id}')">X</button>`}</div>${html}</div>`;
  if (!m.classList.contains('open')) { m.classList.add('open'); modalStack.push(id); }
  return m;
}
function refreshModal(id, title, html) { const m = $('m-' + id); if (m && m.classList.contains('open')) { const sc = m.querySelector('.mlist, .rgrid, .skill-list'); const top = sc ? sc.scrollTop : 0; openModal(id, parseInt(m.firstChild.style.maxWidth), title, html, { noX: id === 'result' }); const sc2 = m.querySelector('.mlist, .rgrid, .skill-list'); if (sc2) sc2.scrollTop = top; } }
function closeModal(id) {
  const m = $('m-' + id); if (m) m.classList.remove('open');
  const i = modalStack.lastIndexOf(id); if (i >= 0) modalStack.splice(i, 1);
  if (id === 'skills') UI.pending = null;
  refreshAll();
}
const isOpen = (id) => $('m-' + id)?.classList.contains('open');

// ----- 장면 -----
function switchScene(id) {
  if (id !== 'scene-battle') {
    clearAuto();
    S.battle.inBattle = false;
    if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none';
    if (heroBattle) heroBattle.idle();
  }
  document.querySelectorAll('.scene').forEach(s => s.classList.toggle('active', s.id === id));
  $('top-bar').classList.toggle('hidden', id === 'scene-title');
  refreshAll();
  window.scrollTo(0, 0);
}
const curScene = () => document.querySelector('.scene.active')?.id;
function refreshAll() {
  const st = stats(), h = S.hero; h.maxHp = st.maxHp; h.hp = Math.min(h.hp, st.maxHp);
  $('top-hp-fill').style.width = (h.hp / st.maxHp * 100) + '%';
  $('top-hp-txt').textContent = `${fmt(h.hp)} / ${fmt(st.maxHp)}`;
  $('chip-gold').textContent = `🪙 ${fmt(h.gold)}G`; $('chip-keys').textContent = `🗝️ ${h.keys}개`; $('chip-stage').textContent = `🏰 Stage ${S.stage} / ${S.maxStage}`;
  const sc = curScene();
  if (sc === 'scene-menu') renderMenu(st);
  if (sc === 'scene-character') renderCharacter(st);
  if (sc === 'scene-forge') renderForge();
  if (sc === 'scene-battle') { renderHud(); renderDock(); }
}

// ----- 마을 -----
function stageLabel(s) {
  const k = stageKind(s);
  const t = k === 'b50' ? `Stage ${s} 🔥 [50층 심연 대군주 보스!]` : k === 'boss' ? `Stage ${s} 👑 [보스전]` : k === 'elite' ? `Stage ${s} ⭐ [엘리트 정예 + 일반 룬]` : `Stage ${s} ⚔️ [일반 층]`;
  return t + (s === S.maxStage ? ' (최고층)' : '');
}
function renderStageSelect() {
  const sel = $('stage-select'), q = UI.query.trim().toLowerCase(), opts = [];
  for (let s = S.maxStage; s >= 1; s--) { const l = stageLabel(s); if (!q || String(s).includes(q) || l.toLowerCase().includes(q)) opts.push(`<option value="${s}"${s === S.stage ? ' selected' : ''}>${l}</option>`); }
  sel.innerHTML = opts.length ? opts.join('') : `<option value="${S.stage}">검색 결과 없음 (현재: Stage ${S.stage})</option>`;
  $('stage-clear').style.display = UI.query ? '' : 'none';
}
function setStage(s) { S.stage = Math.max(1, Math.min(S.maxStage, s)); S.repeatStage = null; save(); refreshAll(); }
function stageSearchGo() {
  const q = UI.query.trim(); if (!q) return;
  const n = parseInt(q.replace(/\D/g, ''), 10);
  if (/\d/.test(q) && n >= 1 && n <= S.maxStage) return setStage(n);
  for (let s = S.maxStage; s >= 1; s--) if (String(s).includes(q) || stageLabel(s).toLowerCase().includes(q.toLowerCase())) return setStage(s);
  alert(`해금된 최고층(Stage ${S.maxStage}) 내에서 '${q}'에 해당하는 층을 찾지 못했습니다.`);
}
function renderMenu(st) {
  const h = S.hero;
  $('menu-gear').innerHTML = [
    ['🗡️ 검', 'var(--gold)', `<b style="color:${gcol(h.sword.grade)}">${swordTitle(h.sword)} ${enhanceStatus(h.sword)}</b>`],
    ['🛡️ 갑옷', 'var(--cyan)', `<b style="color:${gcol(h.armor.grade)}">${armorTitle(h.armor)} ${enhanceStatus(h.armor)}</b>`],
    ['⚔️ 공격력', 'var(--orange)', `<b>${fmt(st.atk)}</b>`], ['🛡️ 방어력', 'var(--green)', `<b>${fmt(st.def)}</b>`],
    ['💥 치명타', '#ffe37d', `<b>${st.critRate.toFixed(1)}% (${st.critDmg}%)</b>`], ['👑 보스피해 / 🍀 드랍', 'var(--pink)', `<b>+${st.bossDmg}% / +${st.dropRate}%</b>`],
  ].map(([l, c, v]) => `<div class="gear-row"><span style="color:${c}">${l}</span>${v}</div>`).join('');
  if (document.activeElement !== $('stage-select')) renderStageSelect();
  renderWorldRow();
  $('mod-btn').textContent = `🧩 모드 (${PD.mods.length})`;
  const s = S.stage, k = stageKind(s), m = Math.floor(s / 50);
  const desc = { b50: '🔥 [50층 심연 대군주 보스전!]', boss: '👑 [보스전 출현!]', elite: '⭐ [엘리트 정예 + 일반 룬 드랍!]', normal: '일반 던전 탐험' }[k];
  const sub = `Stage ${s} - ${desc}${s >= 50 ? ` · 심연각성 Lv.${m}` : ''}${s < S.maxStage ? ' · 🔁 반복사냥 (골드 80%)' : ''}`;
  const lv = S.chestLevel, cl = CHEST_LV[lv], rates = cl.r.map((v, i) => `<span style="color:${gcol(GRADES[i])}">${GRADES[i]} ${v.toFixed(1)}%</span>`).join(' · ');
  const expTxt = lv >= 10 ? 'EXP: MAX (최고 등급 달성!)' : `EXP: ${S.chestExp} / ${cl.req} (상자 1회당 +1)`;
  const chestRow = (n, title, color, type, sub2) => `<div class="chest-row wide"><div class="hd"><span class="num" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:#0b0d13;border:2px solid var(--iron);color:var(--gold);font-size:.8rem">${n}</span><div class="tx"><b style="color:${color}">${title}</b><small>${sub2}</small></div></div>
    <div class="bt">${getChestButtons(type)}</div></div>`;
  const sellSub = lv === 10 ? '🗡️ 장비 상자: 일반~영웅 (상자 Lv.10 특권: 🌟전설 0.1% · 🌌신화 0.01% 해금!)' : '🗡️ 장비 상자: 일반~영웅 (대장간 무료 승급 가능 · 상자 Lv.10 달성 시 전설/신화 해금!)';
  const mb = (n, cls, main, sub2, act, wide) => `<button class="btn mbtn ${cls}${wide ? ' wide' : ''}" onclick="${act}"><span class="num">${n}</span><span class="tx"><span>${main}</span><small>${sub2}</small></span></button>`;
  const eqN = h.equippedSkills.length;
  const T = runeSetTier(), runeTotal = RUNE_TYPES.reduce((a, t) => a + h.runeCounts[t.id].reduce((x, y) => x + y, 0), 0);
  const relicSum = RELICS.reduce((a, r) => a + (S.relics[r.id] || 0), 0);
  const petCount = Object.keys(h.pets?.owned || {}).length;
  const hasAch = hasUnclaimedAchievements();
  const spd = !speedUnlocked() ? '<span style="color:var(--dim)">🔒 10스테이지 클리어 후 해금</span>' : `<span style="color:${S.battleSpeed === 'skip' ? 'var(--orange-g)' : 'var(--cyan)'}">현재: ${{ 1: '1배속', 2: '2배속', skip: '⚡ 스킵 (전투 생략)' }[S.battleSpeed]} (클릭하여 변경)</span>`;

  // 상단 바 무지개별 조각 표시
  if ($('chip-shards')) $('chip-shards').textContent = `🌈 조각 ${h.rainbowShards || 0}개`;
  // 펫 아바타 렌더링
  const mp = $('menu-pet');
  if (mp) {
    if (h.pets?.equipped) { mp.style.display = 'block'; drawPet(mp, h.pets.equipped); }
    else mp.style.display = 'none';
  }

  $('menu-grid').innerHTML = [
    mb(1, 'orange', '⚔️ 던전 입장 [Enter]', sub, 'startBattle()', true),
    mb('★', 'gold', '💪 영웅 훈련소 (골드로 7대 스탯 영구 강화)', '공격력 · 방어력 · 드랍률 · 치확 · 치피 · 최대체력 · 보스피해(최대 Lv.1000)', 'openStats()', true),
    `<div class="chest-lv wide"><div class="top"><span>📦 소환 상자 등급 Lv.${lv} / 10</span><span>${expTxt}</span></div><div class="bar12"><div style="width:${lv >= 10 ? 100 : S.chestExp / cl.req * 100}%"></div></div>${(() => {
      const sum = cl.r[0] + cl.r[1] + cl.r[2];
      const eLeg = lv >= 10 ? 0.1 : 0, eMyth = lv >= 10 ? 0.01 : 0, eRem = 100 - (eLeg + eMyth);
      const sLeg = Math.min(1.8, cl.r[3] * 0.2), sMyth = Math.min(0.4, cl.r[4] * 0.15), sRem = 100 - (sLeg + sMyth);
      const base3 = (arr) =>
        `<span style="color:#b2bec3">일반 ${arr[0].toFixed(1)}%</span> · ` +
        `<span style="color:#00cec9">희귀 ${arr[1].toFixed(1)}%</span> · ` +
        `<span style="color:#a55eea">영웅 ${arr[2].toFixed(1)}%</span>`;
      const high2 = (leg, myth, legDec, mythDec) =>
        ` · <span style="color:#f5b942">전설 ${leg.toFixed(legDec)}%</span>` +
        ` · <span style="color:#ff5e97">신화 ${myth.toFixed(mythDec)}%</span>`;
      const eqArr = [cl.r[0] / sum * eRem, cl.r[1] / sum * eRem, cl.r[2] / sum * eRem];
      const skArr = [cl.r[0] / sum * sRem, cl.r[1] / sum * sRem, cl.r[2] / sum * sRem];
      const eqTxt = lv >= 10
        ? `${base3(eqArr)}${high2(eLeg, eMyth, 1, 2)}`
        : `${base3(eqArr)} <span style="color:var(--sub)">[Lv.10 전설/신화 해금]</span>`;
      const skTxt = `${base3(skArr)}${high2(sLeg, sMyth, 2, 2)}`;
      const lbl = 'display:inline-block;width:116px;white-space:nowrap';
      return `<div style="font-size:.73rem;line-height:1.6;margin-top:3px">` +
        `<div><b style="${lbl};color:var(--gold)">🗡️🛡️ 장비 상자:</b>${eqTxt}</div>` +
        `<div><b style="${lbl};color:var(--purple-g)">✨ 스킬 상자:</b>${skTxt}</div>` +
      `</div>`;
    })()}</div>`,
    chestRow(2, '🗡️ 검 상자 열기', 'var(--gold)', 'sword', sellSub),
    chestRow(3, '🛡️ 방어구 상자 열기', 'var(--cyan)', 'armor', sellSub),
    chestRow(4, `✨ 스킬 상자 열기 (총 ${SKILLS.length}종)`, 'var(--purple-g)', 'skill', '낮은 등급 스킬 대폭 상향 패치 · 전설/신화 희귀 등장'),
    mb(5, '', '🔨 검 초월 강화 &amp; 승급', '+10강 &amp; 별 초월 &amp; 전설/신화 승급 &amp; 무지개별', "goForge('sword')"),
    mb(6, '', '🛡️ 방어구 초월 강화 &amp; 승급', '+10강 &amp; 별 초월 &amp; 전설/신화 승급 &amp; 무지개별', "goForge('armor')"),
    mb(7, '', '📜 캐릭터 정보', '장비 &amp; 룬 &amp; 상세 스탯', "switchScene('scene-character')"),
    mb(8, 'purple', '⚡ 스킬 장착 &amp; 옵션 재조정', `장착 ${eqN}/4 · ${h.autoCast ? '자동 시전 (AUTO)' : '수동 선택 (MANUAL)'}`, 'openSkills()'),
    mb(9, 'gold', '📖 모험가 도감 &amp; 수집 보상', `수집 ${codexCount()}/${codexTotal()} (${Math.floor(codexCount() / codexTotal() * 100)}%) · 구간별 보상`, 'openCodex()'),
    mb(10, 'cyan', '🏺 고대 유물 발굴 (최대 Lv.100)', `총 유물 Lv.${relicSum} / 1000`, 'openRelics()'),
    mb(11, 'green', '💎 보유 룬 &amp; 룬 합성소', `총 ${runeTotal}개 · 최고 세트: ${T >= 0 ? RUNE_SETS[T].label : '세트 미완성'}`, 'openRunes()'),
    mb(12, 'purple', '🎭 영웅 코스튬 상점', `스킨 의상 · 무기 오라 · 마법진 (골드 소모)`, 'openCostumes()'),
    mb(13, 'green', '🐾 신비의 펫 둥지', `보유 펫 ${petCount}마리 · 동행: ${h.pets?.equipped ? PET_BY_ID[h.pets.equipped]?.name : '미동행'}`, 'openPets()'),
    mb(14, 'gold', '🏆 영웅 업적의 전당' + (hasAch ? '<span class="red-dot">!</span>' : ''), '도감 · 처치 · 강화 등 열쇠/골드 수급', 'openAchievements()'),
    mb(15, 'red', '👹 차원 레이드 포탈', '거대 보스 토벌 (무지개별 조각 &amp; 대량 골드 파밍)', 'openRaidPortal()'),
    mb(16, '', '⏩ 전투 배속 설정', spd, 'openSpeed()'),
    mb(0, 'red', '🚪 타이틀 화면으로 [ESC]', '게임 시작 화면으로 복귀', "switchScene('scene-title')", true),
  ].join('');
}

// ----- 훈련소 -----
function trainValue(t, st) {
  const lv = S.hero.statLevels[t.key];
  return {
    atk: `총 공격력 ${fmt(st.atk)} (+${lv * 13})`, def: `총 방어력 ${fmt(st.def)} (+${lv * 13})`, maxHp: `최대 체력 ${fmt(st.maxHp)} (+${lv * 75})`,
    critRate: `${st.critRate.toFixed(1)}% (기본 20% + ${(lv * 1.5).toFixed(1)}%)`, critDmg: `${st.critDmg}% (기본 150% + ${lv * 8}%)`,
    bossDmg: `+${st.bossDmg}% (훈련 Lv.${lv}/1000)`, dropRate: `+${st.dropRate}% (훈련 Lv.${lv}/50)`,
  }[t.key];
}
function statsHtml() {
  const st = stats(), g = S.hero.gold;
  return `<div class="strip"><span>보유 골드: <b style="color:var(--gold)">${fmt(g)}G</b></span><small style="color:var(--sub)">+1 / +5 / MAX(보유 골드 최대치)</small></div><div class="mlist">${TRAIN.map(t => {
    const lv = S.hero.statLevels[t.key], maxed = t.max && lv >= t.max, c = trainCost(t, lv), dis = maxed || g < c ? 'disabled' : '';
    return `<div class="mrow"><div class="l"><b>${t.icon} ${t.label} <span style="color:var(--cyan)">Lv.${lv}${t.max ? '/' + t.max : ''}</span></b><span style="color:var(--green)">현재: ${trainValue(t, st)}</span><span style="color:var(--gold)">${maxed ? '최대 레벨 도달 (MAX)' : `다음 강화 비용: ${fmt(c)}G (+${t.inc}${t.unit})`}</span></div>
    <div class="bts"><button class="btn mini orange" ${dis} onclick="train('${t.key}',1)">+1</button><button class="btn mini gold" ${dis} onclick="train('${t.key}',5)">+5</button><button class="btn mini cyan" ${dis} onclick="train('${t.key}',9999)">MAX</button></div></div>`;
  }).join('')}</div><button class="btn full" onclick="closeModal('stats')">닫기 [ESC]</button>`;
}
const STATS_T = '💪 영웅 훈련소 (골드 스탯 강화)';
function openStats() { openModal('stats', 580, STATS_T, statsHtml()); }
function train(k, n) { buyTrain(k, n); refreshModal('stats', STATS_T, statsHtml()); refreshAll(); }

// ----- 상자 (자리수 비례 연속/일괄 오픈) -----
function openChest(type, n) {
  if (S.hero.keys < n) return alert(`소환 열쇠가 부족합니다! (${fmt(n)}회 개봉 필요: 🗝️${fmt(n)}개 / 현재 보유: 🗝️${S.hero.keys}개)`);
  S.hero.keys -= n;
  let leveled = false;
  const head = { sword: '🗡️ 검 상자', armor: '🛡️ 방어구 상자', skill: '✨ 스킬 상자' }[type] || '상자';
  const icon = (r) => `<canvas data-icon="${r.kind}|${r.grade}|${r.name}"></canvas>`;

  if (n < 50) {
    const res = [];
    for (let i = 0; i < n; i++) { res.push(openOne(type)); if (addChestExp()) leveled = true; }
    save(); refreshAll();
    if (n === 1) {
      const r = res[0], c = gcol(r.grade);
      openModal('gacha', 460, `${head} 개봉!${leveled ? ` 🎉 상자 Lv.${S.chestLevel} 달성!` : ''}`,
        `<div class="reveal"><canvas class="fx" id="gacha-fx-canvas"></canvas><div class="glow" style="background:${c}"></div>${icon(r).replace('<canvas', '<canvas class="item"')}
        <div style="color:${c};font-weight:bold">[${r.grade} 등급]</div><div style="color:${c};font-size:1.15rem;font-weight:bold">${r.icon ? r.icon + ' ' : ''}${r.name}</div><div style="color:var(--cyan);font-size:.8rem">${r.statText}</div>
        <div class="decision ${r.tagType}">${r.banner}</div></div><button class="btn orange full" onclick="closeModal('gacha')">확인 [Enter]</button>`);
      paintIcons($('m-gacha'));
      requestAnimationFrame(() => fxChest('gacha-fx-canvas', r.grade, r.tagType === 'sell', false));
    } else {
      const best = res.reduce((b, r) => (rankOf(r.grade) > rankOf(b.grade) ? r : b), res[0]);
      const gold = res.reduce((a, r) => a + r.gold, 0), keys = res.reduce((a, r) => a + r.keys, 0);
      const tagC = { equip: 'var(--green)', key: 'var(--cyan)', sell: 'var(--orange)' };
      openModal('multi', 740, `${head} ${n}회 연속 개봉 결과!${leveled ? ` 🎉 상자 Lv.${S.chestLevel} 승급!` : ''}`,
        `<div class="mgrid"><canvas class="fx" id="multi-gacha-fx-canvas"></canvas>${res.map((r, i) => `<div class="mcard${r.tagType === 'equip' ? ' new' : ''}" style="border-color:${gcol(r.grade)};animation-delay:${i * 0.04}s"><small style="color:${gcol(r.grade)}">[${r.grade}]</small>${icon(r)}<b style="color:${gcol(r.grade)}">${r.name}</b><span class="t" style="color:${tagC[r.tagType]};border-color:${tagC[r.tagType]}">${r.tag}</span></div>`).join('')}</div>
        <div class="mfoot"><span>📦 현재 소환 상자: Lv.${S.chestLevel}</span><span style="color:var(--gold)">자동 정산 합계: +${fmt(gold)}G${keys ? ` · 열쇠 🗝️ +${keys}개` : ''}</span></div><button class="btn orange full" onclick="closeModal('multi')">확인 [Enter]</button>`);
      paintIcons($('m-multi'));
      requestAnimationFrame(() => fxChest('multi-gacha-fx-canvas', best.grade, false, true));
    }
  } else {
    // 50회 이상 대량 오픈 (100회, 1,000회, 10,000회): 일괄 연산 및 깔끔한 대형 요약 모달 (브라우저 렉 방지)
    const counts = { '일반': 0, '희귀': 0, '영웅': 0, '전설': 0, '신화': 0 };
    let totalGold = 0, totalKeys = 0;
    const highlights = [];
    for (let i = 0; i < n; i++) {
      const r = openOne(type);
      counts[r.grade] = (counts[r.grade] || 0) + 1;
      totalGold += r.gold || 0;
      totalKeys += r.keys || 0;
      if (r.tagType === 'equip' || rankOf(r.grade) >= 3) {
        if (highlights.length < 8 && !highlights.some(h => h.name === r.name)) highlights.push(r);
      }
      if (addChestExp()) leveled = true;
    }
    save(); refreshAll();

    const summaryHtml = `
      <div class="finfo" style="font-size:.84rem;text-align:center"><b style="color:var(--gold)">⚡ ${head} ${fmt(n)}회 초고속 일괄 오픈 완료!</b>${leveled ? ` <span style="color:var(--green)">🎉 상자 Lv.${S.chestLevel} 달성!</span>` : ''}</div>
      <div class="batch-summary">
        ${GRADES.map(g => `<div class="batch-tier-box" style="border-color:${gcol(g)}"><div style="color:${gcol(g)};font-size:.76rem;font-weight:bold">${g}</div><div class="num" style="color:${gcol(g)}">${fmt(counts[g])}개</div><small style="color:var(--dim)">(${((counts[g] / n) * 100).toFixed(1)}%)</small></div>`).join('')}
      </div>
      ${highlights.length ? `<div style="font-size:.78rem;font-weight:bold;color:var(--cyan);margin-top:6px">✨ 주목할 만한 최고 획득 아이템 / 신규 장착:</div><div class="batch-highlights">${highlights.map(r => `<div class="batch-highlight-card" style="border-color:${gcol(r.grade)}">${icon(r)}<span style="color:${gcol(r.grade)}">[${r.grade}] ${r.name}</span><small style="color:var(--green)">${r.tag}</small></div>`).join('')}</div>` : ''}
      <div class="mfoot" style="margin-top:10px">
        <span>📦 현재 상자: Lv.${S.chestLevel}</span>
        <span style="color:var(--gold);font-weight:bold">정산 합계: +${fmt(totalGold)}G${totalKeys ? ` · 환급 열쇠 🗝️ +${totalKeys}개` : ''}</span>
      </div>
      <button class="btn orange full" onclick="closeModal('multi')">확인 [Enter]</button>
    `;
    openModal('multi', 680, `${head} ${fmt(n)}회 일괄 오픈 요약 결과`, summaryHtml);
    paintIcons($('m-multi'));
  }
}
function paintIcons(root) {
  root.querySelectorAll('canvas[data-icon]').forEach(cv => { const [k, g, n] = cv.dataset.icon.split('|'); drawItemIcon(cv, k, g, n); });
}

// ----- 스킬 관리 -----
const SKILLS_T = '⚡ 스킬 선택 장착 &amp; 옵션 재조정';
function sortBar() { return `<div class="sortbar">${[['default', '📋 기본순'], ['atk', '⚔️ 공격력순'], ['grade', '💎 등급순']].map(([k, l]) => `<button class="btn mini ${UI.sort === k ? 'on gold' : ''}" onclick="setSort('${k}')">${l}</button>`).join('')}</div>`; }
function setSort(k) { UI.sort = k; refreshAll(); refreshModal('skills', SKILLS_T, skillsHtml()); }
function skillsHtml() {
  const h = S.hero, st = stats(), eq = h.equippedSkills;
  const deck = [0, 1, 2, 3].map(i => {
    const n = eq[i], sk = n && ownedSkill(n), aw = UI.pending ? ' await' : '';
    if (!sk) return `<div class="dcard${aw}"><small>슬롯 ${i + 1} (비어있음)</small><div class="big">➕</div><small style="color:var(--dim)">미장착 슬롯</small>${UI.pending ? `<button class="btn mini green" onclick="assignSlot(${i})">여기에 장착</button>` : ''}</div>`;
    return `<div class="dcard full${aw}"><small style="color:var(--gold)">슬롯 ${i + 1}</small><div class="big">${sk.icon}</div><b style="color:${gcol(sk.grade)}">${sk.name}</b><small>Lv.${sk.level} · 쿨 ${sk.maxCooldown}턴</small><small style="color:var(--orange-g)">피해 ~${fmt(skillEst(sk, st))}</small>${sk.specialOption ? `<span class="opt ${sk.specialOption.rank}" style="font-size:.58rem">[${sk.specialOption.rank}] ${OPT_TYPES[sk.specialOption.type].label}+${sk.specialOption.value}%</span>` : ''}
      <div class="bts">${UI.pending ? `<button class="btn mini green" onclick="assignSlot(${i})">여기에 교체</button>` : `<button class="btn mini" ${i === 0 ? 'disabled' : ''} onclick="moveSlot(${i},-1)">◀</button><button class="btn mini" ${i >= eq.length - 1 ? 'disabled' : ''} onclick="moveSlot(${i},1)">▶</button><button class="btn mini red" onclick="unequip(${i})">해제</button>`}</div></div>`;
  }).join('');
  const inv = sortedSkills(UI.sort).map(sk => {
    const si = eq.indexOf(sk.name);
    const act = si >= 0 ? `<button class="btn mini red" onclick="unequip(${si})">장착 해제 (슬롯${si + 1})</button>` : eq.length < 4 ? `<button class="btn mini green" onclick="equipSkill('${sk.name}')">➕ 장착</button>` : `<button class="btn mini orange" onclick="startReplace('${sk.name}')">🔄 슬롯 교체</button>`;
    return `<div class="srow${si >= 0 ? ' eq' : ''}"><div class="l"><span><span style="color:${gcol(sk.grade)}">[${sk.grade}]</span> ${sk.icon} <b>${sk.name}</b> <span style="color:var(--cyan)">Lv.${sk.level}</span></span><small style="color:var(--sub)">예상 피해량: ${fmt(skillEst(sk, st))} · 쿨타임 ${sk.maxCooldown}턴</small>${sk.specialOption ? optPill(sk.specialOption) : '<small style="color:var(--dim)">특수 옵션 없음</small>'}</div><div class="bts"><button class="btn mini cyan" onclick="openReroll('${sk.name}')">🧬 옵션</button>${act}</div></div>`;
  }).join('');
  return `<div style="font-size:.78rem;color:var(--sub)">전투에 사용할 스킬을 최대 4개까지 선택하여 장착할 수 있습니다. (AUTO 모드 시 1번 → 4번 슬롯 순서로 우선 시전)</div>
    ${UI.pending ? `<div style="color:var(--green);font-weight:bold">🎯 [${UI.pending}] 스킬을 장착할 1~4번 슬롯을 선택하세요!</div>` : ''}
    <div class="deck">${deck}</div>
    <div class="strip" style="border-color:var(--iron)"><span>현재 시전 모드: ${h.autoCast ? '<b style="color:var(--gold)">자동 시전 (AUTO - 1~4슬롯 순차 발동)</b>' : '<b style="color:var(--cyan)">수동 선택 (MANUAL - 직접 클릭 시전)</b>'}</span><button class="btn mini orange" onclick="toggleAuto()">🔄 자동 / 수동 모드 전환</button></div>
    <div class="ptitle" style="margin:0">📚 보유 스킬 목록 ${sortBar()}</div><div class="skill-list" style="max-height:240px">${inv}</div><button class="btn full" onclick="closeModal('skills')">닫기 [ESC]</button>`;
}
function openSkills() { openModal('skills', 640, SKILLS_T, skillsHtml()); }
function skillsChanged() { save(); refreshAll(); refreshModal('skills', SKILLS_T, skillsHtml()); }
function equipSkill(n) { const eq = S.hero.equippedSkills; if (eq.length < 4 && !eq.includes(n)) eq.push(n); skillsChanged(); }
function startReplace(n) { UI.pending = n; if (!isOpen('skills')) openSkills(); else skillsChanged(); }
function assignSlot(i) {
  const eq = S.hero.equippedSkills, n = UI.pending; if (!n) return;
  const j = eq.indexOf(n); if (j >= 0) eq.splice(j, 1);
  if (i < eq.length) eq[i] = n; else eq.push(n);
  UI.pending = null; skillsChanged();
}
function unequip(i) { S.hero.equippedSkills.splice(i, 1); skillsChanged(); }
function moveSlot(i, d) { const eq = S.hero.equippedSkills, j = i + d; if (j < 0 || j >= eq.length) return;[eq[i], eq[j]] = [eq[j], eq[i]]; skillsChanged(); }
function toggleAuto() {
  S.hero.autoCast = !S.hero.autoCast; save();
  if (S.battle.inBattle) { if (S.hero.autoCast && S.battle.isPlayerTurn) scheduleAuto(); else if (!S.hero.autoCast) clearAuto(); }
  skillsChanged();
}

// ----- 옵션 재조정 -----
const REROLL_T = '🧬 스킬 특수 옵션 재조정';
function rerollHtml() {
  const sk = ownedSkill(UI.rerollName); if (!sk) return '';
  const cost = REROLL_COST[sk.grade], c = gcol(sk.grade);
  return `<div class="panel" style="border-color:${c};text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center"><div style="font-size:2rem">${sk.icon}</div><b style="color:${c}">[${sk.grade}] ${sk.name} Lv.${sk.level}</b><small style="color:var(--sub)">기본 피해 ${sk.baseDmg} + 공격력 × ${sk.atkRatio} (쿨타임 ${sk.maxCooldown}턴)</small>
    ${sk.specialOption ? `<span class="opt ${sk.specialOption.rank}" style="font-size:.85rem;padding:4px 10px">${optText(sk.specialOption)}</span>` : '<small style="color:var(--dim)">현재 부여된 특수 옵션이 없습니다.</small>'}</div>
    <div class="finfo" style="font-size:.74rem;line-height:1.5"><b style="color:var(--gold)">🎲 등장 가능 특수 옵션 풀 (C ~ SS 등급):</b><span>• 최종 피해량 증폭 (+15% ~ +95%) · 적 방어력 관통 (+15% ~ +75%)</span><span>• 스킬 치명타 확률 (+10% ~ +55%) · 스킬 치명타 피해 (+25% ~ +180%)</span><span>• 보스 추가 피해 (+20% ~ +125%) · 생명력 흡수 (+3% ~ +22%) · 쿨 1턴 단축</span></div>
    <div class="strip"><span>보유 골드: <b style="color:var(--gold)">${fmt(S.hero.gold)}G</b></span><span>1회 재조정 비용: <b style="color:var(--gold)">${fmt(cost)}G</b></span></div>
    <button class="btn orange full" ${S.hero.gold < cost ? 'disabled' : ''} onclick="doReroll()">🧬 특수 옵션 부여 / 재조정 (${fmt(cost)}G)</button><button class="btn full" onclick="closeModal('reroll')">닫기 [ESC]</button>`;
}
function openReroll(n) { UI.rerollName = n; openModal('reroll', 500, REROLL_T, rerollHtml()); }
function doReroll() {
  const sk = ownedSkill(UI.rerollName), cost = REROLL_COST[sk.grade];
  if (S.hero.gold < cost) return alert(`골드가 부족합니다! (옵션 재조정 비용: ${fmt(cost)}G)`);
  S.hero.gold -= cost; sk.specialOption = rollOption(); save();
  refreshModal('reroll', REROLL_T, rerollHtml()); refreshModal('skills', SKILLS_T, skillsHtml()); refreshAll();
}

// ----- 배속 -----
function openSpeed() {
  const html = !speedUnlocked()
    ? `<div style="color:var(--red);font-weight:bold">🔒 전투 배속 &amp; 스킵 기능 잠금 상태</div><div style="font-size:.8rem;color:var(--sub);line-height:1.6">Stage 10 보스를 클리어하고 11스테이지에 도달하면 2배속과 ⚡ 스킵(전투 생략) 모드가 해금됩니다!</div>`
    : [[1, '1배속 (기본 속도)'], [2, '2배속 (빠른 진행)'], ['skip', '⚡ 스킵 모드 (전투 화면 내 스킵 버튼 활성화)']].map(([v, l]) => `<button class="btn full ${S.battleSpeed === v ? 'orange' : v === 'skip' ? 'gold' : ''}" onclick="setSpeed(${v === 'skip' ? "'skip'" : v})">${l}</button>`).join('');
  openModal('speed', 460, '⏩ 전투 배속 설정', html + `<button class="btn full" onclick="closeModal('speed')">닫기 [ESC]</button>`);
}
function setSpeed(v) { S.battleSpeed = v; save(); closeModal('speed'); }

// ----- 도감 (수집률 프로그레스 바 & 구간 보상) -----
const CODEX_T = '📖 모험가 도감 &amp; 수집 달성 보상';
function codexHtml() {
  const C = codexBonus(), parts = Object.keys(STAT_SHORT).filter(k => C[k]).map(k => `${STAT_SHORT[k]} +${r1(C[k])}%`);
  const tabs = [
    ['swords', `🗡️ 검 (${CODEX.swords.length})`],
    ['armors', `🛡️ 방어구 (${CODEX.armors.length})`],
    ['skills', `✨ 스킬 (${CODEX.skills.length})`],
    ['monsters', `👹 몬스터 (${CODEX.monsters.length})`],
    ['pets', `🐾 펫 (${CODEX.pets.length})`],
    ['costumes', `🎭 코스튬 (${CODEX.costumes.length})`]
  ];
  const curTab = UI.codexTab || 'swords';
  const pct = Math.floor(codexCount() / codexTotal() * 100);

  const list = (CODEX[curTab] || []).map(e => {
    const c = S.codex[curTab]?.[e.id] || {}, lv = c.engraveLv || 0, un = !!c.unlocked;
    const desc = (e.fx || []).map(([k, v]) => STAT_DESC[k] ? STAT_DESC[k].replace('{v}', v) : `${k} +${v}`).join(' · ');
    const title = un ? `${e.icon ? e.icon + ' ' : ''}${e.name}` : '<span style="color:var(--dim)">??? (미발견)</span>';
    const cost = engraveCost(e.grade || '일반', lv);
    const right = !un ? '<span style="color:var(--dim)">🔒 미해금</span>' : lv >= 10 ? '<b style="color:var(--gold)">★ 각인 MAX</b>' : `<button class="btn mini gold" ${S.hero.gold < cost ? 'disabled' : ''} onclick="doEngrave('${curTab}','${e.id}')">✨ 각인 (${fmt(cost)}G)</button>`;
    return `<div class="ccard${lv ? ' en' : un ? ' un' : ''}"><div class="l" style="display:flex;flex-direction:column;gap:3px"><span><span style="color:${gcol(e.grade || '일반')}">[${e.grade || '기본'}]</span> <b>${title}</b> <span style="color:var(--gold-b)">각인 Lv.${lv}/10</span></span><small style="color:var(--sub)">${desc}</small>${lv ? `<small style="color:var(--green)">현재 영구 적용중: ${(e.fx || []).map(([k, v]) => `+${r1(v * lv)}%`).join(' · ')}</small>` : ''}</div>${right}</div>`;
  }).join('');

  const rewardsHtml = `
    <div class="codex-prog-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:.78rem;font-weight:bold">
        <span>📖 도감 수집률: <b style="color:var(--gold)">${codexCount()} / ${codexTotal()} (${pct}%)</b></span>
        <span style="color:var(--cyan)">수집 달성률 구간별 영구 스탯 &amp; 재화 보상</span>
      </div>
      <div class="codex-prog-bar">
        <div class="codex-prog-fill" style="width:${pct}%"></div>
        <div class="codex-prog-txt">${pct}% 수집 완료</div>
      </div>
      <div class="reward-tier-grid">
        ${CODEX_REWARDS.map(r => {
    const claimed = !!S.codexRewards[r.pct];
    const ready = pct >= r.pct && !claimed;
    const btn = claimed ? '<span style="color:var(--green);font-weight:bold">✓ 수령완료</span>' :
      ready ? `<button class="btn mini gold" onclick="claimCodexReward(${r.pct})">🎁 보상 수령</button>` :
        `<small style="color:var(--dim)">${r.pct}% 달성 시</small>`;
    return `
            <div class="reward-tier-card ${claimed ? 'claimed' : ready ? 'ready' : ''}">
              <b style="color:${ready ? 'var(--gold-b)' : 'var(--text)'}">${r.pct}% [${r.label}]</b>
              <div style="color:var(--cyan);font-size:.65rem;margin:2px 0">${Object.entries(r.bonus).map(([k, v]) => `${STAT_SHORT[k] || k} +${v}%`).join(', ')}</div>
              <div style="color:var(--gold);font-size:.65rem">+${fmt(r.gold)}G${r.keys ? ` · 🗝️${r.keys}개` : ''}${r.shards ? ` · 🌈${r.shards}개` : ''}</div>
              <div style="margin-top:3px">${btn}</div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;

  return `
    ${rewardsHtml}
    <div class="strip" style="border-color:var(--gold)">
      <span>보유 골드: <b style="color:var(--gold)">${fmt(S.hero.gold)}G</b></span>
      <button class="btn mini gold" onclick="doEngraveAll()">⚡ 가능한 도감 일괄 각인</button>
    </div>
    <div class="tabs4" style="margin:6px 0">${tabs.map(([k, l]) => `<button class="btn mini ${curTab === k ? 'orange' : ''}" onclick="UI.codexTab='${k}';refreshModal('codex',CODEX_T,codexHtml())">${l}</button>`).join('')}</div>
    <div class="mlist" style="max-height:300px">${list}</div>
    <button class="btn full" style="margin-top:6px" onclick="closeModal('codex')">닫기 [ESC]</button>
  `;
}
function openCodex() { openModal('codex', 700, CODEX_T, codexHtml()); }
function doEngrave(cat, id) { const r = engrave(cat, id); if (typeof r === 'number') alert(`골드가 부족합니다! (필요 골드: ${fmt(r)}G)`); refreshModal('codex', CODEX_T, codexHtml()); refreshAll(); }
function doEngraveAll() { const n = engraveAll(); alert(n ? `✨ 총 ${n}단계의 도감 영구 각인이 완료되었습니다!` : '현재 보유 골드로 각인할 수 있는 해금된 도감 항목이 없습니다.'); save(); refreshModal('codex', CODEX_T, codexHtml()); refreshAll(); }
function claimCodexReward(pct) {
  const r = CODEX_REWARDS.find(x => x.pct === pct);
  if (!r || S.codexRewards[pct]) return;
  const curPct = Math.floor(codexCount() / codexTotal() * 100);
  if (curPct < pct) return alert('아직 수집 달성률이 부족합니다!');
  S.codexRewards[pct] = true;
  if (r.gold) S.hero.gold += r.gold;
  if (r.keys) S.hero.keys += r.keys;
  if (r.shards) S.hero.rainbowShards = (S.hero.rainbowShards || 0) + r.shards;
  save(); refreshAll();
  refreshModal('codex', CODEX_T, codexHtml());
  alert(`🎉 도감 ${pct}% 달성 보상 수령 완료!\n${Object.entries(r.bonus).map(([k, v]) => `• ${STAT_SHORT[k] || k} +${v}% 영구 적용`).join('\n')}\n• 보상: +${fmt(r.gold)}G, 🗝️+${r.keys || 0}개, 🌈조각+${r.shards || 0}개`);
}

// ===== 신규 4대 콘텐츠 모달 및 핸들러 =====

// 1. 코스튬 상점
const COSTUME_T = '🎭 영웅 코스튬 상점 &amp; 외형 변경';
function costumesHtml() {
  const c = S.hero.costumes || {};
  const currentSkin = COSTUMES.skins.find(x => x.id === c.skin) || COSTUMES.skins[0];
  const currentAura = COSTUMES.auras.find(x => x.id === c.aura) || COSTUMES.auras[0];
  const currentCircle = COSTUMES.circles.find(x => x.id === c.circle) || COSTUMES.circles[0];
  const tabs = [['skins', '👔 스킨 의상'], ['auras', '✨ 무기 오라'], ['circles', '🌀 발밑 마법진']];
  const curTab = UI.costumeTab || 'skins';
  const list = COSTUMES[curTab];

  const cards = list.map(item => {
    const owned = c.owned.includes(item.id);
    const equipped = (curTab === 'skins' && c.skin === item.id) ||
      (curTab === 'auras' && c.aura === item.id) ||
      (curTab === 'circles' && c.circle === item.id);
    const bonusTxt = Object.entries(item.bonus || {}).map(([k, v]) => `${STAT_SHORT[k] || k} +${v}%`).join(' · ') || '기본 외형';
    let actBtn = '';
    if (equipped) {
      actBtn = '<button class="btn mini gold" disabled>장착 중</button>';
    } else if (owned) {
      actBtn = `<button class="btn mini cyan" onclick="equipCostume('${curTab}','${item.id}')">장착하기</button>`;
    } else {
      actBtn = `<button class="btn mini orange" ${S.hero.gold < item.cost ? 'disabled' : ''} onclick="buyCostume('${curTab}','${item.id}')">구매 (${fmt(item.cost)}G)</button>`;
    }
    return `
      <div class="costume-card ${equipped ? 'eq' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b style="color:${gcol(item.grade || '일반')}">${item.name}</b>
          <span class="tag ${GRADE_CLASS[item.grade || '일반']}">${item.grade || '기본'}</span>
        </div>
        <small style="color:var(--sub);min-height:28px">${item.desc}</small>
        <div style="color:var(--green);font-size:.72rem;font-weight:bold">효과: ${bonusTxt}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
          <span style="color:var(--gold);font-size:.76rem">${item.cost > 0 ? fmt(item.cost) + 'G' : '기본'}</span>
          ${actBtn}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="strip">
      <span>보유 골드: <b style="color:var(--gold)">${fmt(S.hero.gold)}G</b> · 장착: <span style="color:var(--cyan)">[${currentSkin.name}] / [${currentAura.name}] / [${currentCircle.name}]</span></span>
      <small style="color:var(--sub)">보유한 모든 코스튬은 컬렉션 패시브(스탯+)가 영구 적용됩니다!</small>
    </div>
    <div class="tabs4" style="margin:8px 0">
      ${tabs.map(([k, l]) => `<button class="btn mini ${curTab === k ? 'orange' : ''}" onclick="UI.costumeTab='${k}';refreshModal('costumes',COSTUME_T,costumesHtml())">${l}</button>`).join('')}
    </div>
    <div class="costume-grid">${cards}</div>
    <button class="btn full" style="margin-top:8px" onclick="closeModal('costumes')">닫기 [ESC]</button>
  `;
}
function openCostumes() { openModal('costumes', 720, COSTUME_T, costumesHtml()); }
function buyCostume(type, id) {
  const item = COSTUMES[type].find(x => x.id === id);
  if (!item || S.hero.gold < item.cost) return alert('골드가 부족합니다!');
  S.hero.gold -= item.cost;
  S.achievements.goldSpent = (S.achievements.goldSpent || 0) + item.cost;
  S.hero.costumes.owned.push(id);
  equipCostume(type, id);
  unlockCodex('costumes', id);
  save(); refreshAll();
  refreshModal('costumes', COSTUME_T, costumesHtml());
}
function equipCostume(type, id) {
  if (type === 'skins') S.hero.costumes.skin = id;
  if (type === 'auras') S.hero.costumes.aura = id;
  if (type === 'circles') S.hero.costumes.circle = id;
  save(); refreshAll();
  heroViews.forEach(v => v.draw());
  refreshModal('costumes', COSTUME_T, costumesHtml());
}

// 2. 펫 시스템
const PETS_T = '🐾 신비의 펫 둥지 &amp; 동행 육성';
function rollPet() {
  const r = Math.random() * 100;
  let g = '일반';
  if (r < 2.5) g = '전설';
  else if (r < 13) g = '영웅';
  else if (r < 42) g = '희귀';
  const pool = PET_TYPES.filter(p => p.grade === g);
  return pick(pool);
}
function hatchPet(n) {
  const cost = n * 3;
  if (S.hero.keys < cost) return alert(`소환 열쇠가 부족합니다! (필요: 🗝️${cost}개 / 현재 보유: 🗝️${S.hero.keys}개)`);
  S.hero.keys -= cost;
  const res = [];
  for (let i = 0; i < n; i++) {
    const p = rollPet();
    res.push(p);
    const owned = S.hero.pets.owned[p.id];
    if (!owned) {
      S.hero.pets.owned[p.id] = { level: 1, count: 1 };
      if (!S.hero.pets.equipped) S.hero.pets.equipped = p.id;
      unlockCodex('pets', p.id);
    } else {
      owned.count++;
    }
  }
  save(); refreshAll();
  if (n === 1) {
    const p = res[0];
    openModal('pethatch', 460, `🥚 펫 알 부화 성공!`,
      `<div class="reveal" style="text-align:center"><div style="font-size:3rem">${p.icon}</div>
      <div style="color:${p.col};font-weight:bold;font-size:1.1rem">[${p.grade}] ${p.name}</div>
      <div style="color:var(--cyan);font-size:.82rem">${p.role}: ${p.desc}</div>
      <div class="decision equip">새로운 펫 동료를 얻었습니다!</div></div><button class="btn orange full" onclick="closeModal('pethatch');openPets()">펫 둥지로 가기 [Enter]</button>`);
  } else {
    openModal('pethatch', 560, `🥚 펫 알 ${n}회 부화 완료!`,
      `<div class="finfo" style="text-align:center">총 ${n}개의 펫 알이 부화했습니다! (중복 시 진화 조각 축적)</div>
      <div class="batch-highlights">${res.map(p => `<div class="batch-highlight-card" style="border-color:${p.col}"><span style="font-size:1.4rem">${p.icon}</span><span style="color:${p.col}">[${p.grade}] ${p.name}</span></div>`).join('')}</div>
      <button class="btn orange full" onclick="closeModal('pethatch');openPets()">확인 [Enter]</button>`);
  }
}
function petsHtml() {
  const h = S.hero;
  const pets = h.pets || { owned: {}, equipped: null };
  const pulls = getChestMultiPulls(Math.floor(h.keys / 3));
  const hatchBtns = pulls.map(p => {
    const cost = p * 3;
    const cls = p === 1 ? '' : p === 10 ? 'cyan' : p === 100 ? 'gold' : p === 1000 ? 'orange' : 'purple';
    return `<button class="btn ${cls}" onclick="hatchPet(${p})">🥚 ${fmt(p)}개 부화 (🗝️${fmt(cost)})</button>`;
  }).join('');

  const petCards = PET_TYPES.map(p => {
    const info = pets.owned[p.id];
    const owned = !!info;
    const equipped = pets.equipped === p.id;
    const lv = info?.level || 1;
    const upCost = lv * 2500;
    const maxed = lv >= 30;

    let bts = '';
    if (!owned) {
      bts = '<small style="color:var(--dim)">🔒 미획득 (펫 알 부화 필요)</small>';
    } else {
      bts = `
        <div style="display:flex;gap:4px;width:100%;align-items:center;margin-top:auto">
          <button class="btn mini ${equipped ? 'gold' : 'cyan'}" style="flex:1" ${equipped ? 'disabled' : ''} onclick="equipPet('${p.id}')">${equipped ? '동행 중' : '동행 장착'}</button>
          <button class="btn mini green" style="flex:1" ${maxed || h.gold < upCost ? 'disabled' : ''} onclick="levelUpPet('${p.id}')">${maxed ? 'MAX' : `Lv.UP (${fmt(upCost)}G)`}</button>
        </div>
      `;
    }

    return `
      <div class="pet-card ${equipped ? 'eq' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b style="color:${p.col}"><span style="font-size:1.2rem">${p.icon}</span> ${p.name}</b>
          <span class="tag ${GRADE_CLASS[p.grade]}">${p.grade}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <canvas id="pet-card-${p.id}" width="32" height="32" style="background:#090b10;border:1px solid #232736"></canvas>
          <div style="font-size:.74rem">
            <div>레벨: <b style="color:${owned ? 'var(--cyan)' : 'var(--dim)'}">${owned ? `Lv.${lv} / 30` : '-'}</b></div>
            <div style="color:var(--gold);font-size:.68rem">역할: ${p.role}</div>
          </div>
        </div>
        <small style="color:var(--sub);font-size:.7rem">${p.desc}</small>
        ${owned ? `<small style="color:var(--green)">동행 효과: 공격력 +${(lv * 1.5).toFixed(1)}% · 체력 +${(lv * 2).toFixed(1)}%</small>` : ''}
        ${bts}
      </div>
    `;
  }).join('');

  return `
    <div class="strip">
      <div>보유 열쇠: <b style="color:#70a1ff">🗝️ ${h.keys}개</b> · 골드: <b style="color:var(--gold)">${fmt(h.gold)}G</b></div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${hatchBtns}</div>
    </div>
    <div style="font-size:.76rem;color:var(--sub);margin:4px 0">동행 중인 펫은 전투 중 3턴마다 고유 지원 스킬을 발동하며, 영웅의 스탯을 지속 강화합니다!</div>
    <div class="pet-grid">${petCards}</div>
    <button class="btn full" style="margin-top:8px" onclick="closeModal('pets')">닫기 [ESC]</button>
  `;
}
function openPets() {
  openModal('pets', 740, PETS_T, petsHtml());
  PET_TYPES.forEach(p => drawPet($(`pet-card-${p.id}`), p.id));
}
function equipPet(id) {
  S.hero.pets.equipped = id;
  save(); refreshAll();
  refreshModal('pets', PETS_T, petsHtml());
  PET_TYPES.forEach(p => drawPet($(`pet-card-${p.id}`), p.id));
}
function levelUpPet(id) {
  const p = S.hero.pets.owned[id];
  if (!p || p.level >= 30) return;
  const cost = p.level * 2500;
  if (S.hero.gold < cost) return alert(`골드가 부족합니다! (필요 골드: ${fmt(cost)}G)`);
  S.hero.gold -= cost;
  S.achievements.goldSpent = (S.achievements.goldSpent || 0) + cost;
  p.level++;
  save(); refreshAll();
  refreshModal('pets', PETS_T, petsHtml());
  PET_TYPES.forEach(q => drawPet($(`pet-card-${q.id}`), q.id));
}

// 3. 업적 시스템
const ACH_T = '🏆 영웅 업적의 전당 &amp; 열쇠/골드 수급';
function hasUnclaimedAchievements() {
  const ach = S.achievements || {};
  const claimed = ach.claimed || {};
  for (const a of ACHIEVEMENTS) {
    let curVal = 0;
    if (a.id === 'stage') curVal = S.maxStage;
    else if (a.id === 'kills') curVal = ach.kills || 0;
    else if (a.id === 'enhances') curVal = ach.enhances || 0;
    else if (a.id === 'goldSpent') curVal = ach.goldSpent || 0;
    else if (a.id === 'raids') curVal = ach.raids || 0;
    else if (a.id === 'codex') curVal = codexCount();
    for (let t = 0; t < a.tiers.length; t++) {
      if (curVal >= a.tiers[t] && !claimed[`${a.id}_${t}`]) return true;
    }
  }
  return false;
}
function achievementsHtml() {
  const ach = S.achievements || {};
  const claimed = ach.claimed || {};

  const list = ACHIEVEMENTS.map(a => {
    let curVal = 0;
    if (a.id === 'stage') curVal = S.maxStage;
    else if (a.id === 'kills') curVal = ach.kills || 0;
    else if (a.id === 'enhances') curVal = ach.enhances || 0;
    else if (a.id === 'goldSpent') curVal = ach.goldSpent || 0;
    else if (a.id === 'raids') curVal = ach.raids || 0;
    else if (a.id === 'codex') curVal = codexCount();

    const tierRows = a.tiers.map((goal, t) => {
      const isClaimed = !!claimed[`${a.id}_${t}`];
      const isReady = curVal >= goal && !isClaimed;
      const rew = a.rew[t];
      const rewTxt = `${rew.gold ? fmt(rew.gold) + 'G ' : ''}${rew.keys ? '🗝️' + rew.keys + '개 ' : ''}${rew.shards ? '🌈조각' + rew.shards + '개' : ''}`;
      const btn = isClaimed ? '<span style="color:var(--green);font-size:.72rem">✓ 수령완료</span>' :
        isReady ? `<button class="btn mini gold" onclick="claimAchievement('${a.id}',${t})">🎁 보상 받기</button>` :
          `<small style="color:var(--dim)">진행중 (${fmt(curVal)}/${fmt(goal)})</small>`;
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:${isReady ? 'rgba(245,185,66,0.1)' : '#10131c'};border:1px solid ${isReady ? 'var(--gold)' : '#232838'};margin-top:2px">
          <span>Tier ${t + 1}: <b style="color:var(--text)">${a.desc.replace('{v}', fmt(goal))}</b></span>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="color:var(--gold);font-size:.72rem">${rewTxt}</span>
            ${btn}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="panel" style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <b><span style="font-size:1.1rem">${a.icon}</span> ${a.name}</b>
          <span style="color:var(--cyan);font-size:.75rem">현재 달성: <b>${fmt(curVal)}</b></span>
        </div>
        ${tierRows}
      </div>
    `;
  }).join('');

  return `
    <div class="strip">
      <span>업적을 완료하여 대량의 <b style="color:#70a1ff">소환 열쇠</b>와 <b style="color:var(--gold)">골드</b>, <b style="color:var(--pink)">무지개별 조각</b>을 획득하세요!</span>
      <button class="btn mini gold" onclick="claimAllAchievements()">⚡ 수령 가능한 보상 일괄 수령</button>
    </div>
    <div style="max-height:420px;overflow-y:auto;padding-right:4px">${list}</div>
    <button class="btn full" style="margin-top:8px" onclick="closeModal('achievements')">닫기 [ESC]</button>
  `;
}
function openAchievements() { openModal('achievements', 700, ACH_T, achievementsHtml()); }
function claimAchievement(id, t) {
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (!a) return;
  const rew = a.rew[t];
  if (rew.gold) S.hero.gold += rew.gold;
  if (rew.keys) S.hero.keys += rew.keys;
  if (rew.shards) S.hero.rainbowShards = (S.hero.rainbowShards || 0) + rew.shards;
  S.achievements.claimed[`${id}_${t}`] = true;
  save(); refreshAll();
  refreshModal('achievements', ACH_T, achievementsHtml());
}
function claimAllAchievements() {
  const ach = S.achievements || {};
  let totalGold = 0, totalKeys = 0, totalShards = 0, count = 0;
  for (const a of ACHIEVEMENTS) {
    let curVal = 0;
    if (a.id === 'stage') curVal = S.maxStage;
    else if (a.id === 'kills') curVal = ach.kills || 0;
    else if (a.id === 'enhances') curVal = ach.enhances || 0;
    else if (a.id === 'goldSpent') curVal = ach.goldSpent || 0;
    else if (a.id === 'raids') curVal = ach.raids || 0;
    else if (a.id === 'codex') curVal = codexCount();
    for (let t = 0; t < a.tiers.length; t++) {
      if (curVal >= a.tiers[t] && !ach.claimed[`${a.id}_${t}`]) {
        const rew = a.rew[t];
        if (rew.gold) totalGold += rew.gold;
        if (rew.keys) totalKeys += rew.keys;
        if (rew.shards) totalShards += rew.shards;
        ach.claimed[`${a.id}_${t}`] = true;
        count++;
      }
    }
  }
  if (!count) return alert('현재 수령 가능한 업적 보상이 없습니다.');
  S.hero.gold += totalGold;
  S.hero.keys += totalKeys;
  S.hero.rainbowShards = (S.hero.rainbowShards || 0) + totalShards;
  save(); refreshAll();
  refreshModal('achievements', ACH_T, achievementsHtml());
  alert(`🏆 총 ${count}건의 업적 보상 일괄 수령 완료!\n• 골드: +${fmt(totalGold)}G\n• 열쇠: +${totalKeys}개\n• 무지개별 조각: +${totalShards}개`);
}

// 4. 차원 레이드 시스템
const RAID_T = '👹 차원 레이드 포탈 (고가치 거대 보스 토벌)';
function raidPortalHtml() {
  const cards = RAID_BOSSES.map(b => {
    const hasKeys = S.hero.keys >= b.keyReq;
    return `
      <div class="raid-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b style="color:${b.col};font-size:1.05rem">${b.icon} ${b.name}</b>
          <span class="tag ${GRADE_CLASS[b.grade]}">${b.grade} 레이드</span>
        </div>
        <div style="color:var(--sub);font-size:.74rem">${b.desc}</div>
        <div class="finfo" style="font-size:.72rem;line-height:1.5">
          <div>❤️ 체력: <b style="color:var(--red)">${fmt(b.hp)}</b> · 공격력: <b>${fmt(b.atk)}</b> · 방어: <b>${fmt(b.def)}</b></div>
          <div style="color:var(--orange-g)">⚡ 특수 패턴: ${b.pattern}</div>
          <div style="color:var(--gold)">🎁 처치 보상: +${fmt(b.goldRew)}G · 🌈 무지개별 조각 ×${b.shardRew}개 · 🗝️ 펫 소환 열쇠 ×${b.petRew}개</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
          <span style="color:#70a1ff;font-size:.8rem;font-weight:bold">입장권: 🗝️ ${b.keyReq}개</span>
          <button class="btn orange" ${hasKeys ? '' : 'disabled'} onclick="startRaidBattle('${b.id}')">⚔️ 레이드 도전 [15턴 제한]</button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="strip">
      <span>보유 소환 열쇠: <b style="color:#70a1ff">🗝️ ${S.hero.keys}개</b> · 보유 무지개별 조각: <b style="color:var(--pink)">🌈 ${S.hero.rainbowShards || 0}개</b></span>
      <small style="color:var(--sub)">15턴 제한! 강력한 레이드 보스를 격파하여 대장간 무지개별 각성 조각을 모으세요!</small>
    </div>
    <div class="raid-grid" style="grid-template-columns:1fr;gap:10px">${cards}</div>
    <button class="btn full" style="margin-top:8px" onclick="closeModal('raid')">닫기 [ESC]</button>
  `;
}
function openRaidPortal() { openModal('raid', 640, RAID_T, raidPortalHtml()); }
function startRaidBattle(bossId) {
  const b = RAID_BOSSES.find(x => x.id === bossId);
  if (S.hero.keys < b.keyReq) return alert(`소환 열쇠가 부족합니다! (필요: 🗝️${b.keyReq}개 / 현재 보유: 🗝️${S.hero.keys}개)`);
  S.hero.keys -= b.keyReq;
  closeModal('raid');
  battleSeq++; clearAuto(); FX.clearAll();
  const rh = S.hero; rh.hp = stats().maxHp; rh.potionCooldown = 0; rh.skills.forEach(sk => sk.cooldown = 0);
  S.repeatStage = null; save();
  $('log-box').innerHTML = ''; heroBattle.idle();
  S.battle.inBattle = true;
  S.battle.isRaid = true;
  S.battle.raidTurnsLeft = 15;
  S.battle.turn = 1;
  S.battle.isPlayerTurn = true;
  S.battle.monster = {
    name: `[차원 레이드] ${b.name}`,
    icon: b.icon,
    type: 'raid_' + b.id,
    isBoss: true,
    isRaid: true,
    raidId: b.id,
    hp: b.hp,
    maxHp: b.hp,
    atk: b.atk,
    def: b.def,
    gold: b.goldRew,
    shardRew: b.shardRew,
    petRew: b.petRew,
    bossWeapon: `${b.name}의 유물`,
    bossArmor: `${b.name}의 각인`,
  };
  switchScene('scene-battle');

  const ha = $('hero-actor');
  if (ha) { ha.classList.remove('dead', 'hurt'); ha.style.opacity = ''; ha.style.transform = ''; }
  heroBattle.idle();

  $('enemy-actor').classList.toggle('boss', true);
  $('enemy-actor').classList.remove('dead');
  $('enemy-actor').style.opacity = '';
  drawBattleBackdrop($('battle-bg'), 50);
  drawMonster($('monster-battle-canvas'), S.battle.monster.type, true);

  if ($('raid-timer-banner')) {
    $('raid-timer-banner').style.display = 'block';
    $('raid-turns-left').textContent = '15';
  }
  const bp = $('pet-battle-canvas');
  if (bp) {
    if (S.hero.pets?.equipped) { bp.style.display = 'block'; drawPet(bp, S.hero.pets.equipped); }
    else bp.style.display = 'none';
  }
  refreshAll();
  log(`🚨 [차원 레이드 경보] ${b.name}이(가) 차원의 문을 열고 강림했습니다! 15턴 내로 격파해야 합니다!`, 'enemy');
  if (S.hero.autoCast && S.battleSpeed !== 'skip') scheduleAuto();
}

// ----- 유물 -----
const RELIC_T = '🏺 고대 유물 발굴소 (최대 Lv.100)';
function relicsHtml() {
  return `<div class="strip"><span>보유 골드: <b style="color:var(--gold)">${fmt(S.hero.gold)}G</b><br><small style="color:var(--sub)">발굴 시 고대 유물을 획득하여 즉시 레벨업(최대 Lv.100)!</small></span><span style="display:flex;gap:6px"><button class="btn mini cyan" onclick="doDig(1)">⛏️ 1회 발굴 (1,000G)</button><button class="btn mini gold" onclick="doDig(10)">🏛️ 10회 발굴 (10,000G)</button></span></div>
  <div class="rgrid">${RELICS.map(r => {
    const lv = S.relics[r.id] || 0, unit = r.stat.startsWith('flat') ? '' : '%';
    return `<div class="relic${lv >= 100 ? ' max' : lv ? ' own' : ''}"><div class="ib" style="border-color:${gcol(r.grade)}"><canvas data-relic="${r.id}"></canvas></div><div style="display:flex;flex-direction:column;gap:3px"><b><span style="color:${gcol(r.grade)}">[${r.grade}]</span> ${r.name}</b><span style="color:${lv >= 100 ? 'var(--gold-b)' : 'var(--cyan)'}">Lv.${lv} / 100${lv >= 100 ? ' (MAX)' : ''}</span><small style="color:var(--sub)">${r.desc}</small><small style="color:var(--green)">적용 효과: +${r1(r.val * lv)}${unit}</small></div></div>`;
  }).join('')}</div><button class="btn full" onclick="closeModal('relics')">닫기 [ESC]</button>`;
}
function openRelics() { openModal('relics', 700, RELIC_T, relicsHtml()); paintRelics(); }
function paintRelics() { document.querySelectorAll('canvas[data-relic]').forEach(cv => drawRelicIcon(cv, cv.dataset.relic)); }
function doDig(n) {
  const r = excavate(n);
  if (r.err === 'max') return alert('모든 고대 유물이 이미 최대 레벨(Lv.100)에 도달했습니다!');
  if (r.err === 'gold') return alert(`골드가 부족합니다! (${n}회 발굴 필요 골드: ${fmt(r.cost)}G)`);
  const lines = Object.entries(r.lines).map(([id, k]) => { const x = RELICS.find(q => q.id === id); return `• [${x.grade}] ${x.name} +${k}Lv (현재 Lv.${S.relics[id]})`; });
  if (r.refund) lines.push(`• 만렙 유물 중복 환급: +${fmt(r.refund)}G`);
  refreshModal('relics', RELIC_T, relicsHtml()); paintRelics(); refreshAll();
  alert(`🏺 고대 유물 ${n}회 발굴 결과!\n` + lines.join('\n'));
}

// ----- 룬 -----
const RUNE_T = '💎 고대 룬 합성소 (일반 → 🌈 신화 무지개 별 5개)';
const tierBadge = (i) => (i >= 4 ? `<span class="rainbow-text">${RUNE_TIERS[i].badge}</span>` : `<span style="color:${RUNE_TIERS[i].color}">${RUNE_TIERS[i].badge}</span>`);
function setRowsHtml() {
  const T = runeSetTier();
  return RUNE_SETS.map((s, i) => `<div class="set-row${i <= T ? ' on' : ''}${i >= 4 ? ' myth' : ''}">${i >= 4 ? `<span class="rainbow-text">${s.label}</span>` : s.label} : HP+${fmt(s.hp)} / 공+${fmt(s.atk)} / 방+${fmt(s.def)}${s.fin ? ` / 최종피해+${s.fin}%` : ''} <b>(${i <= T ? '활성!' : '미완성'})</b></div>`).join('');
}
function runeSum() { const U = runeBonus(); return `공격력 +${fmt(U.atk)} · 방어력 +${fmt(U.def)} · 최대HP +${fmt(U.hp)}${U.fin ? ` · 최종피해 +${U.fin}%` : ''}`; }
function runesHtml() {
  const can = RUNE_TYPES.some(t => S.hero.runeCounts[t.id].slice(0, 8).some(n => n >= 3));
  return `<div class="strip"><div style="display:flex;flex-direction:column;gap:4px"><b style="color:var(--gold-b)">💎 룬 누적 스탯: ${runeSum()}</b><small style="color:var(--sub)">엘리트·보스 처치 시 일반 룬만 드랍됩니다. 동일 룬 3개를 합성하여 🌈 신화 ★★★★★ (무지개 별 5개)까지 승급하세요!</small></div><button class="btn mini rainbow" ${can ? '' : 'disabled'} onclick="doSynthAll()">⚡ 전체 일괄 합성</button></div>
  ${UI.runeBanner ? `<div class="strip" style="border-color:var(--gold)">${UI.runeBanner}</div>` : ''}
  <div class="runegrid">${RUNE_TYPES.map(t => `<div class="rcard"><b style="color:${t.color}">${t.icon} ${t.name}</b><small style="color:var(--sub)">${t.stat}</small>${RUNE_TIERS.map((tr, i) => { const n = S.hero.runeCounts[t.id][i]; return `<div class="rtier${i >= 4 ? ' myth' : ''}"><span>${tierBadge(i)} <small style="color:var(--sub)">(+${fmt(Math.floor(t.base * tr.mult))})</small></span><span>${n}개 ${i < 8 ? `<button class="btn mini green" ${n >= 3 ? '' : 'disabled'} onclick="doSynth('${t.id}',${i})">합성</button>` : '<b style="color:var(--gold)">MAX</b>'}</span></div>`; }).join('')}</div>`).join('')}</div>
  <b style="color:var(--gold);font-size:.82rem">✨ 3종 세트 완성 보너스 (힘 + 활력 + 수호 모두 해당 등급 이상 보유 시 누적 활성)</b>${setRowsHtml()}<button class="btn full" onclick="closeModal('runes')">닫기 [ESC]</button>`;
}
function openRunes() { UI.runeBanner = ''; openModal('runes', 760, RUNE_T, runesHtml()); }
function doSynth(id, i) { if (synthRune(id, i)) { const t = RUNE_TYPES.find(x => x.id === id); UI.runeBanner = `✨ 합성 성공! [${t.name}] ${RUNE_TIERS[i + 1].badge} 1개 획득!`; } refreshModal('runes', RUNE_T, runesHtml()); refreshAll(); }
function doSynthAll() { const r = synthAll(); UI.runeBanner = r.total ? `🎉 총 ${r.total}회 일괄 합성 완료! (${r.parts.join(' / ')})` : '⚠️ 합성 가능한 룬(동일 종류·등급 3개 이상)이 아직 없습니다.'; refreshModal('runes', RUNE_T, runesHtml()); refreshAll(); }

// ----- 캐릭터 -----
function renderCharacter(st) {
  const h = S.hero;
  $('char-stats').innerHTML = [
    ['최대 HP', 'var(--red)', fmt(st.maxHp)], ['공격력 (ATK)', 'var(--orange)', fmt(st.atk)], ['방어력 (DEF)', 'var(--cyan)', fmt(st.def)],
    ['피해 감소율 (최대 75%)', 'var(--green)', (dmgReduction(st.def) * 100).toFixed(1) + '%'], ['치명타 확률 / 피해', '#ffe37d', `${st.critRate.toFixed(1)}% / ${st.critDmg}%`],
    ['보스 추가 피해', 'var(--pink)', `+${st.bossDmg}%`], ['드랍률 / 골드 획득', '#70a1ff', `+${st.dropRate}% / +${st.goldPct}%`],
    ['도감+유물 스킬 증폭', 'var(--purple-g)', `+${st.skillAmp}%`], ['보유 골드 / 열쇠', 'var(--gold)', `${fmt(h.gold)}G / ${h.keys}개`],
  ].map(([l, c, v]) => `<div class="stat-row"><span style="color:${c}">${l}</span><b>${v}</b></div>`).join('');
  const card = (cls, icon, tag, name, nc, sub) => `<div class="gcard"><div class="ib${cls}">${icon}</div><div class="gi">${tag}<b style="color:${nc}">${name}</b><small>${sub}</small></div></div>`;
  const bs = h.bossSword, ba = h.bossArmor, U = runeBonus();
  const pills = RUNE_TYPES.map(t => { const a = h.runeCounts[t.id]; let hi = -1; a.forEach((n, i) => { if (n) hi = i; }); const tot = a.reduce((x, y) => x + y, 0); return `<span class="rpill" style="border-color:${hi >= 0 ? RUNE_TIERS[hi].color : '#2e3447'}">${t.icon} ${t.name}: ${hi >= 0 ? tierBadge(hi) : '미보유'} (보유 ${tot}개)</span>`; }).join('');
  const anyRune = RUNE_TYPES.some(t => h.runeCounts[t.id].some(n => n));
  const st2 = stats();
  const skills = sortedSkills(UI.sort).map(sk => { const si = h.equippedSkills.indexOf(sk.name); return `<div class="srow${si >= 0 ? ' eq' : ''}"><div class="l"><span>${si >= 0 ? `<span class="slot-tag">슬롯 ${si + 1}</span>` : '<span class="slot-tag off">미장착</span>'} <span style="color:${gcol(sk.grade)}">[${sk.grade}]</span> ${sk.icon} <b>${sk.name}</b> <span style="color:var(--cyan)">Lv.${sk.level}</span></span><small style="color:var(--sub)">예상 피해량: ${fmt(skillEst(sk, st2))} (쿨타임 ${sk.maxCooldown}턴)</small>${sk.specialOption ? optPill(sk.specialOption) : '<small style="color:var(--dim)">특수 옵션: 미각성</small>'}</div><button class="btn mini cyan" onclick="openReroll('${sk.name}')">🧬 옵션</button></div>`; }).join('');
  $('char-right').innerHTML = `<div class="panel"><div class="ptitle">⚔️ 장착 장비</div><div class="gear-grid">
    ${card('', '<canvas id="ci-sword"></canvas>', gtag(h.sword.grade, h.sword.grade + ' 검'), h.sword.name, 'var(--gold)', `${enhanceStatus(h.sword)} (공격력 +${fmt(equipBonus('sword'))})`)}
    ${card(' boss', '<canvas id="ci-bsword"></canvas>', '<span class="tag epic">보스 유물 무기</span>', bs.name, 'var(--purple-g)', `공격력 +${fmt(bs.attackBonus)}`)}
    ${card('', '<canvas id="ci-armor"></canvas>', gtag(h.armor.grade, h.armor.grade + ' 갑옷'), h.armor.name, 'var(--cyan)', `${enhanceStatus(h.armor)} (방어력 +${fmt(equipBonus('armor'))})`)}
    ${card(' boss', '<canvas id="ci-barmor"></canvas>', '<span class="tag epic">보스 유물 방어구</span>', ba.name, 'var(--purple-g)', `방어력 +${fmt(ba.defenseBonus)}`)}
  </div></div>
  <div class="panel"><div class="ptitle">💎 룬 보유 &amp; 세트 효과 (일반 드랍 → 합성 승급)<button class="btn mini green" onclick="openRunes()">🔨 룬 합성소 열기</button></div>
    ${anyRune ? `<div class="rune-pills">${pills}<span class="rpill" style="border-color:var(--gold);color:var(--gold-b)">📊 룬 총합: 공+${fmt(U.atk)} · 방+${fmt(U.def)} · HP+${fmt(U.hp)}${U.fin ? ` · 최종피해+${U.fin}%` : ''}</span></div>` : '<div style="color:var(--dim);font-size:.78rem;margin-bottom:10px">보유 중인 룬이 없습니다. (엘리트/보스 처치 시 일반 룬 드랍 → 합성 승급)</div>'}
    <div style="font-size:.78rem;margin-bottom:6px;font-weight:bold">3종 세트 완성 보너스 (누적 적용):</div>${setRowsHtml()}</div>
  <div class="panel"><div class="ptitle">✨ 장착 및 보유 스킬 <span style="display:flex;gap:4px;flex-wrap:wrap">${sortBar()}<button class="btn mini purple" onclick="openSkills()">⚡ 관리</button></span></div><div class="skill-list">${skills}</div></div>`;
  drawItemIcon($('ci-sword'), 'sword', h.sword.grade, h.sword.name); drawSwordIcon($('ci-bsword'), bs.attackBonus ? 6 : 0);
  drawItemIcon($('ci-armor'), 'armor', h.armor.grade, h.armor.name); drawArmorIcon($('ci-barmor'), ba.defenseBonus ? 6 : 0);
}

// ----- 대장간 -----
function goForge(t) { S.forgeTarget = t; save(); setBanner('🔨 모루가 준비되었습니다. 강화를 시도해 보세요!', ''); $('forge-ticker').innerHTML = ''; switchScene('scene-forge'); }
function setBanner(t, cls) { const b = $('forge-banner'); b.textContent = t; b.className = 'live-banner' + (cls ? ' ' + cls : ''); }
function ticker(html) { const t = $('forge-ticker'); t.insertAdjacentHTML('afterbegin', `<div>${html}</div>`); while (t.children.length > 20) t.lastChild.remove(); }
function renderForge() {
  const k = S.forgeTarget, e = S.hero[k], info = enhanceInfo(e), max = isMaxed(e), q = EQUIP[e.grade];
  drawItemIcon($('forge-item-canvas'), k, e.grade, e.name);
  $('forge-title').innerHTML = `<span style="color:${gcol(e.grade)}">${k === 'sword' ? swordTitle(e) : armorTitle(e)} ${enhanceStatus(e)}</span>`;
  $('forge-badge').textContent = starBadge(e);
  const cur = equipBonus(k), nxt = (() => { if (max) return cur; const c = JSON.parse(JSON.stringify(e)); stepUp(c); return equipBonus(k, c); })();
  const dis = UI.forgeBusy || max || S.hero.gold < info.cost ? 'disabled' : '';
  let actionBts = '';
  if (canRankUp(e)) {
    actionBts = `<button class="btn gold full" style="padding:14px;font-size:1rem" onclick="forgeRankUp('${k}')">👑 ${rankUpTarget(e)} 등급으로 무료 승급하기 (0G)</button>`;
  } else if (canInfuseRainbow(e)) {
    actionBts = `<button class="btn rainbow full" style="padding:14px;font-size:1rem" onclick="forgeRainbow('${k}')">🌟 큰 무지개별 완성 각성! (무지개별 조각 5개 소모 / 보유: ${S.hero.rainbowShards || 0}개)</button>`;
  } else {
    actionBts = `
      <button class="btn orange full" style="padding:14px" ${dis} onclick="forgeOnce()">🔨 1회 강화 시도</button>
      <button class="btn gold full" ${dis} onclick="forgeAuto()">⚡ 최대 단계까지 연속 강화</button>
    `;
  }

  $('forge-side').innerHTML = `<div class="tabs2"><button class="btn ${k === 'sword' ? 'orange' : ''}" ${UI.forgeBusy ? 'disabled' : ''} onclick="forgeTab('sword')">🗡️ 검 강화</button><button class="btn ${k === 'armor' ? 'orange' : ''}" ${UI.forgeBusy ? 'disabled' : ''} onclick="forgeTab('armor')">🛡️ 방어구 강화</button></div>
  <div class="finfo"><div class="r"><span>현재 강화 단계:</span><b style="color:var(--cyan)">${enhanceStatus(e)} → ${nextStepLabel(e)}</b></div>
  <div class="r"><span>현재 → 다음 보너스:</span><b style="color:var(--green)">+${fmt(nxt)} ${max ? '(최대치 도달)' : '(초월 강화 상승)'}</b></div>
  <div class="r"><span>1회 강화 비용:</span><b style="color:var(--gold)">${max ? '-' : fmt(info.cost) + ' Gold'}</b></div>
  <div class="r"><span>실패 보정 (장인의 기운):</span><b style="color:var(--green)">+${e.pityBonus.toFixed(1)}%</b></div>
  <div>최종 성공 확률 (기본 + 실패 보정):</div><div class="rate-bar"><div style="width:${max ? 100 : info.final}%"></div><span>${max ? 'MAX' : `${info.final.toFixed(1)}% (기본 ${info.base.toFixed(1)}% + 보정 ${e.pityBonus.toFixed(1)}%)`}</span></div>
  <div class="fhelp">• 일반~희귀: +10강 후 동별/은별/금별 5성까지 초월<br>• 영웅 금별5성 달성 시 → [전설 등급]으로 승급!<br>• 전설 금별5성 달성 시 → [신화 등급]으로 승급!<br>• 신화 금별5성 달성 시 → 차원 레이드 무지개별 조각 5개로 [🌟 큰 무지개별] 최종 각성!</div></div>
  ${actionBts}
  <button class="btn full" onclick="switchScene('scene-menu')">🏠 마을로 돌아가기 [ESC]</button>`;
}
function forgeTab(t) { if (UI.forgeBusy) return; S.forgeTarget = t; save(); setBanner('🔨 모루가 준비되었습니다. 강화를 시도해 보세요!', ''); $('forge-ticker').innerHTML = ''; refreshAll(); }
const wait = (ms) => new Promise(r => setTimeout(r, ms));
function hammerTap() { const hm = $('forge-hammer'); hm.classList.remove('tap'); void hm.offsetWidth; hm.classList.add('tap'); fxForgeTap(); }
async function forgeOnce() {
  if (UI.forgeBusy) return; const k = S.forgeTarget, e = S.hero[k], info = enhanceInfo(e);
  if (isMaxed(e) || S.hero.gold < info.cost) return;
  UI.forgeBusy = true; refreshAll();
  for (const t of ['🔨 땅!', '🔨 땅! 땅!', '🔥 땅! 땅! 땅!']) { setBanner(t, 'tapping'); hammerTap(); await wait(150); }
  const r = enhanceTry(k);
  if (r.ok) { setBanner(`✨ 땅땅땅! 강화 성공! → ${r.status}`, 'success'); ticker(`<span style="color:var(--green)">✨ [성공]</span> ${r.status} 달성! (-${fmt(r.cost)}G)`); fxForgeSuccess(false); FX.shake('forge-altar', 180, 6); }
  else { setBanner(`💥 깡... 강화 실패! (장인의 기운 +${r.gain}% 누적)`, 'fail'); ticker(`<span style="color:var(--red)">💥 [실패]</span> 단계 유지 · 보정 +${r.gain}% (누적 +${r.pity}%)`); fxForgeFail(false); FX.shake('forge-altar', 140, 4); }
  UI.forgeBusy = false; refreshAll();
}
async function forgeRankUp(kind) {
  if (doRankUp(kind)) {
    setBanner(`👑 축하합니다! ${kind === 'sword' ? '검' : '방어구'}이 상위 등급으로 무료 승급되었습니다!`, 'success');
    ticker(`<span style="color:var(--gold)">👑 [무료 승급 성공]</span> ${S.hero[kind].grade} 등급 [${S.hero[kind].name}] 탄생!`);
    fxForgeSuccess(true);
    refreshAll();
  }
}
function forgeRainbow(kind) {
  if (doInfuseRainbow(kind)) {
    setBanner(`🌟 축하합니다! 큰 무지개별 초월 각성이 완성되었습니다!`, 'success');
    ticker(`<span style="color:var(--pink)">🌟 [무지개별 완성]</span> 신화 장비의 궁극 각성이 활성화되었습니다!`);
    fxForgeSuccess(true);
    refreshAll();
  }
}

async function forgeAuto() {
  if (UI.forgeBusy) return; const k = S.forgeTarget; let n = 0, ok = 0;
  UI.forgeBusy = true; refreshAll();
  while (n < 60) {
    const e = S.hero[k]; if (isMaxed(e) || S.hero.gold < enhanceInfo(e).cost) break;
    n++; setBanner(`🔨 연속 단조 중... (${n}회차) 땅! 땅! 땅!`, 'tapping'); hammerTap(); await wait(95);
    const r = enhanceTry(k);
    if (r.ok) { ok++; setBanner(`✨ [${n}회차] 성공! → ${r.status}`, 'success'); ticker(`<span style="color:var(--green)">✨ [${n}회 성공]</span> → ${r.status}`); fxForgeSuccess(true); }
    else { setBanner(`💥 [${n}회차] 실패! (보정 +${r.pity}%)`, 'fail'); ticker(`<span style="color:var(--red)">💥 [${n}회 실패]</span> 보정 +${r.gain}% (누적 +${r.pity}%)`); fxForgeFail(true); }
    refreshAll(); await wait(75);
  }
  UI.forgeBusy = false;
  setBanner(`🏁 연속 단조 완료: 총 ${n}회 시도 / ${ok}회 성공 (${enhanceStatus(S.hero[k])})`, ok ? 'success' : 'fail');
  refreshAll();
}

// ===== 전투 =====
// 전투 세션 번호: 귀환/재입장 시 올라가며, 이전 전투의 예약 타이머·await 후속 처리를 무효화한다.
let battleSeq = 0;
const later = (fn, ms) => { const id = battleSeq; setTimeout(() => { if (id === battleSeq) fn(); }, ms); };
function clearAuto() { if (UI.autoTimer) clearTimeout(UI.autoTimer); UI.autoTimer = null; }
function scheduleAuto() { clearAuto(); if (!S.hero.autoCast || S.battleSpeed === 'skip') return; UI.autoTimer = setTimeout(() => { UI.autoTimer = null; runAuto(); }, actionDelay()); }
function log(text, cls = '') { const b = $('log-box'); b.insertAdjacentHTML('beforeend', `<div class="${cls}">${text}</div>`); while (b.children.length > 80) b.firstChild.remove(); b.scrollTop = b.scrollHeight; }
function floatText(text, onHero, color) {
  const v = $('battle-viewport'), a = $(onHero ? 'hero-actor' : 'enemy-actor'), vr = v.getBoundingClientRect(), r = a.getBoundingClientRect();
  const d = document.createElement('div'); d.className = 'float-dmg'; d.textContent = text; d.style.color = color;
  d.style.left = (r.left + r.width / 2 - vr.left) + 'px'; d.style.top = Math.max(10, r.top - vr.top - 10) + 'px';
  v.appendChild(d); setTimeout(() => d.remove(), 850);
}
function restartAnim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
function lunge(heroSide) {
  const a = $(heroSide ? 'hero-actor' : 'enemy-actor'), t = $(heroSide ? 'enemy-actor' : 'hero-actor');
  restartAnim(a, heroSide ? 'lunge-r' : 'lunge-l');
  if (heroSide) heroBattle.play('attack');
  setTimeout(() => { restartAnim(t, 'hurt'); if (!heroSide && S.battle.inBattle) heroBattle.play('hit'); }, 110);
}
function startBattle() {
  battleSeq++; clearAuto(); FX.clearAll();
  if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none';
  const h = S.hero, st = stats();
  h.hp = st.maxHp; h.potionCooldown = 0; h.skills.forEach(s => s.cooldown = 0);
  S.repeatStage = S.stage < S.maxStage ? S.stage : null;
  const mon = makeMonster(S.stage);
  PD.emit('battleStart', { monster: mon, stage: S.stage });
  S.battle = { inBattle: true, isRaid: false, raidTurnsLeft: 0, monster: mon, turn: 1, isPlayerTurn: true };
  unlockCodex('monsters', mon.type); if (mon.isElite) unlockCodex('monsters', 'elite');
  save();
  $('enemy-actor').classList.toggle('boss', mon.isBoss);
  switchScene('scene-battle');
  drawBattleBackdrop($('battle-bg'), S.stage);
  drawMonster($('monster-battle-canvas'), mon.type, mon.isBoss);
  $('enemy-actor').classList.remove('dead'); $('enemy-actor').style.opacity = '';

  // 영웅 상태 리셋: 사망 모션 및 투명도 완전 해제
  const ha = $('hero-actor');
  if (ha) { ha.classList.remove('dead', 'hurt'); ha.style.opacity = ''; }
  heroBattle.idle();

  // 등장 연출
  if (S.battleSpeed === 'skip') {
    if (ha) { ha.style.transition = 'none'; ha.style.transform = ''; }
    heroBattle.idle();
  } else {
    if (ha) { ha.style.transition = 'none'; ha.style.transform = 'translateX(-120px)'; }
    heroBattle.play('run', { loop: true });
    requestAnimationFrame(() => { if (ha) { ha.style.transition = 'transform .45s steps(6)'; ha.style.transform = ''; } });
    setTimeout(() => { if (S.battle.inBattle) { heroBattle.idle(); fxRunIn(); } if (ha) ha.style.transition = ''; }, 460);
  }
  $('log-box').innerHTML = '';
  const m = Math.floor(S.stage / 50);
  log(`⚔️ Stage ${S.stage} 입장! 전방에 [${mon.name}] 출현!${S.stage >= 50 ? ` [🔥 심연 각성 ${m}단계]` : ''}${S.repeatStage ? ' [🔁 반복 파밍 모드: 골드 보상 80%]' : ''}`, 'info');
  refreshAll();
  if (h.autoCast && S.battleSpeed !== 'skip') { clearAuto(); UI.autoTimer = setTimeout(() => { UI.autoTimer = null; runAuto(); }, Math.max(500, actionDelay())); }
}
function renderHud() {
  const h = S.hero, st = stats(), mon = S.battle.monster; if (!mon) return;
  if ($('raid-timer-banner')) $('raid-timer-banner').style.display = (S.battle.inBattle && S.battle.isRaid) ? 'block' : 'none';
  $('b-hero-hp').textContent = `${fmt(h.hp)}/${fmt(st.maxHp)}`; $('b-hero-bar').style.width = (h.hp / st.maxHp * 100) + '%';
  $('b-mon-hp').textContent = `${fmt(mon.hp)}/${fmt(mon.maxHp)}`; $('b-mon-bar').style.width = (mon.hp / mon.maxHp * 100) + '%';
  $('b-mon-name').textContent = mon.name; $('b-mon-icon').textContent = mon.icon;
  const k = stageKind(S.stage), zone = k === 'b50' ? `${Math.floor(S.stage / 50) * 50}층 심연 대군주` : k === 'boss' ? '보스 룸' : k === 'elite' ? '엘리트 구역' : (S.world === 'normal' ? '지하 복도' : curWorld().name);
  const b = $('b-stage'); b.textContent = `${WORLDS.length > 1 ? curWorld().icon + ' ' : ''}STAGE ${S.stage} (${zone})`; b.classList.toggle('abyss', S.stage >= 50);
  $('b-repeat').classList.toggle('on', !!S.repeatStage && S.stage < S.maxStage);
  $('b-turn').textContent = `턴 ${S.battle.turn}`;
  $('skip-overlay').classList.toggle('on', speedUnlocked() && S.battleSpeed === 'skip' && S.battle.inBattle);
}
function renderDock() {
  const h = S.hero, can = S.battle.inBattle && S.battle.isPlayerTurn, st = stats();
  const slot = (cls, dis, act, ic, nm, cd) => `<button class="dslot ${cls}" ${dis ? 'disabled' : ''} onclick="${act}"><span class="ic">${ic}</span><span class="nm">${nm}</span>${cd ? `<span class="cd">${cd}</span>` : ''}</button>`;
  let html = slot('hl', !can, 'playerAttack()', '🗡️', '공격');
  for (let i = 0; i < 4; i++) {
    const sk = h.equippedSkills[i] && ownedSkill(h.equippedSkills[i]);
    html += sk ? slot('', !can || sk.cooldown > 0, `playerSkill(${i})`, sk.icon, sk.name, sk.cooldown > 0 ? sk.cooldown : '') : slot('', true, '', '➖', '비어있음');
  }
  html += slot('', !can || h.potionCooldown > 0, 'playerPotion()', '🧪', `물약(${Math.round(st.potion * 100)}%)`, h.potionCooldown > 0 ? h.potionCooldown : '');
  html += slot('', false, 'toggleAuto()', '⚙️', h.autoCast ? 'AUTO' : 'MANUAL');
  html += speedUnlocked() ? slot(S.battleSpeed === 'skip' ? 'hl' : '', false, 'cycleSpeed()', '⏩', { 1: '1배속', 2: '2배속', skip: '⚡스킵' }[S.battleSpeed]) : slot('', true, '', '⏩', '🔒잠금');
  html += slot('red', false, 'retreat()', '🏃', '귀환[ESC]');
  $('dock').innerHTML = html;
}
function cycleSpeed() { S.battleSpeed = S.battleSpeed === 1 ? 2 : S.battleSpeed === 2 ? 'skip' : 1; save(); if (S.battleSpeed === 'skip') clearAuto(); else if (S.battle.isPlayerTurn) scheduleAuto(); refreshAll(); }
function retreat() { if (confirm('전투를 중단하고 마을 광장으로 귀환하시겠습니까?')) { S.battle.inBattle = false; battleSeq++; clearAuto(); if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none'; if (heroBattle) heroBattle.idle(); S.hero.hp = stats().maxHp; FX.clearAll(); switchScene('scene-menu'); } }
function nextFloor() { S.stage = S.maxStage; S.repeatStage = null; save(); startBattle(); }
function runAuto() {
  if (!S.battle.inBattle || !S.battle.isPlayerTurn || !S.hero.autoCast || S.battleSpeed === 'skip') return;
  const h = S.hero, st = stats();
  if (h.hp <= st.maxHp * 0.45 && h.potionCooldown <= 0) return playerPotion();
  const i = h.equippedSkills.findIndex(n => ownedSkill(n)?.cooldown === 0);
  if (i >= 0) return playerSkill(i);
  playerAttack();
}
function beginPlayerAct() { if (!S.battle.inBattle || !S.battle.isPlayerTurn) return false; clearAuto(); S.battle.isPlayerTurn = false; renderDock(); return true; }
async function playerAttack() {
  if (!beginPlayerAct()) return;
  const bid = battleSeq, mon = S.battle.monster, r = basicAttack(mon);
  PD.emit('attack', { monster: mon, result: r });
  lunge(true); fxHeroSlash(S.hero.sword.grade, r.crit);
  mon.hp = Math.max(0, mon.hp - r.dmg);
  if (r.crit) { FX.shake('battle-viewport', 150, 7); await FX.hitStop(hs(75)); }
  if (bid !== battleSeq) return;
  floatText(r.crit ? `CRIT -${fmt(r.dmg)}!` : `-${fmt(r.dmg)}`, false, r.crit ? '#fffa65' : '#ff9f43');
  log(r.crit ? `💥 치명타 베기! [${mon.name}]에게 ${fmt(r.dmg)} 피해!` : `🗡️ 모험가의 검격! [${mon.name}]에게 ${fmt(r.dmg)} 피해!`, r.crit ? 'crit' : 'hit');
  afterPlayer();
}
async function playerSkill(i) {
  const sk = ownedSkill(S.hero.equippedSkills[i]); if (!sk || sk.cooldown > 0) return;
  if (!beginPlayerAct()) return;
  const bid = battleSeq, mon = S.battle.monster, r = castSkill(sk, mon);
  PD.emit('skill', { skill: sk, monster: mon, result: r });
  lunge(true); heroBattle.play('skill'); fxSkill(sk, r.crit);
  mon.hp = Math.max(0, mon.hp - r.dmg);
  FX.shake('battle-viewport', 180, 7); await FX.hitStop(hs(70));
  if (bid !== battleSeq) return;
  floatText(`${r.crit ? 'CRIT ' : ''}-${fmt(r.dmg)}!`, false, r.crit ? '#fffa65' : '#c56cf0');
  if (r.heal) floatText(`+${fmt(r.heal)} HP`, true, '#2ed573');
  log(`✨ ${sk.icon} [${sk.name} Lv.${sk.level}]${r.crit ? ' 치명타!' : ''} ${fmt(r.dmg)} 피해!${r.heal ? ` (흡혈 +${fmt(r.heal)})` : ''}${r.cdCut ? ' [쿨감!]' : ''}`, 'skill');
  afterPlayer();
}
function playerPotion() {
  const h = S.hero; if (h.potionCooldown > 0 || !beginPlayerAct()) return;
  const st = stats(), heal = Math.min(st.maxHp - h.hp, Math.floor(st.maxHp * st.potion)); h.hp += heal; h.potionCooldown = 3;
  heroBattle.play('guard'); fxPotion();
  floatText(`+${fmt(heal)} HP`, true, '#2ed573');
  log(`🧪 회복 물약 복용! HP가 ${fmt(heal)} 회복되었습니다!`, 'win');
  afterPlayer();
}
// 🐾 펫 지원 스킬 데이터 (3턴마다 발동). dmg: 공격력 배율, healMax: 최대HP 비율, healDmg: 피해량 흡혈 비율, defCut: 적 방어력 감소 비율
const PET_SUPPORT = {
  slime:         { healMax: lv => 0.12 + lv * 0.005, color: '#2ed573', cls: 'win',   msg: (d, h) => `HP +${fmt(h)} 회복!` },
  bat:           { dmg: lv => 1.2 + lv * 0.08, healDmg: 0.4, color: '#a55eea', cls: 'skill', msg: (d, h) => `${fmt(d)} 피해 및 +${fmt(h)} 흡혈!` },
  baby_dragon:   { dmg: lv => 2.2 + lv * 0.12, color: '#ff7924', cls: 'skill', msg: (d) => `화염구로 ${fmt(d)} 폭발 피해!` },
  frost_wolf:    { dmg: lv => 1.8 + lv * 0.10, defCut: 0.25, color: '#00cec9', cls: 'skill', msg: (d) => `${fmt(d)} 피해 및 적 방어력 25% 영구 감소!` },
  thunder_beast: { dmg: lv => 2.8 + lv * 0.15, color: '#f5b942', cls: 'skill', msg: (d) => `벼락 강타로 ${fmt(d)} 감전 피해!` },
  forest_fairy:  { healMax: lv => 0.20 + lv * 0.01, color: '#2ed573', cls: 'win',   msg: (d, h) => `생명의 결계로 HP +${fmt(h)} 회복!` },
  phoenix:       { dmg: lv => 3.5 + lv * 0.20, healMax: () => 0.25, color: '#ff5e97', cls: 'win',   msg: (d, h) => `성광의 업화로 ${fmt(d)} 피해 및 HP +${fmt(h)} 회복!` },
  cerberus:      { dmg: lv => 4.2 + lv * 0.25, color: '#ff4757', cls: 'crit',  msg: (d) => `방어 관통 3연격으로 ${fmt(d)} 암흑 참격 피해!` },
};
// 장착한 펫의 지원 효과를 적용. silent=true 면 연출/로그 없이 수치만 반영(스킵 모드용). 적용했으면 true.
function petSupport(silent) {
  const id = S.hero.pets?.equipped, p = id && PET_BY_ID[id], def = id && PET_SUPPORT[id];
  if (!p || !def) return false;
  const lv = S.hero.pets.owned[id]?.level || 1, st = stats(), mon = S.battle.monster, h = S.hero;
  const dmg = def.dmg ? Math.floor(st.atk * def.dmg(lv)) : 0;
  const heal = def.healMax ? Math.floor(st.maxHp * def.healMax(lv)) : def.healDmg ? Math.floor(dmg * def.healDmg) : 0;
  if (dmg) mon.hp = Math.max(0, mon.hp - dmg);
  if (heal) h.hp = Math.min(st.maxHp, h.hp + heal);
  if (def.defCut) mon.def = Math.floor(mon.def * (1 - def.defCut));
  if (silent) return true;
  if (dmg) floatText(`-${fmt(dmg)}`, false, def.color);
  if (heal) floatText(`+${fmt(heal)} HP`, true, '#2ed573');
  log(`🐾 [펫 지원] ${p.icon} ${p.name}의 '${p.role}'! ${def.msg(dmg, heal)}`, def.cls);
  FX.shake('battle-viewport', 140, 5);
  return true;
}
function afterPlayer() {
  refreshAll();
  if (S.battle.monster.hp <= 0) return victory();

  if (S.hero.pets?.equipped && S.battle.turn % 3 === 0 && petSupport(false)) {
    refreshAll();
    if (S.battle.monster.hp <= 0) return victory();
  }
  later(enemyTurn, actionDelay());
}
async function enemyTurn() {
  if (!S.battle.inBattle) return;
  const bid = battleSeq;
  const mon = S.battle.monster, h = S.hero, breath = mon.isBoss && S.battle.turn % 3 === 0;
  const ev = PD.emit('enemyAttack', { monster: mon, breath, dmg: heroTaken(breath ? Math.floor(mon.atk * 1.65) : mon.atk) }), dmg = ev.dmg;
  lunge(false);
  if (breath) { fxBossBreath(); FX.shake('battle-viewport', 220, 9); await FX.hitStop(hs(80)); log(`🔥 [${mon.name}]의 화염 브레스! ${fmt(dmg)}의 치명적 피해!`, 'enemy'); }
  else { fxEnemyHit(); log(`👹 [${mon.name}]의 반격! ${fmt(dmg)} 피해! (방어 경감 적용)`, 'enemy'); }
  if (bid !== battleSeq) return;
  h.hp = Math.max(0, h.hp - dmg);
  floatText(`-${fmt(dmg)}`, true, '#ff4757');
  if (h.hp <= 0) { refreshAll(); return defeat(); }
  S.battle.turn++; if (h.potionCooldown > 0) h.potionCooldown--;
  h.skills.forEach(s => { if (s.cooldown > 0) s.cooldown--; });

  // 레이드 15턴 카운트다운 처리
  if (S.battle.isRaid) {
    S.battle.raidTurnsLeft--;
    if ($('raid-turns-left')) $('raid-turns-left').textContent = S.battle.raidTurnsLeft;
    if (S.battle.raidTurnsLeft <= 0) {
      refreshAll();
      return raidTimeOver();
    }
  }

  S.battle.isPlayerTurn = true; refreshAll();
  if (h.autoCast) scheduleAuto();
}
// 스킵: 같은 공식으로 즉시 시뮬레이션
function skipResolve() {
  if (!S.battle.inBattle || !speedUnlocked() || S.battleSpeed !== 'skip') return;
  clearAuto();
  const h = S.hero, mon = S.battle.monster; let rounds = 0;
  const raid = !!S.battle.isRaid;
  while (rounds < 250 && mon.hp > 0 && h.hp > 0 && (!raid || S.battle.raidTurnsLeft > 0)) {
    rounds++; const st = stats();
    if (h.hp <= st.maxHp * 0.45 && h.potionCooldown <= 0) { h.hp += Math.min(st.maxHp - h.hp, Math.floor(st.maxHp * st.potion)); h.potionCooldown = 3; }
    else { const sk = h.equippedSkills.map(ownedSkill).find(s => s && s.cooldown === 0); mon.hp = Math.max(0, mon.hp - (sk ? castSkill(sk, mon) : basicAttack(mon)).dmg); }
    if (mon.hp <= 0) break;
    if (h.pets?.equipped && S.battle.turn % 3 === 0) { petSupport(true); if (mon.hp <= 0) break; }
    const breath = mon.isBoss && S.battle.turn % 3 === 0;
    h.hp = Math.max(0, h.hp - heroTaken(breath ? Math.floor(mon.atk * 1.65) : mon.atk));
    if (h.hp <= 0) break;
    S.battle.turn++; if (h.potionCooldown > 0) h.potionCooldown--; h.skills.forEach(s => { if (s.cooldown > 0) s.cooldown--; }); if (raid) S.battle.raidTurnsLeft--;
  }
  log(`⚡ [스킵 결착] ${rounds}턴 만에 고속 전투 종료!`, 'info');
  refreshAll();
  if (mon.hp <= 0) victory(); else if (raid && h.hp > 0) raidTimeOver(); else defeat();
}
function raidTimeOver() {
  if (!S.battle.inBattle) return;
  clearAuto(); S.battle.inBattle = false;
  if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none';
  const mon = S.battle.monster, h = S.hero;
  const dmgPct = Math.min(100, Math.max(1, Math.floor((1 - mon.hp / mon.maxHp) * 100)));
  const compGold = Math.floor(mon.gold * (dmgPct / 100) * 0.4);
  h.gold += compGold;
  log(`⏳ [차원 붕괴] 15턴이 초과되어 차원의 문이 닫혔습니다! (입힌 피해: ${dmgPct}%)`, 'enemy');
  save(); refreshAll();
  later(() => showResult(false, `⏳ 15턴 시간 초과 (차원 붕괴)`, `
    <div style="color:var(--red);font-weight:bold;font-size:1rem">15턴 내에 보스를 처치하지 못했습니다!</div>
    <div style="font-size:.84rem;margin:6px 0">보스에게 총 <b style="color:var(--gold)">${dmgPct}%</b>의 피해를 입혔습니다.</div>
    <div style="font-size:.82rem;color:var(--cyan)">전투 기여 참가 보상: +${fmt(compGold)}G 지급</div>
    <div style="font-size:.76rem;color:var(--sub)">장비 승급, 룬 합성, 펫 성장으로 화력을 더욱 끌어올려 보세요!</div>
  `), 800);
}

function victory() {
  if (!S.battle.inBattle) return;
  clearAuto(); S.battle.inBattle = false;
  const mon = S.battle.monster, h = S.hero, st = stats(), cleared = S.stage, lines = [];
  fxVictory(mon.isBoss); if (mon.isBoss) FX.shake('battle-viewport', 300, 10);
  const ea = $('enemy-actor'); setTimeout(() => { ea.style.opacity = '0'; ea.classList.add('dead'); }, 250);
  if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none';

  // 레이드 보스 처치 분기
  if (mon.isRaid) {
    h.gold += mon.gold;
    lines.push(`🪙 토벌 현상금: +${fmt(mon.gold)} G`);
    h.rainbowShards = (h.rainbowShards || 0) + (mon.shardRew || 1);
    lines.push(`🌈 무지개별 조각 +${mon.shardRew}개 획득! (대장간 무지개별 각성 재료)`);
    h.keys += (mon.petRew || 3);
    lines.push(`🗝️ 펫 소환 열쇠 +${mon.petRew}개 획득!`);
    S.achievements.raids = (S.achievements.raids || 0) + 1;
    S.achievements.kills = (S.achievements.kills || 0) + 1;
    save(); refreshAll();
    lines.forEach(l => log(l, 'win'));
    later(() => showResult(true, `👑 차원 레이드 토벌 대성공!`, `<div style="color:var(--gold);font-weight:bold;font-size:1.1rem">[${mon.name}] 처치 완료!</div>${lines.map(l => `<div style="font-size:.85rem;color:var(--text);margin-top:4px">${l}</div>`).join('')}`), 800);
    return;
  }
  S.achievements.kills = (S.achievements.kills || 0) + 1;
  let gold = Math.floor(mon.gold * (1 + st.goldPct / 100)); const rep = S.repeatStage && S.stage < S.maxStage;
  if (rep) gold = Math.max(1, Math.floor(gold * 0.8));
  h.gold += gold; lines.push(`🪙 골드 +${fmt(gold)} G${rep ? ' (반복 80%)' : ''}`);
  if (mon.isBoss) {
    const k = mon.is50 ? 8 : 4; h.keys += k; lines.push(`🗝️ 소환 열쇠 +${k}개 획득!`);
    lines.push(`💎 룬 획득: ${grantRunes(mon.is50 ? 6 : 3 + Math.floor(cleared / 20))}`);
    withHpDelta(() => {
      const atk = Math.min(20 + Math.floor(cleared * 2.5), 120 + cleared * 8);
      if (atk > h.bossSword.attackBonus) { h.bossSword = { name: mon.bossWeapon, grade: '보스 전용', attackBonus: atk, sellPrice: 150 }; lines.push(`🗡️ 보스 무기: [${mon.bossWeapon}] (공+${atk})`); }
      const def = Math.min(15 + Math.floor(cleared * 1.8), 80 + cleared * 5);
      if (def > h.bossArmor.defenseBonus) { h.bossArmor = { name: mon.bossArmor, grade: '보스 전용', defenseBonus: def, sellPrice: 120 }; lines.push(`🛡️ 보스 방어구: [${mon.bossArmor}] (방+${def})`); }
    });
    if (cleared === 10 && S.maxStage <= 10) lines.push('🎉 Stage 10 보스 격파! 전투 2배속 및 ⚡ 스킵 모드가 해금되었습니다!');
    if (mon.is50) lines.push(`🔥 ${cleared}층 심연 대군주 격파! 다음 구역은 한층 더 강력해집니다!`);
  } else if (mon.isElite) {
    if (Math.random() < Math.min(1, 0.95 + st.dropRate / 100 * 0.25)) { h.keys += 2; lines.push('🗝️ 소환 열쇠 +2개 획득!'); }
    lines.push(`💎 일반 룬 드랍: ${grantRunes(1 + Math.floor(cleared / 20))} (룬 합성소에서 승급 가능!)`);
  } else if (Math.random() < Math.min(0.98, 0.65 + st.dropRate / 100 * 0.35)) { h.keys += 1; lines.push('🗝️ 소환 열쇠 +1개 드랍!'); }
  PD.emit('victory', { monster: mon, stage: cleared, lines });
  S.stage = cleared + 1;
  if (S.stage > S.maxStage) { S.maxStage = S.stage; S.repeatStage = null; }
  save();
  lines.forEach(l => log(l, 'win'));
  refreshAll();
  later(() => showResult(true, `🏆 Stage ${cleared} 클리어!`, `<div style="color:var(--green);font-weight:bold;font-size:1rem">[${mon.name}] 토벌 성공!</div>${lines.map(l => `<div style="font-size:.82rem;color:${l.startsWith('🪙') ? 'var(--gold)' : l.startsWith('🗝️') ? '#70a1ff' : 'var(--text)'}">${l}</div>`).join('')}`, cleared), S.battleSpeed === 'skip' ? 350 : 900);
}
function defeat() {
  if (!S.battle.inBattle) return;
  clearAuto(); S.battle.inBattle = false;
  if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none';
  const h = S.hero, loss = Math.floor(h.gold * 0.08); h.gold -= loss; h.hp = stats().maxHp;
  PD.emit('defeat', { monster: S.battle.monster, stage: S.stage });
  heroBattle.play('death', { hold: true }); fxHeroDeath(); save();
  log('💀 모험가가 쓰러졌습니다...', 'enemy');
  later(() => showResult(false, '💀 전투 패배...', `<div style="color:var(--red);font-weight:bold;font-size:1rem">모험가가 쓰러졌습니다!</div><div style="font-size:.82rem">마을로 긴급 후송되어 HP가 모두 회복되었습니다.</div><div style="font-size:.82rem;color:var(--gold)">(소지 골드 일부 손실: -${fmt(loss)} G)</div><div style="font-size:.78rem;color:var(--sub)">영웅 훈련소 · 상자 소환 · 룬 합성 · 초월 강화로 전력을 키우세요!</div>`), 1100);
}
function showResult(win, title, html, clearedStage) {
  if (curScene() !== 'scene-battle') return;
  UI.resultWin = win;
  UI.clearedStage = clearedStage || (win ? S.stage - 1 : S.stage);
  const isRaid = S.battle && S.battle.isRaid;
  let btns = '';
  if (win) {
    if (isRaid) {
      btns = `<button class="btn gold full" onclick="resultHome()">🏠 마을로 귀환 [Enter]</button>`;
    } else {
      btns = `
        <div style="width:100%;text-align:center;font-size:.82rem;color:var(--cyan);margin-bottom:8px;padding:6px;background:#0d0e14;border:1px solid #2e3344">
          ⚔️ 다음 행동을 선택해 주세요:
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;width:100%">
          <button class="btn orange" style="flex:1;min-width:150px;padding:12px 10px;font-size:.82rem" onclick="resultNext()">⚔️ 다음 스테이지 진행 (Stage ${S.stage}) [Enter]</button>
          <button class="btn cyan" style="flex:1;min-width:150px;padding:12px 10px;font-size:.82rem" onclick="resultRepeat(${UI.clearedStage})">🔁 클리어 스테이지 반복 (Stage ${UI.clearedStage}) [R]</button>
          <button class="btn" style="flex:none;padding:12px 16px;font-size:.82rem" onclick="resultHome()">🏠 마을 [ESC]</button>
        </div>
      `;
    }
  } else {
    btns = `<button class="btn orange full" style="padding:12px" onclick="resultHome()">🏠 마을로 귀환 [ESC / Enter]</button>`;
  }
  openModal('result', 540, title, `<div class="reveal" style="min-height:160px">${html}</div><div class="res-btns" style="margin-top:12px">${btns}</div>`, { noX: true });
}
function resultNext() { closeModal('result'); if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none'; startBattle(); }
function resultRepeat(stageNum) { closeModal('result'); if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none'; setStage(stageNum); startBattle(); }
function resultHome() { closeModal('result'); FX.clearAll(); if ($('raid-timer-banner')) $('raid-timer-banner').style.display = 'none'; if (heroBattle) heroBattle.idle(); switchScene('scene-menu'); }

// ===== 입력 =====
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'start') switchScene('scene-menu');
  else if (a === 'reset') { if (confirm('정말로 모든 진행 데이터를 초기화하고 새로 시작하시겠습니까?')) { try { localStorage.removeItem(SAVE_KEY); } catch (_) { } location.reload(); } }
  else if (a === 'stage') setStage(S.stage + +b.dataset.d);
  else if (a === 'stage-max') setStage(S.maxStage);
  else if (a === 'stage-go') stageSearchGo();
  else if (a === 'stage-clear') { UI.query = ''; $('stage-search').value = ''; renderStageSelect(); }
  else if (a === 'menu') switchScene('scene-menu');
  else if (a === 'skip') skipResolve();
  else if (a === 'next-floor') nextFloor();
});
document.addEventListener('keydown', (e) => {
  const tg = e.target.tagName;
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tg)) { if (e.key === 'Escape') e.target.blur(); if (e.key === 'Enter' && e.target.id === 'stage-search') stageSearchGo(); return; }
  if (e.repeat && (e.key === 'Enter' || e.key === ' ')) return;
  if (isOpen('result')) { if (e.key === 'Enter') { e.preventDefault(); UI.resultWin ? resultNext() : resultHome(); } else if ((e.key === 'r' || e.key === 'R') && UI.resultWin && UI.clearedStage) { e.preventDefault(); resultRepeat(UI.clearedStage); } else if (e.key === 'Escape') { e.preventDefault(); resultHome(); } return; }
  if (modalStack.length) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); closeModal(modalStack[modalStack.length - 1]); } return; }
  const sc = curScene();
  if (sc === 'scene-title' && e.key === 'Enter') { e.preventDefault(); switchScene('scene-menu'); }
  else if (sc === 'scene-menu') { if (e.key === 'Enter') { e.preventDefault(); startBattle(); } if (e.key === 'Escape') { e.preventDefault(); switchScene('scene-title'); } }
  else if (sc === 'scene-battle') { if (e.key === 'Escape') retreat(); if ((e.key === 'Enter' || e.key === ' ') && S.battleSpeed === 'skip') { e.preventDefault(); skipResolve(); } }
  else if ((sc === 'scene-forge' || sc === 'scene-character') && e.key === 'Escape' && !UI.forgeBusy) switchScene('scene-menu');
});

// ===== 시작 =====
function init() {
  const steps = [
    () => load(),
    () => drawTitleBackdrop($('title-bg')),
    () => drawForgeBackdrop($('forge-bg')),
    () => { heroMenu = new HeroView($('menu-hero'), 'right', true); heroChar = new HeroView($('char-hero'), 'right', true); heroBattle = new HeroView($('hero-battle-canvas'), 'right'); },
    () => { $('stage-select').addEventListener('change', (e) => setStage(+e.target.value)); $('stage-search').addEventListener('input', (e) => { UI.query = e.target.value; renderStageSelect(); }); },
    () => setBanner('🔨 모루가 준비되었습니다. 강화를 시도해 보세요!', ''),
    () => refreshAll(),
    () => PD.emit('ready'),
  ];
  for (const s of steps) { try { s(); } catch (err) { console.error(err); } }
}

// ----- 월드 선택 (월드가 2개 이상일 때만 표시) -----
function renderWorldRow() {
  const row = $('world-row'); row.style.display = WORLDS.length > 1 ? '' : 'none';
  if (WORLDS.length < 2) return;
  const sel = $('world-select');
  if (document.activeElement !== sel) sel.innerHTML = WORLDS.map(w => `<option value="${w.id}"${w.id === S.world ? ' selected' : ''}>${w.icon} ${w.name}${w.mult && w.mult !== 1 ? ` (난이도 x${w.mult})` : ''}</option>`).join('');
  $('world-desc').textContent = curWorld().desc || '';
}
function setWorld(id) { S.world = id; S.repeatStage = null; save(); refreshAll(); }

// ----- 모드 목록 -----
function openModList() {
  const html = PD.mods.length ? PD.mods.map(m => `<div class="mrow" style="flex-direction:column;align-items:stretch"><div class="l"><b style="color:var(--purple-g)">🧩 ${m.name || m.id} <small style="color:var(--sub)">v${m.version || '-'}</small></b><small style="color:var(--sub)">${m.desc || ''}</small></div>
    ${PD.menuButtons.map((b, i) => b.mod === m.id ? `<button class="btn ${b.cls || ''} full" style="justify-content:flex-start" onclick="closeModal('mods');PD.menuButtons[${i}].onClick()">${b.label}${b.sub ? ` <small style="font-weight:normal;opacity:.8">· ${b.sub}</small>` : ''}</button>` : '').join('')}</div>`).join('')
    : '<div style="color:var(--sub);font-size:.85rem">불러온 모드가 없습니다. mods/mods.js 목록에 모드 폴더 이름을 추가하세요.</div>';
  openModal('mods', 520, `🧩 모드 관리 (${PD.mods.length}개)`, `<div class="mlist">${html}</div><small style="color:var(--sub)">모드 켜기/끄기: mods/mods.js 목록 수정 후 새로고침</small><button class="btn full" onclick="closeModal('mods')">닫기 [ESC]</button>`);
}

// ===== 모드 API: window.PD =====
// 모드는 mods/<id>/main.js 에서 PD.registerMod({...}) 를 호출한다. setup 은 저장 데이터 로드 전에 실행된다.
const PD = window.PD = {
  version: '1.0',
  mods: [],
  menuButtons: [],
  handlers: {},
  pfx: PFXLib,                   // pixelfx 코어 전체 (Particles, Lights, fit, sparkle, ...)
  // 게임 데이터/함수 직접 접근
  get state() { return S; },
  data: { WORLDS, SWORD_POOL, ARMOR_POOL, SKILLS, SKILL_BY_NAME, EQUIP, NORMAL_MONSTERS, ELITE_MONSTERS, BOSS_MONSTERS, CODEX, RELICS, RUNE_TYPES, PAL },
  stats: () => stats(), save: () => save(), refresh: () => refreshAll(), log: (t, cls = 'info') => log(t, cls),
  floatText: (t, onHero, color = '#fff') => floatText(t, onHero, color),

  on(ev, fn) { (this.handlers[ev] = this.handlers[ev] || []).push(fn); },
  emit(ev, payload) {
    for (const fn of this.handlers[ev] || []) { try { fn(payload); } catch (e) { console.error(`[mod] '${ev}' 핸들러 오류`, e); } }
    return payload;
  },

  // mods/mods.js 에서 호출: 목록의 모드 스크립트를 순서대로 동기 로드
  loadMods(ids) {
    if (document.readyState !== 'loading') return console.warn('[mod] loadMods 는 페이지 로딩 중에만 호출할 수 있습니다');
    for (const id of ids) {
      if (!/^[\w-]+$/.test(id)) { console.warn('[mod] 잘못된 모드 id', id); continue; }
      document.write(`<script src="mods/${id}/main.js" onerror="console.error('[mod] 로드 실패: mods/${id}/main.js')"><\/script>`);
    }
  },
  registerMod(mod) {
    if (!mod || !mod.id) return console.warn('[mod] id 가 없는 모드는 등록할 수 없습니다');
    if (this.mods.some(m => m.id === mod.id)) return console.warn('[mod] 중복 모드', mod.id);
    this.mods.push(mod);
    this._cur = mod.id;
    try { mod.setup && mod.setup(this); } catch (e) { console.error(`[mod] ${mod.id} setup 오류`, e); }
  },

  // 스킬 추가: { name, grade, baseDmg, atkRatio, maxCooldown, icon, fx?(h, m, P, sp), palette?, drawIcon?(ctx) }
  addSkill(def) {
    if (SKILL_BY_NAME[def.name]) return console.warn('[mod] 이미 있는 스킬', def.name);
    const s = { name: def.name, grade: def.grade || '일반', baseDmg: def.baseDmg || 100, atkRatio: def.atkRatio || 1, maxCooldown: def.maxCooldown || 2, icon: def.icon || '✨' };
    SKILLS.push(s); SKILL_BY_NAME[s.name] = s;
    CODEX.skills.push({ id: s.name, name: s.name, grade: s.grade, icon: s.icon, fx: [['skillPct', SKILL_CODEX_PCT[s.grade]]] });
    if (def.fx) SKILL_FX[s.name] = (h, m, P) => def.fx(h, m, P, sp);
    if (def.palette) SKILL_PAL_MOD[s.name] = def.palette;
    if (def.drawIcon) SKILL_ICON_MOD[s.name] = def.drawIcon;
  },
  // 일반 몬스터 추가(층 순환에 들어감): { id, name, icon, grade, codex:[stat,val], rows, pal, y } 또는 draw(ctx)
  addMonster(def) {
    NORMAL_MONSTERS.push([def.name, def.icon || '👾', def.id]);
    MON[def.id] = def.draw ? { draw: def.draw } : { rows: def.rows, pal: def.pal, y: def.y ?? 24 };
    const [k, v] = def.codex || ['goldPct', 3];
    CODEX.monsters.push({ id: def.id, name: def.name, grade: def.grade || '일반', icon: def.icon || '👾', fx: [[k, v]] });
  },
  // pixelfx 이펙트 등록: 모듈 형태 { meta, draw(p,t,o) } 또는 { meta, create(o) }
  addEffect(name, mod) { PFXLib.FX[name] = mod; },
  // 마을 메뉴 버튼: { label, sub, cls: ''|'orange'|'gold'|'purple'|'cyan'|'green'|'red', onClick }
  // 마을의 [🧩 모드] 창 안에 버튼을 추가: { label, sub, cls, onClick }
  addMenuButton(b) { this.menuButtons.push({ mod: this._cur, ...b }); },
  // 무기/방어구 추가: { name, grade, drawIcon?(ctx), codex?:[스탯, 값] } → 같은 등급 상자에서 자동 등장, 도감에도 추가
  addWeapon(def) { this._addGear('sword', def); },
  addArmor(def) { this._addGear('armor', def); },
  _addGear(kind, def) {
    const g = def.grade || '일반', pool = kind === 'sword' ? SWORD_POOL : ARMOR_POOL, list = kind === 'sword' ? CODEX.swords : CODEX.armors;
    if (!pool[g]) return console.warn('[mod] 잘못된 등급', g);
    if (pool[g].includes(def.name)) return console.warn('[mod] 이미 있는 장비', def.name);
    pool[g].push(def.name);
    if (def.drawIcon) ITEM_ICON_MOD[def.name] = def.drawIcon;
    list.push({ id: def.name, name: def.name, grade: g, fx: def.codex ? [def.codex] : list.find(e => e.grade === g).fx });
  },
  // 월드 추가: { id, name, icon, desc, mult, colors:{ sky:[위,중간,아래], pillar, pillarHi, torch, floor, brick },
  //            normal:[[이름, 아이콘, 아트타입]], elite:[...], boss:[[이름, 아이콘, 보스무기, 보스방어구, 아트타입?]] }
  addWorld(def) {
    if (WORLDS.some(w => w.id === def.id)) return console.warn('[mod] 이미 있는 월드', def.id);
    WORLDS.push({ mult: 1, normal: NORMAL_MONSTERS, elite: ELITE_MONSTERS, boss: BOSS_MONSTERS, ...def });
  },
  // 몬스터 그림만 등록(월드 전용 몬스터): { rows, pal, y } 또는 { draw(ctx) }
  addMonsterArt(id, art) { MON[id] = art.draw ? { draw: art.draw } : { rows: art.rows, pal: art.pal, y: art.y ?? 24 }; },

  // 모드 전용 모달
  openModal: (id, width, title, html) => openModal('mod-' + id, width, title, html),
  closeModal: (id) => closeModal('mod-' + id),
  // 이펙트 바로 띄우기(전투 캔버스): PD.fx('starPop', {x,y,...}, {speed, delay, cut})
  fx: (name, o, t) => sp(name, o, t),
  anchors: () => battleAnchors(),
};
PD.on('ready', () => {
  if (!PD.mods.length) return;
  const el = document.createElement('div');
  el.style.cssText = 'font-size:.75rem;color:var(--sub);text-align:center';
  el.textContent = '🧩 모드: ' + PD.mods.map(m => `${m.name || m.id}${m.version ? ' v' + m.version : ''}`).join(', ');
  document.querySelector('.title-actions')?.appendChild(el);
});

// 모든 선언(PD 포함)이 끝난 뒤 시작
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
