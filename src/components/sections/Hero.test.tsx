import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";
import { renderWithProviders, screen, within } from "@/test/render";

describe("Hero", () => {
  it("기존 메인 사진을 유지하고 신랑·신부 이름과 예식 일시·장소를 보여준다", () => {
    renderWithProviders(<Hero />);

    const photo = screen.getByRole("img", {
      name: "신랑과 신부가 함께 웨딩 케이크를 들고 있는 모습",
    });
    expect(photo).toHaveAttribute("src", "/wedding/hero.webp");

    const names = screen.getByRole("heading", { level: 1 });
    expect(within(names).getByText("신랑")).toBeInTheDocument();
    expect(within(names).getByText("고민혁")).toBeInTheDocument();
    expect(within(names).getByText("신부")).toBeInTheDocument();
    expect(within(names).getByText("이유진")).toBeInTheDocument();

    expect(screen.getByText("2027년 2월 27일 토요일 오후 4시"))
      .toHaveAttribute("datetime", "2027-02-27T16:00");
    expect(screen.getByText("아름다운컨벤션 2층 컨벤션홀")).toBeInTheDocument();
  });
});
