// Cloudflare Worker + KV (binding: CARD_ORDER) + ADMIN_PASSWORD
// Features: blue theme, categories + cards, admin login, add/edit/delete, import/export,
// Beijing time (date+weekday+time) + auto greeting based on Beijing time,
// Custom site name prefix (xxxx.导航) editable in admin.

const HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Card Tab</title>
<style>
  :root{
    --primary:#3b82f6;
    --primary-hover:#2563eb;
    --primary-soft:rgba(59,130,246,.18);
    --bg:#f8f6f2;
    --text:#111827;
    --muted:#6b7280;
    --card:#ffffff;
    --border:#e5e7eb;
    --dark-bg:#121418;
    --dark-card:#1e2128;
    --dark-surface:#252830;
    --dark-border:#2a2e38;
    --dark-text:#e5e7eb;
    --dark-muted:#94a3b8;
    --dark-primary:#5d7fb9;
    --dark-primary-hover:#4a6fa5;
    --danger:#e74c3c;
    --danger-hover:#c0392b;
  }
  *{ box-sizing:border-box; }
  body{ margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; background:var(--bg); color:var(--text); transition:.2s; }
  body.dark{ background:var(--dark-bg); color:var(--dark-text); }

  .fixed{
    position:fixed; inset:0 0 auto 0;
    background:var(--bg);
    padding:10px 12px 12px;
    z-index:10;
  }
  body.dark .fixed{ background:var(--dark-bg); }

  .topbar{
    display:flex; align-items:flex-start; justify-content:space-between;
    gap:10px;
  }
  .header{
    flex:1;
    text-align:center;
    display:flex;
    flex-direction:column;
    gap:4px;
    padding:2px 0 0;
    pointer-events:none;
  }
  .site-title{
    font-size:26px;
    font-weight:800;
    letter-spacing:.5px;
    line-height:1.1;
    color:#111827;
  }
  body.dark .site-title{ color:#f1f5f9; }
  .site-subtitle{
    font-size:13px;
    line-height:1.2;
    color:#374151;
  }
  body.dark .site-subtitle{ color:#cbd5e1; }
  .site-time{
    font-size:12px;
    line-height:1.2;
    color:var(--muted);
  }
  body.dark .site-time{ color:var(--dark-muted); }

  .controls{ display:flex; align-items:center; gap:8px; }
  .btn{
    border:0;
    background:var(--primary);
    color:#fff;
    border-radius:8px;
    padding:8px 12px;
    font-size:13px;
    cursor:pointer;
    transition:.15s;
    font-weight:600;
  }
  .btn:hover{ background:var(--primary-hover); transform:translateY(-1px); }
  body.dark .btn{ background:var(--dark-primary); }
  body.dark .btn:hover{ background:var(--dark-primary-hover); }
  .btn.ghost{
    background:transparent;
    color:var(--primary);
    border:1px solid var(--border);
  }
  .btn.ghost:hover{ background:rgba(59,130,246,.08); transform:none; }
  body.dark .btn.ghost{ color:var(--dark-primary); border-color:var(--dark-border); }
  body.dark .btn.ghost:hover{ background:rgba(93,127,185,.12); }

  .searchbar{
    margin-top:10px;
    display:flex;
    justify-content:center;
  }
  .search{
    width:min(680px, 100%);
    display:flex;
    border:1px solid var(--border);
    border-radius:10px;
    overflow:hidden;
    background:#fff;
    box-shadow:0 2px 8px rgba(0,0,0,.05);
  }
  body.dark .search{ background:var(--dark-surface); border-color:var(--dark-border); box-shadow:0 2px 10px rgba(0,0,0,.25); }
  select, input{
    border:0; outline:none;
    font-size:14px;
  }
  select{
    width:110px;
    padding:10px 12px;
    background:#f4f7fa;
    color:var(--primary);
    cursor:pointer;
  }
  body.dark select{ background:var(--dark-surface); color:var(--dark-primary); }
  input{
    flex:1;
    padding:10px 12px;
    background:transparent;
    color:inherit;
  }
  .search button{
    width:52px;
    border:0;
    background:var(--primary);
    color:#fff;
    cursor:pointer;
    transition:.15s;
  }
  .search button:hover{ background:var(--primary-hover); }
  body.dark .search button{ background:var(--dark-primary); }
  body.dark .search button:hover{ background:var(--dark-primary-hover); }

  .cats{
    margin-top:10px;
    display:flex;
    gap:6px;
    flex-wrap:wrap;
    justify-content:center;
  }
  .cat-btn{
    padding:6px 10px;
    border-radius:999px;
    border:0;
    cursor:pointer;
    background:#f9fafb;
    color:var(--primary);
    font-size:12px;
    font-weight:600;
    box-shadow:0 2px 4px rgba(0,0,0,.08);
    transition:.15s;
  }
  .cat-btn:hover{ background:var(--primary); color:#fff; transform:translateY(-1px); }
  .cat-btn.active{ background:var(--primary); color:#fff; }
  body.dark .cat-btn{ background:#2a2e38; color:var(--dark-primary); box-shadow:0 2px 4px rgba(0,0,0,.22); }
  body.dark .cat-btn:hover, body.dark .cat-btn.active{ background:var(--dark-primary); color:#fff; }

  .content{ padding:190px 14px 90px; max-width:1600px; margin:0 auto; }
  .section{ margin-bottom:26px; padding:0 6px; }
  .section-head{
    display:flex; align-items:center; justify-content:space-between;
    gap:10px;
    border-bottom:1px solid var(--border);
    padding:0 2px 10px;
    margin-bottom:14px;
  }
  body.dark .section-head{ border-color:var(--dark-border); }
  .section-title{
    font-size:20px;
    font-weight:800;
    position:relative;
    padding-left:12px;
    margin:0;
  }
  .section-title::before{
    content:"";
    position:absolute;
    left:0; top:50%;
    transform:translateY(-50%);
    width:4px; height:20px;
    border-radius:4px;
    background:var(--primary);
  }
  body.dark .section-title::before{ background:var(--dark-primary); }

  .admin-mini{ display:none; gap:8px; align-items:center; }
  .admin-mini .btn{ padding:7px 10px; border-radius:8px; }
  .admin-mini .btn.danger{ background:var(--danger); }
  .admin-mini .btn.danger:hover{ background:var(--danger-hover); }
  body.dark .admin-mini .btn.danger{ background:var(--danger); }

  .grid{
    display:grid;
    grid-template-columns:repeat(auto-fit, 150px);
    gap:14px 24px;
    padding-left:18px;
  }

  .card{
    background:var(--card);
    border-left:3px solid var(--primary);
    border-radius:10px;
    padding:12px;
    cursor:pointer;
    box-shadow:0 3px 10px rgba(0,0,0,.06);
    transition:.18s;
    position:relative;
    user-select:none;
  }
  .card:hover{ transform:translateY(-4px); box-shadow:0 8px 16px rgba(0,0,0,.08); }
  body.dark .card{ background:var(--dark-card); border-left-color:var(--dark-primary); box-shadow:0 4px 12px rgba(0,0,0,.25); }
  body.dark .card:hover{ box-shadow:0 10px 20px rgba(0,0,0,.35); }

  .card-top{ display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .ico{ width:16px; height:16px; border-radius:4px; background:#e5e7eb; flex:0 0 auto; }
  body.dark .ico{ background:#334155; }
  .card-title{ font-size:14px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .card-url{ font-size:12px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  body.dark .card-url{ color:var(--dark-muted); }

  .tag{
    position:absolute; top:10px; right:10px;
    font-size:10px;
    padding:2px 6px;
    border-radius:6px;
    background:#f59e0b;
    color:#fff;
    display:none;
  }
  .card.private .tag{ display:block; }

  .card-actions{
    position:absolute; top:-10px; right:-10px;
    display:none; gap:6px;
  }
  .card-actions button{
    width:28px; height:28px;
    border-radius:999px;
    border:0;
    cursor:pointer;
    color:#fff;
    background:var(--primary);
    box-shadow:0 2px 6px rgba(0,0,0,.25);
    transition:.15s;
    display:flex; align-items:center; justify-content:center;
    font-weight:900;
  }
  .card-actions button:hover{ transform:translateY(-2px); }
  .card-actions .del{ background:var(--danger); }
  .card.editable .card-actions{ display:flex; }
  body.dark .card-actions button{ background:var(--dark-primary); }
  body.dark .card-actions .del{ background:var(--danger); }

  .modal-mask{
    position:fixed; inset:0;
    background:rgba(0,0,0,.55);
    display:none; align-items:center; justify-content:center;
    z-index:50;
  }
  .modal{
    width:min(380px, 92vw);
    background:#fff;
    border-radius:14px;
    padding:18px;
    box-shadow:0 12px 30px rgba(0,0,0,.18);
  }
  body.dark .modal{ background:var(--dark-surface); color:var(--dark-text); box-shadow:0 16px 40px rgba(0,0,0,.45); }
  .modal h3{ margin:0 0 14px; font-size:18px; }
  .field{ margin-bottom:12px; }
  .field label{ display:block; font-size:12px; color:var(--muted); margin-bottom:6px; font-weight:700; }
  body.dark .field label{ color:var(--dark-muted); }
  .field input, .field select{
    width:100%;
    border:1px solid var(--border);
    border-radius:10px;
    padding:10px 12px;
    background:#fff;
    color:inherit;
  }
  body.dark .field input, body.dark .field select{ background:#323642; border-color:var(--dark-border); }
  .row{ display:flex; gap:10px; align-items:center; }
  .row > *{ flex:1; }
  .modal .actions{ display:flex; justify-content:flex-end; gap:10px; margin-top:10px; }

  .toast{
    position:fixed; left:50%; bottom:18px;
    transform:translateX(-50%);
    background:rgba(17,24,39,.92);
    color:#fff;
    padding:10px 14px;
    border-radius:10px;
    font-size:13px;
    display:none;
    z-index:60;
  }

  @media (max-width:480px){
    .content{ padding-top:210px; }
    .site-title{ font-size:22px; }
    .grid{ grid-template-columns:repeat(2, minmax(140px, 1fr)); padding-left:0; }
  }
</style>
</head>
<body>
  <div class="fixed">
    <div class="topbar">
      <div class="header">
        <div class="site-title" id="siteTitle">我的.导航</div>
        <div class="site-subtitle" id="siteSubtitle">晚上好，祝您使用愉快！</div>
        <div class="site-time" id="siteTime">北京时间：</div>
      </div>
      <div class="controls">
        <button class="btn ghost" id="themeBtn" title="切换主题">◑</button>
        <button class="btn" id="loginBtn">登录</button>
        <button class="btn" id="adminBtn" style="display:none;">设置</button>
      </div>
    </div>

    <div class="searchbar">
      <div class="search">
        <select id="engine">
          <option value="baidu">百度</option>
          <option value="bing">必应</option>
          <option value="google">谷歌</option>
          <option value="duckduckgo">DuckDuckGo</option>
        </select>
        <input id="q" placeholder="搜索..." />
        <button id="go">🔍</button>
      </div>
    </div>

    <div class="cats" id="catBtns"></div>
  </div>

  <div class="content" id="content"></div>

  <!-- Link Modal -->
  <div class="modal-mask" id="linkMask">
    <div class="modal">
      <h3 id="linkTitle">添加链接</h3>
      <div class="field">
        <label>名称</label>
        <input id="fName" placeholder="必填" />
      </div>
      <div class="field">
        <label>地址</label>
        <input id="fUrl" placeholder="必填，支持 https://..." />
      </div>
      <div class="field">
        <label>描述</label>
        <input id="fTips" placeholder="可选" />
      </div>
      <div class="field">
        <label>图标</label>
        <input id="fIcon" placeholder="可选（留空自动 favicon）" />
      </div>
      <div class="field row">
        <div>
          <label>分类</label>
          <select id="fCat"></select>
        </div>
        <div>
          <label>私密</label>
          <select id="fPrivate">
            <option value="0">否</option>
            <option value="1">是</option>
          </select>
        </div>
      </div>
      <div class="actions">
        <button class="btn ghost" id="linkCancel">取消</button>
        <button class="btn" id="linkOk">确定</button>
      </div>
    </div>
  </div>

  <!-- Login Modal -->
  <div class="modal-mask" id="loginMask">
    <div class="modal">
      <h3>登录</h3>
      <div class="field">
        <label>密码</label>
        <input id="pwd" type="password" placeholder="请输入密码" />
      </div>
      <div class="actions">
        <button class="btn ghost" id="loginCancel">取消</button>
        <button class="btn" id="loginOk">确定</button>
      </div>
    </div>
  </div>

  <!-- Site Name Modal -->
  <div class="modal-mask" id="nameMask">
    <div class="modal">
      <h3>自定义标题</h3>
      <div class="field">
        <label>导航前缀（显示为：前缀.导航）</label>
        <input id="navPrefix" placeholder="例如：xxxx" />
      </div>
      <div class="actions">
        <button class="btn ghost" id="nameCancel">取消</button>
        <button class="btn" id="nameOk">确定</button>
      </div>
    </div>
  </div>

  <!-- Import Modal -->
  <input id="importFile" type="file" accept="application/json" style="display:none;" />

  <div class="toast" id="toast"></div>

<script>
(() => {
  const engines = {
    baidu: "https://www.baidu.com/s?wd=",
    bing: "https://www.bing.com/search?q=",
    google: "https://www.google.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q="
  };

  const state = {
    isDark: false,
    isLoggedIn: false,
    isAdmin: false,
    token: null,
    data: { links: [], categories: {}, settings: { navPrefix: "我的" } },
    editingLinkUrl: null
  };

  const $ = (id) => document.getElementById(id);

  function toast(msg){
    const el = $("toast");
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.style.display = "none", 1600);
  }

  // ===== Beijing time / greeting =====
  function getBeijingParts(){
    const parts = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(new Date());
    const m = {};
    for(const p of parts) if(p.type !== "literal") m[p.type] = p.value;
    return m;
  }
  function beijingGreeting(){
    const p = getBeijingParts();
    const h = parseInt(p.hour, 10);
    if(h >= 5 && h < 11) return "早上好";
    if(h >= 11 && h < 13) return "中午好";
    if(h >= 13 && h < 18) return "下午好";
    if(h >= 18 && h < 24) return "晚上好";
    return "凌晨好";
  }
  function beijingText(){
    const p = getBeijingParts();
    return \`\${p.year}年\${p.month}月\${p.day}日 \${p.weekday} \${p.hour}:\${p.minute}:\${p.second}（北京时间）\`;
  }
  function applyHeader(){
    const prefix = (state.data.settings?.navPrefix || "我的").trim() || "我的";
    $("siteTitle").textContent = prefix + ".导航";
    $("siteSubtitle").textContent = beijingGreeting() + "，祝您使用愉快！";
    $("siteTime").textContent = beijingText();
  }
  setInterval(() => {
    // update time + greeting continuously (based on Beijing time)
    if(document.visibilityState !== "visible") return;
    applyHeader();
  }, 1000);

  // ===== Theme =====
  function setTheme(dark){
    state.isDark = dark;
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("ct_theme", dark ? "dark" : "light");
  }

  // ===== API =====
  async function api(path, opts={}){
    const headers = opts.headers || {};
    if(opts.json){
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(opts.json);
      delete opts.json;
    }
    if(state.token) headers["Authorization"] = state.token;
    opts.headers = headers;

    const res = await fetch(path, opts);
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json") ? await res.json() : await res.text();
    if(!res.ok){
      const msg = (payload && payload.message) ? payload.message : ("请求失败：" + res.status);
      throw new Error(msg);
    }
    return payload;
  }

  async function load(){
    try{
      const data = await api("/api/getLinks?userId=testUser");
      state.data = data;
      render();
      applyHeader();
    }catch(e){
      console.error(e);
      toast("加载失败");
    }
  }

  async function save(){
    await api("/api/saveOrder", { method:"POST", json: { userId:"testUser", ...state.data } });
  }

  // ===== Render =====
  function render(){
    renderCatButtons();
    const wrap = $("content");
    wrap.innerHTML = "";

    const cats = Object.keys(state.data.categories || {});
    if(cats.length === 0){
      wrap.innerHTML = '<div style="padding:18px;color:var(--muted);text-align:center;">暂无分类。登录后进入设置添加分类/链接。</div>';
      return;
    }

    for(const cat of cats){
      const all = (state.data.links || []).filter(l => l.category === cat);
      const visible = all.filter(l => !l.isPrivate || state.isLoggedIn);

      if(visible.length === 0) continue;

      const sec = document.createElement("div");
      sec.className = "section";
      sec.id = "sec_" + encodeURIComponent(cat);

      const head = document.createElement("div");
      head.className = "section-head";

      const h = document.createElement("h2");
      h.className = "section-title";
      h.textContent = cat;

      const mini = document.createElement("div");
      mini.className = "admin-mini";
      mini.style.display = state.isAdmin ? "flex" : "none";

      const addBtn = document.createElement("button");
      addBtn.className = "btn";
      addBtn.textContent = "添加";
      addBtn.onclick = () => openLinkModal({ category: cat });

      const delCat = document.createElement("button");
      delCat.className = "btn danger";
      delCat.textContent = "删分类";
      delCat.onclick = async () => {
        if(!confirm("确定删除分类并删除其下所有链接？")) return;
        delete state.data.categories[cat];
        state.data.links = state.data.links.filter(l => l.category !== cat);
        await save();
        render();
      };

      mini.appendChild(addBtn);
      mini.appendChild(delCat);

      head.appendChild(h);
      head.appendChild(mini);

      const grid = document.createElement("div");
      grid.className = "grid";

      visible.forEach((l) => {
        const card = document.createElement("div");
        card.className = "card" + (l.isPrivate ? " private" : "") + (state.isAdmin ? " editable" : "");
        card.dataset.url = l.url;

        const top = document.createElement("div");
        top.className = "card-top";

        const ico = document.createElement("img");
        ico.className = "ico";
        ico.alt = "";
        ico.src = (l.icon && l.icon.trim()) ? l.icon.trim() : ("https://www.faviconextractor.com/favicon/" + safeDomain(l.url));
        ico.onerror = () => { ico.style.display = "none"; };

        const title = document.createElement("div");
        title.className = "card-title";
        title.textContent = l.name;

        top.appendChild(ico);
        top.appendChild(title);

        const url = document.createElement("div");
        url.className = "card-url";
        url.textContent = l.url;

        const tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = "私密";

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const eb = document.createElement("button");
        eb.title = "编辑";
        eb.textContent = "✎";
        eb.onclick = (e) => { e.stopPropagation(); openLinkModal(l); };

        const db = document.createElement("button");
        db.title = "删除";
        db.textContent = "×";
        db.className = "del";
        db.onclick = async (e) => {
          e.stopPropagation();
          if(!confirm("确定删除该链接？")) return;
          state.data.links = state.data.links.filter(x => x.url !== l.url);
          // keep categories object unchanged
          await save();
          render();
        };

        actions.appendChild(eb);
        actions.appendChild(db);

        card.appendChild(top);
        card.appendChild(url);
        card.appendChild(tag);
        card.appendChild(actions);

        card.onclick = () => {
          if(state.isAdmin) return;
          openUrl(l.url);
        };

        grid.appendChild(card);
      });

      sec.appendChild(head);
      sec.appendChild(grid);
      wrap.appendChild(sec);
    }
  }

  function safeDomain(url){
    try{ return new URL(ensureHttp(url)).hostname; }catch(_){ return url; }
  }
  function ensureHttp(url){
    if(/^https?:\/\//i.test(url)) return url;
    return "http://" + url;
  }
  function openUrl(url){
    window.open(ensureHttp(url), "_blank");
  }

  function renderCatButtons(){
    const wrap = $("catBtns");
    wrap.innerHTML = "";
    const cats = Object.keys(state.data.categories || {});
    cats.forEach((cat, idx) => {
      // only show if there is at least one visible link in that category
      const any = (state.data.links || []).some(l => l.category === cat && (!l.isPrivate || state.isLoggedIn));
      if(!any) return;

      const b = document.createElement("button");
      b.className = "cat-btn";
      b.textContent = cat;
      b.onclick = () => scrollToCat(cat);
      wrap.appendChild(b);
      if(idx === 0) b.classList.add("active");
    });
  }

  function scrollToCat(cat){
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.toggle("active", b.textContent === cat));
    const sec = $("sec_" + encodeURIComponent(cat));
    if(!sec) return;
    const top = sec.getBoundingClientRect().top + window.scrollY - 200;
    window.scrollTo({ top, behavior:"smooth" });
  }

  // ===== Search =====
  $("go").onclick = () => {
    const q = $("q").value.trim();
    if(!q) return;
    const eng = $("engine").value;
    openUrl(engines[eng] + encodeURIComponent(q));
  };
  $("q").addEventListener("keydown", (e) => { if(e.key === "Enter") $("go").click(); });

  // ===== Modals =====
  function openMask(id){ $(id).style.display = "flex"; }
  function closeMask(id){ $(id).style.display = "none"; }

  $("linkCancel").onclick = () => closeMask("linkMask");
  $("loginCancel").onclick = () => closeMask("loginMask");
  $("nameCancel").onclick = () => closeMask("nameMask");

  function fillCatSelect(){
    const sel = $("fCat");
    sel.innerHTML = "";
    for(const cat of Object.keys(state.data.categories || {})){
      const o = document.createElement("option");
      o.value = cat;
      o.textContent = cat;
      sel.appendChild(o);
    }
  }

  function openLinkModal(link){
    fillCatSelect();
    state.editingLinkUrl = link && link.url ? link.url : null;
    $("linkTitle").textContent = state.editingLinkUrl ? "编辑链接" : "添加链接";
    $("fName").value = link?.name || "";
    $("fUrl").value = link?.url || "";
    $("fTips").value = link?.tips || "";
    $("fIcon").value = link?.icon || "";
    $("fPrivate").value = (link?.isPrivate ? "1" : "0");
    $("fCat").value = link?.category || Object.keys(state.data.categories || {})[0] || "";
    openMask("linkMask");
    setTimeout(() => $("fName").focus(), 30);
  }

  $("linkOk").onclick = async () => {
    try{
      if(!state.isAdmin) throw new Error("请先进入设置模式");
      const name = $("fName").value.trim();
      const url = $("fUrl").value.trim();
      const category = $("fCat").value;
      if(!name || !url || !category) throw new Error("请填写名称/地址/分类");

      const tips = $("fTips").value.trim();
      const icon = $("fIcon").value.trim();
      const isPrivate = $("fPrivate").value === "1";

      // unique url
      const low = url.toLowerCase();
      const exists = state.data.links.some(l => (l.url || "").toLowerCase() === low && l.url !== state.editingLinkUrl);
      if(exists) throw new Error("该地址已存在");

      if(state.editingLinkUrl){
        const idx = state.data.links.findIndex(l => l.url === state.editingLinkUrl);
        if(idx >= 0){
          state.data.links[idx] = { name, url, tips, icon, category, isPrivate };
        }
      }else{
        state.data.links.push({ name, url, tips, icon, category, isPrivate });
      }

      await save();
      closeMask("linkMask");
      render();
      toast("已保存");
    }catch(e){
      toast(e.message || "保存失败");
    }
  };

  // ===== Login/Admin =====
  $("loginBtn").onclick = async () => {
    if(state.isLoggedIn){
      if(!confirm("确定退出登录吗？")) return;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = null;
      localStorage.removeItem("ct_token");
      $("adminBtn").style.display = "none";
      $("loginBtn").textContent = "登录";
      render();
      toast("已退出");
      return;
    }
    openMask("loginMask");
    setTimeout(() => $("pwd").focus(), 30);
  };

  $("loginOk").onclick = async () => {
    const pwd = $("pwd").value;
    if(!pwd) return toast("请输入密码");
    try{
      const res = await api("/api/verifyPassword", { method:"POST", json:{ password: pwd }, headers:{ "Content-Type":"application/json" } });
      state.token = res.token;
      localStorage.setItem("ct_token", state.token);
      state.isLoggedIn = true;
      $("adminBtn").style.display = "inline-block";
      $("loginBtn").textContent = "退出登录";
      closeMask("loginMask");
      $("pwd").value = "";
      await load(); // reload to include private links
      toast("登录成功");
    }catch(e){
      toast("密码错误");
    }
  };

  $("adminBtn").onclick = async () => {
    if(!state.isLoggedIn) return;
    state.isAdmin = !state.isAdmin;
    $("adminBtn").textContent = state.isAdmin ? "离开设置" : "设置";
    render();
    if(state.isAdmin){
      // show admin tools in toast
      toast("设置模式：点卡片✎编辑，×删除；分类区有添加/删分类；右上角可改标题/导入/导出");
      showAdminTools();
    }else{
      hideAdminTools();
      toast("已退出设置模式");
    }
  };

  function showAdminTools(){
    // Build quick admin tool buttons next to theme button (minimal intrusion)
    if($("adminTools")) return;

    const wrap = document.createElement("div");
    wrap.id = "adminTools";
    wrap.style.display = "flex";
    wrap.style.gap = "8px";
    wrap.style.alignItems = "center";

    const b1 = document.createElement("button");
    b1.className = "btn ghost";
    b1.textContent = "标题";
    b1.onclick = () => {
      $("navPrefix").value = state.data.settings?.navPrefix || "";
      openMask("nameMask");
      setTimeout(() => $("navPrefix").focus(), 30);
    };

    const b2 = document.createElement("button");
    b2.className = "btn ghost";
    b2.textContent = "导出";
    b2.onclick = async () => {
      try{
        const res = await fetch("/api/exportData?userId=testUser", { headers: { "Authorization": state.token } });
        if(!res.ok) throw new Error("导出失败");
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "cardtab_export.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast("已导出");
      }catch(e){ toast("导出失败"); }
    };

    const b3 = document.createElement("button");
    b3.className = "btn ghost";
    b3.textContent = "导入";
    b3.onclick = () => $("importFile").click();

    wrap.appendChild(b1);
    wrap.appendChild(b2);
    wrap.appendChild(b3);

    // insert after theme button
    const controls = document.querySelector(".controls");
    controls.insertBefore(wrap, $("loginBtn"));
  }

  function hideAdminTools(){
    const el = $("adminTools");
    if(el) el.remove();
  }

  $("nameOk").onclick = async () => {
    try{
      if(!state.isAdmin) throw new Error("请先进入设置模式");
      const val = $("navPrefix").value.trim();
      if(!val) throw new Error("请输入前缀");
      state.data.settings = state.data.settings || {};
      state.data.settings.navPrefix = val;
      await save();
      applyHeader();
      closeMask("nameMask");
      toast("标题已更新");
    }catch(e){
      toast(e.message || "更新失败");
    }
  };

  $("importFile").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!file) return;
    if(!state.isAdmin) return toast("请先进入设置模式");
    if(!confirm("导入会覆盖当前数据，确定继续吗？")) return;

    try{
      const text = await file.text();
      const data = JSON.parse(text);
      await api("/api/importData", { method:"POST", json:{ userId:"testUser", data }, headers:{ "Content-Type":"application/json" } });
      await load();
      toast("导入成功");
    }catch(err){
      toast("导入失败");
    }
  });

  // ===== Category creation (simple) =====
  // If no category exists, admin can create one via prompt on first entry.
  async function ensureAtLeastOneCategory(){
    const cats = Object.keys(state.data.categories || {});
    if(cats.length > 0) return true;
    if(!state.isLoggedIn) return false;
    if(!confirm("当前没有分类，是否创建一个默认分类？")) return false;
    const name = prompt("请输入分类名称：", "常用");
    if(!name || !name.trim()) return false;
    state.data.categories[name.trim()] = [];
    await save();
    await load();
    return true;
  }

  // ===== Theme button =====
  $("themeBtn").onclick = () => setTheme(!state.isDark);

  // ===== Init =====
  (async () => {
    setTheme((localStorage.getItem("ct_theme") || "light") === "dark");
    applyHeader();

    const cached = localStorage.getItem("ct_token");
    if(cached){
      state.token = cached;
      try{
        // validate by calling getLinks with auth header
        state.isLoggedIn = true;
        $("adminBtn").style.display = "inline-block";
        $("loginBtn").textContent = "退出登录";
      }catch(_e){
        state.token = null;
        localStorage.removeItem("ct_token");
        state.isLoggedIn = false;
      }
    }

    await load();

    // If logged in and no categories, suggest create one
    if(state.isLoggedIn){
      await ensureAtLeastOneCategory();
    }

    $("adminBtn").textContent = "设置";
  })();

})();
</script>
</body>
</html>`;

function constantTimeCompare(a, b){
  if(a.length !== b.length) return false;
  let r = 0;
  for(let i=0;i<a.length;i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function validateServerToken(authToken, env){
  if(!authToken){
    return { isValid:false, status:401, response:{ error:"Unauthorized", message:"未登录或登录已过期" } };
  }
  try{
    const parts = authToken.split(".");
    if(parts.length !== 2) return { isValid:false, status:401, response:{ error:"Invalid token", message:"登录状态无效，请重新登录" } };
    const ts = parseInt(parts[0], 10);
    const hash = parts[1];
    const now = Date.now();
    const TTL = 15 * 60 * 1000;
    if(now - ts > TTL) return { isValid:false, status:401, response:{ error:"Token expired", message:"登录已过期，请重新登录" } };

    const tokenData = String(ts) + "_" + env.ADMIN_PASSWORD;
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(tokenData));
    const expected = btoa(String.fromCharCode(...new Uint8Array(buf)));

    if(!constantTimeCompare(hash, expected)){
      return { isValid:false, status:401, response:{ error:"Invalid token", message:"登录状态无效，请重新登录" } };
    }
    return { isValid:true };
  }catch(_e){
    return { isValid:false, status:401, response:{ error:"Invalid token", message:"登录验证失败，请重新登录" } };
  }
}

export default {
  async fetch(request, env){
    const url = new URL(request.url);

    if(url.pathname === "/"){
      return new Response(HTML, { headers:{ "Content-Type":"text/html; charset=utf-8" } });
    }

    if(url.pathname === "/api/getLinks"){
      const userId = url.searchParams.get("userId") || "testUser";
      const authToken = request.headers.get("Authorization");
      const raw = await env.CARD_ORDER.get(userId);

      const defaultSettings = { navPrefix:"我的" };
      if(raw){
        const parsed = JSON.parse(raw);
        if(!parsed.settings || typeof parsed.settings !== "object") parsed.settings = { ...defaultSettings };
        else parsed.settings = { ...defaultSettings, ...parsed.settings };

        if(authToken){
          const v = await validateServerToken(authToken, env);
          if(!v.isValid){
            return new Response(JSON.stringify(v.response), { status:v.status, headers:{ "Content-Type":"application/json; charset=utf-8" } });
          }
          return new Response(JSON.stringify(parsed), { status:200, headers:{ "Content-Type":"application/json; charset=utf-8" } });
        }

        // public view
        const links = (parsed.links || []).filter(l => !l.isPrivate);
        const cats = parsed.categories || {};
        const filteredCats = {};
        for(const k of Object.keys(cats)){
          filteredCats[k] = (cats[k] || []).filter(l => !l.isPrivate);
        }
        return new Response(JSON.stringify({ links, categories: filteredCats, settings: parsed.settings }), { status:200, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }

      return new Response(JSON.stringify({ links:[], categories:{}, settings:defaultSettings }), { status:200, headers:{ "Content-Type":"application/json; charset=utf-8" } });
    }

    if(url.pathname === "/api/saveOrder" && request.method === "POST"){
      const authToken = request.headers.get("Authorization");
      const v = await validateServerToken(authToken, env);
      if(!v.isValid){
        return new Response(JSON.stringify(v.response), { status:v.status, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }
      const body = await request.json();
      const userId = body.userId || "testUser";
      const links = Array.isArray(body.links) ? body.links : [];
      const categories = (body.categories && typeof body.categories === "object") ? body.categories : {};
      const settings = (body.settings && typeof body.settings === "object") ? body.settings : {};
      const defaultSettings = { navPrefix:"我的" };
      const mergedSettings = { ...defaultSettings, ...settings };

      await env.CARD_ORDER.put(userId, JSON.stringify({ links, categories, settings: mergedSettings }));
      return new Response(JSON.stringify({ success:true }), { status:200, headers:{ "Content-Type":"application/json; charset=utf-8" } });
    }

    if(url.pathname === "/api/verifyPassword" && request.method === "POST"){
      try{
        const body = await request.json();
        const ok = body.password === env.ADMIN_PASSWORD;
        if(!ok){
          return new Response(JSON.stringify({ valid:false }), { status:403, headers:{ "Content-Type":"application/json; charset=utf-8" } });
        }
        const ts = Date.now();
        const tokenData = String(ts) + "_" + env.ADMIN_PASSWORD;
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest("SHA-256", enc.encode(tokenData));
        const hash = btoa(String.fromCharCode(...new Uint8Array(buf)));
        return new Response(JSON.stringify({ valid:true, token: String(ts) + "." + hash }), { status:200, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }catch(_e){
        return new Response(JSON.stringify({ valid:false, message:"Internal error" }), { status:500, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }
    }

    if(url.pathname === "/api/exportData" && request.method === "GET"){
      const authToken = request.headers.get("Authorization");
      const v = await validateServerToken(authToken, env);
      if(!v.isValid){
        return new Response(JSON.stringify(v.response), { status:v.status, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }
      const userId = url.searchParams.get("userId") || "testUser";
      const raw = await env.CARD_ORDER.get(userId);
      const payload = raw ? JSON.parse(raw) : { links:[], categories:{}, settings:{ navPrefix:"我的" } };
      return new Response(JSON.stringify(payload, null, 2), {
        status:200,
        headers:{
          "Content-Type":"application/json; charset=utf-8",
          "Content-Disposition": 'attachment; filename="cardtab_export.json"'
        }
      });
    }

    if(url.pathname === "/api/importData" && request.method === "POST"){
      const authToken = request.headers.get("Authorization");
      const v = await validateServerToken(authToken, env);
      if(!v.isValid){
        return new Response(JSON.stringify(v.response), { status:v.status, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }
      try{
        const body = await request.json();
        const userId = body.userId || "testUser";
        const imported = body.data || {};
        if(!Array.isArray(imported.links) || !imported.categories || typeof imported.categories !== "object"){
          return new Response(JSON.stringify({ success:false, message:"数据格式不正确：需要 {links,categories}" }), { status:400, headers:{ "Content-Type":"application/json; charset=utf-8" } });
        }
        const defaultSettings = { navPrefix:"我的" };
        const settings = (imported.settings && typeof imported.settings === "object") ? { ...defaultSettings, ...imported.settings } : { ...defaultSettings };
        await env.CARD_ORDER.put(userId, JSON.stringify({ links: imported.links, categories: imported.categories, settings }));
        return new Response(JSON.stringify({ success:true }), { status:200, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }catch(_e){
        return new Response(JSON.stringify({ success:false, message:"导入失败：JSON 解析或写入错误" }), { status:500, headers:{ "Content-Type":"application/json; charset=utf-8" } });
      }
    }

    return new Response("Not Found", { status:404 });
  }
};
