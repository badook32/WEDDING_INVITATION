import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MusicToggle } from "@/components/layout/MusicToggle";
import { renderWithProviders, screen, waitFor } from "@/test/render";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MusicToggle", () => {
  it("페이지 진입 후 소리 있는 재생을 시도한다", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    renderWithProviders(<MusicToggle src="/song.mp3" />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("button", { name: "배경음악" })).toBeInTheDocument();
  });

  it("자동 재생이 차단되면 첫 화면 터치에서 다시 시도한다", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValueOnce(new DOMException("NotAllowedError", "NotAllowedError"))
      .mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    renderWithProviders(<MusicToggle src="/song.mp3" />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });
});
