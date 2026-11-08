import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Gift } from "@/components/sections/Gift";
import { renderWithProviders, screen, within, waitFor } from "@/test/render";

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  vi.stubGlobal("isSecureContext", true);
});

function setupUser() {
  const user = userEvent.setup();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return user;
}

afterEach(() => {
  vi.unstubAllGlobals();
  writeText.mockClear();
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("Gift", () => {
  it("처음부터 신랑 두 계좌와 신부 세 계좌를 모달 없이 표시한다", () => {
    renderWithProviders(<Gift />);
    const groom = screen.getByRole("region", { name: "신랑측 계좌" });
    const bride = screen.getByRole("region", { name: "신부측 계좌" });

    expect(within(groom).getByRole("heading", { name: "신랑" })).toBeInTheDocument();
    expect(within(bride).getByRole("heading", { name: "신부" })).toBeInTheDocument();
    expect(within(groom).getAllByRole("button", { name: /복사$/ })).toHaveLength(2);
    expect(within(bride).getAllByRole("button", { name: /복사$/ })).toHaveLength(3);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("신랑·신부 본인 계좌를 각각 맨 위에 표시한다", () => {
    renderWithProviders(<Gift />);
    const groom = screen.getByRole("region", { name: "신랑측 계좌" });
    const bride = screen.getByRole("region", { name: "신부측 계좌" });

    const groomButtons = within(groom).getAllByRole("button", { name: /복사$/ });
    const brideButtons = within(bride).getAllByRole("button", { name: /복사$/ });
    expect(groomButtons[0]).toHaveAccessibleName(/^신랑 고민혁의 계좌번호/);
    expect(brideButtons[0]).toHaveAccessibleName(/^신부 이유진의 계좌번호/);
    expect(groomButtons[1]).toHaveAccessibleName(/^어머니 노현미의 계좌번호/);
    expect(brideButtons[1]).toHaveAccessibleName(/^아버지 이기홍의 계좌번호/);
    expect(brideButtons[2]).toHaveAccessibleName(/^어머니 이주현의 계좌번호/);
  });

  it("계좌 행을 한 번 클릭하면 은행명과 번호가 복사된다", async () => {
    const user = setupUser();
    renderWithProviders(<Gift />);
    await user.click(screen.getByRole("button", { name: /^신랑 고민혁의 계좌번호/ }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/^카카오뱅크 /));
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("계좌번호가 복사되었습니다.");
    });
  });

  it("복사 실패 시 성공 메시지를 보여주지 않는다", async () => {
    writeText.mockRejectedValueOnce(new Error("권한 거부"));
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    const user = setupUser();
    renderWithProviders(<Gift />);
    await user.click(screen.getByRole("button", { name: /^신부 이유진의 계좌번호/ }));

    await waitFor(() => {
      const status = screen.getByRole("status");
      expect(status).not.toHaveTextContent("계좌번호가 복사되었습니다.");
      expect(status).toHaveTextContent(/복사하지 못했습니다/);
    });
  });
});
