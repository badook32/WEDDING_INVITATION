import GalleryPhoto1 from "@/assets/Gallery_Photo_1.webp";
import GalleryPhoto2 from "@/assets/Gallery_Photo_2.webp";
import GalleryPhoto3 from "@/assets/Gallery_Photo_3.webp";
import GalleryPhoto4 from "@/assets/Gallery_Photo_4.webp";
import GalleryPhoto5 from "@/assets/Gallery_Photo_5.webp";
import GalleryPhoto6 from "@/assets/Gallery_Photo_6.webp";
import type { Invitation } from "@/types/invitation";

/**
 * 2027년 2월 27일 청첩장 1차 공개 초안.
 * 축의금 계좌는 공개 저장소에 포함하지 않도록 null로 처리한다.
 */
export const invitation: Invitation = {
  couple: {
    groom: {
      name: "고민혁",
      childOrder: "장남",
      father: { name: "고윤석", account: null },
      mother: { name: "노현미", account: null },
      account: null,
    },
    bride: {
      name: "이유진",
      childOrder: "차녀",
      father: { name: "이기홍", account: null },
      mother: { name: "이주현", account: null },
      account: null,
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
      "작은 인연으로 시작되어 깊은 사랑의 결실을 맺게 되었습니다.",
      "서로에게 가장 따뜻한 보금자리가 되어 늘 변함없는 모습으로 살아가겠습니다.",
      "저희의 시작을 따뜻한 온기로 채워주실 분들을 초대합니다.",
    ],
  },
  quote: {
    lines: [
      "장담하건대, 세상이 다 겨울이어도",
      "우리 사랑은 늘 봄처럼 따뜻하고",
      "간혹, 여름처럼 뜨거울 겁니다",
    ],
    source: "이수동, 「사랑가」",
  },
  gallery: [
    { src: GalleryPhoto1, alt: "야경 속에서 입맞추는 신랑과 신부" },
    { src: GalleryPhoto2, alt: "나무가 있는 야외에서 웃는 신랑과 신부" },
    { src: GalleryPhoto3, alt: "물가에서 마주 보고 앉아 있는 신랑과 신부" },
    { src: GalleryPhoto4, alt: "강변 나무 아래에서 춤추는 신랑과 신부" },
    { src: GalleryPhoto5, alt: "노을진 강가의 두 사람 실루엣" },
    { src: GalleryPhoto6, alt: "해질녘 서로 바라보는 두 사람 실루엣" },
  ],
};
