import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Share } from "@/components/sections/Share";
import { renderWithProviders, screen, waitFor } from "@/test/render";

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  vi.stubGlobal("isSecureContext", true);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  writeText.mockClear();
  Reflect.deleteProperty(navigator, "clipboard");
  Reflect.deleteProperty(navigator, "share");
});

describe("Share", () => {
  it("공유 버튼이 애니메이션 초기 투명 상태 없이 바로 표시된다", () => {
    renderWithProviders(<Share />);
    expect(screen.getByRole("button", { name: "공유하기" })).toBeVisible();
    expect(screen.getByRole("button", { name: "링크 복사" })).toBeVisible();
  });

  it("지원되는 브라우저에서는 시스템 공유창을 호출한다", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    const user = userEvent.setup();
    renderWithProviders(<Share />);
    await user.click(screen.getByRole("button", { name: "공유하기" }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      title: expect.stringContaining("결혼식"),
      url: expect.stringMatching(/^http/),
    }));
  });

  it("링크 복사 버튼은 공유창 지원 여부와 무관하게 동작한다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Share />);
    await user.click(screen.getByRole("button", { name: "링크 복사" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/^http/)));
    expect(screen.getByRole("status")).toHaveTextContent("청첩장 링크가 복사되었습니다.");
  });
});
