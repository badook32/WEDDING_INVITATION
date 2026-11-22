import type { GalleryPhoto, Invitation } from "@/types/invitation";

/**
 * 2027년 2월 27일 청첩장 1차 공개 초안.
 * 초안에서 제공된 축의금 계좌 중 5개를 적용하고, 신랑 아버지 계좌는 비공개한다.
 */
const galleryByOriginalPosition: readonly GalleryPhoto[] = [
    ...Array.from({ length: 15 }, (_, index) => ({
      src: `/wedding/studio-${String(index + 1).padStart(2, "0")}.webp`,
      alt: `스튜디오 웨딩 사진 ${index + 1}`,
    })),
    ...Array.from({ length: 9 }, (_, index) => ({
      src: `/wedding/soyouu-${String(index + 1).padStart(2, "0")}.webp`,
      alt: `소유 필름 웨딩 사진 ${index + 1}`,
    })),
    ...Array.from({ length: 3 }, (_, index) => ({
      src: `/wedding/snap-${String(index + 1).padStart(2, "0")}.webp`,
      alt: `스냅 웨딩 사진 ${index + 1}`,
    })),
];

/** 1-based positions in the original numbered photo board; edit this list to re-order. */
const GALLERY_ORDER = [15, 1, 12, 9, 5, 6, 7, 4, 10, 11, 13, 2, 14, 8, 3, 20, 22, 26, 24, 25, 27, 23, 17, 16] as const;
export const invitation: Invitation = {
  couple: {
    groom: {
      name: "고민혁",
      childOrder: "장남",
      father: { name: "고윤석", account: null },
      mother: { name: "노현미", account: { bank: "카카오뱅크", number: "3333-21-5506891" } },
      account: { bank: "카카오뱅크", number: "3333-07-8321898" },
    },
    bride: {
      name: "이유진",
      childOrder: "차녀",
      father: { name: "이기홍", account: { bank: "하나은행", number: "568-910008-71707" } },
      mother: { name: "이주현", account: { bank: "신한은행", number: "325-02-140786" } },
      account: { bank: "하나은행", number: "355-911036-33307" },
    },
  },
  ceremony: {
    startsAt: "2027-02-27T16:00:00+09:00",
  },
  venue: {
    name: "아름다운컨벤션웨딩",
    hall: "2층 컨벤션홀",
    address: "전북특별자치도 전주시 덕진구 온고을로 291 (팔복동3가)",
    transit: [
      {
        label: "버스",
        directions: [
          "전주역 출발: 200번",
          "전주 시외·고속버스터미널 출발: 200, 61, 74, 75번",
        ],
      },
      {
        label: "택시",
        directions: [
          "전주역에서 약 18분",
          "전주 시외·고속버스터미널에서 약 10분",
        ],
      },
    ],
    map: { timestamp: "1794126111455", key: "4o7r49bofbq" },
  },
  greeting: {
    heading: "초대합니다",
    paragraphs: [
      "작은 인연으로 시작되어\n깊은 사랑의 결실을 맺게 되었습니다.",
      "서로에게 가장 따뜻한 보금자리가 되어\n늘 변함없는 모습으로 살아가겠습니다.",
      "저희의 시작을 따뜻한 온기로 채워주실 분들을 초대합니다.",
    ],
  },
  quote: {
    lines: [
      "하늘 아래 내가 받은",
      "가장 커다란 선물은 오늘입니다.",
      "",
      "오늘 받은 선물 가운데서도",
      "가장 아름다운 선물은 당신입니다.",
    ],
    source: "나태주, 「선물」",
  },
  gallery: GALLERY_ORDER.map((originalPosition) => {
    const photo = galleryByOriginalPosition[originalPosition - 1];
    if (photo === undefined) {
      throw new Error(`갤러리 원본 사진 ${originalPosition}번을 찾을 수 없습니다.`);
    }
    return photo;
  }),
};
