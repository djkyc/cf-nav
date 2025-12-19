const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>天下有雪-我的个人导航</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>⭐</text></svg>">
    <style>
    /* 全局样式 */
    html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #121418; /* 深色背景作为底色 */
        color: #222; /* 深灰字体 */
        transition: all 0.3s ease;
     
    }

    /* 暗色模式样式 */
    body.dark-theme {
        background-color: #121418; /* 更深的背景色 */
        color: #e3e3e3;
    }

    /* 固定元素样式 */
    .fixed-elements {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%); /* 渐变背景 */
        z-index: 1000;
        padding: 10px;
        transition: all 0.3s ease;
        height: 150px;
        box-shadow: none; /* 移除阴影 */
    }

    body.dark-theme .fixed-elements {
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%); /* 暗色渐变背景 */
        box-shadow: none; /* 移除阴影 */
    }

    /* 分类快捷按钮容器样式移至搜索栏内 */

    .category-button {
        padding: 5px 10px;
        border-radius: 15px;
        background-color: rgba(249, 250, 251, 0.85);
        color: #43b883;
        border: none;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        flex: 0 0 auto;
        white-space: nowrap;
        margin: 0 2px;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(2px);
    }

    body.dark-theme .category-button {
        background-color: rgba(42, 46, 56, 0.85);
        color: #7ba1e9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
    }

    .category-button:hover {
        background-color: #43b883;
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
    }

    /* 分类按钮选中效果 */
    .category-button.active {
        background-color: #43b883;
        color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
        font-weight: 600;
        border-bottom: 2px solid #35a674;
    }

    body.dark-theme .category-button:hover,
    body.dark-theme .category-button.active {
        background-color: #5d7fb9;
        color: white;
    }

    /* 分类按钮悬停样式 */

    /* 移除顶部标题，改为底部显示 */
    .fixed-elements h3 {
        display: none; /* 隐藏顶部标题 */
    }

    body.dark-theme .fixed-elements h3 {
        color: #fff;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    /* 一言模块样式 */
    #hitokoto {
        margin: 5px 0 15px;
        font-size: 14px;
        color: #fff;
        font-style: italic;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        transition: all 0.3s ease;
    }

    #hitokoto span {
        color: #4dffb8;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        transition: all 0.3s ease;
    }

    body.dark-theme #hitokoto {
        color: #fff;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    body.dark-theme #hitokoto span {
        color: #7ba1e9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }

    /* 中心内容样式 */
    .center-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        max-width: none; /* 不限制最大宽度，使分类按钮有更多空间 */
        text-align: center;
        padding: 0 10px; /* 添加左右内边距 */
    }

    /* 右上角控制区域样式 - 隐藏 */
    .top-right-controls {
        display: none; /* 隐藏顶部控制区域 */
    }

    /* 设置按钮样式 */
    .admin-btn {
        background-color: #43b883;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .admin-btn:hover {
        background-color: #35a674;
        transform: translateY(-1px);
    }

    body.dark-theme .admin-btn {
        background-color: #5d7fb9;
    }

    body.dark-theme .admin-btn:hover {
        background-color: #4a6fa5;
    }

    /* 登录按钮样式 */
    .login-btn {
        background-color: #43b883;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .login-btn:hover {
        background-color: #35a674;
        transform: translateY(-1px);
    }

    body.dark-theme .login-btn {
        background-color: #5d7fb9;
    }

    body.dark-theme .login-btn:hover {
        background-color: #4a6fa5;
    }

    /* GitHub图标按钮样式 */
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
        fill: #43b883;
        transition: fill 0.3s ease;
    }

    body.dark-theme .github-btn svg {
        fill: #5d7fb9;
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
        border-color: #43b883;
        box-shadow: 0 0 0 2px rgba(67, 184, 131, 0.2);
        outline: none;
    }

    .login-modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }

    .login-modal button {
        background-color: #43b883;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
    }

    .login-modal button:hover {
        background-color: #35a674;
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
        .has-tooltip {
            position: relative;
        }

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

        /* 下方提示框和箭头 */
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

        /* 绿底样式 */
        .tooltip-green::after {
            background: #43b883;
            color: white;
        }
        .tooltip-green::before {
            border-bottom-color: #43b883;
        }

        /* 暗色主题 */
        body.dark-theme .has-tooltip::after {
            background: rgba(151, 151, 151, 0.9);
            color: #eee;
        }
        body.dark-theme .has-tooltip::before {
            border-bottom-color: rgba(151, 151, 151, 0.9);
        }
        body.dark-theme .tooltip-green::after {
            background: #5d7fb9;
            color: white;
        }
        body.dark-theme .tooltip-green::before {
            border-bottom-color: #5d7fb9;
        }
    }

    /* 搜索结果样式 - 简化版 */
    .search-results-section {
        margin-bottom: 30px;
    }

    .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px;
        background-color: rgba(248, 249, 250, 0.7);
        backdrop-filter: blur(5px);
        border-radius: 8px;
        border-left: 4px solid #43b883;
    }

    body.dark-theme .search-results-header {
        background-color: rgba(45, 55, 72, 0.7);
        backdrop-filter: blur(5px);
        border-left-color: #5d7fb9;
    }

    .search-results-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    body.dark-theme .search-results-title {
        color: #e2e8f0;
    }

    .back-to-main {
        background-color: #43b883;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .back-to-main:hover {
        background-color: #35a674;
    }

    body.dark-theme .back-to-main {
        background-color: #5d7fb9;
    }

    body.dark-theme .back-to-main:hover {
        background-color: #4a6fa5;
    }

    .no-search-results {
        text-align: center;
        padding: 30px;
        color: #888;
        font-size: 16px;
    }

    body.dark-theme .no-search-results {
        color: #a0a0a0;
    }

    /* 管理控制按钮样式 - 严格按照佬友修改版设计 */
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
        background-color: #43b883;
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

    .round-btn svg {
        pointer-events: none;
        display: block;
        margin: auto;
    }

    .round-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    body.dark-theme .round-btn {
        background-color: #5d7fb9;
    }

    .add-btn { order: 1; }
    .remove-btn { order: 2; }
    .category-btn { order: 3; }
    .remove-category-btn { order: 4; }

    /* 主要内容区域样式 */
    .content {
        margin-top: 170px;
        padding: 10px;
        max-width: 1600px;
        margin-left: auto;
        margin-right: auto;
        transition: opacity 0.3s ease;
    }

    .loading .content {
        opacity: 0.6;
    }

    /* 搜索栏样式 */
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
        border: 1px solid rgba(224, 224, 224, 0.5);
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .search-bar:focus-within {
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
        border-color: #43b883;
    }

    .search-bar select {
        border: none;
        background-color: rgba(244, 247, 250, 0.7);
        padding: 10px 15px;
        font-size: 14px;
        color: #43b883;
        width: 120px;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%2343b883" d="M0 0l6 6 6-6z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 10px center;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 0;
    }

    /* 下拉菜单样式 */
    select option {
        background-color: #fff;
        color: #333;
        padding: 10px;
        font-size: 14px;
        white-space: nowrap;
        overflow: visible;
    }

    /* 暗色主题搜索栏样式 */
    body.dark-theme .search-bar {
        border-color: rgba(50, 54, 66, 0.5);
        background-color: rgba(30, 33, 40, 0.5);
        backdrop-filter: blur(5px);
    }

    body.dark-theme .search-bar select {
        background-color: rgba(37, 40, 48, 0.7);
        color: #5d7fb9;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%235d7fb9" d="M0 0l6 6 6-6z"/></svg>');
    }

    body.dark-theme .search-bar input {
        background-color: rgba(37, 40, 48, 0.7);
        color: #e3e3e3;
    }

    body.dark-theme .search-bar button {
        background-color: #5d7fb9;
    }

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
        background-color: rgba(255, 255, 255, 0.7);
        outline: none;
    }

    .search-bar button {
        border: none;
        background-color: #43b883;
        color: white;
        padding: 0 20px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .search-bar button:hover {
        background-color: #35a674;
    }

    /* 分类按钮容器样式 - 移至固定元素区域内 */
    .category-buttons-container {
        display: flex;
        flex-wrap: wrap; /* 允许按钮换行显示 */
        justify-content: center; /* 居中排列按钮 */
        gap: 6px;
        padding: 8px 12px;
        width: 100%;
        max-width: 1200px; /* 增加容器宽度，确保能显示更多按钮 */
        margin-left: auto;
        margin-right: auto;
        margin-top: 5px; /* 减少与搜索栏的距离 */
        background-color: transparent; /* 背景透明 */
        border-radius: 8px;
        box-shadow: none; /* 移除阴影 */
        transition: all 0.3s ease;
        position: relative; /* 确保在固定元素内正确定位 */
    }

    body.dark-theme .category-buttons-container {
        background-color: transparent; /* 暗色模式下的背景透明 */
        box-shadow: none;
    }

    /* 滚动条美化 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    body.dark-theme::-webkit-scrollbar-track {
        background: #252830;
    }

    body.dark-theme::-webkit-scrollbar-thumb {
        background: #444;
    }

    body.dark-theme::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    /* 分类按钮容器滚动条 */
    .category-buttons-container::-webkit-scrollbar {
        height: 4px;
    }

    /* 浮动按钮组样式 */
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
        background-color: #43b883;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
    }

    .floating-button-group button:hover {
        transform: translateY(-2px);
        background-color: #369f6b;
    }

    #back-to-top-btn {
        display: none;
    }

    body.dark-theme .floating-button-group button {
        background-color: #5d7fb9;
    }

    body.dark-theme .floating-button-group button:hover {
        background-color: #4a6fa5;
    }

    /* 主题切换按钮样式 */
    #theme-toggle {
        font-size: 24px;
        line-height: 40px;
    }

    /* 对话框样式 */
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
        border-color: #43b883;
        box-shadow: 0 0 0 2px rgba(67, 184, 131, 0.2);
        outline: none;
    }

    #dialog-box label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #222;
    }

    #dialog-box button {
        background-color: #43b883;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 10px;
    }

    #dialog-box button:hover {
        background-color: #35a674;
    }

    #dialog-box button.cancel {
        background-color: #f0f0f0;
        color: #333;
    }

    #dialog-box button.cancel:hover {
        background-color: #e0e0e0;
    }

    body.dark-theme #dialog-box {
        background-color: #252830;
        color: #e3e3e3;
    }

    body.dark-theme #dialog-box input,
    body.dark-theme #dialog-box select {
        background-color: #323642;
        color: #e3e3e3;
        border-color: #444;
    }

    body.dark-theme #dialog-box label {
        color: #a0b7d4;
    }

    /* 分类和卡片样式 */
    .section {
        margin-bottom: 25px;
        padding: 0 15px;
    }

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

    body.dark-theme .section-title-container {
        border-bottom-color: #2a2e38;
    }

    .section-title {
        font-size: 22px;
        font-weight: 600;
        color: #ffffff;
        position: relative;
        padding-left: 15px;
        transition: color 0.3s ease;
        min-width: 120px;
    }
    
    @media (max-width: 480px) {
        .section-title {
            font-size: 18px;
            padding-left: 12px;
            min-width: 90px;
            max-width: 200px; /* 限制最大宽度 */
            white-space: nowrap; /* 不换行 */
            overflow: hidden; /* 隐藏溢出 */
            text-overflow: ellipsis; /* 显示省略号 */
        }
    }

    body.dark-theme .section-title {
        color: #e3e3e3;
    }

    .section-title:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 5px;
        height: 22px;
        background-color: #43b883;
        border-radius: 2px;
    }
    
    @media (max-width: 480px) {
        .section-title:before {
            width: 4px;
            height: 18px;
        }
    }

    .delete-category-btn {
        background-color: #ff9800;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 15px;
        font-size: 13px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    }

    .delete-category-btn:hover {
        background-color: #f57c00;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    }

    body.dark-theme .delete-category-btn {
        background-color: #ff9800;
        color: #252830;
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
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 12px;
        width: 150px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        user-select: none;
        border-left: 3px solid #43b883;
        animation: fadeIn 0.3s ease forwards;
        animation-delay: calc(var(--card-index) * 0.05s);
        opacity: 0;
        margin: 2px;
        backdrop-filter: blur(3px);
    }
    
    /* 链接状态样式 */
    .card.status-ok {
        border-left: 3px solid #43b883; /* 绿色表示正常 */
    }
    
    .card.status-error {
        border-left: 3px solid #e74c3c; /* 红色表示异常/失败 */
    }
    
    .card.status-warning {
        border-left: 3px solid #9b59b6; /* 紫色表示警告 */
    }
    
    /* 状态指示器标签 */
    .status-tag {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #e74c3c;
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-radius: 0 8px 0 5px;
        opacity: 0.8;
        z-index: 10;
    }

    body.dark-theme .card {
        background-color: rgba(30, 33, 40, 0.8); /* 半透明卡片背景 */
        border-left-color: #5d7fb9;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(3px);
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
    }

    .card-top {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    .card-icon {
        width: 16px;
        height: 16px;
        margin-right: 5px;
    }

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

    body.dark-theme .card-title {
        color: #e3e3e3;
    }

    body.dark-theme .card-url {
        color: #a0a0a0;
    }

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
    
    /* 当卡片同时有状态标签和私密标签时，调整私密标签位置 */
    .card.status-error .private-tag {
        top: 36px; /* 向下移动，避免与状态标签重叠 */
    }





    /* 版权信息样式 */
    #copyright {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
        display: flex;
        justify-content: center; /* 居中显示 */
        align-items: center;
        font-size: 14px;
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    @media (max-width: 480px) {
        #copyright {
            height: 40px; /* 增加高度以容纳按钮 */
            font-size: 12px;
        }
        
        #copyright .copyright-container {
            gap: 10px; /* 减小元素间距 */
        }
        
        #copyright p {
            display: none; /* 在移动设备上隐藏版权信息 */
        }
    }

    #copyright p {
        margin: 0;
        font-weight: 500;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
    }
    
    /* 底部标题样式 */
    #copyright .site-title {
        font-size: 18px;
        font-weight: 600;
        margin-right: 15px;
        color: #fff;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    }
    
    /* 底部版权信息容器 */
    #copyright .copyright-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px; /* 元素之间的间距 */
        max-width: 800px; /* 限制最大宽度 */
        width: 100%;
    }
    
    /* 底部按钮组 */
    #copyright .buttons-group {
        display: flex;
        align-items: center;
        gap: 10px; /* 按钮之间的间距 */
    }
    
    /* 底部按钮样式 */
    #copyright .admin-btn,
    #copyright .login-btn {
        padding: 5px 10px;
        font-size: 12px;
    }
    
    @media (max-width: 480px) {
        #copyright .site-title {
            font-size: 16px;
            margin-right: 10px;
        }
        
        #copyright .admin-btn,
        #copyright .login-btn {
            padding: 4px 8px;
            font-size: 11px;
        }
    }

    #copyright a {
        color: #4dffb8;
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }

    #copyright a:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: #4dffb8;
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    #copyright a:hover:after {
        transform: scaleX(1);
    }

    body.dark-theme #copyright {
        background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
        color: #e3e3e3;
    }

    body.dark-theme #copyright a {
        color: #7ba1e9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }

    body.dark-theme #copyright a:after {
        background-color: #7ba1e9;
    }

    /* 响应式设计 */
    @media (max-width: 480px) {
        .fixed-elements {
            position: fixed; /* 恢复固定定位，确保分类按钮位置正确 */
            padding: 5px 10px 3px 10px; /* 更紧凑的内边距 */
            height: auto;
            min-height: 100px; /* 减小最小高度 */
            box-shadow: none; /* 移除阴影 */
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%); /* 渐变背景 */
        }

        body.dark-theme .fixed-elements {
            box-shadow: none; /* 移除阴影 */
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%); /* 暗色渐变背景 */
        }

        /* 移动端一言样式调整 - 紧凑显示 */
        #hitokoto {
            margin: 2px 0 4px 0; /* 更紧凑的上下边距 */
            font-size: 11px; /* 进一步减小字体 */
            line-height: 1.2; /* 更紧凑行高 */
            padding: 0 5px; /* 减小左右内边距 */
        }

        .category-buttons-container {
            width: 100%;
            max-width: none;
            padding: 4px;
            overflow-x: auto; /* 允许水平滚动 */
            flex-wrap: nowrap; /* 不允许按钮换行 */
            justify-content: flex-start; /* 左对齐排列按钮 */
            margin: 5px auto 3px; /* 更紧凑的分类按钮边距 */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            background-color: transparent; /* 移动端也透明 */
            border-radius: 8px;
            gap: 3px; /* 更减小按钮间距 */
        }

        body.dark-theme .category-buttons-container {
            background-color: transparent;
        }

        .category-button {
            padding: 3px 6px;
            font-size: 10px;
            margin: 0 1px;
        }

        .content {
            margin-top: 110px; /* 减小顶部边距 */
            margin-bottom: 80px; /* 减小底部边距 */
            padding: 10px; /* 减小内边距 */
            transition: opacity 0.3s ease;
        }

        /* 移动端center-content布局优化 */
        .center-content {
            position: static; /* 移动端使用静态定位 */
            transform: none; /* 取消变换 */
            width: 100%;
            text-align: center;
            padding: 0 8px; /* 减少左右内边距 */
        }

        .loading .content {
            opacity: 0.6;
        }

        /* 移动端搜索容器样式 */
        .search-container {
            margin-top: 8px; /* 减小上边距 */
        }

        .search-bar {
            flex-wrap: nowrap;
            max-width: 320px; /* 稍微增加搜索栏宽度 */
            width: 92%; /* 增加相对宽度 */
            margin: 4px auto 6px auto; /* 减小上下边距 */
        }

        .search-bar select {
            width: 90px; /* 增加选择框宽度以改善对称性 */
            flex: 0 0 90px;
            font-size: 12px; /* 减小字体以适应更小宽度 */
            padding: 8px 10px; /* 调整内边距 */
        }

        .search-bar input {
            flex: 1;
            min-width: 0; /* 确保输入框可以正确收缩 */
            padding: 8px 10px; /* 统一内边距 */
            font-size: 13px; /* 稍微增加字体大小 */
        }

        .search-bar button {
            flex: 0 0 50px; /* 固定按钮宽度 */
            padding: 8px 12px; /* 调整内边距 */
            font-size: 16px; /* 增加图标大小 */
        }

        .admin-controls input,
        .admin-controls button {
            height: 36px;
            padding: 0 10px;
            font-size: 14px;
        }

        .category-button {
            flex: 0 0 auto;
            font-size: 12px;
            padding: 5px 12px;
            white-space: nowrap;
            margin: 0 3px; /* 水平间距 */
        }

        .card-container {
            display: grid;
            grid-template-columns: repeat(2, minmax(120px, 1fr)); /* 减小卡片宽度 */
            column-gap: 10px; /* 减小列间距 */
            row-gap: 8px; /* 减小行间距 */
            justify-content: center;
            padding: 8px; /* 减小内边距 */
            margin: 0 auto;
        }

        .card {
            width: auto;
            max-width: 100%;
            padding: 8px; /* 减小内边距 */
            margin: 0;
            border-radius: 6px; /* 减小圆角 */
        }

        .card-title {
            font-size: 12px; /* 减小字体 */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        .card-url {
            font-size: 10px; /* 减小字体 */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        .add-remove-controls {
            right: 5px;
            bottom: 100px; /* 减小底部距离 */
            top: auto;
            transform: none;
            flex-direction: column;
            gap: 10px; /* 减小间距 */
        }

        .round-btn {
            right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px; /* 减小尺寸 */
            height: 32px; /* 减小尺寸 */
            font-size: 18px; /* 减小字体 */
        }

        .floating-button-group {
            bottom: 15px;
            right: 8px;
        }

        .floating-button-group button {
            width: 32px;
            height: 32px;
            font-size: 16px;
        }

        #dialog-box {
            width: 90%;
            max-width: 350px;
            padding: 20px;
        }

        .section-title-container {
            display: none; /* 移动端隐藏分类标题 */
        }
        
        .section {
            margin-bottom: 15px; /* 减小分类间距 */
        }
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

    .dialog-title {
        margin: 0 0 15px 0;
        font-size: 18px;
        color: #333;
    }

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
        border-color: #4a90e2 !important;
        outline: none;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .dialog-box button {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .dialog-confirm-btn {
        background-color: #43b883;
        color: white;
    }

    .dialog-confirm-btn:hover {
        background-color: #3aa876;
    }

    .dialog-cancel-btn {
        background-color: #f0f0f0;
        color: #555;
    }

    .dialog-cancel-btn:hover {
        background-color: #e0e0e0;
    }

    .top-z-index {
        z-index: 9999;
    }

    /* 动画效果 */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    /* 暗色主题对话框样式 */
    body.dark-theme .dialog-box {
        background-color: #2d3748;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    body.dark-theme .dialog-title {
        color: #f8f9fa;
    }

    body.dark-theme .dialog-content {
        color: #f8f9fa;
    }

    body.dark-theme .dialog-box input[type="text"] {
        background-color: #3c4658 !important;
        color: #e3e3e3 !important;
        border-color: #4a5568 !important;
    }

    body.dark-theme .dialog-box input[type="text"]:focus {
        border-color: #5a9cec !important;
        box-shadow: 0 0 0 3px rgba(90, 156, 236, 0.3);
    }

    body.dark-theme .dialog-cancel-btn {
        background-color: #4a5568;
        color: #e3e3e3;
    }

    body.dark-theme .dialog-cancel-btn:hover {
        background-color: #3c4658;
    }

    body.dark-theme .dialog-confirm-btn {
        background-color: #5d7fb9;
        color: white;
    }

    body.dark-theme .dialog-confirm-btn:hover {
        background-color: #5473a9;
    }

    /* 加载遮罩样式 */
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

    /* 加载动画 */
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ccc;
        border-top-color: #3498db;
        border-radius: 50%;
        margin: 0 auto 10px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    body.dark-theme .loading-content {
        background-color: #2d3748;
        color: #f8f9fa;
    }

    /* 分类管理按钮样式 */
    .edit-category-btn, .move-category-btn {
        background-color: #43b883;
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

    .edit-category-btn:hover {
        background-color: #3aa876;
    }

    .move-category-btn {
        background-color: #5d7fb9;
        padding: 4px 6px;
        min-width: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .move-category-btn:hover {
        background-color: #5473a9;
    }

    .move-category-btn svg {
        width: 16px;
        height: 16px;
        fill: white;
    }

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

    .delete-category-btn:hover {
        background-color: #c0392b;
    }

    /* 暗色主题下的分类管理按钮 */
    body.dark-theme .edit-category-btn {
        background-color: #5d7fb9;
    }

    body.dark-theme .edit-category-btn:hover {
        background-color: #5473a9;
    }

    body.dark-theme .move-category-btn {
        background-color: #43b883;
    }

    body.dark-theme .move-category-btn:hover {
        background-color: #3aa876;
    }

    body.dark-theme .delete-category-btn {
        background-color: #e74c3c;
    }

    body.dark-theme .delete-category-btn:hover {
        background-color: #c0392b;
    }

    /* 按钮顺序控制 */
    .add-btn { order: 1; }
    .remove-btn { order: 2; }
    .category-add-btn { order: 3; }
    .category-manage-btn { order: 4; }

    /* 分类管理按钮激活状态 */
    .category-manage-btn.active {
        background-color: #e74c3c;
    }

    .category-manage-btn.active:hover {
        background-color: #c0392b;
    }

    /* 卡片描述样式 */
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

    body.dark-theme .card-tip {
        color: #a0a0a0;
    }

    /* 卡片按钮容器 */
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

    /* 卡片按钮通用样式 */
    .card-btn {
        position: relative;
        z-index: 1;
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 50%;
        background: #43b883;
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

    .edit-btn {
        background: #43b883;
    }

    .delete-btn {
        background: #e74c3c;
    }

    body.dark-theme .edit-btn {
        background: #5d7fb9;
    }

    body.dark-theme .delete-btn {
        background: #e74c3c;
    }

    /* 自定义提示框样式 */
    #custom-tooltip {
        position: absolute;
        display: none;
        z-index: 700;
        background: #43b883;
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

    body.dark-theme #custom-tooltip {
        background: #5d7fb9;
        color: #fff;
    }

    /* 卡片悬停效果 */
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

<body class="dark-theme">
    <div class="fixed-elements">
        <h3>天下有雪-我的个人导航</h3>
        <div class="center-content">
            <!-- 一言模块 -->
            <p id="hitokoto">
                <span id="hitokoto_text">正在加载一言...</span>
            </p>
            <!-- 搜索栏 -->
            <div class="search-container">
                <div class="search-bar">
                    <select id="search-engine-select">
                        <option value="google">谷歌</option>
                        <option value="bing">必应</option>
                    </select>
                    <input type="text" id="search-input" placeholder="">
                    <button id="search-button">🔍</button>
                </div>
            </div>
            <div id="category-buttons-container" class="category-buttons-container"></div>
        </div>
        <!-- 右上角控制区域已移动到底部 -->
    </div>
    <div class="content">
        <!-- 管理控制按钮 -->
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



        <!-- 分类和卡片容器 -->
        <div id="sections-container"></div>
        <!-- 浮动按钮组 -->
        <div class="floating-button-group">
            <button id="back-to-top-btn" onclick="scrollToTop()" style="display: none;">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24l12-12 12 12m-24 12 12-12 12 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="theme-toggle" onclick="toggleTheme()">◑</button>
        </div>
        <!-- 添加链接对话框 -->
        <div id="dialog-overlay">
            <div id="dialog-box">
                <label for="name-input">名称</label>
                <input type="text" id="name-input" placeholder="必填">
                <label for="url-input">地址</label>
                <input type="text" id="url-input" placeholder="必填">
                <label for="tips-input">描述</label>
                <input type="text" id="tips-input" placeholder="可选">
                <label for="icon-input">图标</label>
                <input type="text" id="icon-input" placeholder="可选">
                <label for="category-select">选择分类</label>
                <select id="category-select"></select>
                <div class="private-link-container">
                    <label for="private-checkbox">私密链接</label>
                    <input type="checkbox" id="private-checkbox">
                </div>
                <div class="dialog-buttons">
                    <button class="dialog-cancel-btn" id="dialog-cancel-btn">取消</button>
                    <button class="dialog-confirm-btn" id="dialog-confirm-btn">确定</button>
                </div>
            </div>
        </div>
        <!-- 登录弹窗 -->
        <div id="login-modal" class="login-modal">
            <div class="login-modal-content">
                <h3>登录</h3>
                <input type="password" id="login-password" placeholder="请输入密码">
                <div class="login-modal-buttons">
                    <button class="cancel" onclick="hideLoginModal()">取消</button>
                    <button onclick="performLogin()">确定</button>
                </div>
            </div>
        </div>

        <!-- 自定义Alert对话框 -->
        <div class="dialog-overlay top-z-index" id="custom-alert-overlay" style="display: none;">
            <div class="dialog-box" id="custom-alert-box">
                <h3 class="dialog-title" id="custom-alert-title">提示</h3>
                <div class="dialog-content" id="custom-alert-content">这里是提示内容</div>
                <div class="dialog-buttons">
                    <button class="dialog-confirm-btn" id="custom-alert-confirm">确定</button>
                </div>
            </div>
        </div>

        <!-- 自定义Confirm对话框 -->
        <div class="dialog-overlay top-z-index" id="custom-confirm-overlay" style="display: none;">
            <div class="dialog-box">
                <div class="dialog-content" id="custom-confirm-message"></div>
                <div class="dialog-buttons">
                    <button id="custom-confirm-cancel" class="dialog-cancel-btn">取消</button>
                    <button id="custom-confirm-ok" class="dialog-confirm-btn">确定</button>
                </div>
            </div>
        </div>

        <!-- 分类名称输入对话框 -->
        <div class="dialog-overlay" id="category-dialog" style="display: none;">
            <div class="dialog-box">
                <h3 id="category-dialog-title" class="dialog-title">新建分类</h3>
                <input type="text" id="category-name-input" class="category-dialog-input" placeholder="请输入分类名称">
                <div class="dialog-buttons">
                    <button id="category-cancel-btn" class="dialog-cancel-btn">取消</button>
                    <button id="category-confirm-btn" class="dialog-confirm-btn">确定</button>
                </div>
            </div>
        </div>

        <!-- 加载遮罩 -->
        <div id="loading-mask" style="display:none;">
            <div class="loading-content">
                <div class="spinner"></div>
                <p>加载中，请稍候...</p>
            </div>
        </div>
    </div>
    <div id="custom-tooltip"></div>

    <script>
    // 加载一言
    async function loadHitokoto() {
        try {
            const response = await fetch('https://v1.hitokoto.cn/?encode=text');
            const text = await response.text();
            const hitokotoElement = document.getElementById('hitokoto_text');
            if (hitokotoElement) {
                hitokotoElement.textContent = text;
            }
        } catch (error) {
            console.error('加载一言失败:', error);
            const hitokotoElement = document.getElementById('hitokoto_text');
            if (hitokotoElement) {
                hitokotoElement.textContent = '加载失败';
            }
        }
    }

    // 页面加载时获取一言
    loadHitokoto();

    // 搜索引擎配置
    const searchEngines = {
        google: "https://www.google.com/search?q=",
        bing: "https://www.bing.com/search?q="
    };

    let currentEngine = "google";
    let isShowingSearchResults = false;

    // 设置当前搜索模式
    function setActiveEngine(engine) {
        const previousMode = currentEngine;
        currentEngine = engine;
        document.getElementById("search-engine-select").value = engine;
        updateSearchPlaceholder();

        if (isInSiteSearchMode()) {
            const currentValue = document.getElementById('search-input').value;
            if (currentValue.trim() === '') {
                hideSearchResults();
            } else {
                filterBookmarksByKeyword(currentValue);
            }
        } else if (previousMode === 'in_site' && isShowingSearchResults) {
            hideSearchResults();
        }

    }

    // 搜索引擎选择框变更事件
    document.getElementById('search-engine-select').addEventListener('change', function() {
        setActiveEngine(this.value);
    });

    function isInSiteSearchMode() {
        return currentEngine === 'in_site';
    }

    function updateSearchPlaceholder() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) {
            return;
        }
        searchInput.placeholder = isInSiteSearchMode() ? '搜索书签...' : '';
    }

    // 搜索按钮点击事件
    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;

        if (isInSiteSearchMode()) {
            filterBookmarksByKeyword(query);
            return;
        }

        if (!query) {
            return;
        }

        const engineUrl = searchEngines[currentEngine];
        if (!engineUrl) {
            console.warn('未配置的搜索引擎:', currentEngine);
            return;
        }

        window.open(engineUrl + encodeURIComponent(query), '_blank');
    });

    // 搜索输入框回车事件
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('search-button').click();
        }
    });

    // 搜索输入框实时响应站内搜索
    document.getElementById('search-input').addEventListener('input', (e) => {
        if (!isInSiteSearchMode()) {
            return;
        }

        const value = e.target.value;
        if (value.trim() === '') {
            hideSearchResults();
        } else {
            filterBookmarksByKeyword(value);
        }
    });

    // 初始化搜索引擎
    setActiveEngine(currentEngine);

    // 全局变量
    let publicLinks = [];
    let privateLinks = [];
    let isAdmin = false;
    let isLoggedIn = false;
    let removeMode = false;
    let isRemoveCategoryMode = false;
    let isEditCategoryMode = false;
    let isDarkTheme = true;
    let links = [];
    const categories = {};

    // 添加新分类
    async function addCategory() {
        if (!await validateToken()) {
            return;
        }
        const categoryName = await showCategoryDialog('请输入新分类名称');
        if (categoryName && !categories[categoryName]) {
            categories[categoryName] = [];
            updateCategorySelect();
            renderSections();
            saveLinks();
        } else if (categories[categoryName]) {
            await customAlert('该分类已存在', '添加分类');
        }
    }

    // 删除分类
    async function deleteCategory(category) {
        if (!await validateToken()) {
            return;
        }
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
        }
    }

    // 编辑分类名称
    async function editCategoryName(oldName) {
        if (!await validateToken()) return;

        const newName = await showCategoryDialog('请输入新的分类名称', oldName);
        if (!newName || newName === oldName) return;

        if (categories[newName]) {
            await customAlert('该名称已存在，请重新命名', '编辑分类');
            return;
        }

        // 1. 重命名分类对象
        categories[newName] = categories[oldName];
        delete categories[oldName];

        // 2. 更新所有链接的 category 字段
        [...publicLinks, ...privateLinks].forEach(link => {
            if (link.category === oldName) {
                link.category = newName;
            }
        });

        links.forEach(link => {
            if (link.category === oldName) {
                link.category = newName;
            }
        });

        // 3. 保存并刷新
        renderSections();
        renderCategoryButtons();
        updateCategorySelect();
        saveLinks();

    }

    // 移动分类
    async function moveCategory(categoryName, direction) {
        if (!await validateToken()) {
            return;
        }
        const keys = Object.keys(categories);
        const index = keys.indexOf(categoryName);
        if (index < 0) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= keys.length) return;

        // 重建一个新顺序的 categories 对象
        const newCategories = {};
        const reordered = [...keys];
        [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
        reordered.forEach(key => {
            newCategories[key] = categories[key];
        });

        // 替换原有 categories 并重渲染
        Object.keys(categories).forEach(k => delete categories[k]);
        Object.assign(categories, newCategories);

        renderSections();
        renderCategoryButtons();
        updateCategorySelect();
        saveLinks();

    }

    // 切换分类编辑模式
    function toggleEditCategory() {
        isEditCategoryMode = !isEditCategoryMode;

        const deleteButtons = document.querySelectorAll('.delete-category-btn');
        const editButtons = document.querySelectorAll('.edit-category-btn');
        const moveButtons = document.querySelectorAll('.move-category-btn');

        deleteButtons.forEach(btn => {
            btn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
        });

        editButtons.forEach(btn => {
            btn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
        });

        moveButtons.forEach(btn => {
            btn.style.display = isEditCategoryMode ? 'inline-block' : 'none';
        });

        // 更新分类管理按钮的样式以显示当前状态
        const manageButton = document.querySelector('.category-manage-btn');
        if (manageButton) {
            if (isEditCategoryMode) {
                manageButton.classList.add('active');
            } else {
                manageButton.classList.remove('active');
            }
        }

        // 给用户提示 - 暂时使用console.log避免阻塞
        if (isEditCategoryMode) {
            console.log('分类编辑模式已开启');
        } else {
            console.log('分类编辑模式已关闭');
        }

    }



    // 加载特定分类的卡片
    function loadCategoryCards(category) {
        // 如果已经是当前激活分类，则收缩该分类
        if (activeCategory === category) {
            // 收缩当前分类
            const currentSection = document.querySelector('.section[data-category="' + category + '"]');
            if (currentSection) {
                currentSection.style.display = 'none';
            }
            
            // 重置激活分类
            activeCategory = null;
            
            // 更新分类按钮的激活状态
            updateActiveCategoryButton(null);
            
            return;
        }
        
        // 如果是管理员模式，显示所有分类
        if (!isAdmin) {
            // 隐藏所有分类区域
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            
            // 显示当前选中的分类区域
            const currentSection = document.querySelector('.section[data-category="' + category + '"]');
            if (currentSection) {
                currentSection.style.display = 'block';
            }
        } else {
            // 管理员模式下显示所有分类
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'block';
            });
        }
        
        const cardContainer = document.getElementById(category);
        if (!cardContainer) return;
        
        // 检查是否已经加载过
        if (cardContainer.getAttribute('data-loaded') === 'true') {
            // 已加载，只需要滚动到该分类
            scrollToCategory(category);
            activeCategory = category;
            updateActiveCategoryButton(category);
            return;
        }
        
        // 清空容器
        cardContainer.innerHTML = '';
        
        // 加载该分类的卡片
        links.forEach(link => {
            if (link.category === category) {
                createCard(link, cardContainer);
            }
        });
        
        // 标记为已加载
        cardContainer.setAttribute('data-loaded', 'true');
        
        // 滚动到该分类
        scrollToCategory(category);
        
        // 更新当前激活分类
        activeCategory = category;
        
        // 更新分类按钮的激活状态
        updateActiveCategoryButton(category);
        
    }
    
    // 更新分类按钮的激活状态
    function updateActiveCategoryButton(activeCategory) {
        document.querySelectorAll('.category-button').forEach(button => {
            // 如果activeCategory为null或者不匹配，移除激活状态
            if (activeCategory && button.textContent === activeCategory) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // 渲染分类快捷按钮
    function renderCategoryButtons() {
        // 如果正在显示搜索结果，不重新渲染分类按钮
        if (isShowingSearchResults) {
            return;
        }

        const buttonsContainer = document.getElementById('category-buttons-container');
        buttonsContainer.innerHTML = '';

        // 只有当有分类时才显示按钮容器
        if (Object.keys(categories).length > 0) {
            // 直接使用categories对象中的所有分类
            const allCategories = Object.keys(categories);

            // 创建按钮并添加到容器
            let visibleButtonsCount = 0;
            allCategories.forEach(category => {
                // 检查该分类是否有可见的链接
                const visibleLinks = links.filter(function(link) {
                    return link.category === category && (!link.isPrivate || isLoggedIn);
                });

                // 只为有可见链接的分类创建按钮
                if (visibleLinks.length > 0) {
                    const button = document.createElement('button');
                    button.className = 'category-button';
                    button.textContent = category;
                    button.dataset.category = category;
                    button.onclick = () => {
                        // 如果正在显示搜索结果，先隐藏搜索结果
                        if (isShowingSearchResults) {
                            hideSearchResults();
                        }
                        
                        // 加载对应分类的卡片
                        loadCategoryCards(category);
                    };
                    
                    buttonsContainer.appendChild(button);
                    visibleButtonsCount++;
                }
            });

            // 显示或隐藏按钮容器
            if (visibleButtonsCount > 0) {
                buttonsContainer.style.display = 'flex';
            } else {
                buttonsContainer.style.display = 'none';
            }

            // 初始时检测当前可见分类并设置相应按钮为活跃状态
            setTimeout(setActiveCategoryButtonByVisibility, 100);
        } else {
            buttonsContainer.style.display = 'none';
        }
    }

    // 根据可见性设置活跃的分类按钮
    function setActiveCategoryButtonByVisibility() {
        // 如果正在显示搜索结果，不更新分类按钮的活跃状态
        if (isShowingSearchResults) {
            return;
        }

        // 获取所有分类区域
        const sections = document.querySelectorAll('.section');
        if (!sections.length) return;

        // 获取视窗高度
        const viewportHeight = window.innerHeight;
        // 考虑固定元素的高度
        const fixedElementsHeight = 170;
        // 计算视窗中心点
        const viewportCenter = viewportHeight / 2 + fixedElementsHeight;

        // 找出最接近视窗中心的分类
        let closestSection = null;
        let closestDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // 计算分类区域的中心点
            const sectionCenter = rect.top + rect.height / 2;
            // 计算到视窗中心的距离
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

                // 移除所有活跃状态
                buttons.forEach(btn => btn.classList.remove('active'));

                // 为匹配的分类按钮添加活跃状态
                buttons.forEach(btn => {
                    if (btn.dataset.category === categoryId) {
                        btn.classList.add('active');
                    }
                });
            }
        }
    }

    // 添加滚动事件监听器，滚动时更新活跃的分类按钮
    window.addEventListener('scroll', debounce(setActiveCategoryButtonByVisibility, 100));

    // 防抖函数，避免过多的滚动事件处理
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // 滚动到指定分类
    function scrollToCategory(category) {
        const section = document.getElementById(category);
        if (section) {
            // 计算滚动位置，考虑顶部固定元素的高度和额外偏移量
            let offset = 230; // 减小偏移量，确保分类标题和第一行书签完全可见

            // 检查是否为移动设备
            if (window.innerWidth <= 480) {
                offset = 120; // 移动设备上的偏移量
            }

            // 滚动到分类位置
            const sectionRect = section.getBoundingClientRect();
            const absoluteTop = window.pageYOffset + sectionRect.top - offset;

            // 使用平滑滚动效果
            window.scrollTo({
                top: absoluteTop,
                behavior: 'smooth'
            });

        }
    }

    // 读取链接数据
    async function loadLinks() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // 如果已登录，从 localStorage 获取 token 并添加到请求头
        if (isLoggedIn) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = token;
            }
        }

        try {
            const response = await fetch('/api/getLinks?userId=testUser', {
                headers: headers
            });

            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (data.categories) {
                Object.assign(categories, data.categories);
            }

            publicLinks = data.links ? data.links.filter(link => !link.isPrivate) : [];
            privateLinks = data.links ? data.links.filter(link => link.isPrivate) : [];
            
            // 更新全局 links 变量
            links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;
        } catch (error) {
            console.error('加载链接失败:', error);
        }
    }


    // 更新UI状态
    function updateUIState() {
        const addRemoveControls = document.querySelector('.add-remove-controls');

        if (isAdmin) {
            addRemoveControls.style.display = 'flex';
            
            // 管理员模式下显示所有分类
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'block';
            });
        } else {
            addRemoveControls.style.display = 'none';
            
            // 非管理员模式下，如果有激活分类，只显示该分类
            if (activeCategory && !isShowingSearchResults) {
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                });
                
                const activeSection = document.querySelector('.section[data-category="' + activeCategory + '"]');
                if (activeSection) {
                    activeSection.style.display = 'block';
                }
            }
        }

        // 同时更新登录和设置按钮状态
        updateLoginButton();

    }

    // 登录状态显示（加载所有链接）
    function showSecretGarden() {
        if (isLoggedIn) {
            links = [...publicLinks, ...privateLinks];
            renderSections();
            // 显示所有私密标签
            document.querySelectorAll('.private-tag').forEach(tag => {
                tag.style.display = 'block';
            });
        }
    }

    // 当前激活的分类
    let activeCategory = null;
    
    // 渲染分类和链接
    function renderSections() {
        const container = document.getElementById('sections-container');
        container.innerHTML = '';

        Object.keys(categories).forEach(category => {
            const section = document.createElement('div');
            section.className = 'section';
            section.setAttribute('data-category', category);

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
            // 初始设置为空，等点击分类时再加载
            cardContainer.setAttribute('data-loaded', 'false');

            section.appendChild(titleContainer);
            section.appendChild(cardContainer);

            // 计算该分类下的链接数量（包括私密链接）
            let privateCount = 0;
            let linkCount = 0;

            links.forEach(link => {
                if (link.category === category) {
                    if (link.isPrivate) privateCount++;
                    linkCount++;
                }
            });

            // 添加链接数量指示器
            const linkCountIndicator = document.createElement('span');
            linkCountIndicator.className = 'link-count-indicator';
            linkCountIndicator.textContent = '(' + linkCount + '个链接)';
            linkCountIndicator.style.marginLeft = '10px';
            linkCountIndicator.style.fontSize = '14px';
            linkCountIndicator.style.color = '#888';
            titleContainer.appendChild(linkCountIndicator);
            
            // 点击分类标题加载对应的卡片
            titleContainer.style.cursor = 'pointer';
            titleContainer.addEventListener('click', () => loadCategoryCards(category));

            // 只有当分类中有公开链接或用户已登录时才显示该分类
            if (privateCount < linkCount || isLoggedIn) {
                // 如果是管理员模式，显示所有分类，否则初始隐藏所有分类区域
                section.style.display = isAdmin ? 'block' : 'none';
                container.appendChild(section);
            }
        });

        // 渲染分类快捷按钮
        renderCategoryButtons();

    }

    // 从URL中提取域名
    function extractDomain(url) {
        let domain;
        try {
            domain = new URL(url).hostname;
        } catch (e) {
            domain = url;
        }
        return domain;
    }

    // URL验证函数
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // 创建卡片
    function createCard(link, container) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('draggable', isAdmin);
        card.dataset.isPrivate = link.isPrivate;
        card.setAttribute('data-url', link.url);
        
        // 每次加载时都从待检测状态开始（紫色），通过 Favicon 加载来更新状态
        card.classList.add('status-warning');
        card.style.borderLeftColor = '#9b59b6';  // 紫色 - 待检测

        // 设置卡片动画延迟
        const cardIndex = container.children.length;
        card.style.setProperty('--card-index', cardIndex);

        const cardTop = document.createElement('div');
        cardTop.className = 'card-top';

        // 定义默认的 SVG 图标
        const defaultIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' +
        '</svg>';

        // 创建图标元素
        const icon = document.createElement('img');
        icon.className = 'card-icon';

        // 使用自定义图标或回退到favicon提取服务
        const isUsingFavicon = (
            !link.icon ||
            typeof link.icon !== 'string' ||
            !link.icon.trim() ||
            !isValidUrl(link.icon)
        );
        
        const domain = extractDomain(link.url);
        
        // 使用 faviconextractor.com 的 Favicon 服务
        icon.src = isUsingFavicon
            ? 'https://www.faviconextractor.com/favicon/' + domain
            : link.icon;

        icon.alt = 'Website Icon';

        // Favicon加载成功 - 标记为正常
        icon.onload = function() {
            if (isUsingFavicon) {
                // Favicon 成功加载就认为网站正常
                // （faviconextractor.com 如果网站无法访问会返回占位SVG，但也会成功加载）
                // 因此需要检测是否是占位图
                
                // 等待图片完全加载后检查尺寸和内容
                setTimeout(() => {
                    // 检查图片的实际尺寸
                    const width = this.naturalWidth;
                    const height = this.naturalHeight;
                    
                    // faviconextractor 的占位SVG通常是 100x100
                    // 真实 favicon 通常是 16x16, 32x32, 64x64 等
                    if (width === 100 && height === 100) {
                        // 很可能是占位图，标记为异常
                        link.status = 'error';
                        link.lastChecked = new Date().toISOString();
                        card.classList.remove('status-warning', 'status-ok');
                        card.classList.add('status-error');
                        card.style.borderLeftColor = '#e74c3c'; // 红色
                    } else {
                        // 正常的 Favicon，标记为正常
                        link.status = 'ok';
                        link.lastChecked = new Date().toISOString();
                        card.classList.remove('status-warning', 'status-error');
                        card.classList.add('status-ok');
                        card.style.borderLeftColor = '#43b883'; // 绿色
                    }
                }, 100);
            }
        };

        // Favicon加载失败 - 标记为异常
        icon.onerror = function() {
            if (isUsingFavicon) {
                link.status = 'error';
                link.lastChecked = new Date().toISOString();
                card.classList.remove('status-warning', 'status-ok');
                card.classList.add('status-error');
                card.style.borderLeftColor = '#e74c3c'; // 红色
            }
            
            // 使用默认的 SVG 图标
            const svgBlob = new Blob([defaultIconSVG], {type: 'image/svg+xml'});
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

        // 添加私密标签
        if (link.isPrivate) {
            const privateTag = document.createElement('div');
            privateTag.className = 'private-tag';
            privateTag.textContent = '私密';
            card.appendChild(privateTag);
        }
        
        // 不显示状态标签，只通过边框颜色区分状态
        // 绿色边框 = 正常
        // 红色边框 = 异常
        // 紫色边框 = 警告

        const correctedUrl = link.url.startsWith('http://') || link.url.startsWith('https://') ? link.url : 'http://' + link.url;

        if (!isAdmin) {
            card.addEventListener('click', () => {
                window.open(correctedUrl, '_blank');
            });
        }

        // 创建按钮容器
        const cardActions = document.createElement('div');
        cardActions.className = 'card-actions';

        // 编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'card-btn edit-btn';
        editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>' +
            '<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>' +
            '</svg>';
        editBtn.title = '编辑';
        editBtn.onclick = function (event) {
            event.stopPropagation();
            showEditDialog(link);
        };

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'card-btn delete-btn';
        deleteBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="3,6 5,6 21,6"></polyline>' +
            '<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>' +
            '<line x1="10" y1="11" x2="10" y2="17"></line>' +
            '<line x1="14" y1="11" x2="14" y2="17"></line>' +
            '</svg>';
        deleteBtn.title = '删除';
        deleteBtn.onclick = function (event) {
            event.stopPropagation();
            removeCard(card);
        };

        cardActions.appendChild(editBtn);
        cardActions.appendChild(deleteBtn);
        card.appendChild(cardActions);

        // 添加鼠标悬停事件处理描述提示
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



    // 更新分类选择下拉框
    function updateCategorySelect() {
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = '';

        Object.keys(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

    }

    // 保存链接数据
    async function saveLinks() {
        if (isAdmin && !(await validateToken())) {
            return;
        }

        let allLinks = [...publicLinks, ...privateLinks];
        
        // 保留链接的实际状态，不强制修改
        // 如果链接没有状态信息，设置为默认值
        allLinks.forEach(link => {
            if (!link.status) {
                link.status = 'ok'; // 仅为没有状态的链接设置默认值
            }
            if (!link.lastChecked) {
                link.lastChecked = new Date().toISOString();
            }
        });

        try {
            const response = await fetch('/api/saveOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    userId: 'testUser',
                    links: allLinks,
                    categories: categories
                }),
            });
            
            if (!response.ok) {
                throw new Error('服务器响应错误: ' + response.status);
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error('保存失败: ' + (result.message || '未知错误'));
            }
            
            console.log('保存链接成功，包含状态信息');
        } catch (error) {
            console.error('保存链接失败，请重试:', error);
            showToast('保存链接失败: ' + (error.message || '请重试'));
        }
    }

    // 添加卡片弹窗
    async function addLink() {
        if (!await validateToken()) {
            return;
        }
        const name = document.getElementById('name-input').value.trim();
        const url = document.getElementById('url-input').value.trim();
        const tips = document.getElementById('tips-input').value.trim();
        const icon = document.getElementById('icon-input').value.trim();
        const category = document.getElementById('category-select').value;
        const isPrivate = document.getElementById('private-checkbox').checked;

        // 验证必填字段
        if (!name || !url || !category) {
            let errorMessage = '';
            if (!name && !url) {
                errorMessage = '请输入名称和URL';
            } else if (!name) {
                errorMessage = '请输入名称';
            } else if (!url) {
                errorMessage = '请输入URL';
            }

            await customAlert(errorMessage, '添加卡片');
            if (!name) {
                document.getElementById('name-input').focus();
            } else if (!url) {
                document.getElementById('url-input').focus();
            }
            return;
        }

        // 检查URL是否已存在
        const normalizedUrl = url.toLowerCase();
        const allLinks = [...publicLinks, ...privateLinks];
        const isUrlExists = allLinks.some(link => link.url.toLowerCase() === normalizedUrl);

        if (isUrlExists) {
            await customAlert('该URL已存在，请勿重复添加', '添加卡片');
            document.getElementById('url-input').focus();
            return;
        }

        const newLink = { name, url, tips, icon, category, isPrivate };

        if (isPrivate) {
            privateLinks.push(newLink);
        } else {
            publicLinks.push(newLink);
        }

        links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

        if (isAdmin || (isPrivate && isLoggedIn) || !isPrivate) {
            const container = document.getElementById(category);
            if (container) {
                createCard(newLink, container);
            } else {
                categories[category] = [];
                renderSections();
            }
        }

        saveLinks();

        // 清空表单
        document.getElementById('name-input').value = '';
        document.getElementById('url-input').value = '';
        document.getElementById('tips-input').value = '';
        document.getElementById('icon-input').value = '';
        document.getElementById('private-checkbox').checked = false;
        hideAddDialog();

    }

    // 删除卡片
    async function removeCard(card) {
        if (!await validateToken()) {
            return;
        }
        const name = card.querySelector('.card-title').textContent;
        const url = card.getAttribute('data-url');
        const isPrivate = card.dataset.isPrivate === 'true';

        const confirmed = await customConfirm('确定要删除 "' + name + '" 吗？', '确定', '取消');
        if (!confirmed) {
            return;
        }

        links = links.filter(link => link.url !== url);
        if (isPrivate) {
            privateLinks = privateLinks.filter(link => link.url !== url);
        } else {
            publicLinks = publicLinks.filter(link => link.url !== url);
        }

        for (const key in categories) {
            categories[key] = categories[key].filter(link => link.url !== url);
        }

        card.remove();

        saveLinks();

    }

    // 拖拽卡片
    let draggedCard = null;
    let touchStartX, touchStartY;

    // 触屏端拖拽卡片
    function touchStart(event) {
        if (!isAdmin) {
            return;
        }
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

            if (currentX < targetRect.left + targetRect.width / 2) {
                container.insertBefore(draggedCard, target);
            } else {
                container.insertBefore(draggedCard, target.nextSibling);
            }
        }
    }

    function touchEnd(event) {
        if (!draggedCard) return;

        const card = draggedCard;
        const targetCategory = card.closest('.card-container').id;

        // 🔧 优化：删除冗余验证，拖拽只在管理员模式下可用，saveCardOrder()内部已有验证
        if (isAdmin && card) {
            updateCardCategory(card, targetCategory);
            saveCardOrder().catch(error => {
                console.error('Save failed:', error);
            });
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

    // PC端拖拽卡片
    function dragStart(event) {
        if (!isAdmin) {
            event.preventDefault();
            return;
        }
        draggedCard = event.target.closest('.card');
        if (!draggedCard) return;

        draggedCard.classList.add('dragging');
        event.dataTransfer.effectAllowed = "move";
    }

    function dragOver(event) {
        if (!isAdmin) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        const target = event.target.closest('.card');
        if (target && target !== draggedCard) {
            const container = target.parentElement;
            const mousePositionX = event.clientX;
            const targetRect = target.getBoundingClientRect();

            if (mousePositionX < targetRect.left + targetRect.width / 2) {
                container.insertBefore(draggedCard, target);
            } else {
                container.insertBefore(draggedCard, target.nextSibling);
            }
        }
    }

    // 清理拖拽状态函数
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

    // PC端拖拽结束
    function drop(event) {
        if (!isAdmin) {
            event.preventDefault();
            return;
        }
        event.preventDefault();

        const card = draggedCard;
        const targetCategory = event.target.closest('.card-container').id;

        validateToken().then(isValid => {
            if (isValid && card) {
                updateCardCategory(card, targetCategory);
                saveCardOrder().catch(error => {
                    console.error('Save failed:', error);
                });
            }
            cleanupDragState();
        });
    }

    function dragEnd(event) {
        if (draggedCard) {
            draggedCard.classList.remove('dragging');
        }
    }

    // 更新卡片分类
    function updateCardCategory(card, newCategory) {
        const cardTitle = card.querySelector('.card-title').textContent;
        const cardUrl = card.getAttribute('data-url');
        const isPrivate = card.dataset.isPrivate === 'true';

        const linkIndex = links.findIndex(link => link.url === cardUrl);
        if (linkIndex !== -1) {
            links[linkIndex].category = newCategory;
        }

        const linkArray = isPrivate ? privateLinks : publicLinks;
        const arrayIndex = linkArray.findIndex(link => link.url === cardUrl);
        if (arrayIndex !== -1) {
            linkArray[arrayIndex].category = newCategory;
        }

        card.dataset.category = newCategory;
    }

    // 在页面加载完成后添加触摸事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        const cardContainers = document.querySelectorAll('.card-container');
        cardContainers.forEach(container => {
            container.addEventListener('touchstart', touchStart, { passive: false });
        });
    });

    // 保存卡片顺序
    async function saveCardOrder() {
        if (!await validateToken()) {
            return;
        }
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

                // 从原始链接数据中获取描述和图标信息
                const originalLink = links.find(link => link.url === url);
                const tips = originalLink?.tips || '';
                const icon = originalLink?.icon || '';

                const link = { name, url, tips, icon, category, isPrivate };
                if (isPrivate) {
                    newPrivateLinks.push(link);
                } else {
                    newPublicLinks.push(link);
                }
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
            if (!result.success) {
                throw new Error('Failed to save order');
            }
        } catch (error) {
            await customAlert('保存顺序失败，请重试', '保存失败');
        }
    }

    // 设置状态重新加载卡片
    async function reloadCardsAsAdmin() {
        document.querySelectorAll('.card-container').forEach(container => {
            container.innerHTML = '';
        });
        await loadLinks();
    }

    // 处理登录按钮点击
    async function handleLoginClick() {
        if (isLoggedIn) {
            // 如果已登录，退出登录
            const confirmed = await customConfirm('确定要退出登录吗？', '确定', '取消');
            if (confirmed) {
                await logout();
            }
        } else {
            // 如果未登录，显示登录弹窗
            showLoginModal();
        }
    }

    // 显示登录弹窗
    function showLoginModal() {
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('login-password').focus();
    }

    // 隐藏登录弹窗
    function hideLoginModal() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-password').value = '';
    }

    // 执行登录
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
                console.log('Token saved:', result.token);
                loadLinks();
                hideLoginModal();
                updateLoginButton();
                await customAlert('登录成功！', '登录');
            } else {
                await customAlert('密码错误', '登录失败');
            }
        } catch (error) {
            // 🔧 安全修复：避免泄露详细错误信息
            console.error('Login error occurred');
            await customAlert('登录过程出错，请重试', '错误');
        }
    }

    // 退出登录
    async function logout() {
        isLoggedIn = false;
        isAdmin = false;
        localStorage.removeItem('authToken');
        links = publicLinks;
        renderSections();
        updateLoginButton();
        await customAlert('退出登录成功！', '退出登录');
        updateUIState();
    }

    // 日志功能已删除

    // 更新按钮状态
    function updateLoginButton() {
        const loginBtn = document.getElementById('login-btn');
        const adminBtn = document.getElementById('admin-btn');

        if (isLoggedIn) {
            loginBtn.textContent = '退出登录';
            adminBtn.style.display = 'inline-block';
            if (isAdmin) {
                adminBtn.textContent = '离开设置';
            } else {
                adminBtn.textContent = '设置';
            }
        } else {
            loginBtn.textContent = '登录';
            adminBtn.style.display = 'none';
        }
    }

    // 打开GitHub仓库
    function openGitHub() {
        window.open('https://github.com/hmhm2022/Card-Tab', '_blank');
    }

    // 登录密码输入框回车事件
    document.getElementById('login-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performLogin();
        }
    });

    // 切换设置状态
    async function toggleAdminMode() {
        const addRemoveControls = document.querySelector('.add-remove-controls');

        if (!isAdmin && isLoggedIn) {
            if (!await validateToken()) {
                return;
            }

            // 显示加载状态
            showLoading('正在进入设置模式...');

            // 在进入设置模式之前进行备份
            try {
                const response = await fetch('/api/backupData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('authToken')
                    },
                    body: JSON.stringify({
                        sourceUserId: 'testUser',
                        backupUserId: 'backup'
                    }),
                });
                const result = await response.json();
                if (result.success) {
                } else {
                    throw new Error('备份失败');
                }
            } catch (error) {
                // 🔧 安全修复：避免泄露详细错误信息
                hideLoading();
                const confirmed = await customConfirm('备份失败，是否仍要继续进入设置模式？', '是', '否');
                if (!confirmed) {
                    return;
                }
                showLoading('正在进入设置模式...');
            }

            try {
                isAdmin = true;
                addRemoveControls.style.display = 'flex';
                await reloadCardsAsAdmin();
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

            // 重置分类管理按钮状态
            const manageButton = document.querySelector('.category-manage-btn');
            if (manageButton) {
                manageButton.classList.remove('active');
            }

            addRemoveControls.style.display = 'none';
            await reloadCardsAsAdmin();
            await customAlert('设置已保存', '设置完成');
        }

        updateLoginButton();
        updateUIState();
    }



    // 应用暗色主题
    function applyDarkTheme() {
        document.body.classList.add('dark-theme');
        isDarkTheme = true;
    }

    // 全局变量用于管理对话框事件处理器
    let currentConfirmHandler = null;
    let currentCancelHandler = null;

    // 显示编辑链接对话框
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

        // 清除所有旧的事件处理器
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        if (currentConfirmHandler) {
            confirmBtn.removeEventListener('click', currentConfirmHandler);
        }
        if (currentCancelHandler) {
            cancelBtn.removeEventListener('click', currentCancelHandler);
        }

        // 设置新的事件处理器
        currentConfirmHandler = async function (event) {
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

    }

    // 显示添加链接对话框
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

        // 清除所有旧的事件处理器
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        if (currentConfirmHandler) {
            confirmBtn.removeEventListener('click', currentConfirmHandler);
        }
        if (currentCancelHandler) {
            cancelBtn.removeEventListener('click', currentCancelHandler);
        }

        // 设置新的事件处理器
        currentConfirmHandler = async function (event) {
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

        setTimeout(() => {
            nameInput.focus();
        }, 50);

    }

    // 更新链接
    async function updateLink(oldLink) {
        if (!await validateToken()) return;

        const name = document.getElementById('name-input').value.trim();
        const url = document.getElementById('url-input').value.trim();
        const tips = document.getElementById('tips-input').value.trim();
        const icon = document.getElementById('icon-input').value.trim();
        const category = document.getElementById('category-select').value;
        const isPrivate = document.getElementById('private-checkbox').checked;

        // 验证必填字段
        if (!name || !url || !category) {
            let errorMessage = '';
            if (!name && !url) {
                errorMessage = '请输入名称和URL';
            } else if (!name) {
                errorMessage = '请输入名称';
            } else if (!url) {
                errorMessage = '请输入URL';
            }

            await customAlert(errorMessage, '编辑卡片');
            if (!name) {
                document.getElementById('name-input').focus();
            } else if (!url) {
                document.getElementById('url-input').focus();
            }
            return;
        }

        // 检查URL是否与其他链接重复（排除当前编辑的链接）
        const normalizedUrl = url.toLowerCase();
        const allLinks = [...publicLinks, ...privateLinks];
        const isUrlExists = allLinks.some(link =>
            link.url.toLowerCase() === normalizedUrl && link.url !== oldLink.url
        );

        if (isUrlExists) {
            await customAlert('该URL已存在，请勿重复添加', '编辑卡片');
            document.getElementById('url-input').focus();
            return;
        }

        const updatedLink = { name, url, tips, icon, category, isPrivate };

        try {
            // 替换旧链接
            const list = oldLink.isPrivate ? privateLinks : publicLinks;
            const index = list.findIndex(l => l.url === oldLink.url);
            if (index !== -1) {
                list[index] = updatedLink;
            }

            // 同步更新 links
            links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

            await saveLinks();
            renderSections();
            hideAddDialog();

        } catch (error) {
            await customAlert('更新卡片失败:' + error.message, '编辑卡片');
        }
    }

    // 隐藏添加链接对话框
    function hideAddDialog() {
        document.getElementById('dialog-overlay').style.display = 'none';

        // 清理事件处理器
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

    }

    // 切换编辑卡片模式
    function toggleRemoveMode() {
        removeMode = !removeMode;
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(btn => {
            btn.style.display = removeMode ? 'flex' : 'none';
        });
        deleteButtons.forEach(btn => {
            btn.style.display = removeMode ? 'flex' : 'none';
        });

        // 隐藏自定义提示框
        document.getElementById('custom-tooltip').style.display = 'none';

        // 切换卡片悬停效果
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (removeMode) {
                card.classList.add('no-hover');
            } else {
                card.classList.remove('no-hover');
            }
        });

    }



    // 切换主题
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;

        // 添加或移除暗色主题类
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

    }

    // 返回顶部
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 控制返回顶部按钮显示/隐藏
    function handleBackToTopVisibility() {
        const btn = document.getElementById('back-to-top-btn');
        if (!btn) return;

        // 如果页面滚动高度大于 300px，才显示按钮
        if (window.scrollY > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    }

    // 处理鼠标悬停提示
    function handleTooltipMouseMove(e, tips, isAdmin) {
        const tooltip = document.getElementById('custom-tooltip');

        if (!tips || isAdmin) {
            tooltip.style.display = 'none';
            return;
        }

        // 设置提示内容
        if (tooltip.textContent !== tips) {
            tooltip.textContent = tips;
        }

        tooltip.style.display = 'block';

        const offsetX = 15;
        const offsetY = 10;

        const tooltipRect = tooltip.getBoundingClientRect();
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;

        let left = e.pageX + offsetX;
        let top = e.pageY + offsetY;

        if (pageWidth - e.clientX < 200) {
            left = e.pageX - tooltipRect.width - offsetX;
        }
        // 如果距离底部小于100像素，往上显示
        if (pageHeight - e.clientY < 100) {
            top = e.pageY - tooltipRect.height - offsetY;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function handleTooltipMouseLeave() {
        const tooltip = document.getElementById('custom-tooltip');
        tooltip.style.display = 'none';
    }

    // 验证密码
    async function verifyPassword(inputPassword) {
        const response = await fetch('/api/verifyPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: inputPassword }),
        });
        const result = await response.json();
        return result;
    }

    // 站内书签过滤
    function filterBookmarksByKeyword(keyword) {
        const keywordString = (keyword || '').trim();

        if (keywordString === '') {
            hideSearchResults();
            return;
        }

        const normalizedKeyword = keywordString.toLowerCase();
        const sectionsContainer = document.getElementById('sections-container');

        const visibleLinks = links;
        const matchedLinks = visibleLinks.filter(link => {
            const name = (link.name || '').toLowerCase();
            const tips = (link.tips || '').toLowerCase();
            const url = (link.url || '').toLowerCase();
            return (
                name.includes(normalizedKeyword) ||
                tips.includes(normalizedKeyword) ||
                url.includes(normalizedKeyword)
            );
        });

        // 清空主内容区域
        sectionsContainer.innerHTML = '';

        // 创建搜索结果头部
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
            noResults.style.textAlign = 'center';
            noResults.style.padding = '40px';
            noResults.style.color = '#666';
            sectionsContainer.appendChild(noResults);
        } else {
            // 创建简单的搜索结果容器
            const resultsSection = document.createElement('div');
            resultsSection.className = 'search-results-section';

            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';

            // 为每个匹配的链接创建卡片
            matchedLinks.forEach(link => {
                createCard(link, cardContainer);
            });

            resultsSection.appendChild(cardContainer);
            sectionsContainer.appendChild(resultsSection);
        }

        // 设置搜索状态标记
        isShowingSearchResults = true;

        // 隐藏分类按钮
        const categoryButtonsContainer = document.getElementById('category-buttons-container');
        if (categoryButtonsContainer) {
            categoryButtonsContainer.style.display = 'none';
        }
    }
    
    // 隐藏搜索结果，返回主界面
    function hideSearchResults() {
        const searchResultsSection = document.getElementById('search-results-section');
        if (searchResultsSection) {
            searchResultsSection.style.display = 'none';
        }

        const sectionsContainer = document.getElementById('sections-container');
        if (sectionsContainer) {
            sectionsContainer.style.display = 'block';
        }
        
        isShowingSearchResults = false;

        // 重新渲染分类按钮
        renderCategoryButtons();

        // 如果是管理员模式，显示所有分类
        if (isAdmin) {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'block';
            });
            // 如果有激活分类，滚动到该分类
            if (activeCategory) {
                scrollToCategory(activeCategory);
            }
        } else {
            // 非管理员模式，隐藏所有分类区域
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            
            // 如果有激活分类，加载该分类的卡片
            if (activeCategory) {
                // 显示当前激活分类
                const activeSection = document.querySelector('.section[data-category="' + activeCategory + '"]');
                if (activeSection) {
                    activeSection.style.display = 'block';
                }
                scrollToCategory(activeCategory);
            } else {
                // 如果没有激活分类，自动加载第一个分类
                // 先隐藏所有分类
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // 加载第一个分类
                const categoryList = Object.keys(categories || {});
                if (categoryList.length > 0) {
                    // 使用loadCategoryCards函数加载第一个分类的卡片
                    // 这个函数会处理显示分类、加载卡片和设置激活状态
                    loadCategoryCards(categoryList[0]);
                } else {
                    // 如果没有分类，重置激活分类
                    activeCategory = null;
                    updateActiveCategoryButton(null);
                }
            }
        }
    }

// 验证密码
async function verifyPassword(inputPassword) {
    const response = await fetch('/api/verifyPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword }),
    });
    const result = await response.json();
    return result;
}

    // 链接状态检测已集成到卡片加载时的 Favicon 加载中
    // 通过判断 Favicon 图片尺寸（100x100为占位图）来自动更新状态
    
    // 显示提示消息
    function showToast(message, duration = 3000) {
        // 检查是否已经有提示框
        let toast = document.getElementById('toast-message');
        
        if (!toast) {
            // 创建新的提示框
            toast = document.createElement('div');
            toast.id = 'toast-message';
            toast.style.position = 'fixed';
            toast.style.bottom = '100px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '5px';
            toast.style.zIndex = '2000';
            toast.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(toast);
        }
        
        // 设置消息并显示
        toast.textContent = message;
        toast.style.opacity = '1';
        
        // 设置定时器隐藏提示框
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', handleBackToTopVisibility);
    
    // 初始化加载
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await validateToken();
            updateLoginButton();
            await loadLinks();
            
            // 渲染分类和链接
            renderSections();
            
            // 初始加载完成后，如果是管理员模式显示所有分类，否则保持分类收缩
            setTimeout(() => {
                if (isAdmin) {
                    // 管理员模式显示所有分类
                    document.querySelectorAll('.section').forEach(section => {
                        section.style.display = 'block';
                    });
                } else {
                    // 非管理员模式下首次加载自动显示第一个分类
                    // 先隐藏所有分类
                    document.querySelectorAll('.section').forEach(section => {
                        section.style.display = 'none';
                    });
                    
                    // 加载第一个分类
                    const categoryList = Object.keys(categories || {});
                    if (categoryList.length > 0) {
                        // 设置激活分类
                        const firstCategory = categoryList[0];
                        
                        // 使用loadCategoryCards函数加载第一个分类的卡片
                        // 这个函数会处理显示分类、加载卡片和设置激活状态
                        loadCategoryCards(firstCategory);
                    } else {
                        // 如果没有分类，重置激活分类
                        activeCategory = null;
                    }
                }
                
                // 无论如何，都要渲染分类按钮
                renderCategoryButtons();
                
                // 确保分类按钮容器是显示的
                const categoryButtonsContainer = document.getElementById('category-buttons-container');
                if (categoryButtonsContainer) {
                    categoryButtonsContainer.style.display = 'flex';
                }
                
                // 更新分类按钮状态
                updateActiveCategoryButton(activeCategory);
                
                // 如果有激活分类，滚动到该分类
                if (activeCategory) {
                    scrollToCategory(activeCategory);
                }
            }, 500);
            
            // 初始化返回顶部按钮状态
            setTimeout(handleBackToTopVisibility, 100);
            
            // 链接状态会在卡片加载时通过 Favicon 自动检测，无需手动调用
        } catch (error) {
            // 🔧 安全修复：避免泄露详细错误信息
            console.error('Initialization failed');
        }
    });


    // 前端检查是否有 token
    async function validateToken() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            isLoggedIn = false;
            updateUIState();
            return false;
        }

        try {
            const response = await fetch('/api/getLinks?userId=testUser', {
                headers: { 'Authorization': token }
            });

            if (response.status === 401) {
                await resetToLoginState('token已过期，请重新登录');
                return false;
            }

            isLoggedIn = true;
            updateUIState();
            return true;
        } catch (error) {
            // 🔧 安全修复：避免泄露详细错误信息
            console.error('Token validation failed');
            return false;
        }
    }

    // 重置状态
    async function resetToLoginState(message) {
        // 🔧 修复：显示用户可见的Token过期提示
        if (message && message.trim() !== '') {
            await customAlert(message, '登录状态');
        }

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
        if (addRemoveControls) {
            addRemoveControls.style.display = 'none';
        }

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.style.display = 'none';
        });

        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.style.display = 'none';
        });

        document.querySelectorAll('.edit-category-btn').forEach(btn => {
            btn.style.display = 'none';
        });

        document.querySelectorAll('.move-category-btn').forEach(btn => {
            btn.style.display = 'none';
        });

        // 重置分类管理按钮状态
        const manageButton = document.querySelector('.category-manage-btn');
        if (manageButton) {
            manageButton.classList.remove('active');
        }

        const dialogOverlay = document.getElementById('dialog-overlay');
        if (dialogOverlay) {
            dialogOverlay.style.display = 'none';
        }

        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.style.display = 'none';
        }

        // 确保按钮状态正确重置
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            adminBtn.style.display = 'none';
        }
    }

    // 自定义Alert对话框
    function customAlert(message, title = '提示', confirmText = '确定') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-alert-overlay');
            const titleEl = document.getElementById('custom-alert-title');
            const contentEl = document.getElementById('custom-alert-content');
            const confirmBtn = document.getElementById('custom-alert-confirm');

            // 设置内容
            titleEl.textContent = title;
            contentEl.textContent = message;
            confirmBtn.textContent = confirmText;

            // 显示弹窗
            overlay.style.display = 'flex';

            // 确认按钮事件
            const handleConfirm = () => {
                overlay.style.display = 'none';
                confirmBtn.removeEventListener('click', handleConfirm);
                document.removeEventListener('keydown', handleKeyDown);
                resolve();
            };

            confirmBtn.addEventListener('click', handleConfirm);

            // ESC键关闭
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    handleConfirm();
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    handleConfirm();
                }
            });
        });
    }

    // 自定义Confirm对话框
    function customConfirm(message, okText = '确定', cancelText = '取消') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-confirm-overlay');
            const messageEl = document.getElementById('custom-confirm-message');
            const okBtn = document.getElementById('custom-confirm-ok');
            const cancelBtn = document.getElementById('custom-confirm-cancel');

            // 设置弹窗内容
            messageEl.textContent = message;
            okBtn.textContent = okText;
            cancelBtn.textContent = cancelText;

            // 显示弹窗
            overlay.style.display = 'flex';

            // 事件处理函数
            const handleConfirm = (result) => {
                cleanup();
                resolve(result);
            };

            const handleKeyDown = (e) => {
                if (e.key === 'Enter') handleConfirm(true);
                if (e.key === 'Escape') handleConfirm(false);
            };

            // 清理函数
            const cleanup = () => {
                overlay.style.display = 'none';
                document.removeEventListener('keydown', handleKeyDown);
                okBtn.onclick = null;
                cancelBtn.onclick = null;
                overlay.onclick = null;
            };

            // 绑定事件
            okBtn.onclick = () => handleConfirm(true);
            cancelBtn.onclick = () => handleConfirm(false);
            document.addEventListener('keydown', handleKeyDown);
            overlay.onclick = (e) => e.target === overlay && handleConfirm(false);
        });
    }

    // 分类名称输入对话框
    function showCategoryDialog(title, defaultValue = '') {
        return new Promise((resolve) => {
            const dialog = document.getElementById('category-dialog');
            const input = document.getElementById('category-name-input');
            const titleEl = document.getElementById('category-dialog-title');
            const confirmBtn = document.getElementById('category-confirm-btn');
            const cancelBtn = document.getElementById('category-cancel-btn');

            // 设置弹窗内容
            titleEl.textContent = title;
            input.value = defaultValue;

            // 显示弹窗
            dialog.style.display = 'flex';
            setTimeout(() => input.focus(), 50);

            // 事件处理函数
            const handleConfirm = () => {
                const value = input.value.trim();
                if (value) {
                    cleanup();
                    resolve(value);
                } else {
                    input.focus();
                }
            };

            const handleCancel = () => {
                cleanup();
                resolve(null);
            };

            const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirm();
                } else if (e.key === 'Escape') {
                    handleCancel();
                }
            };

            // 清理函数
            const cleanup = () => {
                dialog.style.display = 'none';
                document.removeEventListener('keydown', handleKeyDown);
                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                dialog.onclick = null;
            };

            // 绑定事件
            confirmBtn.onclick = handleConfirm;
            cancelBtn.onclick = handleCancel;
            document.addEventListener('keydown', handleKeyDown);
            dialog.onclick = (e) => e.target === dialog && handleCancel();
        });
    }

    // 显示加载遮罩
    function showLoading(message = '加载中，请稍候...') {
        const mask = document.getElementById('loading-mask');
        const textElement = mask.querySelector('p');
        textElement.textContent = message;
        mask.style.display = 'flex';
    }

    // 隐藏加载遮罩
    function hideLoading() {
        const mask = document.getElementById('loading-mask');
        mask.style.display = 'none';
    }

    // 初始化事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        // 绑定登录按钮事件
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.onclick = handleLoginClick;
        }
        
        // 绑定管理按钮事件
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            adminBtn.onclick = toggleAdminMode;
        }
        
    });

    </script>
    
    <!-- 底部版权信息 -->
    <div id="copyright">
        <div class="copyright-container">
            <span class="site-title">天下有雪-我的个人导航</span>
            <p>&copy; 2025 <a href="https://github.com/qilan28/Card-Tab" target="_blank">Card-Tab</a></p>
            <div class="buttons-group">
                <button class="admin-btn" id="admin-btn" style="display: none;">设置</button>
                <button class="login-btn" id="login-btn">登录</button>
            </div>
        </div>
    </div>
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

        const FIFTEEN_MINUTES = 300 * 60 * 1000;
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

        // 使用常量时间比较防止时序攻击
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
        // 避免泄露详细错误信息
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

// 管理员权限验证函数
async function validateAdminToken(authToken, env) {
    const validation = await validateServerToken(authToken, env);
    if (!validation.isValid) {
        return validation;
    }

    // Token有效，确认管理员权限
    return {
        isValid: true,
        isAdmin: true
    };
}



// 日志功能已完全删除

export default {
    // 定时触发处理函数已禁用（链接状态检测改为浏览器端进行）
    async scheduled(event, env, ctx) {
        console.log('定时任务已禁用，链接状态检测改为浏览器端进行');
        return new Response(JSON.stringify({ 
            success: true, 
            message: '定时任务已禁用，链接状态检测改为浏览器端进行'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    },
    
    async fetch(request, env) {
      const url = new URL(request.url);

      if (url.pathname === '/') {
        return new Response(HTML_CONTENT, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // 链接状态检查已集成到 /api/getLinks 端点

      if (url.pathname === '/api/getLinks') {
        const userId = url.searchParams.get('userId');
        const authToken = request.headers.get('Authorization');
        const data = await env.CARD_ORDER.get(userId);

        if (data) {
            const parsedData = JSON.parse(data);
            
            // 服务端不再进行链接状态检测，状态检测改为浏览器端进行
            // 确保所有链接都有默认状态
            const allLinks = parsedData.links || [];
            for (const link of allLinks) {
                if (!link.status) {
                    link.status = 'ok'; // 默认为正常状态
                }
            }
            
            // 验证 token
            if (authToken) {
                const validation = await validateServerToken(authToken, env);
                if (!validation.isValid) {
                    return new Response(JSON.stringify(validation.response), {
                        status: validation.status,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                // Token 有效，返回完整数据
                return new Response(JSON.stringify(parsedData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // 未提供 token，只返回公开数据
            const filteredLinks = parsedData.links.filter(link => !link.isPrivate);
            const filteredCategories = {};
            Object.keys(parsedData.categories).forEach(category => {
                filteredCategories[category] = parsedData.categories[category].filter(link => !link.isPrivate);
            });

            return new Response(JSON.stringify({
                links: filteredLinks,
                categories: filteredCategories,
                lastStatusCheck: parsedData.lastStatusCheck || 0
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            links: [],
            categories: {}
        }), {
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

        try {
            const { userId, links, categories } = await request.json();
            
            // 获取现有数据，保留lastStatusCheck字段
            const existingData = await env.CARD_ORDER.get(userId);
            let lastStatusCheck = Date.now();
            
            if (existingData) {
                try {
                    const parsedData = JSON.parse(existingData);
                    lastStatusCheck = parsedData.lastStatusCheck || Date.now();
                } catch (e) {
                    console.error('解析现有数据失败', e);
                }
            }
            
            // 确保所有链接都有状态信息
            for (const link of links) {
                if (!link.status) {
                    link.status = 'ok'; // 默认为正常状态
                    link.lastChecked = new Date().toISOString();
                }
            }
            
            // 保存数据，包含状态信息和最后检查时间
            await env.CARD_ORDER.put(userId, JSON.stringify({ 
                links, 
                categories, 
                lastStatusCheck 
            }));
            
            return new Response(JSON.stringify({
                success: true,
                message: '保存成功',
                lastStatusCheck
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                message: '保存失败: ' + error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
      }

      if (url.pathname === '/api/verifyPassword' && request.method === 'POST') {
        try {
            const { password } = await request.json();
            const isValid = password === env.ADMIN_PASSWORD;

            if (isValid) {
                // 生成包含时间戳的加密 token
                const timestamp = Date.now();
                const tokenData = timestamp + "_" + env.ADMIN_PASSWORD;
                const encoder = new TextEncoder();
                const data = encoder.encode(tokenData);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);

                // 使用指定格式：timestamp.hash
                const token = timestamp + "." + btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

                return new Response(JSON.stringify({
                    valid: true,
                    token: token
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({
                valid: false,
                error: 'Invalid password'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            return new Response(JSON.stringify({
                valid: false,
                error: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
      }

      // /api/refreshLinkStatus 已删除，链接状态检测改为浏览器端进行

      if (url.pathname === '/api/backupData' && request.method === 'POST') {
        // 🔧 安全修复：添加管理员权限验证
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
            // 避免泄露详细错误信息
            return new Response(JSON.stringify({
                success: false,
                message: '备份操作失败'
            }), {
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
                    return timeB - timeA;  // 降序排序，最新的在前
                });

                await env.CARD_ORDER.put(backupId, sourceData);

                const allBackups = [...backupKeys, backupId].sort((a, b) => {
                    const timeA = new Date(a.split('_')[1].replace(/-/g, '/')).getTime();
                    const timeB = new Date(b.split('_')[1].replace(/-/g, '/')).getTime();
                    return timeB - timeA;
                });

                const backupsToDelete = allBackups.slice(MAX_BACKUPS);

                if (backupsToDelete.length > 0) {
                    await Promise.all(
                        backupsToDelete.map(key => env.CARD_ORDER.delete(key))
                    );
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
