import type { ReactNode } from "react";
import styled from "styled-components";
import { useInView } from "@/hooks/useInView";

export interface RevealProps {
  children: ReactNode;
  /** 여러 요소를 순차로 등장시킬 때 쓰는 지연 시간(ms). */
  delay?: number;
  /** 애니메이션 감지가 실패해도 콘텐츠를 숨기지 않는 안전 모드. */
  safe?: boolean;
  /** 이미지·지도·버튼용: 투명도 변화 없이 천천히 올라오는 효과. */
  noFade?: boolean;
}

/**
 * 화면에 들어올 때 아래에서 떠오르는 등장 효과.
 *
 * 렌더할 태그를 바꾸는 `as` prop은 일부러 두지 않았다. useInView가
 * HTMLDivElement로 고정된 ref를 만들기 때문에, `as`로 다른 요소를 렌더하면
 * ref 타입과 실제 DOM 요소가 조용히 어긋난다. 다른 태그가 필요해지면
 * useInView의 타입 파라미터와 함께 올바르게 열어야 한다.
 */
export function Reveal({ children, delay = 0, safe = false, noFade = false }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Wrapper ref={ref} $visible={inView} $delay={delay} $safe={safe} $noFade={noFade}>
      {children}
    </Wrapper>
  );
}

/**
 * 기존 safe 키프레임은 시작 순간 opacity 0을 강제하여 사진이 깜박였다.
 * 새 방식은 초기부터 보이는 상태로 두고 1.7초 동안 천천히 이동한다.
 * noFade는 이미지·지도·버튼처럼 투명도 변경이 부자연스러운 영역에 사용.
 */
const Wrapper = styled.div<{
  $visible: boolean;
  $delay: number;
  $safe: boolean;
  $noFade: boolean;
}>`
  opacity: ${({ $visible, $safe, $noFade }) =>
    $safe ? ($noFade || $visible ? 1 : 0.94) : $visible ? 1 : 0};
  transform: translateY(${({ $visible, $safe }) =>
    $visible ? "0" : $safe ? "18px" : "16px"});
  transition-property: opacity, transform;
  transition-duration: ${({ $safe }) => $safe ? "1700ms" : "1400ms"};
  transition-timing-function: cubic-bezier(0.35, 0.05, 0.2, 1);
  transition-delay: ${({ $delay }) => $delay}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;
