import type { ReactNode } from "react";
import styled from "styled-components";

export interface SectionHeadingProps {
  children: ReactNode;
  id?: string;
}

/** 미니멀한 섹션 제목: 양옆 구분선이나 꽃 장식을 넣지 않는다. */
export function SectionHeading({ children, id }: SectionHeadingProps) {
  return <Heading id={id}>{children}</Heading>;
}

const Heading = styled.h2`
  margin: 0 0 29px;
  color: ${({ theme }) => theme.color.accent};
  font-size: clamp(19px, 5vw, 25px);
  font-weight: 500;
  letter-spacing: 0.015em;
  text-align: center;
`;
