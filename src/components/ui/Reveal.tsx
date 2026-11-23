import type { ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import { useInView } from "@/hooks/useInView";

export interface RevealProps {
  children: ReactNode;
  /** 여러 요소를 순차로 등장시킬 때 쓰는 지연 시간(ms). */
  delay?: number;
  /** 애니메이션 감지가 실패해도 콘텐츠를 숨기지 않는 안전 모드. */
  safe?: boolean;
}

/**
 * 화면에 들어올 때 아래에서 떠오르는 등장 효과.
 *
 * 렌더할 태그를 바꾸는 `as` prop은 일부러 두지 않았다. useInView가
 * HTMLDivElement로 고정된 ref를 만들기 때문에, `as`로 다른 요소를 렌더하면
 * ref 타입과 실제 DOM 요소가 조용히 어긋난다. 다른 태그가 필요해지면
 * useInView의 타입 파라미터와 함께 올바르게 열어야 한다.
 */
export function Reveal({ children, delay = 0, safe = false }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Wrapper ref={ref} $visible={inView} $delay={delay} $safe={safe}>
      {children}
    </Wrapper>
  );
}

/**
 * 새 섹션에서는 초기 상태를 숨기지 않는다. Android WebView에서
 * IntersectionObserver 콜백이 누락되어도 사진·지도가 계속 보인다.
 * 화면 진입이 감지되는 경우에만 동일한 Fade-up을 한 번 실행한다.
 */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div<{ $visible: boolean; $delay: number; $safe: boolean }>`
  opacity: ${({ $visible, $safe }) => ($safe || $visible ? 1 : 0)};
  transform: translateY(${({ $visible, $safe }) => ($safe || $visible ? "0" : "16px")});
  transition:
    opacity ${({ theme }) => theme.motion.duration.slow}
      ${({ theme }) => theme.motion.easing},
    transform ${({ theme }) => theme.motion.duration.slow}
      ${({ theme }) => theme.motion.easing};
  transition-delay: ${({ $delay, $safe }) => ($safe ? 0 : $delay)}ms;

  ${({ $safe, $visible, $delay, theme }) =>
    $safe && $visible
      ? css`
          animation: ${fadeUp} ${theme.motion.duration.slow}
            ${theme.motion.easing} ${$delay}ms both;
        `
      : ""}

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    animation: none;
  }
`;
