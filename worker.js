const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Card Tab</title>

<style>
/* ===== 全局 ===== */
body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    margin: 0;
    background-color: #f8f6f2;
    color: #222;
}

body.dark-theme {
    background-color: #121418;
    color: #e3e3e3;
}

/* ===== 顶部 ===== */
.fixed-elements {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background-color: #f8f6f2;
    z-index: 1000;
}

body.dark-theme .fixed-elements {
    background-color: #121418;
}

.fixed-elements h3 {
    position: absolute;
    top: 10px;
    left: 20px;
    margin: 0;
    font-size: 22px;
}

/* ===== 搜索 ===== */
.search-container {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}

.search-bar {
    display: flex;
    width: 600px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
}

.search-bar select {
    border: none;
    padding: 10px;
    background: #eef2ff;
    color: #4A6CF7;
}

.search-bar input {
    flex: 1;
    border: none;
    padding: 10px;
}

.search-bar button {
    border: none;
    background: #4A6CF7;
    color: white;
    padding: 0 20px;
}

/* ===== 分类按钮 ===== */
.category-buttons-container {
    margin-top: 10px;
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
}

.category-button {
    background: #eef2ff;
    color: #4A6CF7;
    border: none;
    padding: 5px 12px;
    border-radius: 14px;
    cursor: pointer;
}

.category-button:hover,
.category-button.active {
    background: #4A6CF7;
    color: white;
}

/* ===== 内容 ===== */
.content {
    margin-top: 170px;
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
}

/* ===== 分类 ===== */
.section-title {
    font-size: 22px;
    font-weight: 600;
    border-left: 4px solid #4A6CF7;
    padding-left: 10px;
    margin-bottom: 10px;
}

/* ===== 卡片 ===== */
.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 150px);
    gap: 20px;
}

.card {
    background: white;
    border-radius: 8px;
    padding: 12px;
    border-left: 3px solid #4A6CF7;
    cursor: pointer;
    transition: transform .2s, box-shadow .2s;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,.08);
}

.card-title {
    font-weight: 600;
    font-size: 14px;
}

.card-url {
    font-size: 12px;
    color: #888;
}

body.dark-theme .card {
    background: #1e2128;
}
</style>
</head>

<body>
<div class="fixed-elements">
    <h3>我的导航</h3>

    <div class="search-container">
        <div class="search-bar">
            <select>
                <option>百度</option>
                <option>必应</option>
                <option>谷歌</option>
            </select>
            <input type="text" placeholder="搜索">
            <button>🔍</button>
        </div>
    </div>

    <div id="category-buttons-container" class="category-buttons-container"></div>
</div>

<div class="content" id="sections-container"></div>

<script>
/* 示例数据 */
const data = {
    "开发": [
        { name: "GitHub", url: "https://github.com" },
        { name: "MDN", url: "https://developer.mozilla.org" }
    ]
};

const sections = document.getElementById('sections-container');
const buttons = document.getElementById('category-buttons-container');

Object.keys(data).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-button';
    btn.textContent = cat;
    btn.onclick = () => {
        document.getElementById(cat).scrollIntoView({ behavior: 'smooth' });
    };
    buttons.appendChild(btn);

    const section = document.createElement('div');
    section.id = cat;

    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = cat;

    const container = document.createElement('div');
    container.className = 'card-container';

    data[cat].forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => window.open(item.url);

        const t = document.createElement('div');
        t.className = 'card-title';
        t.textContent = item.name;

        const u = document.createElement('div');
        u.className = 'card-url';
        u.textContent = item.url;

        card.appendChild(t);
        card.appendChild(u);
        container.appendChild(card);
    });

    section.appendChild(title);
    section.appendChild(container);
    sections.appendChild(section);
});
</script>
</body>
</html>
`;

/* ===== Worker ===== */
export default {
    async fetch(request) {
        return new Response(HTML_CONTENT, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
};
