import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui";
import { invitation } from "@/data/invitation";

/** 인용문, 인사말, 혼주 소개. 꽃 장식은 사용하지 않는다. */
export function Greeting() {
  const { greeting, couple, quote } = invitation;

  return (
    <Container>
      <GreetingPanel aria-labelledby="greeting-heading">
        <QuoteIntro>
          <QuoteLines>
            {quote.lines.map((line, index) =>
              line === "" ? (
                <QuoteSpace key={`space-${index}`} aria-hidden="true" />
              ) : (
                <span key={`${index}-${line}`}>{line}</span>
              ),
            )}
          </QuoteLines>
          <QuoteCaption>
            <cite>— {quote.source}</cite>
          </QuoteCaption>
        </QuoteIntro>

        <GreetingHeading id="greeting-heading">{greeting.heading}</GreetingHeading>
        <Message>
          {greeting.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 80}>
              <GreetingParagraph>{paragraph}</GreetingParagraph>
            </Reveal>
          ))}
        </Message>

        <Reveal delay={greeting.paragraphs.length * 80}>
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
      </GreetingPanel>
    </Container>
  );
}

const GreetingPanel = styled.section`
  padding: 8px 0 27px;
  text-align: center;
`;

const QuoteIntro = styled.figure`
  margin: 0;
  padding: 47px 0 44px;
`;

const QuoteLines = styled.blockquote`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(12px, 3.35vw, 15px);
  line-height: 2;
  word-break: keep-all;
`;

const QuoteSpace = styled.span`
  display: block;
  height: 18px;
`;

const QuoteCaption = styled.figcaption`
  margin-top: 17px;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 12px;
  cite { font-style: normal; }
`;

const GreetingHeading = styled.h2`
  margin: 0 0 28px;
  color: ${({ theme }) => theme.color.accent};
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.07em;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-bottom: 38px;
  color: ${({ theme }) => theme.color.textMuted};
  text-align: center;
`;

const GreetingParagraph = styled.p`
  margin: 0;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
  font-size: clamp(12px, 3.4vw, 14px);
  line-height: 2.1;
  letter-spacing: 0.01em;
`;

const Families = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 29px 0 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};
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

const ParentNames = styled.span`
  color: ${({ theme }) => theme.color.text};
  font-weight: 500;
  white-space: nowrap;
`;
const ChildOrder = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 12px;
  white-space: nowrap;
`;
const FamilyRole = styled.span`
  color: ${({ theme }) => theme.color.accent};
  font-size: 12px;
  white-space: nowrap;
`;
const PartnerName = styled.strong`
  color: ${({ theme }) => theme.color.text};
  font-size: 16px;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;
