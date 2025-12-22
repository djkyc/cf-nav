// db.js - 默认数据（部署后首次访问会写入 KV）
// 你可以直接在这里修改/替换为自己的导航数据
export const SEED_USER_ID = "default";

export const SEED_DATA = {
  "links": [
    {
      "name": "Gmail",
      "url": "https://mail.google.com/mail/u/0/#inbox",
      "tips": "访问Google邮箱，管理收件箱和电子邮件。",
      "icon": "https://icon.iori.nyc.mn/?url=mail.google.com",
      "category": "常用推荐",
      "isPrivate": false
    },
    {
      "name": "outlook",
      "url": "https://outlook.live.com/mail/0/",
      "tips": "访问Outlook邮箱，管理电子邮件和日历。",
      "icon": "https://outlook.live.com/mail/favicon.ico",
      "category": "常用推荐",
      "isPrivate": false
    },
    {
      "name": "Youtube",
      "url": "https://www.youtube.com",
      "tips": "Youtube 视频",
      "icon": "https://favicon.im/www.youtube.com?larger=true",
      "category": "常用推荐",
      "isPrivate": false
    },
    {
      "name": "网易邮箱",
      "url": "https://mail.163.com/",
      "tips": "网易163邮箱",
      "icon": "https://mail.163.com/favicon.ico",
      "category": "常用推荐",
      "isPrivate": false
    },
    {
      "name": "百度",
      "url": "https://www.baidu.com/",
      "tips": "全球最大的中文搜索引擎",
      "icon": "https://favicon.im/www.baidu.com?larger=true",
      "category": "常用推荐",
      "isPrivate": false
    },
    {
      "name": "ChatGPT",
      "url": "https://chatgpt.com",
      "tips": "ChatGPT是一个人工智能语言模型，可以帮助用户生成文本、回答问题、翻译文本等。",
      "icon": "https://favicon.im/chatgpt.com?larger=true",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "Perplexity AI",
      "url": "https://www.perplexity.ai/",
      "tips": "Perplexity AI：智能搜索助手，提供答案和来源。",
      "icon": "https://icon.iori.nyc.mn?url=www.perplexity.ai",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "Gemini",
      "url": "https://gemini.google.com",
      "tips": "Google Gemini 是一款先进的人工智能助手，提供多种智能服务和应用。",
      "icon": "https://icon.iori.nyc.mn?url=gemini.google.com",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "Kimi",
      "url": "https://www.kimi.com/",
      "tips": "kimi Ai",
      "icon": "https://statics.moonshot.cn/kimi-web-seo/favicon.ico",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "cto.new",
      "url": "https://cto.new/",
      "tips": "AI code agent",
      "icon": "https://cto.new/favicon.ico",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "Grok",
      "url": "https://grok.com",
      "tips": "Grok Ai",
      "icon": "https://icon.iori.nyc.mn/?url=grok.com",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "ollama",
      "url": "https://ollama.com/settings",
      "tips": "Chat & build with open models",
      "icon": "https://ollama.com/public/icon-32x32.png",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "通义千问",
      "url": "https://www.qianwen.com/",
      "tips": "千问-Qwen最新模型",
      "icon": "https://img.alicdn.com/imgextra/i2/O1CN01FPcQDy1WTPjPX6IH9_!!6000000002789-2-tps-96-96.png",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "Microsoft Copilot",
      "url": "https://copilot.microsoft.com/",
      "tips": "微软Copilot Ai",
      "icon": "https://copilot.microsoft.com/static/cmc/favicon.svg",
      "category": "人工智能",
      "isPrivate": false
    },
    {
      "name": "哪吒面板",
      "url": "https://veyvwiviswug.ap-southeast-1.clawcloudrun.com/",
      "tips": "哪吒面板：一款基于云的服务器管理工具，提供一站式监控与运维。",
      "icon": "https://veyvwiviswug.ap-southeast-1.clawcloudrun.com/apple-touch-icon.png",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "Komari监控",
      "url": "https://komari.iori.pp.ua/",
      "tips": "实时监控 Komari 服务器状态和错误日志，实时推送到指定邮箱或 webhook。",
      "icon": "https://favicon.im/komari.iori.pp.ua?larger=true",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "Vercel",
      "url": "https://vercel.com/",
      "tips": "Vercel 是一个前端框架和静态网站托管平台，支持快速部署和无服务器函数。",
      "icon": "https://favicon.im/vercel.com?larger=true",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "镜像加速Hub",
      "url": "https://hub.661388.xyz/",
      "tips": "Github和Docker镜像加速",
      "icon": "https://hub.661388.xyz/favicon.ico",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "Webssh",
      "url": "https://webssh.661388.xyz/",
      "tips": "Webssh快速连接",
      "icon": "https://webssh.661388.xyz/static/img/favicon.ico",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "Cloudflare",
      "url": "https://dash.cloudflare.com/",
      "tips": "Cloudflare用户界面，管理网站安全和性能。",
      "icon": "https://dash.cloudflare.com/favicon.ico",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "GitHub",
      "url": "https://github.com",
      "tips": "代码托管平台",
      "icon": "https://github.com/favicon.ico",
      "category": "开发工具",
      "isPrivate": false
    },
    {
      "name": "IP 哨兵",
      "url": "https://ip.661388.xyz/",
      "tips": "IP 哨兵：实时监控和分析 IP 地址的工具。",
      "icon": "https://img.icons8.com/?size=100&id=Wc9w69haClbb&format=png&color=000000",
      "category": "Cloudflare",
      "isPrivate": false
    },
    {
      "name": "自动SSL证书",
      "url": "https://ssl.b.a.f.e.0.7.4.0.1.0.0.2.ip6.arpa/",
      "tips": "SSL证书自动生成",
      "icon": "https://tunnelbroker.net/favicon.ico",
      "category": "Cloudflare",
      "isPrivate": false
    },
    {
      "name": "GitHub 文件加速",
      "url": "https://github.iori4.pp.ua/",
      "tips": "Github文件加速",
      "icon": "https://github.iori4.pp.ua/favicon.ico",
      "category": "Cloudflare",
      "isPrivate": false
    },
    {
      "name": "Check ProxyIP - 代理IP检测服务",
      "url": "https://check.iori3.pp.ua/",
      "tips": "Check ProxyIP - 代理IP检测服务",
      "icon": "https://img.icons8.com/?size=100&id=11221&format=png&color=000000",
      "category": "Cloudflare",
      "isPrivate": false
    },
    {
      "name": "在线订阅转换工具",
      "url": "https://sub.iori2.dpdns.org/",
      "tips": "在线订阅转换工具，轻松转换各种订阅链接。",
      "icon": "https://img.icons8.com/?size=100&id=9917&format=png&color=000000",
      "category": "Cloudflare",
      "isPrivate": false
    },
    {
      "name": "ZoneABC",
      "url": "https://zoneabc.net/dashboard",
      "tips": "ZoneABC域名管理",
      "icon": "https://zoneabc.net/logo.svg",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "netassist",
      "url": "https://tb.netassist.ua/",
      "tips": "ip6.arpa域名管理",
      "icon": "https://tunnelbroker.net/favicon.ico",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "tunnelbroker",
      "url": "https://tunnelbroker.net/",
      "tips": "ip6.arpa域名管理",
      "icon": "https://tunnelbroker.net/favicon.ico",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "Netlibre",
      "url": "https://www.netlib.re/",
      "tips": "netlib.re域名管理",
      "icon": "https://favicon.im/www.netlib.re?larger=true",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "Spaceship",
      "url": "https://www.spaceship.com/",
      "tips": "xyz域名管理",
      "icon": "https://spaceship-cdn.com/static/spaceship/favicon/spaceship-favicon.ico",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "Dpdns域名",
      "url": "https://dash.domain.digitalplat.org",
      "tips": "Dpdns域名管理",
      "icon": "https://icon.iori.nyc.mn/?url=domain.digitalplat.org",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "pp.ua域名",
      "url": "https://nic.ua/en",
      "tips": "pp.ua域名管理",
      "icon": "https://nic.ua/favicon.ico?version=v350",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "NYC域名",
      "url": "https://dash.publiczone.org/",
      "tips": "nyc.mn域名管理",
      "icon": "https://publiczone.org/assets/images/favicon/favicon.svg",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "DNSHE",
      "url": "https://my.dnshe.com/index.php?m=domain_hub",
      "tips": "DNSHE免费域名管理平台",
      "icon": "https://my.dnshe.com/favicon.ico",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "I8 CLOUD",
      "url": "https://nic.gv.uy/",
      "tips": "I8 CLOUD：乌拉圭政府域名注册服务。",
      "icon": "https://favicon.im/nic.gv.uy?larger=true",
      "category": "域名管理",
      "isPrivate": false
    },
    {
      "name": "Google Cloud 控制台",
      "url": "https://console.cloud.google.com",
      "tips": "谷歌云控制台",
      "icon": "https://favicon.im/console.cloud.google.com?larger=true",
      "category": "VPS",
      "isPrivate": false
    },
    {
      "name": "Euserv",
      "url": "https://support.euserv.com/",
      "tips": "德鸡管理",
      "icon": "https://support.euserv.com/pic/euserv_logo_118x80.gif",
      "category": "VPS",
      "isPrivate": false
    },
    {
      "name": "MJJVM | 云服务器",
      "url": "https://www.mjjvm.com/service?groupid=305",
      "tips": "MJJVM云服务器，提供稳定可靠的云服务。",
      "icon": "https://www.mjjvm.com/upload/logo-colours.png",
      "category": "VPS",
      "isPrivate": false
    },
    {
      "name": "蛋蛋云",
      "url": "https://dandan.nyc.mn",
      "tips": "蛋蛋云VPS",
      "icon": "https://favicon.im/dandan.nyc.mn?larger=true",
      "category": "VPS",
      "isPrivate": false
    },
    {
      "name": "Zeabur",
      "url": "https://zeabur.com/",
      "tips": "Zeabur是一个在线笔记和知识管理工具，支持Markdown编辑和协作功能。",
      "icon": "https://zeabur.com/logo.svg",
      "category": "容器平台",
      "isPrivate": false
    },
    {
      "name": "NorthFlank",
      "url": "https://northflank.com/",
      "tips": "Northflank 容器",
      "icon": "https://northflank.com/favicon.ico",
      "category": "容器平台",
      "isPrivate": false
    },
    {
      "name": "Railway",
      "url": "https://railway.com/",
      "tips": "railway 容器",
      "icon": "https://railway.com/favicons/favicon-light.ico",
      "category": "容器平台",
      "isPrivate": false
    },
    {
      "name": "ClawCloud",
      "url": "https://ap-southeast-1.run.claw.cloud/",
      "tips": "ClawCloud 容器",
      "icon": "https://ap-southeast-1.run.claw.cloud/icons/icon-512x512.png",
      "category": "容器平台",
      "isPrivate": false
    },
    {
      "name": "Koyeb",
      "url": "https://www.koyeb.com/",
      "tips": "koyeb 容器",
      "icon": "https://www.koyeb.com/favicon/favicon.ico",
      "category": "容器平台",
      "isPrivate": false
    },
    {
      "name": "Hugging Face",
      "url": "https://huggingface.co/",
      "tips": "Hugging Face 容器",
      "icon": "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
      "category": "容器平台",
      "isPrivate": false
    },
    {
      "name": "MoonTV",
      "url": "https://moontv.661388.xyz/",
      "tips": "免费在线电视平台，提供多语种高清直播和VOD内容。",
      "icon": "https://favicon.im/moontv.661388.xyz?larger=true",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "无损音乐下载",
      "url": "https://flac.music.hi.cn/",
      "tips": "无损音乐下载",
      "icon": "https://flac.music.hi.cn/static/img/logo.png",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "热播之家",
      "url": "https://www.rebozj.pro/",
      "tips": "热播之家",
      "icon": "https://www.rebozj.pro/template/jianhei/statics/img/favicon.png",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "4K影视",
      "url": "https://www.4kvm.tv/",
      "tips": "4K影视",
      "icon": "https://www.4kvm.tv/wp-content/uploads/2020/07/c4b7f67bdfbd37.png",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "厂长资源",
      "url": "https://www.cz4k.com/",
      "tips": "厂长资源",
      "icon": "https://cf.hbcn.fun/wp-content/uploads/2021/10/5c7a67356cec28.ico",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "影猫仓库",
      "url": "https://www.ymck.pro/",
      "tips": "影猫仓库",
      "icon": "https://www.ymck.pro/upload/site/20230825-1/5c00fbcfb4ff0737d3c8320d30b2d1de.png",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "来看点播",
      "url": "https://lkvod.com/",
      "tips": "来看点播",
      "icon": "https://lkvod.com/upload/site/20241223-1/eb0f19bab937f4f3da69d1fa2b7c516c.png",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "修罗影视",
      "url": "https://xl01.com.de/",
      "tips": "修罗影视",
      "icon": "https://xl01.com.de/images/favicon.png",
      "category": "影视资源",
      "isPrivate": false
    },
    {
      "name": "1024tools",
      "url": "https://1024tools.com/",
      "tips": "在线工具集，提供文本、图像、音频等多种处理功能，方便快捷。",
      "icon": "https://1024tools.com/favicon.ico",
      "category": "在线工具",
      "isPrivate": false
    },
    {
      "name": "JSON在线解析",
      "url": "https://www.json.cn/",
      "tips": "JSON在线解析工具，支持格式化、校验和转换JSON数据。",
      "icon": "https://static.json.cn/r/img/favicon/favicon.ico",
      "category": "在线工具",
      "isPrivate": false
    },
    {
      "name": "CTool工具",
      "url": "https://ctool.dev/",
      "tips": "多功能在线工具平台",
      "icon": "https://favicon.im/ctool.dev?larger=true",
      "category": "在线工具",
      "isPrivate": false
    },
    {
      "name": "obfuscator",
      "url": "https://obfuscator.io/",
      "tips": "在线工具，快速混淆和保护JavaScript代码，防止反编译和盗用。",
      "icon": "https://favicon.im/obfuscator.io?larger=true",
      "category": "在线工具",
      "isPrivate": false
    },
    {
      "name": "地址生成器",
      "url": "https://www.meiguodizhi.com/",
      "tips": "美国地址生成器，随机生成真实的美国地址，适用于各种测试需求。",
      "icon": "https://static11.meiguodizhi.com/favicon.ico",
      "category": "在线工具",
      "isPrivate": false
    },
    {
      "name": "itdog",
      "url": "https://www.itdog.cn/",
      "tips": "IT技术资讯与教程，涵盖编程、网络安全、云计算等领域。",
      "icon": "https://www.itdog.cn/favicon.ico",
      "category": "在线工具",
      "isPrivate": false
    },
    {
      "name": "LotHelper",
      "url": "https://www.lothelper.com/cn/shownumber",
      "tips": "提供多国临时号码用于在线接收短信",
      "icon": "https://www.lothelper.com/image/favicon.png",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "mianfeijiema",
      "url": "https://mianfeijiema.com/",
      "tips": "提供临时手机号用于接收短信和激活",
      "icon": "https://mianfeijiema.com/static/picture/logo.png",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "5sim",
      "url": "https://5sim.net/",
      "tips": "提供临时手机号用于接收短信和激活",
      "icon": "https://5sim.net/favicon-32x32.png",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "clearcode",
      "url": "https://clearcode.cn/",
      "tips": "在线接收短信验证码的虚拟号码平台",
      "icon": "https://clearcode.cn/static/tw/logo.png",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "receive-sms",
      "url": "https://receive-sms-online.info/",
      "tips": "免费在线接码",
      "icon": "https://receive-sms-online.info/favicon.ico",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "smsonline",
      "url": "https://www.smsonline.cloud/zh",
      "tips": "全球领先的云存储平台，提供安全、可靠、易用的存储服务，支持文件共享、协作和数据同步。",
      "icon": "https://www.smsonline.cloud/favicon.ico",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "sms-activate",
      "url": "https://sms-activate.io/cn/freeNumbers",
      "tips": "免费虚拟号码",
      "icon": "https://smsactivate.s3.eu-central-1.amazonaws.com/assets/img/activate_favicon32.png",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "smser",
      "url": "https://smser.net/",
      "tips": "免费在线接码",
      "icon": "https://smser.net/img/smser.net/favicon.ico?v=1.2",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "temp-number",
      "url": "https://temp-number.com/",
      "tips": "免费接码",
      "icon": "https://temp-number.com/img/favicon.ico",
      "category": "接码平台",
      "isPrivate": false
    },
    {
      "name": "LinuxDo",
      "url": "https://linux.do",
      "tips": "Linux学习社区与教程分享平台",
      "icon": "https://favicon.im/linux.do?larger=true",
      "category": "论坛",
      "isPrivate": false
    },
    {
      "name": "NodeLoc",
      "url": "https://nodeloc.com/",
      "tips": "NodeLoc服务器托管与网络解决方案",
      "icon": "https://favicon.im/nodeloc.com?larger=true",
      "category": "论坛",
      "isPrivate": false
    },
    {
      "name": "MJJBox资源",
      "url": "https://mjjbox.com/",
      "tips": "MJJBox资源分享平台",
      "icon": "https://favicon.im/mjjbox.com?larger=true",
      "category": "论坛",
      "isPrivate": false
    },
    {
      "name": "NodeSeek",
      "url": "https://www.nodeseek.com",
      "tips": "NodeSeek社区交流平台",
      "icon": "https://favicon.im/www.nodeseek.com?larger=true",
      "category": "论坛",
      "isPrivate": false
    }
  ],
  "categories": {
    "常用推荐": [
      {
        "name": "Gmail",
        "url": "https://mail.google.com/mail/u/0/#inbox",
        "tips": "访问Google邮箱，管理收件箱和电子邮件。",
        "icon": "https://icon.iori.nyc.mn/?url=mail.google.com",
        "category": "常用推荐",
        "isPrivate": false
      },
      {
        "name": "outlook",
        "url": "https://outlook.live.com/mail/0/",
        "tips": "访问Outlook邮箱，管理电子邮件和日历。",
        "icon": "https://outlook.live.com/mail/favicon.ico",
        "category": "常用推荐",
        "isPrivate": false
      },
      {
        "name": "Youtube",
        "url": "https://www.youtube.com",
        "tips": "Youtube 视频",
        "icon": "https://favicon.im/www.youtube.com?larger=true",
        "category": "常用推荐",
        "isPrivate": false
      },
      {
        "name": "网易邮箱",
        "url": "https://mail.163.com/",
        "tips": "网易163邮箱",
        "icon": "https://mail.163.com/favicon.ico",
        "category": "常用推荐",
        "isPrivate": false
      },
      {
        "name": "百度",
        "url": "https://www.baidu.com/",
        "tips": "全球最大的中文搜索引擎",
        "icon": "https://favicon.im/www.baidu.com?larger=true",
        "category": "常用推荐",
        "isPrivate": false
      }
    ],
    "人工智能": [
      {
        "name": "ChatGPT",
        "url": "https://chatgpt.com",
        "tips": "ChatGPT是一个人工智能语言模型，可以帮助用户生成文本、回答问题、翻译文本等。",
        "icon": "https://favicon.im/chatgpt.com?larger=true",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "Perplexity AI",
        "url": "https://www.perplexity.ai/",
        "tips": "Perplexity AI：智能搜索助手，提供答案和来源。",
        "icon": "https://icon.iori.nyc.mn?url=www.perplexity.ai",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "Gemini",
        "url": "https://gemini.google.com",
        "tips": "Google Gemini 是一款先进的人工智能助手，提供多种智能服务和应用。",
        "icon": "https://icon.iori.nyc.mn?url=gemini.google.com",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "Kimi",
        "url": "https://www.kimi.com/",
        "tips": "kimi Ai",
        "icon": "https://statics.moonshot.cn/kimi-web-seo/favicon.ico",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "cto.new",
        "url": "https://cto.new/",
        "tips": "AI code agent",
        "icon": "https://cto.new/favicon.ico",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "Grok",
        "url": "https://grok.com",
        "tips": "Grok Ai",
        "icon": "https://icon.iori.nyc.mn/?url=grok.com",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "ollama",
        "url": "https://ollama.com/settings",
        "tips": "Chat & build with open models",
        "icon": "https://ollama.com/public/icon-32x32.png",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "通义千问",
        "url": "https://www.qianwen.com/",
        "tips": "千问-Qwen最新模型",
        "icon": "https://img.alicdn.com/imgextra/i2/O1CN01FPcQDy1WTPjPX6IH9_!!6000000002789-2-tps-96-96.png",
        "category": "人工智能",
        "isPrivate": false
      },
      {
        "name": "Microsoft Copilot",
        "url": "https://copilot.microsoft.com/",
        "tips": "微软Copilot Ai",
        "icon": "https://copilot.microsoft.com/static/cmc/favicon.svg",
        "category": "人工智能",
        "isPrivate": false
      }
    ],
    "开发工具": [
      {
        "name": "哪吒面板",
        "url": "https://veyvwiviswug.ap-southeast-1.clawcloudrun.com/",
        "tips": "哪吒面板：一款基于云的服务器管理工具，提供一站式监控与运维。",
        "icon": "https://veyvwiviswug.ap-southeast-1.clawcloudrun.com/apple-touch-icon.png",
        "category": "开发工具",
        "isPrivate": false
      },
      {
        "name": "Komari监控",
        "url": "https://komari.iori.pp.ua/",
        "tips": "实时监控 Komari 服务器状态和错误日志，实时推送到指定邮箱或 webhook。",
        "icon": "https://favicon.im/komari.iori.pp.ua?larger=true",
        "category": "开发工具",
        "isPrivate": false
      },
      {
        "name": "Vercel",
        "url": "https://vercel.com/",
        "tips": "Vercel 是一个前端框架和静态网站托管平台，支持快速部署和无服务器函数。",
        "icon": "https://favicon.im/vercel.com?larger=true",
        "category": "开发工具",
        "isPrivate": false
      },
      {
        "name": "镜像加速Hub",
        "url": "https://hub.661388.xyz/",
        "tips": "Github和Docker镜像加速",
        "icon": "https://hub.661388.xyz/favicon.ico",
        "category": "开发工具",
        "isPrivate": false
      },
      {
        "name": "Webssh",
        "url": "https://webssh.661388.xyz/",
        "tips": "Webssh快速连接",
        "icon": "https://webssh.661388.xyz/static/img/favicon.ico",
        "category": "开发工具",
        "isPrivate": false
      },
      {
        "name": "Cloudflare",
        "url": "https://dash.cloudflare.com/",
        "tips": "Cloudflare用户界面，管理网站安全和性能。",
        "icon": "https://dash.cloudflare.com/favicon.ico",
        "category": "开发工具",
        "isPrivate": false
      },
      {
        "name": "GitHub",
        "url": "https://github.com",
        "tips": "代码托管平台",
        "icon": "https://github.com/favicon.ico",
        "category": "开发工具",
        "isPrivate": false
      }
    ],
    "Cloudflare": [
      {
        "name": "IP 哨兵",
        "url": "https://ip.661388.xyz/",
        "tips": "IP 哨兵：实时监控和分析 IP 地址的工具。",
        "icon": "https://img.icons8.com/?size=100&id=Wc9w69haClbb&format=png&color=000000",
        "category": "Cloudflare",
        "isPrivate": false
      },
      {
        "name": "自动SSL证书",
        "url": "https://ssl.b.a.f.e.0.7.4.0.1.0.0.2.ip6.arpa/",
        "tips": "SSL证书自动生成",
        "icon": "https://tunnelbroker.net/favicon.ico",
        "category": "Cloudflare",
        "isPrivate": false
      },
      {
        "name": "GitHub 文件加速",
        "url": "https://github.iori4.pp.ua/",
        "tips": "Github文件加速",
        "icon": "https://github.iori4.pp.ua/favicon.ico",
        "category": "Cloudflare",
        "isPrivate": false
      },
      {
        "name": "Check ProxyIP - 代理IP检测服务",
        "url": "https://check.iori3.pp.ua/",
        "tips": "Check ProxyIP - 代理IP检测服务",
        "icon": "https://img.icons8.com/?size=100&id=11221&format=png&color=000000",
        "category": "Cloudflare",
        "isPrivate": false
      },
      {
        "name": "在线订阅转换工具",
        "url": "https://sub.iori2.dpdns.org/",
        "tips": "在线订阅转换工具，轻松转换各种订阅链接。",
        "icon": "https://img.icons8.com/?size=100&id=9917&format=png&color=000000",
        "category": "Cloudflare",
        "isPrivate": false
      }
    ],
    "在线工具": [
      {
        "name": "1024tools",
        "url": "https://1024tools.com/",
        "tips": "在线工具集，提供文本、图像、音频等多种处理功能，方便快捷。",
        "icon": "https://1024tools.com/favicon.ico",
        "category": "在线工具",
        "isPrivate": false
      },
      {
        "name": "JSON在线解析",
        "url": "https://www.json.cn/",
        "tips": "JSON在线解析工具，支持格式化、校验和转换JSON数据。",
        "icon": "https://static.json.cn/r/img/favicon/favicon.ico",
        "category": "在线工具",
        "isPrivate": false
      },
      {
        "name": "CTool工具",
        "url": "https://ctool.dev/",
        "tips": "多功能在线工具平台",
        "icon": "https://favicon.im/ctool.dev?larger=true",
        "category": "在线工具",
        "isPrivate": false
      },
      {
        "name": "obfuscator",
        "url": "https://obfuscator.io/",
        "tips": "在线工具，快速混淆和保护JavaScript代码，防止反编译和盗用。",
        "icon": "https://favicon.im/obfuscator.io?larger=true",
        "category": "在线工具",
        "isPrivate": false
      },
      {
        "name": "地址生成器",
        "url": "https://www.meiguodizhi.com/",
        "tips": "美国地址生成器，随机生成真实的美国地址，适用于各种测试需求。",
        "icon": "https://static11.meiguodizhi.com/favicon.ico",
        "category": "在线工具",
        "isPrivate": false
      },
      {
        "name": "itdog",
        "url": "https://www.itdog.cn/",
        "tips": "IT技术资讯与教程，涵盖编程、网络安全、云计算等领域。",
        "icon": "https://www.itdog.cn/favicon.ico",
        "category": "在线工具",
        "isPrivate": false
      }
    ],
    "论坛": [
      {
        "name": "LinuxDo",
        "url": "https://linux.do",
        "tips": "Linux学习社区与教程分享平台",
        "icon": "https://favicon.im/linux.do?larger=true",
        "category": "论坛",
        "isPrivate": false
      },
      {
        "name": "NodeLoc",
        "url": "https://nodeloc.com/",
        "tips": "NodeLoc服务器托管与网络解决方案",
        "icon": "https://favicon.im/nodeloc.com?larger=true",
        "category": "论坛",
        "isPrivate": false
      },
      {
        "name": "MJJBox资源",
        "url": "https://mjjbox.com/",
        "tips": "MJJBox资源分享平台",
        "icon": "https://favicon.im/mjjbox.com?larger=true",
        "category": "论坛",
        "isPrivate": false
      },
      {
        "name": "NodeSeek",
        "url": "https://www.nodeseek.com",
        "tips": "NodeSeek社区交流平台",
        "icon": "https://favicon.im/www.nodeseek.com?larger=true",
        "category": "论坛",
        "isPrivate": false
      }
    ],
    "域名管理": [
      {
        "name": "ZoneABC",
        "url": "https://zoneabc.net/dashboard",
        "tips": "ZoneABC域名管理",
        "icon": "https://zoneabc.net/logo.svg",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "netassist",
        "url": "https://tb.netassist.ua/",
        "tips": "ip6.arpa域名管理",
        "icon": "https://tunnelbroker.net/favicon.ico",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "tunnelbroker",
        "url": "https://tunnelbroker.net/",
        "tips": "ip6.arpa域名管理",
        "icon": "https://tunnelbroker.net/favicon.ico",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "Netlibre",
        "url": "https://www.netlib.re/",
        "tips": "netlib.re域名管理",
        "icon": "https://favicon.im/www.netlib.re?larger=true",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "Spaceship",
        "url": "https://www.spaceship.com/",
        "tips": "xyz域名管理",
        "icon": "https://spaceship-cdn.com/static/spaceship/favicon/spaceship-favicon.ico",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "Dpdns域名",
        "url": "https://dash.domain.digitalplat.org",
        "tips": "Dpdns域名管理",
        "icon": "https://icon.iori.nyc.mn/?url=domain.digitalplat.org",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "pp.ua域名",
        "url": "https://nic.ua/en",
        "tips": "pp.ua域名管理",
        "icon": "https://nic.ua/favicon.ico?version=v350",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "NYC域名",
        "url": "https://dash.publiczone.org/",
        "tips": "nyc.mn域名管理",
        "icon": "https://publiczone.org/assets/images/favicon/favicon.svg",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "DNSHE",
        "url": "https://my.dnshe.com/index.php?m=domain_hub",
        "tips": "DNSHE免费域名管理平台",
        "icon": "https://my.dnshe.com/favicon.ico",
        "category": "域名管理",
        "isPrivate": false
      },
      {
        "name": "I8 CLOUD",
        "url": "https://nic.gv.uy/",
        "tips": "I8 CLOUD：乌拉圭政府域名注册服务。",
        "icon": "https://favicon.im/nic.gv.uy?larger=true",
        "category": "域名管理",
        "isPrivate": false
      }
    ],
    "VPS": [
      {
        "name": "Google Cloud 控制台",
        "url": "https://console.cloud.google.com",
        "tips": "谷歌云控制台",
        "icon": "https://favicon.im/console.cloud.google.com?larger=true",
        "category": "VPS",
        "isPrivate": false
      },
      {
        "name": "Euserv",
        "url": "https://support.euserv.com/",
        "tips": "德鸡管理",
        "icon": "https://support.euserv.com/pic/euserv_logo_118x80.gif",
        "category": "VPS",
        "isPrivate": false
      },
      {
        "name": "MJJVM | 云服务器",
        "url": "https://www.mjjvm.com/service?groupid=305",
        "tips": "MJJVM云服务器，提供稳定可靠的云服务。",
        "icon": "https://www.mjjvm.com/upload/logo-colours.png",
        "category": "VPS",
        "isPrivate": false
      },
      {
        "name": "蛋蛋云",
        "url": "https://dandan.nyc.mn",
        "tips": "蛋蛋云VPS",
        "icon": "https://favicon.im/dandan.nyc.mn?larger=true",
        "category": "VPS",
        "isPrivate": false
      }
    ],
    "容器平台": [
      {
        "name": "Zeabur",
        "url": "https://zeabur.com/",
        "tips": "Zeabur是一个在线笔记和知识管理工具，支持Markdown编辑和协作功能。",
        "icon": "https://zeabur.com/logo.svg",
        "category": "容器平台",
        "isPrivate": false
      },
      {
        "name": "NorthFlank",
        "url": "https://northflank.com/",
        "tips": "Northflank 容器",
        "icon": "https://northflank.com/favicon.ico",
        "category": "容器平台",
        "isPrivate": false
      },
      {
        "name": "Railway",
        "url": "https://railway.com/",
        "tips": "railway 容器",
        "icon": "https://railway.com/favicons/favicon-light.ico",
        "category": "容器平台",
        "isPrivate": false
      },
      {
        "name": "ClawCloud",
        "url": "https://ap-southeast-1.run.claw.cloud/",
        "tips": "ClawCloud 容器",
        "icon": "https://ap-southeast-1.run.claw.cloud/icons/icon-512x512.png",
        "category": "容器平台",
        "isPrivate": false
      },
      {
        "name": "Koyeb",
        "url": "https://www.koyeb.com/",
        "tips": "koyeb 容器",
        "icon": "https://www.koyeb.com/favicon/favicon.ico",
        "category": "容器平台",
        "isPrivate": false
      },
      {
        "name": "Hugging Face",
        "url": "https://huggingface.co/",
        "tips": "Hugging Face 容器",
        "icon": "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
        "category": "容器平台",
        "isPrivate": false
      }
    ],
    "影视资源": [
      {
        "name": "MoonTV",
        "url": "https://moontv.661388.xyz/",
        "tips": "免费在线电视平台，提供多语种高清直播和VOD内容。",
        "icon": "https://favicon.im/moontv.661388.xyz?larger=true",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "无损音乐下载",
        "url": "https://flac.music.hi.cn/",
        "tips": "无损音乐下载",
        "icon": "https://flac.music.hi.cn/static/img/logo.png",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "热播之家",
        "url": "https://www.rebozj.pro/",
        "tips": "热播之家",
        "icon": "https://www.rebozj.pro/template/jianhei/statics/img/favicon.png",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "4K影视",
        "url": "https://www.4kvm.tv/",
        "tips": "4K影视",
        "icon": "https://www.4kvm.tv/wp-content/uploads/2020/07/c4b7f67bdfbd37.png",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "厂长资源",
        "url": "https://www.cz4k.com/",
        "tips": "厂长资源",
        "icon": "https://cf.hbcn.fun/wp-content/uploads/2021/10/5c7a67356cec28.ico",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "影猫仓库",
        "url": "https://www.ymck.pro/",
        "tips": "影猫仓库",
        "icon": "https://www.ymck.pro/upload/site/20230825-1/5c00fbcfb4ff0737d3c8320d30b2d1de.png",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "来看点播",
        "url": "https://lkvod.com/",
        "tips": "来看点播",
        "icon": "https://lkvod.com/upload/site/20241223-1/eb0f19bab937f4f3da69d1fa2b7c516c.png",
        "category": "影视资源",
        "isPrivate": false
      },
      {
        "name": "修罗影视",
        "url": "https://xl01.com.de/",
        "tips": "修罗影视",
        "icon": "https://xl01.com.de/images/favicon.png",
        "category": "影视资源",
        "isPrivate": false
      }
    ],
    "接码平台": [
      {
        "name": "LotHelper",
        "url": "https://www.lothelper.com/cn/shownumber",
        "tips": "提供多国临时号码用于在线接收短信",
        "icon": "https://www.lothelper.com/image/favicon.png",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "mianfeijiema",
        "url": "https://mianfeijiema.com/",
        "tips": "提供临时手机号用于接收短信和激活",
        "icon": "https://mianfeijiema.com/static/picture/logo.png",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "5sim",
        "url": "https://5sim.net/",
        "tips": "提供临时手机号用于接收短信和激活",
        "icon": "https://5sim.net/favicon-32x32.png",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "clearcode",
        "url": "https://clearcode.cn/",
        "tips": "在线接收短信验证码的虚拟号码平台",
        "icon": "https://clearcode.cn/static/tw/logo.png",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "receive-sms",
        "url": "https://receive-sms-online.info/",
        "tips": "免费在线接码",
        "icon": "https://receive-sms-online.info/favicon.ico",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "smsonline",
        "url": "https://www.smsonline.cloud/zh",
        "tips": "全球领先的云存储平台，提供安全、可靠、易用的存储服务，支持文件共享、协作和数据同步。",
        "icon": "https://www.smsonline.cloud/favicon.ico",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "sms-activate",
        "url": "https://sms-activate.io/cn/freeNumbers",
        "tips": "免费虚拟号码",
        "icon": "https://smsactivate.s3.eu-central-1.amazonaws.com/assets/img/activate_favicon32.png",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "smser",
        "url": "https://smser.net/",
        "tips": "免费在线接码",
        "icon": "https://smser.net/img/smser.net/favicon.ico?v=1.2",
        "category": "接码平台",
        "isPrivate": false
      },
      {
        "name": "temp-number",
        "url": "https://temp-number.com/",
        "tips": "免费接码",
        "icon": "https://temp-number.com/img/favicon.ico",
        "category": "接码平台",
        "isPrivate": false
      }
    ]
  }
};
