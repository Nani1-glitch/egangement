"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const EVENT_TIME = new Date("2026-08-16T09:30:00+05:30").getTime();

const petals = [
  { x: "4%", delay: "-3s", duration: "15s", drift: "48px", size: "10px" },
  { x: "10%", delay: "-9s", duration: "19s", drift: "-32px", size: "8px" },
  { x: "18%", delay: "-6s", duration: "17s", drift: "56px", size: "11px" },
  { x: "27%", delay: "-14s", duration: "21s", drift: "-38px", size: "7px" },
  { x: "35%", delay: "-2s", duration: "18s", drift: "42px", size: "9px" },
  { x: "44%", delay: "-11s", duration: "22s", drift: "-52px", size: "12px" },
  { x: "52%", delay: "-5s", duration: "16s", drift: "36px", size: "8px" },
  { x: "61%", delay: "-16s", duration: "23s", drift: "-45px", size: "10px" },
  { x: "70%", delay: "-8s", duration: "20s", drift: "54px", size: "7px" },
  { x: "78%", delay: "-1s", duration: "17s", drift: "-30px", size: "11px" },
  { x: "87%", delay: "-13s", duration: "22s", drift: "40px", size: "8px" },
  { x: "95%", delay: "-7s", duration: "19s", drift: "-48px", size: "10px" },
];

function getCountdown() {
  const distance = Math.max(EVENT_TIME - Date.now(), 0);
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    complete: distance === 0,
  };
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export default function Home() {
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const [sparkKey, setSparkKey] = useState(0);
  const [musicState, setMusicState] = useState<"waiting" | "playing" | "paused">("waiting");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const fadeMusicTo = useCallback((target: number, duration: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
    }

    const initialVolume = audio.volume;
    const startedAt = window.performance.now();

    const fade = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, initialVolume + (target - initialVolume) * easedProgress));

      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(fade);
      } else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    };

    fadeFrameRef.current = window.requestAnimationFrame(fade);
  }, []);

  const startMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    if (!audio.paused) {
      setMusicState("playing");
      return true;
    }

    audio.volume = 0;

    try {
      await audio.play();
      setMusicState("playing");
      fadeMusicTo(0.12, 2600);
      return true;
    } catch {
      return false;
    }
  }, [fadeMusicTo]);

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    fadeMusicTo(0, 500, () => {
      audio.pause();
      setMusicState("paused");
    });
  }, [fadeMusicTo]);

  const calendarHref = useMemo(() => {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pragya and Nithin//Engagement//EN",
      "BEGIN:VEVENT",
      "UID:pragya-nithin-engagement-20260816",
      "DTSTAMP:20260813T000000Z",
      "DTSTART:20260816T040000Z",
      "DTEND:20260816T073000Z",
      "SUMMARY:Pragya & Nithin's Engagement",
      "DESCRIPTION:With love, the Midde family invites you to celebrate Pragya and Nithin.",
      "LOCATION:Manjeera Sarovar Premiere, Opposite Central Jail, Rajahmundry",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(calendar);
  }, []);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- autoplay attempt reacts to the async audio.play() outcome, not a synchronous render loop
    void startMusic();
  }, [startMusic]);

  useEffect(() => {
    const beginOnFirstGesture = (event: PointerEvent | KeyboardEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-toggle")) return;

      void startMusic().then((started) => {
        if (!started) return;
        window.removeEventListener("pointerdown", beginOnFirstGesture);
        window.removeEventListener("keydown", beginOnFirstGesture);
      });
    };

    window.addEventListener("pointerdown", beginOnFirstGesture, { passive: true });
    window.addEventListener("keydown", beginOnFirstGesture);

    return () => {
      window.removeEventListener("pointerdown", beginOnFirstGesture);
      window.removeEventListener("keydown", beginOnFirstGesture);
    };
  }, [startMusic]);

  useEffect(() => {
    return () => {
      if (fadeFrameRef.current !== null) {
        window.cancelAnimationFrame(fadeFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const AUTO_SCROLL_SPEED = 42; // pixels per second
    let rafId: number;
    let startTime: number | null = null;
    let startScrollY = 0;
    let stopped = false;

    const stopAutoScroll = () => {
      if (stopped) return;
      stopped = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchstart", stopAutoScroll);
      window.removeEventListener("pointerdown", stopAutoScroll);
      window.removeEventListener("keydown", stopAutoScroll);
    };

    const step = (time: number) => {
      if (stopped) return;
      if (startTime === null) {
        startTime = time;
        startScrollY = window.scrollY;
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = Math.min(startScrollY + (AUTO_SCROLL_SPEED * (time - startTime)) / 1000, maxScroll);
      window.scrollTo({ top: target, behavior: "instant" });

      if (target >= maxScroll - 0.5) {
        stopAutoScroll();
        return;
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    window.addEventListener("wheel", stopAutoScroll, { passive: true });
    window.addEventListener("touchstart", stopAutoScroll, { passive: true });
    window.addEventListener("pointerdown", stopAutoScroll, { passive: true });
    window.addEventListener("keydown", stopAutoScroll);

    return stopAutoScroll;
  }, []);

  return (
    <main className="invite-shell">
      <audio ref={audioRef} loop preload="metadata">
        <source src="/avunanavaa.m4a" type="audio/mp4" />
      </audio>

      <button
        className="music-toggle"
        type="button"
        data-playing={musicState === "playing"}
        aria-label={musicState === "playing" ? "Pause background music" : "Play background music"}
        aria-pressed={musicState === "playing"}
        onClick={() => {
          if (audioRef.current?.paused ?? true) {
            void startMusic();
          } else {
            pauseMusic();
          }
        }}
      >
        <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>
        <span className="music-copy">
          <strong>{musicState === "playing" ? "Playing softly" : "Our song"}</strong>
          <em>{musicState === "playing" ? "tap to pause" : "tap to play"}</em>
        </span>
      </button>

      <div className="petal-field" aria-hidden="true">
        {petals.map((petal, index) => (
          <i
            className={"ambient-petal petal-" + (index % 4)}
            key={petal.x}
            style={
              {
                "--x": petal.x,
                "--delay": petal.delay,
                "--duration": petal.duration,
                "--drift": petal.drift,
                "--size": petal.size,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <header className="topbar">
        <a className="mini-monogram" href="#home" aria-label="Back to the beginning">
          P<span>&</span>N
        </a>
        <div className="rsvp-link" aria-label="RSVP phone number">
          <strong>RSVP</strong>
          <span className="rsvp-numbers">
            <a href="tel:+919030088300">90300 88300</a>
          </span>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="toranam" aria-hidden="true">
          {Array.from({ length: 11 }).map((_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className="hero-ornaments" aria-hidden="true">
          <div className="jasmine-strand jasmine-left">
            {Array.from({ length: 6 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="jasmine-strand jasmine-right">
            {Array.from({ length: 6 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="banana-cluster banana-left">
            {Array.from({ length: 5 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="banana-cluster banana-right">
            {Array.from({ length: 5 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="auspicious-rays">
            {Array.from({ length: 12 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="deepam deepam-left"><i /></div>
          <div className="deepam deepam-right"><i /></div>
        </div>
        <div className="kolam kolam-left" aria-hidden="true" />
        <div className="kolam kolam-right" aria-hidden="true" />

        <div className="hero-copy">
          <p className="sacred-mark" aria-label="Sri">
            శ్రీ
          </p>
          <p className="telugu-kicker">శుభ నిశ్చితార్థ ఆహ్వానం</p>
          <p className="eyebrow hero-eyebrow">
            The <span className="surname-highlight">Midde</span> family joyfully invites you
          </p>

          <h1>
            <span>Pragya</span>
            <em>&</em>
            <span>Nithin</span>
          </h1>

          <p className="hero-subtitle">are getting engaged</p>

          <button
            className="ring-seal"
            type="button"
            aria-label="Celebrate Pragya and Nithin"
            onClick={() => setSparkKey((value) => value + 1)}
          >
            <span className="ring ring-one" />
            <span className="ring ring-two" />
            <span className="diamond" />
            {sparkKey > 0 && (
              <span className="heart-burst" key={sparkKey} aria-hidden="true">
                {["♥", "♥", "♥", "♥", "♥", "♥"].map((heart, index) => (
                  <i key={sparkKey + "-" + index}>{heart}</i>
                ))}
              </span>
            )}
          </button>
          <p className="tiny-whisper">tap the rings</p>

          <div className="hero-date" aria-label="Sunday, 16 August 2026 at 9:30 AM">
            <span>Sunday</span>
            <strong>16 · 08 · 2026</strong>
            <span>9:30 AM onwards</span>
          </div>
        </div>

        <a className="scroll-cue" href="#invitation" aria-label="Read the invitation">
          <span>Come celebrate with us</span>
          <i />
        </a>
      </section>

      <section className="invitation section" id="invitation">
        <div className="floral-dot" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="reveal" data-reveal>
          <p className="eyebrow">With the blessings of our elders</p>
          <h2>Two hearts, one beautiful <span>yes.</span></h2>
          <p className="invitation-copy">
            With hearts full of joy, we invite you to share in the beginning of
            our forever. Your presence, laughter, and blessings will make our
            celebration truly complete.
          </p>
          <p className="telugu-blessing">మీ రాక మా ఆనందం · మీ ఆశీస్సులు మా అదృష్టం</p>
        </div>
      </section>

      <section className="event-section section" id="details">
        <div className="section-heading reveal" data-reveal>
          <p className="eyebrow">Save the date</p>
          <h2>A Sunday made for <span>love</span></h2>
        </div>

        <div className="event-grid">
          <article className="date-card reveal" data-reveal>
            <div className="calendar-leaf">
              <span>August</span>
              <strong>16</strong>
              <em>Sunday · 2026</em>
            </div>
            <div className="time-note">
              <span className="line-art-clock" aria-hidden="true" />
              <div>
                <p>We begin at</p>
                <strong>9:30 AM onwards</strong>
              </div>
            </div>
            <a className="text-action" href={calendarHref} download="Pragya-and-Nithin-Engagement.ics">
              Add to calendar <span aria-hidden="true">＋</span>
            </a>
          </article>

          <article className="countdown-card reveal" data-reveal>
            <p className="eyebrow">Counting down to our forever</p>
            {countdown?.complete ? (
              <p className="today-message">Today is our day ✦</p>
            ) : (
              <div className="countdown" aria-live="polite">
                {[
                  ["Days", countdown ? twoDigits(countdown.days) : "—"],
                  ["Hours", countdown ? twoDigits(countdown.hours) : "—"],
                  ["Minutes", countdown ? twoDigits(countdown.minutes) : "—"],
                  ["Seconds", countdown ? twoDigits(countdown.seconds) : "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="countdown-note">Until Pragya & Nithin make it official</p>
          </article>
        </div>
      </section>

      <section className="venue-section section" id="venue">
        <div className="venue-card reveal" data-reveal>
          <div className="venue-visual" aria-hidden="true">
            <div className="map-animation">
              <i className="map-road road-one" />
              <i className="map-road road-two" />
              <i className="map-road road-three" />
              <i className="map-road road-four" />
              <i className="map-road road-five" />
              <i className="map-block block-one" />
              <i className="map-block block-two" />
              <i className="map-block block-three" />
              <i className="map-water" />
              <span className="map-landmark landmark-jail"><i />Central Jail</span>
              <span className="map-landmark landmark-fuel"><i />IOC Petrol Bunk</span>
              <span className="route-origin"><i />You&apos;re invited</span>
              <div className="route-line" />
              <span className="route-heart">♥</span>
              <div className="map-pin"><i /></div>
              <span className="destination-label">Manjeera Sarovar</span>
            </div>
            <p>Rajahmundry</p>
            <span className="map-date">16.08.26</span>
          </div>
          <div className="venue-copy">
            <p className="eyebrow">Where to find us</p>
            <h2>Manjeera Sarovar <span>Premiere</span></h2>
            <p>
              Opposite Central Jail, beside IOC Petrol Bunk<br />
              Rajahmundry, Andhra Pradesh
            </p>
            <a
              className="primary-action"
              href="https://www.google.com/maps/search/?api=1&query=Manjeera+Sarovar+Premiere+Rajahmundry"
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="family-section section">
        <div className="family-card reveal" data-reveal>
          <div className="family-ornament" aria-hidden="true"><i /><i /><i /></div>
          <p className="eyebrow">Awaiting your gracious presence</p>
          <h2>Come as guests,<br /><span>leave as family.</span></h2>
          <p className="family-copy">
            We would be honoured to celebrate this cherished moment with you.
          </p>
          <div className="hosts">
            <p>
              With warm regards<br />
              <strong>Mr. M. V. V. S. Kumar</strong><br />
              <strong>& Mrs. M. V. Durga</strong>
            </p>
            <div className="host-rsvp">
              <span>RSVP</span>
              <a href="tel:+919030088300">90300 88300</a>
            </div>
          </div>
          <div className="family-monogram" aria-hidden="true">
            <span>P</span><em>&</em><span>N</span>
          </div>
        </div>
      </section>

      <footer>
        <p className="telugu-footer">మీ ఆశీస్సులతో మా కొత్త ప్రయాణానికి శ్రీకారం చుట్టండి</p>
        <p>Made with love for Pragya & Nithin</p>
        <span>16 August 2026</span>
      </footer>
    </main>
  );
}
