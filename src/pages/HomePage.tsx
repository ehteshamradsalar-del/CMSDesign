import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import AICurator from "../components/home/AICurator";
import Comparison from "../components/home/Comparison";
import TopArtists from "../components/home/TopArtists";
import CTA from "../components/home/CTA";
import "./HomePage.css";

export default function HomePage() {
    return (
        <main className="home">
            <Hero />
            <Stats />
            <Features />
            <AICurator />
            <Comparison />
            <TopArtists />
            <CTA />
        </main>
    );
}