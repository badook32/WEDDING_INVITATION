import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Gallery } from "@/components/sections/Gallery";
import { renderWithProviders, screen, within } from "@/test/render";

describe("Gallery", () => {
  it("모바일 01~24번 기준 재배열과 board1 상단 사진을 8개 행에 표시한다", () => {
    renderWithProviders(<Gallery />);
    expect(screen.getAllByRole("button", { name: /번째 사진 크게 보기:/ })).toHaveLength(24);

    const rowLengths = [3, 3, 2, 4, 3, 4, 2, 3];
    rowLengths.forEach((count, rowIndex) => {
      const list = screen.getByRole("list", { name: `웨딩 사진 ${rowIndex + 1}행` });
      expect(within(list).getAllByRole("listitem")).toHaveLength(count);
    });

    // New first row: 15, 01, 12 on the FIRST (original) board.
    expect(screen.getByRole("button", { name: "1번째 사진 크게 보기: 스튜디오 웨딩 사진 15" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2번째 사진 크게 보기: 스튜디오 웨딩 사진 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3번째 사진 크게 보기: 스튜디오 웨딩 사진 12" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "24번째 사진 크게 보기: 소유 필름 웨딩 사진 1" })).toBeInTheDocument();

    // Previous mobile position 22 (original photo 19) was removed.
    expect(screen.queryByRole("button", { name: /소유 필름 웨딩 사진 4$/ })).not.toBeInTheDocument();
  });

  it("썸네일 확대 후 오른쪽 화살표 및 닫기 버튼으로 조작할 수 있다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Gallery />);
    await user.click(screen.getByRole("button", { name: /^1번째 사진 크게 보기:/ }));
    expect(screen.getByRole("dialog", { name: "웨딩 사진 크게 보기" })).toBeInTheDocument();
    expect(screen.getByText("1 / 24")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다음 사진" }));
    expect(screen.getByText("2 / 24")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "사진 확대 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
