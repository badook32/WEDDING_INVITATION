import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { useToast } from "@/components/ui";
import { invitation } from "@/data/invitation";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatAccountForCopy, selectGiftAccountGroups } from "@/lib/gift";
import type { GiftAccountEntry } from "@/types/invitation";

/**
 * 신랑·신부 계좌를 처음부터 모두 보여 준다.
 * 각 계좌 행 전체가 복사 버튼이므로 모달이나 펼치기 조작이 필요 없다.
 * 표시 순서와 비공개 계좌 제외 규칙은 selectGiftAccountGroups가 관리한다.
 */
export function Gift() {
  const groups = selectGiftAccountGroups(invitation.couple);
  if (groups.length === 0) return null;

  return (
    <Container>
      <Section title="축하의 마음을 전하세요" ornament>
        <Description>계좌번호를 누르면 복사됩니다.</Description>
        <Groups>
          {groups.map((group) => (
            <AccountGroup key={group.label} aria-label={`${group.label} 계좌`}>
              <GroupTitle>{group.label.replace(/측$/, "")}</GroupTitle>
              <AccountList>
                {group.entries.map((entry) => (
                  <AccountRow
                    key={`${entry.relation}-${entry.name}-${entry.account.number}`}
                    entry={entry}
                  />
                ))}
              </AccountList>
            </AccountGroup>
          ))}
        </Groups>
      </Section>
    </Container>
  );
}

function AccountRow({ entry }: { entry: GiftAccountEntry }) {
  const { copy } = useCopyToClipboard();
  const { showToast } = useToast();

  const handleCopy = async () => {
    const copied = await copy(formatAccountForCopy(entry));
    showToast(
      copied
        ? "계좌번호가 복사되었습니다."
        : "복사하지 못했습니다. 길게 눌러 직접 복사해 주세요.",
    );
  };

  return (
    <AccountItem>
      <CopyButton
        type="button"
        onClick={handleCopy}
        aria-label={`${entry.relation} ${entry.name}의 계좌번호 ${entry.account.bank} ${entry.account.number} 복사`}
      >
        <AccountInfo>
          <AccountOwner>{entry.relation} {entry.name}</AccountOwner>
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
  margin: 0 0 24px;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const AccountGroup = styled.section`
  min-width: 0;
`;

const GroupTitle = styled.h3`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.color.accent};
  font-size: 16px;
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
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 68px;
  padding: 13px 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.72);
  color: ${({ theme }) => theme.color.text};
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.accentSurface};
    border-color: ${({ theme }) => theme.color.accentSoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focusRing};
    outline-offset: 2px;
  }
`;

const AccountInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const AccountOwner = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const BankAndNumber = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 3px 8px;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 13px;
  line-height: 1.5;
`;

const Bank = styled.span`
  white-space: nowrap;
`;

const Number = styled.span`
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
`;

const CopyIcon = styled.svg`
  flex: 0 0 21px;
  width: 21px;
  height: 21px;
  color: ${({ theme }) => theme.color.accent};
`;
