import styled from "styled-components";
import Song from "@/assets/song.mp3";
import { Seo } from "@/components/Seo";
import { MusicToggle } from "@/components/layout/MusicToggle";
import { Gallery } from "@/components/sections/Gallery";
import { Gift } from "@/components/sections/Gift";
import { Greeting } from "@/components/sections/Greeting";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Share } from "@/components/sections/Share";
import { WeddingDate } from "@/components/sections/WeddingDate";
import "@/styles/index.css";

export default function IndexPage() {
  return (
    <Page>
      <MusicToggle src={Song} />
      <main>
        <Hero />
        <Greeting />
        <WeddingDate />
        <Gallery />
        <Location />
        <Gift />
        <Share />
      </main>
    </Page>
  );
}

export function Head() {
  return <Seo />;
}

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;
