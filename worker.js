const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Card Tab</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>⭐</text></svg>">
  <style>
    /* 主题主色（由绿→蓝） */
    :root {
      --accent: #3b82f6;        /* 主蓝 */
      --accent-hover: #2563eb;  /* 悬停蓝 */
      --accent-strong: #1d4ed8; /* 强调蓝 */
      --accent-dark: #60a5fa;   /* 暗色主蓝 */
      --accent-dark-hover: #3b82f6;
      --text: #222;
      --bg: #f8f6f2;
      --bg-dark: #121418;
    }

    /* 全局样式 */
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      transition: all 0.3s ease;
    }

    /* 暗色模式样式 */
    body.dark-theme {
      background-color: var(--bg-dark);
      color: #e3e3e3;
    }

    /* 固定元素样式 */
    .fixed-elements {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: var(--bg);
      z-index: 1000;
      padding: 10px;
      transition: all 0.3s ease;
      height: 150px;
      box-shadow: none;
    }

    body.dark-theme .fixed-elements {
      background-color: var(--bg-dark);
      box-shadow: none;
    }

    .category-button {
      padding: 5px 10px;
      border-radius: 15px;
      background-color: #f9fafb;
      color: var(--accent);
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      flex: 0 0 auto;
      white-space: nowrap;
      margin: 0 2px;
      position: relative;
      overflow: hidden;
    }

    body.dark-theme .category-button {
      background-color: #2a2e38;
      color: var(--accent-dark);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .category-button:hover {
      background-color: var(--accent);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
    }

    .category-button.active {
      background-color: var(--accent);
      color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
      font-weight: 600;
      border-bottom: 2px solid var(--accent-hover);
    }

    body.dark-theme .category-button:hover,
    body.dark-theme .category-button.active {
      background-color: var(--accent-dark);
      color: white;
    }

    .fixed-elements h3 {
      position: absolute;
      top: 10px;
      left: 20px;
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #222;
      transition: all 0.3s ease;
    }

    body.dark-theme .fixed-elements h3 {
      color: #e3e3e3;
    }

    /* 中心内容样式 */
    .center-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: none;
      text-align: center;
      padding: 0 10px;
    }

    /* 右上角控制区域样式 */
    .top-right-controls {
      position: fixed;
      top: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 1001;
    }

    .admin-btn,
    .login-btn {
      background-color: var(--accent);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .admin-btn:hover,
    .login-btn:hover {
      background-color: var(--accent-hover);
      transform: translateY(-1px);
    }

    body.dark-theme .admin-btn,
    body.dark-theme .login-btn {
      background-color: var(--accent-dark);
    }

    body.dark-theme .admin-btn:hover,
    body.dark-theme .login-btn:hover {
      background-color: var(--accent-dark-hover);
    }

    .github-btn {
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      padding: 0;
    }

    .github-btn:hover {
      transform: translateY(-2px);
    }

    .github-btn svg {
      width: 24px;
      height: 24px;
      fill: var(--accent);
      transition: fill 0.3s ease;
    }

    body.dark-theme .github-btn svg {
      fill: var(--accent-dark);
    }

    .bookmark-search-toggle {
      background-color: var(--accent);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      position: relative;
    }

    .bookmark-search-toggle:hover {
      background-color: var(--accent-hover);
      transform: translateY(-2px);
    }

    .bookmark-search-toggle svg {
      width: 20px;
      height: 20px;
      stroke: white;
    }

    body.dark-theme .bookmark-search-toggle {
      background-color: var(--accent-dark);
    }

    body.dark-theme .bookmark-search-toggle:hover {
      background-color: var(--accent-dark-hover);
    }

    .bookmark-search-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 140px;
      background-color: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 8px;
      margin-top: 4px;
      display: none;
      z-index: 1002;
    }

    .bookmark-search-dropdown.show {
      display: block;
    }

    .bookmark-search-dropdown input {
      width: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 13px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .bookmark-search-dropdown input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      outline: none;
    }

    .bookmark-search-dropdown input::placeholder {
      color: #999;
    }

    body.dark-theme .bookmark-search-dropdown {
      background-color: #323642;
      border-color: #444;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    body.dark-theme .bookmark-search-dropdown input {
      background-color: #252830;
      color: #e3e3e3;
      border-color: #444;
    }

    body.dark-theme .bookmark-search-dropdown input::placeholder {
      color: #888;
    }

    /* 登录弹窗样式 */
    .login-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(3px);
    }

    .login-modal-content {
      background-color: white;
      padding: 25px;
      border-radius: 10px;
      width: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      animation: modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .login-modal h3 {
      margin: 0 0 20px 0;
      color: #333;
      text-align: center;
      font-size: 18px;
    }

    .login-modal input {
      width: 100%;
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .login-modal input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      outline: none;
    }

    .login-modal-buttons {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .login-modal button {
      background-color: var(--accent);
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 13px;
    }

    .login-modal button:hover {
      background-color: var(--accent-hover);
    }

    .login-modal button.cancel {
      background-color: #f0f0f0;
      color: #333;
    }

    .login-modal button.cancel:hover {
      background-color: #e0e0e0;
    }

    body.dark-theme .login-modal-content {
      background-color: #252830;
      color: #e3e3e3;
    }

    body.dark-theme .login-modal h3 {
      color: #e3e3e3;
    }

    body.dark-theme .login-modal input {
      background-color: #323642;
      color: #e3e3e3;
      border-color: #444;
    }

    /* 悬浮提示样式 */
    @media (hover: hover) and (pointer: fine) {
      .has-tooltip { position: relative; }
      .has-tooltip::after {
        content: attr(data-tooltip);
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
        white-space: nowrap;
        z-index: 1000;
      }
      .has-tooltip::before {
        content: "";
        position: absolute;
        border: 6px solid transparent;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
      }
      .has-tooltip:hover::after,
      .has-tooltip:hover::before {
        opacity: 1;
      }
      .tooltip-bottom::after {
        top: 100%;
        left: 50%;
        margin-top: 12px;
        transform: translateX(-50%);
      }
      .tooltip-bottom::before {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: rgba(0, 0, 0, 0.75);
      }
      .tooltip-green::after {
        background: var(--accent);
        color: white;
      }
      .tooltip-green::before {
        border-bottom-color: var(--accent);
      }
      body.dark-theme .has-tooltip::after {
        background: rgba(151, 151, 151, 0.9);
        color: #eee;
      }
      body.dark-theme .has-tooltip::before {
        border-bottom-color: rgba(151, 151, 151, 0.9);
      }
      body.dark-theme .tooltip-green::after {
        background: var(--accent-dark);
        color: white;
      }
      body.dark-theme .tooltip-green::before {
        border-bottom-color: var(--accent-dark);
      }
    }

    /* 搜索结果样式 */
    .search-results-section { margin-bottom: 30px; }

    .search-results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid var(--accent);
    }

    body.dark-theme .search-results-header {
      background-color: #2d3748;
      border-left-color: var(--accent-dark);
    }

    .search-results-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    body.dark-theme .search-results-title { color: #e2e8f0; }

    .back-to-main {
      background-color: var(--accent);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .back-to-main:hover { background-color: var(--accent-hover); }

    body.dark-theme .back-to-main { background-color: var(--accent-dark); }
    body.dark-theme .back-to-main:hover { background-color: var(--accent-dark-hover); }

    .no-search-results {
      text-align: center;
      padding: 30px;
      color: #888;
      font-size: 16px;
    }

    body.dark-theme .no-search-results { color: #a0a0a0; }

    /* 管理控制按钮样式 */
    .add-remove-controls {
      display: none;
      flex-direction: column;
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      align-items: center;
      gap: 15px;
      z-index: 900;
    }

    .round-btn {
      background-color: var(--accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
    }

    .round-btn svg { pointer-events: none; display: block; margin: auto; }

    .round-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    body.dark-theme .round-btn { background-color: var(--accent-dark); }

    .add-btn { order: 1; }
    .remove-btn { order: 2; }
    .category-add-btn { order: 3; }
    .category-manage-btn { order: 4; }

    .content {
      margin-top: 170px;
      padding: 10px;
      max-width: 1600px;
      margin-left: auto;
      margin-right: auto;
      transition: opacity 0.3s ease;
    }

    .loading .content { opacity: 0.6; }

    /* 搜索栏 */
    .search-container {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .search-bar {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      width: 100%;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid #e0e0e0;
      transition: all 0.3s ease;
    }

    .search-bar:focus-within {
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--accent);
    }

    .search-bar select {
      border: none;
      background-color: #f4f7fa;
      padding: 10px 15px;
      font-size: 14px;
      color: var(--accent);
      width: 120px;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%233b82f6" d="M0 0l6 6 6-6z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 10px center;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 0;
    }

    select option {
      background-color: #fff;
      color: #333;
      padding: 10px;
      font-size: 14px;
      white-space: nowrap;
      overflow: visible;
    }

    body.dark-theme .search-bar {
      border-color: #323642;
      background-color: #1e2128;
    }

    body.dark-theme .search-bar select {
      background-color: #252830;
      color: var(--accent-dark);
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%2360a5fa" d="M0 0l6 6 6-6z"/></svg>');
    }

    body.dark-theme .search-bar input {
      background-color: #252830;
      color: #e3e3e3;
    }

    body.dark-theme .search-bar button { background-color: var(--accent-dark); }

    body.dark-theme select option {
      background-color: #252830;
      color: #e3e3e3;
      white-space: nowrap;
      overflow: visible;
    }

    .search-bar input {
      flex: 1;
      border: none;
      padding: 10px 15px;
      font-size: 14px;
      background-color: #fff;
      outline: none;
    }

    .search-bar button {
      border: none;
      background-color: var(--accent);
      color: white;
      padding: 0 20px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .search-bar button:hover { background-color: var(--accent-hover); }

    .category-buttons-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      padding: 8px 12px;
      width: 100%;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 5px;
      background-color: transparent;
      border-radius: 8px;
      box-shadow: none;
      transition: all 0.3s ease;
      position: relative;
    }

    body.dark-theme .category-buttons-container { background-color: transparent; box-shadow: none; }

    /* 滚动条 */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
    body.dark-theme::-webkit-scrollbar-track { background: #252830; }
    body.dark-theme::-webkit-scrollbar-thumb { background: #444; }
    body.dark-theme::-webkit-scrollbar-thumb:hover { background: #555; }

    .category-buttons-container::-webkit-scrollbar { height: 4px; }

    /* 浮动按钮组 */
    .floating-button-group {
      position: fixed;
      bottom: 50px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      z-index: 1000;
    }

    .floating-button-group button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--accent);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    }

    .floating-button-group button:hover {
      transform: translateY(-2px);
      background-color: var(--accent-hover);
    }

    #back-to-top-btn { display: none; }

    body.dark-theme .floating-button-group button { background-color: var(--accent-dark); }
    body.dark-theme .floating-button-group button:hover { background-color: var(--accent-dark-hover); }

    #theme-toggle { font-size: 24px; line-height: 40px; }

    /* 对话框 */
    #dialog-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(3px);
      transition: all 0.3s ease;
    }

    #dialog-box {
      background-color: white;
      padding: 25px;
      border-radius: 10px;
      width: 350px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      animation: dialogFadeIn 0.3s ease;
    }

    @keyframes dialogFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #dialog-box input, #dialog-box select {
      width: 100%;
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    #dialog-box input:focus, #dialog-box select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      outline: none;
    }

    #dialog-box label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #222;
    }

    #dialog-box button {
      background-color: var(--accent);
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-right: 10px;
    }

    #dialog-box button:hover { background-color: var(--accent-hover); }

    #dialog-box button.cancel {
      background-color: #f0f0f0;
      color: #333;
    }

    #dialog-box button.cancel:hover { background-color: #e0e0e0; }

    body.dark-theme #dialog-box { background-color: #252830; color: #e3e3e3; }

    body.dark-theme #dialog-box input,
    body.dark-theme #dialog-box select {
      background-color: #323642;
      color: #e3e3e3;
      border-color: #444;
    }

    body.dark-theme #dialog-box label { color: #a0b7d4; }

    /* 分类和卡片 */
    .section { margin-bottom: 25px; padding: 0 15px; }

    .section-title-container {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
      transition: border-color 0.3s ease;
      width: 100%;
      max-width: 1520px;
      margin-left: auto;
      margin-right: auto;
    }

    body.dark-theme .section-title-container { border-bottom-color: #2a2e38; }

    .section-title {
      font-size: 22px;
      font-weight: 600;
      color: #222;
      position: relative;
      padding-left: 15px;
      transition: color 0.3s ease;
      min-width: 120px;
    }

    body.dark-theme .section-title { color: #e3e3e3; }

    .section-title:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 22px;
      background-color: var(--accent);
      border-radius: 2px;
    }

    .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, 150px);
      column-gap: 35px;
      row-gap: 15px;
      justify-content: start;
      padding: 15px;
      padding-left: 45px;
      margin: 0 auto;
      max-width: 1600px;
    }

    .card {
      background-color: white;
      border-radius: 8px;
      padding: 12px;
      width: 150px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      user-select: none;
      border-left: 3px solid var(--accent);
      animation: fadeIn 0.3s ease forwards;
      animation-delay: calc(var(--card-index) * 0.05s);
      opacity: 0;
      margin: 2px;
    }

    body.dark-theme .card {
      background-color: #1e2128;
      border-left-color: var(--accent-dark);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
    }

    .card-top { display: flex; align-items: center; margin-bottom: 5px; }
    .card-icon { width: 16px; height: 16px; margin-right: 5px; }

    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: #222;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.3s ease;
    }

    .card-url {
      font-size: 12px;
      color: #888;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.3s ease;
    }

    body.dark-theme .card-title { color: #e3e3e3; }
    body.dark-theme .card-url { color: #a0a0a0; }

    .private-tag {
      background-color: #ff9800;
      color: white;
      font-size: 10px;
      padding: 2px 5px;
      border-radius: 3px;
      position: absolute;
      top: 18px;
      right: 5px;
      z-index: 5;
    }

    /* 响应式（移动端） */
    @media (max-width: 480px) {
      .fixed-elements {
        position: fixed;
        padding: 8px 12px 5px 12px;
        height: auto;
        min-height: 120px;
        box-shadow: none;
      }

      .category-buttons-container {
        width: 100%;
        max-width: none;
        padding: 6px;
        overflow-x: auto;
        flex-wrap: nowrap;
        justify-content: flex-start;
        margin: 8px auto 5px;
        scrollbar-width: none;
        -ms-overflow-style: none;
        background-color: transparent;
        border-radius: 8px;
        gap: 4px;
      }

      .category-button { padding: 4px 8px; font-size: 11px; margin: 0 1px; }

      .content {
        margin-top: 130px;
        margin-bottom: 100px;
        padding: 15px;
        transition: opacity 0.3s ease;
      }

      .center-content {
        position: static;
        transform: none;
        width: 100%;
        text-align: center;
        padding: 0 8px;
      }

      .search-container { margin-top: 15px; }

      .search-bar {
        flex-wrap: nowrap;
        max-width: 320px;
        width: 90%;
        margin: 6px auto 8px auto;
      }

      .search-bar select { width: 80px; flex: 0 0 auto; font-size: 12px; }
      .search-bar input { flex: 1; }
      .search-bar button { flex: 0 0 auto; }

      .card-container {
        display: grid;
        grid-template-columns: repeat(2, minmax(140px, 1fr));
        column-gap: 20px;
        row-gap: 10px;
        justify-content: center;
        padding: 12px;
        margin: 0 auto;
      }

      .card { width: auto; max-width: 100%; padding: 12px; margin: 0; border-radius: 8px; }
      .card-title { font-size: 13px; }
      .card-url { font-size: 11px; }

      .add-remove-controls {
        right: 5px;
        bottom: 150px;
        top: auto;
        transform: none;
        flex-direction: column;
        gap: 15px;
      }

      .round-btn { right: 10px; width: 36px; height: 36px; font-size: 20px; }

      .floating-button-group { bottom: 20px; right: 10px; }
      .floating-button-group button { width: 36px; height: 36px; font-size: 18px; }

      #dialog-box { width: 90%; max-width: 350px; padding: 20px; }

      .section-title { font-size: 20px; min-width: 100px; }
    }

    /* 自定义对话框样式 */
    .dialog-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .dialog-box {
      background-color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      width: 340px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      transform: translateY(-20px);
      animation: slideUp 0.3s ease forwards;
    }

    .dialog-title { margin: 0 0 15px 0; font-size: 18px; color: #333; }

    .dialog-content {
      padding: 15px 0;
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }

    .dialog-box input[type="text"] {
      width: 100%;
      margin-bottom: 16px;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      box-sizing: border-box;
      background-color: #ffffff !important;
    }

    .dialog-box input[type="text"]:focus {
      border-color: var(--accent) !important;
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .dialog-buttons { display: flex; justify-content: flex-end; gap: 10px; }

    .dialog-box button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dialog-confirm-btn {
      background-color: var(--accent);
      color: white;
    }

    .dialog-confirm-btn:hover { background-color: var(--accent-hover); }

    .dialog-cancel-btn { background-color: #f0f0f0; color: #555; }
    .dialog-cancel-btn:hover { background-color: #e0e0e0; }

    .top-z-index { z-index: 9999; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    body.dark-theme .dialog-box {
      background-color: #2d3748;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    body.dark-theme .dialog-title { color: #f8f9fa; }
    body.dark-theme .dialog-content { color: #f8f9fa; }

    body.dark-theme .dialog-box input[type="text"] {
      background-color: #3c4658 !important;
      color: #e3e3e3 !important;
      border-color: #4a5568 !important;
    }

    body.dark-theme .dialog-box input[type="text"]:focus {
      border-color: var(--accent-dark) !important;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
    }

    body.dark-theme .dialog-cancel-btn { background-color: #4a5568; color: #e3e3e3; }
    body.dark-theme .dialog-cancel-btn:hover { background-color: #3c4658; }

    body.dark-theme .dialog-confirm-btn { background-color: var(--accent-dark); }
    body.dark-theme .dialog-confirm-btn:hover { background-color: var(--accent-dark-hover); }

    /* 加载遮罩 */
    #loading-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      z-index: 7000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      background-color: #fff;
      padding: 20px 40px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 0 10px #0003;
      font-size: 16px;
      color: #333;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #ccc;
      border-top-color: var(--accent);
      border-radius: 50%;
      margin: 0 auto 10px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    body.dark-theme .loading-content { background-color: #2d3748; color: #f8f9fa; }

    /* 分类管理按钮 */
    .edit-category-btn, .move-category-btn {
      background-color: var(--accent);
      color: white;
      border: none;
      padding: 4px 8px;
      margin-left: 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      display: none;
    }

    .edit-category-btn:hover { background-color: var(--accent-hover); }

    .move-category-btn {
      background-color: var(--accent-strong);
      padding: 4px 6px;
      min-width: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .move-category-btn:hover { background-color: #1e40af; }

    .move-category-btn svg { width: 16px; height: 16px; fill: white; }

    .delete-category-btn {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 4px 8px;
      margin-left: 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      display: none;
    }

    .delete-category-btn:hover { background-color: #c0392b; }

    body.dark-theme .edit-category-btn { background-color: var(--accent-dark); }
    body.dark-theme .edit-category-btn:hover { background-color: var(--accent-dark-hover); }

    body.dark-theme .move-category-btn { background-color: var(--accent-strong); }
    body.dark-theme .move-category-btn:hover { background-color: #1e40af; }

    /* 分类管理按钮激活 */
    .category-manage-btn.active { background-color: #e74c3c; }
    .category-manage-btn.active:hover { background-color: #c0392b; }

    /* 卡片描述 */
    .card-tip {
      font-size: 12px;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 14px;
      max-height: 28px;
      margin-top: 5px;
    }

    body.dark-theme .card-tip { color: #a0a0a0; }

    /* 卡片按钮 */
    .card-actions {
      position: absolute;
      top: -12px;
      right: -12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      z-index: 15;
      height: 24px;
    }

    .card-btn {
      position: relative;
      z-index: 1;
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 50%;
      background: var(--accent);
      color: white;
      font-size: 12px;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
      padding: 0;
      margin: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
      vertical-align: top;
    }

    .card-btn:hover {
      z-index: 2;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .card-btn svg {
      width: 14px;
      height: 14px;
      stroke: currentColor;
      fill: none;
      display: block;
      margin: auto;
    }

    .edit-btn { background: var(--accent); }
    .delete-btn { background: #e74c3c; }

    body.dark-theme .edit-btn { background: var(--accent-dark); }
    body.dark-theme .delete-btn { background: #e74c3c; }

    /* 自定义提示框 */
    #custom-tooltip {
      position: absolute;
      display: none;
      z-index: 700;
      background: var(--accent);
      color: #fff;
      padding: 6px 10px;
      border-radius: 5px;
      font-size: 12px;
      pointer-events: none;
      max-width: 300px;
      white-space: pre-wrap;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: opacity 0.2s ease;
    }

    body.dark-theme #custom-tooltip { background: var(--accent-dark); }

    @media (hover: hover) and (pointer: fine) {
      .card:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
      }
      .card.no-hover:hover {
        transform: none !important;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2) !important;
      }
      body.dark-theme .card.no-hover:hover {
        transform: none !important;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2) !important;
      }
    }
  </style>
</head>

<body>
  <div class="fixed-elements">
    <h3>我的导航</h3>
    <div class="center-content">
      <!-- ✅ 名言模块已完全移除（HTML + CSS + JS + 外链） -->

      <!-- 搜索栏 -->
      <div class="search-container">
        <div class="search-bar">
          <select id="search-engine-select">
            <option value="baidu">百度</option>
            <option value="bing">必应</option>
            <option value="google">谷歌</option>
            <option value="duckduckgo">DuckDuckGo</option>
          </select>
          <input type="text" id="search-input" placeholder="" />
          <button id="search-button">🔍</button>
        </div>
      </div>
      <div id="category-buttons-container" class="category-buttons-container"></div>
    </div>

    <div class="top-right-controls">
      <button class="admin-btn" id="admin-btn" onclick="toggleAdminMode()" style="display: none;">设置</button>
      <button class="login-btn" id="login-btn" onclick="handleLoginClick()">登录</button>
      <button class="github-btn has-tooltip tooltip-bottom tooltip-green" onclick="openGitHub()" data-tooltip="喜欢请点个star">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </button>

      <div class="bookmark-search-toggle" onclick="toggleBookmarkSearch()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <div class="bookmark-search-dropdown" id="bookmark-search-dropdown">
          <input type="text" id="bookmark-search-input" placeholder="搜索书签..." />
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="add-remove-controls">
      <button class="round-btn add-btn" onclick="showAddDialog()" title="添加链接">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 6H8a2 2 0 0 0-2 2v8M16 42H8a2 2 0 0 1-2-2v-8M32 42h8a2 2 0 0 0 2-2v-8M32 6h8a2 2 0 0 1 2 2v8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M32 24H16M24 16v16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>

      <button class="round-btn remove-btn" onclick="toggleRemoveMode()" title="编辑链接">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 26v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M14 26.72V34h7.32L42 13.31 34.7 6 14 26.72Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>

      <button class="round-btn category-add-btn" onclick="addCategory()" title="添加分类">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8c0-1.1.9-2 2-2h12l5 6h17c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
          <path d="M18 27h12M24 21v12" stroke="white" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </button>

      <button class="round-btn category-manage-btn" onclick="toggleEditCategory()" title="编辑分类">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8c0-1.1.9-2 2-2h12l5 6h17c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
          <circle cx="24" cy="28" r="4" stroke="white" stroke-width="4" fill="none"/>
          <path d="M24 21v3m0 8v3m4.8-12-2.1 2.1M20.8 31l-2.1 2.1M19 23l2.1 2.1M27 31l2.1 2.1M17 28h3M28 28h3" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div id="sections-container"></div>

    <div class="floating-button-group">
      <button id="back-to-top-btn" onclick="scrollToTop()" style="display: none;">
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24l12-12 12 12m-24 12 12-12 12 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button id="theme-toggle" onclick="toggleTheme()">◑</button>
    </div>

    <div id="dialog-overlay">
      <div id="dialog-box">
        <label for="name-input">名称</label>
        <input type="text" id="name-input" placeholder="必填" />
        <label for="url-input">地址</label>
        <input type="text" id="url-input" placeholder="必填" />
        <label for="tips-input">描述</label>
        <input type="text" id="tips-input" placeholder="可选" />
        <label for="icon-input">图标</label>
        <input type="text" id="icon-input" placeholder="可选" />
        <label for="category-select">选择分类</label>
        <select id="category-select"></select>
        <div class="private-link-container">
          <label for="private-checkbox">私密链接</label>
          <input type="checkbox" id="private-checkbox" />
        </div>
        <div class="dialog-buttons">
          <button class="dialog-cancel-btn" id="dialog-cancel-btn">取消</button>
          <button class="dialog-confirm-btn" id="dialog-confirm-btn">确定</button>
        </div>
      </div>
    </div>

    <div id="login-modal" class="login-modal">
      <div class="login-modal-content">
        <h3>登录</h3>
        <input type="password" id="login-password" placeholder="请输入密码" />
        <div class="login-modal-buttons">
          <button class="cancel" onclick="hideLoginModal()">取消</button>
          <button onclick="performLogin()">确定</button>
        </div>
      </div>
    </div>

    <div class="dialog-overlay top-z-index" id="custom-alert-overlay" style="display: none;">
      <div class="dialog-box" id="custom-alert-box">
        <h3 class="dialog-title" id="custom-alert-title">提示</h3>
        <div class="dialog-content" id="custom-alert-content">这里是提示内容</div>
        <div class="dialog-buttons">
          <button class="dialog-confirm-btn" id="custom-alert-confirm">确定</button>
        </div>
      </div>
    </div>

    <div class="dialog-overlay top-z-index" id="custom-confirm-overlay" style="display: none;">
      <div class="dialog-box">
        <div class="dialog-content" id="custom-confirm-message"></div>
        <div class="dialog-buttons">
          <button id="custom-confirm-cancel" class="dialog-cancel-btn">取消</button>
          <button id="custom-confirm-ok" class="dialog-confirm-btn">确定</button>
        </div>
      </div>
    </div>

    <div class="dialog-overlay" id="category-dialog" style="display: none;">
      <div class="dialog-box">
        <h3 id="category-dialog-title" class="dialog-title">新建分类</h3>
        <input type="text" id="category-name-input" class="category-dialog-input" placeholder="请输入分类名称" />
        <div class="dialog-buttons">
          <button id="category-cancel-btn" class="dialog-cancel-btn">取消</button>
          <button id="category-confirm-btn" class="dialog-confirm-btn">确定</button>
        </div>
      </div>
    </div>

    <div id="loading-mask" style="display:none;">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>加载中，请稍候...</p>
      </div>
    </div>
  </div>

  <div id="custom-tooltip"></div>

  <script>
    // 搜索引擎配置
    const searchEngines = {
      baidu: "https://www.baidu.com/s?wd=",
      bing: "https://www.bing.com/search?q=",
      google: "https://www.google.com/search?q=",
      duckduckgo: "https://duckduckgo.com/?q="
    };

    let currentEngine = "baidu";

    function logAction(action, details) {
      const timestamp = new Date().toISOString();
      const logEntry = timestamp + ': ' + action + ' - ' + JSON.stringify(details);
      console.log(logEntry);
    }

    function setActiveEngine(engine) {
      currentEngine = engine;
      document.getElementById('search-engine-select').value = engine;
      logAction('设置搜索引擎', { engine });
    }

    document.getElementById('search-engine-select').addEventListener('change', function() {
      setActiveEngine(this.value);
    });

    document.getElementById('search-button').addEventListener('click', () => {
      const query = document.getElementById('search-input').value;
      if (query) {
        logAction('执行搜索', { engine: currentEngine, query });
        window.open(searchEngines[currentEngine] + encodeURIComponent(query), '_blank');
      }
    });

    document.getElementById('search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') document.getElementById('search-button').click();
    });

    setActiveEngine(currentEngine);

    // 全局变量
    let publicLinks = [];
    let privateLinks = [];
    let isAdmin = false;
    let isLoggedIn = false;
    let removeMode = false;
    let isRemoveCategoryMode = false;
    let isEditCategoryMode = false;
    let isDarkTheme = false;
    let links = [];
    const categories = {};

    async function addCategory() {
      if (!await validateToken()) return;
      const categoryName = await showCategoryDialog('请输入新分类名称');
      if (categoryName && !categories[categoryName]) {
        categories[categoryName] = [];
        updateCategorySelect();
        renderSections();
        saveLinks();
        logAction('添加分类', { categoryName, currentLinkCount: links.length });
      } else if (categories[categoryName]) {
        await customAlert('该分类已存在', '添加分类');
        logAction('添加分类失败', { categoryName, reason: '分类已存在' });
      }
    }

    async function deleteCategory(category) {
      if (!await validateToken()) return;
      const message = '确定要删除 "' + category + '" 分类吗？这将删除该分类下的所有链接。';
      const confirmed = await customConfirm(message, '确定', '取消');
      if (confirmed) {
        delete categories[category];
        links = links.filter(link => link.category !== category);
        publicLinks = publicLinks.filter(link => link.category !== category);
        privateLinks = privateLinks.filter(link => link.category !== category);
        updateCategorySelect();
        renderSections();
        renderCategoryButtons();
        saveLinks();
        logAction('删除分类', { category });
      }
    }

    async function editCategoryName(oldName) {
      if (!await validateToken()) return;
      const newName = await showCategoryDialog('请输入新的分类名称', oldName);
      if (!newName || newName === oldName) return;
      if (categories[newName]) {
        await customAlert('该名称已存在，请重新命名', '编辑分类');
        return;
      }
      categories[newName] = categories[oldName];
      delete categories[oldName];
      [...publicLinks, ...privateLinks].forEach(link => {
        if (link.category === oldName) link.category = newName;
      });
      links.forEach(link => {
        if (link.category === oldName) link.category = newName;
      });
      renderSections();
      renderCategoryButtons();
      updateCategorySelect();
      saveLinks();
      logAction('编辑分类名称', { oldName, newName });
    }

    async function moveCategory(categoryName, direction) {
      if (!await validateToken()) return;
      const keys = Object.keys(categories);
      const index = keys.indexOf(categoryName);
      if (index < 0) return;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= keys.length) return;
      const newCategories = {};
      const reordered = [...keys];
      [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
      reordered.forEach(key => { newCategories[key] = categories[key]; });
      Object.keys(categories).forEach(k => delete categories[k]);
      Object.assign(categories, newCategories);
      renderSections();
      renderCategoryButtons();
      updateCategorySelect();
      saveLinks();
      logAction('移动分类', { categoryName, direction });
    }

    function toggleEditCategory() {
      isEditCategoryMode = !isEditCategoryMode;
      const deleteButtons = document.querySelectorAll('.delete-category-btn');
      const editButtons = document.querySelectorAll('.edit-category-btn');
      const moveButtons = document.querySelectorAll('.move-category-btn');
      deleteButtons.forEach(btn => { btn.style.display = isEditCategoryMode ? 'inline-block' : 'none'; });
      editButtons.forEach(btn => { btn.style.display = isEditCategoryMode ? 'inline-block' : 'none'; });
      moveButtons.forEach(btn => { btn.style.display = isEditCategoryMode ? 'inline-block' : 'none'; });
      const manageButton = document.querySelector('.category-manage-btn');
      if (manageButton) {
        if (isEditCategoryMode) manageButton.classList.add('active');
        else manageButton.classList.remove('active');
      }
      logAction('切换分类编辑模式', { isEditCategoryMode });
    }

    function renderCategoryButtons() {
      if (isShowingSearchResults) return;
      const buttonsContainer = document.getElementById('category-buttons-container');
      buttonsContainer.innerHTML = '';

      if (Object.keys(categories).length > 0) {
        const displayedCategories = [];
        document.querySelectorAll('#sections-container .section-title').forEach(titleElement => {
          displayedCategories.push(titleElement.textContent);
        });

        let visibleButtonsCount = 0;
        displayedCategories.forEach(category => {
          const visibleLinks = links.filter(function(link) {
            return link.category === category && (!link.isPrivate || isLoggedIn);
          });

          if (visibleLinks.length > 0) {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;
            button.dataset.category = category;
            button.onclick = () => {
              if (isShowingSearchResults) hideSearchResults();
              document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');
              scrollToCategory(category);
            };
            buttonsContainer.appendChild(button);
            visibleButtonsCount++;
          }
        });

        if (visibleButtonsCount > 0) buttonsContainer.style.display = 'flex';
        else buttonsContainer.style.display = 'none';

        setTimeout(setActiveCategoryButtonByVisibility, 100);
      } else {
        buttonsContainer.style.display = 'none';
      }
    }

    function setActiveCategoryButtonByVisibility() {
      if (isShowingSearchResults) return;
      const sections = document.querySelectorAll('.section');
      if (!sections.length) return;

      const viewportHeight = window.innerHeight;
      const fixedElementsHeight = 170;
      const viewportCenter = viewportHeight / 2 + fixedElementsHeight;

      let closestSection = null;
      let closestDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection) {
        const cardContainer = closestSection.querySelector('.card-container');
        if (cardContainer && cardContainer.id) {
          const categoryId = cardContainer.id;
          const buttons = document.querySelectorAll('.category-button');
          buttons.forEach(btn => btn.classList.remove('active'));
          buttons.forEach(btn => { if (btn.dataset.category === categoryId) btn.classList.add('active'); });
        }
      }
    }

    window.addEventListener('scroll', debounce(setActiveCategoryButtonByVisibility, 100));

    function debounce(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => { func.apply(context, args); }, wait);
      };
    }

    function scrollToCategory(category) {
      const section = document.getElementById(category);
      if (section) {
        let offset = 230;
        if (window.innerWidth <= 480) offset = 120;
        const sectionRect = section.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + sectionRect.top - offset;
        window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
        logAction('滚动到分类', { category });
      }
    }

    async function loadLinks() {
      const headers = { 'Content-Type': 'application/json' };
      if (isLoggedIn) {
        const token = localStorage.getItem('authToken');
        if (token) headers['Authorization'] = token;
      }

      try {
        const response = await fetch('/api/getLinks?userId=testUser', { headers });
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const data = await response.json();

        if (data.categories) Object.assign(categories, data.categories);
        publicLinks = data.links ? data.links.filter(link => !link.isPrivate) : [];
        privateLinks = data.links ? data.links.filter(link => link.isPrivate) : [];
        links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

        renderSections();
        updateCategorySelect();
        updateUIState();
        logAction('读取链接', {
          publicCount: publicLinks.length,
          privateCount: privateLinks.length,
          isLoggedIn: isLoggedIn,
          hasToken: !!localStorage.getItem('authToken')
        });
      } catch (error) {
        console.error('Failed to load links');
        console.error('加载链接时出错，请刷新页面重试');
      }
    }

    function updateUIState() {
      const addRemoveControls = document.querySelector('.add-remove-controls');
      if (isAdmin) addRemoveControls.style.display = 'flex';
      else addRemoveControls.style.display = 'none';
      updateLoginButton();
      logAction('更新UI状态', { isAdmin, isLoggedIn });
    }

    function showSecretGarden() {
      if (isLoggedIn) {
        links = [...publicLinks, ...privateLinks];
        renderSections();
        document.querySelectorAll('.private-tag').forEach(tag => { tag.style.display = 'block'; });
        logAction('显示私密花园');
      }
    }

    function renderSections() {
      const container = document.getElementById('sections-container');
      container.innerHTML = '';

      Object.keys(categories).forEach(category => {
        const section = document.createElement('div');
        section.className = 'section';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'section-title-container';

        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = category;
        titleContainer.appendChild(title);

        if (isAdmin) {
          const editBtn = document.createElement('button');
          editBtn.textContent = '编辑名称';
          editBtn.className = 'edit-category-btn';
          editBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
          editBtn.onclick = () => editCategoryName(category);
          titleContainer.appendChild(editBtn);

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '删除分类';
          deleteBtn.className = 'delete-category-btn';
          deleteBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
          deleteBtn.onclick = () => deleteCategory(category);
          titleContainer.appendChild(deleteBtn);

          const upBtn = document.createElement('button');
          upBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6l-6 6h4v6h4v-6h4z"/></svg>';
          upBtn.className = 'move-category-btn';
          upBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
          upBtn.onclick = () => moveCategory(category, -1);
          titleContainer.appendChild(upBtn);

          const downBtn = document.createElement('button');
          downBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 18l6-6h-4v-6h-4v6h-4z"/></svg>';
          downBtn.className = 'move-category-btn';
          downBtn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
          downBtn.onclick = () => moveCategory(category, 1);
          titleContainer.appendChild(downBtn);
        }

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.id = category;

        section.appendChild(titleContainer);
        section.appendChild(cardContainer);

        let privateCount = 0;
        let linkCount = 0;

        links.forEach(link => {
          if (link.category === category) {
            if (link.isPrivate) privateCount++;
            linkCount++;
            createCard(link, cardContainer);
          }
        });

        if (privateCount < linkCount || isLoggedIn) {
          container.appendChild(section);
        }
      });

      renderCategoryButtons();
      logAction('渲染分类和链接', { isAdmin: isAdmin, linkCount: links.length, categoryCount: Object.keys(categories).length });
    }

    function extractDomain(url) {
      let domain;
      try { domain = new URL(url).hostname; } catch (e) { domain = url; }
      return domain;
    }

    function isValidUrl(url) {
      try { new URL(url); return true; } catch { return false; }
    }

    function createCard(link, container) {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('draggable', isAdmin);
      card.dataset.isPrivate = link.isPrivate;
      card.setAttribute('data-url', link.url);

      const cardIndex = container.children.length;
      card.style.setProperty('--card-index', cardIndex);

      const cardTop = document.createElement('div');
      cardTop.className = 'card-top';

      const defaultIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' +
      '</svg>';

      const icon = document.createElement('img');
      icon.className = 'card-icon';

      icon.src = (!link.icon || typeof link.icon !== 'string' || !link.icon.trim() || !isValidUrl(link.icon))
        ? 'https://www.faviconextractor.com/favicon/' + extractDomain(link.url)
        : link.icon;

      icon.alt = 'Website Icon';

      icon.onerror = function() {
        const svgBlob = new Blob([defaultIconSVG], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        this.src = svgUrl;
        this.onload = () => URL.revokeObjectURL(svgUrl);
      };

      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = link.name;

      cardTop.appendChild(icon);
      cardTop.appendChild(title);

      const url = document.createElement('div');
      url.className = 'card-url';
      url.textContent = link.url;

      card.appendChild(cardTop);
      card.appendChild(url);

      if (link.isPrivate) {
        const privateTag = document.createElement('div');
        privateTag.className = 'private-tag';
        privateTag.textContent = '私密';
        card.appendChild(privateTag);
      }

      const correctedUrl = (link.url.startsWith('http://') || link.url.startsWith('https://')) ? link.url : 'http://' + link.url;

      if (!isAdmin) {
        card.addEventListener('click', () => {
          window.open(correctedUrl, '_blank');
          logAction('打开链接', { name: link.name, url: correctedUrl });
        });
      }

      const cardActions = document.createElement('div');
      cardActions.className = 'card-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'card-btn edit-btn';
      editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>' +
        '<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>' +
      '</svg>';
      editBtn.title = '编辑';
      editBtn.onclick = function(event) { event.stopPropagation(); showEditDialog(link); };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'card-btn delete-btn';
      deleteBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="3,6 5,6 21,6"></polyline>' +
        '<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>' +
        '<line x1="10" y1="11" x2="10" y2="17"></line>' +
        '<line x1="14" y1="11" x2="14" y2="17"></line>' +
      '</svg>';
      deleteBtn.title = '删除';
      deleteBtn.onclick = function(event) { event.stopPropagation(); removeCard(card); };

      cardActions.appendChild(editBtn);
      cardActions.appendChild(deleteBtn);
      card.appendChild(cardActions);

      card.addEventListener('mousemove', (e) => handleTooltipMouseMove(e, link.tips, isAdmin));
      card.addEventListener('mouseleave', handleTooltipMouseLeave);

      card.addEventListener('dragstart', dragStart);
      card.addEventListener('dragover', dragOver);
      card.addEventListener('dragend', dragEnd);
      card.addEventListener('drop', drop);
      card.addEventListener('touchstart', touchStart, { passive: false });

      if (isAdmin && removeMode) {
        editBtn.style.display = 'flex';
        deleteBtn.style.display = 'flex';
      }

      if (isAdmin || (link.isPrivate && isLoggedIn) || !link.isPrivate) {
        container.appendChild(card);
      }
    }

    function updateCategorySelect() {
      const categorySelect = document.getElementById('category-select');
      categorySelect.innerHTML = '';
      Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      logAction('更新分类选择', { categoryCount: Object.keys(categories).length });
    }

    async function saveLinks() {
      if (isAdmin && !(await validateToken())) return;
      let allLinks = [...publicLinks, ...privateLinks];
      try {
        await fetch('/api/saveOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authToken')
          },
          body: JSON.stringify({ userId: 'testUser', links: allLinks, categories: categories }),
        });
        logAction('保存链接', { linkCount: allLinks.length, categoryCount: Object.keys(categories).length });
      } catch (error) {
        logAction('保存链接失败', { error: 'Save operation failed' });
        console.error('保存链接失败，请重试');
      }
    }

    async function addLink() {
      if (!await validateToken()) return;
      const name = document.getElementById('name-input').value.trim();
      const url = document.getElementById('url-input').value.trim();
      const tips = document.getElementById('tips-input').value.trim();
      const icon = document.getElementById('icon-input').value.trim();
      const category = document.getElementById('category-select').value;
      const isPrivate = document.getElementById('private-checkbox').checked;

      if (!name || !url || !category) {
        let errorMessage = '';
        if (!name && !url) errorMessage = '请输入名称和URL';
        else if (!name) errorMessage = '请输入名称';
        else if (!url) errorMessage = '请输入URL';
        await customAlert(errorMessage, '添加卡片');
        if (!name) document.getElementById('name-input').focus();
        else if (!url) document.getElementById('url-input').focus();
        return;
      }

      const normalizedUrl = url.toLowerCase();
      const allLinks = [...publicLinks, ...privateLinks];
      const isUrlExists = allLinks.some(link => link.url.toLowerCase() === normalizedUrl);
      if (isUrlExists) {
        await customAlert('该URL已存在，请勿重复添加', '添加卡片');
        document.getElementById('url-input').focus();
        return;
      }

      const newLink = { name, url, tips, icon, category, isPrivate };
      if (isPrivate) privateLinks.push(newLink);
      else publicLinks.push(newLink);

      links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

      if (isAdmin || (isPrivate && isLoggedIn) || !isPrivate) {
        const container = document.getElementById(category);
        if (container) createCard(newLink, container);
        else { categories[category] = []; renderSections(); }
      }

      saveLinks();

      document.getElementById('name-input').value = '';
      document.getElementById('url-input').value = '';
      document.getElementById('tips-input').value = '';
      document.getElementById('icon-input').value = '';
      document.getElementById('private-checkbox').checked = false;
      hideAddDialog();

      logAction('添加卡片', { name, url, tips, icon, category, isPrivate });
    }

    async function removeCard(card) {
      if (!await validateToken()) return;
      const name = card.querySelector('.card-title').textContent;
      const url = card.getAttribute('data-url');
      const isPrivate = card.dataset.isPrivate === 'true';

      const confirmed = await customConfirm('确定要删除 "' + name + '" 吗？', '确定', '取消');
      if (!confirmed) return;

      links = links.filter(link => link.url !== url);
      if (isPrivate) privateLinks = privateLinks.filter(link => link.url !== url);
      else publicLinks = publicLinks.filter(link => link.url !== url);

      for (const key in categories) {
        categories[key] = categories[key].filter(link => link.url !== url);
      }

      card.remove();
      saveLinks();
      logAction('删除卡片', { name, url, isPrivate });
    }

    let draggedCard = null;
    let touchStartX, touchStartY;

    function touchStart(event) {
      if (!isAdmin) return;
      draggedCard = event.target.closest('.card');
      if (!draggedCard) return;

      event.preventDefault();
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      draggedCard.classList.add('dragging');

      document.addEventListener('touchmove', touchMove, { passive: false });
      document.addEventListener('touchend', touchEnd);
    }

    function touchMove(event) {
      if (!draggedCard) return;
      event.preventDefault();

      const touch = event.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;

      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;
      draggedCard.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";

      const target = findCardUnderTouch(currentX, currentY);
      if (target && target !== draggedCard) {
        const container = target.parentElement;
        const targetRect = target.getBoundingClientRect();

        if (currentX < targetRect.left + targetRect.width / 2) container.insertBefore(draggedCard, target);
        else container.insertBefore(draggedCard, target.nextSibling);
      }
    }

    function touchEnd(event) {
      if (!draggedCard) return;
      const card = draggedCard;
      const targetCategory = card.closest('.card-container').id;
      if (isAdmin && card) {
        updateCardCategory(card, targetCategory);
        saveCardOrder().catch(error => console.error('Save failed:', error));
      }
      cleanupDragState();
    }

    function findCardUnderTouch(x, y) {
      const cards = document.querySelectorAll('.card:not(.dragging)');
      return Array.from(cards).find(card => {
        const rect = card.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      });
    }

    function dragStart(event) {
      if (!isAdmin) { event.preventDefault(); return; }
      draggedCard = event.target.closest('.card');
      if (!draggedCard) return;
      draggedCard.classList.add('dragging');
      event.dataTransfer.effectAllowed = "move";
      logAction('开始拖拽卡片', { name: draggedCard.querySelector('.card-title').textContent });
    }

    function dragOver(event) {
      if (!isAdmin) { event.preventDefault(); return; }
      event.preventDefault();
      const target = event.target.closest('.card');
      if (target && target !== draggedCard) {
        const container = target.parentElement;
        const mousePositionX = event.clientX;
        const targetRect = target.getBoundingClientRect();
        if (mousePositionX < targetRect.left + targetRect.width / 2) container.insertBefore(draggedCard, target);
        else container.insertBefore(draggedCard, target.nextSibling);
      }
    }

    function cleanupDragState() {
      if (draggedCard) {
        draggedCard.classList.remove('dragging');
        draggedCard.style.transform = '';
        draggedCard = null;
      }
      document.removeEventListener('touchmove', touchMove);
      document.removeEventListener('touchend', touchEnd);
      touchStartX = null;
      touchStartY = null;
    }

    function drop(event) {
      if (!isAdmin) { event.preventDefault(); return; }
      event.preventDefault();
      const card = draggedCard;
      const targetCategory = event.target.closest('.card-container').id;
      validateToken().then(isValid => {
        if (isValid && card) {
          updateCardCategory(card, targetCategory);
          saveCardOrder().catch(error => console.error('Save failed:', error));
        }
        cleanupDragState();
      });
    }

    function dragEnd(event) {
      if (draggedCard) {
        draggedCard.classList.remove('dragging');
        logAction('拖拽卡片结束');
      }
    }

    function updateCardCategory(card, newCategory) {
      const cardUrl = card.getAttribute('data-url');
      const isPrivate = card.dataset.isPrivate === 'true';

      const linkIndex = links.findIndex(link => link.url === cardUrl);
      if (linkIndex !== -1) links[linkIndex].category = newCategory;

      const linkArray = isPrivate ? privateLinks : publicLinks;
      const arrayIndex = linkArray.findIndex(link => link.url === cardUrl);
      if (arrayIndex !== -1) linkArray[arrayIndex].category = newCategory;

      card.dataset.category = newCategory;
    }

    document.addEventListener('DOMContentLoaded', function() {
      const cardContainers = document.querySelectorAll('.card-container');
      cardContainers.forEach(container => {
        container.addEventListener('touchstart', touchStart, { passive: false });
      });
    });

    async function saveCardOrder() {
      if (!await validateToken()) return;
      const containers = document.querySelectorAll('.card-container');
      let newPublicLinks = [];
      let newPrivateLinks = [];
      let newCategories = {};

      containers.forEach(container => {
        const category = container.id;
        newCategories[category] = [];

        [...container.children].forEach(card => {
          const url = card.getAttribute('data-url');
          const name = card.querySelector('.card-title').textContent;
          const isPrivate = card.dataset.isPrivate === 'true';
          card.dataset.category = category;

          const originalLink = links.find(link => link.url === url);
          const tips = originalLink?.tips || '';
          const icon = originalLink?.icon || '';

          const link = { name, url, tips, icon, category, isPrivate };
          if (isPrivate) newPrivateLinks.push(link);
          else newPublicLinks.push(link);
          newCategories[category].push(link);
        });
      });

      publicLinks.length = 0;
      publicLinks.push(...newPublicLinks);
      privateLinks.length = 0;
      privateLinks.push(...newPrivateLinks);
      Object.keys(categories).forEach(key => delete categories[key]);
      Object.assign(categories, newCategories);

      try {
        const response = await fetch('/api/saveOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authToken')
          },
          body: JSON.stringify({
            userId: 'testUser',
            links: [...newPublicLinks, ...newPrivateLinks],
            categories: newCategories
          }),
        });
        const result = await response.json();
        if (!result.success) throw new Error('Failed to save order');
        logAction('保存卡片顺序', {
          publicCount: newPublicLinks.length,
          privateCount: newPrivateLinks.length,
          categoryCount: Object.keys(newCategories).length
        });
      } catch (error) {
        logAction('保存顺序失败', { error: error.message });
        await customAlert('保存顺序失败，请重试', '保存失败');
      }
    }

    async function reloadCardsAsAdmin() {
      document.querySelectorAll('.card-container').forEach(container => { container.innerHTML = ''; });
      await loadLinks();
      logAction('重新加载卡片（管理员模式）');
    }

    async function handleLoginClick() {
      if (isLoggedIn) {
        const confirmed = await customConfirm('确定要退出登录吗？', '确定', '取消');
        if (confirmed) await logout();
      } else {
        showLoginModal();
      }
    }

    function showLoginModal() {
      document.getElementById('login-modal').style.display = 'flex';
      document.getElementById('login-password').focus();
    }

    function hideLoginModal() {
      document.getElementById('login-modal').style.display = 'none';
      document.getElementById('login-password').value = '';
    }

    async function performLogin() {
      const password = document.getElementById('login-password').value;
      if (!password) {
        await customAlert('请输入密码', '提示');
        return;
      }

      try {
        const result = await verifyPassword(password);
        if (result.valid) {
          isLoggedIn = true;
          localStorage.setItem('authToken', result.token);
          loadLinks();
          hideLoginModal();
          updateLoginButton();
          await customAlert('登录成功！', '登录');
          logAction('登录成功');
        } else {
          await customAlert('密码错误', '登录失败');
          logAction('登录失败', { reason: result.error || '密码错误' });
        }
      } catch (error) {
        console.error('Login error occurred');
        await customAlert('登录过程出错，请重试', '错误');
      }
    }

    async function logout() {
      isLoggedIn = false;
      isAdmin = false;
      localStorage.removeItem('authToken');
      links = publicLinks;
      renderSections();
      updateLoginButton();
      await customAlert('退出登录成功！', '退出登录');
      updateUIState();
      logAction('退出登录');
    }

    function updateLoginButton() {
      const loginBtn = document.getElementById('login-btn');
      const adminBtn = document.getElementById('admin-btn');

      if (isLoggedIn) {
        loginBtn.textContent = '退出登录';
        adminBtn.style.display = 'inline-block';
        adminBtn.textContent = isAdmin ? '离开设置' : '设置';
      } else {
        loginBtn.textContent = '登录';
        adminBtn.style.display = 'none';
      }
    }

    function openGitHub() {
      window.open('https://github.com/hmhm2022/Card-Tab', '_blank');
      logAction('访问GitHub仓库');
    }

    function toggleBookmarkSearch() {
      const dropdown = document.getElementById('bookmark-search-dropdown');
      const isVisible = dropdown.classList.contains('show');
      if (isVisible) dropdown.classList.remove('show');
      else {
        dropdown.classList.add('show');
        document.getElementById('bookmark-search-input').focus();
      }
    }

    document.addEventListener('click', function(event) {
      const searchToggle = document.querySelector('.bookmark-search-toggle');
      const dropdown = document.getElementById('bookmark-search-dropdown');
      if (!searchToggle.contains(event.target)) dropdown.classList.remove('show');
    });

    document.getElementById('login-password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performLogin();
    });

    async function toggleAdminMode() {
      const addRemoveControls = document.querySelector('.add-remove-controls');

      if (!isAdmin && isLoggedIn) {
        if (!await validateToken()) return;
        showLoading('正在进入设置模式...');

        try {
          const response = await fetch('/api/backupData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('authToken')
            },
            body: JSON.stringify({ sourceUserId: 'testUser', backupUserId: 'backup' }),
          });
          const result = await response.json();
          if (!result.success) throw new Error('备份失败');
          logAction('数据备份成功');
        } catch (error) {
          logAction('数据备份失败', { error: 'Backup operation failed' });
          hideLoading();
          const confirmed = await customConfirm('备份失败，是否仍要继续进入设置模式？', '是', '否');
          if (!confirmed) return;
          showLoading('正在进入设置模式...');
        }

        try {
          isAdmin = true;
          addRemoveControls.style.display = 'flex';
          await reloadCardsAsAdmin();
          logAction('进入设置');
          hideLoading();
          await customAlert('准备设置分类和书签', '设置模式');
        } finally {
          hideLoading();
        }
      } else if (isAdmin) {
        isAdmin = false;
        removeMode = false;
        isRemoveCategoryMode = false;
        isEditCategoryMode = false;

        const manageButton = document.querySelector('.category-manage-btn');
        if (manageButton) manageButton.classList.remove('active');

        addRemoveControls.style.display = 'none';
        await reloadCardsAsAdmin();
        logAction('离开设置');
        await customAlert('设置已保存', '设置完成');
      }

      updateLoginButton();
      updateUIState();
    }

    let currentConfirmHandler = null;
    let currentCancelHandler = null;

    function showEditDialog(link) {
      document.getElementById('dialog-overlay').style.display = 'flex';
      document.getElementById('name-input').value = link.name;
      document.getElementById('url-input').value = link.url;
      document.getElementById('tips-input').value = link.tips || '';
      document.getElementById('icon-input').value = link.icon || '';
      document.getElementById('category-select').value = link.category;
      document.getElementById('private-checkbox').checked = link.isPrivate;

      const confirmBtn = document.getElementById('dialog-confirm-btn');
      const cancelBtn = document.getElementById('dialog-cancel-btn');

      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      if (currentConfirmHandler) confirmBtn.removeEventListener('click', currentConfirmHandler);
      if (currentCancelHandler) cancelBtn.removeEventListener('click', currentCancelHandler);

      currentConfirmHandler = async function(event) {
        event.preventDefault();
        event.stopPropagation();
        await updateLink(link);
      };

      currentCancelHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();
        hideAddDialog();
      };

      confirmBtn.addEventListener('click', currentConfirmHandler);
      cancelBtn.addEventListener('click', currentCancelHandler);
      logAction('显示编辑链接对话框');
    }

    function showAddDialog() {
      document.getElementById('dialog-overlay').style.display = 'flex';
      const nameInput = document.getElementById('name-input');
      nameInput.value = '';
      document.getElementById('url-input').value = '';
      document.getElementById('tips-input').value = '';
      document.getElementById('icon-input').value = '';
      document.getElementById('private-checkbox').checked = false;

      const confirmBtn = document.getElementById('dialog-confirm-btn');
      const cancelBtn = document.getElementById('dialog-cancel-btn');

      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      if (currentConfirmHandler) confirmBtn.removeEventListener('click', currentConfirmHandler);
      if (currentCancelHandler) cancelBtn.removeEventListener('click', currentCancelHandler);

      currentConfirmHandler = async function(event) {
        event.preventDefault();
        event.stopPropagation();
        await addLink();
      };

      currentCancelHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();
        hideAddDialog();
      };

      confirmBtn.addEventListener('click', currentConfirmHandler);
      cancelBtn.addEventListener('click', currentCancelHandler);

      setTimeout(() => { nameInput.focus(); }, 50);
      logAction('显示添加链接对话框');
    }

    async function updateLink(oldLink) {
      if (!await validateToken()) return;

      const name = document.getElementById('name-input').value.trim();
      const url = document.getElementById('url-input').value.trim();
      const tips = document.getElementById('tips-input').value.trim();
      const icon = document.getElementById('icon-input').value.trim();
      const category = document.getElementById('category-select').value;
      const isPrivate = document.getElementById('private-checkbox').checked;

      if (!name || !url || !category) {
        let errorMessage = '';
        if (!name && !url) errorMessage = '请输入名称和URL';
        else if (!name) errorMessage = '请输入名称';
        else if (!url) errorMessage = '请输入URL';
        await customAlert(errorMessage, '编辑卡片');
        if (!name) document.getElementById('name-input').focus();
        else if (!url) document.getElementById('url-input').focus();
        return;
      }

      const normalizedUrl = url.toLowerCase();
      const allLinks = [...publicLinks, ...privateLinks];
      const isUrlExists = allLinks.some(link => link.url.toLowerCase() === normalizedUrl && link.url !== oldLink.url);
      if (isUrlExists) {
        await customAlert('该URL已存在，请勿重复添加', '编辑卡片');
        document.getElementById('url-input').focus();
        return;
      }

      const updatedLink = { name, url, tips, icon, category, isPrivate };

      try {
        const list = oldLink.isPrivate ? privateLinks : publicLinks;
        const index = list.findIndex(l => l.url === oldLink.url);
        if (index !== -1) list[index] = updatedLink;

        links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;
        await saveLinks();
        renderSections();
        hideAddDialog();

        logAction('更新卡片', { oldUrl: oldLink.url, name, url, tips, icon, category, isPrivate });
      } catch (error) {
        logAction('更新卡片失败:', error);
        await customAlert('更新卡片失败:' + error.message, '编辑卡片');
      }
    }

    function hideAddDialog() {
      document.getElementById('dialog-overlay').style.display = 'none';
      const confirmBtn = document.getElementById('dialog-confirm-btn');
      const cancelBtn = document.getElementById('dialog-cancel-btn');

      if (currentConfirmHandler) {
        confirmBtn.removeEventListener('click', currentConfirmHandler);
        currentConfirmHandler = null;
      }
      if (currentCancelHandler) {
        cancelBtn.removeEventListener('click', currentCancelHandler);
        currentCancelHandler = null;
      }

      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      logAction('隐藏添加链接对话框');
    }

    function toggleRemoveMode() {
      removeMode = !removeMode;
      const editButtons = document.querySelectorAll('.edit-btn');
      const deleteButtons = document.querySelectorAll('.delete-btn');

      editButtons.forEach(btn => { btn.style.display = removeMode ? 'flex' : 'none'; });
      deleteButtons.forEach(btn => { btn.style.display = removeMode ? 'flex' : 'none'; });

      document.getElementById('custom-tooltip').style.display = 'none';

      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        if (removeMode) card.classList.add('no-hover');
        else card.classList.remove('no-hover');
      });

      logAction('切换编辑卡片模式', { removeMode });
    }

    function toggleTheme() {
      isDarkTheme = !isDarkTheme;
      if (isDarkTheme) document.body.classList.add('dark-theme');
      else document.body.classList.remove('dark-theme');
      logAction('切换主题', { isDarkTheme });
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      logAction('返回顶部');
    }

    function handleBackToTopVisibility() {
      const btn = document.getElementById('back-to-top-btn');
      if (!btn) return;
      btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }

    function handleTooltipMouseMove(e, tips, isAdmin) {
      const tooltip = document.getElementById('custom-tooltip');
      if (!tips || isAdmin) { tooltip.style.display = 'none'; return; }
      if (tooltip.textContent !== tips) tooltip.textContent = tips;
      tooltip.style.display = 'block';

      const offsetX = 15;
      const offsetY = 10;

      const tooltipRect = tooltip.getBoundingClientRect();
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;

      let left = e.pageX + offsetX;
      let top = e.pageY + offsetY;

      if (pageWidth - e.clientX < 200) left = e.pageX - tooltipRect.width - offsetX;
      if (pageHeight - e.clientY < 100) top = e.pageY - tooltipRect.height - offsetY;

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }

    function handleTooltipMouseLeave() {
      const tooltip = document.getElementById('custom-tooltip');
      tooltip.style.display = 'none';
    }

    async function verifyPassword(inputPassword) {
      const response = await fetch('/api/verifyPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword }),
      });
      const result = await response.json();
      return result;
    }

    let isShowingSearchResults = false;

    function searchBookmarks(query) {
      if (!query || query.trim() === '') {
        hideSearchResults();
        return;
      }

      query = query.toLowerCase().trim();
      const sectionsContainer = document.getElementById('sections-container');
      const visibleLinks = links;
      const matchedLinks = visibleLinks.filter(link => link.name.toLowerCase().includes(query));

      sectionsContainer.innerHTML = '';

      const searchHeader = document.createElement('div');
      searchHeader.className = 'search-results-header';

      const searchTitle = document.createElement('div');
      searchTitle.className = 'search-results-title';
      searchTitle.textContent = '搜索结果 (' + matchedLinks.length + '个)';

      const backButton = document.createElement('button');
      backButton.className = 'back-to-main';
      backButton.textContent = '返回主页';
      backButton.onclick = hideSearchResults;

      searchHeader.appendChild(searchTitle);
      searchHeader.appendChild(backButton);
      sectionsContainer.appendChild(searchHeader);

      if (matchedLinks.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-search-results';
        noResults.textContent = '没有找到匹配的书签';
        sectionsContainer.appendChild(noResults);
      } else {
        const resultsSection = document.createElement('div');
        resultsSection.className = 'search-results-section';

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        matchedLinks.forEach(link => { createCard(link, cardContainer); });

        resultsSection.appendChild(cardContainer);
        sectionsContainer.appendChild(resultsSection);
      }

      isShowingSearchResults = true;
      const categoryButtonsContainer = document.getElementById('category-buttons-container');
      if (categoryButtonsContainer) categoryButtonsContainer.style.display = 'none';

      logAction('执行书签搜索', { query, resultCount: matchedLinks.length });
    }

    function hideSearchResults() {
      isShowingSearchResults = false;
      document.getElementById('bookmark-search-input').value = '';
      renderSections();

      const categoryButtonsContainer = document.getElementById('category-buttons-container');
      if (categoryButtonsContainer) categoryButtonsContainer.style.display = 'flex';
      renderCategoryButtons();
    }

    document.getElementById('bookmark-search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = document.getElementById('bookmark-search-input').value;
        searchBookmarks(query);
        document.getElementById('bookmark-search-dropdown').classList.remove('show');
      }
    });

    document.getElementById('bookmark-search-input').addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.trim() === '') hideSearchResults();
      else searchBookmarks(query);
    });

    document.addEventListener('DOMContentLoaded', async () => {
      try {
        await validateToken();
        updateLoginButton();
        await loadLinks();
        setTimeout(setActiveCategoryButtonByVisibility, 500);
        setTimeout(handleBackToTopVisibility, 100);
      } catch (error) {
        console.error('Initialization failed');
      }
    });

    window.addEventListener('scroll', handleBackToTopVisibility);

    async function validateToken() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        isLoggedIn = false;
        updateUIState();
        return false;
      }

      try {
        const response = await fetch('/api/getLinks?userId=testUser', { headers: { 'Authorization': token } });
        if (response.status === 401) {
          await resetToLoginState('token已过期，请重新登录');
          return false;
        }
        isLoggedIn = true;
        updateUIState();
        return true;
      } catch (error) {
        console.error('Token validation failed');
        return false;
      }
    }

    async function resetToLoginState(message) {
      if (message && message.trim() !== '') await customAlert(message, '登录状态');

      cleanupDragState();
      localStorage.removeItem('authToken');
      isLoggedIn = false;
      isAdmin = false;
      removeMode = false;
      isRemoveCategoryMode = false;
      isEditCategoryMode = false;

      updateLoginButton();
      updateUIState();
      links = publicLinks;
      renderSections();

      const addRemoveControls = document.querySelector('.add-remove-controls');
      if (addRemoveControls) addRemoveControls.style.display = 'none';

      document.querySelectorAll('.delete-btn').forEach(btn => { btn.style.display = 'none'; });
      document.querySelectorAll('.delete-category-btn').forEach(btn => { btn.style.display = 'none'; });
      document.querySelectorAll('.edit-category-btn').forEach(btn => { btn.style.display = 'none'; });
      document.querySelectorAll('.move-category-btn').forEach(btn => { btn.style.display = 'none'; });

      const manageButton = document.querySelector('.category-manage-btn');
      if (manageButton) manageButton.classList.remove('active');

      const dialogOverlay = document.getElementById('dialog-overlay');
      if (dialogOverlay) dialogOverlay.style.display = 'none';

      const loginModal = document.getElementById('login-modal');
      if (loginModal) loginModal.style.display = 'none';

      const adminBtn = document.getElementById('admin-btn');
      if (adminBtn) adminBtn.style.display = 'none';
    }

    function customAlert(message, title = '提示', confirmText = '确定') {
      return new Promise((resolve) => {
        const overlay = document.getElementById('custom-alert-overlay');
        const titleEl = document.getElementById('custom-alert-title');
        const contentEl = document.getElementById('custom-alert-content');
        const confirmBtn = document.getElementById('custom-alert-confirm');

        titleEl.textContent = title;
        contentEl.textContent = message;
        confirmBtn.textContent = confirmText;

        overlay.style.display = 'flex';

        const handleConfirm = () => {
          overlay.style.display = 'none';
          confirmBtn.removeEventListener('click', handleConfirm);
          document.removeEventListener('keydown', handleKeyDown);
          resolve();
        };

        confirmBtn.addEventListener('click', handleConfirm);

        const handleKeyDown = (e) => {
          if (e.key === 'Escape') handleConfirm();
        };

        document.addEventListener('keydown', handleKeyDown);

        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) handleConfirm();
        });
      });
    }

    function customConfirm(message, okText = '确定', cancelText = '取消') {
      return new Promise((resolve) => {
        const overlay = document.getElementById('custom-confirm-overlay');
        const messageEl = document.getElementById('custom-confirm-message');
        const okBtn = document.getElementById('custom-confirm-ok');
        const cancelBtn = document.getElementById('custom-confirm-cancel');

        messageEl.textContent = message;
        okBtn.textContent = okText;
        cancelBtn.textContent = cancelText;

        overlay.style.display = 'flex';

        const handleConfirm = (result) => {
          cleanup();
          resolve(result);
        };

        const handleKeyDown = (e) => {
          if (e.key === 'Enter') handleConfirm(true);
          if (e.key === 'Escape') handleConfirm(false);
        };

        const cleanup = () => {
          overlay.style.display = 'none';
          document.removeEventListener('keydown', handleKeyDown);
          okBtn.onclick = null;
          cancelBtn.onclick = null;
          overlay.onclick = null;
        };

        okBtn.onclick = () => handleConfirm(true);
        cancelBtn.onclick = () => handleConfirm(false);
        document.addEventListener('keydown', handleKeyDown);
        overlay.onclick = (e) => e.target === overlay && handleConfirm(false);
      });
    }

    function showCategoryDialog(title, defaultValue = '') {
      return new Promise((resolve) => {
        const dialog = document.getElementById('category-dialog');
        const input = document.getElementById('category-name-input');
        const titleEl = document.getElementById('category-dialog-title');
        const confirmBtn = document.getElementById('category-confirm-btn');
        const cancelBtn = document.getElementById('category-cancel-btn');

        titleEl.textContent = title;
        input.value = defaultValue;

        dialog.style.display = 'flex';
        setTimeout(() => input.focus(), 50);

        const handleConfirm = () => {
          const value = input.value.trim();
          if (value) {
            cleanup();
            resolve(value);
          } else input.focus();
        };

        const handleCancel = () => { cleanup(); resolve(null); };

        const handleKeyDown = (e) => {
          if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); }
          else if (e.key === 'Escape') handleCancel();
        };

        const cleanup = () => {
          dialog.style.display = 'none';
          document.removeEventListener('keydown', handleKeyDown);
          confirmBtn.onclick = null;
          cancelBtn.onclick = null;
          dialog.onclick = null;
        };

        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        document.addEventListener('keydown', handleKeyDown);
        dialog.onclick = (e) => e.target === dialog && handleCancel();
      });
    }

    function showLoading(message = '加载中，请稍候...') {
      const mask = document.getElementById('loading-mask');
      const textElement = mask.querySelector('p');
      textElement.textContent = message;
      mask.style.display = 'flex';
    }

    function hideLoading() {
      const mask = document.getElementById('loading-mask');
      mask.style.display = 'none';
    }
  </script>
</body>
</html>
`;

// 常量时间比较函数，防止时序攻击
function constantTimeCompare(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// 服务端 token 验证
async function validateServerToken(authToken, env) {
  if (!authToken) {
    return {
      isValid: false,
      status: 401,
      response: { error: 'Unauthorized', message: '未登录或登录已过期' }
    };
  }

  try {
    const [timestamp, hash] = authToken.split('.');
    const tokenTimestamp = parseInt(timestamp);
    const now = Date.now();

    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    if (now - tokenTimestamp > FIFTEEN_MINUTES) {
      return {
        isValid: false,
        status: 401,
        response: {
          error: 'Token expired',
          tokenExpired: true,
          message: '登录已过期，请重新登录'
        }
      };
    }

    const tokenData = timestamp + "_" + env.ADMIN_PASSWORD;
    const encoder = new TextEncoder();
    const data = encoder.encode(tokenData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const expectedHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

    if (!constantTimeCompare(hash, expectedHash)) {
      return {
        isValid: false,
        status: 401,
        response: {
          error: 'Invalid token',
          tokenInvalid: true,
          message: '登录状态无效，请重新登录'
        }
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      status: 401,
      response: {
        error: 'Invalid token',
        tokenInvalid: true,
        message: '登录验证失败，请重新登录'
      }
    };
  }
}

async function validateAdminToken(authToken, env) {
  const validation = await validateServerToken(authToken, env);
  if (!validation.isValid) return validation;
  return { isValid: true, isAdmin: true };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(HTML_CONTENT, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (url.pathname === '/api/getLinks') {
      const userId = url.searchParams.get('userId');
      const authToken = request.headers.get('Authorization');
      const data = await env.CARD_ORDER.get(userId);

      if (data) {
        const parsedData = JSON.parse(data);

        if (authToken) {
          const validation = await validateServerToken(authToken, env);
          if (!validation.isValid) {
            return new Response(JSON.stringify(validation.response), {
              status: validation.status,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response(JSON.stringify(parsedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const filteredLinks = parsedData.links.filter(link => !link.isPrivate);
        const filteredCategories = {};
        Object.keys(parsedData.categories).forEach(category => {
          filteredCategories[category] = parsedData.categories[category].filter(link => !link.isPrivate);
        });

        return new Response(JSON.stringify({ links: filteredLinks, categories: filteredCategories }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ links: [], categories: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/saveOrder' && request.method === 'POST') {
      const authToken = request.headers.get('Authorization');
      const validation = await validateServerToken(authToken, env);
      if (!validation.isValid) {
        return new Response(JSON.stringify(validation.response), {
          status: validation.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { userId, links, categories } = await request.json();
      await env.CARD_ORDER.put(userId, JSON.stringify({ links, categories }));
      return new Response(JSON.stringify({ success: true, message: '保存成功' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/verifyPassword' && request.method === 'POST') {
      try {
        const { password } = await request.json();
        const isValid = password === env.ADMIN_PASSWORD;

        if (isValid) {
          const timestamp = Date.now();
          const tokenData = timestamp + "_" + env.ADMIN_PASSWORD;
          const encoder = new TextEncoder();
          const data = encoder.encode(tokenData);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const token = timestamp + "." + btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

          return new Response(JSON.stringify({ valid: true, token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ valid: false, error: 'Invalid password' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ valid: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/api/backupData' && request.method === 'POST') {
      const authToken = request.headers.get('Authorization');
      const validation = await validateAdminToken(authToken, env);
      if (!validation.isValid) {
        return new Response(JSON.stringify(validation.response), {
          status: validation.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const { sourceUserId } = await request.json();
        const result = await this.backupData(env, sourceUserId);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 404,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: '备份操作失败' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },

  async backupData(env, sourceUserId) {
    const MAX_BACKUPS = 10;
    const sourceData = await env.CARD_ORDER.get(sourceUserId);

    if (sourceData) {
      try {
        const currentDate = new Date().toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-');

        const backupId = `backup_${currentDate}`;

        const backups = await env.CARD_ORDER.list({ prefix: 'backup_' });
        const backupKeys = backups.keys.map(key => key.name).sort((a, b) => {
          const timeA = new Date(a.split('_')[1].replace(/-/g, '/')).getTime();
          const timeB = new Date(b.split('_')[1].replace(/-/g, '/')).getTime();
          return timeB - timeA;
        });

        await env.CARD_ORDER.put(backupId, sourceData);

        const allBackups = [...backupKeys, backupId].sort((a, b) => {
          const timeA = new Date(a.split('_')[1].replace(/-/g, '/')).getTime();
          const timeB = new Date(b.split('_')[1].replace(/-/g, '/')).getTime();
          return timeB - timeA;
        });

        const backupsToDelete = allBackups.slice(MAX_BACKUPS);

        if (backupsToDelete.length > 0) {
          await Promise.all(backupsToDelete.map(key => env.CARD_ORDER.delete(key)));
        }

        return {
          success: true,
          backupId,
          remainingBackups: MAX_BACKUPS,
          deletedCount: backupsToDelete.length
        };
      } catch (error) {
        return {
          success: false,
          error: 'Backup operation failed',
          details: error.message
        };
      }
    }

    return { success: false, error: 'Source data not found' };
  }
};
