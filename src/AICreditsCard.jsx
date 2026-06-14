import { useState, useEffect } from "react";

const WEEKLY_DATA = [
  { day:"Mon", credits:8200  },
  { day:"Tue", credits:12400 },
  { day:"Wed", credits:6800  },
  { day:"Thu", credits:15200 },
  { day:"Fri", credits:11000 },
  { day:"Sat", credits:9600  },
  { day:"Sun", credits:8800  },
];
const MAX_CREDITS = Math.max(...WEEKLY_DATA.map(d => d.credits));
const TOTAL     = 100000;
const REMAINING = 72000;
const USED      = TOTAL - REMAINING;

const PREMIUM_FEATURES = [
  { icon: <IconBolt size={12}/>,     label:"500,000 AI Credits / month"  },
  { icon: <IconRocket size={12}/>,   label:"Priority AI Processing"       },
  { icon: <IconChart size={12}/>,    label:"Advanced Study Analytics"     },
  { icon: <IconUsers size={12}/>,    label:"Unlimited Study Groups"       },
  { icon: <IconTarget size={12}/>,   label:"Personalized Learning Path"   },
  { icon: <IconShield size={12}/>,   label:"Ad-free Experience"           },
];

// ── Icons (SVG only, no emojis) ──────────────────────────────────────────────
function IconCrown({ size=20, color="#3d2000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M2 20h20v2H2zM3 9l4 4 5-8 5 8 4-4-2 9H5L3 9z"/>
    </svg>
  );
}
function IconBolt({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function IconRocket({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l-.55-.55"/>
      <path d="M12 8L4 12l4 4 8-4-4-4z"/>
      <path d="M15 4l-3 3"/>
      <path d="M19 8l-3 3"/>
      <path d="M20 4l-8 8"/>
    </svg>
  );
}
function IconChart({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function IconUsers({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function IconTarget({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function IconShield({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function IconLock({ size=14, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}
function IconCard({ size=16, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}
function IconStar({ size=32, color="#F7D774" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IconBack({ size=12, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}

// ── Bar Graph ─────────────────────────────────────────────────────────────────
function WeeklyGraph({ animate, t }) {
  const [tooltip, setTooltip] = useState(null);
  return (
    <div style={{ width:"100%", position:"relative" }}>
      <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:70, marginBottom:4 }}>
        {WEEKLY_DATA.map((d, i) => {
          const pct = d.credits / MAX_CREDITS;
          const isToday = i === 3;
          return (
            <div key={d.day}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%", cursor:"pointer" }}
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
              onTouchStart={() => setTooltip(i)}
              onTouchEnd={() => setTimeout(() => setTooltip(null), 1500)}
            >
              <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end", position:"relative" }}>
                {tooltip === i && (
                  <div style={{
                    position:"absolute", bottom:"calc(100% + 4px)", left:"50%",
                    transform:"translateX(-50%)",
                    background:t.tooltipBg||"rgba(5,15,50,0.92)",
                    border:"0.5px solid rgba(255,255,255,0.15)",
                    borderRadius:6, padding:"3px 7px",
                    fontFamily:"'IBM Plex Mono',monospace",
                    fontSize:8, color:"white", whiteSpace:"nowrap", zIndex:10,
                  }}>
                    {d.credits.toLocaleString()} Cr
                  </div>
                )}
                <div style={{
                  width:"100%",
                  height: animate ? `${pct * 100}%` : "0%",
                  borderRadius:"4px 4px 2px 2px",
                  background: isToday ? t.barHighlight
                    : tooltip === i ? "rgba(255,255,255,0.45)"
                    : t.barDefault,
                  transition: `height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s, background 0.2s`,
                  minHeight:3,
                }}/>
              </div>
              <div style={{
                fontFamily:"'Inter',sans-serif", fontSize:8,
                color: isToday ? t.graphLabel : t.graphSublabel||"rgba(180,210,240,0.4)",
                fontWeight: isToday ? 700 : 400,
              }}>{d.day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Payment Page ──────────────────────────────────────────────────────────────
function PaymentPage({ onBack, t }) {
  const [cardNum, setCardNum] = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvv,     setCvv]     = useState("");
  const [name,    setName]    = useState("");
  const [success, setSuccess] = useState(false);

  const formatCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExp  = (v) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };
  const canSubmit  = cardNum.replace(/\s/g,"").length===16 && expiry.length===5 && cvv.length===3 && name.length>1;

  const inputStyle = {
    width:"100%", padding:"10px 12px", borderRadius:10,
    background:t.paymentInput||"rgba(255,255,255,0.08)",
    border:`0.5px solid ${t.paymentInputBorder||"rgba(255,255,255,0.18)"}`,
    color:t.paymentText||"white",
    fontFamily:"'IBM Plex Mono',monospace", fontSize:11,
    outline:"none", boxSizing:"border-box", marginBottom:8,
  };
  const labelStyle = {
    fontFamily:"'Inter',sans-serif", fontSize:8.5,
    color:t.paymentLabel||"rgba(180,210,240,0.5)",
    letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3, display:"block",
  };

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:10, borderRadius:26,
      background:t.paymentBg||"linear-gradient(135deg,#0f3d6b 0%,#61a9cd 50%,#12487d 100%)",
      padding:"18px 16px", display:"flex", flexDirection:"column",
      overflowY:"auto", boxSizing:"border-box",
    }}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)",pointerEvents:"none",borderRadius:26}}/>

      <button onClick={onBack} style={{
        alignSelf:"flex-start", background:"rgba(255,255,255,0.1)",
        border:"0.5px solid rgba(255,255,255,0.2)", borderRadius:8,
        padding:"5px 12px", cursor:"pointer", color:"rgba(255,255,255,0.7)",
        fontFamily:"'Inter',sans-serif", fontSize:11, marginBottom:12,
        display:"flex", alignItems:"center", gap:6, zIndex:1, position:"relative",
      }}>
        <IconBack/> Back
      </button>

      {success ? (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,position:"relative",zIndex:1}}>
          <IconStar size={44} color="#F7D774"/>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700,color:"#F7D774",textAlign:"center"}}>Welcome to Premium!</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:t.subColor||"rgba(180,210,240,0.7)",textAlign:"center"}}>Your 500,000 credits are ready.</div>
          <button onClick={onBack} style={{marginTop:8,padding:"10px 24px",borderRadius:10,background:"rgba(247,215,116,0.2)",border:"0.5px solid rgba(247,215,116,0.4)",color:"#F7D774",fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div style={{position:"relative",zIndex:1}}>
          {/* Plan summary */}
          <div style={{
            background:"linear-gradient(135deg,#F7D774 0%,#C8860A 55%,#F0C040 100%)",
            borderRadius:12, padding:"12px 14px", marginBottom:12,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <IconCrown size={14} color="#3d2000"/>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:800,color:"#3d2000"}}>Premium Plan</span>
              </div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:"rgba(61,32,0,0.6)"}}>Billed monthly · Cancel anytime</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800,color:"#3d2000"}}>$9.99</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:"rgba(61,32,0,0.55)"}}>/month</div>
            </div>
          </div>

          {/* Features */}
          <div style={{marginBottom:12}}>
            {PREMIUM_FEATURES.map((f,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <div style={{color:"rgba(200,225,255,0.7)",flexShrink:0}}>{f.icon}</div>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:"rgba(200,225,255,0.8)"}}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{height:0.5,background:"rgba(255,255,255,0.1)",marginBottom:12}}/>

          {/* Payment form */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <IconCard size={14} color={t.subColor||"rgba(180,210,240,0.7)"}/>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:700,color:"white"}}>Payment Details</span>
          </div>

          <label style={labelStyle}>Cardholder Name</label>
          <input style={inputStyle} placeholder="Alex Chen" value={name} onChange={e=>setName(e.target.value)}/>

          <label style={labelStyle}>Card Number</label>
          <input style={inputStyle} placeholder="0000 0000 0000 0000" value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))}/>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <label style={labelStyle}>Expiry</label>
              <input style={{...inputStyle,marginBottom:0}} placeholder="MM/YY" value={expiry} onChange={e=>setExpiry(formatExp(e.target.value))}/>
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input style={{...inputStyle,marginBottom:0}} placeholder="•••" type="password" maxLength={3} value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,3))}/>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:10}}>
            <IconLock size={10} color={t.paymentLabel||"rgba(180,210,240,0.35)"}/>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:t.paymentLabel||"rgba(180,210,240,0.35)"}}>Secured with 256-bit SSL encryption</span>
          </div>

          <button onClick={() => canSubmit && setSuccess(true)} style={{
            width:"100%", padding:"13px",
            borderRadius:12,
            background: canSubmit ? "linear-gradient(135deg,#F7D774 0%,#C8860A 100%)" : "rgba(255,255,255,0.08)",
            border:"none", cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:12, fontWeight:800,
            color: canSubmit ? "#3d2000" : "rgba(255,255,255,0.25)",
            transition:"all 0.2s",
          }}>
            {canSubmit ? "Confirm & Subscribe — $9.99/mo" : "Fill in your details"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main AICreditsCard ────────────────────────────────────────────────────────
export default function AICreditsCard({ visible, themeObj }) {
  const t = themeObj || {
    bg:"linear-gradient(135deg,#0f3d6b 0%,#61a9cd 50%,#12487d 100%)",
    titleColor:"rgba(255,255,255,0.9)",subColor:"rgba(180,210,240,0.55)",
    valueColor:"white",subValueColor:"rgba(180,210,240,0.6)",
    barBg:"rgba(255,255,255,0.12)",barFill:"linear-gradient(90deg,#88c8ff,#4a90d9)",
    barHighlight:"linear-gradient(180deg,#88c8ff,#4a90d9)",barDefault:"rgba(255,255,255,0.22)",
    barLabelColor:"rgba(180,210,240,0.5)",graphLabel:"rgba(180,210,240,0.5)",
    graphSublabel:"rgba(180,210,240,0.35)",tooltipBg:"rgba(5,15,50,0.92)",tooltipColor:"white",
    freePlanText:"rgba(255,255,255,0.8)",
  };
  const [animateBars, setAnimateBars] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const pct = (USED / TOTAL) * 100;

  useEffect(() => {
    if (!visible) { setAnimateBars(false); return; }
    const t = setTimeout(() => setAnimateBars(true), 400);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
      `}</style>

      <div style={{
        width:320, height:500, borderRadius:26,
        background: t.bg,
        position:"relative", overflow:"hidden",
        flexShrink:0, boxSizing:"border-box",
        padding:"20px 18px 18px",
        display:"flex", flexDirection:"column", gap:10,
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)",pointerEvents:"none",zIndex:0}}/>

        {showPayment && <PaymentPage onBack={() => setShowPayment(false)} t={t}/>}

        {/* ── Header ── */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:1}}>
          <div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:700,color:t.titleColor}}>AI Credits</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:t.subColor,marginTop:1}}>Current cycle</div>
          </div>
          <div style={{borderRadius:20,padding:"1px",background:"linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08))",boxShadow:"inset 1px 1px 1px -0.5px rgba(255,255,255,0.5)"}}>
            <div style={{borderRadius:19,padding:"3px 12px",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",background:"rgba(255,255,255,0.1)",border:"0.5px solid rgba(255,255,255,0.22)"}}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:10,fontWeight:700,color:t.freePlanText}}>Free Plan</span>
            </div>
          </div>
        </div>

        {/* ── Credits remaining ── */}
        <div style={{zIndex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:28,fontWeight:800,color:t.valueColor}}>72,000</span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:t.subValueColor}}>/ 100,000 Cr remaining</span>
          </div>
          <div style={{width:"100%",height:6,background:t.barBg,borderRadius:3,marginTop:8,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:3,width:animateBars?`${pct}%`:"0%",background:t.barFill,transition:"width 1s cubic-bezier(0.34,1.2,0.64,1) 0.2s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:t.barLabelColor}}>Used: {pct.toFixed(0)}%</span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:t.barLabelColor}}>Used: 28,000 Cr</span>
          </div>
        </div>

        {/* ── Weekly graph ── */}
        <div style={{zIndex:1}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:t.graphLabel,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>This Week · tap a bar</div>
          <WeeklyGraph animate={animateBars} t={t}/>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:t.graphSublabel,textAlign:"center"}}>Credits used per day</div>
        </div>

        <div style={{height:0.5,background:"rgba(255,255,255,0.1)",zIndex:1}}/>

        {/* ── Premium card ── */}
        <div onClick={() => setShowPayment(true)} style={{
          zIndex:1, cursor:"pointer",
          background:"linear-gradient(135deg,#F7D774 0%,#C8860A 55%,#F0C040 100%)",
          borderRadius:16, padding:"13px 14px",
          position:"relative", overflow:"hidden",
          animation: visible ? "fadeSlideUp 0.6s ease forwards 0.5s" : "none",
          opacity:0,
        }}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)",pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <IconCrown size={16} color="#3d2000"/>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:800,color:"#3d2000"}}>Premium Plan</span>
              </div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:"rgba(61,32,0,0.6)"}}>500,000 credits + all features</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:800,color:"#3d2000"}}>$9.99</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:8,color:"rgba(61,32,0,0.55)"}}>/month</div>
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
            {[
              {icon:<IconBolt size={8} color="rgba(61,32,0,0.7)"/>, label:"Priority AI"},
              {icon:<IconChart size={8} color="rgba(61,32,0,0.7)"/>, label:"Analytics"},
              {icon:<IconUsers size={8} color="rgba(61,32,0,0.7)"/>, label:"Unlimited Groups"},
              {icon:<IconShield size={8} color="rgba(61,32,0,0.7)"/>, label:"Ad-free"},
            ].map((f,i) => (
              <div key={i} style={{background:"rgba(61,32,0,0.12)",borderRadius:6,padding:"3px 7px",fontFamily:"'Inter',sans-serif",fontSize:8,color:"rgba(61,32,0,0.75)",display:"flex",alignItems:"center",gap:4}}>
                {f.icon}{f.label}
              </div>
            ))}
          </div>
          <div style={{width:"100%",padding:"7px",borderRadius:9,background:"rgba(61,32,0,0.18)",border:"0.5px solid rgba(61,32,0,0.22)",textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",fontSize:11,fontWeight:700,color:"#3d2000"}}>
            Upgrade to Premium →
          </div>
        </div>

        <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center",zIndex:1,pointerEvents:"none"}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.14em",color:t.subColor||"rgba(180,210,240,0.3)"}}>AF05 0000 0005 5301</span>
        </div>
      </div>
    </>
  );
}