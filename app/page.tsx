"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const WEDDING_TIME = new Date("2026-08-30T23:25:00+05:30").getTime();

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

const saptapadiSteps = [
  { telugu: "మొదటి అడుగు", title: "Nourishment", meaning: "అన్న పానీయాల కోసం" },
  { telugu: "రెండవ అడుగు", title: "Strength & Joy", meaning: "సుఖసంతోషాల కోసం" },
  { telugu: "మూడవ అడుగు", title: "Sacred Vows", meaning: "వ్రతాల కోసం" },
  { telugu: "నాలుగవ అడుగు", title: "Progeny", meaning: "సంతానం కోసం" },
  { telugu: "ఐదవ అడుగు", title: "Prosperity", meaning: "పాడిపంటల కోసం" },
  { telugu: "ఆరవ అడుగు", title: "Companionship", meaning: "సఖ్యత కోసం" },
  { telugu: "ఏడవ అడుగు", title: "Everlasting Bond", meaning: "సంపద కోసం" },
];

function getCountdown() {
  const distance = Math.max(WEDDING_TIME - Date.now(), 0);
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

    if (!audio.paused && !audio.muted) {
      setMusicState("playing");
      return true;
    }

    try {
      if (audio.paused) {
        // Browsers gate play() on the muted property, not volume, so a
        // muted play() is allowed without a user gesture; unmuting an
        // already-playing element afterward isn't re-gated.
        audio.muted = true;
        audio.volume = 0.12;
        await audio.play();
      }

      audio.muted = false;
      audio.volume = 0;
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

  const weddingCalendarHref = useMemo(() => {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pragya and Nithin//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:pragya-nithin-wedding-20260830",
      "DTSTAMP:20260815T000000Z",
      "DTSTART:20260830T175500Z",
      "DTEND:20260830T202500Z",
      "SUMMARY:Pragya Tejasri & Nithin's Wedding Muhurtham",
      "DESCRIPTION:With love, the Midde and Rajulapati families invite you to the wedding of Pragya Tejasri and Nithin.",
      "LOCATION:Suresh Convention Centre, Polavaram Road, Koyyalagudem",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(calendar);
  }, []);

  const receptionCalendarHref = useMemo(() => {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pragya and Nithin//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:pragya-nithin-reception-20260901",
      "DTSTAMP:20260815T000000Z",
      "DTSTART:20260901T053000Z",
      "DTEND:20260901T083000Z",
      "SUMMARY:Pragya Tejasri & Nithin's Wedding Reception",
      "DESCRIPTION:Reception and dinner celebrating Pragya Tejasri and Nithin.",
      "LOCATION:Sri Lakshmi Padmavathi Function Hall, Quarry Canal Road, Dhavaleswaram",
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
    const gestureEvents = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

    const beginOnFirstGesture = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-toggle")) return;

      void startMusic().then((started) => {
        if (!started) return;
        gestureEvents.forEach((type) => window.removeEventListener(type, beginOnFirstGesture));
      });
    };

    gestureEvents.forEach((type) =>
      window.addEventListener(type, beginOnFirstGesture, { passive: true }),
    );

    return () => {
      gestureEvents.forEach((type) => window.removeEventListener(type, beginOnFirstGesture));
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
        <div className="rsvp-link" aria-label="RSVP phone numbers">
          <strong>RSVP</strong>
          <span className="rsvp-numbers">
            <a href="tel:+919030088300">90300 88300</a>
            <i aria-hidden="true">·</i>
            <a href="tel:+918099990908">80999 90908</a>
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
          <p className="telugu-kicker">శుభ వివాహ ఆహ్వానం</p>
          <p className="eyebrow hero-eyebrow">
            The <span className="surname-highlight">Midde</span> &amp;{" "}
            <span className="surname-highlight">Rajulapati</span> families joyfully invite you
          </p>

          <h1>
            <span>Pragya</span>
            <em>&</em>
            <span>Nithin</span>
          </h1>

          <p className="hero-subtitle">are tying the sacred knot</p>

          <button
            className="ring-seal"
            type="button"
            aria-label="Celebrate Pragya and Nithin's wedding"
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

          <div className="hero-date" aria-label="Sunday, 30 August 2026, Muhurtham at 11:25 PM">
            <span>Sunday</span>
            <strong>30 · 08 · 2026</strong>
            <span>11:25 PM · Muhurtham</span>
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
          <h2>Two souls, one sacred <span>bond.</span></h2>
          <p className="invitation-copy">
            With hearts full of joy and the divine blessings of our elders, we
            invite you to witness the sacred moment when Pragya Tejasri and
            Nithin become one — amid pearl talambralu, showers of akshintalu,
            and the warmth of family, in a beautifully adorned mandapam.
          </p>
          <p className="telugu-blessing">
            ముత్యాల తలంబ్రాలతో – జాలువారే అక్షింతల నడుమ మా ప్రగ్యాతేజశ్రీ-నితిన్
            ఒక్కటయ్యే మధుర క్షణాన మీ చల్లని దీవెనలు కోరుచున్నాము
          </p>
        </div>
      </section>

      <section className="verse-section reveal" data-reveal>
        <div className="verse-card">
          <p className="eyebrow">A blessing for the sacred vows</p>
          <p className="verse-text">
            జానక్యాః కమలామలాంజలి పుటే యా పద్మరాగాయితా
            <br />
            న్యస్తా రాఘవ మస్తకే విలసతాం ప్రసూనాయితా
            <br />
            ప్రస్తార్యామల కాయకాంతి కలితా యేంద్రనీలాయితా
            <br />
            ముక్తాస్తా స్సుభదా భవన్తు భవతాం శ్రీరామవైవాహికాః
          </p>
          <p className="verse-gloss">
            May the pearls of Sri Rama&rsquo;s own wedding, radiant as rubies and sapphires, bring
            auspiciousness and joy to this sacred union as well.
          </p>
        </div>
      </section>

      <section className="event-section section" id="ceremony">
        <div className="section-heading reveal" data-reveal>
          <p className="eyebrow">Save the date</p>
          <h2>A sacred night for <span>forever</span></h2>
        </div>

        <div className="event-grid">
          <article className="date-card reveal" data-reveal>
            <div className="calendar-leaf">
              <span>August</span>
              <strong>30</strong>
              <em>Sunday · 2026</em>
            </div>
            <div className="time-note">
              <span className="line-art-clock" aria-hidden="true" />
              <div>
                <p>Muhurtham begins at</p>
                <strong>11:25 PM</strong>
              </div>
            </div>
            <p className="muhurtham-note">Uttarabhadra Nakshatram · Vrishabha Lagnam</p>
            <a
              className="text-action"
              href={weddingCalendarHref}
              download="Pragya-and-Nithin-Wedding.ics"
            >
              Add to calendar <span aria-hidden="true">＋</span>
            </a>
          </article>

          <article className="countdown-card reveal" data-reveal>
            <p className="eyebrow">Counting down to our sacred vows</p>
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
            <p className="countdown-note">Until Pragya &amp; Nithin become one</p>
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
              <span className="route-origin"><i />You&apos;re invited</span>
              <div className="route-line" />
              <span className="route-heart">♥</span>
              <div className="map-pin"><i /></div>
              <span className="destination-label">Kalyana Vedika</span>
            </div>
            <p>Koyyalagudem</p>
            <span className="map-date">30.08.26</span>
          </div>
          <div className="venue-copy">
            <p className="eyebrow">Where the vows are taken</p>
            <h2>Suresh Convention <span>Centre</span></h2>
            <p>
              Polavaram Road (A/C Kalyana Vedika)
              <br />
              Koyyalagudem, Andhra Pradesh
            </p>
            <a
              className="primary-action"
              href="https://www.google.com/maps/search/?api=1&query=Suresh+Convention+Centre+Polavaram+Road+Koyyalagudem"
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="reception-section section" id="reception">
        <div className="section-heading reveal" data-reveal>
          <p className="eyebrow">A second celebration</p>
          <h2>Reception &amp; <span>dinner</span></h2>
        </div>
        <div className="reception-card reveal" data-reveal>
          <div className="reception-date">
            <div className="calendar-leaf calendar-leaf-light">
              <span>September</span>
              <strong>1</strong>
              <em>Tuesday · 2026</em>
            </div>
            <div className="time-note time-note-light">
              <span className="line-art-clock line-art-clock-light" aria-hidden="true" />
              <div>
                <p>Doors open at</p>
                <strong>11:00 AM onwards</strong>
              </div>
            </div>
            <a
              className="text-action text-action-light"
              href={receptionCalendarHref}
              download="Pragya-and-Nithin-Reception.ics"
            >
              Add to calendar <span aria-hidden="true">＋</span>
            </a>
          </div>
          <div className="reception-venue">
            <p className="eyebrow">Where to celebrate</p>
            <h3>
              Sri Lakshmi Padmavathi <span>Function Hall</span>
            </h3>
            <p>
              Quarry Canal Road (A/C Hall)
              <br />
              Dhavaleswaram, Andhra Pradesh
            </p>
            <a
              className="primary-action"
              href="https://www.google.com/maps/search/?api=1&query=Sri+Lakshmi+Padmavathi+Function+Hall+Quarry+Canal+Road+Dhavaleswaram"
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="saptapadi-section section" id="saptapadi">
        <div className="section-heading reveal" data-reveal>
          <p className="eyebrow">Seven steps, seven vows</p>
          <h2>Saptapadi</h2>
          <p className="saptapadi-intro">
            Each step taken together around the sacred fire is a promise for our journey ahead.
          </p>
        </div>
        <div className="saptapadi-grid">
          {saptapadiSteps.map((step, index) => (
            <div className="saptapadi-step reveal" data-reveal key={step.telugu}>
              <span className="saptapadi-number">{twoDigits(index + 1)}</span>
              <p className="saptapadi-telugu">{step.telugu}</p>
              <strong>{step.title}</strong>
              <em>{step.meaning}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="family-section section">
        <div className="family-card reveal" data-reveal>
          <div className="family-ornament" aria-hidden="true"><i /><i /><i /></div>
          <p className="eyebrow">With the blessings of our families</p>
          <h2>Two families,<br /><span>united in love.</span></h2>

          <div className="family-grid">
            <div className="family-side">
              <span className="family-role">The Bride</span>
              <h3>Pragya Tejasri</h3>
              <p className="family-qualification">B.Tech.</p>
              <p>
                Daughter of
                <br />
                <strong>Sri Midde Veera Venkata Satya Kumar</strong>
                <br />
                Senior Engineer, KEC International Ltd.
                <br />
                &amp; <strong>Smt. Veera Durga</strong>
              </p>
              <p className="family-note">
                With the divine blessings of Sri Midde Malleswara Rao &amp; Sri Midde Suresh Kumar
              </p>
              <p className="family-note">Nanamma Midde Adilakshmi</p>
            </div>

            <div className="family-side">
              <span className="family-role">The Groom</span>
              <h3>Nithin</h3>
              <p className="family-qualification">M.S. (USA)</p>
              <p>
                Son of
                <br />
                <strong>Dr. Rajulapati Praveen Kumar</strong>
                <br />
                Advocate, A.P. High Court
                <br />
                &amp; <strong>Smt. Sri Vidya</strong>
                <br />
                Chairman, Apollo Vidya Sansthalu (AP &amp; TS)
              </p>
              <p className="family-note">Brother Chi. Dikshit Manikumar</p>
            </div>
          </div>

          <p className="family-copy">
            We would be honoured to celebrate this cherished moment with you.
          </p>

          <div className="hosts">
            <p>
              With warm regards<br />
              <strong>Mr. Midde Veera Venkata Satya Kumar</strong><br />
              <strong>&amp; Mrs. Veera Durga</strong>
            </p>
            <div className="host-rsvp">
              <span>RSVP</span>
              <a href="tel:+919030088300">90300 88300</a>
              <a href="tel:+918099990908">80999 90908</a>
            </div>
          </div>

          <p className="well-wishers">
            With blessings from our grandparents, in loving memory of Sri Relangi Satyanarayana
            &amp; Smt. Venkatalakshmi (Chittamma), and with the good wishes of Sri Brahmarapu
            Appalaswamy &amp; brothers, Sri Earla Srinivasarao &amp; Smt. Sujatha, Sri Balumuri
            Sureshbabu &amp; Smt. Roopachandrika, and our beloved relatives and friends.
          </p>

          <div className="family-monogram" aria-hidden="true">
            <span>P</span><em>&</em><span>N</span>
          </div>
        </div>
      </section>

      <footer>
        <p className="telugu-footer">మీ ఆశీస్సులతో మా కొత్త ప్రయాణానికి శ్రీకారం చుట్టండి</p>
        <p>Made with love for Pragya Tejasri &amp; Nithin</p>
        <span>30 August &amp; 01 September 2026</span>
      </footer>
    </main>
  );
}
