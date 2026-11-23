import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/ui/Reveal";
import { renderWithProviders, screen } from "@/test/render";

describe("Reveal safe", () => {
  it("스크롤 감지 콜백이 없더라도 클릭 가능한 콘텐츠를 투명하게 숨기지 않는다", () => {
    renderWithProviders(
      <Reveal safe>
        <button type="button">앨범 열기</button>
      </Reveal>,
    );
    expect(screen.getByRole("button", { name: "앨범 열기" })).toBeVisible();
  });

  it("원래 인사말에 사용하는 Reveal을 별도 옵션 없이 유지한다", () => {
    renderWithProviders(
      <Reveal>
        <span>인사말</span>
      </Reveal>,
    );
    expect(screen.getByText("인사말")).toBeInTheDocument();
  });
});
