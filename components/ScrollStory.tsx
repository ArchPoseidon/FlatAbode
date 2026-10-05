'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

// Flat-hunt thoughts that float down the page. Each drifts at its own speed.
const BUBBLES = [
  { text: 'budget under 60k, split three ways', left: '8%', top: '4%', bg: 'var(--accent)', fg: '#fff', speed: 40 },
  { text: 'must have a lift', left: '52%', top: '12%', bg: '#d9a441', fg: '#241f1a', speed: 90 },
  { text: '2 BHK or 3 BHK?', left: '22%', top: '22%', bg: 'var(--success)', fg: '#fff', speed: 60 },
  { text: 'pets allowed, please', left: '56%', top: '31%', bg: 'var(--accent-soft)', fg: '#241f1a', speed: 120 },
  { text: 'near the metro', left: '6%', top: '40%', bg: '#241f1a', fg: '#faf6ef', speed: 70 },
  { text: 'who pays the deposit?', left: '48%', top: '49%', bg: 'var(--accent)', fg: '#fff', speed: 50 },
  { text: 'no ground floor', left: '14%', top: '58%', bg: '#d9a441', fg: '#241f1a', speed: 100 },
  { text: 'balcony with some light', left: '50%', top: '67%', bg: 'var(--success)', fg: '#fff', speed: 80 },
  { text: 'power backup, always', left: '10%', top: '76%', bg: 'var(--accent-soft)', fg: '#241f1a', speed: 45 },
  { text: 'can we all agree on one?', left: '46%', top: '86%', bg: '#241f1a', fg: '#faf6ef', speed: 110 },
];

const STEPS = [
  { n: '01', title: 'Pick your group', body: 'Say how many of you are hunting. Everyone gets a personal link, no sign-up.' },
  { n: '02', title: 'Say what matters', body: 'Budget, BHK, areas, must-haves and nice-to-haves. Each person on their own.' },
  { n: '03', title: 'Drop in listings', body: 'Paste a link from NoBroker, Housing.com and more. We read the details for you.' },
  { n: '04', title: 'Agree together', body: 'See who is missing what on every flat, love your favourites, leave notes.' },
];

// A long ribbon that draws itself as the section scrolls past.
const RIBBON =
  'M 220 0 C 380 140, 380 290, 250 410 C 90 560, 30 390, 150 330 C 280 270, 370 470, 320 640 C 270 810, 70 830, 120 1010 C 160 1150, 280 1170, 270 1300';

function Bubble({
  bubble,
  progress,
  reduce,
  index,
}: {
  bubble: (typeof BUBBLES)[number];
  progress: MotionValue<number>;
  reduce: boolean;
  index: number;
}) {
  const y = useTransform(progress, [0, 1], [bubble.speed, -bubble.speed]);
  return (
    <motion.div
      className="absolute max-w-[62%] sm:max-w-[34%]"
      style={{ left: bubble.left, top: bubble.top, y: reduce ? 0 : y }}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 18, delay: (index % 3) * 0.06 }}
    >
      <div
        className="px-5 py-3 text-base sm:text-lg shadow-sm"
        style={{
          background: bubble.bg,
          color: bubble.fg,
          borderRadius: '1.25rem',
          borderBottomLeftRadius: index % 2 === 0 ? '0.3rem' : '1.25rem',
          borderBottomRightRadius: index % 2 === 1 ? '0.3rem' : '1.25rem',
        }}
      >
        {bubble.text}
      </div>
    </motion.div>
  );
}

export default function ScrollStory({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion() ?? false;

  const bubblesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bubbleProgress } = useScroll({
    target: bubblesRef,
    offset: ['start end', 'end start'],
  });
  const ribbon = useSpring(useTransform(bubbleProgress, [0.08, 0.85], [0, 1]), { stiffness: 90, damping: 22 });

  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsProgress } = useScroll({
    target: stepsRef,
    offset: ['start 70%', 'end 60%'],
  });
  const railFill = useSpring(stepsProgress, { stiffness: 90, damping: 22 });

  return (
    <div className="relative overflow-x-clip">
      <section className="relative overflow-hidden" aria-label="What flat hunting with friends is really like">
        <div className="max-w-xl mx-auto px-6 pt-10 pb-4 text-center">
          <p className="text-sm tracking-wide uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            Sound familiar?
          </p>
          <h2 className="font-display text-4xl leading-tight">
            Four people, one flat, <em className="italic">a hundred opinions.</em>
          </h2>
        </div>

        <div ref={bubblesRef} className="relative max-w-xl mx-auto" style={{ height: 'min(150vh, 1300px)' }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 1300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d={RIBBON}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={22}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.9}
              style={{ pathLength: reduce ? 1 : ribbon }}
            />
          </svg>
          {BUBBLES.map((b, i) => (
            <Bubble key={b.text} bubble={b} progress={bubbleProgress} reduce={reduce} index={i} />
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-24" aria-label="How FlatAbode works">
        <div className="text-center mb-14">
          <p className="text-sm tracking-wide uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            How it works
          </p>
          <h2 className="font-display text-4xl leading-tight">
            From a messy group chat to <em className="italic">one clear shortlist.</em>
          </h2>
        </div>

        <div ref={stepsRef} className="relative pl-10 sm:pl-14">
          <div className="absolute left-3 sm:left-5 top-2 bottom-2 w-1 rounded-full" style={{ background: 'var(--border)' }} />
          <motion.div
            className="absolute left-3 sm:left-5 top-2 bottom-2 w-1 rounded-full origin-top"
            style={{ background: 'var(--accent)', scaleY: reduce ? 1 : railFill }}
          />
          <div className="flex flex-col gap-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                className="card relative"
                initial={reduce ? false : { opacity: 0, x: i % 2 === 0 ? -48 : 48, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ type: 'spring', stiffness: 110, damping: 18 }}
              >
                <span
                  className="absolute -left-[2.35rem] sm:-left-[2.75rem] top-6 w-6 h-6 rounded-full border-4"
                  style={{ background: 'var(--bg)', borderColor: 'var(--accent)' }}
                />
                <p className="font-display text-sm mb-1" style={{ color: 'var(--accent)' }}>
                  {s.n}
                </p>
                <h3 className="font-display text-2xl mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <h2 className="font-display text-4xl leading-tight mb-3">
            The chillest flat hunt <em className="italic">you have run.</em>
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
            Set up your group in a few taps and share a link with each flatmate.
          </p>
          <button className="btn-primary" onClick={onStart}>
            Start your hunt
          </button>
        </motion.div>
      </section>
    </div>
  );
}
