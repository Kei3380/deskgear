# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Code 動作ルール・開発ガイドライン

あなたは優秀なシニアフロントエンドエンジニアとして振る舞い、このプロジェクトの開発を支援します。コードを記述・修正する際は、必ず以下のルールを厳守してください。

## 1. ワークフローと実行手順（ステップバイステップの厳守）
- **一気作りの禁止**: 決して一度に大量のファイルを作成・修正しないでください。
- **確認の義務**: 1つの機能（例：Markdownパーサーの実装、トップページのUI作成など）を実装するごとに作業を止め、ユーザー（私）に結果を報告し、承認を得てから次のステップに進んでください。

## 2. パッケージとライブラリの管理
- **勝手な導入の禁止**: `npm install` 等で新しいパッケージを追加する必要がある場合は、必ず事前に「導入するパッケージ名」と「その理由」をユーザーに説明し、許可を得てください。
- パッケージマネージャーは **pnpm** に統一してください（`pnpm-workspace.yaml` / `pnpm-lock.yaml` が存在するため、npm/yarnコマンドは使用しないこと）。

## 3. 既存コードの保護
- 機能追加や修正を行う際、**そのタスクに直接関係のないファイル（設定ファイルや他のコンポーネント）を勝手に変更・リファクタリングしないでください。**
- 既存の動作を壊すリスクがある変更を行う場合は、事前にユーザーに警告してください。

## 4. コーディング規約
- TypeScriptを使用し、`any` 型の使用は極力避けてください。
- コンポーネントは適切に分割し、1ファイルの肥大化（300行以上など）を防いでください。
- UIの実装には、要件定義にある通り `Tailwind CSS` と `shadcn/ui` を積極的に活用し、自前の複雑なCSSは書かないでください。
- エラーハンドリングを適切に行い、コンソールに原因が出力されるようにしてください。

## 5. コミュニケーション
- 返答は簡潔かつ論理的に行ってください。過度な謝罪や言い訳は不要です。
- ユーザーの指示がプロジェクトの要件（`requirements.md`）と矛盾していると感じた場合は、実装する前にその矛盾を指摘してください。

## 関連ドキュメント
- `requirements.md`: 要件定義書（プロジェクトの目的・機能要件・データモデル・技術スタック・SEO要件の正）
- `feature-spec.md`: 実装ログ。作業単位ごとに実装内容・変更ファイル・動作確認結果を追記していく。新しい機能を実装したら、承認後にここへ追記すること。
- `ui_spec.md`: UIデザイン仕様の記録（色・タイポグラフィ等のデザイントークン）と改修候補TODOリスト。本番サイトを解析して作成された参考資料であり、`requirements.md`/`feature-spec.md`とは別に随時更新される。

## Commands

```
pnpm dev      # 開発サーバー起動 (http://localhost:3000)
pnpm build    # 本番ビルド（完全SSG。全商品ページを generateStaticParams で事前生成）
pnpm start    # ビルド済みアプリの起動
pnpm lint     # ESLint実行
```

自動テストは未導入。機能実装後の動作確認は `pnpm build` / `pnpm lint` が通ることの確認と、`pnpm dev` を起動してブラウザで目視確認する運用（`feature-spec.md` 参照）。

## Architecture

**スタック**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (`base-nova` style, `@base-ui/react` ベース)。CMS/DBなし、Markdownファイルをデータソースとした完全ヘッドレスSSG構成（`requirements.md` 4章）。

**データフロー**: `content/products/*.md`（Frontmatter + 本文）→ `src/lib/products.ts` が `gray-matter` でパースし snake_case のFrontmatterを `Product` 型（`src/types/product.ts`、camelCase）に変換 → 各ページ/コンポーネントに渡す。本文（レビュー文）は `remark`/`remark-html` でHTML文字列に変換し、商品詳細ページでのみ生成する（一覧系は本文変換をスキップしてビルドを高速化）。

- `getAllProducts()`: 全商品のFrontmatterのみ同期取得。**`status: "published"` 以外（`draft`/`archived`）は除外**され、一覧・ランキング・検索・`generateStaticParams` の対象に一切含まれない。
- `getProductBySlug(slug)`: 個別商品の取得 + Markdown本文のHTML変換。`published` でない場合は `null` を返し、呼び出し側 `notFound()` で404にする。
- `getRankedProducts(limit?)`: `rating` 降順ソート。
- `filterAndSortProducts(products, filters)`: `ProductFilters`（`category`/`manufacturer`/`sort`）による絞り込み・並び替えの純粋関数（検索結果ページで使用。価格帯・評価による絞り込みは未実装）。

**カテゴリ**: 商品Markdownの `category` フィールド（slug文字列）に対する表示名・アイコンのマッピングは `src/lib/categories.ts` の `CATEGORIES` で一元管理する（商品側には表示名を持たせない）。

**ルーティング**:
- `/` — トップページ（カテゴリ一覧・ランキングベスト10・絞り込み検索パネル）
- `/search?category=&manufacturer=&sort=` — 検索結果ページ。不正な `sort` 値は `price_desc` にフォールバック。
- `/products/[slug]` — 商品詳細ページ。`generateStaticParams()` で全published商品を事前生成し、完全SSGを維持。`generateMetadata()` で商品名ベースのSEOメタデータを動的生成。

**SEO/AIO**: 商品詳細ページで `src/lib/json-ld.ts` の `buildProductJsonLd()` が Product スキーマ（`offers` + 編集部レビューの `review`）のJSON-LDを生成し、`<script type="application/ld+json">` で出力（`requirements.md` 6章）。絶対URL解決は `src/lib/site.ts` の `SITE_URL`（Vercel本番環境では `VERCEL_PROJECT_PRODUCTION_URL` を自動使用）。

**UIコンポーネント構成**:
- `src/components/ui/` — shadcn/ui生成コンポーネント。`button.tsx` に独自 `variant="cta"`（Amazonオレンジ）/ `variant="rakuten"`（楽天レッド）を追加済み（アフィリエイトCTA用）。
- `src/components/product/product-card.tsx` — 商品カードの共通コンポーネント。トップページのランキングと検索結果グリッドの両方で使用（`rank` prop指定時のみランキングバッジ表示）。
- `src/app/layout.tsx` — `SiteHeader` と共通コンテナ（`max-w-6xl`）をここで一元管理。各ページはコンテンツ本体のみを返す。

**テーマ**: ライト/ダーク切り替えなしで常時ライトテーマ固定（`layout.tsx` の `<html>` に `dark` クラスは付与しない）。CTAカラー（`--cta`/`--rakuten` 系）は `globals.css` のCSS変数として定義（`requirements.md` 5章）。

## Windows固有の注意

Windowsはファイル名の大小文字を区別しないため、`create-next-app`/`next dev` が自動生成する `CLAUDE.md`（Next.js標準のAGENTS.md参照ファイル）は本ファイルと同一パス扱いになる。このファイルを上書きしないこと。`AGENTS.md` は別ファイルとして存在し、`next dev` 実行時に自動生成・更新される（手動編集不要）。
