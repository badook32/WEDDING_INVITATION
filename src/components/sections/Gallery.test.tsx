import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Gallery } from "@/components/sections/Gallery";
import { renderWithProviders, screen, within } from "@/test/render";

describe("Gallery", () => {
  it("26장, 첫 두 장의 원본 비율 및 사용자 지정 10개 행을 확인한다", () => {
    renderWithProviders(<Gallery />);
    expect(screen.getAllByRole("button", { name: /번째 사진 크게 보기:/ })).toHaveLength(26);
    const rowLengths = [2, 3, 2, 2, 3, 2, 3, 3, 3, 3];
    rowLengths.forEach((count, rowIndex) => {
      const list = screen.getByRole("list", { name: `웨딩 사진 ${rowIndex + 1}행` });
      expect(within(list).getAllByRole("listitem")).toHaveLength(count);
    });
    expect(screen.getByRole("button", { name: "1번째 사진 크게 보기: 스튜디오 웨딩 사진 12" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2번째 사진 크게 보기: 스튜디오 웨딩 사진 1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /스튜디오 웨딩 사진 15/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "26번째 사진 크게 보기: 소유 필름 웨딩 사진 1" })).toBeInTheDocument();
  });

  it("썸네일 확대 후 오른쪽 화살표 및 닫기 버튼으로 조작할 수 있다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Gallery />);
    await user.click(screen.getByRole("button", { name: /^1번째 사진 크게 보기:/ }));
    expect(screen.getByRole("dialog", { name: "웨딩 사진 크게 보기" })).toBeInTheDocument();
    expect(screen.getByText("1 / 26")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다음 사진" }));
    expect(screen.getByText("2 / 26")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "사진 확대 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
