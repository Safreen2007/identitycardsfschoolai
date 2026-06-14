import { useState, useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";
import Lottie from "react-lottie";
import ninjaGroupImg from "./ninja_group.png";

// ── Data ──────────────────────────────────────────────────────────────────────
const LEADERS = [
  { id:"u1",  rank:1,    name:"Sarah K.",   location:[37.78,-122.44],  country:"USA"       },
  { id:"u2",  rank:2,    name:"Marcus T.",  location:[51.51,-0.13],    country:"UK"        },
  { id:"u3",  rank:3,    name:"Yuki M.",    location:[35.68,139.65],   country:"Japan"     },
  { id:"u4",  rank:4,    name:"Priya S.",   location:[28.61,77.21],    country:"India"     },
  { id:"u5",  rank:5,    name:"Luca R.",    location:[41.90,12.49],    country:"Italy"     },
  { id:"u6",  rank:6,    name:"Ana P.",     location:[-23.55,-46.63],  country:"Brazil"    },
  { id:"u7",  rank:7,    name:"Chen W.",    location:[31.23,121.47],   country:"China"     },
  { id:"u8",  rank:8,    name:"Fatima Z.",  location:[25.20,55.27],    country:"UAE"       },
  { id:"u9",  rank:9,    name:"James O.",   location:[-33.87,151.21],  country:"Australia" },
  { id:"u10", rank:10,   name:"Nina V.",    location:[55.75,37.62],    country:"Russia"    },
  { id:"u11", rank:11,   name:"Omar H.",    location:[30.04,31.24],    country:"Egypt"     },
  { id:"u12", rank:1089, name:"Alex C.",    location:[1.35,103.82],    country:"Singapore" },
];

const GROUP_MEMBERS = [
  { id:"m1", initials:"SK", color:"#4a8fd4" },
  { id:"m2", initials:"MT", color:"#6a70c8" },
  { id:"m3", initials:"YM", color:"#4aaa88" },
  { id:"m4", initials:"PS", color:"#c87848" },
];

const RANK_STYLE = {
  1:    { color:"#FFD700", glow:"0 0 8px #FFD700aa" },
  2:    { color:"#C0C0C0", glow:"0 0 6px #C0C0C0aa" },
  3:    { color:"#CD7F32", glow:"0 0 6px #CD7F32aa" },
  other:{ color:"rgba(255,255,255,0.85)", glow:"none" },
};
function rankStyle(r) { return RANK_STYLE[r] || RANK_STYLE.other; }

const MY_RANK = 1089;

// ── Confetti animation data (embedded) ───────────────────────────────────────
const confettiData = {"v":"5.5.8","fr":29.97,"ip":0,"op":300,"w":2000,"h":2000,"nm":"Comp 1","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"confetti","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[1000,1000,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":0,"k":[40,40]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"nm":"rect"},{"ty":"fl","c":{"a":1,"k":[{"t":0,"s":[0.2,0.8,1,1]},{"t":50,"s":[1,0.8,0.2,1]},{"t":100,"s":[0.2,1,0.5,1]},{"t":150,"s":[1,0.3,0.8,1]},{"t":200,"s":[0.2,0.8,1,1]}]},"o":{"a":0,"k":100},"r":1,"nm":"Fill"},{"ty":"tr","p":{"a":1,"k":[{"t":0,"s":[-200,-800]},{"t":299,"s":[2200,2800]}]},"a":{"a":0,"k":[0,0]},"s":{"a":1,"k":[{"t":0,"s":[100,100]},{"t":80,"s":[100,10]},{"t":150,"s":[100,100]},{"t":230,"s":[100,10]},{"t":299,"s":[100,100]}]},"r":{"a":1,"k":[{"t":0,"s":[0]},{"t":299,"s":[360]}]},"o":{"a":0,"k":100}}],"nm":"rect1","np":3,"cix":2,"bm":0,"ix":1}],"ip":0,"op":300,"st":0,"bm":0}],"markers":[]};

// ── 3D projection helper ──────────────────────────────────────────────────────
function project(lat, lng, phi, theta, size) {
  const DEG = Math.PI / 180;
  const latR = lat * DEG, lngR = lng * DEG;
  const x3 = Math.cos(latR) * Math.sin(lngR);
  const y3 = Math.sin(latR);
  const z3 = Math.cos(latR) * Math.cos(lngR);
  const cosPhi = Math.cos(-phi), sinPhi = Math.sin(-phi);
  const cosTheta = Math.cos(-theta), sinTheta = Math.sin(-theta);
  const x1 = x3 * cosPhi + z3 * sinPhi;
  const y1 = y3;
  const z1 = -x3 * sinPhi + z3 * cosPhi;
  const x2 = x1;
  const y2 = y1 * cosTheta - z1 * sinTheta;
  const z2 = y1 * sinTheta + z1 * cosTheta;
  const visible = z2 > 0.08;
  const opacity = Math.max(0, Math.min(1, (z2 - 0.08) * 5));
  const sx = (x2 + 1) / 2 * size;
  const sy = (1 - (y2 + 1) / 2) * size;
  return { x: sx, y: sy, visible, opacity };
}

// ── Globe component ───────────────────────────────────────────────────────────
function GlobeWithTags({ visible, expanded, setExpanded, themeObj }) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi:0, theta:0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const phiRef = useRef(0);
  const [tagPositions, setTagPositions] = useState([]);
  const SIZE = 200;

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x:e.clientX, y:e.clientY };
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi:0, theta:0 };
    }
    pointerInteracting.current = null;
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (pointerInteracting.current) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 200,
          theta: (e.clientY - pointerInteracting.current.y) / 800,
        };
      }
    };
    window.addEventListener("pointermove", onMove, { passive:true });
    window.addEventListener("pointerup", handlePointerUp, { passive:true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current || !visible) return;
    const canvas = canvasRef.current;
    let globe, animId;

    const init = () => {
      const w = canvas.offsetWidth;
      if (!w || globe) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: w, height: w,
        phi: 0, theta: 0.3,
        dark: 1, diffuse: 1.8,
        mapSamples: 16000, mapBrightness: 6,
        baseColor: themeObj?.globeBase || [0.15, 0.35, 0.65],
        markerColor: themeObj?.globeMarker || [0.85, 0.92, 1.0],
        glowColor: themeObj?.globeGlow || [0.25, 0.5, 0.9],
        markers: LEADERS.map(l => ({ location: l.location, size: 0.04 })),
        opacity: 0.9,
      });
      const animate = () => {
        if (!isPausedRef.current) phiRef.current += 0.003;
        const currentPhi = phiRef.current + phiOffsetRef.current + dragOffset.current.phi;
        const currentTheta = 0.3 + thetaOffsetRef.current + dragOffset.current.theta;
        globe.update({ phi: currentPhi, theta: currentTheta });
        setTagPositions(LEADERS.map(l => ({
          ...l,
          ...project(l.location[0], l.location[1], currentPhi, currentTheta, SIZE),
        })));
        animId = requestAnimationFrame(animate);
      };
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    };

    if (canvas.offsetWidth > 0) init();
    else {
      const ro = new ResizeObserver(entries => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init(); }
      });
      ro.observe(canvas);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (globe) globe.destroy();
    };
  }, [visible]);

  return (
    <div
      style={{ position:"relative", width:SIZE, height:SIZE, flexShrink:0, cursor:"grab" }}
      onPointerDown={handlePointerDown}
    >
      <canvas ref={canvasRef} style={{ width:"100%", height:"100%", opacity:0, transition:"opacity 1.2s ease", borderRadius:"50%", touchAction:"none", display:"block" }}/>
      {tagPositions.map(t => {
        if (!t.visible) return null;
        const rs = rankStyle(t.rank);
        const isExp = expanded === t.id;
        return (
          <div key={t.id}
            onClick={e => { e.stopPropagation(); setExpanded(isExp ? null : t.id); }}
            style={{
              position:"absolute", left:t.x, top:t.y,
              transform:"translate(-50%,-120%)",
              background:themeObj?.tooltipBg||"rgba(5,15,50,0.85)",
              border:`1px solid ${rs.color}55`,
              borderRadius:5, padding: isExp ? "4px 8px" : "2px 6px",
              cursor:"pointer", zIndex:10,
              backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)",
              opacity: t.opacity,
              transition:"opacity 0.15s ease, padding 0.2s ease",
              pointerEvents: t.opacity > 0.3 ? "auto" : "none",
              whiteSpace:"nowrap",
            }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7, fontWeight:700, color:rs.color, textShadow:rs.glow, letterSpacing:"0.04em" }}>
              #{t.rank} {t.name}
            </div>
            {isExp && (
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:6.5, color:t?.subColor||"rgba(180,210,240,0.7)", marginTop:1 }}>
                {t.country}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Ticker line styles ────────────────────────────────────────────────────────
function getLines(t) { return [
  {
    render: () => (
      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, fontWeight:700,
        color:t.l1, whiteSpace:"nowrap" }}>
        You are ranked <strong style={{color:t.l1e}}>#1089</strong> amongst <strong style={{color:t.l1e}}>84,291</strong>
      </span>
    ),
    renderTicker: () => (
      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, fontWeight:700,
        color:t.l1, whiteSpace:"nowrap" }}>
        You are ranked <strong style={{color:t.l1e}}>#{MY_RANK}</strong> amongst <strong style={{color:t.l1e}}>84,291</strong>
      </span>
    ),
  },
  {
    render: () => (
      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:700,
        color:t.l2, whiteSpace:"nowrap" }}>
        Within your country ranked <strong style={{color:t.l2e}}>#140</strong>
      </span>
    ),
    renderTicker: () => (
      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:700,
        color:t.l2, whiteSpace:"nowrap" }}>
        Within your country ranked <strong style={{color:t.l2e}}>#140</strong>
      </span>
    ),
  },
  {
    render: () => (
      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, whiteSpace:"nowrap",
        color:t.l3 }}>
        Study group ranks{" "}
        <strong style={{ color:t.rankBronze||"#CD7F32" }}>#3</strong>
        {" "}globally
      </span>
    ),
    renderTicker: () => (
      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700,
        color:t.l3, whiteSpace:"nowrap" }}>
        Study group ranks{" "}
        <strong style={{ color:t.rankBronze||"#CD7F32" }}>#3</strong>
        {" "}globally
      </span>
    ),
  },
];}

// ── Neural Ninjas Card ────────────────────────────────────────────────────────
function NeuralNinjasCard({ t }) {
  const [groupPhoto, setGroupPhoto] = useState(ninjaGroupImg);
  const fileRef = useRef(null);
  const tc = t || {};
  const nameColor = tc.textColor || "rgba(255,255,255,0.9)";
  const subColor  = tc.subColor  || "rgba(180,210,240,0.6)";

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroupPhoto(URL.createObjectURL(file));
  };

  return (
    <div style={{
      width:"calc(100% - 28px)",
      background:"rgba(255,255,255,0.1)",
      backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
      border:"0.5px solid rgba(255,255,255,0.18)",
      borderRadius:14, padding:"10px 12px", marginTop:8,
      animation:"groupFadeIn 0.6s ease forwards 0.4s", opacity:0,
      display:"flex", gap:10, alignItems:"stretch",
    }}>
      {/* Left — group photo upload */}
      <div
        onClick={() => fileRef.current.click()}
        className="nn-photo-wrap"
        style={{
          width:64, height:64,
          borderRadius:10,
          background: groupPhoto ? "transparent" : "rgba(255,255,255,0.12)",
          border:"0.5px solid rgba(255,255,255,0.22)",
          flexShrink:0,
          cursor:"pointer",
          overflow:"hidden",
          position:"relative",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
        {groupPhoto ? (
          <img src={groupPhoto} alt="Group" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style={{fontSize:7,color:"rgba(255,255,255,0.4)",fontFamily:"'Inter',sans-serif",textAlign:"center",letterSpacing:"0.04em"}}>Add photo</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="nn-hover" style={{
          position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",
          display:"flex",alignItems:"center",justifyContent:"center",
          opacity:0,transition:"opacity 0.2s",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>

      {/* Right — info */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        {/* Top row: name + badge */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          {/* Neural Ninjas — Open Sans gradient */}
          <div>
            <span style={{
              fontFamily:"'Open Sans',sans-serif",
              fontSize:14, fontWeight:800,
              color: nameColor,
              display:"inline-block", letterSpacing:"-0.01em",
            }}>Neural Ninjas</span>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:subColor,marginTop:1}}>Study Group · 16 members</div>
          </div>
          {/* #3 Global badge — LiquidButton style, bronze */}
          <div style={{
            position:"relative",
            flexShrink:0, marginLeft:6,
          }}>
            <div style={{
              borderRadius:20,
              padding:"1px",
              background:"linear-gradient(135deg,rgba(205,127,50,0.45),rgba(180,100,30,0.15))",
              boxShadow:"0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 1px 1px 1px -0.5px rgba(205,127,50,0.4), inset -1px -1px 1px -0.5px rgba(205,127,50,0.2), inset 0 0 6px 6px rgba(205,127,50,0.06)",
            }}>
              <div style={{
                borderRadius:19,
                padding:"3px 10px",
                backdropFilter:"blur(12px) saturate(180%)",
                WebkitBackdropFilter:"blur(12px) saturate(180%)",
                background:"rgba(205,127,50,0.12)",
                border:"0.5px solid rgba(205,127,50,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span style={{
                  fontFamily:"'IBM Plex Mono',monospace",
                  fontSize:9, fontWeight:700,
                  background:"linear-gradient(90deg,#e8a84a 0%,#ffffff 55%,#cd9b3a 100%)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  display:"inline-block", letterSpacing:"0.04em",
                }}>
                  #3 Global
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: stacked avatars */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
          <div style={{display:"flex",alignItems:"center"}}>
            {GROUP_MEMBERS.map((m,i) => (
              <div key={m.id} style={{
                width:22,height:22,borderRadius:"50%",background:m.color,
                border:`1.5px solid rgba(0,0,0,0.2)`,
                marginLeft:i>0?-6:0,
                display:"flex",alignItems:"center",justifyContent:"center",
                zIndex:GROUP_MEMBERS.length-i,position:"relative",flexShrink:0,
              }}>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:7,fontWeight:700,color:"white"}}>{m.initials}</span>
              </div>
            ))}
            <div style={{
              width:22,height:22,borderRadius:"50%",
              background:"rgba(255,255,255,0.15)",
              border:`1.5px solid rgba(0,0,0,0.2)`,
              marginLeft:-6,display:"flex",alignItems:"center",justifyContent:"center",
              flexShrink:0,position:"relative",zIndex:0,
            }}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:6,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>+12</span>
            </div>
          </div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:subColor}}>Top 0.1% of all groups</div>
        </div>
      </div>
    </div>
  );
}

// ── Main LeaderboardCard ──────────────────────────────────────────────────────
export default function LeaderboardCard({ visible, themeObj }) {
  const t = themeObj || {
    bg:"linear-gradient(135deg,#1568bb 0%,#8ca1b6 50%,#0665c4 100%)",
    l1:"#cce4ff",l1e:"#ffffff",l2:"#a8ccf0",l2e:"#ddeeff",l3:"#b8c8e8",
    textColor:"rgba(255,255,255,0.9)",subColor:"rgba(180,210,240,0.6)",
  };
  // phase: 0=hidden, 1/2/3=lines fading in centered, 4=ticker starts, 5=globe shown
  const [phase, setPhase] = useState(0);
  const [showLine, setShowLine] = useState([false, false, false]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setPhase(0);
      setShowLine([false,false,false]);
      setShowConfetti(false);
      setTickerIndex(0);
      setTickerVisible(true);
      setExpanded(null);
      if (tickerRef.current) clearInterval(tickerRef.current);
      return;
    }
    // Phase 1-3: lines fade in centered
    const t1 = setTimeout(() => setShowLine([true,false,false]), 400);
    const t2 = setTimeout(() => setShowLine([true,true,false]), 1300);
    const t3 = setTimeout(() => {
      setShowLine([true,true,true]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 2200);
    // Phase 4: start ticker after brief pause showing all 3
    const t4 = setTimeout(() => setPhase(4), 3600);
    // Phase 5: show globe
    const t5 = setTimeout(() => setPhase(5), 4200);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, [visible]);

  // Ticker cycling
  useEffect(() => {
    if (phase < 4) return;
    const cycle = () => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIndex(i => (i + 1) % 3);
        setTickerVisible(true);
      }, 400);
    };
    const id = setInterval(cycle, 2800);
    tickerRef.current = id;
    return () => clearInterval(id);
  }, [phase]);

  const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: confettiData,
    rendererSettings: { preserveAspectRatio:"xMidYMid slice" },
  };

  const LINES = getLines(t);

  const lineBase = {
    transition:"opacity 0.65s ease, transform 0.65s ease",
    textAlign:"center",
    display:"flex", justifyContent:"center",
    lineHeight: 1.3,
    marginBottom: 6,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Barlow+Condensed:wght@700;800&family=IBM+Plex+Mono:wght@400&display=swap');
        @keyframes globeFadeIn { from{opacity:0;transform:scale(0.92);} to{opacity:1;transform:scale(1);} }
        @keyframes groupFadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes tickerIn  { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
        @keyframes tickerOut { from{opacity:1;transform:translateY(0);} to{opacity:0;transform:translateY(8px);} }
        @keyframes shineSpin { 0%{background-position:0% 0%} 50%{background-position:100% 100%} 100%{background-position:0% 0%} }
        .nn-photo-wrap:hover .nn-hover { opacity: 1 !important; }
      `}</style>

      {/* Confetti overlay — fixed to viewport so it covers full screen */}
      {showConfetti && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999 }}>
          <Lottie options={lottieOptions} height="100%" width="100%"/>
        </div>
      )}

      <div style={{
        width:320, height:500, borderRadius:26,
        background: t.bg,
        position:"relative", overflow:"hidden", flexShrink:0, boxSizing:"border-box",
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 55%)",pointerEvents:"none",zIndex:0}}/>

        {/* ── Phase 1-3: Lines centered ── */}
        {phase < 4 && (
          <div style={{
            position:"absolute", inset:0, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", padding:"0 16px", zIndex:2,
          }}>
            {LINES.map((line, i) => (
              <div key={i} style={{
                ...lineBase,
                opacity: showLine[i] ? (i===0 ? 0.4 : i===1 ? 0.7 : 1) : 0,
                transform: showLine[i] ? "translateY(0)" : "translateY(12px)",
              }}>
                {line.render()}
              </div>
            ))}
          </div>
        )}

        {/* ── Phase 4+: Ticker at top + globe below ── */}
        {phase >= 4 && (
          <>
            {/* Ticker */}
            <div style={{
              position:"absolute", top:14, left:0, right:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              zIndex:3, padding:"0 12px",
              background:"transparent",
              pointerEvents:"none",
            }}>
              <div style={{
                opacity: tickerVisible ? 1 : 0,
                transform: tickerVisible ? "translateY(0)" : "translateY(6px)",
                transition:"opacity 0.35s ease, transform 0.35s ease",
                background:"transparent",
              }}>
                {LINES[tickerIndex].renderTicker()}
              </div>
            </div>

            {/* Globe + group */}
            <div style={{
              position:"absolute", top:68, left:0, right:0, bottom:0,
              display:"flex", flexDirection:"column", alignItems:"center",
              animation: phase>=5 ? "globeFadeIn 0.8s ease forwards" : "none",
              opacity: phase>=5 ? 1 : 0,
              zIndex:2,
            }}>
              <GlobeWithTags visible={visible && phase>=5} expanded={expanded} setExpanded={setExpanded} themeObj={t}/>

              {/* Neural Ninjas */}
              <NeuralNinjasCard t={t}/>

              {/* Plan a Session card — themed shine border */}
              <div style={{
                width:"calc(100% - 28px)",
                position:"relative",
                marginTop:8,
                borderRadius:12,
                padding:"1.5px",
                background:`radial-gradient(transparent,transparent,${(t.sessionShine||["#4a90d9","#1e5fb5","#88c0ff"]).join(",")},transparent,transparent)`,
                backgroundSize:"300% 300%",
                animation:"shineSpin 4s linear infinite",
                flexShrink:0,
              }}>
                <div style={{
                  borderRadius:11,
                  padding:"11px 14px",
                  background:t.sessionBg||"rgba(8,28,75,0.6)",
                  backdropFilter:"blur(14px)",
                  WebkitBackdropFilter:"blur(14px)",
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                }}>
                  <div>
                    <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:12,fontWeight:700,color:t.sessionTitle||"rgba(255,255,255,0.9)"}}>
                      Plan a Session
                    </div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:t.sessionSub||"rgba(180,210,240,0.55)",marginTop:2}}>
                      Schedule with Neural Ninjas
                    </div>
                  </div>
                  <div style={{
                    width:28, height:28, borderRadius:"50%",
                    background:t.sessionArrowBg||"rgba(255,255,255,0.1)",
                    border:`0.5px solid ${t.sessionArrowBorder||"rgba(255,255,255,0.2)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.sessionArrowColor||"rgba(255,255,255,0.8)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Card number */}
        <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center",zIndex:4,pointerEvents:"none"}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.14em",color:t.subColor||"rgba(180,210,240,0.35)"}}>AF05 0000 0005 5301</span>
        </div>
      </div>
    </>
  );
}