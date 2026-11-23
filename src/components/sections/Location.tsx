import type { MouseEvent } from "react";
import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal, useToast } from "@/components/ui";
import { invitation } from "@/data/invitation";
import { siteConfig } from "@/config/site";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useKakaoRoughMap } from "@/hooks/useKakaoRoughMap";
import { loadKakaoSdk } from "@/lib/kakao";

/** 예식장명 → 복사 가능한 주소 → 지도 → 통합 길찾기 바. */
export function Location() {
  const { venue } = invitation;
  const { status, containerProps } = useKakaoRoughMap(venue.map);
  const { copy } = useCopyToClipboard();
  const { showToast } = useToast();
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(venue.address)}`;

  const copyAddress = async () => {
    const copied = await copy(venue.address);
    showToast(copied ? "주소가 복사되었습니다." : "주소를 복사하지 못했습니다.");
  };

  const handleKakaoNavi = async (event: MouseEvent<HTMLAnchorElement>) => {
    const key = siteConfig.kakao.javaScriptKey;
    if (key === null) {
      // SDK 키가 없으면 href에 지정된 카카오맵 검색으로 자연스럽게 대체한다.
      showToast("카카오맵으로 이동합니다.");
      return;
    }

    event.preventDefault();
    try {
      const kakao = await loadKakaoSdk(key);
      const navi = (kakao as typeof kakao & {
        Navi?: {
          start: (options: { name: string; x: number; y: number; coordType: "wgs84" }) => void;
        };
      }).Navi;
      if (!navi) throw new Error("Kakao Navi SDK unavailable");
      // 온고을로 291 건물 위치. 위도/경도 좌표는 WGS84이다.
      navi.start({ name: venue.name, x: 127.0938667, y: 35.8418694, coordType: "wgs84" });
    } catch {
      showToast("카카오내비를 열지 못해 카카오맵으로 이동합니다.");
      window.location.assign(kakaoMapUrl);
    }
  };

  return (
    <Container>
      <Section title="예식 장소 안내">
        <VenueInfo>
          <VenueName>{venue.name} {venue.hall}</VenueName>
          <AddressButton type="button" onClick={copyAddress} aria-label={`${venue.address} 주소 복사`}>
            <span>{venue.address}</span>
            <CopyGlyph aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <rect x="8" y="8" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="1.5" />
            </CopyGlyph>
          </AddressButton>
        </VenueInfo>

        {containerProps !== null && status !== "failed" && (
          <Reveal safe noFade delay={40}>
            <MapFrame {...containerProps} />
          </Reveal>
        )}
        {status === "failed" && (
          <Reveal safe noFade delay={40}>
            <MapFallback>지도를 불러오지 못했습니다. 아래 길찾기를 이용해 주세요.</MapFallback>
          </Reveal>
        )}

        <Reveal safe noFade delay={210}>
          <MapButtons aria-label="지도 서비스에서 길찾기">
          <MapLink href="https://naver.me/5qLv5PuY" target="_blank" rel="noopener noreferrer">
            네이버지도
          </MapLink>
          <MapLink href="https://tmap.life/506d70fb" target="_blank" rel="noopener noreferrer">
            TMAP
          </MapLink>
          <MapLink href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" onClick={handleKakaoNavi}>
            카카오내비
          </MapLink>
          </MapButtons>
        </Reveal>
      </Section>
    </Container>
  );
}

const VenueInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 23px;
  text-align: center;
`;
const VenueName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(14px, 3.8vw, 17px);
  font-weight: 700;
`;
const AddressButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  max-width: 100%;
  margin: 0 auto;
  padding: 5px;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.color.textMuted};
  text-align: center;
  font-size: clamp(11px, 3vw, 13px);
  line-height: 1.6;
  cursor: pointer;
`;
const CopyGlyph = styled.svg`
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.color.textSubtle};
`;
const MapFrame = styled.div`
  width: 100%;
  min-height: 240px;
  border-radius: 13px;
  overflow: hidden;
`;
const MapFallback = styled.p`
  padding: 45px 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.textMuted};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
const MapButtons = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  margin: 25px auto 0;
  padding: 5px 8px;
  max-width: 390px;
  border: 1px solid #d8d8d8;
  border-radius: 999px;
  background: #ffffff;
`;
const MapLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 3px;
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(11px, 3.1vw, 14px);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
  & + & {
    border-left: 1px solid ${({ theme }) => theme.color.border};
  }
`;
