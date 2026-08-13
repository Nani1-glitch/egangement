"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

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

  return (
    <main className="invite-shell">
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
        <a className="rsvp-link" href="tel:+919030088300">
          RSVP <span>90300 88300</span>
        </a>
      </header>

      <section className="hero" id="home">
        <div className="toranam" aria-hidden="true">
          {Array.from({ length: 11 }).map((_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className="kolam kolam-left" aria-hidden="true" />
        <div className="kolam kolam-right" aria-hidden="true" />

        <div className="hero-copy">
          <p className="sacred-mark" aria-label="Sri">
            శ్రీ
          </p>
          <p className="telugu-kicker">శుభ నిశ్చితార్థ ఆహ్వానం</p>
          <p className="eyebrow hero-eyebrow">The Midde family joyfully invites you</p>

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
            <div className="route-line" />
            <div className="map-pin"><i /></div>
            <p>Rajahmundry</p>
            <span>16.08.26</span>
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
            <a href="tel:+919030088300">
              <span>RSVP</span>
              90300 88300
            </a>
          </div>
          <div className="family-monogram" aria-hidden="true">
            <span>P</span><em>&</em><span>N</span>
          </div>
        </div>
      </section>

      <footer>
        <p className="telugu-footer">రండి · ఆశీర్వదించండి · ఆనందించండి</p>
        <p>Made with love for Pragya & Nithin</p>
        <span>16 August 2026</span>
      </footer>
    </main>
  );
}
