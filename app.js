/* ============================================================
   아이랑 (Airang) — 앱 메인 로직 v2.0
   ============================================================ */

'use strict';

// ══════════════════════════════════════════
// 1. 전역 상태 (State)
// ══════════════════════════════════════════
const STATE = {
  currentTab: 'home',
  currentGrowthTab: 'chart',
  currentDailyTab: 'feed',
  currentProfileTab: 'posts',
  currentStoryIndex: 0,
  currentStoryUserIndex: 0,
  storyTimer: null,
  storyProgress: 0,
  storyProgressTimer: null,
  aiProvider: 'gemini',
  selectedPlan: 'free',
  selectedPrivacy: 'public',
  selectedAgeTag: '0-6개월',
  selectedGender: 'boy',
  selectedBabyAvatar: '🍼',
  uploadFiles: [],
  uploadPreviewIndex: 0,
  feedFilter: '전체',
  exploreTagFilter: '전체',
};

// ══════════════════════════════════════════
// 2. 기본 데이터 (Default Data)
// ══════════════════════════════════════════
const DEFAULT_POSTS = [
  {
    id: 'p001', userId: 'user_minjun_mom', username: '민준맘 💛', avatar: '👶',
    avatarBg: 'linear-gradient(135deg,#FFE566,#FFD93D)',
    ageTag: '7-12개월', location: '서울 마포구', timeAgo: '2시간 전',
    media: [{ type: 'emoji', emoji: '👶🍼', caption: '오늘의 이유식 도전!', bg: 'linear-gradient(135deg,#FFF3B0,#FFE566)' },
            { type: 'emoji', emoji: '🥕✨', caption: '당근 퓨레 완성!', bg: 'linear-gradient(135deg,#FFE0B2,#FFCC80)' }],
    caption: '드디어 첫 이유식 성공! 🎉 당근 퓨레를 너무 잘 먹어서 엄마 감동받았어요 😭💛\n우리 민준이 이제 뭐든 잘 먹는 아이가 되길 바라며...',
    hashtags: '#이유식 #첫이유식 #8개월아기 #아이랑 #육아일기',
    likes: 128, liked: true, saved: false,
    comments: [{ avatar: '👩', username: '서아맘', text: '우리 서아도 당근 퓨레 완전 좋아해요! 다음엔 단호박도 해보세요 🥕' }],
    aiComment: '8개월 아기의 첫 이유식 성공 축하드려요! 🎉 당근은 베타카로틴이 풍부해서 첫 이유식으로 아주 좋은 선택이에요. 처음에는 1~2 티스푼부터 시작해서 점차 양을 늘려가시면 좋아요 💛',
    privacy: 'public', date: '2024년 1월 15일',
  },
  {
    id: 'p002', userId: 'user_seoa_dad', username: '서아파파 💚', avatar: '🧒',
    avatarBg: 'linear-gradient(135deg,#B8E6B8,#69DB7C)',
    ageTag: '13-24개월', location: '경기 성남', timeAgo: '5시간 전',
    media: [{ type: 'emoji', emoji: '🌳🧒', caption: '공원에서 첫 걸음마!', bg: 'linear-gradient(135deg,#B8E6B8,#E8F5E8)' }],
    caption: '오늘 서아가 공원에서 혼자 10걸음 걸었어요! 🚶‍♀️\n아빠 눈물 한 방울... 우리 딸 너무 대견해 💚\n이 순간을 절대 잊지 못할 것 같아요',
    hashtags: '#첫걸음마 #24개월 #아이성장 #아이랑 #육아일기 #감동',
    likes: 256, liked: false, saved: false,
    comments: [{ avatar: '👩', username: '지유맘', text: '대박! 서아 너무 잘하네요 💚 우리 지유도 곧 걸을 것 같아요!' }],
    aiComment: '24개월 아이의 10걸음 걷기는 정말 훌륭한 발달이에요! 💚 이 시기 아이들은 균형 감각이 빠르게 발달해요. 야외 활동이 대근육 발달에 큰 도움이 되니 공원 나들이를 자주 해주세요 🌳',
    privacy: 'public', date: '2024년 1월 15일',
  },
  {
    id: 'p003', userId: 'user_jiyu_mom', username: '지유맘 💜', avatar: '👧',
    avatarBg: 'linear-gradient(135deg,#E8D4F8,#C8A0E8)',
    ageTag: '25-36개월', location: '부산 해운대', timeAgo: '1일 전',
    media: [{ type: 'emoji', emoji: '🎨👧', caption: '오늘의 그림 그리기', bg: 'linear-gradient(135deg,#F3E5F5,#E1BEE7)' }],
    caption: '30개월 지유가 처음으로 엄마 얼굴을 그렸어요! 😍💜\n두 눈이 있고 큰 웃음이 있는 엄마... 너무 행복해서 울었어요',
    hashtags: '#30개월 #창의력발달 #미술놀이 #아이랑 #행복한육아',
    likes: 189, liked: false, saved: true,
    comments: [{ avatar: '👶', username: '민준맘', text: '너무 귀여워요 😍 예술가 탄생!' }],
    aiComment: '30개월 아이가 사람 얼굴을 그린다는 것은 인지 발달이 매우 잘 이루어지고 있다는 신호예요! 💜 미술 활동은 소근육 발달과 창의력 향상에 훌륭한 자극이 됩니다.',
    privacy: 'public', date: '2024년 1월 14일',
  },
  {
    id: 'p004', userId: 'user_hajun_mom', username: '하준맘 🧡', avatar: '🍼',
    avatarBg: 'linear-gradient(135deg,#FFD4B8,#FFC09F)',
    ageTag: '0-6개월', location: '서울 강남구', timeAgo: '3시간 전',
    media: [{ type: 'emoji', emoji: '😴🌙', caption: '수면 교육 3일차', bg: 'linear-gradient(135deg,#EEE,#DDD8F8)' }],
    caption: '드디어 하준이가 4시간 연속 자기 시작했어요! 🎉🧡\n수면 교육 시작한 지 3일째... 눈물의 3일이었지만 해냈어요!',
    hashtags: '#수면교육 #신생아 #4개월아기 #아이랑 #수면루틴',
    likes: 312, liked: false, saved: false,
    comments: [{ avatar: '🧒', username: '서아파파', text: '수면 교육 정말 힘들죠... 대단하세요 👍' }],
    aiComment: '4개월 아기의 수면 연장은 정말 큰 성취예요! 🧡 이 시기 아이들은 점차 하루 수면 패턴이 정착되기 시작해요. 일관된 수면 루틴을 유지하는 것이 중요합니다.',
    privacy: 'public', date: '2024년 1월 15일',
  },
];

const DEFAULT_STORIES = [
  { id: 's_me', username: '내 스토리', avatar: '👩', ring: 'add-ring', isMe: true, frames: [] },
  { id: 's1', username: '민준맘', avatar: '👶', ring: '', frames: ['👶🍼', '🥕✨', '😊💛'], timeAgo: '2시간 전' },
  { id: 's2', username: '서아파파', avatar: '🧒', ring: '', frames: ['🌳🧒', '🚶‍♀️🌟'], timeAgo: '5시간 전' },
  { id: 's3', username: '지유맘', avatar: '👧', ring: '', frames: ['🎨👧', '💜🌸'], timeAgo: '1일 전' },
  { id: 's4', username: '하준맘', avatar: '🍼', ring: 'viewed', frames: ['😴🌙', '🧡⭐'], timeAgo: '3시간 전' },
  { id: 's5', username: '예린맘', avatar: '🌟', ring: '', frames: ['🌟👧', '🎀💕'], timeAgo: '30분 전' },
];

const MILESTONES_DATA = [
  { id: 'm1', name: '목 가누기', age: '3-4개월', emoji: '👶', done: false },
  { id: 'm2', name: '뒤집기 (앞→뒤)', age: '4-5개월', emoji: '🔄', done: false },
  { id: 'm3', name: '뒤집기 (뒤→앞)', age: '5-6개월', emoji: '🔄', done: false },
  { id: 'm4', name: '혼자 앉기', age: '6-8개월', emoji: '🪑', done: false },
  { id: 'm5', name: '기어다니기', age: '7-10개월', emoji: '🐛', done: false },
  { id: 'm6', name: '잡고 서기', age: '8-10개월', emoji: '🧍', done: false },
  { id: 'm7', name: '첫 단어 (엄마/아빠)', age: '9-12개월', emoji: '💬', done: false },
  { id: 'm8', name: '혼자 서기', age: '9-12개월', emoji: '⬆️', done: false },
  { id: 'm9', name: '첫 걸음마', age: '10-14개월', emoji: '👣', done: false },
  { id: 'm10', name: '두 단어 연결', age: '18-24개월', emoji: '🗣️', done: false },
  { id: 'm11', name: '계단 오르기', age: '18-24개월', emoji: '🪜', done: false },
  { id: 'm12', name: '간단한 문장 말하기', age: '24-30개월', emoji: '💬', done: false },
];

const VACCINE_DATA = [
  { id: 'v1', name: 'BCG (결핵)', timing: '생후 4주 이내', done: false, status: 'upcoming' },
  { id: 'v2', name: 'B형 간염 (1차)', timing: '출생 직후', done: false, status: 'upcoming' },
  { id: 'v3', name: 'B형 간염 (2차)', timing: '생후 1개월', done: false, status: 'upcoming' },
  { id: 'v4', name: 'DTaP/IPV/Hib (1차)', timing: '생후 2개월', done: false, status: 'upcoming' },
  { id: 'v5', name: '폐렴구균 (1차)', timing: '생후 2개월', done: false, status: 'upcoming' },
  { id: 'v6', name: 'DTaP/IPV/Hib (2차)', timing: '생후 4개월', done: false, status: 'upcoming' },
  { id: 'v7', name: '폐렴구균 (2차)', timing: '생후 4개월', done: false, status: 'upcoming' },
  { id: 'v8', name: 'DTaP/IPV/Hib (3차)', timing: '생후 6개월', done: false, status: 'upcoming' },
  { id: 'v9', name: 'B형 간염 (3차)', timing: '생후 6개월', done: false, status: 'upcoming' },
  { id: 'v10', name: '인플루엔자 (매년)', timing: '생후 6개월~', done: false, status: 'upcoming' },
  { id: 'v11', name: 'MMR (홍역/풍진/볼거리)', timing: '생후 12-15개월', done: false, status: 'upcoming' },
  { id: 'v12', name: '수두', timing: '생후 12-15개월', done: false, status: 'upcoming' },
];

// WHO 성장 기준 데이터 (여아, 개월수: [3rd, 15th, 50th, 85th, 97th] 신장 cm)
const WHO_HEIGHT_FEMALE = {
  0: [45.6,47.5,49.1,51.0,52.9], 3: [55.4,57.3,59.8,62.3,63.9],
  6: [61.5,63.6,65.7,68.0,69.8], 9: [65.7,67.7,70.1,72.6,74.5],
  12: [69.2,71.4,74.0,76.6,78.6], 15: [72.2,74.4,77.5,80.1,82.2],
  18: [74.9,77.2,80.7,83.5,85.7], 24: [80.3,82.9,86.4,90.0,92.9],
  30: [85.1,87.8,91.4,95.2,98.0], 36: [88.6,91.5,95.1,99.0,102.0],
};
const WHO_HEIGHT_MALE = {
  0: [46.3,48.0,49.9,51.8,53.4], 3: [56.7,58.6,61.4,64.0,65.5],
  6: [63.0,64.9,67.6,70.3,72.0], 9: [67.5,69.4,72.3,75.2,77.1],
  12: [71.0,72.9,75.7,78.6,80.5], 15: [74.1,76.0,79.1,82.2,84.2],
  18: [76.9,78.9,82.3,85.7,87.8], 24: [82.3,84.6,87.8,91.2,93.6],
  30: [87.0,89.4,93.0,96.6,99.0], 36: [90.3,92.8,96.1,99.6,102.2],
};
const WHO_WEIGHT_FEMALE = {
  0: [2.4,2.8,3.2,3.7,4.2], 3: [4.3,5.0,5.8,6.6,7.5],
  6: [5.7,6.5,7.3,8.2,9.3], 9: [6.8,7.7,8.6,9.6,10.8],
  12: [7.7,8.7,9.6,10.8,12.0], 15: [8.4,9.4,10.5,11.8,13.1],
  18: [8.9,10.1,11.3,12.7,14.1], 24: [9.8,11.1,12.5,14.1,15.8],
  30: [10.6,12.0,13.7,15.4,17.3], 36: [11.3,12.9,14.6,16.5,18.6],
};
const WHO_WEIGHT_MALE = {
  0: [2.5,2.9,3.3,3.9,4.4], 3: [4.9,5.6,6.4,7.2,8.0],
  6: [6.4,7.1,7.9,8.8,9.8], 9: [7.5,8.3,9.2,10.3,11.4],
  12: [8.4,9.2,10.2,11.3,12.5], 15: [9.1,10.1,11.2,12.4,13.7],
  18: [9.7,10.7,11.9,13.3,14.7], 24: [10.8,11.9,13.3,14.8,16.4],
  30: [11.7,12.9,14.5,16.2,17.9], 36: [12.4,13.8,15.5,17.3,19.1],
};

// AI 응답 대본 (폴백용)
const AI_RESPONSES = {
  '수면': '수면 교육은 보통 생후 4-6개월이 적기예요 😴\n이 시기 아이들은 낮과 밤의 구분을 배우기 시작해요.\n\n✅ 핵심 팁:\n• 취침 시간을 일정하게 유지하세요\n• 밤 목욕 → 수유 → 동화책의 루틴을 만들어요\n• 방은 어둡고 조용하게\n• 졸릴 때 재우되 완전히 잠들기 전에 눕히세요\n\n⚠️ 6개월 미만은 수면 훈련보다 반응 육아가 더 중요해요!',
  '이유식': '이유식은 생후 만 4-6개월 사이에 시작하는 것이 좋아요 🥕\n\n📋 시작 신호:\n• 목을 가눌 수 있어요\n• 음식에 관심을 보여요\n• 혀 내밀기 반사가 사라졌어요\n\n🍽️ 시작 방법:\n• 쌀 미음부터 시작 (묽게 → 점차 농도 높이기)\n• 하루 1회, 1~2 티스푼부터\n• 새 식재료는 3~5일 간격으로 추가\n• 알레르기 반응을 꼭 확인하세요!',
  '예방접종': '💉 이번 달 예방접종 일정을 확인해드릴게요!\n\n성장 탭에서 아기 생년월일을 등록하시면 정확한 일정을 알 수 있어요.\n\n📋 주요 예방접종:\n• 생후 2개월: DTaP/IPV/Hib, 폐렴구균\n• 생후 4개월: DTaP/IPV/Hib (2차), 폐렴구균 (2차)\n• 생후 6개월: DTaP/IPV/Hib (3차), B형 간염 (3차)\n• 생후 12-15개월: MMR, 수두, 폐렴구균 (3차)\n\n⚠️ 접종 전날 발열이 있으면 주치의와 상담하세요!',
  '울음': '아기 울음 원인 파악 가이드예요 😭\n\n🔍 확인 순서:\n1. 배고픔: 마지막 수유 후 2-3시간 지났나요?\n2. 기저귀: 젖어있지 않나요?\n3. 졸림: 눈을 비비거나 귀를 잡나요?\n4. 불편함: 옷이 조이거나 온도가 맞지 않나요?\n5. 배앓이: 다리를 배로 당기나요?\n\n💛 달래기 방법:\n• 흔들기, 안아주기\n• 백색소음 들려주기\n• 가스 배출 마사지\n• 공갈 젖꼭지 사용\n\n38도 이상 발열이 있으면 즉시 병원에 가세요!',
  '발달': '아이의 발달 체크리스트를 알려드릴게요! 🧠\n\n📊 개월별 주요 발달:\n• 3-4개월: 목 가누기, 소리 내기\n• 6개월: 뒤집기, 이름에 반응\n• 9개월: 기어다니기, 낯가림\n• 12개월: 잡고 서기, 첫 단어\n• 18개월: 첫 걸음마 안정화, 10단어\n• 24개월: 두 단어 연결, 계단 오르기\n\n⚠️ 발달은 개인차가 있어요. 월령 범위를 많이 벗어난다면 소아과 상담을 권해드려요!',
  '치아': '아기 구강 관리 가이드예요 🦷\n\n🦷 이가 나는 시기:\n• 첫 이가 보통 6-10개월에 나와요\n• 만 3세쯤 유치 20개가 완성돼요\n\n🪥 관리법:\n• 첫 이 나오면 실리콘 칫솔로 부드럽게 닦아요\n• 18개월부터 불소 치약 (완두콩 크기) 사용\n• 만 1세부터 치과 검진 권장\n\n⚠️ 이 나는 시기 증상:\n• 잇몸 가려움, 침 많이 흘림\n• 체온 약간 상승 (38도 이하)\n• 냉장 치발기가 도움 돼요!',
};

// ══════════════════════════════════════════
// 3. LocalStorage 유틸리티
// ══════════════════════════════════════════
function saveState() {
  const data = {
    posts: APP.posts,
    babyProfile: APP.babyProfile,
    growthLogs: APP.growthLogs,
    milestones: APP.milestones,
    vaccines: APP.vaccines,
    dailyLogs: APP.dailyLogs,
    userProfile: APP.userProfile,
    subscription: APP.subscription,
    apiKeys: APP.apiKeys,
    stories: APP.stories,
    uploadCount: APP.uploadCount,
  };
  try { localStorage.setItem('airang_v2', JSON.stringify(data)); } catch(e) { console.warn('Storage save failed:', e); }
}

function loadState() {
  try {
    const raw = localStorage.getItem('airang_v2');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e) { return null; }
}

// ══════════════════════════════════════════
// 4. 앱 초기화
// ══════════════════════════════════════════
const APP = {
  posts: [],
  babyProfile: { name: '', birthdate: '', gender: 'boy', avatar: '🍼' },
  growthLogs: [],
  milestones: JSON.parse(JSON.stringify(MILESTONES_DATA)),
  vaccines: JSON.parse(JSON.stringify(VACCINE_DATA)),
  dailyLogs: { feed: [], solid: [], sleep: [], poop: [] },
  userProfile: { name: '육아맘', bio: '아이랑과 함께 소중한 순간을 기록 중 🌱', avatar: '👩' },
  subscription: { plan: 'free' },
  apiKeys: { gemini: '', openai: '' },
  stories: JSON.parse(JSON.stringify(DEFAULT_STORIES)),
  uploadCount: 0,
};

function initApp() {
  // 저장된 데이터 불러오기
  const saved = loadState();
  if (saved) {
    if (saved.posts?.length) APP.posts = saved.posts;
    if (saved.babyProfile?.name !== undefined) APP.babyProfile = saved.babyProfile;
    if (saved.growthLogs) APP.growthLogs = saved.growthLogs;
    if (saved.milestones) APP.milestones = saved.milestones;
    if (saved.vaccines) APP.vaccines = saved.vaccines;
    if (saved.dailyLogs) APP.dailyLogs = saved.dailyLogs;
    if (saved.userProfile) APP.userProfile = saved.userProfile;
    if (saved.subscription) APP.subscription = saved.subscription;
    if (saved.apiKeys) APP.apiKeys = saved.apiKeys;
    if (saved.uploadCount) APP.uploadCount = saved.uploadCount;
  }

  // 기본 게시물이 없으면 추가
  if (!APP.posts.length) APP.posts = JSON.parse(JSON.stringify(DEFAULT_POSTS));

  // 오늘 날짜를 기본값으로
  const logDateEl = document.getElementById('logDate');
  if (logDateEl) logDateEl.valueAsDate = new Date();
  const feedTimeEl = document.getElementById('feedTime');
  if (feedTimeEl) feedTimeEl.value = new Date().toTimeString().slice(0,5);

  // UI 업데이트
  renderStories();
  renderFeed();
  renderExploreGrid();
  updateBabyProfile();
  updateSidebar();
  renderVaccines();
  renderMilestones();
  renderGrowthLogs();
  renderCharts();
  updateProfileTab();
  updateSubscriptionUI();
  loadAPIKeyInputs();

  // 스플래시 숨기기
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    // 결제 완료 리다이렉트 처리
    handlePaymentReturn();
  }, 2200);
}

// ══════════════════════════════════════════
// 5. 탭 라우팅
// ══════════════════════════════════════════
function switchTab(tab) {
  STATE.currentTab = tab;

  // 화면 전환
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + tab);
  if (screen) screen.classList.add('active');

  // 네비 활성화
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + tab);
  if (navEl) navEl.classList.add('active');

  // 헤더 숨김 여부
  const header = document.getElementById('mainHeader');
  header.style.display = (tab === 'growth' || tab === 'explore') ? 'flex' : 'flex';

  // 탭별 추가 동작
  if (tab === 'profile') updateProfileTab();
  if (tab === 'growth')  { renderGrowthLogs(); renderCharts(); }
}

// ══════════════════════════════════════════
// 6. 스토리 렌더링
// ══════════════════════════════════════════
function renderStories() {
  const track = document.getElementById('storiesTrack');
  if (!track) return;
  track.innerHTML = APP.stories.map((s, idx) => `
    <div class="story-item" onclick="${s.isMe ? "openModal('uploadModal')" : `openStory(${idx})`}">
      <div class="story-ring ${s.ring || ''}">
        <div class="story-avatar">${s.avatar}</div>
      </div>
      ${s.isMe ? '<div class="story-add-icon">+</div>' : ''}
      <span class="story-label">${s.username}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
// 7. 스토리 뷰어
// ══════════════════════════════════════════
function openStory(userIdx) {
  const story = APP.stories[userIdx];
  if (!story || story.isMe || !story.frames?.length) return;

  STATE.currentStoryUserIndex = userIdx;
  STATE.currentStoryIndex = 0;
  STATE.storyProgress = 0;

  // 읽음 처리
  APP.stories[userIdx].ring = 'viewed';
  renderStories();

  // 뷰어 열기
  const viewer = document.getElementById('storyViewer');
  document.getElementById('storyUserAva').textContent = story.avatar;
  document.getElementById('storyUserName').textContent = story.username;
  document.getElementById('storyUserTime').textContent = story.timeAgo || '방금 전';

  // 진행 바 생성
  const bars = document.getElementById('storyProgressBars');
  bars.innerHTML = story.frames.map((_, i) => `
    <div class="story-prog-track"><div class="story-prog-fill" id="spf-${i}"></div></div>
  `).join('');

  showStoryFrame();
  viewer.classList.add('open');
  startStoryTimer();
}

function showStoryFrame() {
  const story = APP.stories[STATE.currentStoryUserIndex];
  if (!story) return;
  const frame = story.frames[STATE.currentStoryIndex];
  document.getElementById('storyFrame').innerHTML = `
    <div style="font-size:100px;animation:emojiPulse 2s ease-in-out infinite;">${frame}</div>
  `;
}

function startStoryTimer() {
  clearInterval(STATE.storyProgressTimer);
  clearTimeout(STATE.storyTimer);

  const story = APP.stories[STATE.currentStoryUserIndex];
  if (!story) return;

  const fillEl = document.getElementById(`spf-${STATE.currentStoryIndex}`);
  if (!fillEl) return;

  // 이전 프레임 완료 표시
  for (let i = 0; i < STATE.currentStoryIndex; i++) {
    const el = document.getElementById(`spf-${i}`);
    if (el) el.classList.add('done');
  }

  let progress = 0;
  STATE.storyProgressTimer = setInterval(() => {
    progress += 0.5;
    if (fillEl) fillEl.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(STATE.storyProgressTimer);
      nextStory();
    }
  }, 25); // 5초 기준 (0.5% × 200 steps)
}

function nextStory() {
  const story = APP.stories[STATE.currentStoryUserIndex];
  if (!story) { closeStory(); return; }

  clearInterval(STATE.storyProgressTimer);

  if (STATE.currentStoryIndex < story.frames.length - 1) {
    STATE.currentStoryIndex++;
    showStoryFrame();
    startStoryTimer();
  } else {
    // 다음 사용자 스토리로
    const nextUserIdx = findNextStoryUser(STATE.currentStoryUserIndex);
    if (nextUserIdx !== -1) {
      openStory(nextUserIdx);
    } else {
      closeStory();
    }
  }
}

function findNextStoryUser(currentIdx) {
  for (let i = currentIdx + 1; i < APP.stories.length; i++) {
    if (!APP.stories[i].isMe && APP.stories[i].frames?.length) return i;
  }
  return -1;
}

function closeStory() {
  clearInterval(STATE.storyProgressTimer);
  clearTimeout(STATE.storyTimer);
  document.getElementById('storyViewer').classList.remove('open');
  saveState();
}

// ══════════════════════════════════════════
// 8. 피드 렌더링
// ══════════════════════════════════════════
function renderFeed(filter) {
  filter = filter || STATE.feedFilter;
  const section = document.getElementById('feedSection');
  if (!section) return;

  const filtered = filter === '전체'
    ? APP.posts
    : APP.posts.filter(p => p.ageTag === filter);

  if (!filtered.length) {
    section.innerHTML = `<div style="padding:40px;text-align:center;color:var(--c-subtext);">
      <div style="font-size:48px;margin-bottom:12px;">🔍</div>
      <div>해당 월령의 게시물이 없어요</div>
    </div>`;
    return;
  }

  section.innerHTML = filtered.map(p => renderPostCard(p)).join('');
}

function renderPostCard(post) {
  const mediaHTML = post.media.map((m, i) => {
    if (m.type === 'emoji') {
      return `<div class="media-slide" style="background:${m.bg || 'var(--c-secondary)'}">
        <div class="media-emoji">${m.emoji}</div>
        <div class="media-caption">${m.caption || ''}</div>
      </div>`;
    } else if (m.type === 'image') {
      return `<div class="media-slide"><img src="${m.src}" alt="게시물 이미지" /></div>`;
    } else if (m.type === 'video') {
      return `<div class="media-slide"><video src="${m.src}" controls playsinline muted loop></video></div>`;
    }
    return '';
  }).join('');

  const dotsHTML = post.media.length > 1
    ? `<div class="media-dots">${post.media.map((_, i) =>
        `<div class="media-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`
      ).join('')}</div>`
    : '';

  const arrowsHTML = post.media.length > 1
    ? `<button class="media-arrow prev" onclick="slidePost(event,'${post.id}',-1)">‹</button>
       <button class="media-arrow next" onclick="slidePost(event,'${post.id}',1)">›</button>`
    : '';

  const privacyIcon = { public: '🌍', followers: '👥', family: '👨‍👩‍👧', private: '🔒' }[post.privacy] || '🌍';

  const commentsHTML = post.comments?.slice(0, 1).map(c => `
    <div class="comment-row">
      <div class="comment-ava">${c.avatar}</div>
      <div class="comment-body"><span class="commenter">${c.username}</span> ${c.text}</div>
    </div>
  `).join('') || '';

  return `
  <article class="post-card" id="post-${post.id}">
    <div class="post-header">
      <div class="post-user">
        <div class="post-avatar" style="background:${post.avatarBg || 'linear-gradient(135deg,var(--c-primary),var(--c-accent))'}">${post.avatar}</div>
        <div class="post-user-info">
          <div class="post-username">${post.username}</div>
          <div class="post-meta">
            <span class="age-badge">${post.ageTag}</span>
            <span>· ${post.location || ''} · ${post.timeAgo}</span>
            <span class="privacy-tag">${privacyIcon}</span>
          </div>
        </div>
      </div>
      <button class="post-more-btn" onclick="showPostMenu('${post.id}')">···</button>
    </div>

    <div class="post-media" id="media-${post.id}" data-current="0" ondblclick="doubleTapLike(event,'${post.id}')">
      <div class="media-slides" id="slides-${post.id}" style="transform:translateX(0)">
        ${mediaHTML}
      </div>
      ${dotsHTML}
      ${arrowsHTML}
    </div>

    <div class="post-actions">
      <div class="post-actions-left">
        <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike('${post.id}',this)" id="like-btn-${post.id}">
          <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
          <span class="count">${post.likes}</span>
        </button>
        <button class="action-btn" onclick="focusComment('${post.id}')">
          <i class="far fa-comment"></i>
          <span class="count">${(post.comments?.length || 0) + 1}</span>
        </button>
        <button class="action-btn" onclick="sharePost('${post.id}')">
          <i class="far fa-paper-plane"></i>
        </button>
      </div>
      <button class="save-btn ${post.saved ? 'saved' : ''}" onclick="toggleSave('${post.id}',this)" id="save-btn-${post.id}">
        <i class="${post.saved ? 'fas' : 'far'} fa-bookmark"></i>
      </button>
    </div>

    <div class="post-body">
      <div class="post-likes">좋아요 ${post.likes.toLocaleString()}개</div>
      <div class="post-text">
        <span class="author">${post.username.split(' ')[0]}</span>
        ${post.caption?.replace(/\n/g, '<br>') || ''}
      </div>
      <div class="post-hashtags">${post.hashtags || ''}</div>
      <div class="post-date">${post.date}</div>
    </div>

    ${post.aiComment ? `
    <div class="ai-comment-block">
      <div class="ai-comment-head">
        <span>🤖 아이랑 AI</span>
        <span class="ai-badge">AI 육아 도우미</span>
      </div>
      <div class="ai-comment-text">${post.aiComment}</div>
    </div>` : ''}

    <div class="comments-preview" id="comments-${post.id}">
      ${commentsHTML}
      ${(post.comments?.length || 0) > 1 ? `<div class="view-all-comments">댓글 ${post.comments.length}개 모두 보기</div>` : ''}
    </div>

    <div class="comment-input-row">
      <div class="comment-ava-me">${APP.userProfile.avatar}</div>
      <input class="comment-inp" type="text" id="cinp-${post.id}" placeholder="따뜻한 댓글을 남겨보세요 💛"
        onkeydown="if(event.key==='Enter')submitComment('${post.id}')" />
      <button class="comment-send-btn" onclick="submitComment('${post.id}')"><i class="fas fa-paper-plane"></i></button>
    </div>
  </article>`;
}

// ══════════════════════════════════════════
// 9. 피드 인터랙션
// ══════════════════════════════════════════
function toggleLike(postId, btn) {
  const post = APP.posts.find(p => p.id === postId);
  if (!post) return;

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;

  const icon = btn.querySelector('i');
  const count = btn.querySelector('.count');

  btn.classList.toggle('liked', post.liked);
  icon.className = post.liked ? 'fas fa-heart' : 'far fa-heart';
  count.textContent = post.likes;

  // 좋아요 수 동기화
  const likesEl = document.querySelector(`#post-${postId} .post-likes`);
  if (likesEl) likesEl.textContent = `좋아요 ${post.likes.toLocaleString()}개`;

  saveState();
}

function doubleTapLike(e, postId) {
  const media = e.currentTarget;
  const post = APP.posts.find(p => p.id === postId);
  if (!post) return;

  // 하트 팝업 애니메이션
  const heart = document.createElement('div');
  heart.className = 'heart-burst';
  heart.textContent = '❤️';
  media.appendChild(heart);
  setTimeout(() => heart.remove(), 700);

  // 좋아요 처리 (이미 좋아요면 유지)
  if (!post.liked) {
    post.liked = true;
    post.likes++;
    const btn = document.getElementById(`like-btn-${postId}`);
    if (btn) {
      btn.classList.add('liked');
      btn.querySelector('i').className = 'fas fa-heart';
      btn.querySelector('.count').textContent = post.likes;
    }
    const likesEl = document.querySelector(`#post-${postId} .post-likes`);
    if (likesEl) likesEl.textContent = `좋아요 ${post.likes.toLocaleString()}개`;
  }
  saveState();
}

function toggleSave(postId, btn) {
  const post = APP.posts.find(p => p.id === postId);
  if (!post) return;

  post.saved = !post.saved;
  btn.classList.toggle('saved', post.saved);
  btn.querySelector('i').className = post.saved ? 'fas fa-bookmark' : 'far fa-bookmark';
  showToast(post.saved ? '📌 게시물 저장됨' : '저장 해제됨');
  saveState();
}

function submitComment(postId) {
  const input = document.getElementById(`cinp-${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const post = APP.posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.comments) post.comments = [];
  post.comments.push({ avatar: APP.userProfile.avatar, username: APP.userProfile.name, text });

  const container = document.getElementById(`comments-${postId}`);
  if (container) {
    const div = document.createElement('div');
    div.className = 'comment-row';
    div.innerHTML = `<div class="comment-ava">${APP.userProfile.avatar}</div>
      <div class="comment-body"><span class="commenter">${APP.userProfile.name}</span> ${text}</div>`;
    container.appendChild(div);
  }
  input.value = '';
  saveState();
}

function focusComment(postId) {
  const el = document.getElementById(`cinp-${postId}`);
  if (el) el.focus();
}

function sharePost(postId) {
  showToast('📤 공유 기능은 곧 업데이트됩니다!');
}

function showPostMenu(postId) {
  showToast('⋯ 메뉴: 수정 / 삭제 / 신고');
}

// 미디어 슬라이드
function slidePost(e, postId, dir) {
  e.stopPropagation();
  const mediaEl = document.getElementById(`media-${postId}`);
  const slidesEl = document.getElementById(`slides-${postId}`);
  const post = APP.posts.find(p => p.id === postId);
  if (!post || !mediaEl || !slidesEl) return;

  let current = parseInt(mediaEl.dataset.current) || 0;
  current = Math.max(0, Math.min(post.media.length - 1, current + dir));
  mediaEl.dataset.current = current;

  slidesEl.style.transform = `translateX(-${current * 100}%)`;

  mediaEl.querySelectorAll('.media-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

// 피드 필터
function filterFeed(filter, el) {
  STATE.feedFilter = filter;
  document.querySelectorAll('.tab-pill').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderFeed(filter);
}

// ══════════════════════════════════════════
// 10. 탐색 탭
// ══════════════════════════════════════════
function renderExploreGrid() {
  const grid = document.getElementById('exploreGrid');
  if (!grid) return;

  const all = [...APP.posts].sort((a, b) => b.likes - a.likes);

  grid.innerHTML = all.map((p, idx) => `
    <div class="grid-item ${idx === 0 ? 'large' : ''}" onclick="showToast('📸 ${p.username}의 게시물')">
      <div style="font-size:${idx===0?'80px':'40px'};background:${p.media[0]?.bg||'var(--c-secondary)'};width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        ${p.media[0]?.emoji || '📸'}
      </div>
      ${p.media.length > 1 ? '<div class="multi-icon">❐</div>' : ''}
      <div class="grid-overlay">
        <span>❤️ ${p.likes}</span>
        <span>💬 ${p.comments?.length || 0}</span>
      </div>
    </div>
  `).join('');
}

function handleSearch(val) {
  const filtered = APP.posts.filter(p =>
    p.caption?.toLowerCase().includes(val.toLowerCase()) ||
    p.hashtags?.toLowerCase().includes(val.toLowerCase()) ||
    p.username?.toLowerCase().includes(val.toLowerCase())
  );
  const grid = document.getElementById('exploreGrid');
  if (!grid) return;
  if (!val) { renderExploreGrid(); return; }
  grid.innerHTML = filtered.map(p => `
    <div class="grid-item" onclick="showToast('📸 ${p.username}의 게시물')">
      <div style="font-size:40px;background:${p.media[0]?.bg||'var(--c-secondary)'};width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        ${p.media[0]?.emoji || '📸'}
      </div>
    </div>
  `).join('') || `<div style="grid-column:span 3;padding:40px;text-align:center;color:var(--c-subtext);">검색 결과가 없어요 🔍</div>`;
}

function filterByTag(tag, el) {
  STATE.exploreTagFilter = tag;
  document.querySelectorAll('.hashtag-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');

  if (tag === '전체') { renderExploreGrid(); return; }
  const filtered = APP.posts.filter(p => p.hashtags?.includes(tag));
  const grid = document.getElementById('exploreGrid');
  if (!grid) return;
  grid.innerHTML = filtered.map(p => `
    <div class="grid-item" onclick="showToast('📸 ${p.username}의 게시물')">
      <div style="font-size:40px;background:${p.media[0]?.bg||'var(--c-secondary)'};width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        ${p.media[0]?.emoji || '📸'}
      </div>
    </div>
  `).join('') || `<div style="grid-column:span 3;padding:40px;text-align:center;color:var(--c-subtext);">#${tag} 게시물이 없어요</div>`;
}

// ══════════════════════════════════════════
// 11. 게시물 업로드
// ══════════════════════════════════════════
function triggerFileInput() {
  document.getElementById('fileInput').click();
}

function handleFileSelect(input) {
  const files = Array.from(input.files).slice(0, 10);
  if (!files.length) return;

  STATE.uploadFiles = files;
  STATE.uploadPreviewIndex = 0;

  const strip = document.getElementById('uploadThumbnailStrip');
  const preview = document.getElementById('uploadPreview');

  strip.innerHTML = '';
  files.forEach((file, idx) => {
    const url = URL.createObjectURL(file);
    const thumb = document.createElement('div');
    thumb.className = `upload-thumb ${idx === 0 ? 'selected' : ''}`;

    if (file.type.startsWith('image/')) {
      thumb.innerHTML = `<img src="${url}" alt="thumb" />`;
    } else {
      thumb.innerHTML = `<span style="font-size:28px;">🎥</span>`;
    }
    thumb.onclick = () => {
      document.querySelectorAll('.upload-thumb').forEach(t => t.classList.remove('selected'));
      thumb.classList.add('selected');
      STATE.uploadPreviewIndex = idx;
      showUploadPreview(file, url, preview);
    };
    strip.appendChild(thumb);
  });

  const url = URL.createObjectURL(files[0]);
  showUploadPreview(files[0], url, preview);
  document.getElementById('uploadCountLabel').textContent = `${files.length}개 선택됨 (최대 10개)`;
}

function showUploadPreview(file, url, previewEl) {
  previewEl.innerHTML = '';
  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:var(--r-lg);';
    previewEl.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = url; vid.controls = true; vid.muted = true; vid.loop = true;
    vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:var(--r-lg);';
    previewEl.appendChild(vid);
  }
}

function selectAgeTag(el) {
  document.querySelectorAll('#uploadAgeTag .tab-pill').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  STATE.selectedAgeTag = el.textContent;
}

function selectPrivacy(el) {
  document.querySelectorAll('.privacy-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  STATE.selectedPrivacy = el.dataset.value;
}

function submitPost() {
  const caption = document.getElementById('uploadCaption').value.trim();
  const location = document.getElementById('uploadLocation').value.trim();

  // 업로드 제한 확인
  if (APP.subscription.plan === 'free' && APP.uploadCount >= 100) {
    showLimitPopup();
    return;
  }

  // 미디어 생성
  let media = [];
  if (STATE.uploadFiles.length) {
    media = STATE.uploadFiles.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'video',
      src: URL.createObjectURL(file),
    }));
    APP.uploadCount++;
  } else {
    media = [{ type: 'emoji', emoji: '🌱📸', caption: '새 게시물', bg: 'linear-gradient(135deg,var(--c-primary),var(--c-secondary))' }];
  }

  // 해시태그 추출
  const tags = (caption.match(/#[^\s#]+/g) || []).join(' ');

  const newPost = {
    id: 'p' + Date.now(),
    userId: 'user_me',
    username: APP.userProfile.name + ' 🌱',
    avatar: APP.userProfile.avatar,
    avatarBg: 'linear-gradient(135deg,var(--c-primary),var(--c-accent))',
    ageTag: STATE.selectedAgeTag,
    location: location || '내 위치',
    timeAgo: '방금 전',
    media,
    caption: caption || '아이랑 새 게시물 🌱',
    hashtags: tags || '#아이랑 #육아일기',
    likes: 0, liked: false, saved: false,
    comments: [],
    aiComment: null,
    privacy: STATE.selectedPrivacy,
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
  };

  APP.posts.unshift(newPost);
  saveState();

  closeModal('uploadModal');
  switchTab('home');
  renderFeed();
  updateSidebar();
  updateProfileTab();
  renderExploreGrid();

  // 업로드 초기화
  STATE.uploadFiles = [];
  document.getElementById('uploadCaption').value = '';
  document.getElementById('uploadLocation').value = '';
  document.getElementById('uploadPreview').innerHTML = `
    <div class="upload-icon">📷</div>
    <div class="upload-hint">사진/영상을 선택하세요</div>
    <div class="upload-count" id="uploadCountLabel">최대 10개 업로드 가능</div>`;
  document.getElementById('uploadThumbnailStrip').innerHTML = '';

  // AI 댓글 자동 생성
  setTimeout(() => {
    newPost.aiComment = getAutoAIComment(STATE.selectedAgeTag, caption);
    saveState();
    renderFeed();
    showToast('🤖 AI가 댓글을 달았어요!');
  }, 2000);

  showToast('✅ 게시물이 업로드되었어요!');
}

function getAutoAIComment(ageTag, caption) {
  const comments = {
    '0-6개월':   '이 시기는 아이의 오감 발달이 가장 활발한 시기예요! 밝은 색상과 다양한 촉감의 장난감이 도움이 됩니다 🌈',
    '7-12개월':  '이유식과 기어다니기를 시작하는 소중한 시기네요! 안전한 환경을 만들어주는 것이 중요해요 🛡️',
    '13-24개월': '첫 단어와 첫 걸음마의 기적이 일어나는 시기예요! 많이 말 걸어주고 함께 놀아주세요 💬',
    '25-36개월': '자아가 싹트는 시기로 "내가 할게!"가 많아지는 때예요. 기다려주는 인내심이 핵심이에요 💛',
    '4-5세':     '친구와의 놀이와 언어 발달이 급격히 이루어지는 시기예요. 다양한 경험을 제공해주세요 🎨',
    '6세이상':   '학교 준비 단계로 자립심과 규칙 이해가 중요한 시기예요. 꾸준한 독서 습관을 길러주세요 📚',
  };
  return comments[ageTag] || '아이와의 소중한 순간을 기록해주셔서 감사해요! 함께 성장하는 우리 아이들 화이팅! 🌱';
}

// ══════════════════════════════════════════
// 12. AI 챗봇
// ══════════════════════════════════════════
function setAIProvider(provider, el) {
  STATE.aiProvider = provider;
  document.querySelectorAll('.ai-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

function selectAIProvider(provider) {
  STATE.aiProvider = provider;
  document.getElementById('aiProvBtn-gemini').classList.toggle('active', provider === 'gemini');
  document.getElementById('aiProvBtn-gpt').classList.toggle('active', provider === 'gpt');

  const keyStatus = document.getElementById('aiKeyStatus');
  const hasKey = provider === 'gemini' ? !!APP.apiKeys.gemini : !!APP.apiKeys.openai;
  keyStatus.textContent = hasKey
    ? `✅ ${provider === 'gemini' ? 'Gemini' : 'ChatGPT'} API 키가 설정되어 있어요`
    : `⚠️ ${provider === 'gemini' ? 'Gemini' : 'ChatGPT'} API 키를 설정하면 실제 AI 응답을 받을 수 있어요 →`;
}

function sendQuickQ(el) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = el.textContent.replace(/^[^\s]+\s/, ''); }
  sendAIMessage();
}

async function sendAIMessage() {
  const input = document.getElementById('chatInput');
  const chatArea = document.getElementById('chatArea');
  const msg = input.value.trim();
  if (!msg) return;

  // 사용자 메시지 표시
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-msg-user';
  userBubble.textContent = msg;
  chatArea.appendChild(userBubble);
  input.value = '';

  // 타이핑 인디케이터
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatArea.appendChild(typing);
  chatArea.scrollTop = chatArea.scrollHeight;

  // AI 응답 생성
  let response;
  const provider = STATE.aiProvider;
  const apiKey = provider === 'gemini' ? APP.apiKeys.gemini : APP.apiKeys.openai;

  if (apiKey) {
    try {
      response = await callAIAPI(msg, provider, apiKey);
    } catch(err) {
      console.warn('AI API 오류:', err);
      response = getFallbackResponse(msg);
    }
  } else {
    await new Promise(r => setTimeout(r, 1200));
    response = getFallbackResponse(msg);
  }

  // 타이핑 인디케이터 제거 후 응답 표시
  typing.remove();
  const aiBubble = document.createElement('div');
  aiBubble.className = 'chat-msg-ai';
  aiBubble.innerHTML = response.replace(/\n/g, '<br>');
  chatArea.appendChild(aiBubble);
  chatArea.scrollTop = chatArea.scrollHeight;

  // AI 알림 뱃지 제거
  const badge = document.getElementById('aiNotifBadge');
  if (badge) badge.style.display = 'none';
}

async function callAIAPI(message, provider, apiKey) {
  const systemPrompt = `당신은 '아이랑'의 AI 육아 도우미입니다. 한국어로 친절하고 따뜻하게 답변하세요. 
  아이의 발달, 수유, 이유식, 수면, 예방접종 등 육아 관련 전문 조언을 제공합니다.
  의학적 긴급상황은 즉시 소아과 방문을 권유하세요.
  답변은 간결하고 실용적으로, 이모지를 적절히 사용하세요.
  ${APP.babyProfile.name ? `현재 아이 이름: ${APP.babyProfile.name}` : ''}`;

  if (provider === 'gemini') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + '\n\n질문: ' + message }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        })
      }
    );
    if (!res.ok) throw new Error('Gemini API error: ' + res.status);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(message);

  } else {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500, temperature: 0.7,
      })
    });
    if (!res.ok) throw new Error('OpenAI API error: ' + res.status);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || getFallbackResponse(message);
  }
}

function getFallbackResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, resp] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return resp;
  }
  return `안녕하세요! 아이랑 AI 육아 도우미예요 🌱\n\n"${msg}"에 대해 답변드릴게요.\n\n💡 설정에서 Gemini 또는 ChatGPT API 키를 등록하시면 더 정확하고 맞춤화된 답변을 받을 수 있어요!\n\n기본적인 육아 관련 질문이라면 편하게 물어보세요 💛`;
}

// ══════════════════════════════════════════
// 13. 성장 기록
// ══════════════════════════════════════════
function switchGrowthTab(tab, el) {
  STATE.currentGrowthTab = tab;
  document.querySelectorAll('.growth-sub-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.growth-sub-content').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  const content = document.getElementById(`gtab-${tab}`);
  if (content) content.classList.add('active');
}

function addGrowthLog() {
  const date = document.getElementById('logDate').value;
  const height = parseFloat(document.getElementById('logHeight').value);
  const weight = parseFloat(document.getElementById('logWeight').value);

  if (!date) { showToast('❌ 날짜를 입력해주세요'); return; }
  if (isNaN(height) && isNaN(weight)) { showToast('❌ 키 또는 몸무게를 입력해주세요'); return; }

  const log = { date, height: isNaN(height) ? null : height, weight: isNaN(weight) ? null : weight };
  APP.growthLogs.push(log);
  APP.growthLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 최신 기록으로 퀵스탯 업데이트
  updateGrowthStats();
  renderGrowthLogs();
  renderCharts();
  updateSidebar();
  saveState();

  document.getElementById('logHeight').value = '';
  document.getElementById('logWeight').value = '';
  showToast('📊 성장 기록이 저장되었어요!');
}

function updateGrowthStats() {
  const latest = APP.growthLogs[APP.growthLogs.length - 1];
  const ageMonths = calcAgeMonths();

  const ageStr = ageMonths !== null ? `${ageMonths}개월` : '—';
  const heightStr = latest?.height ? `${latest.height}cm` : '—';
  const weightStr = latest?.weight ? `${latest.weight}kg` : '—';

  setEl('qs-age', ageMonths !== null ? ageMonths : '—');
  setEl('qs-height', latest?.height || '—');
  setEl('qs-weight', latest?.weight || '—');
  setEl('home-age', ageStr);
  setEl('home-height', heightStr);
  setEl('home-weight', weightStr);
  setEl('side-height', heightStr);
  setEl('side-weight', weightStr);
}

function renderGrowthLogs() {
  updateGrowthStats();
  const history = document.getElementById('growthLogHistory');
  if (!history) return;

  if (!APP.growthLogs.length) {
    history.innerHTML = `<div style="text-align:center;padding:30px;color:var(--c-subtext);">📋 아직 기록이 없어요<br>첫 성장 기록을 추가해보세요!</div>`;
    return;
  }

  history.innerHTML = [...APP.growthLogs].reverse().map((log, idx) => `
    <div class="log-entry">
      <div class="log-entry-date">📅 ${log.date}</div>
      <div class="log-entry-vals">
        ${log.height !== null ? `<div class="log-val"><span class="val">${log.height}</span><span class="lbl">키(cm)</span></div>` : ''}
        ${log.weight !== null ? `<div class="log-val"><span class="val">${log.weight}</span><span class="lbl">몸무게(kg)</span></div>` : ''}
        <button onclick="deleteGrowthLog(${APP.growthLogs.length - 1 - idx})" style="border:none;background:none;color:var(--c-subtext);cursor:pointer;font-size:16px;">🗑️</button>
      </div>
    </div>
  `).join('');
}

function deleteGrowthLog(idx) {
  if (confirm('이 기록을 삭제하시겠습니까?')) {
    APP.growthLogs.splice(idx, 1);
    renderGrowthLogs();
    renderCharts();
    updateSidebar();
    saveState();
    showToast('🗑️ 기록이 삭제되었어요');
  }
}

// ══════════════════════════════════════════
// 14. SVG 성장 곡선 차트
// ══════════════════════════════════════════
function renderCharts() {
  renderGrowthChart('heightChart', 'height', APP.babyProfile.gender || 'boy');
  renderGrowthChart('weightChart', 'weight', APP.babyProfile.gender || 'boy');
}

function renderGrowthChart(svgId, type, gender) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const W = 360, H = 180;
  const PAD = { top: 10, right: 20, bottom: 30, left: 36 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  // WHO 데이터 선택
  const whoData = type === 'height'
    ? (gender === 'girl' ? WHO_HEIGHT_FEMALE : WHO_HEIGHT_MALE)
    : (gender === 'girl' ? WHO_WEIGHT_FEMALE : WHO_WEIGHT_MALE);

  const months = Object.keys(whoData).map(Number).sort((a, b) => a - b);
  const maxMonth = months[months.length - 1];
  const minVal = Math.min(...months.map(m => whoData[m][0])) * 0.97;
  const maxVal = Math.max(...months.map(m => whoData[m][4])) * 1.02;

  function px(month) { return PAD.left + (month / maxMonth) * cw; }
  function py(val) { return PAD.top + ch - ((val - minVal) / (maxVal - minVal)) * ch; }

  function pathFromPoints(pts) {
    if (!pts.length) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  }

  // WHO 백분위 선
  const percentileColors = ['#C8D8F8','#9BB8F0','#7098E8','#9BB8F0','#C8D8F8'];
  const percentileLines = [0,1,2,3,4].map(pIdx =>
    pathFromPoints(months.map(m => [px(m), py(whoData[m][pIdx])]))
  );

  // 아기 데이터 포인트
  const babyPoints = APP.growthLogs
    .filter(l => l[type] !== null)
    .map(l => {
      const m = calcAgeMonthsFromDate(l.date);
      return m !== null ? [px(m), py(l[type]), m, l[type]] : null;
    })
    .filter(Boolean);

  const babyPath = pathFromPoints(babyPoints.map(p => [p[0], p[1]]));
  const babyColor = type === 'height' ? '#FFD93D' : '#5CB85C';

  // 축 레이블
  const monthLabels = months.filter((_, i) => i % 2 === 0).map(m =>
    `<text x="${px(m).toFixed(1)}" y="${(H - 6)}" font-size="9" fill="#8A8A8A" text-anchor="middle">${m}개월</text>`
  ).join('');

  const valStep = type === 'height' ? 10 : 5;
  const startVal = Math.ceil(minVal / valStep) * valStep;
  const valLabels = [];
  for (let v = startVal; v <= maxVal; v += valStep) {
    valLabels.push(`<text x="${PAD.left - 4}" y="${py(v).toFixed(1)}" font-size="9" fill="#8A8A8A" text-anchor="end" dominant-baseline="middle">${v}</text>`);
  }

  svg.innerHTML = `
    <g>
      <!-- 그리드 -->
      ${months.filter((_, i) => i % 2 === 0).map(m =>
        `<line x1="${px(m)}" y1="${PAD.top}" x2="${px(m)}" y2="${PAD.top+ch}" stroke="#F0E8C8" stroke-width="0.5"/>`
      ).join('')}

      <!-- WHO 백분위 선 -->
      ${percentileLines.map((d, i) => `<path d="${d}" fill="none" stroke="${percentileColors[i]}" stroke-width="${i===2?1.5:1}" stroke-dasharray="${i===2?'':'3,3'}"/>`).join('')}

      <!-- 50th 백분위 라벨 -->
      <text x="${px(maxMonth)+2}" y="${py(whoData[maxMonth][2]).toFixed(1)}" font-size="8" fill="#9BB8F0">50%</text>

      <!-- 아기 성장선 -->
      ${babyPath ? `<path d="${babyPath}" fill="none" stroke="${babyColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}

      <!-- 아기 데이터 포인트 -->
      ${babyPoints.map((p, i) => `
        <circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === babyPoints.length-1 ? 5 : 4}"
          fill="${babyColor}" stroke="white" stroke-width="1.5"/>
        ${i === babyPoints.length-1 ? `<text x="${p[0]+7}" y="${p[1]-6}" font-size="9" fill="${babyColor}" font-weight="700">${p[3]}${type==='height'?'cm':'kg'}</text>` : ''}
      `).join('')}

      <!-- 축 레이블 -->
      ${monthLabels}
      ${valLabels.join('')}

      <!-- 테두리 -->
      <rect x="${PAD.left}" y="${PAD.top}" width="${cw}" height="${ch}" fill="none" stroke="#F0E8C8" stroke-width="1"/>
    </g>
  `;
}

// ══════════════════════════════════════════
// 15. 생활 기록 (수유/이유식/수면/배변)
// ══════════════════════════════════════════
function switchDailyTab(tab, el) {
  STATE.currentDailyTab = tab;
  document.querySelectorAll('.daily-log-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.daily-log-content').forEach(c => c.style.display = 'none');
  if (el) el.classList.add('active');
  const content = document.getElementById(`dtab-${tab}`);
  if (content) content.style.display = 'block';
}

function addDailyLog(type) {
  let logEntry = { time: new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'}), type };

  if (type === 'feed') {
    logEntry.feedType = document.getElementById('feedType').value;
    logEntry.amount = document.getElementById('feedAmount').value + 'ml';
    logEntry.duration = document.getElementById('feedDuration').value + '분';
    logEntry.title = `${logEntry.feedType} 수유`;
    logEntry.detail = `${logEntry.amount} · ${logEntry.duration}`;
    logEntry.time = document.getElementById('feedTime').value || logEntry.time;
  } else if (type === 'solid') {
    logEntry.menu = document.getElementById('solidMenu').value;
    logEntry.amount = document.getElementById('solidAmount').value + 'g';
    logEntry.reaction = document.getElementById('solidReaction').value;
    logEntry.title = `이유식: ${logEntry.menu || '메뉴 미입력'}`;
    logEntry.detail = `${logEntry.amount} · ${logEntry.reaction}`;
    logEntry.time = document.getElementById('solidTime').value || logEntry.time;
  } else if (type === 'sleep') {
    logEntry.start = document.getElementById('sleepStart').value;
    logEntry.end = document.getElementById('sleepEnd').value;
    logEntry.sleepType = document.getElementById('sleepType').value;
    logEntry.quality = document.getElementById('sleepQuality').value;
    logEntry.title = `${logEntry.sleepType}`;
    logEntry.detail = `${logEntry.start} ~ ${logEntry.end} · ${logEntry.quality}`;
    logEntry.time = logEntry.start || logEntry.time;
  } else if (type === 'poop') {
    logEntry.poopType = document.getElementById('poopType').value;
    logEntry.color = document.getElementById('poopColor').value;
    logEntry.consistency = document.getElementById('poopConsistency').value;
    logEntry.title = `배변: ${logEntry.poopType}`;
    logEntry.detail = `${logEntry.color} · ${logEntry.consistency}`;
    logEntry.time = document.getElementById('poopTime').value || logEntry.time;
  }

  if (!APP.dailyLogs[type]) APP.dailyLogs[type] = [];
  APP.dailyLogs[type].unshift(logEntry);
  saveState();
  renderDailyTimeline(type);
  showToast(`✅ ${logEntry.title} 기록 저장!`);
}

function renderDailyTimeline(type) {
  const container = document.getElementById(`${type}Timeline`);
  if (!container) return;
  const logs = APP.dailyLogs[type] || [];

  if (!logs.length) {
    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--c-subtext);">📝 아직 기록이 없어요</div>`;
    return;
  }

  container.innerHTML = logs.map((log, idx) => `
    <div class="timeline-item">
      <div class="timeline-dot-col">
        <div class="timeline-dot"></div>
        ${idx < logs.length - 1 ? '<div class="timeline-line"></div>' : ''}
      </div>
      <div class="timeline-content">
        <div class="timeline-time">${log.time}</div>
        <div class="timeline-title">${log.title}</div>
        <div class="timeline-detail">${log.detail}</div>
      </div>
    </div>
  `).join('');
}

function renderAllDailyTimelines() {
  ['feed','solid','sleep','poop'].forEach(t => renderDailyTimeline(t));
}

// ══════════════════════════════════════════
// 16. 예방접종
// ══════════════════════════════════════════
function renderVaccines() {
  const list = document.getElementById('vaccineList');
  if (!list) return;

  list.innerHTML = APP.vaccines.map((v, idx) => `
    <div class="vaccine-item ${v.done ? 'done' : ''}" id="vaccine-${v.id}">
      <div class="vaccine-check" onclick="toggleVaccine(${idx})">${v.done ? '✓' : ''}</div>
      <div class="vaccine-info">
        <div class="vaccine-name">${v.name}</div>
        <div class="vaccine-date">📅 ${v.timing}</div>
      </div>
      <span class="vaccine-badge ${v.done ? 'done-badge' : 'upcoming'}">${v.done ? '완료' : '예정'}</span>
    </div>
  `).join('');
}

function toggleVaccine(idx) {
  APP.vaccines[idx].done = !APP.vaccines[idx].done;
  saveState();
  renderVaccines();
  showToast(APP.vaccines[idx].done ? '💉 예방접종 완료 체크!' : '체크 해제됨');
}

// ══════════════════════════════════════════
// 17. 마일스톤
// ══════════════════════════════════════════
function renderMilestones() {
  const list = document.getElementById('milestoneList');
  if (!list) return;

  list.innerHTML = APP.milestones.map((m, idx) => `
    <div class="milestone-item ${m.done ? 'done' : ''}" onclick="toggleMilestone(${idx})">
      <div class="milestone-check">${m.done ? '✓' : ''}</div>
      <div class="milestone-info">
        <div class="milestone-name">${m.name}</div>
        <div class="milestone-age">📅 ${m.age} 경</div>
      </div>
      <div class="milestone-emoji">${m.emoji}</div>
    </div>
  `).join('');

  // 마일스톤 카운트 업데이트
  const done = APP.milestones.filter(m => m.done).length;
  setEl('qs-milestone', `${done}/${APP.milestones.length}`);
  setEl('side-milestones', `${done} / ${APP.milestones.length}`);
}

function toggleMilestone(idx) {
  APP.milestones[idx].done = !APP.milestones[idx].done;
  if (APP.milestones[idx].done) showToast(`🌟 "${APP.milestones[idx].name}" 달성! 대단해요!`);
  saveState();
  renderMilestones();
}

// ══════════════════════════════════════════
// 18. 아기 프로필
// ══════════════════════════════════════════
function selectGender(el, gender) {
  document.querySelectorAll('#editBabyModal .privacy-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  STATE.selectedGender = gender;
}

function selectBabyAvatar(el, emoji) {
  document.querySelectorAll('.ava-opt').forEach(o => o.style.borderColor = 'transparent');
  el.style.borderColor = 'var(--c-accent)';
  STATE.selectedBabyAvatar = emoji;
}

function saveBabyProfile() {
  const name = document.getElementById('babyNameInput').value.trim();
  const birthdate = document.getElementById('babyBirthdateInput').value;

  if (!name) { showToast('❌ 아기 이름을 입력해주세요'); return; }
  if (!birthdate) { showToast('❌ 생년월일을 입력해주세요'); return; }

  APP.babyProfile = {
    name,
    birthdate,
    gender: STATE.selectedGender,
    avatar: STATE.selectedBabyAvatar,
  };

  saveState();
  updateBabyProfile();
  updateSidebar();
  renderCharts();
  updateAITip();
  closeModal('editBabyModal');
  showToast(`💛 ${name}의 프로필이 저장되었어요!`);
}

function updateBabyProfile() {
  const p = APP.babyProfile;
  const ageMonths = calcAgeMonths();
  const ageStr = ageMonths !== null ? `만 ${ageMonths}개월` : '출생일을 등록해주세요';

  setEl('babyAvatarEmoji', p.avatar || '🍼');
  setEl('babyNameDisplay', p.name || '아기 이름 미등록');
  setEl('babyAgeDisplay', ageStr);
  setEl('babyDday', p.birthdate ? `🎂 ${calcDday()}일째 되는 날` : '');

  // 입력 폼 미리 채우기
  const nameInput = document.getElementById('babyNameInput');
  const bdInput = document.getElementById('babyBirthdateInput');
  if (nameInput) nameInput.value = p.name || '';
  if (bdInput) bdInput.value = p.birthdate || '';

  updateGrowthStats();
}

function updateAITip() {
  const ageMonths = calcAgeMonths();
  const tipEl = document.getElementById('side-ai-tip');
  if (!tipEl || ageMonths === null) return;

  const tips = {
    0: '신생아는 하루 16-20시간 수면이 필요해요. 배고픔, 기저귀, 온도를 확인하세요!',
    3: '이 시기 아기는 소리를 따라 고개를 돌리기 시작해요. 다양한 소리 자극을 줘보세요!',
    6: '이유식 시작 시기예요! 쌀 미음부터 조금씩 시작해보세요 🥕',
    9: '낯가림이 심해질 수 있어요. 익숙한 환경과 반복적인 만남으로 안정감을 주세요.',
    12: '첫 생일 축하해요! 이유식에서 유아식으로 전환하는 시기예요 🎂',
    18: '자아가 생기는 시기! "안돼"가 많아져도 인내심 있게 기다려주세요.',
    24: '언어 발달이 급격히 이루어지는 시기예요. 많이 이야기를 나눠주세요!',
  };

  const nearest = Object.keys(tips).map(Number).reduce((prev, curr) =>
    Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
  );
  tipEl.textContent = tips[nearest] || '아이랑과 함께 소중한 순간을 기록해요 🌱';
}

// ══════════════════════════════════════════
// 19. 프로필 탭
// ══════════════════════════════════════════
function updateProfileTab() {
  const myPosts = APP.posts.filter(p => p.userId === 'user_me');
  const savedPosts = APP.posts.filter(p => p.saved);

  setEl('profilePostCount', myPosts.length);
  setEl('profileName', APP.userProfile.name);
  setEl('profileBio', APP.userProfile.bio);

  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) avatarEl.textContent = APP.userProfile.avatar;

  // 뱃지 업데이트
  const badges = [];
  if (myPosts.length === 0) badges.push('<span class="profile-badge new">🌱 신규 부모</span>');
  if (myPosts.length >= 10) badges.push('<span class="profile-badge veteran">⭐ 베테랑 부모</span>');
  if (APP.subscription.plan === 'premium') badges.push('<span class="profile-badge premium">👑 프리미엄</span>');
  if (APP.posts.reduce((s, p) => s + p.likes, 0) >= 500) badges.push('<span class="profile-badge supermom">💛 슈퍼맘/파파</span>');

  const badgesEl = document.getElementById('profileBadges');
  if (badgesEl) badgesEl.innerHTML = badges.join('') || '<span class="profile-badge new">🌱 신규 부모</span>';

  renderProfileGrid(myPosts);
}

function renderProfileGrid(posts) {
  const grid = document.getElementById('profileGrid');
  if (!grid) return;

  if (!posts.length) {
    grid.innerHTML = `<div style="grid-column:span 3;padding:60px 20px;text-align:center;color:var(--c-subtext);">
      <div style="font-size:48px;margin-bottom:12px;">📸</div>
      <div>아직 게시물이 없어요<br>첫 번째 육아 일기를 작성해보세요!</div>
    </div>`;
    return;
  }

  grid.innerHTML = posts.map(p => `
    <div class="profile-grid-item" onclick="showToast('📸 ${p.caption?.slice(0,20) || '게시물'}...')">
      <div style="font-size:40px;background:${p.media[0]?.bg||'var(--c-secondary)'};width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        ${p.media[0]?.emoji || '📸'}
      </div>
      ${p.media.length > 1 ? '<div class="multi-icon">❐</div>' : ''}
    </div>
  `).join('');
}

function switchProfileTab(tab, el) {
  STATE.currentProfileTab = tab;
  document.querySelectorAll('.profile-grid-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  if (tab === 'posts') renderProfileGrid(APP.posts.filter(p => p.userId === 'user_me'));
  else if (tab === 'saved') renderProfileGrid(APP.posts.filter(p => p.saved));
  else if (tab === 'tagged') renderProfileGrid([]);
}

function saveProfile() {
  const name = document.getElementById('profileNameInput').value.trim();
  const bio = document.getElementById('profileBioInput').value.trim();
  if (name) APP.userProfile.name = name;
  if (bio) APP.userProfile.bio = bio;
  saveState();
  updateProfileTab();
  showToast('✅ 프로필이 업데이트되었어요!');
}

// ══════════════════════════════════════════
// 20. 구독 플랜 & 토스페이먼츠 결제
// ══════════════════════════════════════════

// 토스페이먼츠 클라이언트 키 (테스트 키 — 실제 배포 시 발급받은 키로 교체)
// 발급: https://developers.tosspayments.com → 내 개발정보 → 클라이언트 키
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

const PLAN_INFO = {
  free:    { name: '무료 플랜',    price: 0,    priceKRW: '₩0',      emoji: '🆓' },
  basic:   { name: '베이직 플랜',  price: 4900, priceKRW: '₩4,900',  emoji: '⭐' },
  premium: { name: '프리미엄 플랜',price: 9900, priceKRW: '₩9,900',  emoji: '👑' },
};

let selectedPayMethod = '카카오페이';

function selectPlan(el, plan) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  STATE.selectedPlan = plan;

  // 유료 플랜 선택 시 결제 수단 섹션 표시
  const paySection = document.getElementById('payMethodSection');
  const btn = document.getElementById('subscribeBtnMain');
  if (plan === 'free') {
    paySection.style.display = 'none';
    btn.textContent = '✅ 무료로 계속하기';
  } else {
    paySection.style.display = 'block';
    const info = PLAN_INFO[plan];
    btn.textContent = `💳 ${info.priceKRW}/월 결제하기`;
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function selectPayMethod(el, method) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
  selectedPayMethod = method;
}

async function handleSubscribe() {
  const plan = STATE.selectedPlan;

  // 무료 플랜
  if (plan === 'free') {
    APP.subscription.plan = 'free';
    saveState();
    updateSubscriptionUI();
    closeModal('subscribeModal');
    showToast('✅ 무료 플랜으로 변경되었어요');
    return;
  }

  // 결제자 정보 확인
  const name  = document.getElementById('payerName')?.value.trim();
  const phone = document.getElementById('payerPhone')?.value.trim();
  if (!name)  { showToast('❌ 이름을 입력해주세요'); return; }
  if (!phone) { showToast('❌ 휴대폰 번호를 입력해주세요'); return; }

  const info = PLAN_INFO[plan];
  const orderId = 'airang_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

  showToast('💳 토스페이먼츠 결제창을 불러오는 중...');

  try {
    // 토스페이먼츠 SDK 초기화
    const tossPayments = TossPayments(TOSS_CLIENT_KEY);

    // 결제 요청
    await tossPayments.requestPayment(selectedPayMethod, {
      amount: info.price,
      orderId: orderId,
      orderName: `아이랑 ${info.name} 월정기권`,
      customerName: name,
      customerMobilePhone: phone.replace(/-/g, ''),
      successUrl: `${window.location.origin}/?payment=success&plan=${plan}&orderId=${orderId}`,
      failUrl:    `${window.location.origin}/?payment=fail&orderId=${orderId}`,
    });

    // 결제 성공 처리 (successUrl로 리다이렉트 후 아래 코드는 실행 안 됨)
    // successUrl에서 URL 파라미터로 처리됨

  } catch (err) {
    if (err.code === 'USER_CANCEL') {
      showToast('결제를 취소했어요');
    } else if (err.code === 'INVALID_CARD_COMPANY') {
      showToast('❌ 카드 정보를 확인해주세요');
    } else {
      // 테스트 모드 (SDK 없는 환경) - 모의 처리
      console.warn('Toss SDK:', err.message);
      simulatePaymentSuccess(plan, info);
    }
  }
}

function simulatePaymentSuccess(plan, info) {
  // 개발/테스트 환경: 실제 결제 없이 UI 시뮬레이션
  showToast(`⏳ ${info.name} 결제 처리 중...`);
  setTimeout(() => {
    APP.subscription.plan = plan;
    saveState();
    updateSubscriptionUI();
    closeModal('subscribeModal');
    showToast(`🎉 ${info.emoji} ${info.name} 시작! (테스트 모드)`);
    // 프리미엄 배지 추가
    updateProfileTab();
  }, 1500);
}

// 결제 완료 URL 파라미터 처리 (successUrl 리다이렉트 후)
function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const plan    = params.get('plan');
  const orderId = params.get('orderId');

  if (payment === 'success' && plan) {
    APP.subscription.plan = plan;
    saveState();
    updateSubscriptionUI();
    updateProfileTab();
    const info = PLAN_INFO[plan];
    setTimeout(() => showToast(`🎉 ${info.emoji} ${info.name} 구독 완료! 모든 기능을 이용하세요!`), 2600);

    // URL 파라미터 제거 (깔끔하게)
    window.history.replaceState({}, '', '/');
  } else if (payment === 'fail') {
    setTimeout(() => showToast('❌ 결제에 실패했어요. 다시 시도해주세요.'), 2600);
    window.history.replaceState({}, '', '/');
  }
}

function updateSubscriptionUI() {
  const plan = APP.subscription.plan;
  const labels = { free: '🆓 무료 플랜', basic: '⭐ 베이직 플랜', premium: '👑 프리미엄 플랜' };
  const badges = { free: 'free', basic: 'basic', premium: 'premium' };

  setEl('currentPlanDisplay', `현재: ${labels[plan]}`);
  const badge = document.getElementById('side-plan-badge');
  if (badge) { badge.textContent = labels[plan]; badge.className = `side-plan-badge ${badges[plan]}`; }

  const countEl = document.getElementById('side-upload-count');
  if (countEl) countEl.textContent = APP.uploadCount;

  const bar = document.getElementById('side-upload-bar');
  if (bar) {
    const pct = plan === 'free' ? Math.min(100, (APP.uploadCount / 100) * 100) : 0;
    bar.style.width = pct + '%';
    bar.style.background = pct > 80 ? 'linear-gradient(90deg,#FF5252,#FF8A80)' : 'linear-gradient(90deg,var(--c-accent),var(--c-primary))';
  }
}

function showLimitPopup() {
  const popup = document.getElementById('limitPopup');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 4000);
}

// ══════════════════════════════════════════
// 21. API 키 관리
// ══════════════════════════════════════════
function saveAPIKey(provider) {
  const key = provider === 'gemini'
    ? document.getElementById('geminiKeyInput').value.trim()
    : document.getElementById('openaiKeyInput').value.trim();

  if (!key) { showToast('❌ API 키를 입력해주세요'); return; }

  APP.apiKeys[provider === 'gemini' ? 'gemini' : 'openai'] = key;
  saveState();
  showToast(`✅ ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API 키가 저장되었어요!`);

  // AI 키 상태 업데이트
  selectAIProvider(STATE.aiProvider);
}

function loadAPIKeyInputs() {
  const geminiEl = document.getElementById('geminiKeyInput');
  const openaiEl = document.getElementById('openaiKeyInput');
  if (geminiEl && APP.apiKeys.gemini) geminiEl.value = APP.apiKeys.gemini;
  if (openaiEl && APP.apiKeys.openai) openaiEl.value = APP.apiKeys.openai;

  const profileNameEl = document.getElementById('profileNameInput');
  const profileBioEl = document.getElementById('profileBioInput');
  if (profileNameEl) profileNameEl.value = APP.userProfile.name;
  if (profileBioEl) profileBioEl.value = APP.userProfile.bio;
}

// ══════════════════════════════════════════
// 22. 사이드바 업데이트
// ══════════════════════════════════════════
function updateSidebar() {
  const p = APP.babyProfile;
  const ageMonths = calcAgeMonths();
  const latest = APP.growthLogs[APP.growthLogs.length - 1];

  setEl('side-baby-ava', p.avatar || '🍼');
  setEl('side-baby-name', p.name || '이름 미등록');
  setEl('side-baby-age', ageMonths !== null ? `만 ${ageMonths}개월 🌱` : '출생일을 등록해주세요');
  setEl('side-height', latest?.height ? `${latest.height} cm` : '— cm');
  setEl('side-weight', latest?.weight ? `${latest.weight} kg` : '— kg');

  const done = APP.milestones.filter(m => m.done).length;
  setEl('side-milestones', `${done} / ${APP.milestones.length}`);

  updateSubscriptionUI();
  updateAITip();
}

// ══════════════════════════════════════════
// 23. 모달 제어
// ══════════════════════════════════════════
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function handleModalBgClick(e, modalId) {
  if (e.target.id === modalId) closeModal(modalId);
}

// ══════════════════════════════════════════
// 24. 토스트 알림
// ══════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ══════════════════════════════════════════
// 25. 유틸리티
// ══════════════════════════════════════════
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function calcAgeMonths() {
  if (!APP.babyProfile.birthdate) return null;
  return calcAgeMonthsFromDate(new Date().toISOString().slice(0, 10), APP.babyProfile.birthdate);
}

function calcAgeMonthsFromDate(refDate, birthdate) {
  const bd = birthdate || APP.babyProfile.birthdate;
  if (!bd) return null;
  const birth = new Date(bd);
  const ref = new Date(refDate);
  const months = (ref.getFullYear() - birth.getFullYear()) * 12 + (ref.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

function calcDday() {
  if (!APP.babyProfile.birthdate) return 0;
  const birth = new Date(APP.babyProfile.birthdate);
  const today = new Date();
  return Math.floor((today - birth) / (1000 * 60 * 60 * 24));
}

function togglePrivate(el) {
  el.classList.toggle('on');
  showToast(el.classList.contains('on') ? '🔒 비공개 계정으로 전환됐어요' : '🌍 공개 계정으로 전환됐어요');
}

function resetApp() {
  localStorage.removeItem('airang_v2');
  location.reload();
}

// ══════════════════════════════════════════
// 26. 앱 시작
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', initApp);
