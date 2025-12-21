// Nav-CF Worker - Single-file Cloudflare Deploy (KV版本)
// KV Binding: CARD_ORDER
// Env:
// - ADMIN_PASSWORD (必填)
// - AI_API_KEY (可选，用于 /api/aiGenerate；不填则走 fallback)

const SEED_USER_ID = "testUser";
const SEED_DATA = {
  links: [],
  categories: { "常用": [] }
};

function jsonResponse(data, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=UTF-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function unauthorized(message = "Unauthorized") {
  return jsonResponse({ error: message }, { status: 401 });
}

function getAuthStatus(request, env) {
  const auth = request.headers.get("Authorization");
  if (!auth) return { hasAuthHeader: false, authed: false };
  return { hasAuthHeader: true, authed: auth === (env.ADMIN_PASSWORD || "") };
}

function cleanDomain(hostname) {
  return hostname
    .replace(/^www\./, "")
    .replace(/^cn\./, "")
    .split(".")[0];
}

function normalizeData(data) {
  const d = (data && typeof data === "object") ? data : {};
  const links = Array.isArray(d.links) ? d.links : [];
  const categories = (d.categories && typeof d.categories === "object") ? d.categories : {};
  // Ensure category arrays
  for (const k of Object.keys(categories)) {
    if (!Array.isArray(categories[k])) categories[k] = [];
  }
  // If categories empty but links exist, rebuild categories from links
  if (Object.keys(categories).length === 0 && links.length) {
    for (const link of links) {
      const c = link.category || "常用";
      if (!categories[c]) categories[c] = [];
      categories[c].push(link);
    }
  }
  // Ensure at least one category exists
  if (Object.keys(categories).length === 0) categories["常用"] = [];
  return { links, categories };
}

function filterPublic(data) {
  const d = normalizeData(data);
  const publicLinks = d.links.filter(l => !l || !l.isPrivate);
  const categories = {};
  for (const [cat, arr] of Object.entries(d.categories)) {
    categories[cat] = (Array.isArray(arr) ? arr : []).filter(l => !l || !l.isPrivate);
  }
  return { links: publicLinks, categories };
}

async function fetchMetaDescription(targetUrl) {
  if (!targetUrl) return "";
  let u;
  try { u = new URL(targetUrl); } catch { return ""; }

  const res = await fetch(u.toString(), {
    redirect: "follow",
    headers: {
      "User-Agent": "Nav-CF-MetaFetcher/1.0"
    }
  });

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return "";

  const html = await res.text();

  const pick = (re) => {
    const m = html.match(re);
    return m && m[1] ? m[1].trim() : "";
  };

  // Prefer meta description, then og:description
  let desc =
    pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    pick(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i) ||
    pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["'][^>]*>/i);

  if (desc.length > 160) desc = desc.slice(0, 160);
  return desc;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ================= PAGE ================= */
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML_CONTENT, {
        headers: { "content-type": "text/html; charset=UTF-8" }
      });
    }

    /* ================= AI GENERATE ================= */
    if (url.pathname === "/api/aiGenerate") {
      let targetUrl = "";
      if (request.method === "POST") {
        try {
          const body = await request.json();
          targetUrl = body.url || "";
        } catch {}
      } else {
        targetUrl = url.searchParams.get("url") || "";
      }

      if (!targetUrl) return jsonResponse({ name: "", desc: "", source: "none" });

      const hostname = (() => {
        try { return new URL(targetUrl).hostname; }
        catch { return targetUrl; }
      })();

      const domain = cleanDomain(hostname);
      const aiKey = env.AI_API_KEY || "";
      const canUseAI = aiKey.startsWith("sk-") && !aiKey.includes("xxxx");

      if (canUseAI) {
        try {
          const prompt = `你是一个中文网站导航编辑。\n请根据网址生成导航信息：\n- 名称：完整、自然，不要简称\n- 描述：10~15字，概括主要用途\n\n网址：${targetUrl}\n\n仅返回 JSON：{"name":"","desc":""}`;
          const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + aiKey
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.0
            })
          });

          const j = await r.json();
          const t = j.choices?.[0]?.message?.content;
          if (t) {
            const ai = JSON.parse(t);
            if (ai && (ai.name || ai.desc)) {
              return jsonResponse({
                name: ai.name || domain.charAt(0).toUpperCase() + domain.slice(1),
                desc: ai.desc || "",
                source: "openai"
              });
            }
          }
        } catch {}
      }

      // Fallback
      let fallbackDesc = "官方网站入口";
      if (domain === "uptodown") fallbackDesc = "应用与软件下载平台";
      if (domain === "github") fallbackDesc = "开源代码托管平台";
      if (domain === "cloudflare") fallbackDesc = "网络与安全服务平台";
      if (domain === "google") fallbackDesc = "搜索与互联网服务";

      return jsonResponse({
        name: domain.charAt(0).toUpperCase() + domain.slice(1),
        desc: fallbackDesc,
        source: "fallback"
      });
    }

    /* ================= META (for auto description) ================= */
    if (url.pathname === "/api/fetchMeta" && request.method === "GET") {
      const targetUrl = url.searchParams.get("url") || "";
      try {
        const description = await fetchMetaDescription(targetUrl);
        return jsonResponse({ description });
      } catch {
        return jsonResponse({ description: "" });
      }
    }

    /* ================= VERIFY PASSWORD ================= */
    if (url.pathname === "/api/verifyPassword" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch {}
      const pwd = body.password || "";
      if ((env.ADMIN_PASSWORD || "") && pwd === env.ADMIN_PASSWORD) {
        // 保持与前端现有逻辑兼容：token 直接使用 ADMIN_PASSWORD
        return jsonResponse({ valid: true, token: env.ADMIN_PASSWORD });
      }
      return jsonResponse({ valid: false }, { status: 401 });
    }

    /* ================= GET LINKS ================= */
    if (url.pathname === "/api/getLinks") {
      const { hasAuthHeader, authed } = getAuthStatus(request, env);
      if (hasAuthHeader && !authed) return unauthorized("Invalid token");

      const userId = url.searchParams.get("userId") || SEED_USER_ID;
      const raw = await env.CARD_ORDER.get(userId, "json");
      const data = normalizeData(raw || SEED_DATA);

      // 未登录：只返回公开数据（真正隐藏私密链接，避免被抓包看到）
      if (!authed) return jsonResponse(filterPublic(data));
      return jsonResponse(data);
    }

    /* ================= SAVE ORDER / DATA ================= */
    if (url.pathname === "/api/saveOrder") {
      const { hasAuthHeader, authed } = getAuthStatus(request, env);
      if (!hasAuthHeader || !authed) return unauthorized("Unauthorized");

      let body = {};
      try { body = await request.json(); } catch {}
      const userId = body.userId || SEED_USER_ID;

      const dataToSave = normalizeData({
        links: body.links,
        categories: body.categories
      });

      await env.CARD_ORDER.put(userId, JSON.stringify(dataToSave));
      // 前端期待 success 字段
      return jsonResponse({ success: true });
    }

    /* ================= EXPORT ================= */
    if (url.pathname === "/api/exportData" && request.method === "GET") {
      const { hasAuthHeader, authed } = getAuthStatus(request, env);
      if (!hasAuthHeader || !authed) return unauthorized("Unauthorized");

      const userId = url.searchParams.get("userId") || SEED_USER_ID;
      const raw = await env.CARD_ORDER.get(userId, "json");
      const data = normalizeData(raw || SEED_DATA);

      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "content-disposition": 'attachment; filename="cardtab_export.json"'
        }
      });
    }

    /* ================= IMPORT ================= */
    if (url.pathname === "/api/importData" && request.method === "POST") {
      const { hasAuthHeader, authed } = getAuthStatus(request, env);
      if (!hasAuthHeader || !authed) return unauthorized("Unauthorized");

      let body = {};
      try { body = await request.json(); } catch {}
      const userId = body.userId || SEED_USER_ID;

      const incoming = (body.data && typeof body.data === "object") ? body.data : null;
      if (!incoming) {
        return jsonResponse({ message: "缺少 data 字段" }, { status: 400 });
      }

      const dataToSave = normalizeData(incoming);
      await env.CARD_ORDER.put(userId, JSON.stringify(dataToSave));
      return jsonResponse({ success: true });
    }

    return new Response("Not Found", { status: 404 });
  }
};


const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nav-CF</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect x=%2215%22 y=%2220%22 width=%2255%22 height=%2210%22 rx=%225%22 fill=%22black%22/><rect x=%2225%22 y=%2240%22 width=%2255%22 height=%2210%22 rx=%225%22 fill=%22black%22/><rect x=%2235%22 y=%2260%22 width=%2255%22 height=%2210%22 rx=%225%22 fill=%22black%22/></svg>"><text y=%22.9em%22 font-size=%2280%22>?</text></svg>">
  <style>
    /* ========= 全局 ========= */
    :root{
      /* Light mode: 黑色主色 */
      --primary:#111111;
      --primary-hover:#000000;
      --primary-soft:rgba(0,0,0,.15);
      --danger:#e74c3c;
      --danger-hover:#c0392b;

      --bg:rgb(250,250,250);
      --text:#222;
      --muted:#888;

      --dark-bg:#121418;
      --dark-card:#1e2128;
      --dark-surface:#252830;
      --dark-border:#2a2e38;
      --dark-text:#e3e3e3;
      --dark-muted:#a0a0a0;

      --dark-primary:#5d7fb9;
      --dark-primary-hover:#4a6fa5;
    }

    @media (prefers-color-scheme: dark){
      :root{
        --primary:#f5f5f5;
        --primary-hover:#ffffff;
        --primary-soft:rgba(255,255,255,.25);
      }
    }


    img, svg{
      filter:none !important;
      mix-blend-mode:normal !important;
    }

    body{
      font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;
      margin:0;padding:0;
      background-color:var(--bg);
      color:var(--text);
      transition:all .3s ease;

      /* Theme-bound variables (manual toggle wins over OS scheme) */
      --primary:#111111;
      --primary-hover:#000000;
      --primary-soft:rgba(0,0,0,.15);
    }
    body.dark-theme{
      background-color:var(--dark-bg);
      color:var(--dark-text);

      --primary:#f5f5f5;
      --primary-hover:#ffffff;
      --primary-soft:rgba(255,255,255,.25);
    }

    
    .site-header{
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      margin-top:6px;
      margin-bottom:6px;
      text-align:center;
    }
    #site-title{
      font-size:24px;
      font-weight:700;
      cursor:pointer;
      line-height:1.2;
      margin-bottom:2px;
    }
    #site-datetime{
      font-size:13px;
      color:var(--muted);
      line-height:1.2;
      white-space:nowrap;
    }

    /* ========= 顶部固定区 ========= */
    .fixed-elements{
      position:fixed;top:0;left:0;right:0;
      background-color:var(--bg);
      z-index:1000;
      padding:10px;
      height:190px;
      box-shadow:none;
      transition:all .3s ease;
    }
    body.dark-theme .fixed-elements{
      background-color:var(--dark-bg);
      box-shadow:none;
    }
    .fixed-elements h3{
      position:absolute;top:10px;left:20px;
      margin:0;
      font-size:22px;font-weight:600;
      color:var(--text);
      transition:all .3s ease;
    }
    body.dark-theme .fixed-elements h3{ color:var(--dark-text); }

    .center-content{
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      width:100%;
      text-align:center;
      padding:0 10px;
    }

    /* ========= 右上角控制 ========= */
    .top-right-controls{
      position:fixed;top:10px;right:10px;
      display:flex;align-items:center;gap:10px;
      z-index:1001;
    }
    .admin-btn,.login-btn{
      background-color:var(--primary);
      color:#fff;border:none;border-radius:4px;
      padding:8px 16px;font-size:13px;
      cursor:pointer;transition:all .3s ease;
      font-weight:500;
    }
    .admin-btn:hover,.login-btn:hover{
      background-color:var(--primary-hover);
      transform:translateY(-1px);
    }
    body.dark-theme .admin-btn,body.dark-theme .login-btn{ background-color:var(--dark-primary); }
    body.dark-theme .admin-btn:hover,body.dark-theme .login-btn:hover{ background-color:var(--dark-primary-hover); }

    .github-btn{
      background:none;border:none;cursor:pointer;
      transition:all .3s ease;
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;border-radius:4px;padding:0;
    }
    .github-btn:hover{ transform:translateY(-2px); }
    .github-btn svg{ width:24px;height:24px;fill:var(--primary);transition:fill .3s ease; }
    body.dark-theme .github-btn svg{ fill:var(--dark-primary); }

    .bookmark-search-toggle{
      background-color:var(--primary);
      color:#fff;border:none;border-radius:4px;
      padding:0;cursor:pointer;
      transition:all .3s ease;
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;position:relative;
    }
    .bookmark-search-toggle:hover{
      background-color:var(--primary-hover);
      transform:translateY(-2px);
    }
    .bookmark-search-toggle svg{ width:20px;height:20px;stroke:#fff; }
    body.dark-theme .bookmark-search-toggle{ background-color:var(--dark-primary); }
    body.dark-theme .bookmark-search-toggle:hover{ background-color:var(--dark-primary-hover); }

    .bookmark-search-dropdown{
      position:absolute;top:100%;right:0;
      width:140px;background:#fff;
      border:1px solid #e0e0e0;border-radius:4px;
      box-shadow:0 4px 12px rgba(0,0,0,.15);
      padding:8px;margin-top:4px;
      display:none;z-index:1002;
    }
    .bookmark-search-dropdown.show{ display:block; }
    .bookmark-search-dropdown input{
      width:100%;
      border:1px solid #e0e0e0;border-radius:4px;
      padding:8px 12px;font-size:13px;
      transition:all .3s ease;
      box-sizing:border-box;
    }
    .bookmark-search-dropdown input:focus{
      border-color:var(--primary);
      box-shadow:0 0 0 2px var(--primary-soft);
      outline:none;
    }
    .bookmark-search-dropdown input::placeholder{ color:#999; }

    body.dark-theme .bookmark-search-dropdown{
      background-color:#323642;border-color:#444;
      box-shadow:0 4px 12px rgba(0,0,0,.3);
    }
    body.dark-theme .bookmark-search-dropdown input{
      background-color:var(--dark-surface);
      color:var(--dark-text);
      border-color:#444;
    }
    body.dark-theme .bookmark-search-dropdown input::placeholder{ color:#888; }

    /* ========= Tooltip（悬浮提示） ========= */
    @media (hover:hover) and (pointer:fine){
      .has-tooltip{ position:relative; }
      .has-tooltip::after{
        content:attr(data-tooltip);
        position:absolute;
        background:rgba(0,0,0,.75);
        color:#fff;padding:6px 10px;border-radius:4px;
        font-size:12px;pointer-events:none;
        opacity:0;transition:opacity .3s;
        white-space:nowrap;z-index:1000;
      }
      .has-tooltip::before{
        content:"";position:absolute;
        border:6px solid transparent;
        opacity:0;transition:opacity .3s;z-index:1000;
      }
      .has-tooltip:hover::after,.has-tooltip:hover::before{ opacity:1; }
      .tooltip-bottom::after{
        top:100%;left:50%;
        margin-top:12px;transform:translateX(-50%);
      }
      .tooltip-bottom::before{
        top:100%;left:50%;
        transform:translateX(-50%);
        border-bottom-color:rgba(0,0,0,.75);
      }
      .tooltip-green::after{ background:var(--primary);color:#fff; }
      .tooltip-green::before{ border-bottom-color:var(--primary); }

      body.dark-theme .has-tooltip::after{ background:rgba(151,151,151,.9);color:#eee; }
      body.dark-theme .has-tooltip::before{ border-bottom-color:rgba(151,151,151,.9); }
      body.dark-theme .tooltip-green::after{ background:var(--dark-primary);color:#fff; }
      body.dark-theme .tooltip-green::before{ border-bottom-color:var(--dark-primary); }
    }

    /* ========= 主体内容 ========= */
    .content{
      margin-top:210px;padding:10px;
      max-width:1600px;margin-left:auto;margin-right:auto;
      transition:opacity .3s ease;
    }
    .loading .content{ opacity:.6; }

    /* ========= 搜索栏 ========= */
    .search-container{ margin-top:10px;display:flex;flex-direction:column;align-items:center;width:100%; }
    .search-bar{
      display:flex;justify-content:center;
      margin-bottom:10px;width:100%;max-width:600px;
      margin-left:auto;margin-right:auto;
      border-radius:8px;overflow:hidden;
      box-shadow:0 2px 8px rgba(0,0,0,.05);
      border:1px solid #e0e0e0;
      transition:all .3s ease;
    }
    .search-bar:focus-within{ box-shadow:0 3px 12px rgba(0,0,0,.1);border-color:var(--primary); }
    .search-bar select{
      border:none;
      background:var(--bg);
      padding:10px 15px;
      font-size:14px;
      color:var(--primary);
      width:120px;
      outline:none;
      appearance:none;
      background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="currentColor" d="M0 0l6 6 6-6z"/></svg>');
      background-repeat:no-repeat;
      background-position:right 10px center;
      cursor:pointer;transition:all .3s ease;
      border-radius:0;
    }
    select option{
      background:#fff;color:#333;padding:10px;font-size:14px;
      white-space:nowrap;overflow:visible;
    }
    .search-bar input{
      flex:1;border:none;padding:10px 15px;font-size:14px;
      background:#fff;outline:none;
    }
    .search-bar button{
      border:none;background:var(--primary);
      color:#fff;padding:0 20px;cursor:pointer;
      transition:background-color .3s;
    }
    .search-bar button svg{ width:18px;height:18px;stroke:currentColor;fill:none;display:block; }
    .search-bar button:hover{ background:var(--primary-hover); }

    body.dark-theme .search-bar{ border-color:#323642;background:#1e2128; }
    body.dark-theme .search-bar select{
      background-color:var(--dark-surface);
      color:var(--dark-primary);
      background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6"><path fill="%235d7fb9" d="M0 0l6 6 6-6z"/></svg>');
    }
    body.dark-theme .search-bar input{ background-color:var(--dark-surface);color:var(--dark-text); }
    body.dark-theme .search-bar button{ background-color:var(--dark-primary); }
    body.dark-theme select option{ background-color:var(--dark-surface);color:var(--dark-text); }

    /* ========= 分类快捷按钮 ========= */
    .category-buttons-container{
      display:flex;flex-wrap:wrap;
      justify-content:center;gap:6px;
      padding:8px 12px;width:100%;
      max-width:1200px;margin:5px auto 0;
      background:transparent;border-radius:8px;
      box-shadow:none;transition:all .3s ease;
      position:relative;
    }
    .category-button{
      padding:5px 10px;border-radius:15px;
      background:#f9fafb;color:var(--primary);
      border:none;cursor:pointer;
      font-size:12px;font-weight:500;
      transition:all .2s ease;
      box-shadow:0 2px 4px rgba(0,0,0,.08);
      flex:0 0 auto;white-space:nowrap;
      margin:0 2px;
      position:relative;overflow:hidden;
    }
    .category-button:hover{
      background:var(--primary);color:#fff;
      transform:translateY(-1px);
      box-shadow:0 3px 5px rgba(0,0,0,.12);
    }
    .category-button.active{
      background:var(--primary);color:#fff;
      box-shadow:0 2px 5px rgba(0,0,0,.12);
      transform:translateY(-1px);
      font-weight:600;
      border-bottom:2px solid var(--primary-hover);
    }
    body.dark-theme .category-button{
      background:#2a2e38;color:var(--dark-primary);
      box-shadow:0 2px 4px rgba(0,0,0,.2);
    }
    body.dark-theme .category-button:hover,
    body.dark-theme .category-button.active{
      background:var(--dark-primary);color:#fff;
      border-bottom-color:var(--dark-primary-hover);
    }

    /* ========= 管理按钮（右侧圆形） ========= */
    .add-remove-controls{
      display:none;
      position:fixed;
      right:20px;
      top:180px; /* 避开顶部固定栏，确保第一个按钮完全可见 */
      transform:none;
      z-index:900;
      background:rgba(241,245,249,.95); /* 后台常用浅灰色调 */
      border:1px solid rgba(148,163,184,.6);
      border-radius:14px;
      padding:12px;
      box-shadow:0 8px 24px rgba(0,0,0,.12);
      backdrop-filter:blur(6px);
      flex-direction:column;
      align-items:flex-start;
      gap:10px;
      max-height:calc(100vh - 220px);
      overflow:auto;
    }
    body.dark-theme .add-remove-controls{
      background:rgba(30,41,59,.92);
      border-color:rgba(71,85,105,.65);
      box-shadow:0 10px 28px rgba(0,0,0,.35);
    }
    .admin-panel-title{
      font-size:13px;
      font-weight:700;
      color:#334155;
      letter-spacing:.5px;
      margin:2px 0 6px 2px;
    }
    body.dark-theme .admin-panel-title{ color:#cbd5e1; }
    .admin-action{
      display:flex;
      align-items:center;
      gap:10px;
    }
    .admin-label{
      font-size:13px;
      font-weight:600;
      color:#1f2937;
      white-space:nowrap;
      line-height:1.2;
    }
    body.dark-theme .admin-label{ color:#e5e7eb; }
.round-btn{
      background:var(--primary);
      color:#fff;border:none;border-radius:50%;
      width:40px;height:40px;
      display:flex;align-items:center;justify-content:center;
      font-size:22px;cursor:pointer;
      box-shadow:0 3px 10px rgba(0,0,0,.15);
      transition:all .3s ease;
      position:relative;
    }
    .round-btn:hover{
      transform:translateY(-3px);
      box-shadow:0 5px 15px rgba(0,0,0,.2);
    }
    body.dark-theme .round-btn{ background:var(--dark-primary); }
    .round-btn svg{ pointer-events:none;display:block;margin:auto; }

    /* 按钮顺序 */
    .add-btn{ order:1; }
    .remove-btn{ order:2; }
    .category-add-btn{ order:3; }
    .category-manage-btn{ order:4; }
    .export-btn{ order:5; }
    .import-btn{ order:6; }

    
    .ai-btn{
      background:var(--primary);
      color:#fff;
      border:none;
      border-radius:6px;
      padding:6px 10px;
      font-size:12px;
      cursor:pointer;
      white-space:nowrap;
    }
    .ai-btn:hover{
      background:var(--primary-hover);
    }

    /* ========= 分类区 & 卡片 ========= */
    .section{ margin-bottom:25px;padding:0 15px; }
    .section-title-container{
      display:flex;align-items:center;
      margin-bottom:18px;
      border-bottom:1px solid #e0e0e0;
      padding-bottom:10px;
      width:100%;max-width:1520px;
      margin-left:auto;margin-right:auto;
      transition:border-color .3s ease;
    }
    body.dark-theme .section-title-container{ border-bottom-color:var(--dark-border); }
    .section-title{
      font-size:22px;font-weight:600;
      color:var(--text);
      position:relative;padding-left:15px;
      transition:color .3s ease;
      min-width:120px;
    }
    body.dark-theme .section-title{ color:var(--dark-text); }
    .section-title:before{
      content:'';position:absolute;
      left:0;top:50%;
      transform:translateY(-50%);
      width:5px;height:22px;
      background:var(--primary);
      border-radius:2px;
    }
    body.dark-theme .section-title:before{ background:var(--dark-primary); }

    .card-container{
      display:grid;
      grid-template-columns:repeat(auto-fit,150px);
      column-gap:35px;row-gap:15px;
      justify-content:start;
      padding:15px 15px 15px 45px;
      margin:0 auto;max-width:1600px;
    }
    .card{
      background:#fff;border-radius:8px;
      padding:12px;width:150px;
      box-shadow:0 3px 10px rgba(0,0,0,.06);
      cursor:pointer;transition:all .3s ease;
      position:relative;user-select:none;
      border-left:3px solid var(--primary);
      animation:fadeIn .3s ease forwards;
      animation-delay:calc(var(--card-index) * .05s);
      opacity:0;margin:2px;
    }
    body.dark-theme .card{
      background:var(--dark-card);
      border-left-color:var(--dark-primary);
      box-shadow:0 4px 12px rgba(0,0,0,.2);
    }
    @keyframes fadeIn{ from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
    .card:hover{ transform:translateY(-5px);box-shadow:0 8px 15px rgba(0,0,0,.08); }

    .card-top{ display:flex;align-items:center;margin-bottom:5px; }
    .card-icon{ width:16px;height:16px;margin-right:5px; }
    .card-title{
      font-size:15px;font-weight:600;
      color:var(--text);
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      transition:color .3s ease;
    }
    .card-desc{
      font-size:12px;
      color:var(--muted);
      margin-bottom:4px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .card-url{
      display:none;

      font-size:12px;color:var(--muted);
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      transition:color .3s ease;
    }
    body.dark-theme .card-title{ color:var(--dark-text); }
    body.dark-theme .card-url{
      display:none;
 color:var(--dark-muted); }

    .private-tag{
      background:#ff9800;color:#fff;
      font-size:10px;padding:2px 5px;border-radius:3px;
      position:absolute;top:18px;right:5px;z-index:5;
    }

    /* 卡片描述提示框（鼠标跟随） */
    #custom-tooltip{
      position:absolute;display:none;z-index:700;
      background:var(--primary);color:#fff;
      padding:6px 10px;border-radius:5px;font-size:12px;
      pointer-events:none;max-width:300px;white-space:pre-wrap;
      box-shadow:0 2px 10px rgba(0,0,0,.2);
      transition:opacity .2s ease;
    }
    body.dark-theme #custom-tooltip{ background:var(--dark-primary); }

    /* 卡片按钮（编辑/删除） */
    .card-actions{
      position:absolute;top:-12px;right:-12px;
      display:flex;align-items:center;justify-content:center;
      gap:4px;z-index:15;height:24px;
    }
    .card-btn{
      position:relative;z-index:1;
      width:24px;height:24px;border:none;border-radius:50%;
      background:var(--primary);color:#fff;
      font-size:12px;cursor:pointer;
      display:none;align-items:center;justify-content:center;
      transition:transform .2s, opacity .2s, box-shadow .2s;
      padding:0;margin:0;
      box-shadow:0 2px 4px rgba(0,0,0,.2);
      flex-shrink:0;vertical-align:top;
    }
    .card-btn:hover{ z-index:2;transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,.3); }
    .card-btn svg{ width:14px;height:14px;stroke:currentColor;fill:none;display:block;margin:auto; }
    .delete-btn{ background:var(--danger); }
    body.dark-theme .edit-btn{ background:var(--dark-primary); }
    body.dark-theme .delete-btn{ background:var(--danger); }

    @media (hover:hover) and (pointer:fine){
      .card:hover{ transform:scale(1.05);box-shadow:0 10px 10px rgba(0,0,0,.3); }
      .card.no-hover:hover{ transform:none !important;box-shadow:0 5px 5px rgba(0,0,0,.2) !important; }
      body.dark-theme .card.no-hover:hover{ transform:none !important;box-shadow:0 5px 5px rgba(0,0,0,.2) !important; }
    }

    /* ========= 分类管理按钮 ========= */
    .edit-category-btn,.move-category-btn,.delete-category-btn{
      border:none;padding:4px 8px;margin-left:8px;
      border-radius:4px;font-size:12px;cursor:pointer;
      transition:all .2s;display:none;
      color:#fff;
    }
    .edit-category-btn{ background:var(--primary); }
    .edit-category-btn:hover{ background:var(--primary-hover); }
    .move-category-btn{
      background:var(--dark-primary);
      padding:4px 6px;min-width:28px;
      display:inline-flex;align-items:center;justify-content:center;
    }
    .move-category-btn:hover{ background:var(--dark-primary-hover); }
    .move-category-btn svg{ width:16px;height:16px;fill:#fff; }
    .delete-category-btn{ background:var(--danger); }
    .delete-category-btn:hover{ background:var(--danger-hover); }

    body.dark-theme .edit-category-btn{ background:var(--dark-primary); }
    body.dark-theme .edit-category-btn:hover{ background:var(--dark-primary-hover); }
    body.dark-theme .move-category-btn{ background:var(--primary); }
    body.dark-theme .move-category-btn:hover{ background:var(--primary-hover); }
    body.dark-theme .delete-category-btn{ background:var(--danger); }
    body.dark-theme .delete-category-btn:hover{ background:var(--danger-hover); }

    .category-manage-btn.active{ background:var(--danger); }
    .category-manage-btn.active:hover{ background:var(--danger-hover); }

    /* ========= 浮动按钮 ========= */
    .floating-button-group{
      position:fixed;bottom:50px;right:20px;
      display:flex;flex-direction:column;gap:15px;
      z-index:1000;
    }
    .floating-button-group button{
      width:40px;height:40px;border-radius:50%;
      font-size:20px;display:flex;align-items:center;justify-content:center;
      background:var(--primary);color:#fff;border:none;
      cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.2);
      transition:all .2s ease;
    }
    .floating-button-group button:hover{ transform:translateY(-2px);background:var(--primary-hover); }
    #back-to-top-btn{ display:none; }
    body.dark-theme .floating-button-group button{ background:var(--dark-primary); }
    body.dark-theme .floating-button-group button:hover{ background:var(--dark-primary-hover); }
    #theme-toggle{ font-size:24px;line-height:40px; }
    #theme-toggle svg{ width:22px;height:22px;stroke:currentColor;fill:none;display:block; }

    /* ========= 对话框/弹窗 ========= */
    #dialog-overlay{
      display:none;position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,.6);
      justify-content:center;align-items:center;
      z-index:2000;backdrop-filter:blur(3px);
    }
    #dialog-box{
      background:#fff;padding:25px;border-radius:10px;width:350px;
      box-shadow:0 10px 30px rgba(0,0,0,.15);
      animation:dialogFadeIn .3s ease;
    }
    @keyframes dialogFadeIn{ from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
    #dialog-box input,#dialog-box select{
      width:100%;margin-bottom:15px;padding:10px;
      border:1px solid #e0e0e0;border-radius:5px;
      font-size:14px;transition:all .3s ease;box-sizing:border-box;
    }
    #dialog-box input:focus,#dialog-box select:focus{
      border-color:var(--primary);
      box-shadow:0 0 0 2px var(--primary-soft);
      outline:none;
    }
    #dialog-box label{ display:block;margin-bottom:5px;font-weight:500;color:var(--text); }
    #dialog-box button{
      background:var(--primary);color:#fff;border:none;
      padding:10px 15px;border-radius:5px;cursor:pointer;
      transition:all .3s ease;margin-right:10px;
    }
    #dialog-box button:hover{ background:var(--primary-hover); }
    #dialog-box button.cancel{ background:#f0f0f0;color:#333; }
    #dialog-box button.cancel:hover{ background:#e0e0e0; }

    body.dark-theme #dialog-box{ background:var(--dark-surface);color:var(--dark-text); }
    body.dark-theme #dialog-box input,body.dark-theme #dialog-box select{
      background:#323642;color:var(--dark-text);border-color:#444;
    }
    body.dark-theme #dialog-box label{ color:#a0b7d4; }

    /* 登录弹窗 */
    .login-modal{
      display:none;position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,.6);justify-content:center;align-items:center;
      z-index:2000;backdrop-filter:blur(3px);
    }
    .login-modal-content{
      background:#fff;padding:25px;border-radius:10px;width:300px;
      box-shadow:0 10px 30px rgba(0,0,0,.15);
      animation:modalFadeIn .3s ease;
    }
    @keyframes modalFadeIn{ from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
    .login-modal h3{ margin:0 0 20px;color:#333;text-align:center;font-size:18px; }
    .login-modal input{
      width:100%;margin-bottom:15px;padding:10px;
      border:1px solid #e0e0e0;border-radius:5px;
      font-size:14px;transition:all .3s ease;box-sizing:border-box;
    }
    .login-modal input:focus{
      border-color:var(--primary);
      box-shadow:0 0 0 2px var(--primary-soft);
      outline:none;
    }
    .login-modal-buttons{ display:flex;gap:10px;justify-content:flex-end; }
    .login-modal button{
      background:var(--primary);color:#fff;border:none;
      padding:10px 15px;border-radius:5px;cursor:pointer;
      transition:all .3s ease;font-size:13px;
    }
    .login-modal button:hover{ background:var(--primary-hover); }
    .login-modal button.cancel{ background:#f0f0f0;color:#333; }
    .login-modal button.cancel:hover{ background:#e0e0e0; }

    body.dark-theme .login-modal-content{ background:var(--dark-surface);color:var(--dark-text); }
    body.dark-theme .login-modal h3{ color:var(--dark-text); }
    body.dark-theme .login-modal input{ background:#323642;color:var(--dark-text);border-color:#444; }

    /* 自定义 alert/confirm */
    .dialog-overlay{
      display:none;position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
      justify-content:center;align-items:center;
      z-index:1000;animation:fadeIn .3s ease;
    }
    .dialog-box{
      background:#fff;padding:24px;border-radius:12px;width:340px;
      box-shadow:0 10px 25px rgba(0,0,0,.1);
      transform:translateY(-20px);
      animation:slideUp .3s ease forwards;
    }
    .dialog-title{ margin:0 0 15px;font-size:18px;color:#333; }
    .dialog-content{ padding:15px 0;margin-bottom:16px;font-size:16px;line-height:1.5;color:#333; }
    .dialog-box input[type="text"]{
      width:100%;margin-bottom:16px;padding:10px 12px;
      border:1px solid #e0e0e0;border-radius:8px;
      font-size:14px;transition:all .2s;box-sizing:border-box;
      background:#fff !important;
    }
    .dialog-box input[type="text"]:focus{
      border-color:var(--primary-hover) !important;
      outline:none;
      box-shadow:0 0 0 3px var(--primary-soft);
    }
    .dialog-buttons{ display:flex;justify-content:flex-end;gap:10px; }
    .dialog-box button{
      padding:8px 16px;border-radius:6px;border:none;
      font-size:14px;cursor:pointer;transition:all .2s;
    }
    .dialog-confirm-btn{ background:var(--primary);color:#fff; }
    .dialog-confirm-btn:hover{ background:var(--primary-hover); }
    .dialog-cancel-btn{ background:#f0f0f0;color:#555; }
    .dialog-cancel-btn:hover{ background:#e0e0e0; }
    .top-z-index{ z-index:9999; }
    @keyframes fadeIn{ from{opacity:0;} to{opacity:1;} }
    @keyframes slideUp{ from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }

    body.dark-theme .dialog-box{ background:#2d3748;box-shadow:0 10px 25px rgba(0,0,0,.3); }
    body.dark-theme .dialog-title, body.dark-theme .dialog-content{ color:#f8f9fa; }
    body.dark-theme .dialog-box input[type="text"]{
      background:#3c4658 !important;color:var(--dark-text) !important;border-color:#4a5568 !important;
    }
    body.dark-theme .dialog-box input[type="text"]:focus{
      border-color:var(--dark-primary) !important;
      box-shadow:0 0 0 3px rgba(93,127,185,.3);
    }
    body.dark-theme .dialog-cancel-btn{ background:#4a5568;color:var(--dark-text); }
    body.dark-theme .dialog-cancel-btn:hover{ background:#3c4658; }
    body.dark-theme .dialog-confirm-btn{ background:var(--dark-primary); }
    body.dark-theme .dialog-confirm-btn:hover{ background:var(--dark-primary-hover); }

    /* 加载遮罩 */
    #loading-mask{
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
      z-index:7000;display:flex;align-items:center;justify-content:center;
    }
    .loading-content{
      background:#fff;padding:20px 40px;border-radius:10px;
      text-align:center;box-shadow:0 0 10px #0003;
      font-size:16px;color:#333;
    }
    .spinner{
      width:40px;height:40px;border:4px solid #ccc;
      border-top-color:var(--primary);border-radius:50%;
      margin:0 auto 10px;animation:spin 1s linear infinite;
    }
    @keyframes spin{ to{ transform:rotate(360deg);} }
    body.dark-theme .loading-content{ background:#2d3748;color:#f8f9fa; }

    /* 搜索结果 */
    .search-results-section{ margin-bottom:30px; }
    .search-results-header{
      display:flex;justify-content:space-between;align-items:center;
      margin-bottom:20px;padding:15px;background:#f8f9fa;
      border-radius:8px;border-left:4px solid var(--primary);
    }
    body.dark-theme .search-results-header{
      background:#2d3748;border-left-color:var(--dark-primary);
    }
    .search-results-title{ font-size:18px;font-weight:bold;color:#333; }
    body.dark-theme .search-results-title{ color:#e2e8f0; }
    .back-to-main{
      background:var(--primary);color:#fff;border:none;border-radius:4px;
      padding:8px 16px;cursor:pointer;font-size:14px;transition:all .3s ease;
    }
    .back-to-main:hover{ background:var(--primary-hover); }
    body.dark-theme .back-to-main{ background:var(--dark-primary); }
    body.dark-theme .back-to-main:hover{ background:var(--dark-primary-hover); }
    .no-search-results{ text-align:center;padding:30px;color:var(--muted);font-size:16px; }
    body.dark-theme .no-search-results{ color:var(--dark-muted); }

    /* 移动端 */
    @media (max-width:480px){
      .fixed-elements{ padding:8px 12px 5px;height:auto;min-height:130px; }
      .content{ margin-top:150px;margin-bottom:100px;padding:15px; }
      .center-content{ position:static;transform:none;width:100%;padding:0 8px; }
      .search-container{ margin-top:15px; }
      .search-bar{ flex-wrap:nowrap;max-width:320px;width:90%;margin:6px auto 8px; }
      .search-bar select{ width:80px;flex:0 0 auto;font-size:12px; }
      .category-buttons-container{
        width:100%;max-width:none;padding:6px;overflow-x:auto;flex-wrap:nowrap;
        justify-content:flex-start;margin:8px auto 5px;gap:4px;
        scrollbar-width:none;-ms-overflow-style:none;
      }
      .category-button{ padding:4px 8px;font-size:11px;margin:0 1px; }
      .card-container{
        grid-template-columns:repeat(2,minmax(140px,1fr));
        column-gap:20px;row-gap:10px;justify-content:center;padding:12px;margin:0 auto;
      }
      .card{ width:auto;max-width:100%;padding:12px;margin:0;border-radius:8px; }
      .card-title{ font-size:13px;max-width:100%; }
      .card-desc{
      font-size:12px;
      color:var(--muted);
      margin-bottom:4px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .card-url{
      display:none;
 font-size:11px;max-width:100%; }
      .add-remove-controls{ right:10px;bottom:120px;top:auto;transform:none;gap:10px;padding:10px;max-height:calc(100vh - 260px); }
      .admin-label{ font-size:12px;max-width:160px;white-space:normal; }
      .admin-panel-title{ font-size:12px; }
      .round-btn{ width:36px;height:36px;font-size:20px; }
      .floating-button-group{ bottom:20px;right:10px; }
      .floating-button-group button{ width:36px;height:36px;font-size:18px; }
      #dialog-box{ width:90%;max-width:350px;padding:20px; }
      .section-title{ font-size:20px;min-width:100px; }
    }
  
/* ===== 后台操作面板修正（固定不随页面滚动） ===== */
.add-remove-controls{
  position: fixed !important;
  right: 20px;
  top: 200px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  z-index: 2000;
}


/* ===== 描述输入框 + AI 按钮对齐修正 ===== */
.desc-ai-row{
  display:flex;
  align-items:stretch;
  gap:6px;
}
.desc-ai-row input{
  flex:1;
}
.desc-ai-row .ai-btn{
  height:40px;
  display:flex;
  align-items:center;
  justify-content:center;
}


/* ===== 后台操作面板：边缘拉出模式 ===== */
.add-remove-controls{
  position: fixed !important;
  top: 180px;
  right: -280px;          /* 默认完全隐藏 */
  width: 260px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  z-index: 2000;
  transition: right .25s ease;
}
.add-remove-controls.open{
  right: 20px;
}

/* 右侧边缘拉出按钮 */
.admin-panel-handle{
  position: fixed;
  right: 0;
  top: 55%;
  transform: translateY(-50%);
  width: 18px;
  height: 84px;
  border-radius: 10px 0 0 10px;
  background: var(--primary);
  cursor: pointer;
  z-index: 2100;
  box-shadow: 0 6px 18px rgba(0,0,0,.22);
  opacity: .92;
  display:flex;
  align-items:center;
  justify-content:center;
}
.admin-panel-handle::after{
  content:"";
  width:12px;
  height:12px;
  background-repeat:no-repeat;
  background-position:center;
  background-size:12px 12px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 6l6 6-6 6'/%3E%3C/svg%3E");
}
body.dark-theme .admin-panel-handle{
  background: var(--dark-primary);
  box-shadow: 0 8px 22px rgba(0,0,0,.35);
}


/* ===== 侧边后台菜单提示：点我②（闪烁） ===== */
@keyframes tapMeBlink {
  0%   { opacity: .25; }
  50%  { opacity: 1; }
  100% { opacity: .25; }
}

.admin-panel-hint {
  position: fixed;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 6px;
  animation: tapMeBlink 1.2s ease-in-out infinite;
  pointer-events: none;
  white-space: nowrap;
  z-index: 3000;
}

.admin-panel-hint{
  background:#111;
  color:#fff;
}
body.dark-theme .admin-panel-hint{
  background:#fff;
  color:#111;
}
</style>
</head>
<body>
  <div class="fixed-elements">
    <div id="site-title" style="text-align:center;font-size:24px;font-weight:700;cursor:pointer;">我的导航</div>
    <div id="site-datetime" style="text-align:center;font-size:13px;color:var(--muted);margin-top:6px;"></div>

    <div class="center-content">
      <!-- 搜索栏 -->
      <div class="search-container">
        <div class="search-bar">
          <select id="search-engine-select">
            <option value="baidu">百度</option>
            <option value="bing">必应</option>
            <option value="google">谷歌</option>
            <option value="duckduckgo">DuckDuckGo</option>
          </select>
          <input type="text" id="search-input" placeholder="搜索..." />
          <button id="search-button" aria-label="搜索"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg></button>
        </div>
      </div>

      <div id="category-buttons-container" class="category-buttons-container"></div>
    </div>

    <!-- 右上角控制区域 -->
    <div class="top-right-controls">
      <button class="admin-btn" id="admin-btn" onclick="toggleAdminMode()" style="display:none;">设置①</button>
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
    <!-- 管理控制按钮 -->
    <div class="add-remove-controls">
      <div class="admin-panel-title">后台操作</div>
      <div class="admin-action">
        <button class="round-btn" onclick="editSiteTitle()" title="修改站点名称">
          <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 42h36" stroke="white" stroke-width="4"/>
            <path d="M14 34l20-20 6 6-20 20H14v-6z" stroke="white" stroke-width="4" fill="none"/>
          </svg>
        </button>
        <span class="admin-label">0.修改站点名称</span>
      </div>


      <div class="admin-action">
        <button class="round-btn remove-btn" onclick="toggleRemoveMode()" title="编辑链接">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 26v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M14 26.72V34h7.32L42 13.31 34.7 6 14 26.72Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
        <span class="admin-label">1.编辑链接（开启/关闭编辑按钮）</span>
      </div>

      <div class="admin-action">
        <button class="round-btn add-btn" onclick="showAddDialog()" title="添加链接">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 6H8a2 2 0 0 0-2 2v8M16 42H8a2 2 0 0 1-2-2v-8M32 42h8a2 2 0 0 0 2-2v-8M32 6h8a2 2 0 0 1 2 2v8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M32 24H16M24 16v16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
        <span class="admin-label">2.添加链接</span>
      </div>

      <div class="admin-action">
        <button class="round-btn category-add-btn" onclick="addCategory()" title="添加分类">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8c0-1.1.9-2 2-2h12l5 6h17c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
          <path d="M18 27h12M24 21v12" stroke="white" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </button>
        <span class="admin-label">3.添加分类</span>
      </div>

      <div class="admin-action">
        <button class="round-btn category-manage-btn" onclick="toggleEditCategory()" title="编辑分类">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8c0-1.1.9-2 2-2h12l5 6h17c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8Z" stroke="white" stroke-width="4" stroke-linejoin="round" fill="none"/>
          <circle cx="24" cy="28" r="4" stroke="white" stroke-width="4" fill="none"/>
          <path d="M24 21v3m0 8v3m4.8-12-2.1 2.1M20.8 31l-2.1 2.1M19 23l2.1 2.1M27 31l2.1 2.1M17 28h3M28 28h3" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
        <span class="admin-label">4.分类管理（改名/删除/上下移动）</span>
      </div>

      <div class="admin-action">
        <button class="round-btn export-btn" onclick="exportData()" title="导出数据">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 6v22" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <path d="M16 20l8 8 8-8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M10 38h28" stroke="white" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </button>
        <span class="admin-label">5.导出数据（备份 JSON）</span>
      </div>

      <div class="admin-action">
        <button class="round-btn import-btn" onclick="triggerImport()" title="导入数据">
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 42V20" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <path d="M16 28l8-8 8 8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M10 10h28" stroke="white" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </button>
        <span class="admin-label">6 导入数据（覆盖恢复）</span>
      </div>

      <input type="file" id="import-file" accept="application/json" style="display:none;" />
    </div>
<!-- 分类和卡片容器 -->
    <div id="sections-container"></div>

    <!-- 浮动按钮组 -->
    <div class="floating-button-group">
      <button id="back-to-top-btn" onclick="scrollToTop()" style="display:none;">
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24l12-12 12 12m-24 12 12-12 12 12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button id="theme-toggle" onclick="toggleTheme()" aria-label="切换主题"></button>
    </div>

    <!-- 添加/编辑链接对话框 -->
    <div id="dialog-overlay">
      <div id="dialog-box">
        <label for="name-input">名称</label>
        <input type="text" id="name-input" placeholder="必填" />
        <label for="url-input">地址</label>
        <input type="text" id="url-input" placeholder="必填" />
        <label for="tips-input">描述</label>
        
<div class="desc-ai-row">
  <input type="text" id="tips-input" placeholder="可选" style="flex:1;" />
  <button type="button" id="ai-generate-btn" class="ai-btn">AI</button>
</div>

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

    <!-- 登录弹窗 -->
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

    <!-- 自定义Alert对话框 -->
    <div class="dialog-overlay top-z-index" id="custom-alert-overlay" style="display:none;">
      <div class="dialog-box" id="custom-alert-box">
        <h3 class="dialog-title" id="custom-alert-title">提示</h3>
        <div class="dialog-content" id="custom-alert-content">这里是提示内容</div>
        <div class="dialog-buttons">
          <button class="dialog-confirm-btn" id="custom-alert-confirm">确定</button>
        </div>
      </div>
    </div>

    <!-- 自定义Confirm对话框 -->
    <div class="dialog-overlay top-z-index" id="custom-confirm-overlay" style="display:none;">
      <div class="dialog-box">
        <div class="dialog-content" id="custom-confirm-message"></div>
        <div class="dialog-buttons">
          <button id="custom-confirm-cancel" class="dialog-cancel-btn">取消</button>
          <button id="custom-confirm-ok" class="dialog-confirm-btn">确定</button>
        </div>
      </div>
    </div>

    <!-- 分类名称输入对话框 -->
    <div class="dialog-overlay" id="category-dialog" style="display:none;">
      <div class="dialog-box">
        <h3 id="category-dialog-title" class="dialog-title">新建分类</h3>
        <input type="text" id="category-name-input" class="category-dialog-input" placeholder="请输入分类名称" />
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
    /* ================= 搜索引擎 ================= */
    const searchEngines = {
      baidu: "https://www.baidu.com/s?wd=",
      bing: "https://www.bing.com/search?q=",
      google: "https://www.google.com/search?q=",
      duckduckgo: "https://duckduckgo.com/?q="
    };
    let currentEngine = "baidu";

    function logAction(action, details){
      try{
        const timestamp = new Date().toISOString();
        console.log(timestamp + ": " + action + " - " + JSON.stringify(details || {}));
      }catch(e){}
    }

    function setActiveEngine(engine){
      currentEngine = engine;
      document.getElementById("search-engine-select").value = engine;
      logAction("设置搜索引擎", { engine: engine });
    }

    document.getElementById("search-engine-select").addEventListener("change", function(){
      setActiveEngine(this.value);
    });

    document.getElementById("search-button").addEventListener("click", function(){
      const query = document.getElementById("search-input").value;
      if(query){
        logAction("执行搜索", { engine: currentEngine, query: query });
        window.open(searchEngines[currentEngine] + encodeURIComponent(query), "_blank");
      }
    });

    document.getElementById("search-input").addEventListener("keypress", function(e){
      if(e.key === "Enter"){
        document.getElementById("search-button").click();
      }
    });

    setActiveEngine(currentEngine);

    /* ================= 全局状态 ================= */
    let publicLinks = [];
    let privateLinks = [];
    let isAdmin = false;
    let isLoggedIn = false;
    let removeMode = false;
    let isEditCategoryMode = false;
    let isDarkTheme = false;

    /* ================= Theme (manual toggle + persist) ================= */
    const THEME_ICONS = {
      sun:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2.5"></circle>' +
        '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" ' +
          'stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path>' +
        '</svg>',
      moon:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" ' +
          'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '</svg>'
    };

    function updateThemeToggleIcon(){
      const btn = document.getElementById("theme-toggle");
      if(!btn) return;
      // In dark mode show "sun" (switch to light); in light show "moon" (switch to dark)
      btn.innerHTML = isDarkTheme ? THEME_ICONS.sun : THEME_ICONS.moon;
      const title = isDarkTheme ? "切换到浅色模式" : "切换到深色模式";
      btn.title = title;
      btn.setAttribute("aria-label", title);
    }

    function setTheme(isDark, persist){
      isDarkTheme = !!isDark;
      document.body.classList.toggle("dark-theme", isDarkTheme);
      updateThemeToggleIcon();
      if(persist){
        try{ localStorage.setItem("theme", isDarkTheme ? "dark" : "light"); }catch(e){}
      }
    }

    (function initTheme(){
      let saved = null;
      try{ saved = localStorage.getItem("theme"); }catch(e){}
      if(saved === "dark") setTheme(true, false);
      else if(saved === "light") setTheme(false, false);
      else {
        const prefersDark = !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setTheme(prefersDark, false);
      }
    })();
    let links = [];
    const categories = {};

    /* ================= 分类管理 ================= */
    async function addCategory(){
      if(!await validateToken()) return;
      const categoryName = await showCategoryDialog("请输入新分类名称");
      if(categoryName && !categories[categoryName]){
        categories[categoryName] = [];
        updateCategorySelect();
        renderSections();
        saveLinks();
        logAction("添加分类", { categoryName: categoryName, currentLinkCount: links.length });
      }else if(categories[categoryName]){
        await customAlert("该分类已存在", "添加分类");
        logAction("添加分类失败", { categoryName: categoryName, reason: "分类已存在" });
      }
    }

    async function deleteCategory(category){
      if(!await validateToken()) return;
      const message = '确定要删除 "' + category + '" 分类吗？这将删除该分类下的所有链接。';
      const confirmed = await customConfirm(message, "确定", "取消");
      if(confirmed){
        delete categories[category];
        links = links.filter(function(l){ return l.category !== category; });
        publicLinks = publicLinks.filter(function(l){ return l.category !== category; });
        privateLinks = privateLinks.filter(function(l){ return l.category !== category; });
        updateCategorySelect();
        renderSections();
        renderCategoryButtons();
        saveLinks();
        logAction("删除分类", { category: category });
      }
    }

    async function editCategoryName(oldName){
      if(!await validateToken()) return;
      const newName = await showCategoryDialog("请输入新的分类名称", oldName);
      if(!newName || newName === oldName) return;
      if(categories[newName]){
        await customAlert("该名称已存在，请重新命名", "编辑分类");
        return;
      }
      categories[newName] = categories[oldName];
      delete categories[oldName];

      publicLinks.concat(privateLinks).forEach(function(link){
        if(link.category === oldName) link.category = newName;
      });
      links.forEach(function(link){
        if(link.category === oldName) link.category = newName;
      });

      renderSections();
      renderCategoryButtons();
      updateCategorySelect();
      saveLinks();
      logAction("编辑分类名称", { oldName: oldName, newName: newName });
    }

    async function moveCategory(categoryName, direction){
      if(!await validateToken()) return;
      const keys = Object.keys(categories);
      const index = keys.indexOf(categoryName);
      if(index < 0) return;
      const newIndex = index + direction;
      if(newIndex < 0 || newIndex >= keys.length) return;

      const reordered = keys.slice();
      const tmp = reordered[index];
      reordered[index] = reordered[newIndex];
      reordered[newIndex] = tmp;

      const newCategories = {};
      reordered.forEach(function(k){ newCategories[k] = categories[k]; });
      Object.keys(categories).forEach(function(k){ delete categories[k]; });
      Object.assign(categories, newCategories);

      renderSections();
      renderCategoryButtons();
      updateCategorySelect();
      saveLinks();
      logAction("移动分类", { categoryName: categoryName, direction: direction });
    }

    function toggleEditCategory(){
      isEditCategoryMode = !isEditCategoryMode;

      document.querySelectorAll(".delete-category-btn").forEach(function(btn){
        btn.style.display = isEditCategoryMode ? "inline-block" : "none";
      });
      document.querySelectorAll(".edit-category-btn").forEach(function(btn){
        btn.style.display = isEditCategoryMode ? "inline-block" : "none";
      });
      document.querySelectorAll(".move-category-btn").forEach(function(btn){
        btn.style.display = isEditCategoryMode ? "inline-block" : "none";
      });

      const manageButton = document.querySelector(".category-manage-btn");
      if(manageButton){
        if(isEditCategoryMode) manageButton.classList.add("active");
        else manageButton.classList.remove("active");
      }
      logAction("切换分类编辑模式", { isEditCategoryMode: isEditCategoryMode });
    }

    /* ================= 分类快捷按钮 ================= */
    let isShowingSearchResults = false;

    function renderCategoryButtons(){
      if(isShowingSearchResults) return;
      const buttonsContainer = document.getElementById("category-buttons-container");
      buttonsContainer.innerHTML = "";

      const keys = Object.keys(categories);
      if(keys.length === 0){
        buttonsContainer.style.display = "none";
        return;
      }

      const displayedCategories = [];
      document.querySelectorAll("#sections-container .section-title").forEach(function(el){
        displayedCategories.push(el.textContent);
      });

      let visibleButtonsCount = 0;

      displayedCategories.forEach(function(category){
        const visibleLinks = links.filter(function(link){
          return link.category === category && (!link.isPrivate || isLoggedIn);
        });

        if(visibleLinks.length > 0){
          const button = document.createElement("button");
          button.className = "category-button";
          button.textContent = category;
          button.dataset.category = category;

          button.onclick = function(){
            if(isShowingSearchResults) hideSearchResults();
            document.querySelectorAll(".category-button").forEach(function(btn){ btn.classList.remove("active"); });
            button.classList.add("active");
            scrollToCategory(category);
          };

          buttonsContainer.appendChild(button);
          visibleButtonsCount++;
        }
      });

      buttonsContainer.style.display = visibleButtonsCount > 0 ? "flex" : "none";
      setTimeout(setActiveCategoryButtonByVisibility, 100);
    }

    function debounce(func, wait){
      let timeout;
      return function(){
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){ func.apply(context, args); }, wait);
      };
    }

    function setActiveCategoryButtonByVisibility(){
      if(isShowingSearchResults) return;
      const sections = document.querySelectorAll(".section");
      if(!sections.length) return;

      const viewportHeight = window.innerHeight;
      const fixedElementsHeight = 170;
      const viewportCenter = viewportHeight / 2 + fixedElementsHeight;

      let closestSection = null;
      let closestDistance = Infinity;

      sections.forEach(function(section){
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if(distance < closestDistance){
          closestDistance = distance;
          closestSection = section;
        }
      });

      if(closestSection){
        const cardContainer = closestSection.querySelector(".card-container");
        if(cardContainer && cardContainer.id){
          const categoryId = cardContainer.id;
          document.querySelectorAll(".category-button").forEach(function(btn){ btn.classList.remove("active"); });
          document.querySelectorAll(".category-button").forEach(function(btn){
            if(btn.dataset.category === categoryId) btn.classList.add("active");
          });
        }
      }
    }

    window.addEventListener("scroll", debounce(setActiveCategoryButtonByVisibility, 100));

    function scrollToCategory(category){
      const section = document.getElementById(category);
      if(!section) return;

      let offset = 230;
      if(window.innerWidth <= 480) offset = 120;

      const rect = section.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top - offset;

      window.scrollTo({ top: absoluteTop, behavior: "smooth" });
      logAction("滚动到分类", { category: category });
    }

    /* ================= 数据加载/保存 ================= */
    async function loadLinks(){
      const headers = { "Content-Type":"application/json" };
      if(isLoggedIn){
        const token = localStorage.getItem("authToken");
        if(token) headers["Authorization"] = token;
      }

      try{
        const response = await fetch("/api/getLinks?userId=testUser", { headers: headers });
        if(!response.ok) throw new Error("HTTP error " + response.status);

        const data = await response.json();

        if(data.categories) Object.assign(categories, data.categories);

        publicLinks = data.links ? data.links.filter(function(l){ return !l.isPrivate; }) : [];
        privateLinks = data.links ? data.links.filter(function(l){ return l.isPrivate; }) : [];
        links = isLoggedIn ? publicLinks.concat(privateLinks) : publicLinks;

        renderSections();
        updateCategorySelect();
        updateUIState();

        logAction("读取链接", {
          publicCount: publicLinks.length,
          privateCount: privateLinks.length,
          isLoggedIn: isLoggedIn,
          hasToken: !!localStorage.getItem("authToken")
        });
      }catch(e){
        console.error("加载链接失败，请刷新页面重试");
      }
    }

    async function saveLinks(){
      if(isAdmin && !(await validateToken())) return;

      const allLinks = publicLinks.concat(privateLinks);

      try{
        await fetch("/api/saveOrder", {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization": localStorage.getItem("authToken")
          },
          body: JSON.stringify({
            userId:"testUser",
            links: allLinks,
            categories: categories
          })
        });
        logAction("保存链接", { linkCount: allLinks.length, categoryCount: Object.keys(categories).length });
      }catch(e){
        logAction("保存链接失败", { error: "Save operation failed" });
        console.error("保存链接失败，请重试");
      }
    }

    function updateUIState(){
      const addRemoveControls = document.querySelector(".add-remove-controls");
      addRemoveControls.style.display = isAdmin ? "flex" : "none";
      updateLoginButton();
      logAction("更新UI状态", { isAdmin: isAdmin, isLoggedIn: isLoggedIn });
    }

    /* ================= 渲染 ================= */
    function renderSections(){
      const container = document.getElementById("sections-container");
      container.innerHTML = "";

      Object.keys(categories).forEach(function(category){
        const section = document.createElement("div");
        section.className = "section";

        const titleContainer = document.createElement("div");
        titleContainer.className = "section-title-container";

        const title = document.createElement("div");
        title.className = "section-title";
        title.textContent = category;
        titleContainer.appendChild(title);

        if(isAdmin){
          const editBtn = document.createElement("button");
          editBtn.textContent = "编辑名称";
          editBtn.className = "edit-category-btn";
          editBtn.style.display = isEditCategoryMode ? "inline-block" : "none";
          editBtn.onclick = function(){ editCategoryName(category); };
          titleContainer.appendChild(editBtn);

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "删除分类";
          deleteBtn.className = "delete-category-btn";
          deleteBtn.style.display = isEditCategoryMode ? "inline-block" : "none";
          deleteBtn.onclick = function(){ deleteCategory(category); };
          titleContainer.appendChild(deleteBtn);

          const upBtn = document.createElement("button");
          upBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6l-6 6h4v6h4v-6h4z"/></svg>';
          upBtn.className = "move-category-btn";
          upBtn.style.display = isEditCategoryMode ? "inline-block" : "none";
          upBtn.onclick = function(){ moveCategory(category, -1); };
          titleContainer.appendChild(upBtn);

          const downBtn = document.createElement("button");
          downBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 18l6-6h-4v-6h-4v6h-4z"/></svg>';
          downBtn.className = "move-category-btn";
          downBtn.style.display = isEditCategoryMode ? "inline-block" : "none";
          downBtn.onclick = function(){ moveCategory(category, 1); };
          titleContainer.appendChild(downBtn);
        }

        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        cardContainer.id = category;

        section.appendChild(titleContainer);
        section.appendChild(cardContainer);

        let privateCount = 0;
        let linkCount = 0;

        links.forEach(function(link){
          if(link.category === category){
            if(link.isPrivate) privateCount++;
            linkCount++;
            createCard(link, cardContainer);
          }
        });

        if(privateCount < linkCount || isLoggedIn){
          container.appendChild(section);
        }
      });

      renderCategoryButtons();
      logAction("渲染分类和链接", { isAdmin: isAdmin, linkCount: links.length, categoryCount: Object.keys(categories).length });
    }

    function extractDomain(url){
      try{ return new URL(url).hostname; }catch(e){ return url; }
    }
    function isValidUrl(url){
      try{ new URL(url); return true; }catch(e){ return false; }
    }

    function createCard(link, container){
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("draggable", isAdmin);
      card.dataset.isPrivate = link.isPrivate;
      card.setAttribute("data-url", link.url);

      const cardIndex = container.children.length;
      card.style.setProperty("--card-index", cardIndex);

      const cardTop = document.createElement("div");
      cardTop.className = "card-top";

      const defaultIconSVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' +
        '</svg>';

      const icon = document.createElement("img");
      icon.className = "card-icon";
      icon.src = (!link.icon || typeof link.icon !== "string" || !link.icon.trim() || !isValidUrl(link.icon))
        ? "https://www.faviconextractor.com/favicon/" + extractDomain(link.url)
        : link.icon;
      icon.alt = "Website Icon";
      icon.onerror = function(){
        const svgBlob = new Blob([defaultIconSVG], { type:"image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);
        this.src = svgUrl;
        this.onload = function(){ URL.revokeObjectURL(svgUrl); };
      };

      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = link.name;

      cardTop.appendChild(icon);
      cardTop.appendChild(title);

      const descEl = document.createElement("div");
      descEl.className = "card-desc";
      if(link.tips){
        descEl.textContent = link.tips.length > 28 ? link.tips.slice(0,28)+"…" : link.tips;
      }
      const urlEl = document.createElement("div");
      urlEl.className = "card-url";
      urlEl.textContent = link.url;

      card.appendChild(cardTop);
      card.appendChild(descEl);

      if(link.isPrivate){
        const privateTag = document.createElement("div");
        privateTag.className = "private-tag";
        privateTag.textContent = "私密";
        card.appendChild(privateTag);
      }

      const correctedUrl = (link.url.startsWith("http://") || link.url.startsWith("https://")) ? link.url : "http://" + link.url;

      if(!isAdmin){
        card.addEventListener("click", function(){
          window.open(correctedUrl, "_blank");
          logAction("打开链接", { name: link.name, url: correctedUrl });
        });
      }

      const cardActions = document.createElement("div");
      cardActions.className = "card-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "card-btn edit-btn";
      editBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>' +
        '<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>' +
        '</svg>';
      editBtn.title = "编辑";
      editBtn.onclick = function(event){
        event.stopPropagation();
        showEditDialog(link);
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "card-btn delete-btn";
      deleteBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="3,6 5,6 21,6"></polyline>' +
        '<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>' +
        '<line x1="10" y1="11" x2="10" y2="17"></line>' +
        '<line x1="14" y1="11" x2="14" y2="17"></line>' +
        '</svg>';
      deleteBtn.title = "删除";
      deleteBtn.onclick = function(event){
        event.stopPropagation();
        removeCard(card);
      };

      cardActions.appendChild(editBtn);
      cardActions.appendChild(deleteBtn);
      card.appendChild(cardActions);

      card.addEventListener("mousemove", function(e){ handleTooltipMouseMove(e, link.tips, isAdmin); });
      card.addEventListener("mouseleave", handleTooltipMouseLeave);

      card.addEventListener("dragstart", dragStart);
      card.addEventListener("dragover", dragOver);
      card.addEventListener("dragend", dragEnd);
      card.addEventListener("drop", drop);
      card.addEventListener("touchstart", touchStart, { passive:false });

      if(isAdmin && removeMode){
        editBtn.style.display = "flex";
        deleteBtn.style.display = "flex";
      }

      if(isAdmin || (link.isPrivate && isLoggedIn) || !link.isPrivate){
        container.appendChild(card);
      }
    }

    function updateCategorySelect(){
      const categorySelect = document.getElementById("category-select");
      categorySelect.innerHTML = "";
      Object.keys(categories).forEach(function(category){
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      logAction("更新分类选择", { categoryCount: Object.keys(categories).length });
    }

    /* ================= 添加/删除/编辑卡片 ================= */
    let currentConfirmHandler = null;
    let currentCancelHandler = null;

    function showEditDialog(link){
      document.getElementById("dialog-overlay").style.display = "flex";
      document.getElementById("name-input").value = link.name;
      document.getElementById("url-input").value = link.url;
      document.getElementById("tips-input").value = link.tips || "";
      document.getElementById("icon-input").value = link.icon || "";
      document.getElementById("category-select").value = link.category;
      document.getElementById("private-checkbox").checked = !!link.isPrivate;

      const confirmBtn = document.getElementById("dialog-confirm-btn");
      const cancelBtn = document.getElementById("dialog-cancel-btn");

      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      if(currentConfirmHandler) confirmBtn.removeEventListener("click", currentConfirmHandler);
      if(currentCancelHandler) cancelBtn.removeEventListener("click", currentCancelHandler);

      currentConfirmHandler = async function(event){
        event.preventDefault();event.stopPropagation();
        await updateLink(link);
      };
      currentCancelHandler = function(event){
        event.preventDefault();event.stopPropagation();
        hideAddDialog();
      };

      confirmBtn.addEventListener("click", currentConfirmHandler);
      cancelBtn.addEventListener("click", currentCancelHandler);
      logAction("显示编辑链接对话框");
    }

    function showAddDialog(){
      document.getElementById("dialog-overlay").style.display = "flex";
      const nameInput = document.getElementById("name-input");
      nameInput.value = "";
      document.getElementById("url-input").value = "";
      document.getElementById("tips-input").value = "";
      document.getElementById("icon-input").value = "";
      document.getElementById("private-checkbox").checked = false;

      const confirmBtn = document.getElementById("dialog-confirm-btn");
      const cancelBtn = document.getElementById("dialog-cancel-btn");

      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      if(currentConfirmHandler) confirmBtn.removeEventListener("click", currentConfirmHandler);
      if(currentCancelHandler) cancelBtn.removeEventListener("click", currentCancelHandler);

      currentConfirmHandler = async function(event){
        event.preventDefault();event.stopPropagation();
        await addLink();
      };
      currentCancelHandler = function(event){
        event.preventDefault();event.stopPropagation();
        hideAddDialog();
      };

      confirmBtn.addEventListener("click", currentConfirmHandler);
      cancelBtn.addEventListener("click", currentCancelHandler);

      setTimeout(function(){ nameInput.focus(); }, 50);
      logAction("显示添加链接对话框");
    }

    function hideAddDialog(){
      document.getElementById("dialog-overlay").style.display = "none";

      const confirmBtn = document.getElementById("dialog-confirm-btn");
      const cancelBtn = document.getElementById("dialog-cancel-btn");

      if(currentConfirmHandler){
        confirmBtn.removeEventListener("click", currentConfirmHandler);
        currentConfirmHandler = null;
      }
      if(currentCancelHandler){
        cancelBtn.removeEventListener("click", currentCancelHandler);
        currentCancelHandler = null;
      }
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      logAction("隐藏添加链接对话框");
    }

    async function addLink(){
      if(!await validateToken()) return;

      const name = document.getElementById("name-input").value.trim();
      const url = document.getElementById("url-input").value.trim();
      const tips = document.getElementById("tips-input").value.trim();
      const icon = document.getElementById("icon-input").value.trim();
      const category = document.getElementById("category-select").value;
      const isPrivate = document.getElementById("private-checkbox").checked;

      if(!name || !url || !category){
        let errorMessage = "";
        if(!name && !url) errorMessage = "请输入名称和URL";
        else if(!name) errorMessage = "请输入名称";
        else if(!url) errorMessage = "请输入URL";
        await customAlert(errorMessage, "添加卡片");
        if(!name) document.getElementById("name-input").focus();
        else if(!url) document.getElementById("url-input").focus();
        return;
      }

      const normalizedUrl = url.toLowerCase();
      const allLinks = publicLinks.concat(privateLinks);
      const isUrlExists = allLinks.some(function(l){ return (l.url || "").toLowerCase() === normalizedUrl; });
      if(isUrlExists){
        await customAlert("该URL已存在，请勿重复添加", "添加卡片");
        document.getElementById("url-input").focus();
        return;
      }

      const newLink = { name: name, url: url, tips: tips, icon: icon, category: category, isPrivate: !!isPrivate };
      if(isPrivate) privateLinks.push(newLink);
      else publicLinks.push(newLink);

      links = isLoggedIn ? publicLinks.concat(privateLinks) : publicLinks;

      const container = document.getElementById(category);
      if(container) createCard(newLink, container);
      else { categories[category] = []; renderSections(); }

      await saveLinks();

      document.getElementById("name-input").value = "";
      document.getElementById("url-input").value = "";
      document.getElementById("tips-input").value = "";
      document.getElementById("icon-input").value = "";
      document.getElementById("private-checkbox").checked = false;

      hideAddDialog();
      logAction("添加卡片", { name: name, url: url, tips: tips, icon: icon, category: category, isPrivate: !!isPrivate });
    }

    async function updateLink(oldLink){
      if(!await validateToken()) return;

      const name = document.getElementById("name-input").value.trim();
      const url = document.getElementById("url-input").value.trim();
      const tips = document.getElementById("tips-input").value.trim();
      const icon = document.getElementById("icon-input").value.trim();
      const category = document.getElementById("category-select").value;
      const isPrivate = document.getElementById("private-checkbox").checked;

      if(!name || !url || !category){
        let errorMessage = "";
        if(!name && !url) errorMessage = "请输入名称和URL";
        else if(!name) errorMessage = "请输入名称";
        else if(!url) errorMessage = "请输入URL";
        await customAlert(errorMessage, "编辑卡片");
        if(!name) document.getElementById("name-input").focus();
        else if(!url) document.getElementById("url-input").focus();
        return;
      }

      const normalizedUrl = url.toLowerCase();
      const allLinks = publicLinks.concat(privateLinks);
      const isUrlExists = allLinks.some(function(l){
        return (l.url || "").toLowerCase() === normalizedUrl && l.url !== oldLink.url;
      });
      if(isUrlExists){
        await customAlert("该URL已存在，请勿重复添加", "编辑卡片");
        document.getElementById("url-input").focus();
        return;
      }

      const updatedLink = { name: name, url: url, tips: tips, icon: icon, category: category, isPrivate: !!isPrivate };

      try{
        const list = oldLink.isPrivate ? privateLinks : publicLinks;
        const index = list.findIndex(function(l){ return l.url === oldLink.url; });
        if(index !== -1) list[index] = updatedLink;

        links = isLoggedIn ? publicLinks.concat(privateLinks) : publicLinks;

        await saveLinks();
        renderSections();
        hideAddDialog();
        logAction("更新卡片", { oldUrl: oldLink.url, name: name, url: url, tips: tips, icon: icon, category: category, isPrivate: !!isPrivate });
      }catch(e){
        logAction("更新卡片失败", { error: "Update operation failed" });
        await customAlert("更新卡片失败，请重试", "编辑卡片");
      }
    }

    async function removeCard(card){
      if(!await validateToken()) return;

      const name = card.querySelector(".card-title").textContent;
      const url = card.getAttribute("data-url");
      const isPrivate = card.dataset.isPrivate === "true";

      const confirmed = await customConfirm('确定要删除 "' + name + '" 吗？', "确定", "取消");
      if(!confirmed) return;

      links = links.filter(function(link){ return link.url !== url; });
      if(isPrivate) privateLinks = privateLinks.filter(function(link){ return link.url !== url; });
      else publicLinks = publicLinks.filter(function(link){ return link.url !== url; });

      for(const key in categories){
        categories[key] = categories[key].filter(function(link){ return link.url !== url; });
      }

      card.remove();
      await saveLinks();
      logAction("删除卡片", { name: name, url: url, isPrivate: isPrivate });
    }

    function toggleRemoveMode(){
      removeMode = !removeMode;
      document.querySelectorAll(".edit-btn").forEach(function(btn){ btn.style.display = removeMode ? "flex" : "none"; });
      document.querySelectorAll(".delete-btn").forEach(function(btn){ btn.style.display = removeMode ? "flex" : "none"; });

      document.getElementById("custom-tooltip").style.display = "none";
      document.querySelectorAll(".card").forEach(function(card){
        if(removeMode) card.classList.add("no-hover");
        else card.classList.remove("no-hover");
      });

      logAction("切换编辑卡片模式", { removeMode: removeMode });
    }

    /* ================= 拖拽排序 ================= */
    let draggedCard = null;
    let touchStartX, touchStartY;

    function touchStart(event){
      if(!isAdmin) return;
      draggedCard = event.target.closest(".card");
      if(!draggedCard) return;

      event.preventDefault();
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      draggedCard.classList.add("dragging");
      document.addEventListener("touchmove", touchMove, { passive:false });
      document.addEventListener("touchend", touchEnd);
    }

    function touchMove(event){
      if(!draggedCard) return;
      event.preventDefault();

      const touch = event.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;

      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;
      draggedCard.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";

      const target = findCardUnderTouch(currentX, currentY);
      if(target && target !== draggedCard){
        const container = target.parentElement;
        const rect = target.getBoundingClientRect();
        if(currentX < rect.left + rect.width / 2) container.insertBefore(draggedCard, target);
        else container.insertBefore(draggedCard, target.nextSibling);
      }
    }

    function touchEnd(){
      if(!draggedCard) return;
      const card = draggedCard;
      const targetCategory = card.closest(".card-container").id;
      if(isAdmin && card){
        updateCardCategory(card, targetCategory);
        saveCardOrder().catch(function(){});
      }
      cleanupDragState();
    }

    function findCardUnderTouch(x, y){
      const cards = document.querySelectorAll(".card:not(.dragging)");
      return Array.prototype.slice.call(cards).find(function(card){
        const rect = card.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      });
    }

    function dragStart(event){
      if(!isAdmin){ event.preventDefault(); return; }
      draggedCard = event.target.closest(".card");
      if(!draggedCard) return;
      draggedCard.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      logAction("开始拖拽卡片", { name: draggedCard.querySelector(".card-title").textContent });
    }

    function dragOver(event){
      if(!isAdmin){ event.preventDefault(); return; }
      event.preventDefault();
      const target = event.target.closest(".card");
      if(target && target !== draggedCard){
        const container = target.parentElement;
        const mouseX = event.clientX;
        const rect = target.getBoundingClientRect();
        if(mouseX < rect.left + rect.width / 2) container.insertBefore(draggedCard, target);
        else container.insertBefore(draggedCard, target.nextSibling);
      }
    }

    function drop(event){
      if(!isAdmin){ event.preventDefault(); return; }
      event.preventDefault();
      const card = draggedCard;
      const targetCategory = event.target.closest(".card-container").id;

      validateToken().then(function(isValid){
        if(isValid && card){
          updateCardCategory(card, targetCategory);
          saveCardOrder().catch(function(){});
        }
        cleanupDragState();
      });
    }

    function dragEnd(){
      if(draggedCard){
        draggedCard.classList.remove("dragging");
        logAction("拖拽卡片结束");
      }
    }

    function cleanupDragState(){
      if(draggedCard){
        draggedCard.classList.remove("dragging");
        draggedCard.style.transform = "";
        draggedCard = null;
      }
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
      touchStartX = null; touchStartY = null;
    }

    function updateCardCategory(card, newCategory){
      const cardUrl = card.getAttribute("data-url");
      const isPrivate = card.dataset.isPrivate === "true";

      const i1 = links.findIndex(function(l){ return l.url === cardUrl; });
      if(i1 !== -1) links[i1].category = newCategory;

      const arr = isPrivate ? privateLinks : publicLinks;
      const i2 = arr.findIndex(function(l){ return l.url === cardUrl; });
      if(i2 !== -1) arr[i2].category = newCategory;

      card.dataset.category = newCategory;
    }

    document.addEventListener("DOMContentLoaded", function(){
      document.querySelectorAll(".card-container").forEach(function(container){
        container.addEventListener("touchstart", touchStart, { passive:false });
      });
    });

    async function saveCardOrder(){
      if(!await validateToken()) return;

      const containers = document.querySelectorAll(".card-container");
      const newPublicLinks = [];
      const newPrivateLinks = [];
      const newCategories = {};

      containers.forEach(function(container){
        const category = container.id;
        newCategories[category] = [];

        Array.prototype.slice.call(container.children).forEach(function(card){
          const url = card.getAttribute("data-url");
          const name = card.querySelector(".card-title").textContent;
          const isPrivate = card.dataset.isPrivate === "true";
          card.dataset.category = category;

          const originalLink = links.find(function(l){ return l.url === url; });
          const tips = originalLink && originalLink.tips ? originalLink.tips : "";
          const icon = originalLink && originalLink.icon ? originalLink.icon : "";

          const link = { name: name, url: url, tips: tips, icon: icon, category: category, isPrivate: isPrivate };
          if(isPrivate) newPrivateLinks.push(link);
          else newPublicLinks.push(link);

          newCategories[category].push(link);
        });
      });

      publicLinks.length = 0;
      Array.prototype.push.apply(publicLinks, newPublicLinks);
      privateLinks.length = 0;
      Array.prototype.push.apply(privateLinks, newPrivateLinks);

      Object.keys(categories).forEach(function(k){ delete categories[k]; });
      Object.assign(categories, newCategories);

      try{
        const response = await fetch("/api/saveOrder", {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization": localStorage.getItem("authToken")
          },
          body: JSON.stringify({
            userId:"testUser",
            links: newPublicLinks.concat(newPrivateLinks),
            categories: newCategories
          })
        });
        const result = await response.json();
        if(!result.success) throw new Error("Failed to save order");
        logAction("保存卡片顺序", { publicCount: newPublicLinks.length, privateCount: newPrivateLinks.length, categoryCount: Object.keys(newCategories).length });
      }catch(e){
        logAction("保存顺序失败", { error: "Save order failed" });
        await customAlert("保存顺序失败，请重试", "保存失败");
      }
    }

    async function reloadCardsAsAdmin(){
      document.querySelectorAll(".card-container").forEach(function(c){ c.innerHTML = ""; });
      await loadLinks();
      logAction("重新加载卡片（管理员模式）");
    }

    /* ================= 登录/设置 ================= */
    async function handleLoginClick(){
      if(isLoggedIn){
        const confirmed = await customConfirm("确定要退出登录吗？", "确定", "取消");
        if(confirmed) await logout();
      }else{
        showLoginModal();
      }
    }

    function showLoginModal(){
      document.getElementById("login-modal").style.display = "flex";
      document.getElementById("login-password").focus();
    }
    function hideLoginModal(){
      document.getElementById("login-modal").style.display = "none";
      document.getElementById("login-password").value = "";
    }

    async function performLogin(){
      const password = document.getElementById("login-password").value;
      if(!password){
        await customAlert("请输入密码", "提示");
        return;
      }
      try{
        const result = await verifyPassword(password);
        if(result.valid){
          isLoggedIn = true;
          localStorage.setItem("authToken", result.token);
          await loadLinks();
          hideLoginModal();
          updateLoginButton();
          await customAlert("登录成功！", "登录");
          logAction("登录成功");
        }else{
          await customAlert("密码错误", "登录失败");
          logAction("登录失败", { reason: result.error || "密码错误" });
        }
      }catch(e){
        console.error("Login error occurred");
        await customAlert("登录过程出错，请重试", "错误");
      }
    }

    async function logout(){
      isLoggedIn = false;
      isAdmin = false;
      localStorage.removeItem("authToken");
      links = publicLinks;
      renderSections();
      updateLoginButton();
      await customAlert("退出登录成功！", "退出登录");
      updateUIState();
      logAction("退出登录");
    }

    function updateLoginButton(){
      const loginBtn = document.getElementById("login-btn");
      const adminBtn = document.getElementById("admin-btn");
      if(isLoggedIn){
        loginBtn.textContent = "退出登录";
        adminBtn.style.display = "inline-block";
        adminBtn.textContent = isAdmin ? "离开设置" : "设置";
      }else{
        loginBtn.textContent = "登录";
        adminBtn.style.display = "none";
      }
    }

    function openGitHub(){
      window.open("https://github.com/hmhm2022/Nav-CF", "_blank");
      logAction("访问GitHub仓库");
    }

    function toggleBookmarkSearch(){
      const dropdown = document.getElementById("bookmark-search-dropdown");
      const isVisible = dropdown.classList.contains("show");
      if(isVisible) dropdown.classList.remove("show");
      else{
        dropdown.classList.add("show");
        document.getElementById("bookmark-search-input").focus();
      }
    }

    document.addEventListener("click", function(event){
      const searchToggle = document.querySelector(".bookmark-search-toggle");
      const dropdown = document.getElementById("bookmark-search-dropdown");
      if(searchToggle && !searchToggle.contains(event.target)) dropdown.classList.remove("show");
    });

    document.getElementById("login-password").addEventListener("keypress", function(e){
      if(e.key === "Enter") performLogin();
    });

    async function toggleAdminMode(){
      const addRemoveControls = document.querySelector(".add-remove-controls");

      if(!isAdmin && isLoggedIn){
        if(!await validateToken()) return;

        showLoading("正在进入设置模式...");


        try{
          isAdmin = true;
          addRemoveControls.style.display = "flex";
          await reloadCardsAsAdmin();
          hideLoading();
          await customAlert("准备设置分类和书签", "设置模式");
          logAction("进入设置");
        }finally{
          hideLoading();
        }
      }else if(isAdmin){
        isAdmin = false;
        removeMode = false;
        isEditCategoryMode = false;

        const manageButton = document.querySelector(".category-manage-btn");
        if(manageButton) manageButton.classList.remove("active");

        addRemoveControls.style.display = "none";
        await reloadCardsAsAdmin();
        await customAlert("设置已保存", "设置完成");
        logAction("离开设置");
      }

      updateLoginButton();
      updateUIState();
    }

    /* ================= 主题 & 返回顶部 ================= */
    function toggleTheme(){
      setTheme(!isDarkTheme, true);
      logAction("切换主题", { isDarkTheme: isDarkTheme });
    }

    function scrollToTop(){
      window.scrollTo({ top:0, behavior:"smooth" });
      logAction("返回顶部");
    }

    function handleBackToTopVisibility(){
      const btn = document.getElementById("back-to-top-btn");
      if(!btn) return;
      btn.style.display = window.scrollY > 300 ? "flex" : "none";
    }
    window.addEventListener("scroll", handleBackToTopVisibility);

    /* ================= Tooltip（卡片tips） ================= */
    function handleTooltipMouseMove(e, tips, adminMode){
      const tooltip = document.getElementById("custom-tooltip");
      if(!tips || adminMode){
        tooltip.style.display = "none";
        return;
      }
      if(tooltip.textContent !== tips) tooltip.textContent = tips;
      tooltip.style.display = "block";

      const offsetX = 15, offsetY = 10;
      const rect = tooltip.getBoundingClientRect();
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;

      let left = e.pageX + offsetX;
      let top = e.pageY + offsetY;

      if(pageWidth - e.clientX < 200) left = e.pageX - rect.width - offsetX;
      if(pageHeight - e.clientY < 100) top = e.pageY - rect.height - offsetY;

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    }
    function handleTooltipMouseLeave(){
      document.getElementById("custom-tooltip").style.display = "none";
    }

    /* ================= 书签搜索 ================= */
    function searchBookmarks(query){
      if(!query || query.trim() === ""){
        hideSearchResults();
        return;
      }
      query = query.toLowerCase().trim();
      const sectionsContainer = document.getElementById("sections-container");
      const matchedLinks = links.filter(function(link){
        return (link.name || "").toLowerCase().indexOf(query) !== -1;
      });

      sectionsContainer.innerHTML = "";

      const searchHeader = document.createElement("div");
      searchHeader.className = "search-results-header";

      const searchTitle = document.createElement("div");
      searchTitle.className = "search-results-title";
      searchTitle.textContent = "搜索结果 (" + matchedLinks.length + "个)";

      const backButton = document.createElement("button");
      backButton.className = "back-to-main";
      backButton.textContent = "返回主页";
      backButton.onclick = hideSearchResults;

      searchHeader.appendChild(searchTitle);
      searchHeader.appendChild(backButton);
      sectionsContainer.appendChild(searchHeader);

      if(matchedLinks.length === 0){
        const noResults = document.createElement("div");
        noResults.className = "no-search-results";
        noResults.textContent = "没有找到匹配的书签";
        sectionsContainer.appendChild(noResults);
      }else{
        const resultsSection = document.createElement("div");
        resultsSection.className = "search-results-section";
        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        matchedLinks.forEach(function(link){ createCard(link, cardContainer); });
        resultsSection.appendChild(cardContainer);
        sectionsContainer.appendChild(resultsSection);
      }

      isShowingSearchResults = true;
      const cat = document.getElementById("category-buttons-container");
      if(cat) cat.style.display = "none";

      logAction("执行书签搜索", { query: query, resultCount: matchedLinks.length });
    }

    function hideSearchResults(){
      isShowingSearchResults = false;
      document.getElementById("bookmark-search-input").value = "";
      renderSections();
      const cat = document.getElementById("category-buttons-container");
      if(cat) cat.style.display = "flex";
      renderCategoryButtons();
    }

    document.getElementById("bookmark-search-input").addEventListener("keypress", function(e){
      if(e.key === "Enter"){
        const query = document.getElementById("bookmark-search-input").value;
        searchBookmarks(query);
        document.getElementById("bookmark-search-dropdown").classList.remove("show");
      }
    });

    document.getElementById("bookmark-search-input").addEventListener("input", function(e){
      const query = e.target.value;
      if(query.trim() === "") hideSearchResults();
      else searchBookmarks(query);
    });

    /* ================= Token 校验（前端） ================= */
    async function validateToken(){
      const token = localStorage.getItem("authToken");
      if(!token){
        isLoggedIn = false;
        updateUIState();
        return false;
      }

      try{
        const response = await fetch("/api/getLinks?userId=testUser", { headers: { "Authorization": token } });
        if(response.status === 401){
          await resetToLoginState("token已过期，请重新登录");
          return false;
        }
        isLoggedIn = true;
        updateUIState();
        return true;
      }catch(e){
        console.error("Token validation failed");
        return false;
      }
    }

    async function resetToLoginState(message){
      if(message && message.trim() !== "") await customAlert(message, "登录状态");

      cleanupDragState();

      localStorage.removeItem("authToken");
      isLoggedIn = false;
      isAdmin = false;
      removeMode = false;
      isEditCategoryMode = false;

      updateLoginButton();
      updateUIState();
      links = publicLinks;
      renderSections();

      const addRemoveControls = document.querySelector(".add-remove-controls");
      if(addRemoveControls) addRemoveControls.style.display = "none";

      document.querySelectorAll(".delete-btn").forEach(function(btn){ btn.style.display = "none"; });
      document.querySelectorAll(".delete-category-btn").forEach(function(btn){ btn.style.display = "none"; });
      document.querySelectorAll(".edit-category-btn").forEach(function(btn){ btn.style.display = "none"; });
      document.querySelectorAll(".move-category-btn").forEach(function(btn){ btn.style.display = "none"; });

      const manageButton = document.querySelector(".category-manage-btn");
      if(manageButton) manageButton.classList.remove("active");

      const dialogOverlay = document.getElementById("dialog-overlay");
      if(dialogOverlay) dialogOverlay.style.display = "none";
      const loginModal = document.getElementById("login-modal");
      if(loginModal) loginModal.style.display = "none";

      const adminBtn = document.getElementById("admin-btn");
      if(adminBtn) adminBtn.style.display = "none";
    }

    async function verifyPassword(inputPassword){
      const response = await fetch("/api/verifyPassword", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ password: inputPassword })
      });
      return await response.json();
    }

    /* ================= 自定义 Alert / Confirm ================= */
    function customAlert(message, title, confirmText){
      title = title || "提示";
      confirmText = confirmText || "确定";
      return new Promise(function(resolve){
        const overlay = document.getElementById("custom-alert-overlay");
        const titleEl = document.getElementById("custom-alert-title");
        const contentEl = document.getElementById("custom-alert-content");
        const confirmBtn = document.getElementById("custom-alert-confirm");

        titleEl.textContent = title;
        contentEl.textContent = message;
        confirmBtn.textContent = confirmText;
        overlay.style.display = "flex";

        const handleConfirm = function(){
          overlay.style.display = "none";
          confirmBtn.removeEventListener("click", handleConfirm);
          document.removeEventListener("keydown", handleKeyDown);
          resolve();
        };

        const handleKeyDown = function(e){
          if(e.key === "Escape") handleConfirm();
        };

        confirmBtn.addEventListener("click", handleConfirm);
        document.addEventListener("keydown", handleKeyDown);

        overlay.addEventListener("click", function(e){
          if(e.target === overlay) handleConfirm();
        });
      });
    }

    function customConfirm(message, okText, cancelText){
      okText = okText || "确定";
      cancelText = cancelText || "取消";
      return new Promise(function(resolve){
        const overlay = document.getElementById("custom-confirm-overlay");
        const messageEl = document.getElementById("custom-confirm-message");
        const okBtn = document.getElementById("custom-confirm-ok");
        const cancelBtn = document.getElementById("custom-confirm-cancel");

        messageEl.textContent = message;
        okBtn.textContent = okText;
        cancelBtn.textContent = cancelText;
        overlay.style.display = "flex";

        const cleanup = function(){
          overlay.style.display = "none";
          document.removeEventListener("keydown", handleKeyDown);
          okBtn.onclick = null;
          cancelBtn.onclick = null;
          overlay.onclick = null;
        };

        const handleConfirm = function(result){
          cleanup();
          resolve(result);
        };

        const handleKeyDown = function(e){
          if(e.key === "Enter") handleConfirm(true);
          if(e.key === "Escape") handleConfirm(false);
        };

        okBtn.onclick = function(){ handleConfirm(true); };
        cancelBtn.onclick = function(){ handleConfirm(false); };
        document.addEventListener("keydown", handleKeyDown);
        overlay.onclick = function(e){ if(e.target === overlay) handleConfirm(false); };
      });
    }

    function showCategoryDialog(title, defaultValue){
      defaultValue = defaultValue || "";
      return new Promise(function(resolve){
        const dialog = document.getElementById("category-dialog");
        const input = document.getElementById("category-name-input");
        const titleEl = document.getElementById("category-dialog-title");
        const confirmBtn = document.getElementById("category-confirm-btn");
        const cancelBtn = document.getElementById("category-cancel-btn");

        titleEl.textContent = title;
        input.value = defaultValue;

        dialog.style.display = "flex";
        setTimeout(function(){ input.focus(); }, 50);

        const cleanup = function(){
          dialog.style.display = "none";
          document.removeEventListener("keydown", handleKeyDown);
          confirmBtn.onclick = null;
          cancelBtn.onclick = null;
          dialog.onclick = null;
        };

        const handleConfirm = function(){
          const value = input.value.trim();
          if(value){
            cleanup();
            resolve(value);
          }else{
            input.focus();
          }
        };

        const handleCancel = function(){
          cleanup();
          resolve(null);
        };

        const handleKeyDown = function(e){
          if(e.key === "Enter"){ e.preventDefault(); handleConfirm(); }
          else if(e.key === "Escape"){ handleCancel(); }
        };

        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        document.addEventListener("keydown", handleKeyDown);
        dialog.onclick = function(e){ if(e.target === dialog) handleCancel(); };
      });
    }

    /* ================= 加载遮罩 ================= */
    function showLoading(message){
      message = message || "加载中，请稍候...";
      const mask = document.getElementById("loading-mask");
      mask.querySelector("p").textContent = message;
      mask.style.display = "flex";
    }
    function hideLoading(){
      document.getElementById("loading-mask").style.display = "none";
    }

    /* ================= 导出/导入（后台数据库） ================= */
    async function exportData(){
      if(!await validateToken()) return;
      try{
        showLoading("正在导出数据...");
        const res = await fetch("/api/exportData?userId=testUser", {
          method:"GET",
          headers:{ "Authorization": localStorage.getItem("authToken") }
        });
        if(!res.ok){
          hideLoading();
          await customAlert("导出失败，请重试", "导出");
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cardtab_export.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        hideLoading();
        logAction("导出数据");
      }catch(e){
        hideLoading();
        await customAlert("导出失败，请重试", "导出");
      }
    }

    function triggerImport(){
      const input = document.getElementById("import-file");
      input.value = "";
      input.click();
    }

    document.getElementById("import-file").addEventListener("change", async function(e){
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      if(!await validateToken()) return;

      const confirmed = await customConfirm("导入会覆盖当前所有数据，确定继续吗？", "确定", "取消");
      if(!confirmed) return;

      try{
        showLoading("正在导入数据...");
        const text = await file.text();
        const data = JSON.parse(text);

        const res = await fetch("/api/importData", {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization": localStorage.getItem("authToken")
          },
          body: JSON.stringify({ userId:"testUser", data: data })
        });

        if(!res.ok){
          let msg = "导入失败：数据格式不对或服务端错误";
          try{
            const j = await res.json();
            if (j && j.message) msg = "导入失败：" + j.message;
          }catch(_e){}
          hideLoading();
          await customAlert(msg, "导入");
          return;
        }

        hideLoading();
        await customAlert("导入成功！页面将刷新数据", "导入");
        await loadLinks();
        logAction("导入数据");
      }catch(err){
        hideLoading();
        await customAlert("导入失败：" + (err && err.message ? err.message : "请确认文件是正确的 JSON 文件"), "导入");
      }
    });

    /* ================= 初始化 ================= */
    document.addEventListener("DOMContentLoaded", async function(){
      try{
        await validateToken();
        updateLoginButton();
        await loadLinks();
        setTimeout(setActiveCategoryButtonByVisibility, 500);
        setTimeout(handleBackToTopVisibility, 100);
      }catch(e){
        console.error("Initialization failed");
      }
    });
  
/* ===== 北京时间 ===== */
function updateBeijingTime(){
  const now = new Date();
  const bj = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Shanghai"}));
  const week=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  document.getElementById("site-datetime").textContent =
    bj.getFullYear()+"年"+(bj.getMonth()+1)+"月"+bj.getDate()+"日 "+
    week[bj.getDay()]+" "+bj.toLocaleTimeString("zh-CN",{hour12:false});
}
setInterval(updateBeijingTime,1000);
updateBeijingTime();

/* ===== 标题可编辑并保存 ===== */
const titleEl=document.getElementById("site-title");
const savedTitle=localStorage.getItem("siteTitle");
if(savedTitle) titleEl.textContent=savedTitle;

if(isAdmin){
  titleEl.title="点击修改标题";
  titleEl.onclick=()=>{
    const v=prompt("请输入站点标题",titleEl.textContent);
    if(v){
      titleEl.textContent=v;
      localStorage.setItem("siteTitle",v);
    }
  };
}


/* ===== 后台：修改站点名称 ===== */
function editSiteTitle(){
  const titleEl = document.getElementById("site-title");
  if(!titleEl) return;
  const v = prompt("请输入站点名称", titleEl.textContent);
  if(v){
    titleEl.textContent = v;
    localStorage.setItem("siteTitle", v);
  }
}


/* ===== 自动抓取网站描述 ===== */
async function fetchSiteDescription(url){
  try{
    const res = await fetch("/api/fetchMeta?url="+encodeURIComponent(url));
    const data = await res.json();
    return data.description || "";
  }catch(e){ return ""; }
}

document.getElementById("url-input")?.addEventListener("blur", async function(){
  const url = this.value;
  if(!url) return;
  const tipsInput = document.getElementById("tips-input");
  if(tipsInput && !tipsInput.value){
    tipsInput.value = await fetchSiteDescription(url);
  }
});


/* ===== AI 自动生成名称 / 描述 / 图标 ===== */
document.getElementById("ai-generate-btn")?.addEventListener("click", async ()=>{
  const url = document.getElementById("url-input")?.value;
  if(!url){
    alert("请先输入网址");
    return;
  }
  try{
    const res = await fetch("/api/aiGenerate?url="+encodeURIComponent(url));
    const data = await res.json();

    if(data.name && document.getElementById("name-input")){
      document.getElementById("name-input").value = data.name;
    }
    if(data.description && document.getElementById("tips-input")){
      document.getElementById("tips-input").value = data.description;
    }
    if(data.icon && document.getElementById("icon-input")){
      document.getElementById("icon-input").value = data.icon;
    }
  }catch(e){
    console.error("AI 生成失败");
  }
});


/* ===== 后台面板拉出/自动收起 ===== */
function openAdminPanel(){
  const panel = document.querySelector(".add-remove-controls");
  if(panel) panel.classList.add("open");
}

document.addEventListener("click", (e) => {
  const panel = document.querySelector(".add-remove-controls");
  const handle = document.querySelector(".admin-panel-handle");
  if(!panel || !handle) return;

  if(panel.classList.contains("open")){
    if(!panel.contains(e.target) && !handle.contains(e.target)){
      panel.classList.remove("open");
    }
  }
});


/* ===== FREE AI 前端兜底填充 ===== */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("ai-generate-btn");
  if(!btn) return;

  btn.addEventListener("click", async () => {
    const url = document.getElementById("url-input")?.value;
    if(!url){ alert("请先输入网址"); return; }

    btn.disabled = true;
    btn.textContent = "AI...";

    try{
      const res = await fetch("/api/aiGenerate",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();

      if(data.name && !document.getElementById("name-input").value){
        document.getElementById("name-input").value = data.name;
      }
      if(data.desc){
        document.getElementById("tips-input").value = data.desc;
      }
    }catch(e){
      
    }finally{
      btn.disabled = false;
      btn.textContent = "AI";
    }
  });
});

</script>

<div class="admin-panel-handle" onclick="openAdminPanel()" title="后台操作"></div>


<script>
document.addEventListener("DOMContentLoaded", () => {
  const handle = document.querySelector(".admin-panel-handle");
  if (!handle) return;

  if (document.querySelector(".admin-panel-hint")) return;

  const hint = document.createElement("span");
  hint.className = "admin-panel-hint";
  hint.textContent = "点我";

  document.body.appendChild(hint);

  const syncPosition = () => {
    const rect = handle.getBoundingClientRect();
    hint.style.top = (rect.top + rect.height / 2) + "px";
  };

  syncPosition();
  window.addEventListener("scroll", syncPosition);
  window.addEventListener("resize", syncPosition);
});
</script>

</body>
</html>
`;

/* =================== Seed Data (optional) =================== */
let __seedEnsured = false;
async function ensureSeed(env) {
  if (__seedEnsured) return;
  try {
    const existing = await env.CARD_ORDER.get(SEED_USER_ID);
    if (!existing) {
      await env.CARD_ORDER.put(SEED_USER_ID, JSON.stringify(SEED_DATA));
    }
  } catch (e) {
    // Ignore seed init errors to avoid blocking the site
  } finally {
    __seedEnsured = true;
  }
}


/* =================== Security Helpers (Worker) =================== */

// Constant-time comparison to mitigate timing attacks
function constantTimeCompare(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Validate token (timestamp.hash), 15-minute TTL
async function validateServerToken(authToken, env) {
  if (!authToken) {
    return {
      isValid: false,
      status: 401,
      response: { error: "Unauthorized", message: "未登录或登录已过期" }
    };
  }

  try {
    const parts = authToken.split(".");
    if (parts.length !== 2) {
      return {
        isValid: false,
        status: 401,
        response: { error: "Invalid token", tokenInvalid: true, message: "登录状态无效，请重新登录" }
      };
    }

    const timestamp = parts[0];
    const hash = parts[1];
    const tokenTimestamp = parseInt(timestamp, 10);
    const now = Date.now();

    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    if (now - tokenTimestamp > FIFTEEN_MINUTES) {
      return {
        isValid: false,
        status: 401,
        response: { error: "Token expired", tokenExpired: true, message: "登录已过期，请重新登录" }
      };
    }

    const tokenData = timestamp + "_" + env.ADMIN_PASSWORD;
    const encoder = new TextEncoder();
    const data = encoder.encode(tokenData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const expectedHash = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(hashBuffer))));

    if (!constantTimeCompare(hash, expectedHash)) {
      return {
        isValid: false,
        status: 401,
        response: { error: "Invalid token", tokenInvalid: true, message: "登录状态无效，请重新登录" }
      };
    }

    return { isValid: true };
  } catch (e) {
    return {
      isValid: false,
      status: 401,
      response: { error: "Invalid token", tokenInvalid: true, message: "登录验证失败，请重新登录" }
    };
  }
}

// Admin validation (reserved for future extensions)
async function validateAdminToken(authToken, env) {
  const validation = await validateServerToken(authToken, env);
  if (!validation.isValid) return validation;
  return { isValid: true, isAdmin: true };
}
