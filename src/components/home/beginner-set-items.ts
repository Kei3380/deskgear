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
    role: "ノートパソコン",
    roleEn: "Laptop",
    optional: false,
    note: "Webカメラ内蔵・顔認証対応でビデオ会議もすぐ使えます",
    imageSrc: "/images/beginner-set/laptop.jpg",
    imageAlt: "ノートパソコンのイメージ",
  },
  {
    slug: "logicool-m240grd-mouse",
    role: "マウス",
    roleEn: "Mouse",
    optional: false,
    note: "※ ノートPCにマウスは付属しません",
    imageSrc: "/images/beginner-set/mouse.jpg",
    imageAlt: "ワイヤレスマウスのイメージ",
  },
  {
    slug: "dell-e2425hm-monitor",
    role: "モニター（任意）",
    roleEn: "Sub Monitor",
    optional: true,
    note: "画面が広がると、作業効率が格段に変わります",
    imageSrc: "/images/beginner-set/monitor.jpg",
    imageAlt: "23.8インチモニターのイメージ",
  },
];
