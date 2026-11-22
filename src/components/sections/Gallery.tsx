import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { invitation } from "@/data/invitation";
import type { GalleryPhoto } from "@/types/invitation";

// Row structure: first pair uses native image aspect ratios, then the requested 3/2-column grid.
const ROW_COLUMNS = [2, 3, 2, 2, 3, 2, 3, 3, 3, 3] as const;

/** 26 photos in the approved order; original photo 15 is intentionally excluded. */
export function Gallery() {
  const { gallery } = invitation;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  const openAt = (index: number) => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    setActiveIndex(index);
  };
  const close = useCallback(() => {
    setActiveIndex(null);
    requestAnimationFrame(() => previousFocus.current?.focus());
  }, []);

  let photoOffset = 0;
  const rows = ROW_COLUMNS.map((columns) => {
    const startIndex = photoOffset;
    photoOffset += columns;
    return { columns, startIndex, photos: gallery.slice(startIndex, photoOffset) };
  });

  return (
    <GalleryContainer>
      <Section title="We’re Getting Married">
        {rows.map(({ columns, startIndex, photos }, rowIndex) => (
          <PhotoGrid
            key={rowIndex}
            $columns={columns}
            $featured={rowIndex === 0}
            role="list"
            aria-label={`웨딩 사진 ${rowIndex + 1}행`}
          >
            {photos.map((photo, index) => (
              <PhotoTile
                key={photo.src}
                photo={photo}
                index={startIndex + index}
                originalAspect={rowIndex === 0}
                onOpen={openAt}
              />
            ))}
          </PhotoGrid>
        ))}
        <Hint>클릭하면 이미지를 크게 보실 수 있습니다.</Hint>
      </Section>
      {mounted && activeIndex !== null && createPortal(
        <PhotoViewer
          photos={gallery}
          index={activeIndex}
          onChange={setActiveIndex}
          onClose={close}
        />,
        document.body,
      )}
    </GalleryContainer>
  );
}

function PhotoTile({
  photo, index, originalAspect, onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  originalAspect: boolean;
  onOpen: (index: number) => void;
}) {
  return (
    <GridItem>
      <TileButton
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`${index + 1}번째 사진 크게 보기: ${photo.alt}`}
      >
        <TileImage
          src={photo.src}
          alt={photo.alt}
          $originalAspect={originalAspect}
          loading="lazy"
          decoding="async"
        />
      </TileButton>
    </GridItem>
  );
}

function PhotoViewer({
  photos, index, onChange, onClose,
}: {
  photos: readonly GalleryPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const count = photos.length;
  const move = useCallback((step: number) => {
    onChange((index + step + count) % count);
  }, [count, index, onChange]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (event.key === "Tab") {
        /* 모달 내부의 세 버튼에서 포커스를 순환한다. */
        const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-photo-viewer] button"));
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [move, onClose]);

  const currentPhoto = photos[index];
  if (currentPhoto === undefined) return null;

  return (
    <ViewerOverlay
      data-photo-viewer
      role="dialog"
      aria-modal="true"
      aria-label="웨딩 사진 크게 보기"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start === null || end === undefined) return;
        const delta = end - start;
        if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1);
      }}
    >
      <ViewerTop>
        <ViewerCount>{index + 1} / {count}</ViewerCount>
        <ViewerClose ref={closeRef} type="button" onClick={onClose} aria-label="사진 확대 닫기">
          ×
        </ViewerClose>
      </ViewerTop>
      <ViewerPhoto src={currentPhoto.src} alt={currentPhoto.alt} />
      <ViewerNav>
        <ViewerArrow type="button" aria-label="이전 사진" onClick={() => move(-1)}>‹</ViewerArrow>
        <ViewerArrow type="button" aria-label="다음 사진" onClick={() => move(1)}>›</ViewerArrow>
      </ViewerNav>
    </ViewerOverlay>
  );
}

const GalleryContainer = styled(Container)`
  padding-left: 0;
  padding-right: 0;
`;

const PhotoGrid = styled.ul<{ $columns: 2 | 3; $featured: boolean }>`
  display: grid;
  grid-template-columns: ${({ $columns, $featured }) =>
    $featured
      ? "minmax(0, 16fr) minmax(0, 9fr)"
      : `repeat(${$columns}, minmax(0, 1fr))`};
  gap: 4px;
  margin: 0 0 4px;
  padding: 0;
  list-style: none;
`;
const GridItem = styled.li`
  min-width: 0;
`;
const TileButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: #f3f3f3;
  cursor: zoom-in;
  overflow: hidden;
`;
const TileImage = styled.img<{ $originalAspect: boolean }>`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: ${({ $originalAspect }) => ($originalAspect ? "auto" : "3 / 4")};
  object-fit: ${({ $originalAspect }) => ($originalAspect ? "contain" : "cover")};
  transition: transform 250ms ease;
  ${TileButton}:hover & {
    transform: scale(1.025);
  }
`;
const Hint = styled.p`
  margin: 15px 0 0;
  color: ${({ theme }) => theme.color.textSubtle};
  font-size: 12px;
  text-align: center;
`;
const ViewerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 12, 12, 0.96);
  touch-action: pan-y;
`;
const ViewerTop = styled.div`
  position: absolute;
  top: max(12px, env(safe-area-inset-top));
  left: 20px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;
const ViewerCount = styled.span`
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
`;
const ViewerClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 0;
  background: transparent;
  color: white;
  font-size: 32px;
  cursor: pointer;
`;
const ViewerPhoto = styled.img`
  display: block;
  width: 100%;
  max-width: min(100vw, 900px);
  height: auto;
  max-height: 82dvh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
`;
const ViewerNav = styled.div`
  position: absolute;
  bottom: max(16px, env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 22px;
`;
const ViewerArrow = styled.button`
  width: 56px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
`;
