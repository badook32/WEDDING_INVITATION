import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal, useToast } from "@/components/ui";
import { invitation } from "@/data/invitation";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatAccountForCopy, selectGiftAccountGroups } from "@/lib/gift";
import type { GiftAccountEntry } from "@/types/invitation";

/** 계좌는 접지 않고 노출하고, 각 행을 탭하면 복사 완료 알림을 띄운다. */
export function Gift() {
  const groups = selectGiftAccountGroups(invitation.couple);
  if (groups.length === 0) return null;

  return (
    <Container>
      <Section title="마음 전하실 곳">
        <Reveal safe delay={60}>
          <Description>
            전해 주시는 따뜻한 축하의 마음을<br />
            오래도록 간직하며<br />
            행복한 모습으로 보답하며 살겠습니다.
          </Description>
        </Reveal>
        <Groups>
          {groups.map((group) => {
            const side = group.label.replace(/측$/, "");
            return (
              <AccountGroup key={group.label} aria-label={`${group.label} 계좌`}>
                <GroupTitle>{side} 측</GroupTitle>
                <Reveal safe noFade delay={90}>
                  <AccountList role="list">
                  {group.entries.map((entry) => (
                    <AccountRow
                      key={`${entry.relation}-${entry.name}-${entry.account.number}`}
                      entry={entry}
                      side={side}
                    />
                  ))}
                  </AccountList>
                </Reveal>
              </AccountGroup>
            );
          })}
        </Groups>
      </Section>
    </Container>
  );
}

function AccountRow({ entry, side }: { entry: GiftAccountEntry; side: string }) {
  const { copy } = useCopyToClipboard();
  const { showToast } = useToast();
  const relation = entry.relation === side ? side : `${side} ${entry.relation}`;

  const handleCopy = async () => {
    const copied = await copy(formatAccountForCopy(entry));
    showToast(copied ? "계좌번호가 복사되었습니다." : "복사하지 못했습니다. 길게 눌러 직접 복사해 주세요.");
  };

  return (
    <AccountItem>
      <CopyButton
        type="button"
        onClick={handleCopy}
        aria-label={`${entry.relation} ${entry.name}의 계좌번호 ${entry.account.bank} ${entry.account.number} 복사`}
      >
        <AccountInfo>
          <Owner>
            <Relation>{relation}</Relation>
            <OwnerName>{entry.name}</OwnerName>
          </Owner>
          <BankAndNumber>
            <Bank>{entry.account.bank}</Bank>
            <Number>{entry.account.number}</Number>
          </BankAndNumber>
        </AccountInfo>
        <CopyIcon aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <rect x="8" y="8" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="1.5" />
        </CopyIcon>
      </CopyButton>
    </AccountItem>
  );
}

const Description = styled.p`
  margin: 0 0 35px;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: clamp(12px, 3.35vw, 14px);
  text-align: center;
  line-height: 2.15;
`;
const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 31px;
`;
const AccountGroup = styled.section`
  min-width: 0;
`;
const GroupTitle = styled.h3`
  margin: 0 0 13px;
  color: ${({ theme }) => theme.color.accent};
  font-size: 17px;
  font-weight: 600;
  text-align: center;
`;
const AccountList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
const AccountItem = styled.li`
  min-width: 0;
`;
const CopyButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-height: 73px;
  padding: 13px 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 10px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.color.accentSurface};
    border-color: ${({ theme }) => theme.color.accentSoft};
  }
`;
const AccountInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;
const Owner = styled.span`
  display: flex;
  gap: 9px;
  align-items: baseline;
`;
const Relation = styled.span`
  color: ${({ theme }) => theme.color.textSubtle};
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
`;
const OwnerName = styled.strong`
  color: #222;
  font-size: 16px;
  font-weight: 600;
`;
const BankAndNumber = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 3px 8px;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 13px;
  line-height: 1.6;
`;
const Bank = styled.span`
  white-space: nowrap;
`;
const Number = styled.span`
  overflow-wrap: anywhere;
  font-variant-numeric: tabular-nums;
`;
const CopyIcon = styled.svg`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.color.accent};
`;
