import { useState } from "react";
import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { useToast } from "@/components/ui";
import { getShareUrl, siteConfig, toAbsoluteUrl } from "@/config/site";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { loadKakaoSdk, shareInvitation } from "@/lib/kakao";

/**
 * 공유 버튼은 IntersectionObserver 기반 Reveal 안에 두지 않는다.
 * 일부 Android WebView에서 opacity:0 상태로 남아 클릭만 가능한 문제를 방지한다.
 */
export function Share() {
  const { copy } = useCopyToClipboard();
  const { showToast } = useToast();
  const [sharing, setSharing] = useState(false);

  const handleCopyLink = async () => {
    const copied = await copy(getShareUrl());
    showToast(
      copied
        ? "청첩장 링크가 복사되었습니다."
        : "복사하지 못했습니다. 주소창의 주소를 직접 복사해 주세요.",
    );
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      // Android/iOS browsers with Web Share API: use the native share sheet.
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: siteConfig.title,
            text: siteConfig.description,
            url: getShareUrl(),
          });
          return;
        } catch (error) {
          // Closing the share sheet intentionally is not a sharing failure.
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }

      // Fallback for browsers without Web Share API.
      const kakaoKey = siteConfig.kakao.javaScriptKey;
      if (kakaoKey !== null) {
        try {
          const kakao = await loadKakaoSdk(kakaoKey);
          shareInvitation(kakao, {
            title: siteConfig.title,
            description: siteConfig.description,
            imageUrl: toAbsoluteUrl(siteConfig.ogImagePath),
            url: getShareUrl(),
          });
          return;
        } catch {
          // Keep link copy as the final working fallback.
        }
      }
      await handleCopyLink();
    } finally {
      setSharing(false);
    }
  };

  return (
    <Container>
      <Section title="청첩장 공유하기">
        <ShareActions>
          <PrimaryButton type="button" onClick={handleShare} disabled={sharing}>
            <ShareIcon />
            {sharing ? "공유창을 여는 중…" : "공유하기"}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={handleCopyLink}>
            링크 복사
          </SecondaryButton>
        </ShareActions>
      </Section>
    </Container>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v5a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ShareActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 310px;
  margin: 0 auto 48px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 50px;
  padding: 12px 20px;
  border: 0;
  border-radius: 999px;
  background-color: #E58A78;
  color: #322725;
  -webkit-text-fill-color: #322725;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  opacity: 1;
  visibility: visible;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  appearance: none;
  box-shadow: none;
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    background-color: #DE806F;
  }
  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 8px 22px;
  border: 1px solid #F2C0B5;
  border-radius: 999px;
  background-color: #ffffff;
  color: #AA5141;
  -webkit-text-fill-color: #AA5141;
  font-size: 13px;
  font-weight: 500;
  opacity: 1;
  visibility: visible;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
`;
