# 機能仕様書

このドキュメントは `requirements.md`（要件定義書）を実現するために実施した実装内容を、作業単位ごとに記録する。実装が進むたびに追記する。

関連ドキュメント: `requirements.md`（要件定義書）, `claude.md`（開発ルール）

---

## 更新履歴

| 日付       | 内容                                                         |
| ---------- | ------------------------------------------------------------ |
| 2026-09-01 | プロジェクト初期セットアップ、shadcn/ui導入、ダークテーマ適用 |
| 2026-09-01 | トップページのレイアウト実装（モックデータ利用）              |
| 2026-09-01 | Markdownデータモデル・パーサー構築、トップページへの実データ組み込み |
| 2026-09-01 | 検索結果ページ実装（絞り込み・ソート）                        |
| 2026-09-01 | 商品詳細（レビュー）ページ実装                                |
| 2026-09-01 | データモデルに`id`/`status`追加（要件定義書改訂に伴う対応）   |
| 2026-09-01 | SEO/AIO対策: 商品詳細ページへのJSON-LD（Product/Review）出力  |
| 2026-09-03 | カテゴリ拡張（ノートパソコン/デスクトップパソコン）、商品画像の実表示対応、Amazonリンク未設定時のボタン非表示対応、発売日未定（`releaseDate: null`）対応、初の実アフィリエイト商品（楽天）を追加 |
| 2026-09-03 | 実アフィリエイト商品2件目（ロジクール ERGO M575SP、既存カテゴリ`mouse`）を追加。コード変更なし |
| 2026-09-03 | 実アフィリエイト商品3件目（ロジクール C270n Webカメラ、既存カテゴリ`webcam`）を追加。コード変更なし |
| 2026-09-03 | 実アフィリエイト商品4件目（Dell E2425HM モニター、既存カテゴリ`monitor`）を追加。コード変更なし |

---

## 1. プロジェクト初期セットアップ

### 概要
`create-next-app` によるNext.jsプロジェクトの雛形作成。

### 技術スタック（確定バージョン）
- Next.js 16.3.3（App Router）
- React 19.2.8
- TypeScript 5.9.3
- Tailwind CSS 4.3.3
- ESLint 9.39.5 / eslint-config-next
- パッケージマネージャー: pnpm 11.25.0

### 構成
- `src/` ディレクトリ構成を採用
- import alias: `@/*`
- ルーティング: App Router（`src/app/`）

### 補足
- 既存の `requirements.md` / `claude.md` を保持したまま、一時フォルダ経由で雛形ファイルを安全に統合。
- Windowsはファイル名の大小文字を区別しないため、`create-next-app` が生成する `CLAUDE.md`（Next.js標準のAGENTS.md参照ファイル）は、本プロジェクトのルールファイル `claude.md` と同一パス扱いになる。**上書き事故を防ぐため、生成された `CLAUDE.md` は採用せず破棄した。** `AGENTS.md` は別名のためそのまま残置。

---

## 2. UIコンポーネントライブラリ（shadcn/ui）導入

### 概要
要件定義の技術スタックに従い、`shadcn/ui` を導入。

### 実行コマンド
```
pnpm dlx shadcn@latest init -d
```

### 追加された依存パッケージ
- `class-variance-authority`, `clsx`, `tailwind-merge`（クラス名結合ユーティリティ）
- `lucide-react`（アイコンライブラリ）
- `tw-animate-css`（Tailwind v4向けアニメーションユーティリティ）
- `@base-ui/react`, `shadcn`（CLI/ランタイムが自動追加）

### 設定（`components.json`）
- style: `base-nova`
- baseColor: `neutral`
- cssVariables: `true`
- iconLibrary: `lucide`
- aliases: `@/components`, `@/lib`, `@/hooks` 等

### 生成ファイル
- `src/components/ui/button.tsx`（最初のUIコンポーネント）
- `src/lib/utils.ts`（`cn()` ヘルパー）

---

## 3. ダーク＆テック系テーマの適用

### 概要
要件定義 5章「UI/UXとデザイン方針」に基づき、サイト全体を黒ベースの常時ダークテーマに固定。

### 変更ファイル
- `src/app/globals.css`
  - `.dark` の背景・カード・ボーダー等をより黒に近い低輝度パレットに調整
  - `primary` / `ring` / `accent` にテック系のシアンブルー（`oklch(0.75 0.15 220)`）を採用
  - アフィリエイトCTAボタン用のCSS変数を新規追加:
    - `--cta` / `--cta-foreground`（Amazonオレンジ系、高コンバージョン狙い）
    - `--rakuten` / `--rakuten-foreground`（楽天レッド系）
  - 上記をTailwindユーティリティとして利用可能に（`bg-cta`, `text-cta-foreground`, `bg-rakuten`, `text-rakuten-foreground` 等）
- `src/app/layout.tsx`
  - `<html>` 要素に `dark` クラスを常時付与し、ライト/ダークの切り替えなしでダークテーマ固定表示とした

### 動作確認
- `pnpm build` 成功
- `pnpm dev` を起動し、Chromeブラウザで黒ベース背景・白文字のレンダリングを目視確認済み

---

## 4. トップページのレイアウト実装

### 概要
要件定義 2章「フロントエンド画面 > トップページ」の3要素（注目のカテゴリ一覧、総合おすすめランキングベスト10、絞り込み検索パネル）を実装。

### 追加した shadcn/ui コンポーネント
```
pnpm dlx shadcn@latest add card badge input label select separator
```
`components.json` の style（base-nova）が `@base-ui/react` ベースのため、追加の `@radix-ui/*` パッケージは発生せず、`package.json` への新規依存追加はなし。

### 実装したデータモデル・型
- `src/types/product.ts`
  - `Product` 型: `requirements.md` 3章のFrontmatterスキーマ（snake_case）をcamelCaseに変換した形で定義（`releaseDate`, `affiliateLinks` 等）。Markdownパーサー実装時にこの型へマッピングする。
  - `Category` 型: `slug` / `label`
- `src/lib/mock-data.ts`
  - `mockCategories`（6カテゴリ: キーボード/マウス/モニター/ヘッドセット/Webカメラ/PCアクセサリ）
  - `mockRankedProducts`（10件のダミー商品データ）
  - **Markdownデータモデル・パーサー実装後、実データ読み込みに置き換える想定の仮データ。**

### 実装コンポーネント
| ファイル                                        | 役割                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `src/components/layout/site-header.tsx`         | サイトヘッダー（ロゴ、グローバルナビ）                            |
| `src/components/home/category-grid.tsx`         | 注目のカテゴリ一覧（アイコン付きカードグリッド、`/search?category=`へリンク） |
| `src/components/home/ranking-list.tsx`          | 総合おすすめランキングベスト10（順位バッジ、評価、価格、Amazon/楽天CTAボタン） |
| `src/components/home/search-panel.tsx`          | 絞り込み検索パネル（カテゴリ/価格帯/評価/並び替え、`/search`へcrud遷移するクライアントコンポーネント） |
| `src/app/page.tsx`                              | 上記を組み合わせたトップページ本体                                 |

### UIコンポーネントの拡張
- `src/components/ui/button.tsx` に `variant="cta"`（Amazonオレンジ）と `variant="rakuten"`（楽天レッド）を追加。商品詳細ページ実装時にも再利用する想定。

### 既知の制約・今後の対応
- 商品画像は実データ未整備のため、プレースホルダー（アイコン）表示。
- カテゴリカード・ランキングカード・検索パネルからのリンク先（`/search`, `/products/[slug]`）は未実装のため、遷移すると404になる（検索結果ページ・商品詳細ページの実装時に解消）。

### 動作確認
- `pnpm build` / `pnpm lint` エラーなし
- `pnpm dev` を起動しChromeで目視確認:
  - ダークテーマ・CTAカラー（オレンジ/レッド）の表示
  - カテゴリ/評価/並び替えのSelectドロップダウンの開閉・選択・日本語ラベル表示
  - 検索パネルの「この条件で検索」から `/search?category=keyboard&sort=rating_desc` へのクエリ付き遷移

---

## 5. Markdownデータモデル・パーサー構築

### 概要
要件定義 3章のデータモデルに従い、`/content/products/` 配下のMarkdownファイルから商品データを読み込む仕組みを構築。トップページのランキング表示をモックデータから実データに置き換えた。

### 追加した依存パッケージ
```
pnpm add gray-matter remark remark-html
```
- `gray-matter`: Frontmatter（YAML）とMarkdown本文の分離・パース
- `remark` + `remark-html`: Markdown本文をHTML文字列に変換（商品詳細ページ用）

### コンテンツ
- `content/products/*.md` を10件作成。Frontmatterは要件定義書のスキーマ（snake_case: `release_date`, `affiliate_links` 等）に準拠。本文にはMarkdownで簡単な紹介文・「こんな人におすすめ」セクションを記述。

### パーサー実装（`src/lib/products.ts`）
- `getAllProducts(): Product[]` — 全商品のFrontmatterのみを同期的に読み込み（一覧・ランキング表示用、本文変換なしで高速）
- `getProductBySlug(slug): Promise<{ product, contentHtml } | null>` — 個別商品のFrontmatter取得とMarkdown本文のHTML変換（商品詳細ページ実装時に使用予定）
- `getRankedProducts(limit?): Product[]` — 評価（`rating`）降順でソートした商品一覧
- Frontmatterのsnake_caseキーは `Product` 型（camelCase）に変換して返す

### カテゴリ定義の整理
- カテゴリの表示名・アイコンとの対応は商品Markdownからではなく、`src/lib/categories.ts`（旧 `mock-data.ts`）の `CATEGORIES` で一元管理する方針に整理。商品Frontmatterの `category` はこの `slug` と対応させる。
- `src/lib/mock-data.ts` は削除（商品モックデータの役目を終えたため）。

### 変更ファイル
- 新規: `src/lib/products.ts`, `src/lib/categories.ts`, `content/products/*.md`（10ファイル）
- 更新: `src/app/page.tsx`（`getRankedProducts(10)` を呼び出しPropsで渡す）, `src/components/home/ranking-list.tsx`（`products` propを受け取る形にリファクタリング）, `src/components/home/category-grid.tsx`, `src/components/home/search-panel.tsx`（`CATEGORIES`参照に変更）
- 削除: `src/lib/mock-data.ts`

### 動作確認
- `pnpm build` / `pnpm lint` エラーなし
- `pnpm dev` でChrome表示を確認し、Markdownファイルから読み込んだ実データが評価（rating）降順で正しく表示されることを確認（1位: ウルトラワイドモニター 34インチ ★4.8 → ... の順）

---

## 6. 検索結果ページ実装

### 概要
要件定義 2章「検索結果ページ」を実装。条件合致商品のグリッド表示と、ソート機能（価格が安い順／評価が高い順／発売日が新しい順）を提供する。

### 追加した依存パッケージ
なし（既存パッケージのみで実装）。

### フィルタ・ソートロジック（`src/lib/products.ts`）
- `ProductFilters` 型: `category` / `minPrice` / `maxPrice` / `minRating` / `sort`
- `filterAndSortProducts(products, filters)`: 条件で絞り込んだ後、`sort`（`price_asc` / `rating_desc` / `release_desc`、デフォルト`rating_desc`）に従って並び替える純粋関数
- `SORT_OPTIONS`: 有効なソート値の配列（URLクエリのバリデーションに使用）

### ページ実装（`src/app/search/page.tsx`）
- Next.js 16の `searchParams`（`Promise`）を`await`して取得し、`PageProps<"/search">` 型を使用
- クエリパラメータ: `category`, `min_price`, `max_price`, `min_rating`, `sort`
- 不正な`sort`値が渡された場合は`rating_desc`にフォールバック
- 検索結果0件の場合は専用メッセージを表示

### コンポーネントの共通化
- `src/components/product/product-card.tsx` を新規作成し、商品カードのUI（画像プレースホルダー・タイトル・評価・価格・Amazon/楽天CTAボタン）をトップページのランキングと検索結果ページで共通化。`rank`propを渡すとランキングバッジを表示する仕様。
- `src/components/home/ranking-list.tsx` を `ProductCard` を使う形にリファクタリング（重複コード解消）
- `src/components/search/product-grid.tsx`: 検索結果のグリッド表示・0件時メッセージ
- `src/components/home/search-panel.tsx`: `initialValues` propを追加し、URLの現在の条件をパネルに反映できるように変更（`/search` に直接アクセスした場合や再読み込み時も選択状態が復元される）

### レイアウトの整理
- `SiteHeader` と共通コンテナ（`max-w-6xl`のmain要素）をトップページから`src/app/layout.tsx`（ルートレイアウト）に移動。複数ページで重複していたラッパーを解消し、各ページコンポーネントはコンテンツ本体のみを返す構成に整理。

### 動作確認
- `pnpm build` / `pnpm lint` エラーなし（`/search`は動的ルート`ƒ`として認識）
- 実ブラウザで以下を確認:
  - `/search?category=keyboard&sort=price_asc` で該当カテゴリ2件が価格昇順で表示され、検索パネルにも条件が反映される
  - `/search?category=keyboard&min_price=999999` で0件時のメッセージが表示される
  - トップページの検索パネルから「この条件で検索」を実行し、`/search`へ正しく遷移して全10件が評価順で表示される

---

## 7. 商品詳細（レビュー）ページ実装

### 概要
要件定義 2章「商品詳細（レビュー）ページ」を実装。スペック表、メリット・デメリットの比較表、視認性の高いアフィリエイトリンクボタンを備える。

### 追加した依存パッケージ
なし。スペック表・比較表はプレーンな`<table>`をTailwindでスタイリングし、Markdown本文もクラス指定で直接装飾する方針とし、新規ライブラリの追加を避けた。

### ルーティング（`src/app/products/[slug]/page.tsx`）
- 動的ルート `/products/[slug]`
- `generateStaticParams()`: `getAllProducts()` の全slugを事前生成対象にし、完全SSGを維持（要件2章のSSG構成に準拠）
- `generateMetadata()`: 商品名を含むページタイトル・descriptionを動的生成（SEO対応）
- 存在しないslugの場合は `notFound()` で標準404ページを表示

### 実装コンポーネント
| ファイル                                             | 役割                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `src/components/product/spec-table.tsx`               | スペック表（商品名/メーカー/カテゴリ/発売日/参考価格/総合評価/特徴タグ） |
| `src/components/product/pros-cons-table.tsx`          | メリット・デメリット比較表（2列テーブル、チェック/バツアイコン） |
| `src/components/product/affiliate-cta.tsx`            | 大きめのAmazon/楽天CTAボタン（`variant="cta"`/`"rakuten"`, `size="lg"`）。ヒーローエリアとページ最下部の2箇所に配置し、コンバージョン機会を確保 |

### レビュー本文
- `getProductBySlug()` で取得した`contentHtml`（Markdown→HTML変換済み）を`dangerouslySetInnerHTML`で描画。Tailwindの子孫セレクタ（`[&_h2]:...`, `[&_p]:...`, `[&_ul]:...`）で見出し・段落・リストを直接スタイリングし、`@tailwindcss/typography`等の追加パッケージなしで対応。

### 動作確認
- `pnpm build` / `pnpm lint` エラーなし（10商品すべてが`●`（SSG）として事前生成されることを確認）
- 実ブラウザで以下を確認:
  - スペック表・メリデメ比較表・上下2箇所のCTAボタンの表示
  - Markdown本文（レビュー文・「こんな人におすすめ」見出しとリスト）の表示
  - トップページのランキングカードのタイトルから商品詳細ページへの遷移
  - カテゴリへの戻りリンク（例:「← モニターに戻る」→ `/search?category=monitor`）
  - 存在しないslugへのアクセスで404ページが表示されること

---

## 8. 要件定義の更新に伴うデータモデル拡張（id / status）

### 概要
`requirements.md` 3章・4章の改訂（`id`・`status`フィールドの追加、GitHub Actionsによる将来の自動化を見据えた構成への変更）を受けて、実装側のデータモデル・パーサー・既存コンテンツを更新した。

### 変更内容
- `src/types/product.ts`
  - `ProductStatus` 型（`"published" | "draft" | "archived"`）を新規追加
  - `Product` 型に `id: string`（在庫チェック等に使う商品ユニークID）、`status: ProductStatus` を追加
- `src/lib/products.ts`
  - `ProductFrontmatter` に `id` / `status` を追加し、`toProduct()` でマッピング
  - `getAllProducts()`: **`status === "published"` の商品のみを返すようにフィルタリング**（下書き・アーカイブ済み商品は一覧・ランキング・検索結果に一切表示されない）
  - `getProductBySlug()`: 該当商品が`published`でない場合は`null`を返す（`notFound()`によりURLを直接指定してもアクセス不可）
- `content/products/*.md`（既存10ファイル）: すべてに `id`（`GADGET-0001`〜`GADGET-0010`、暫定の仮ID）と `status: "published"` を追加

### UIへの反映方針
- `id` は在庫チェック用の内部キー（要件定義上も「在庫チェックのキーとして使用」と定義）であるため、スペック表など画面上には表示しない。

### 動作確認
- 検証用に一時的な下書き商品（`status: "draft"`）を追加し、以下を確認した後、検証用ファイルは削除済み:
  - `pnpm build` で生成される商品詳細ページが10件のまま変わらないこと（下書きが`generateStaticParams`の対象から除外される）
  - `/search?category=keyboard` の結果件数が2件のまま変わらないこと（下書きが一覧に出ない）
  - 下書き商品の詳細ページURLに直接アクセスすると404になること
- `pnpm build` / `pnpm lint` エラーなし

---

## 9. SEO / AIO対策（JSON-LD構造化データ）

### 概要
`requirements.md` 6章「SEO / AIO対策」の追加要件に基づき、各商品詳細ページに Product / Review スキーマの JSON-LD を自動生成・出力する処理を実装した。検索エンジン（Google SGE等）やAIクローラー（Perplexity等）が商品情報・評価を正しく解釈できるようにする。

### 追加した依存パッケージ
なし。Next.jsの`<script type="application/ld+json">`への直接埋め込みのみで実装。

### 実装内容
- `src/lib/site.ts`: 構造化データ・メタデータの絶対URL解決に使う `SITE_URL` を定義。Vercel本番環境では `VERCEL_PROJECT_PRODUCTION_URL` を自動使用し、それ以外は `NEXT_PUBLIC_SITE_URL` または `http://localhost:3000` にフォールバック。
- `src/lib/json-ld.ts`:
  - `buildProductJsonLd(product)`: 商品データから `Product` スキーマ（`brand`, `offers`, ネストされた`review`を含む）を生成
    - `sku` に商品の`id`（要件定義3章で追加されたユニークID）を使用
    - `review` は編集部（サイト運営者）による評価という位置づけで、`author`を`Organization`（DESKGEAR）とした単一Reviewとして出力（ユーザー投稿レビューの実データがないため、実態のない`aggregateRating`の`reviewCount`は使用しない）
    - `offers` は商品の参考価格とアフィリエイトリンクを設定（在庫状況`availability`は将来のGitHub Actions連携による自動管理を想定し、現時点では未実装のため出力しない）
  - `jsonLdToScriptHtml(data)`: `</script>`によるタグの早期終了を防ぐため`<`をエスケープしてJSON文字列化するヘルパー
- `src/app/products/[slug]/page.tsx`: 生成した`Product`スキーマを`<script type="application/ld+json">`としてページ内に出力
- `src/app/layout.tsx`: `metadata.metadataBase` に `SITE_URL` を設定（絶対URL解決のNext.js標準対応）

### 動作確認
- `pnpm build` / `pnpm lint` エラーなし
- ビルド後の静的HTML（`.next/server/app/products/4k-webcam-c3.html`）から`<script type="application/ld+json">`の中身を抽出し、`JSON.parse`で正常にパースできること、`name`/`brand`/`offers`/`review`等の必須プロパティが正しく含まれることを確認
- 実ブラウザで商品詳細ページの表示に崩れがないこと（JSON-LDは非表示のメタデータであるため画面上の見た目に影響しないことを確認）

---

## 10. 今後の実装予定

- [x] トップページのレイアウト実装（カテゴリ一覧・総合おすすめランキングベスト10・絞り込み検索パネル）
- [x] `/content/products/` のMarkdownデータモデル・パーサー構築
- [x] 検索結果ページ（ソート機能含む）
- [x] 商品詳細（レビュー）ページ
- [x] データモデルへの`id`/`status`追加（下書き・アーカイブ商品の非公開化）
- [x] SEO/AIO対策: 商品詳細ページへのJSON-LD（Product/Review）出力
- [x] カテゴリ拡張・商品画像の実表示対応・発売日未定対応・初の実商品追加

---

## 11. 実アフィリエイト商品の追加対応（カテゴリ拡張・画像表示・発売日未定）

### 概要
ユーザーから実際の楽天アフィリエイト商品（ノートパソコン）の掲載依頼を受け、掲載に必要な周辺対応（カテゴリ拡張・画像表示・発売日未定対応）を行った上で、初の実商品データを追加した。これまでの10商品はすべて`image`/`affiliate_links`がプレースホルダー（空文字・`"#"`）のダミーデータだったため、今回が実データでの初掲載となる。

### 追加した依存パッケージ
なし。

### 変更内容

**カテゴリ拡張（`src/lib/categories.ts`, `src/components/home/category-grid.tsx`）**
- `requirements.md`のスコープ（デスク周辺機器）に該当しない「ノートパソコン本体」の掲載だったため、掲載前にユーザーへ方針を確認。ユーザーの判断で`laptop`（ノートパソコン）・`desktop`（デスクトップパソコン）の2カテゴリを新規追加することとした。
- `CATEGORY_ICONS`に`Laptop`/`Computer`（lucide-react）を追加。`search-panel.tsx`は`CATEGORIES`を参照する実装のため変更不要。

**商品画像の実表示対応（`next.config.ts`, `product-card.tsx`, `products/[slug]/page.tsx`）**
- これまで`Product.image`は取得はするが未使用で、常にプレースホルダーアイコンを表示する実装だった。今回`next/image`による実画像表示に対応。
- `next.config.ts`の`images.remotePatterns`に商品画像のホスト（`thumbnail.image.rakuten.co.jp`）を許可追加。**今後、異なるドメインの画像（Amazon商品画像・他の楽天ショップ等）を使う場合は都度このファイルへの追加が必要。**
- `image`が空の商品は従来通りプレースホルダーアイコン表示にフォールバック。

**Amazonリンク未設定時のボタン非表示（`affiliate-cta.tsx`, `product-card.tsx`）**
- 今回の商品はAmazon出品がなく`affiliate_links.amazon`が空文字になるため、`amazon`/`rakuten`のいずれかが空の場合はそのボタンを非表示にするよう変更（従来はリンク先"#"でもボタン自体は常に表示されていた）。

**発売日未定（`null`）対応（`types/product.ts`, `lib/products.ts`, `components/product/spec-table.tsx`）**
- 今回の商品は正確な発売日が無い（継続販売の型番非公開ノートPC）ため、`Product.releaseDate`を`string | null`に変更。
- `filterAndSortProducts`の`release_desc`（発売日が新しい順）ソートで、`releaseDate: null`の商品は最上位（最も新しい扱い）としてソートするロジックを追加。
- `SpecTable`の「発売日」行は、`null`の場合「発売日未定」と表示する。
- 既存10商品はすべて日付設定済みのため表示・ソート結果に影響なし。

**初の実商品データ追加（`content/products/budget-laptop-n95.md`）**
- `id: "GADGET-0011"`、`category: "laptop"`
- タイトルは、頂いた楽天商品名（SEOキーワード詰め込み型、60文字超）をそのまま使うとサイト上の表示崩れ・Googleでのタイトル書き換えを招きやすいため、ユーザー確認の上で短縮版「ノーブランド ノートパソコン（Windows11 / JIS配列 / 14.1・15.6インチ）」を採用。原文の詳細スペック情報はレビュー本文に記載。
- `rating`（4.37）・`manufacturer`（ノーブランド）・`pros`/`cons`はユーザーから直接指定された値をそのまま使用。**JSON-LDのReview評価に使われるため、実装側で評価点を創作することは避けた。**
- `release_date: null`（前述の発売日未定対応）
- `affiliate_links.amazon: ""`（Amazon出品なし）、`rakuten`はユーザー提供の楽天アフィリエイトリンクをそのまま設定
- `image`はユーザー提供の楽天商品画像URL（`thumbnail.image.rakuten.co.jp`）をそのまま設定

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし（全11商品がSSGで事前生成されることを確認）
- dev環境（`pnpm dev`）で商品詳細ページ（`/products/budget-laptop-n95`）を確認:
  - タイトル・スペック表（発売日未定表示）・メリデメ・楽天CTAボタンのみ（Amazonボタン非表示）の表示
  - `next/image`経由で楽天商品画像が最適化配信されることを確認（`/_next/image?url=...`）
  - JSON-LD（`application/ld+json`）に商品名・評価（4.37）・価格が正しく出力されることを確認
- トップページのカテゴリ一覧・`/search?category=laptop`への反映は実装上想定通りだが、ブラウザでの最終目視確認はユーザー側で実施予定。

---

## 12. 実アフィリエイト商品の追加（2件目・ロジクール ERGO M575SP）

### 概要
2件目の実アフィリエイト商品として、ロジクール製ワイヤレストラックボールマウス「ERGO M575SP」（楽天）を追加した。既存カテゴリ（`mouse`）・既存の画像許可ドメイン（`thumbnail.image.rakuten.co.jp`）を利用できたため、コード変更は発生していない。

### 追加した依存パッケージ
なし。

### 変更内容
- `content/products/ergo-m575sp-trackball.md` を新規作成
  - `id: "GADGET-0012"`、`category: "mouse"`
  - `manufacturer`: 「ロジクール」（商品名から判断、ユーザー確認済み）
  - `release_date: "2024-09-01"`（ユーザー申告「2024年9月」を月精度で登録。日付は便宜上1日付けで、実際の発売日ではない点に留意）
  - `rating`（4.51）・`pros`/`cons`はユーザーから直接指定された値をそのまま使用
  - `affiliate_links.amazon: ""`（Amazon出品なし、ボタン非表示）、`rakuten`はユーザー提供のリンクをそのまま設定
  - タイトルは元のSEOキーワード詰め込み型から、ユーザー確認済みの短縮版「ロジクール ERGO M575SP ワイヤレストラックボールマウス（静音 / Bluetooth対応）」を採用

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし（全12商品がSSGで事前生成されることを確認）
- dev環境で商品詳細ページ（`/products/ergo-m575sp-trackball`）を確認:
  - タイトル・画像（`next/image`経由）・JSON-LDの評価値（4.51）が正しく出力されることを確認

---

## 13. 実アフィリエイト商品の追加（3件目・ロジクール C270n Webカメラ）

### 概要
3件目の実アフィリエイト商品として、ロジクール製Webカメラ「C270n」（楽天）を追加した。既存カテゴリ（`webcam`）・既存の画像許可ドメイン（`thumbnail.image.rakuten.co.jp`）を利用できたため、コード変更は発生していない。

### 追加した依存パッケージ
なし。

### 変更内容
- `content/products/logicool-c270n-webcam.md` を新規作成
  - `id: "GADGET-0013"`、`category: "webcam"`
  - `manufacturer`: 「ロジクール」（ユーザー指定）
  - `release_date: "2019-04-01"`（ユーザー申告「2019年4月」を月精度で登録。日付は便宜上1日付け）
  - `rating`（4.31）・`pros`/`cons`はユーザーから直接指定された値をそのまま使用
  - `affiliate_links.amazon: ""`（Amazonリンク不要とユーザー指定、ボタン非表示）、`rakuten`はユーザー提供のリンクをそのまま設定
  - タイトルは元のSEOキーワード詰め込み型から、短縮版「ロジクール C270n Webカメラ（HD 720p / マイク内蔵）」を新規作成（ユーザーからタイトル作成を含めて依頼された）

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし（全13商品がSSGで事前生成されることを確認）
- dev環境で商品詳細ページ（`/products/logicool-c270n-webcam`）を確認:
  - タイトル・JSON-LDの評価値（4.31）が正しく出力されることを確認

---

## 14. 実アフィリエイト商品の追加（4件目・Dell E2425HM モニター）

### 概要
4件目の実アフィリエイト商品として、Dell製モニター「E2425HM」（楽天）を追加した。既存カテゴリ（`monitor`）・既存の画像許可ドメイン（`thumbnail.image.rakuten.co.jp`）を利用できたため、コード変更は発生していない。

### 追加した依存パッケージ
なし。

### 変更内容
- `content/products/dell-e2425hm-monitor.md` を新規作成
  - `id: "GADGET-0014"`、`category: "monitor"`
  - `manufacturer`: 「Dell」（商品名から判断）
  - `release_date: "2025-03-27"`（ユーザー申告どおり）
  - `rating`（4.58）・`pros`/`cons`はユーザーから直接指定された値をそのまま使用
  - `affiliate_links.amazon: ""`（Amazonリンクなし、ボタン非表示）、`rakuten`はユーザー提供のリンクをそのまま設定
  - タイトルは短縮版「Dell E2425HM 23.8インチ モニター（フルHD IPS / リフレッシュレート100Hz）」を採用（ユーザー承認済み）

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし（全14商品がSSGで事前生成されることを確認）
- dev環境で商品詳細ページ（`/products/dell-e2425hm-monitor`）を確認:
  - タイトル・JSON-LDの評価値（4.58）が正しく出力されることを確認

---

## 15. 絞り込み検索パネルへのメーカーフィルタ追加

### 概要
ユーザーから「メーカーでフィルタをかけたい」という依頼を受け、絞り込み検索パネル（トップページ・検索結果ページ）にメーカー選択のSelectを追加した。`Product.manufacturer`は既存フィールドのため、データモデルの変更は発生していない。

### 追加した依存パッケージ
なし（既存パッケージのみで実装）。

### 変更内容
- `src/lib/products.ts`
  - `ProductFilters`に`manufacturer?: string`を追加
  - `filterAndSortProducts()`にメーカー完全一致の絞り込み条件を追加（カテゴリ絞り込みと同じ方式）
  - `getManufacturers()`を新設: 公開中（`published`）の全商品から重複のないメーカー名一覧を50音順（`localeCompare(..., "ja")`）で取得する。カテゴリのような固定マスタ（`CATEGORIES`）を持たず、商品データから動的に一覧を導出する方式を採用
- `src/components/home/search-panel.tsx`
  - `manufacturers: string[]`をpropとして受け取り、カテゴリSelectの隣にメーカーSelectを追加（「すべて」＋動的なメーカー一覧）
  - `handleSearch()`で`manufacturer`をURLクエリに追加
  - 絞り込み項目が5つ（カテゴリ/メーカー/価格帯/評価/並び替え）＋検索ボタンになったため、グリッドを`lg:grid-cols-5`から`lg:grid-cols-3 xl:grid-cols-6`に変更
- `src/app/page.tsx` / `src/app/search/page.tsx`
  - `getManufacturers()`を呼び出し、`SearchPanel`に`manufacturers`propを渡す
  - `src/app/search/page.tsx`は`searchParams.manufacturer`をパースし、`filterAndSortProducts`の絞り込み条件・`SearchPanel`の`initialValues`（選択状態の復元）に反映

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし（全65商品がSSGで事前生成されることを確認）
- `curl`で`/`のHTMLに`search-manufacturer`のSelectが出力されることを確認
- `curl`で`/search?manufacturer=ロジクール`を取得し、該当する12商品（`logicool-*`・`ergo-m575sp-trackball`）のみが絞り込み結果に含まれることを確認
- ブラウザ拡張が未接続だったため、実ブラウザでのSelect操作・見た目の目視確認は未実施（ユーザー側で`pnpm dev`起動後の確認を推奨）

---

## 16. メーカー選択肢のカテゴリ連動絞り込み

### 概要
ユーザーから「カテゴリで『ノートパソコン』を選択した時に、メーカーの選択肢はノートパソコンに登録されているメーカーだけ表示されてほしい」という依頼を受け、絞り込み検索パネルの「メーカー」Selectを、選択中の「カテゴリ」に応じて動的に絞り込む仕様に変更した。

### 追加した依存パッケージ
なし（既存パッケージのみで実装）。

### 変更内容
- `src/lib/products.ts`
  - `getManufacturersByCategory()`を新設: 公開中の全商品を走査し、カテゴリslugをキー、そのカテゴリに登場するメーカー名一覧（50音順）を値とするマップ（`Record<string, string[]>`）を返す
- `src/components/home/search-panel.tsx`
  - `manufacturersByCategory: Record<string, string[]>`をpropとして追加
  - `availableManufacturers`（`useMemo`）: 選択中の`category`が`"all"`なら全メーカー一覧（`manufacturers`）、それ以外は`manufacturersByCategory[category]`を返す。メーカーSelectの選択肢・ラベル表示はこれを参照するよう変更
  - `handleCategoryChange()`: カテゴリSelectの`onValueChange`から呼び出し、カテゴリ変更と同時に新カテゴリの`availableManufacturers`を計算し、現在選択中のメーカーがそのカテゴリに存在しない場合は選択を「すべて」にリセットする（`useEffect`内での`setState`はESLintの`react-hooks/set-state-in-effect`ルールに抵触するため、イベントハンドラ内で同期的に行う方式を採用）
- `src/app/page.tsx` / `src/app/search/page.tsx`
  - `getManufacturersByCategory()`を呼び出し、`SearchPanel`に`manufacturersByCategory`propを追加で渡す

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし
- ブラウザ拡張（`claude.ai/chrome`）を接続し、実ブラウザで動作確認:
  - トップページで「カテゴリ」を「ノートパソコン」に変更すると、「メーカー」の選択肢が Apple / ASUS / Dynabook / HP / Lenovo / MSI / NEC / ノーブランド / マウスコンピューター / 富士通 の10社のみに絞り込まれることを確認（`content/products/`の`category: "laptop"`商品のメーカー一覧と完全一致）
  - 「メーカー」に「ロジクール」を選択した状態で「この条件で検索」を押下し、`/search?manufacturer=ロジクール`に遷移して該当12件が正しく表示されることを確認（画面崩れなし）

---

## 17. 並び替えのデフォルトを「価格が高い順」に変更

### 概要
`requirements.md`のコアバリューを「パソコン購入に迷うユーザーをコンサルする（まずノートパソコンをおすすめし、そこから絞り込む）」方向に更新したことを受け、絞り込み検索の並び替えデフォルトを、それまでの「評価が高い順」（`rating_desc`）から「価格が高い順」（`price_desc`）に変更した。価格は評価と異なり誰にでも一目で分かる軸であり、「まず良いもの（高スペック＝高価格帯）を提示し、そこから予算で絞り込んでもらう」という接客の流れに合わせた判断（ユーザーとAI双方の合意の上で決定）。トップページの「総合おすすめランキングベスト10」は、引き続き評価順（信頼できるおすすめ）のまま変更していない。

### 追加した依存パッケージ
なし。

### 変更内容
- `src/lib/products.ts`
  - `filterAndSortProducts()`の`switch`文で、`case "price_desc"`と`default`（`sort`が未指定・不正値の場合）を統合し、デフォルトの並び替えを価格降順にした。`rating_desc`は明示的に指定された場合のみ動作する通常の`case`として残置（`getRankedProducts()`が使う`compareRatingDesc`ロジック自体は変更なし）
- `src/app/search/page.tsx`
  - 不正な`sort`クエリ値のフォールバック先を`"rating_desc"`から`"price_desc"`に変更
- `src/components/home/search-panel.tsx`
  - 「並び替え」Selectの初期状態（`useState`の初期値）・`onValueChange`のフォールバック・ラベル参照のフォールバックキーを`"price_desc"`に変更
- `CLAUDE.md`
  - Architectureセクションのルーティング説明（`/search`の不正な`sort`値のフォールバック先の記述）を実装に合わせて更新

### 動作確認
- `pnpm lint` / `pnpm build` エラーなし
- ブラウザで確認: トップページの「並び替え」初期表示が「価格が高い順」になっていること、「この条件で検索」を押下すると`/search?sort=price_desc`に遷移し、検索結果が¥369,800→¥319,000→¥299,800→¥254,700→¥249,700→¥200,600...と価格降順で正しく並ぶことを確認
