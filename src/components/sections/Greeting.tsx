import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui";
import { invitation } from "@/data/invitation";

/** 문단이 차례로 떠오르도록 주는 간격. */
const STAGGER_DELAY_MS = 80;

/** 인사말과 혼주 소개. */
export function Greeting() {
  const { greeting, couple, quote } = invitation;

  return (
    <Container>
      <GreetingPanel>
        <QuoteIntro>
          <QuoteLines>
            {quote.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </QuoteLines>
          <QuoteCaption>
            <cite>— {quote.source}</cite>
          </QuoteCaption>
        </QuoteIntro>
        <Section title={greeting.heading} ornament>
        <Message>
          {greeting.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * STAGGER_DELAY_MS}>
              <GreetingParagraph>{paragraph}</GreetingParagraph>
            </Reveal>
          ))}
        </Message>

        <Reveal delay={greeting.paragraphs.length * STAGGER_DELAY_MS}>
          <Families role="list">
            <li>
              <ParentNames>{couple.groom.father.name} · {couple.groom.mother.name}</ParentNames>
              <ChildOrder>의 {couple.groom.childOrder}</ChildOrder>
              <FamilyRole>신랑</FamilyRole>
              <PartnerName>{couple.groom.name}</PartnerName>
            </li>
            <li>
              <ParentNames>{couple.bride.father.name} · {couple.bride.mother.name}</ParentNames>
              <ChildOrder>의 {couple.bride.childOrder}</ChildOrder>
              <FamilyRole>신부</FamilyRole>
              <PartnerName>{couple.bride.name}</PartnerName>
            </li>
          </Families>
        </Reveal>
        </Section>
      </GreetingPanel>
    </Container>
  );
}

const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[10]};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const Families = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 345px;
  margin: 0 auto;
  padding: 28px 0 0;
  border-top: 1px solid rgba(100, 88, 80, 0.18);
  color: #403c3b;
  list-style: none;

  li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 5px 7px;
    font-size: clamp(12px, 3.45vw, 14px);
    line-height: 1.8;
  }
`;

const GreetingPanel = styled.div`
  margin-top: 10px;
  padding: 0 10px 36px;
  border-top: 1px solid rgba(100, 88, 80, 0.14);
  border-bottom: 1px solid rgba(100, 88, 80, 0.14);
  background: rgba(255, 255, 255, 0.55);
  text-align: center;
  > section {
    padding-top: 27px;
  }
`;

const QuoteIntro = styled.figure`
  margin: 0;
  padding: 41px 4px 28px;
  border-bottom: 1px solid rgba(100, 88, 80, 0.14);
`;

const QuoteLines = styled.blockquote`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  color: #6e6763;
  font-size: clamp(12px, 3.55vw, 14px);
  font-style: italic;
  line-height: 1.95;
  word-break: keep-all;
`;

const QuoteCaption = styled.figcaption`
  margin-top: 12px;
  color: #8b827e;
  font-size: 12px;
  cite { font-style: normal; }
`;

const GreetingParagraph = styled.p`
  margin: 0;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
  font-size: clamp(12px, 3.55vw, 15px);
  line-height: 2.1;
  letter-spacing: 0.02em;
`;

const ParentNames = styled.span`
  font-weight: 500;
  white-space: nowrap;
`;

const ChildOrder = styled.span`
  color: #7d7470;
  font-size: 12px;
  white-space: nowrap;
`;

const FamilyRole = styled.span`
  color: #a8434a;
  font-size: 12px;
  white-space: nowrap;
`;

const PartnerName = styled.strong`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
`;
