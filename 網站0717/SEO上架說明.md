# 繁花 BLOSSOM AGENT ・ Google 上架說明

> 更新日期：2026-08-19
> 本文件記錄「已經做完什麼」與「你要自己動手做什麼」。

---

## 一、已完成的修改（不需再動）

### 1. 移除首頁封鎖標籤 ✅

`index.html` 原本有這一行，等於明確叫 Google 不要收錄整站：

```html
<meta name="robots" content="noindex, nofollow">
```

已改為：

```html
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
```

### 2. 新增根目錄檔案 ✅

| 檔案 | 說明 |
|---|---|
| `robots.txt` | 全站開放收錄，並指向 sitemap |
| `sitemap.xml` | 19 個網址，已逐一比對過檔案確實存在（無 404） |

### 3. 每一頁補齊 head 標籤 ✅

以下 19 頁全部補上 `title`／`description`／`robots`／`canonical`／`og:*`／`twitter:card`／`favicon`／成人內容 RTA 標示：

| 頁面 | title |
|---|---|
| `/` | 繁花 BLOSSOM AGENT｜台北酒店經紀公司 |
| `/main_profit.html` | 台北酒店經紀｜透明分潤・彈性排班｜繁花 |
| `/main_cultivate.html` | 酒店新人培育計劃｜零經驗也能開始｜繁花 |
| `/faq.html` | 酒店經紀常見問答｜薪水、壓檔、隱私一次說清楚 |
| `/journey.html` | 理念與培育旅程｜繁花 BLOSSOM AGENT |
| `/quiz.html` | 花格測驗｜妳是十二花中的哪一朵｜繁花 |
| `/types.html` | 十二花格類型介紹｜繁花 BLOSSOM AGENT |
| `/alcohol-calculator.html` | 酒精計算機｜血中酒精濃度 BAC 線上試算 |
| `/dice_games/game-lobby.html` | 繁花酒桌｜十款經典骰子遊戲玩法與線上試玩 |
| `/dice_games/game-18la.html` | 十八啦怎麼玩？十八骰子（碗公）規則 |
| `/dice_games/game-liardice.html` | 吹牛骰子怎麼玩？Liar's Dice 規則與叫牌 |
| `/dice_games/game-niuniu.html` | 妞妞怎麼玩？骰子妞妞規則與算點 |
| `/dice_games/game-huapei.html` | 話呸怎麼玩？Poker Dice 牌型大小 |
| `/dice_games/game-redblack.html` | 紅黑單雙怎麼玩？規則與生死關 |
| `/dice_games/game-toothpull.html` | 拔牙怎麼玩？骰子拔牙遊戲規則 |
| `/dice_games/game-wugu.html` | 烏骨雞怎麼玩？比紅點規則說明 |
| `/dice_games/game-knock.html` | 敲敲杯怎麼玩？酒桌骰子遊戲規則 |
| `/dice_games/game-789.html` | 7加8減9怎麼玩？酒桌公杯遊戲規則 |
| `/dice_games/game-350.html` | 三百五怎麼玩？七顆骰湊分規則 |

> **骰子遊戲頁改為開放收錄**（原建議是 `Disallow`）。理由：那 11 頁是全站唯一沒有競爭對手、又有真實搜尋量的內容——「十八啦怎麼玩」「吹牛骰子規則」「妞妞算點」這類長尾字幾乎沒人在搶。它們是把陌生流量帶進站內的免費入口，封起來太可惜。每頁的 description 都是照該頁 HTML 註解裡的實際規則寫的，沒有捏造。

### 4. 結構化資料已內嵌（不需再貼） ✅

19 個 JSON-LD 區塊已直接寫進各頁 `<head>`，全部通過 JSON 解析驗證：

- `index.html` → `Organization` + `WebSite`
- `main_profit.html` → `WebPage` + `Service` + `BreadcrumbList`
- `main_cultivate.html` → `WebPage` + `Service` + `BreadcrumbList`
- `faq.html` → `FAQPage`（**12 題，逐字對照頁面上真實存在的問答**）+ `BreadcrumbList`
- `journey.html` → `AboutPage` + `BreadcrumbList`
- `quiz.html` / `types.html` → `WebPage` + `BreadcrumbList`
- `alcohol-calculator.html` → `WebApplication` + `BreadcrumbList`
- 骰子遊戲頁 → `Game` + `BreadcrumbList`；大廳為 `CollectionPage`

> 舊版的 `structured-data.html` 草稿裡那 8 題 FAQ 跟網站上實際的 12 題**對不起來**（例如草稿寫「薪水每週統一發放」，實際頁面寫的是「隔週六發放」）。結構化資料的內容必須與頁面可見文字一致，否則 Google 會判定為 spam。現在已全部改用頁面真實文字，那份草稿檔可以丟掉。

### 5. 新增素材 ✅

| 檔案 | 用途 |
|---|---|
| `assets/og-cover.jpg` | 1200×630、74 KB，社群分享縮圖（LINE／FB／IG 貼連結時顯示）。採用名片背面設計：方印 + 品牌 + 標語「讓每一朵花，盛開成自己。」+ 七花條 + 網址。原本指定的 `Stamp_Vert.png` 是 3272×1884、2 MB，比例與檔案大小都不符合 OG 規格 |
| `assets/favicon.svg` | 瀏覽器分頁圖示（朱紅印章「繁」），1 KB |
| `assets/_og-source.html` | **上圖的原稿**。用瀏覽器開啟即為 1200×630 的畫面；日後想改標語或配色改這一檔，再重新截圖存成 `og-cover.jpg` 即可（已標 `noindex`，不會進搜尋結果） |

> 重新產圖指令（Chrome 無頭模式，2 倍解析度後再縮到 1200×630 讓文字更銳利）：
>
> ```powershell
> & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
>   --hide-scrollbars --force-device-scale-factor=2 --window-size=1200,630 `
>   --screenshot="assets\_og-raw.png" "file:///<專案路徑>/assets/_og-source.html"
> ```

### 6. 其他修正 ✅

- `types.html` 12 張花朵圖補上 `alt` 文字並加 `loading="lazy"` → 可吃到 Google 圖片搜尋流量
- `index.html` 首頁閘門文案補上「台北酒店娛樂經紀公司」字樣（首頁原本可見文字幾乎沒有關鍵字）
- `blossom-namecard.html`（名片範本）標記 `noindex`
- `_m.html` 標記 `noindex, nofollow` — **這是內部截圖工具，指向 `localhost:8811`，請不要上傳到正式站**

---

## 二、你要自己動手做的事

### 步驟 1：上傳檔案到主機根目錄

確認以下兩個網址在瀏覽器直接打得開：

- `https://blossom-agent.com/robots.txt`
- `https://blossom-agent.com/sitemap.xml`

打不開就是沒放在根目錄，Google 一定找不到。

### 步驟 2：Google Search Console

1. 前往 [search.google.com/search-console](https://search.google.com/search-console)
2. 新增資源 →「**網域**」→ 輸入 `blossom-agent.com`
3. 驗證所有權，擇一：
   - **DNS（最推薦）**：到網域商後台加一筆 TXT 記錄。最穩定，換主機也不會失效
   - **HTML 檔案**：下載 Google 給的 `google xxxxx.html`，丟到網站根目錄
   - **HTML 標記**：把 `<meta name="google-site-verification" content="...">` 貼進 `index.html` 的 `<head>`
4. 驗證成功後 → 左側「**Sitemap**」→ 輸入 `sitemap.xml` → 提交
5. 左側「**網址檢查**」→ 逐一貼上下列網址 → 點「**要求建立索引**」（一天上限約 10 筆，先做這 5 個）：
   - `https://blossom-agent.com/`
   - `https://blossom-agent.com/main_profit.html`
   - `https://blossom-agent.com/main_cultivate.html`
   - `https://blossom-agent.com/faq.html`
   - `https://blossom-agent.com/dice_games/game-lobby.html`

**時間預期**：提交後通常 3 天～2 週開始出現。用 `site:blossom-agent.com` 在 Google 搜尋可以查目前收錄狀況。

### 步驟 3：順手做的兩件事

- **Bing Webmaster Tools**：可直接從 Search Console 一鍵匯入，兩分鐘搞定，多一個流量來源
- **驗證結構化資料**：把每一頁網址貼進 [Google 複合式搜尋結果測試](https://search.google.com/test/rich-results) 跑一次

---

## 三、重要提醒與限制

### 網址一律帶 `.html`

canonical、sitemap、og:url 全部採用 `https://blossom-agent.com/xxx.html`，與站內連結（`href="main_profit.html"`）完全一致。

> ⚠️ **如果日後改用 Netlify / Vercel / Cloudflare Pages**，這些平台預設會把 `/main_profit.html` 301 轉向 `/main_profit`。那時必須把全站的 canonical、sitemap、og:url 一起改成無副檔名版本，否則同一頁會有兩個網址在互相分散權重。

### FAQ 複合式搜尋結果已被 Google 限縮

2023 年 8 月起，Google 只對政府與醫療類權威網站顯示 FAQ 摘要，一般商業網站看不到那個展開式問答了。`FAQPage` 標記仍然值得保留（幫助 Google 理解頁面、也被 AI 搜尋工具引用），但**不要期待搜尋結果頁會直接展開問答**。

### 這個產業的天花板

- **Google Ads 付費廣告基本上不會過審**（成人娛樂類目），SEO 是主要管道
- 部分核心關鍵字（如「酒店經紀」單字）競爭激烈且可能被降權，實際效果會集中在：
  - 品牌字：「繁花經紀」「blossom agent」
  - 長尾字：「酒店經紀 壓檔」「酒店 沒經驗 可以做嗎」「酒店 薪水 怎麼算」
  - 工具／遊戲字：「十八啦怎麼玩」「吹牛骰子規則」「血中酒精濃度計算」
- **FAQ 頁與骰子遊戲頁是全站最有機會排上去的資產**，值得持續增加內容

---

## 四、上線後檢查清單

- [ ] `robots.txt` 上傳根目錄並可公開訪問
- [ ] `sitemap.xml` 上傳根目錄，19 個網址逐一點過確認無 404
- [ ] `assets/og-cover.jpg` 與 `assets/favicon.svg` 一併上傳
- [ ] `_m.html` **沒有**被上傳到正式站
- [ ] 用 LINE 傳一次網址，確認分享縮圖正常顯示
- [ ] Search Console 完成驗證並提交 sitemap
- [ ] 主要 5 頁送出「要求建立索引」
- [ ] 一週後用 `site:blossom-agent.com` 查收錄狀況
- [ ] 一個月後看 Search Console「成效」報表，找出已有曝光但排名 10-30 名的關鍵字，針對那些字補內容
