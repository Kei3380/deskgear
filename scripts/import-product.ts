import fs from "fs";
import path from "path";

/**
 * .env.local または .env ファイルから環境変数を読み込む簡易パーサー
 */
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {
    keyword: "auto",
    category: "auto",
    limit: "1",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
      options[key] = val;
    }
  }

  return options;
}

// 自動更新用の人気ガジェット検索キーワードプール
const AUTO_KEYWORDS = [
  "Logicool ワイヤレス キーボード",
  "Logicool ゲーミングマウス",
  "Anker 急速充電器 USB-C",
  "Anker モバイルバッテリー",
  "Dell 27インチ 4K モニター",
  "Pixio ゲーミングモニター",
  "eMeet Webカメラ 静音マイク",
  "REALFORCE 静電容量無接点 キーボード",
  "エレコム トラックボールマウス",
  "サンワダイレクト 電源タップ",
  "1Password パスワード管理",
  "ASUS ノートパソコン Ryzen",
  "Lenovo IdeaPad Slim ノートパソコン",
  "GMKtec ミニPC Ryzen",
  "SanDisk ポータブル SSD",
];

type RakutenItem = {
  itemCode: string;
  itemName: string;
  itemPrice: number;
  reviewAverage: number;
  mediumImageUrls?: { imageUrl: string }[];
  smallImageUrls?: { imageUrl: string }[];
  affiliateUrl: string;
  itemCaption?: string;
  shopName?: string;
};

// 楽天APIから商品検索（最新 OpenAPI 対応）
async function fetchRakutenItems(
  keyword: string,
  appId: string,
  accessKey: string,
  affiliateId: string,
  limit: number
): Promise<RakutenItem[]> {
  const queryParams = new URLSearchParams({
    format: "json",
    keyword,
    applicationId: appId,
    accessKey: accessKey,
    hits: String(limit),
    sort: "-reviewCount",
    elements:
      "itemCode,itemName,itemPrice,reviewAverage,mediumImageUrls,smallImageUrls,affiliateUrl,itemCaption,shopName",
  });

  if (affiliateId) {
    queryParams.set("affiliateId", affiliateId);
  }

  const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?${queryParams.toString()}`;

  const referer = process.env.RAKUTEN_API_REFERER || "http://localhost:3000/";
  const origin = referer.replace(/\/$/, "");

  const response = await fetch(url, {
    headers: {
      Origin: origin,
      Referer: referer,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`楽天APIエラー (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.Items || !Array.isArray(data.Items)) {
    return [];
  }

  return data.Items.map((itemObj: { Item: RakutenItem }) => itemObj.Item);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectManufacturer(itemName: string, shopName?: string): string {
  const knownBrands = [
    "ロジクール",
    "Logicool",
    "Anker",
    "アンカー",
    "Dell",
    "デル",
    "ASUS",
    "エイスース",
    "Lenovo",
    "レノボ",
    "HP",
    "ヒューレットパッカード",
    "Apple",
    "アップル",
    "eMeet",
    "イーミート",
    "サンワサプライ",
    "サンワダイレクト",
    "エレコム",
    "ELECOM",
    "REALFORCE",
    "リアルフォース",
    "富士通",
    "NEC",
    "Pixio",
    "アイリスオーヤマ",
    "GMKtec",
    "MINISFORUM",
    "ソースネクスト",
    "トレンドマイクロ",
    "ノートン",
  ];

  for (const brand of knownBrands) {
    if (itemName.includes(brand) || (shopName && shopName.includes(brand))) {
      return brand;
    }
  }

  return shopName || "ノーブランド";
}

type ArticleGenerated = {
  slug: string;
  title: string;
  manufacturer: string;
  release_date: string | null;
  category: string;
  tags: string[];
  pros: string[];
  cons: string[];
  rating: number;
  review_content: string;
};

const VALID_CATEGORIES = [
  "desktop",
  "laptop",
  "monitor",
  "keyboard",
  "mouse",
  "headset",
  "webcam",
  "security",
  "accessory",
];

// Gemini API を使用して記事・Frontmatterメタデータを高度自動生成
async function generateArticleWithGemini(
  item: RakutenItem,
  inputCategory: string,
  apiKey: string
): Promise<ArticleGenerated> {
  const prompt = `あなたはプロのガジェット・PC周辺機器専門解説ライターです。
以下の楽天商品情報から、読者の購買意欲と信頼感を高めるWebサイト記事用のFrontmatterメタデータおよびレビュー本文を生成し、JSONフォーマットのみで返答してください。

【商品情報】
商品名: ${item.itemName}
価格: ${item.itemPrice}円
評価平均: ${item.reviewAverage}
指定されたカテゴリ（autoの場合は以下から自動判定）: ${inputCategory}
商品説明: ${item.itemCaption?.slice(0, 400) || "なし"}

【有効なカテゴリ一覧】
- desktop (デスクトップパソコン)
- laptop (ノートパソコン)
- monitor (モニター・ディスプレイ)
- keyboard (キーボード)
- mouse (マウス・トラックボール)
- headset (ヘッドセット・イヤホン)
- webcam (Webカメラ)
- security (セキュリティソフト・ライセンス)
- accessory (PCアクセサリ・ケーブル・ハブ等)

【出力JSONフォーマット仕様】
{
  "slug": "製品名に基づく英語小文字とハイフンのみのスラッグ (例: logicool-mx-keys-mini)",
  "title": "検索意図に響くわかりやすい日本語商品タイトル (50文字以内。店舗固有のセール表記【SALE】等は除去すること)",
  "manufacturer": "メーカー/ブランド名 (例: ロジクール, Anker, Dell)",
  "category": "有効なカテゴリ一覧から1つを選択",
  "release_date": "YYYY-MM 形式の発売年月。不明な場合は null",
  "rating": ${item.reviewAverage > 0 ? item.reviewAverage : 4.5},
  "tags": ["検索用タグ4〜5個"],
  "pros": ["読者の背中を押す具体的一言メリット4選"],
  "cons": ["購入前に知るべき客観的デメリット2〜3選"],
  "review_content": "Markdown形式のレビュー本文。以下の見出し構造を必ず含めること：\n\n製品の概要および特徴の魅力的な解説（100〜150文字）。\n\n## こんな人におすすめ\n\n- 具体的なターゲットユーザー層1\n- 具体的なターゲットユーザー層2\n- 具体的なターゲットユーザー層3\n\n## 注意点\n\n購入前に気を付けるべき注意点やサイズ感・互換性についての補足説明。"
}`;

  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-flash-latest",
  ];

  let lastError: Error | null = null;
  for (const model of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`[${model}] API エラー (${response.status}): ${errText}`);
      }

      const resultData = await response.json();
      const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error(`[${model}] レスポンスが空です。`);

      const parsed = JSON.parse(text) as ArticleGenerated;
      if (!VALID_CATEGORIES.includes(parsed.category)) {
        parsed.category = inputCategory !== "auto" ? inputCategory : "accessory";
      }
      return parsed;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`モデル ${model} 呼び出し一時失敗、別モデルへ切り替えます...`);
    }
  }

  throw lastError || new Error("すべてのGeminiモデル呼び出しに失敗しました。");
}

function generateArticleFallback(
  item: RakutenItem,
  inputCategory: string
): ArticleGenerated {
  const manufacturer = detectManufacturer(item.itemName, item.shopName);
  const cleanTitle = item.itemName
    .replace(/【.*?】/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/★.*?★/g, "")
    .trim()
    .slice(0, 45);
  const baseSlug =
    slugify(cleanTitle) || `gadget-${Math.random().toString(36).substring(2, 8)}`;

  let category = inputCategory;
  if (category === "auto") {
    const nameLower = item.itemName.toLowerCase();
    if (nameLower.includes("キーボード") || nameLower.includes("keyboard")) category = "keyboard";
    else if (nameLower.includes("マウス") || nameLower.includes("mouse") || nameLower.includes("トラックボール")) category = "mouse";
    else if (nameLower.includes("モニター") || nameLower.includes("ディスプレイ") || nameLower.includes("monitor")) category = "monitor";
    else if (nameLower.includes("ヘッドセット") || nameLower.includes("イヤホン") || nameLower.includes("headset")) category = "headset";
    else if (nameLower.includes("カメラ") || nameLower.includes("webcam")) category = "webcam";
    else if (nameLower.includes("ノート") || nameLower.includes("laptop")) category = "laptop";
    else if (nameLower.includes("デスクトップ") || nameLower.includes("desktop") || nameLower.includes("pc本体")) category = "desktop";
    else if (nameLower.includes("セキュリティ") || nameLower.includes("1password") || nameLower.includes("ウイルス")) category = "security";
    else category = "accessory";
  }

  return {
    slug: baseSlug,
    title: cleanTitle,
    manufacturer,
    category,
    release_date: null,
    rating: item.reviewAverage > 0 ? item.reviewAverage : 4.3,
    tags: [category, manufacturer, "正規品"],
    pros: [
      "コストパフォーマンスに優れた設計",
      "使い勝手の良い機能性を凝縮",
      "信頼性の高い人気モデル",
      "デスク環境に馴染むスタイリッシュなデザイン",
    ],
    cons: ["詳細な仕様は販売ページをご確認ください"],
    review_content: `${cleanTitle}の製品概要。充実した基本機能を備え、日常の作業効率化やデスク環境のアップグレードに最適なアイテムです。

## こんな人におすすめ

- 信頼性の高い製品を手頃な価格で手に入れたい人
- 定番のデスク周辺機器を探している人
- 作業環境の快適性を向上させたい人

## 注意点

購入前に製品のサイズや接続規格を販売ページでご確認ください。`,
  };
}

function getNextGadgetId(): string {
  const productsDir = path.join(process.cwd(), "content", "products");
  if (!fs.existsSync(productsDir)) return "GADGET-0001";

  const files = fs.readdirSync(productsDir).filter((f) => f.endsWith(".md"));
  let maxId = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(productsDir, file), "utf8");
    const match = content.match(/id:\s*"GADGET-(\d+)"/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxId) maxId = num;
    }
  }

  const nextNum = maxId + 1;
  return `GADGET-${String(nextNum).padStart(4, "0")}`;
}

async function main() {
  const args = parseArgs();
  let keyword = args.keyword;
  const category = args.category;
  const limit = parseInt(args.limit, 10) || 1;
  const isDryRun = args["dry-run"] === "true";

  if (!keyword || keyword === "auto") {
    const randomIndex = Math.floor(Math.random() * AUTO_KEYWORDS.length);
    keyword = AUTO_KEYWORDS[randomIndex];
    console.log(`🤖 検索キーワードが未指定のため、自動プールから「${keyword}」を選定しました。`);
  }

  const appId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || "";
  const geminiKey = process.env.GEMINI_API_KEY;

  console.log("==========================================");
  console.log(" 🚀 楽天API × Gemini 商品自動追加スクリプト");
  console.log("==========================================");

  if (!appId || !accessKey) {
    console.warn(
      "⚠️ 警告: .env.local に RAKUTEN_APPLICATION_ID または RAKUTEN_ACCESS_KEY が設定されていません。"
    );
    process.exit(1);
  }

  console.log(`🔍 検索キーワード: "${keyword}" (カテゴリ指定: ${category}, 件数: ${limit})`);
  let items: RakutenItem[] = [];
  try {
    items = await fetchRakutenItems(keyword, appId, accessKey, affiliateId, limit);
    if (items.length > 0) {
      console.log(`📦 楽天APIより ${items.length} 件の商品を取得しました。\n`);
    } else {
      console.log("⚠️ 条件に一致する楽天商品が見つかりませんでした。AI生成モードへ切り替えます。");
    }
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    console.warn(`⚠️ 楽天APIより取得一時失敗 (${errMessage})。`);
    console.log(`🤖 キーワード「${keyword}」に基づくAI商品情報自動生成モードで処理を継続します。\n`);

    const fallbackImg = keyword.includes("カメラ") || keyword.includes("Web")
      ? "/images/products/emeet-webcam.jpg"
      : "/images/products/lenovo-ideapad-slim.jpg";

    items = [
      {
        itemCode: `fallback-${Date.now()}`,
        itemName: keyword,
        itemPrice: 24800,
        reviewAverage: 4.5,
        affiliateUrl: "https://hb.afl.rakuten.co.jp/",
        itemCaption: `${keyword} のおすすめ最新ガジェット製品。高パフォーマンスで作業効率を向上させます。`,
        shopName: "楽天公式ショップ",
        mediumImageUrls: [{ imageUrl: fallbackImg }],
      },
    ];
  }

  if (items.length === 0) {
    console.log("⚠️ 処理対象の商品データがありません。");
    return;
  }

  const outputDir = path.join(process.cwd(), "content", "products");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`------------------------------------------`);
    console.log(`[${i + 1}/${items.length}] 処理中: ${item.itemName.slice(0, 40)}...`);

    let article: ArticleGenerated;
    if (geminiKey) {
      console.log("🤖 Gemini API で高度なレビュー文章とメタデータを自動生成中...");
      try {
        article = await generateArticleWithGemini(item, category, geminiKey);
      } catch (err) {
        console.warn("⚠️ Gemini API 呼び出し失敗。フォールバック処理を実行します:", err);
        article = generateArticleFallback(item, category);
      }
    } else {
      console.log("ℹ️ GEMINI_API_KEY が未設定のため、スマートフォールバック抽出を実行します。");
      article = generateArticleFallback(item, category);
    }

    const gadgetId = getNextGadgetId();
    const image = item.mediumImageUrls?.[0]?.imageUrl || item.smallImageUrls?.[0]?.imageUrl || "";

    const yamlFrontmatter = `---
id: "${gadgetId}"
status: "published"
title: ${JSON.stringify(article.title)}
manufacturer: ${JSON.stringify(article.manufacturer)}
release_date: ${article.release_date ? JSON.stringify(article.release_date) : "null"}
category: ${JSON.stringify(article.category)}
price: ${item.itemPrice}
rating: ${article.rating}
tags: ${JSON.stringify(article.tags)}
pros:
${article.pros.map((p) => `  - ${JSON.stringify(p)}`).join("\n")}
cons:
${article.cons.map((c) => `  - ${JSON.stringify(c)}`).join("\n")}
affiliate_links:
  amazon: ""
  rakuten: ${JSON.stringify(item.affiliateUrl)}
image: ${JSON.stringify(image)}
---

${article.review_content}
`;

    const fileName = `${article.slug}.md`;
    const filePath = path.join(outputDir, fileName);

    if (isDryRun) {
      console.log(`[DRY RUN] 出力ファイルパス: ${filePath}`);
      console.log(`[DRY RUN] 内容:\n${yamlFrontmatter}`);
    } else {
      fs.writeFileSync(filePath, yamlFrontmatter, "utf8");
      console.log(`✅ 作成完了: content/products/${fileName} (ID: ${gadgetId}, カテゴリ: ${article.category})`);
    }
  }

  console.log("\n==========================================");
  console.log("🎉 すべての処理が完了しました！");
  console.log("==========================================");
}

main().catch((err) => {
  console.error("❌ スクリプト実行エラー:", err);
  process.exit(1);
});
