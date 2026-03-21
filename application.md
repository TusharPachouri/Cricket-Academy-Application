Build a premium, full-screen cricket academy hero page as a single HTML file.
No frameworks, no external JS libraries. Google Fonts via <link> only.

═══════════════════════════════════════
FONTS — load all from Google Fonts:
═══════════════════════════════════════
- "Bebas Neue"        → hero title, section numbers
- "Playfair Display"  → elegant subheadings, pull quotes
- "Barlow Condensed"  → stats, badges, counters
- "DM Sans"           → body, nav, labels, descriptions
- "Instrument Serif"  → decorative italic accents

Use font mixing aggressively — different sections use different fonts
for a premium editorial magazine feel. Never use system fonts.

═══════════════════════════════════════
INTERACTIVE 3D CRICKET BALL (the hero)
═══════════════════════════════════════
Build the ball entirely in SVG + CSS + vanilla JS. No Three.js.

BALL APPEARANCE (make it look like a REAL cricket ball):
- Large circle, ~280px, deep red leather: radialGradient with
  highlight top-left (#ff6a4d → #c0200a → #6b0c04 → #2a0402)
- Two distinct leather HEMISPHERES separated by the main seam
- Left half slightly lighter, right half darker (simulate worn leather)
- Specular highlight: soft white-orange blob, top-left, opacity 0.5
- Rim light: warm orange stroke on ball edge, low opacity
- Drop shadow: blurred ellipse below ball

SEAM SYSTEM (realistic cricket ball seam):
- PRIMARY SEAM: thick raised seam crossing the equator in a 
  gentle S-curve/sine wave. Use a wide stroke path with 
  gold/amber gradient (#ffd580 → #c8a040 → #8a6010)
- SEAM STITCHES: 20+ short diagonal <line> pairs along the seam,
  alternating angles like real stitching, stroke #d4a030, 1.2px
- SECONDARY SEAM: thinner perpendicular seam crossing pole to pole
- All seams clipped inside ball with clipPath

BALL INTERACTIONS:
1. MOUSE DRAG TO SPIN — click and drag rotates the ball.
   Implement a fake 3D rotation: 
   - Track mousedown/mousemove delta (dx, dy)
   - Rotate a <g> group: transform the seam paths and 
     leather hemispheres based on drag direction
   - Apply momentum/inertia: ball keeps spinning after release,
     gradually decelerating (friction ~0.96 per frame)
   - requestAnimationFrame loop for smooth 60fps

2. AUTO-ROTATE — when not being dragged, ball slowly spins 
   on Y-axis automatically (like a slow bowler's rotation)

3. HOVER GLOW — on hover, lime green (#AAFF00) ambient glow 
   appears around ball, subtle scale(1.03) ease

4. ORBIT RINGS — 2 ellipses around ball:
   - Ring 1: lime (#AAFF00), rotateX(75deg), spins 12s
   - Ring 2: dark subtle, reverse spin 18s
   - Rings tilt slightly when ball is dragged (parallax feel)

5. FLOAT ANIMATION — gentle vertical float when idle,
   pauses when dragging

═══════════════════════════════════════
PAGE LAYOUT
═══════════════════════════════════════

CARD: 1000×620px centered, bg #f0f0ea, border-radius 28px,
deep box-shadow, outer page bg #c8c8c2.

TOP NAV:
- Frosted glass pill: Programs | Coaches | About | Trials | Contact
- Right: "Login" + dark pill "Enroll Now →"
- Font: DM Sans 13px

HERO TITLE:
- Academy name in Bebas Neue ~200px, centered, behind ball
- Fades in on load with translateY animation

BOTTOM-LEFT BLOCK:
- 3 overlapping avatar circles (initials)
- "500+" in Barlow Condensed bold
- "Trained athletes" in DM Sans muted
- Tagline in Playfair Display italic:
  "Where champions are forged."
- Dotted line decoration below

BOTTOM-RIGHT:
- Lime circle button (100px) "▶ Watch story"
- Spring bounce hover animation

TOP-RIGHT FEATURES:
- Right-aligned list in DM Sans + Barlow Condensed numbers:
  Expert Coaching /01
  Performance Tracking /02  
  Video Analysis /03

═══════════════════════════════════════
BELOW THE HERO — FULL SCROLLABLE PAGE
═══════════════════════════════════════
Continue below the card with these sections.
Each section uses DIFFERENT font combinations for richness.

SECTION 1 — STATS BAR:
Full-width dark (#0d0d0d) strip.
4 animated counters (count up on scroll into view):
  500+ Students | 12 National Players | 15 Years | 3 Trophies
Font: Bebas Neue for numbers (72px), DM Sans for labels.
Separator: thin lime vertical lines between stats.

SECTION 2 — PROGRAMS:
White section. Heading in Playfair Display italic bold, large.
Subheading in Barlow Condensed uppercase muted.
4 cards in a grid:
  - Junior Academy (8–14)
  - Senior Batting
  - Pace Bowling
  - Wicket Keeping
Each card: hover lifts with shadow, lime accent line on top,
icon made from CSS shapes (no emoji, no images),
title in Barlow Condensed, description in DM Sans.

SECTION 3 — COACHES SPOTLIGHT:
Dark section (#111). 
Heading in Bebas Neue huge + Playfair italic mixed on same line.
3 coach cards: initials avatar, name in Playfair Display,
credential in Barlow Condensed uppercase lime,
bio in DM Sans light.

SECTION 4 — TESTIMONIAL PULL QUOTE:
Full-width. Giant opening quote mark in Playfair Display 
(200px, lime, decorative). Quote text in Playfair Display 
italic 32px. Attribution in Barlow Condensed.
Background: subtle off-white with grain texture.

SECTION 5 — CTA FOOTER:
Dark. Heading split: normal Bebas Neue + italic Playfair 
on same line (mixed fonts mid-sentence).
"Join the Academy" button: lime bg, dark text, 
large rounded pill, hover glow animation.
Small print in DM Sans light.

═══════════════════════════════════════
ANIMATIONS & POLISH
═══════════════════════════════════════
- Staggered load animations on all hero elements
- Scroll-triggered fade-up on all sections 
  (IntersectionObserver, threshold 0.15)
- Counter animation: ease-out counting from 0 to target
- Smooth scroll behavior: html { scroll-behavior: smooth }
- Cursor: custom cursor dot that follows mouse (small 8px 
  lime circle), scales up on hover over clickable elements
- Background lime glow blob behind ball pulses (4s infinite)
- Noise texture overlay on hero card (SVG feTurbulence, opacity 0.03)

═══════════════════════════════════════
REPLACE BEFORE RUNNING:
═══════════════════════════════════════
- "CRIKON." → Braj Cricket Academy
- "Where champions are forged."  
- All stats with real numbers
- Nav links with real page names
- Coach names and credentials with real people