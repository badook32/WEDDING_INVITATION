import styled from "styled-components";
import { invitation } from "@/data/invitation";
import { formatCeremonyDateTime, toDateTimeAttribute } from "@/lib/ceremony";

/** 메인 사진은 기존 SCV01144-1 색감 이미지를 유지한다. */
export function Hero() {
  const { couple, ceremony, venue } = invitation;
  const ceremonyText = formatCeremonyDateTime(ceremony.startsAt).replace(/ 00분$/, "");
  const shortVenueName = venue.name.replace(/웨딩$/, "");

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
        <Person>
          <Role>신랑</Role>
          <PersonName>{couple.groom.name}</PersonName>
        </Person>
        <Heart aria-hidden="true">♥</Heart>
        <Person>
          <Role>신부</Role>
          <PersonName>{couple.bride.name}</PersonName>
        </Person>
      </Names>
      <CeremonyInfo>
        <time dateTime={toDateTimeAttribute(ceremony.startsAt)}>
          {ceremonyText}
        </time>
        <VenueInfo>{shortVenueName} {venue.hall}</VenueInfo>
      </CeremonyInfo>
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr);
  align-items: end;
  gap: 12px;
  width: min(100%, 350px);
  margin: 0 auto;
  padding: 30px 15px 0;
  color: ${({ theme }) => theme.color.text};
`;

const Person = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const Role = styled.span`
  color: ${({ theme }) => theme.color.accent};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.5;
`;

const PersonName = styled.span`
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(20px, 5.4vw, 25px);
  font-weight: 600;
  letter-spacing: 0.09em;
  line-height: 1.45;
  white-space: nowrap;
`;

const Heart = styled.span`
  align-self: end;
  padding-bottom: 6px;
  color: ${({ theme }) => theme.color.accent};
  font-size: 19px;
  font-weight: 400;
  line-height: 1.45;
`;

const CeremonyInfo = styled.div`
  padding: 28px 12px 36px;
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(12px, 3.5vw, 15px);
  font-weight: 400;
  line-height: 1.85;
  word-break: keep-all;

  time {
    display: block;
  }
`;

const VenueInfo = styled.p`
  margin: 0;
`;
