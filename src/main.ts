import 'bulma/css/bulma.min.css';
import './styles.css';
import { fontList, parseContent } from './teleprompter';

// 状态管理

// const state: TeleprompterState = {
//   content: '请导入 txt 或 markdown 文件',
//   isMarkdown: false,
//   isMirrored: false,
//   scrollSpeed: 40,
//   fontFamily: fontList[0],
//   scrolling: false,
// };










window.onload = render;

const state = {
  content: '请导入 txt 或 markdown 文件',
  isMarkdown: false,
  isMirrored: false,
  isFullscreen: false,
  scrollSpeed: 40, // px/s
  fontFamily: fontList[0],
  scrolling: false,
  scrollTimer: null as any,
};

// 记忆滚动位置相关
let scrollLastTop: number | null = null;
const SCROLL_POS_KEY = 'teleprompter-scrollTop';

function render() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="teleprompter-container">
      <div class="teleprompter-controls">
        <label class="tele-btn tele-btn-file">
          <input class="file-input" type="file" accept=".txt,.md" id="file-input" style="display:none;" />
          <span>导入文件</span>
        </label>
        <div class="select is-small">
          <select id="font-select">
            ${fontList.map(f => `<option value="${f}"${state.fontFamily === f ? ' selected' : ''}>${f}</option>`).join('')}
          </select>
        </div>
        <input class="slider is-small is-fullwidth" style="width:120px;" type="range" min="10" max="200" id="speed-range" value="${state.scrollSpeed}" />
        <span style="font-size:0.9em;">速度: ${state.scrollSpeed} px/s</span>
        <button class="button is-info is-small tele-btn" id="mirror-btn">${state.isMirrored ? '关闭镜像' : '镜像模式'}</button>
        <button class="button is-primary is-small tele-btn" id="scroll-btn">
          ${state.scrolling ? '暂停' : '滚动'}
        </button>
      </div>
      <div id="content-area" class="teleprompter-content${state.isMirrored ? ' mirrored' : ''}" style="font-family:${state.fontFamily};">
        <div>${parseContent(state.content, state.isMarkdown)}</div>
      </div>
    </div>
  `;
  bindEvents();

  // 渲染后恢复滚动位置（仅在未滚动时）
  const el = document.getElementById('content-area');
  if (el && !state.scrolling) {
    const saved = localStorage.getItem(SCROLL_POS_KEY);
    if (saved) {
      el.scrollTop = parseFloat(saved) || 0;
    }
  }
}

function bindEvents() {
  document.getElementById('file-input')?.addEventListener('change', handleFile);
  document.getElementById('font-select')?.addEventListener('change', e => {
    state.fontFamily = (e.target as HTMLSelectElement).value;
    render();
  });
  document.getElementById('speed-range')?.addEventListener('input', e => {
    state.scrollSpeed = Number((e.target as HTMLInputElement).value);
    render();
  });
  document.getElementById('mirror-btn')?.addEventListener('click', () => {
    state.isMirrored = !state.isMirrored;
    render();
  });
  document.getElementById('scroll-btn')?.addEventListener('click', () => {
    if (state.scrolling) {
      stopScroll();
    } else {
      startScroll();
    }
  });
}

function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    state.isMarkdown = file.name.endsWith('.md');
    state.content = text;
    render();
  };
  reader.readAsText(file);
}

// 已移除全屏相关代码

// 已移除全屏相关代码



// requestAnimationFrame 优化滚动，支持记忆滚动位置

// 滚动记忆优化：只记忆滚动位置，不记忆时间戳，防止暂停后恢复跳跃
// ...已上移 scrollLastTop 和 SCROLL_POS_KEY 的声明...

function startScroll() {
  if (state.scrolling) return;
  state.scrolling = true;
  let lastTimestamp = performance.now();
  function step(now: number) {
    if (!state.scrolling) {
      // 记忆当前滚动位置
      const el = document.getElementById('content-area');
      if (el) {
        scrollLastTop = el.scrollTop;
        // 存储到 localStorage
        localStorage.setItem(SCROLL_POS_KEY, String(el.scrollTop));
      }
      return;
    }
    const el = document.getElementById('content-area');
    if (!el) return;
    // 恢复上次滚动位置（只在刚恢复滚动时生效）
    if (scrollLastTop !== null) {
      el.scrollTop = scrollLastTop;
      scrollLastTop = null;
      lastTimestamp = now;
    }
    const dt = Math.min(now - lastTimestamp, 100); // 限制最大步长，防止切换窗口时跳跃
    lastTimestamp = now;
    el.scrollTop += state.scrollSpeed * (dt / 1000);
    // 实时存储滚动位置
    localStorage.setItem(SCROLL_POS_KEY, String(el.scrollTop));
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
      stopScroll();
      return;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  render();
}

function stopScroll() {
  // 立即记忆当前滚动位置，防止因 requestAnimationFrame 延迟导致丢失
  const el = document.getElementById('content-area');
  if (el) {
    scrollLastTop = el.scrollTop;
    localStorage.setItem(SCROLL_POS_KEY, String(el.scrollTop));
  }
  state.scrolling = false;
  render();
}

// 页面关闭时记忆滚动位置
window.addEventListener('beforeunload', () => {
  const el = document.getElementById('content-area');
  if (el) {
    localStorage.setItem(SCROLL_POS_KEY, String(el.scrollTop));
  }
});
