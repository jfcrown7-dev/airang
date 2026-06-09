/* ============================================================
   아이랑 (Airang) — 다국어 (i18n) 시스템 v1.0
   지원 언어: 한국어(ko) · 영어(en) · 일본어(ja)
   ============================================================ */

const TRANSLATIONS = {
  ko: {
    app_name: '아이랑',
    tagline: '아이와 함께, AI와 함께',
    nav_home: '홈',
    nav_explore: '탐색',
    nav_growth: '성장',
    nav_profile: '프로필',
    ai_banner_title: 'AI 육아 도우미에게 물어보세요',
    ai_banner_sub: 'Gemini · ChatGPT 연동 | 24시간 육아 상담',
    feed_tab_all: '전체',
    growth_title: '우리 아이 성장 기록 📊',
    growth_age: '아이 나이',
    growth_height: '키',
    growth_weight: '몸무게',
    upload_title: '새 게시물',
    upload_hint: '사진/영상을 선택하세요',
    upload_caption_placeholder: '아이의 소중한 순간을 기록해보세요... 💛',
    upload_submit: '🌱 게시하기',
    privacy_public: '🌍 전체 공개',
    privacy_followers: '👥 팔로워',
    privacy_family: '👨‍👩‍👧 가족만',
    privacy_private: '🔒 나만 보기',
    plan_free: '무료 플랜',
    plan_basic: '베이직 플랜',
    plan_premium: '프리미엄 플랜',
    subscribe_title: '구독 플랜 선택',
    comment_placeholder: '따뜻한 댓글을 남겨보세요 💛',
    baby_name_label: '아기 이름',
    baby_birthdate_label: '생년월일',
    save_btn: '저장',
    settings_title: '설정',
    ai_title: 'AI 육아 도우미',
    month_unit: '개월',
  },

  en: {
    app_name: 'Airang',
    tagline: 'Together with your child, together with AI',
    nav_home: 'Home',
    nav_explore: 'Explore',
    nav_growth: 'Growth',
    nav_profile: 'Profile',
    ai_banner_title: 'Ask the AI Parenting Assistant',
    ai_banner_sub: 'Gemini · ChatGPT | 24/7 Parenting Support',
    feed_tab_all: 'All',
    growth_title: "Baby's Growth Record 📊",
    growth_age: 'Age',
    growth_height: 'Height',
    growth_weight: 'Weight',
    upload_title: 'New Post',
    upload_hint: 'Select photos / videos',
    upload_caption_placeholder: "Record your baby's precious moments... 💛",
    upload_submit: '🌱 Post',
    privacy_public: '🌍 Public',
    privacy_followers: '👥 Followers',
    privacy_family: '👨‍👩‍👧 Family only',
    privacy_private: '🔒 Only me',
    plan_free: 'Free Plan',
    plan_basic: 'Basic Plan',
    plan_premium: 'Premium Plan',
    subscribe_title: 'Choose a Plan',
    comment_placeholder: 'Leave a warm comment 💛',
    baby_name_label: "Baby's name",
    baby_birthdate_label: 'Date of birth',
    save_btn: 'Save',
    settings_title: 'Settings',
    ai_title: 'AI Parenting Assistant',
    month_unit: 'months',
  },

  ja: {
    app_name: 'アイラン',
    tagline: '子供と一緒に、AIと一緒に',
    nav_home: 'ホーム',
    nav_explore: '探索',
    nav_growth: '成長',
    nav_profile: 'プロフィール',
    ai_banner_title: 'AI育児アシスタントに聞いてみよう',
    ai_banner_sub: 'Gemini · ChatGPT | 24時間育児相談',
    feed_tab_all: 'すべて',
    growth_title: '赤ちゃんの成長記録 📊',
    growth_age: '年齢',
    growth_height: '身長',
    growth_weight: '体重',
    upload_title: '新しい投稿',
    upload_hint: '写真・動画を選択',
    upload_caption_placeholder: '赤ちゃんの大切な瞬間を記録しよう... 💛',
    upload_submit: '🌱 投稿する',
    privacy_public: '🌍 全体公開',
    privacy_followers: '👥 フォロワー',
    privacy_family: '👨‍👩‍👧 家族のみ',
    privacy_private: '🔒 自分のみ',
    plan_free: '無料プラン',
    plan_basic: 'ベーシックプラン',
    plan_premium: 'プレミアムプラン',
    subscribe_title: 'プランを選択',
    comment_placeholder: 'あたたかいコメントをどうぞ 💛',
    baby_name_label: '赤ちゃんの名前',
    baby_birthdate_label: '生年月日',
    save_btn: '保存',
    settings_title: '設定',
    ai_title: 'AI育児アシスタント',
    month_unit: 'ヶ月',
  },
};

// ─── 현재 언어 감지 ───
function detectLanguage() {
  const saved = localStorage.getItem('airang_lang');
  if (saved && TRANSLATIONS[saved]) return saved;

  const browser = navigator.language?.slice(0, 2) || 'ko';
  const supported = ['ko', 'en', 'ja'];
  return supported.includes(browser) ? browser : 'ko';
}

let CURRENT_LANG = detectLanguage();

// ─── 번역 함수 ───
function t(key) {
  return TRANSLATIONS[CURRENT_LANG]?.[key] || TRANSLATIONS['ko'][key] || key;
}

// ─── 언어 변경 ───
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  CURRENT_LANG = lang;
  localStorage.setItem('airang_lang', lang);
  applyTranslations();
  document.documentElement.lang = lang;
}

// ─── DOM에 번역 적용 ───
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
}

// ─── 언어 선택 UI ───
function renderLanguageSwitcher() {
  const flags = { ko: '🇰🇷', en: '🇺🇸', ja: '🇯🇵' };
  const names = { ko: '한국어', en: 'English', ja: '日本語' };

  const switcher = document.getElementById('langSwitcher');
  if (!switcher) return;

  switcher.innerHTML = Object.keys(TRANSLATIONS).map(lang => `
    <div class="lang-btn ${lang === CURRENT_LANG ? 'active' : ''}"
      onclick="setLanguage('${lang}')" title="${names[lang]}">
      ${flags[lang]}
    </div>
  `).join('');
}
