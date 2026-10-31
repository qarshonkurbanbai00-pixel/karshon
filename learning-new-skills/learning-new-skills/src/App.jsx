import { lazy, Suspense, useEffect, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Compass,
  Clock3,
  Flame,
  Globe2,
  HeartPulse,
  Languages,
  Lightbulb,
  Menu,
  MessagesSquare,
  Palette,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { skills, challenges } from "./data";
import Roadmap, { readSavedPlan } from "./components/Roadmap";
import Quiz from "./components/Quiz";

const Universe = lazy(() => import("./components/Universe"));
const icons = {
  Code2,
  Palette,
  MessagesSquare,
  Languages,
  Lightbulb,
  HeartPulse,
  Clock3,
  ShieldCheck,
  Flame,
  Compass,
};
const navLinks = [
  ["#why", "Why learn"],
  ["#skills", "Skills universe"],
  ["#roadmap", "Your roadmap"],
  ["#quiz", "The quiz"],
];

function OrbitLogo({ small = false }) {
  return (
    <span className={`orbit-logo ${small ? "small" : ""}`} aria-hidden="true">
      <span />
      <span />
      <i />
    </span>
  );
}
function Reveal({ children, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduce ? undefined : { y: [12, 0], opacity: [0.65, 1] }}
      viewport={{ once: true, margin: "-35px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState("coding");
  const [plan, setPlan] = useState(readSavedPlan);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const skill = skills.find((s) => s.id === selected) || skills[0];
  const SelectedIcon = icons[skill.icon];
  useEffect(() => {
    try {
      localStorage.setItem("skillspace-plan", JSON.stringify(plan));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [plan]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    const escape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", escape);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", escape);
    };
  }, []);
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2600);
    return () => clearTimeout(timer);
  }, [added]);
  const selectSkill = (id) => {
    setSelected(id);
    setAdded(false);
  };
  const addToPlan = () => {
    setPlan((p) =>
      p.skill === selected ? p : { skill: selected, completed: [] },
    );
    setAdded(true);
    document
      .getElementById("roadmap")
      .scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  };
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className="site-noise" aria-hidden="true" />
      <header className="site-header">
        <div className="nav-inner">
          <a href="#welcome" className="brand" aria-label="Skillspace home">
            <OrbitLogo />
            <span>
              SKILL<span className="brand-light">SPACE</span>
              <i />
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map(([href, label]) => (
              <a
                className={activeSection === href ? "active" : ""}
                href={href}
                key={href}
                aria-current={activeSection === href ? "location" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="nav-cta" href="#roadmap">
            Start your journey <ArrowUpRight size={15} />
          </a>
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {navLinks.map(([href, label]) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
            <a href="#roadmap" onClick={() => setMenuOpen(false)}>
              Start your journey <ArrowRight size={16} />
            </a>
          </nav>
        )}
      </header>
      <main id="main">
        <section
          className="hero section-wrap"
          id="welcome"
          aria-labelledby="hero-title"
        >
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-pill">
                <span className="status-light" /> LEARNING NEW SKILLS
                <span className="pill-line" />
                <Sparkles size={12} />
              </div>
              <h1 id="hero-title">
                Your next chapter
                <br />
                starts with{" "}
                <span>
                  one
                  <br className="desktop-break" /> new skill.
                </span>
              </h1>
              <p>
                Big possibilities start with small steps.
                <br />
                Explore your potential, build your confidence,
                <br className="desktop-break" /> and turn curiosity into
                something real.
              </p>
              <div className="hero-actions">
                <a href="#skills" className="button button-primary">
                  Explore the skills <ArrowUpRight size={17} />
                </a>
                <a href="#roadmap" className="hero-secondary">
                  <span className="circle-arrow">
                    <ArrowRight size={15} />
                  </span>{" "}
                  Find your path
                </a>
              </div>
              <div className="hero-bottom">
                <span className="mini-orbits">
                  <i />
                  <i />
                  <i />
                  <Sparkles size={13} />
                </span>
                <span>
                  No experience needed.<strong>Just a curious mind.</strong>
                </span>
              </div>
            </div>
            <div className="hero-scene">
              <Suspense
                fallback={
                  <div className="scene-loading" role="status">
                    Connecting your skills universe…
                  </div>
                }
              >
                <Universe
                  selected={selected}
                  onSelect={selectSkill}
                  reducedMotion={reducedMotion}
                />
              </Suspense>
            </div>
          </div>
          <div className="hero-footer">
            <a href="#why">
              <span className="scroll-mouse">
                <i />
              </span>{" "}
              SCROLL TO DISCOVER <ArrowDown size={12} />
            </a>
            <span className="hero-footer-right">
              <span className="status-light" /> A LITTLE BETTER, EVERY DAY
            </span>
          </div>
        </section>
        <div className="principle-strip">
          <div className="section-wrap">
            <span>
              <Sparkles /> Curiosity is your superpower
            </span>
            <i />
            <span>
              <Target /> Small steps. Real progress.
            </span>
            <i />
            <span>
              <Globe2 /> A world of skills to explore
            </span>
            <i />
            <span>
              <TrendingUp /> Built for your next chapter
            </span>
          </div>
        </div>
        <section
          className="section-wrap content-section"
          id="why"
          aria-labelledby="why-title"
        >
          <Reveal>
            <div className="heading-row">
              <div>
                <div className="section-kicker">
                  <span>01</span> THE BIG PICTURE
                </div>
                <h2 id="why-title">
                  New skills.
                  <br />
                  <span>More possibilities.</span>
                </h2>
              </div>
              <p className="heading-aside">
                Learning is not only about a new job.
                <br />
                It is about seeing what you can do —<br />
                and finding the confidence to try.
              </p>
            </div>
            <div className="benefit-grid">
              {[
                {
                  icon: Rocket,
                  title: "Open new doors",
                  text: "A new skill can lead to a new project, a different role, or an opportunity you had not imagined.",
                  label: "DISCOVER MORE",
                  number: "01",
                },
                {
                  icon: ShieldCheck,
                  title: "Grow your confidence",
                  text: "Each small win reminds you that you can improve. You do not need to be an expert to begin.",
                  label: "BELIEVE IN YOURSELF",
                  number: "02",
                },
                {
                  icon: Lightbulb,
                  title: "Think in new ways",
                  text: "Explore fresh ideas, ask better questions, and find new ways to solve everyday problems.",
                  label: "STAY OPEN-MINDED",
                  number: "03",
                },
              ].map(({ icon: Icon, ...b }) => (
                <article className="benefit-card" key={b.title}>
                  <div className="card-top">
                    <div className="benefit-icon">
                      <Icon size={23} strokeWidth={1.5} />
                    </div>
                    <span>{b.number}</span>
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                  <div className="benefit-foot">
                    {b.label}
                    <ArrowUpRight size={14} />
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>
        <section
          className="skills-section content-section"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="section-wrap">
            <Reveal>
              <div className="heading-row">
                <div>
                  <div className="section-kicker">
                    <span>02</span> SKILLS UNIVERSE
                  </div>
                  <h2 id="skills-title">
                    Find your next <span>“what if?”</span>
                  </h2>
                </div>
                <p className="heading-aside">
                  There is more than one way to grow.
                  <br />
                  Choose a skill. See where it takes you.
                </p>
              </div>
              <div className="skills-explorer">
                <div
                  className="skill-grid"
                  role="group"
                  aria-label="Choose a skill"
                >
                  {skills.map((s) => {
                    const Icon = icons[s.icon];
                    return (
                      <button
                        key={s.id}
                        className={`skill-card ${selected === s.id ? "selected" : ""}`}
                        style={{ "--skill-color": s.color }}
                        aria-pressed={selected === s.id}
                        onClick={() => selectSkill(s.id)}
                      >
                        <div className="skill-card-top">
                          <span className="skill-icon">
                            <Icon size={25} strokeWidth={1.4} />
                          </span>
                          <ArrowUpRight size={15} />
                        </div>
                        <span className="micro">{s.tag}</span>
                        <strong>{s.name}</strong>
                        <span className="skill-tagline">{s.label}</span>
                        {selected === s.id && (
                          <span className="selected-mark">
                            <Check size={10} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <article
                  className="skill-detail"
                  style={{ "--skill-color": skill.color }}
                  aria-live="polite"
                >
                  <div className="detail-orbit-art" aria-hidden="true">
                    <span />
                    <span />
                    <div>
                      <SelectedIcon size={33} strokeWidth={1.2} />
                    </div>
                    <i />
                    <b />
                  </div>
                  <div className="detail-heading">
                    <span className="eyebrow">YOUR NEXT POSSIBILITY</span>
                    <h3>{skill.name}</h3>
                    <p>{skill.description}</p>
                  </div>
                  <ul className="skill-examples">
                    {skill.examples.map((example) => (
                      <li key={example}>
                        <Check size={13} />
                        {example}
                      </li>
                    ))}
                  </ul>
                  <div className="first-step">
                    <span className="micro">START HERE</span>
                    <p>{skill.first}</p>
                  </div>
                  <button className="button button-primary" onClick={addToPlan}>
                    {added ? (
                      <>
                        <Check size={16} /> Added to your roadmap
                      </>
                    ) : (
                      <>
                        Add to my roadmap <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </article>
              </div>
              <div className="section-footnote">
                <Sparkles size={14} /> You do not have to master everything.
                Start with what makes you curious.
              </div>
            </Reveal>
          </div>
        </section>
        <section
          className="section-wrap content-section challenges-section"
          id="challenges"
          aria-labelledby="challenges-title"
        >
          <Reveal className="challenges-layout">
            <div className="challenge-intro">
              <div className="section-kicker">
                <span>03</span> THE REAL TALK
              </div>
              <h2 id="challenges-title">
                A little difficult?
                <br />
                <span>That is normal.</span>
              </h2>
              <p>
                Every learner meets a challenge.
                <br />
                It does not mean you should stop.
                <br />
                It means you are trying something new.
              </p>
              <div className="challenge-note">
                <span>↗</span>
                <p>
                  Progress is not a straight line.
                  <br />
                  <strong>Keep going anyway.</strong>
                </p>
              </div>
            </div>
            <div className="challenge-list">
              {challenges.map((c) => {
                const Icon = icons[c.icon];
                return (
                  <details
                    className="challenge-item"
                    key={c.title}
                    name="learning-challenges"
                  >
                    <summary>
                      <span className="challenge-icon">
                        <Icon size={19} strokeWidth={1.5} />
                      </span>
                      <span>
                        <strong>{c.title}</strong>
                        <small>{c.subtitle}</small>
                      </span>
                      <Plus className="disclosure-plus" size={18} />
                    </summary>
                    <div className="challenge-answer">
                      <p>{c.advice}</p>
                      <strong>{c.action}</strong>
                    </div>
                  </details>
                );
              })}
            </div>
          </Reveal>
        </section>
        <section
          className="roadmap-section content-section"
          id="roadmap"
          aria-labelledby="roadmap-title"
        >
          <div className="section-wrap">
            <Reveal>
              <div className="heading-row">
                <div>
                  <div className="section-kicker">
                    <span>04</span> LEARNING ROADMAP
                  </div>
                  <h2 id="roadmap-title">
                    Less someday.
                    <br />
                    <span>More starting today.</span>
                  </h2>
                </div>
                <p className="heading-aside">
                  A simple four-week plan to get moving.
                  <br />
                  Choose your skill, follow the steps,
                  <br />
                  and make the journey your own.
                </p>
              </div>
              <Roadmap
                plan={plan}
                setPlan={setPlan}
                storageAvailable={storageAvailable}
              />
              <p className="section-footnote">
                <Clock3 size={14} /> Try 15 minutes a day. Take longer if you
                need to — there is no race.
              </p>
            </Reveal>
          </div>
        </section>
        <section
          className="section-wrap content-section"
          id="quiz"
          aria-labelledby="quiz-title"
        >
          <Reveal>
            <div className="heading-row">
              <div>
                <div className="section-kicker">
                  <span>05</span> INTERACTIVE QUIZ
                </div>
                <h2 id="quiz-title">
                  A curious mind <span>learns more.</span>
                </h2>
              </div>
              <p className="heading-aside">
                What does a good learning habit look like?
                <br />
                Put your ideas to the test.
              </p>
            </div>
            <Quiz reducedMotion={reducedMotion} />
          </Reveal>
        </section>
        <section
          className="final-section section-wrap"
          id="keep-growing"
          aria-labelledby="final-title"
        >
          <Reveal className="final-card">
            <div className="final-stars" aria-hidden="true">
              <span>✧</span>
              <span>✦</span>
              <span>✧</span>
            </div>
            <div className="final-orbit" aria-hidden="true" />
            <span className="eyebrow">
              <Sparkles size={14} /> YOUR JOURNEY IS JUST BEGINNING
            </span>
            <h2 id="final-title">
              Never stop <span>learning.</span>
            </h2>
            <p>
              You do not need to know everything.
              <br />
              You just need the courage to learn one more thing.
            </p>
            <a href="#roadmap" className="button button-primary">
              Take your first step <ArrowUpRight size={17} />
            </a>
            <span className="final-caption">
              STAY CURIOUS. START SMALL. KEEP GOING.
            </span>
          </Reveal>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <div className="footer-top">
          <a className="brand" href="#welcome" aria-label="Skillspace home">
            <OrbitLogo small />
            <span>
              SKILL<span className="brand-light">SPACE</span>
              <i />
            </span>
          </a>
          <p>Small steps. Infinite possibilities.</p>
          <a href="#welcome" className="back-top">
            Back to top <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>Made for curious minds, everywhere.</span>
          <span>
            LEARNING IS A LIFELONG ADVENTURE <span className="status-light" />
          </span>
        </div>
      </footer>
    </MotionConfig>
  );
}
