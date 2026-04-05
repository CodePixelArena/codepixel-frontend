import { useEffect, useRef } from "react";
import styles from "./AboutUs.module.css";

interface AboutUsProps {
  onBack: () => void;
}

export default function AboutUs({ onBack }: AboutUsProps) {
  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Sora:wght@300;400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Build pixel grid background
    const grid = gridRef.current;
    if (grid) {
      for (let i = 0; i < 1000; i++) {
        const s = document.createElement('span');
        grid.appendChild(s);
      }
    }

    // Build canvas preview
    const colors = [
      '#7c6af5','#f5a26a','#5fd4b2','#f55f6a','#f5e46a',
      '#6af57c','#6ac7f5','#a26af5','#f56aaa','#6a8cf5'
    ];

    const preview = previewRef.current;
    if (preview) {
      for (let i = 0; i < 96; i++) {
        const px = document.createElement('div');
        px.className = styles.px;
        const isColored = Math.random() > 0.45;
        if (isColored) {
          const c = colors[Math.floor(Math.random() * colors.length)];
          px.style.background = c;
          px.style.animationDelay = (Math.random() * 6) + 's';
          px.style.animationDuration = (4 + Math.random() * 6) + 's';
        } else {
          px.style.background = 'rgba(255,255,255,0.04)';
          px.style.opacity = '1';
          px.style.animation = 'none';
        }
        preview.appendChild(px);
      }
    }

    // Observe sections for reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.fadeIn);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(`.${styles.section}, .${styles.sectionDivider}`).forEach(el => {
      if (!el.classList.contains(styles.sectionDivider)) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
    className={styles.body}
    style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
    }}
    >
      {/* Pixel grid bg */}
      <div className={styles.pixelGrid} ref={gridRef}></div>

      <main className={styles.main}>
        {/* ── HERO ── */}
        <div className={styles.hero}>
          <div className={styles.fadeIn}>
            <div className={styles.heroTag}>About the platform</div>
          </div>
          <h1 className={styles.fadeIn}>
            Code your way.<br />
            <em>Own the canvas.</em>
          </h1>
          <p className={`${styles.heroSub} ${styles.fadeIn}`}>
            <strong>CodePixel Arena</strong> is a gamified coding platform where every correct solution
            is more than a score — it's a claim. Solve challenges, earn pixels,
            and leave your mark on a shared digital world built entirely by its players.
          </p>
          <div className={`${styles.pixelCanvasPreview} ${styles.fadeIn}`} ref={previewRef}></div>
        </div>

        <div className={styles.sectionDivider}></div>

        {/* ── WHAT IS IT ── */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}><span>//</span> 01 — What is CodePixel Arena</p>
          <h2>A platform where code<br />becomes territory.</h2>
          <p className={styles.lead}>
            At its core, CodePixel Arena is a <strong>competitive programming platform</strong> — but one with a twist
            that makes it unlike anything else. The platform hosts a growing library of algorithmic
            challenges across difficulty levels, from beginner-friendly problems to complex, multi-step puzzles.
          </p>
          <br />
          <p className={styles.lead}>
            What sets us apart is the <strong>pixel canvas</strong>. Every challenge is linked to a section
            of a shared digital grid. When you solve a challenge correctly, you don't just earn points —
            you <strong>claim ownership of pixels</strong>. Those pixels display your color on the canvas,
            visible to every player on the platform. The grid is a living, evolving artwork, shaped entirely
            by the collective achievements of the community.
          </p>
          <br />
          <p className={styles.lead}>
            A real-time <strong>leaderboard</strong> tracks scores across all challenges, giving you a clear
            picture of where you stand. Search for challenges by title, tag, or username using our
            <strong>fast autocomplete engine</strong>, find exactly what you're looking for, and start solving.
          </p>
        </section>

        <div className={styles.sectionDivider}></div>

        {/* ── HOW IT WORKS ── */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}><span>//</span> 02 — How it works</p>
          <h2>Four steps from<br />problem to pixel.</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  Register and explore
                  <span className={`${styles.stepBadge} ${styles.badgeAuto}`}>free</span>
                </div>
                <p className={styles.stepDesc}>Create your account and browse the full library of challenges. Use the search bar to find problems by title, difficulty, or tag — results appear instantly as you type.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  Submit your solution
                  <span className={`${styles.stepBadge} ${styles.badgeAuto}`}>auto-evaluated</span>
                </div>
                <p className={styles.stepDesc}>Write and submit your code directly in the platform. The system automatically runs your solution against a set of test cases and returns an instant verdict: pass or fail, with execution time.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  Claim your pixels
                  <span className={`${styles.stepBadge} ${styles.badgeEarn}`}>ownership</span>
                </div>
                <p className={styles.stepDesc}>A passing submission automatically grants you ownership of the pixels associated with that challenge. Your color appears on the shared canvas immediately. Own more pixels by solving more challenges.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>04</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  Climb the leaderboard
                  <span className={`${styles.stepBadge} ${styles.badgeRank}`}>ranking</span>
                </div>
                <p className={styles.stepDesc}>Every successful solve adds to your cumulative score. The leaderboard updates in real time, ranking all players by their total points. Compete, improve, and defend your place at the top.</p>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider}></div>

        {/* ── RULES ── */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}><span>//</span> 03 — Rules & how ownership works</p>
          <h2>Fair play,<br />clear rules.</h2>
          <p className={styles.lead}>
            The pixel economy is designed to be fair, transparent, and fully automated.
            Every rule is enforced by the system, not by moderators.
          </p>
          <div className={styles.rulesGrid}>
            <div className={`${styles.ruleCard} ${styles.r1}`}>
              <div className={styles.ruleIcon}>◈</div>
              <div className={styles.ruleTitle}>One owner at a time</div>
              <p className={styles.ruleDesc}>Every pixel belongs to exactly one player at any moment. Ownership is exclusive — if someone else solves the same challenge faster, they can reclaim the pixels.</p>
            </div>
            <div className={`${styles.ruleCard} ${styles.r2}`}>
              <div className={styles.ruleIcon}>◉</div>
              <div className={styles.ruleTitle}>Pass to own</div>
              <p className={styles.ruleDesc}>Only a passing submission triggers ownership transfer. Partial solutions, failed attempts, and timed-out code don't count — it's all or nothing.</p>
            </div>
            <div className={`${styles.ruleCard} ${styles.r3}`}>
              <div className={styles.ruleIcon}>◎</div>
              <div className={styles.ruleTitle}>Full history, always</div>
              <p className={styles.ruleDesc}>Every ownership change is recorded permanently. You can trace the complete history of any pixel — who held it, when, and in what order. Nothing is ever lost.</p>
            </div>
            <div className={`${styles.ruleCard} ${styles.r4}`}>
              <div className={styles.ruleIcon}>◆</div>
              <div className={styles.ruleTitle}>No spam submissions</div>
              <p className={styles.ruleDesc}>To keep the system fair, you cannot resubmit the same solution for the same challenge within 60 seconds. Think before you try again.</p>
            </div>
            <div className={`${styles.ruleCard} ${styles.r5}`}>
              <div className={styles.ruleIcon}>◐</div>
              <div className={styles.ruleTitle}>Unique identity</div>
              <p className={styles.ruleDesc}>Every account requires a unique username and email. One person, one identity, one set of pixels on the canvas.</p>
            </div>
            <div className={`${styles.ruleCard} ${styles.r6}`}>
              <div className={styles.ruleIcon}>◑</div>
              <div className={styles.ruleTitle}>Score reflects effort</div>
              <p className={styles.ruleDesc}>Points accumulate with every successful solve. The leaderboard is a direct reflection of how many challenges you've completed, nothing more, nothing less.</p>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider}></div>

        {/* ── ACADEMIC / EDUCATIONAL ── */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}><span>//</span> 04 — The project behind the platform</p>
          <h2>Built to learn.<br />Designed to last.</h2>
          <p className={styles.lead}>
            CodePixel Arena started as an academic project, but it was designed from day one to be
            something genuinely usable. The platform was built as part of a database systems and software
            engineering course, with the goal of bridging the gap between theoretical concepts and
            real-world implementation.
          </p>

          <div className={styles.academicBanner}>
            <h3>What we explored</h3>
            <p>
              The project covers two interconnected components. On the data side, we designed and implemented
              a <strong>relational database</strong> from scratch — modeling entities, defining relationships,
              normalizing the schema, and building the logic that keeps pixel ownership, submissions, and
              rankings consistent and correct.
              On the search side, we built a <strong>Trie-based autocomplete engine</strong> in C++ that
              makes searching for challenges, tags, and usernames feel instant. Together, these two systems
              form a complete, working prototype that demonstrates how efficient data structures and
              well-structured databases power the products we use every day.
            </p>
          </div>

          <br /><br />

          <p className={styles.lead}>
            The project pushed us to think beyond textbook examples. Designing a system where
            actions have <strong>real cascading consequences</strong> — a submission changes ownership,
            ownership changes history, history feeds analytics — made every design decision feel meaningful.
            We didn't just want a database that stores data. We wanted one that <strong>enforces a world</strong>.
          </p>

          <div className={styles.techPills}>
            <span className={styles.techPill}>MySQL / PostgreSQL</span>
            <span className={styles.techPill}>Relational Schema</span>
            <span className={styles.techPill}>ER Modeling</span>
            <span className={styles.techPill}>Normalization</span>
            <span className={styles.techPill}>C++ Trie Engine</span>
            <span className={styles.techPill}>Stored Procedures</span>
            <span className={styles.techPill}>Triggers & Views</span>
            <span className={styles.techPill}>Role-Based Access</span>
          </div>
        </section>

        <div className={styles.sectionDivider}></div>

        {/* ── TEAM ── */}
        <section className={styles.teamSection}>
          <h2 className={styles.teamTitle}>The Team</h2>
          <p className={styles.lead}>
            CodePixel Arena was conceived, designed, and built entirely by a two-person team.
            Every table, every trigger, every pixel on this canvas exists because of the work below.
          </p>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <div className={styles.teamAvatar}>SZ</div>
              <div className={styles.teamName}>Sofi Zakaryan</div>
              <div className={styles.teamRole}>Co-founder & Developer</div>
              <p className={styles.teamBio}>
                Sofi led the conceptual design and data modeling work, turning abstract system requirements
                into a clean, normalized schema. She shaped the rules that govern pixel ownership and
                made sure every relationship in the database reflects real-world logic without compromise.
              </p>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.teamAvatar}>PS</div>
              <div className={styles.teamName}>Petros Stepanyan</div>
              <div className={styles.teamRole}>Co-founder & Developer</div>
              <p className={styles.teamBio}>
                Petros drove the implementation side — building the SQL layer, the autocomplete search engine,
                and the automation logic that makes the platform behave consistently at every step.
                His focus was on making the system not just correct, but fast and maintainable.
              </p>
            </div>
          </div>
        </section>

        <button className={styles.backButton} onClick={onBack}>
          Back to Board
        </button>
      </main>
    </div>
  );
}