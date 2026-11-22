import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Gallery } from "@/components/sections/Gallery";
import { renderWithProviders, screen, within } from "@/test/render";

describe("Gallery", () => {
  it("스튜디오 15, soyouu 9, snap 3장 등 27장의 썸네일을 모두 표시한다", () => {
    renderWithProviders(<Gallery />);
    expect(screen.getAllByRole("button", { name: /번째 사진 크게 보기:/ })).toHaveLength(27);
    expect(within(screen.getByRole("list", { name: "스튜디오 웨딩 사진 앞부분" })).getAllByRole("listitem")).toHaveLength(9);
    expect(within(screen.getByRole("list", { name: "스튜디오 웨딩 사진 뒷부분" })).getAllByRole("listitem")).toHaveLength(6);
    expect(within(screen.getByRole("list", { name: "소유 필름 사진" })).getAllByRole("listitem")).toHaveLength(9);
    expect(within(screen.getByRole("list", { name: "스냅 사진" })).getAllByRole("listitem")).toHaveLength(3);
  });

  it("썸네일 확대 후 오른쪽 화살표 및 닫기 버튼으로 조작할 수 있다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Gallery />);
    await user.click(screen.getByRole("button", { name: /^1번째 사진 크게 보기:/ }));
    expect(screen.getByRole("dialog", { name: "웨딩 사진 크게 보기" })).toBeInTheDocument();
    expect(screen.getByText("1 / 27")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다음 사진" }));
    expect(screen.getByText("2 / 27")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "사진 확대 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
