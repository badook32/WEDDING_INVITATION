import styled from "styled-components";
import { invitation } from "@/data/invitation";

/** 메인 사진은 별도 최적화한 SCV01144-1 색감 원본을 사용한다. */
export function Hero() {
  const { couple } = invitation;

  return (
    <Header>
      <CoverPhoto
        src="/wedding/hero.webp"
        alt="신랑과 신부가 함께 웨딩 케이크를 들고 있는 모습"
        width={1400}
        height={1867}
        fetchPriority="high"
      />
      <Names>
        <span>{couple.groom.name}</span>
        <Heart aria-label="하트">♥</Heart>
        <span>{couple.bride.name}</span>
      </Names>
    </Header>
  );
}

const Header = styled.header`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  text-align: center;
`;

const CoverPhoto = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: 83svh;
  min-height: 400px;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center 43%;
  background-color: #f4f2ef;

  @media (max-height: 600px) {
    min-height: 0;
  }
`;

const Names = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 29px 12px 13px;
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(21px, 5.2vw, 27px);
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const Heart = styled.span`
  color: ${({ theme }) => theme.color.accent};
  font-size: 18px;
  font-weight: 400;
`;
