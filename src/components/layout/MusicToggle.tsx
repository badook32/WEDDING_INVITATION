import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface MusicToggleProps {
  src: string;
  label?: string;
}

/**
 * 처음 진입하면 소리 있는 재생을 시도한다.
 * Safari/Chrome에서 자동 재생이 차단되면 첫 사용자 터치/Enter/Space에 재시도한다.
 * 사용자가 직접 켜거나 끈 뒤에는 자동 재시도를 하지 않는다.
 */
export function MusicToggle({ src, label = "배경음악" }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const manuallyControlled = useRef(false);
  const stopRetryRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (audio === null) return;

    manuallyControlled.current = true;
    stopRetryRef.current();

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio === null) return;

    let active = true;
    manuallyControlled.current = false;

    const syncPlaying = () => setPlaying(true);
    const syncPaused = () => setPlaying(false);
    const stopRetry = () => {
      document.removeEventListener("pointerdown", resumeOnGesture, true);
      document.removeEventListener("keydown", resumeOnGesture, true);
    };
    const resumeOnGesture = (event: Event) => {
      if (manuallyControlled.current) {
        stopRetry();
        return;
      }
      if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
      if (event.target instanceof Element && event.target.closest("[data-music-toggle]")) return;
      // Must be called synchronously in the user gesture for mobile browsers.
      void audio.play().then(stopRetry).catch(() => {
        // The manual music toggle remains available if the gesture is rejected.
      });
    };

    stopRetryRef.current = stopRetry;
    audio.addEventListener("playing", syncPlaying);
    audio.addEventListener("pause", syncPaused);

    // Autoplay is a best-effort request; browsers may reject it with NotAllowedError.
    void audio.play().then(() => {
      if (active) setPlaying(true);
    }).catch(() => {
      if (!active || manuallyControlled.current) return;
      setPlaying(false);
      document.addEventListener("pointerdown", resumeOnGesture, true);
      document.addEventListener("keydown", resumeOnGesture, true);
    });

    return () => {
      active = false;
      stopRetry();
      stopRetryRef.current = () => {};
      audio.removeEventListener("playing", syncPlaying);
      audio.removeEventListener("pause", syncPaused);
      audio.pause();
    };
  }, [src]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- 가사 없는 연주곡, 재생 제어 버튼 제공 */}
      <audio ref={audioRef} src={src} loop preload="auto" />
      <ToggleButton
        data-music-toggle
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={label}
        title={playing ? "배경음악 끄기" : "배경음악 켜기"}
      >
        <SpeakerIcon muted={!playing} />
      </ToggleButton>
    </>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

const ToggleButton = styled.button`
  position: fixed;
  top: max(12px, env(safe-area-inset-top, 0px));
  right: max(16px, env(safe-area-inset-right, 0px));
  left: auto;
  bottom: auto;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.92);
  color: #AF5847;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
`;
