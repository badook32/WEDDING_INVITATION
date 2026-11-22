import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Gallery } from "@/components/sections/Gallery";
import { renderWithProviders, screen, within } from "@/test/render";

describe("Gallery", () => {
  it("현재 모바일 번호 기준 13번 제외, 1·3번 상단 및 15·14·2번 묶음으로 23장 표시한다", () => {
    renderWithProviders(<Gallery />);
    expect(screen.getAllByRole("button", { name: /번째 사진 크게 보기:/ })).toHaveLength(23);

    const rowLengths = [2, 3, 2, 4, 3, 4, 2, 3];
    rowLengths.forEach((count, rowIndex) => {
      const list = screen.getByRole("list", { name: `웨딩 사진 ${rowIndex + 1}행` });
      expect(within(list).getAllByRole("listitem")).toHaveLength(count);
    });

    // Mobile positions 1 and 3 -> original board1 15, 12.
    expect(screen.getByRole("button", { name: "1번째 사진 크게 보기: 스튜디오 웨딩 사진 15" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2번째 사진 크게 보기: 스튜디오 웨딩 사진 12" })).toBeInTheDocument();

    // The fifth row uses previous mobile positions 15, 14, 2.
    const fifthRow = within(screen.getByRole("list", { name: "웨딩 사진 5행" }));
    expect(fifthRow.getByRole("button", { name: "12번째 사진 크게 보기: 스튜디오 웨딩 사진 3" })).toBeInTheDocument();
    expect(fifthRow.getByRole("button", { name: "13번째 사진 크게 보기: 스튜디오 웨딩 사진 8" })).toBeInTheDocument();
    expect(fifthRow.getByRole("button", { name: "14번째 사진 크게 보기: 스튜디오 웨딩 사진 1" })).toBeInTheDocument();

    // Previous mobile position 13 = original board1 photo 14 is excluded.
    expect(screen.queryByRole("button", { name: /스튜디오 웨딩 사진 14$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "23번째 사진 크게 보기: 소유 필름 웨딩 사진 1" })).toBeInTheDocument();
  });

  it("썸네일 확대 후 오른쪽 화살표 및 닫기 버튼으로 조작할 수 있다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Gallery />);
    await user.click(screen.getByRole("button", { name: /^1번째 사진 크게 보기:/ }));
    expect(screen.getByRole("dialog", { name: "웨딩 사진 크게 보기" })).toBeInTheDocument();
    expect(screen.getByText("1 / 23")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다음 사진" }));
    expect(screen.getByText("2 / 23")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "사진 확대 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
