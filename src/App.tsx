import { useEffect, useState } from "react";
import { NavBar } from "./components/NavBar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { PossibilitiesSection } from "./components/PossibilitiesSection";
import { BehaviorSection } from "./components/BehaviorSection";
import { DownloadSection } from "./components/DownloadSection";

const GITHUB_URL = "https://github.com/ristar-h/desktop-pet";
// 下载链接指向同源静态资源（public 目录下的 dmg），点击后浏览器原地下载
const DOWNLOAD_URL = "/Desktop-Pet-0.2.1.dmg";
const DOWNLOAD_FILENAME = "Desktop-Pet-0.2.1.dmg";
const VERSION = "0.2.1";
const FILE_SIZE = "12.6 MB";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "features", label: "How" },
  { id: "possibilities", label: "Anyone" },
  { id: "behavior", label: "Mood" },
  { id: "download", label: "Get" },
];

function App() {
  const [activeSection, setActiveSection] = useState("hero");

  // 监听滚动位置，更新右侧指示器
  useEffect(() => {
    function onScroll() {
      const center = window.scrollY + window.innerHeight / 2;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (center >= top && center < bottom) {
          current = s.id;
          break;
        }
      }
      setActiveSection(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToDownload() {
    const el = document.getElementById("download");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <NavBar
        onDownloadClick={scrollToDownload}
        downloadUrl={DOWNLOAD_URL}
        downloadFilename={DOWNLOAD_FILENAME}
        githubUrl={GITHUB_URL}
      />

      {/* 右侧滚动进度指示器 */}
      <div className="snap-indicator" aria-label="page sections">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            className={activeSection === s.id ? "active" : ""}
            title={s.label}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(s.id);
            }}
          />
        ))}
      </div>

      <main>
        <HeroSection />
        <FeaturesSection />
        <PossibilitiesSection />
        <BehaviorSection />
        <DownloadSection
          downloadUrl={DOWNLOAD_URL}
          downloadFilename={DOWNLOAD_FILENAME}
          version={VERSION}
          fileSize={FILE_SIZE}
          githubUrl={GITHUB_URL}
        />
      </main>
    </>
  );
}

export default App;
