import styled from "styled-components";
import BackgroundPoster from "@/assets/BackgroundVideoPoster.webp";
import { Container } from "@/components/layout/Container";
import { invitation } from "@/data/invitation";
import { formatCeremonyDateTime, toDateTimeAttribute } from "@/lib/ceremony";

/**
 * 첫 화면. 신랑·신부 이름과 예식 일시를 알린다.
 *
 * 예식 일시 문자열은 데이터의 ISO 시각에서 파생된다. 요일을 사람이 적지
 * 않으므로 날짜와 요일이 어긋날 수 없다.
 */
export function Hero() {
  const { couple, ceremony, venue } = invitation;

  return (
    <Header>
      <Container>
        <Eyebrow>FEBRUARY 27 2027 · SATURDAY</Eyebrow>
        <HeroTitle>WEDDING DAY</HeroTitle>
        <CoverPhoto
          src={BackgroundPoster}
          alt="한옥 앞에 함께 서 있는 신랑과 신부"
          width={1536}
          height={1152}
          fetchPriority="high"
        />
        <Names>
          <span>{couple.groom.name}</span>
          <And>그리고</And>
          <span>{couple.bride.name}</span>
        </Names>
        <Schedule>
          <time dateTime={toDateTimeAttribute(ceremony.startsAt)}>
            {formatCeremonyDateTime(ceremony.startsAt)}
          </time>
          <br />
          {venue.name} {venue.hall}
        </Schedule>
    </Header>
  );
}

const Header = styled.header`
  padding-top: ${({ theme }) => theme.space[12]};
  text-align: center;
  animation: fade-in ${({ theme }) => theme.motion.duration.slow} ease-out both;

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 4px;
  color: #79716e;
  font-size: 11px;
  letter-spacing: 0.18em;
`;

const HeroTitle = styled.h1`
  margin: 0 0 26px;
  color: #a8434a;
  font-size: clamp(27px, 7.5vw, 36px);
  font-weight: 400;
  letter-spacing: 0.16em;
`;

const Names = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 28px 0 14px;
  color: #3e3a39;
  font-size: clamp(18px, 5vw, 23px);
  font-weight: 600;
  letter-spacing: 0.08em;
`;

const And = styled.span`
  color: #a8434a;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: normal;
`;

const Schedule = styled.p`
  margin: 0 0 22px;
  color: #79716e;
  font-size: 13px;
  line-height: 1.9;
`;

const CoverPhoto = styled.img`
  display: block;
  width: 100%;
  max-width: 405px;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  margin: 0 auto;
  border-radius: 14px;
  background-color: #efebe9;
  box-shadow: 0 8px 28px rgba(62, 58, 57, 0.09);
`;
