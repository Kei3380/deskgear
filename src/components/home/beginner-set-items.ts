export type BeginnerSetItem = {
  slug: string;
  role: string;
  roleEn: string;
  /** true の場合は任意品（合計金額の「必須」から除外し、バッジを控えめな色で表示） */
  optional: boolean;
  note?: string;
  imageSrc: string;
  imageAlt: string;
};

// セットを構成する商品スラッグと表示ラベル
export const SET_ITEMS: BeginnerSetItem[] = [
  {
    slug: "asus-vivobook-14-x1407ca",
    role: "① ノートパソコン（必須）",
    roleEn: "Laptop",
    optional: false,
    note: "メモリ16GB・Webカメラ・顔認証内蔵。複数アプリを開いても3年間サクサク動く安心スペック",
    imageSrc: "/images/beginner-set/laptop.jpg",
    imageAlt: "ノートパソコンのイメージ",
  },
  {
    slug: "logicool-m240grd-mouse",
    role: "② 静音マウス（必須）",
    roleEn: "Mouse",
    optional: false,
    note: "※ ノートPCにマウスは付属しません。Bluetooth直結でUSB端子を塞がない静音＆1年保証モデル",
    imageSrc: "/images/beginner-set/mouse.jpg",
    imageAlt: "ワイヤレスマウスのイメージ",
  },
  {
    slug: "dell-e2425hm-monitor",
    role: "③ 23.8型モニター（任意）",
    roleEn: "Sub Monitor",
    optional: true,
    note: "2画面あると作業効率が格段に向上。第三者機関の『目の快適性3つ星認証』＆100Hzで夕方の目の疲れも軽減",
    imageSrc: "/images/beginner-set/monitor.jpg",
    imageAlt: "23.8インチモニターのイメージ",
  },
];
