import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FÓRMULACEM — Equipe de Formula SAE" },
      { name: "description", content: "Conheça a FÓRMULACEM: equipe universitária de Formula SAE, nosso carro, conquistas e patrocinadores." },
      { property: "og:title", content: "FÓRMULACEM — Equipe de Formula SAE" },
      { property: "og:description", content: "Equipe universitária de Formula SAE: carro, conquistas e patrocinadores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (el.classList.add("in"), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useInView<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-primary">
      <span className="pulse-dot h-1.5 w-1.5 bg-primary" /> {children}
    </div>
  );
}

function Title({ a, b }: { a: string; b: string }) {
  return (
    <h2 className="font-display text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
      {a} <span className="text-outline">{b}</span>
    </h2>
  );
}

function Cta({ children, href = "#contato" }: { children: ReactNode; href?: string }) {
  return (
    <a href={href} className="chamfer-sm group relative inline-flex items-center gap-2 overflow-hidden bg-primary px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-shadow hover:shadow-glow">
      <span className="sweep absolute inset-y-0 left-0 w-1/4 bg-foreground/30 blur-md" />
      <span className="relative">{children}</span>
      <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function Panel({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`chamfer group relative overflow-hidden bg-card ${className}`}>
      <div className="grid-lines absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <span className="absolute left-4 top-4 font-display text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-700 group-hover:w-full" />
    </div>
  );
}

const NAV = ["Início", "Equipe", "Carro", "Conquistas", "Patrocínio", "Contato"];
const slug = (n: string) => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function useSmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: string | HTMLElement) => void } | null = null;
    let id = 0;
    let alive = true;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement); }
    };
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      document.documentElement.style.scrollBehavior = "auto";
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      const loop = (t: number) => { lenis!.raf(t); id = requestAnimationFrame(loop); };
      id = requestAnimationFrame(loop);
    });
    document.addEventListener("click", onClick);
    return () => { alive = false; cancelAnimationFrame(id); lenis?.destroy(); document.removeEventListener("click", onClick); };
  }, []);
}

const SECTIONS: [string, string][] = [["inicio", "Início"], ["competicao", "Competição"], ["equipe", "Equipe"], ["carro", "Carro"], ["conquistas", "Conquistas"], ["patrocinio", "Patrocínio"], ["equipe-alem", "Comunidade"], ["contato", "Contato"]];

function Progress() {
  const [p, setP] = useState(0);
  const [label, setLabel] = useState("Início");
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
      let cur = SECTIONS[0][1];
      for (const [id, l] of SECTIONS) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) cur = l; }
      setLabel(cur);
    };
    f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <div className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 items-start gap-3 md:flex">
      <div className="relative h-56 w-1 bg-card">
        <div className="absolute inset-x-0 top-0 bg-primary" style={{ height: `${p * 100}%` }} />
      </div>
      <span key={label} className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground [writing-mode:vertical-rl]" style={{ animation: "fade-in .5s both" }}>{label}</span>
    </div>
  );
}

/* Shared geometry: top bar + center tab with angled sides (header & hero curtain) */
const TAB = "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(50% + 150px) calc(100% - 28px), calc(50% + 122px) 100%, calc(50% - 122px) 100%, calc(50% - 150px) calc(100% - 28px), 0 calc(100% - 28px))";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  const left = NAV.slice(0, 3), right = NAV.slice(3);
  const link = (n: string) => (
    <a key={n} href={`#${slug(n)}`} className="group relative font-display text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
      {n}<span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
    </a>
  );
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`absolute inset-0 bg-card transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${scrolled ? "translate-y-0" : "-translate-y-full"}`} style={{ clipPath: TAB }}>
        <span className="absolute bottom-0 left-1/2 h-0.5 w-[244px] -translate-x-1/2 bg-primary" />
      </div>
      <nav className="relative mx-auto flex max-w-6xl items-start justify-center gap-6 px-6 md:gap-12">
        <div className="hidden h-12 items-center gap-10 md:flex">{left.map(link)}</div>
        <a href="#inicio" className="flex h-[76px] w-[220px] shrink-0 items-center justify-center"><img src={logo.url} alt="FÓRMULACEM" className="h-8 w-auto" /></a>
        <div className="hidden h-12 items-center gap-10 md:flex">{right.map(link)}</div>
      </nav>
    </header>
  );
}

function Hero() {
  const [y, setY] = useState(0);
  useEffect(() => { const f = () => setY(window.scrollY); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <section id="inicio" className="relative z-10 flex h-[88vh] min-h-[560px] items-end overflow-hidden bg-card pb-24 drop-shadow-2xl" style={{ clipPath: TAB }}>
      <div className="grid-lines absolute inset-0" style={{ transform: `translateY(${y * 0.3}px)` }} />
      <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <span className="absolute bottom-0 left-1/2 h-0.5 w-[244px] -translate-x-1/2 bg-primary" />
      <div className="pointer-events-none absolute bottom-12 left-0 select-none whitespace-nowrap font-display text-[22vw] font-bold leading-none text-ghost" style={{ transform: `translateX(${-y * 0.4}px)` }}>
        FÓRMULACEM FÓRMULACEM
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-6" style={{ transform: `translateY(${-y * 0.15}px)`, opacity: Math.max(0, 1 - y / 600) }}>
        <p className="mb-6 max-w-md text-muted-foreground" style={{ animation: "rise 1s .2s both" }}>{LOREM}</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="overflow-hidden font-display text-6xl font-bold uppercase leading-none tracking-tight md:text-9xl">
            <span className="rise">FÓRMULA</span><span className="rise text-outline" style={{ animationDelay: ".15s" }}>CEM.</span>
          </h1>
          <Cta>Lorem ipsum</Cta>
        </div>
      </div>
    </section>
  );
}

function Split({ id, eyebrow, a, b, reverse }: { id: string; eyebrow: string; a: string; b: string; reverse?: boolean }) {
  return (
    <section id={id} className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
      <Reveal className={reverse ? "md:order-2" : ""}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <p className="mb-10 max-w-md text-muted-foreground">{LOREM}</p>
        <Title a={a} b={b} />
        <a href="#contato" className="mt-10 inline-flex items-center gap-1 font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">Saiba mais <ArrowUpRight className="h-3 w-3" /></a>
      </Reveal>
      <Reveal delay={150}><Panel label="Mídia" className="aspect-[4/3]" /></Reveal>
    </section>
  );
}

const SPECS = ["Motor", "Chassi", "Suspensão", "Aerodinâmica", "Freios", "Eletrônica", "Transmissão", "Pneus"];

function Car() {
  const ref = useInView<HTMLDivElement>();
  const spec = (s: string, i: number) => (
    <div key={s} className="group cursor-default border-l border-border pl-3 transition-colors hover:border-primary">
      <div className="font-display text-xs font-semibold uppercase tracking-wider">{s}</div>
      <div className="text-xs text-muted-foreground">Lorem ipsum · 0{i + 1}</div>
    </div>
  );
  return (
    <section id="carro" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal><Eyebrow>O carro</Eyebrow><p className="mb-10 max-w-md text-muted-foreground">{LOREM}</p><Title a="LOREM." b="IPSUM" /></Reveal>
      <div ref={ref} className="reveal mt-16 grid items-center gap-8 md:grid-cols-[1fr_2fr_1fr]">
        <div className="space-y-10">{SPECS.slice(0, 4).map(spec)}</div>
        <svg viewBox="0 0 600 260" className="draw w-full text-foreground/70" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M40 170 L120 150 L200 120 L330 110 L430 115 L520 140 L570 160 L560 180 L40 185 Z" />
          <path d="M200 120 L240 80 L300 75 L330 110" />
          <path d="M120 150 L560 150 M200 120 L200 185 M330 110 L330 185 M430 115 L430 185" />
          <path d="M20 160 L80 160 L80 190 L20 190 Z M520 120 L590 115 L590 135 L520 140" className="text-primary" stroke="var(--primary)" />
          <circle cx="130" cy="195" r="38" /><circle cx="130" cy="195" r="18" />
          <circle cx="470" cy="195" r="40" /><circle cx="470" cy="195" r="18" />
          <line x1="130" y1="195" x2="200" y2="150" /><line x1="470" y1="195" x2="430" y2="150" />
          <line x1="40" y1="240" x2="580" y2="240" strokeDasharray="4 6" />
        </svg>
        <div className="space-y-10 md:text-right">{SPECS.slice(4).map(spec)}</div>
      </div>
      <div className="mt-12 flex justify-end"><Cta>Lorem ipsum</Cta></div>
    </section>
  );
}

function Achievements() {
  return (
    <section id="conquistas" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal><Eyebrow>Histórico</Eyebrow><p className="mb-10 max-w-md text-muted-foreground">{LOREM}</p><Title a="NOSSAS" b="CONQUISTAS." /></Reveal>
      <div className="mt-16">
        {[1, 2, 3].map((n, i) => (
          <Reveal key={n} delay={i * 120}>
            <div className="group grid grid-cols-[100px_1fr_auto] items-center gap-6 border-t border-border py-8 transition-colors hover:bg-card/50 md:grid-cols-[200px_1fr_auto]">
              <div><div className="mb-1 font-display text-xs uppercase tracking-widest text-primary">Lorem</div><div className="font-display text-3xl font-bold">[ANO]</div></div>
              <div><h3 className="text-xl font-semibold transition-colors group-hover:text-primary">[Conquista 0{n}]</h3><p className="mt-1 text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur.</p></div>
              <Panel label="Foto" className="h-24 w-32 md:w-48" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Logo({ i, big }: { i: number; big?: boolean }) {
  return (
    <div className={`chamfer-sm flex shrink-0 flex-col items-center justify-center gap-2 bg-card transition-colors hover:bg-secondary ${big ? "h-36" : "h-20 w-44"}`}>
      <span className={`font-display font-semibold text-muted-foreground ${big ? "text-2xl" : "text-base"}`}>[LOGO]</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Patrocinador 0{i}</span>
    </div>
  );
}

function Sponsors() {
  return (
    <section id="patrocinio" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><Eyebrow>Parceiros</Eyebrow><p className="mb-10 max-w-md text-muted-foreground">{LOREM}</p><Title a="LOREM." b="IPSUM." /></Reveal>
        <div className="mt-12 mb-3 font-display text-xs uppercase tracking-widest text-muted-foreground">Patrocinadores ouro</div>
        <div className="grid gap-6 md:grid-cols-3">{[1, 2, 3].map((i) => <Reveal key={i} delay={i * 100}><Logo i={i} big /></Reveal>)}</div>
        <div className="mt-12 mb-3 font-display text-xs uppercase tracking-widest text-muted-foreground">Apoio</div>
      </div>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee flex w-max gap-4">{[...Array(16)].map((_, i) => <Logo key={i} i={(i % 8) + 1} />)}</div>
      </div>
      <Reveal className="mx-auto mt-24 max-w-6xl px-6">
        <div className="chamfer relative flex flex-wrap items-center justify-between gap-8 overflow-hidden bg-cta p-10 md:p-14">
          <div className="grid-lines absolute inset-0 opacity-40" />
          <h3 className="relative font-display text-3xl font-bold uppercase leading-tight md:text-4xl">Lorem ipsum<br /><span className="text-outline">dolor sit amet</span></h3>
          <div className="relative max-w-xs"><p className="mb-6 text-sm text-muted-foreground">{LOREM}</p><Cta>Seja parceiro</Cta></div>
        </div>
      </Reveal>
    </section>
  );
}

function Beyond() {
  return (
    <section id="equipe-alem" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal><Eyebrow>Comunidade</Eyebrow><p className="mb-10 max-w-md text-muted-foreground">{LOREM}</p><Title a="ALÉM DA LINHA" b="DE CHEGADA." /></Reveal>
      <div className="mt-16 grid auto-rows-[160px] gap-4 md:grid-cols-3">
        <Reveal className="md:col-span-2 md:row-span-2"><Panel label="Lorem" className="h-full" /></Reveal>
        <Reveal delay={100}><Panel label="Ipsum" className="h-full" /></Reveal>
        <Reveal delay={200}><Panel label="Dolor" className="h-full" /></Reveal>
        {["Sit", "Amet", "Elit"].map((l, i) => <Reveal key={l} delay={i * 100}><Panel label={l} className="h-full" /></Reveal>)}
      </div>
    </section>
  );
}

function Contact() {
  const [type, setType] = useState("Patrocínio");
  const [sent, setSent] = useState(false);
  const field = "w-full border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";
  return (
    <section id="contato" className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
      <Reveal>
        <Eyebrow>Contato</Eyebrow>
        <p className="mb-10 max-w-md text-muted-foreground">{LOREM}</p>
        <h2 className="font-display text-5xl font-bold uppercase leading-none md:text-7xl">Vamos<br /><span className="text-outline">conversar.</span></h2>
        <p className="mt-8 text-lg font-semibold">Lorem ipsum dolor sit amet.</p>
        <div className="mt-12 mb-3 font-display text-xs uppercase tracking-widest text-primary">Redes sociais</div>
        <div className="flex gap-3">
          {[Instagram, Linkedin, Mail].map((I, i) => (
            <a key={i} href="#contato" aria-label="Rede social" className="chamfer-sm flex h-12 w-16 items-center justify-center bg-card text-muted-foreground transition-all hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"><I className="h-5 w-5" /></a>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">contato@formulacem.com</p>
      </Reveal>
      <Reveal delay={150}>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="chamfer space-y-4 bg-card p-8">
          <div className="font-display text-xs uppercase tracking-widest text-primary">Envie uma mensagem</div>
          {[["Nome", "Lorem ipsum"], ["Empresa", "Lorem ipsum"], ["E-mail", "lorem@ipsum.com"]].map(([l, p]) => (
            <label key={l} className="block"><span className="mb-1 block text-xs text-muted-foreground">{l}</span><input required className={field} placeholder={p} /></label>
          ))}
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">Assunto</span>
            <div className="grid grid-cols-3 gap-2">
              {["Patrocínio", "Parceria", "Outro"].map((t) => (
                <button type="button" key={t} onClick={() => setType(t)} className={`border py-2 text-xs transition-colors ${type === t ? "border-primary bg-primary/15 text-primary" : "border-input text-muted-foreground hover:border-foreground/40"}`}>{t}</button>
              ))}
            </div>
          </div>
          <label className="block"><span className="mb-1 block text-xs text-muted-foreground">Mensagem</span><textarea required rows={4} className={field} placeholder="Lorem ipsum dolor sit amet..." /></label>
          <button type="submit" className="chamfer-sm inline-flex items-center gap-2 bg-primary px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-shadow hover:shadow-glow">
            {sent ? "Mensagem enviada ✓" : "Enviar mensagem"} <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>
      </Reveal>
    </section>
  );
}

function Index() {
  useSmoothScroll();
  return (
    <main className="overflow-x-hidden">
      <Nav />
      <Progress />
      <Hero />
      <Split id="competicao" eyebrow="A competição" a="A" b="COMPETIÇÃO." />
      <Split id="equipe" eyebrow="Quem somos" a="A" b="EQUIPE." reverse />
      <Car />
      <Achievements />
      <Sponsors />
      <Beyond />
      <Contact />
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-10">
          <div><img src={logo.url} alt="FÓRMULACEM" className="h-8 w-auto" /><p className="mt-2 text-xs text-muted-foreground">© 2026 FÓRMULACEM. Lorem ipsum.</p></div>
          <div className="flex gap-6 font-display text-xs uppercase tracking-widest text-muted-foreground">
            {["Instagram", "LinkedIn", "E-mail"].map((s) => <a key={s} href="#contato" className="hover:text-primary">{s} ↗</a>)}
          </div>
        </div>
      </footer>
    </main>
  );
}
