import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui";
import { invitation } from "@/data/invitation";
import { useKakaoRoughMap } from "@/hooks/useKakaoRoughMap";

/** 예식장 위치와 주소. */
export function Location() {
  const { venue } = invitation;
  const { status, containerProps } = useKakaoRoughMap(venue.map);

  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(venue.address)}`;

  return (
    <Container>
      <Section title="오시는 길" ornament>
        {containerProps !== null && status !== "failed" && (
          <MapFrame {...containerProps} />
        )}

        {status === "failed" && (
          <MapFallback>지도를 불러오지 못했습니다.</MapFallback>
        )}

        <Reveal>
          <Address>
            {venue.address}
            <br />
            {venue.name} {venue.hall}
          </Address>

          <MapButtons aria-label="지도 앱에서 길찾기">
            <MapLink href={kakaoMapUrl} target="_blank" rel="noopener noreferrer">
              카카오맵
            </MapLink>
            <MapLink
              href="https://naver.me/5qLv5PuY"
              target="_blank"
              rel="noopener noreferrer"
            >
              네이버지도
            </MapLink>
            <MapLink
              href="https://tmap.life/506d70fb"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMAP
            </MapLink>
          </MapButtons>
        </Reveal>
      </Section>
    </Container>
  );
}

const MapFrame = styled.div`
  width: 100%;
  /* 지도가 그려지기 전에도 자리를 잡아 아래 내용이 밀리지 않게 한다. */
  min-height: 240px;
`;

const MapFallback = styled.p`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[4]};
  border: 1px dashed ${({ theme }) => theme.color.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const MapButtons = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[4]};
`;

const MapLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 48px;
  padding: ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.75);
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(12px, 3.2vw, 14px);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.motion.duration.fast} ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.accentSurface};
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Address = styled.p`
  margin: ${({ theme }) => theme.space[10]} 0 0;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;
