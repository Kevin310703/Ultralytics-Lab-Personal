import Encryption from "@/components/custom/encryption";
import Hero from "@/components/custom/hero";
import Projects from "@/components/custom/projects";
import Skills from "@/components/custom/skills";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Encryption />
        <Projects />
      </div>
    </main>
  );
}
