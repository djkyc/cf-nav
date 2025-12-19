const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>cf-nav</title>

<style>
/* =========================
   基础重置
========================= */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial;
}

/* =========================
   哪吒 · 官方色调背景
========================= */
body {
  background:
    linear-gradient(
      135deg,
      rgba(201, 42, 42, 0.55),
      rgba(255, 106, 0, 0.35),
      rgba(15, 17, 21, 0.85)
    ),
    url("https://api.tomys.top/api/acgimg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #f2f2f2;
}

/* =========================
   顶部搜索区
========================= */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 20px;
  background: rgba(15, 17, 21, 0.78);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 106, 0, 0.25);
}

.search-box {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(22, 26, 32, 0.85);
}

.search-box input {
  flex: 1;
  padding: 14px;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-size: 16px;
}

.search-box button {
  padding: 0 20px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #C92A2A, #FF6A00);
  color: #fff;
  font-size: 18px;
}

.search-box button:hover {
  box-shadow: 0 0 14px rgba(255,106,0,.6);
}

/* =========================
   主体内容
========================= */
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

/* =========================
   卡片
========================= */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.card {
  background: rgba(22, 26, 32, 0.82);
  border-left: 4px solid #C92A2A;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all .25s ease;
}

.card:hover {
  border-left-color: #FF6A00;
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 0 18px rgba(255,106,0,.45);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.card-url {
  font-size: 12px;
  opacity: .7;
  word-break: break-all;
}

/* =========================
   哪吒火焰动效（轻量）
========================= */
@keyframes flameGlow {
  0% { box-shadow: 0 0 8px rgba(255,106,0,.4); }
  50% { box-shadow: 0 0 18px rgba(255,106,0,.8); }
  100% { box-shadow: 0 0 8px rgba(255,106,0,.4); }
}

.card:hover {
  animation: flameGlow 1.2s infinite;
}

/* =========================
   页脚
========================= */
.footer {
  text-align: center;
  padding: 30px;
  opacity: .6;
  font-size: 13px;
}
</style>
</head>

<body>

<div class="header">
  <div class="search-box">
    <input id="q" placeholder="搜索 / 输入关键词…" />
    <button onclick="search()">🔍</button>
  </div>
</div>

<div class="container">
  <div class="card-grid" id="list"></div>
</div>

<div class="footer">
  cf-nav · 哪吒主题
</div>

<script>
const links = [
  { name: "GitHub", url: "https://github.com" },
  { name: "Cloudflare", url: "https://cloudflare.com" },
  { name: "Google", url: "https://google.com" }
];

function render(list) {
  const el = document.getElementById("list");
  el.innerHTML = "";
  list.forEach(l => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = \`
      <div class="card-title">\${l.name}</div>
      <div class="card-url">\${l.url}</div>
    \`;
    d.onclick = () => window.open(l.url, "_blank");
    el.appendChild(d);
  });
}

function search() {
  const q = document.getElementById("q").value.toLowerCase();
  render(links.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.url.toLowerCase().includes(q)
  ));
}

render(links);
</script>

</body>
</html>
`;

export default {
  async fetch() {
    return new Response(HTML_CONTENT, {
      headers: { "content-type": "text/html; charset=UTF-8" }
    });
  }
};
