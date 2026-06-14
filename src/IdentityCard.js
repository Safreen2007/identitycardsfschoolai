import { useState, useRef } from "react";
import { LiquidButton } from "./LiquidButton";

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconTrophy({ size=15, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>;
}
function IconTarget({ size=15, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
function IconCalendar({ size=15, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function IconGradCap({ size=15, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
}
function IconChip({ size=15, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M16 3v2M8 3v2M16 19v2M8 19v2M3 8h2M3 16h2M19 8h2M19 16h2"/></svg>;
}
function IconClock({ size=15, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconUniversity({ size=13, color="#5580aa" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

export default function IdentityCard({ theme="blue", themeObj }) {
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef(null);
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  // Use passed themeObj or fall back to blue defaults
  const t = themeObj || {
    bg: "linear-gradient(135deg,#88b5e1 0%,#d4fffc 50%,#acd6ff 100%)",
    nameGradient: "linear-gradient(135deg,#5580aa 0%,#7ab8d8 50%,#5580aa 100%)",
    ic: "#5580aa", label: "#5580aa", value: "#7a9cbd",
    cardNum: "rgba(90,130,170,0.5)",
    freePlanText: "#2d5a8a",
    freePlanBg: "rgba(255,255,255,0.15)",
    freePlanBorder: "rgba(255,255,255,0.3)",
  };

  const IC = t.ic;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700;800&family=Anton&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        .id-photo-wrap:hover .id-photo-hover { opacity: 1 !important; }
      `}</style>

      <div style={{
        width:320, height:500, borderRadius:26,
        background: t.bg,
        padding:"20px 18px 16px",
        display:"flex", flexDirection:"column", alignItems:"center",
        position:"relative", overflow:"hidden",
        fontFamily:"'Inter',sans-serif",
        boxSizing:"border-box", flexShrink:0,
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)",pointerEvents:"none",zIndex:0}}/>

        {/* Photo */}
        <div className="id-photo-wrap" onClick={()=>fileRef.current.click()}
          style={{width:120,height:120,borderRadius:16,background:"white",boxShadow:"8px 8px 10px rgba(0,0,0,0.25)",cursor:"pointer",position:"relative",overflow:"hidden",marginBottom:10,flexShrink:0,zIndex:1}}>
          {photo
            ? <img src={photo} alt="User" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            : <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,background:"rgba(255,255,255,0.85)"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={t.ic} stroke="none" opacity="0.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div style={{fontSize:9,color:t.ic,fontWeight:500,opacity:0.6}}>Tap to upload</div>
              </div>
          }
          <div className="id-photo-hover" style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,opacity:0,transition:"opacity 0.2s ease"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span style={{fontSize:9,color:"white",fontWeight:600}}>Change</span>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>

        {/* Name */}
        <div style={{position:"relative",marginBottom:6,zIndex:1,flexShrink:0,width:"100%",textAlign:"center"}}>
          <span style={{fontFamily:"'Open Sans',sans-serif",fontSize:32,fontWeight:700,letterSpacing:"-0.02em",
            background:t.nameGradient,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",display:"inline-block"}}>
            Alex Chen
          </span>
        </div>

        {/* University */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,zIndex:1,width:"100%",justifyContent:"center"}}>
          <IconUniversity size={13} color={IC}/>
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:400,color:t.value}}>Massachusetts Institute of Technology</span>
        </div>

        {/* Stats */}
        <div style={{width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:8,zIndex:1}}>
          {[
            {icon:<IconTrophy size={14} color={IC}/>, label:"RANK",  value:"#1089"},
            {icon:<IconTarget size={14} color={IC}/>,  label:"GPA",   value:"3.8"},
            {icon:<IconCalendar size={14} color={IC}/>,label:"BATCH", value:"2027"},
          ].map(s=>(
            <div key={s.label} style={{textAlign:"center",padding:"5px 4px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3,marginBottom:3}}>
                {s.icon}
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:17.5,color:t.label,letterSpacing:"0.08em"}}>{s.label}</span>
              </div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:11.5,fontWeight:600,color:t.value}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Degree */}
        <div style={{width:"100%",padding:"5px 2px",marginBottom:6,display:"flex",alignItems:"center",gap:10,zIndex:1}}>
          <IconGradCap color={IC}/>
          <div>
            <div style={{fontFamily:"'Anton',sans-serif",fontSize:9,color:t.label,letterSpacing:"0.1em",marginBottom:2}}>DEGREE</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:500,color:t.value}}>Computer Science</div>
          </div>
        </div>

        {/* AI Credits */}
        <div style={{width:"100%",padding:"5px 2px",marginBottom:6,display:"flex",alignItems:"center",gap:10,zIndex:1}}>
          <IconChip color={IC}/>
          <div>
            <div style={{fontFamily:"'Anton',sans-serif",fontSize:9,color:t.label,letterSpacing:"0.08em",marginBottom:2}}>AI Credits/Cr</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11.9,fontWeight:400,color:t.value,opacity:0.75}}>72000/100000 Cr</div>
          </div>
        </div>

        {/* Expiry */}
        <div style={{width:"100%",padding:"5px 2px",marginBottom:10,display:"flex",alignItems:"center",gap:10,zIndex:1}}>
          <IconClock color={IC}/>
          <div>
            <div style={{fontFamily:"'Anton',sans-serif",fontSize:9,color:t.label,letterSpacing:"0.08em",marginBottom:2}}>expiry date</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11.9,fontWeight:400,color:t.value,opacity:0.75}}>EXP 06/28</div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:1,marginTop:"auto"}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.12em",color:t.cardNum,textAlign:"center",width:"100%",display:"block"}}>
            AF05 0000 0005 5301
          </span>
          <div style={{width:"100%",display:"flex",justifyContent:"flex-end"}}>
            <LiquidButton>
              <span style={{fontFamily:"Arial,sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.02em",
                color:t.freePlanText,display:"inline-block",padding:"4px 10px"}}>
                Free plan
              </span>
            </LiquidButton>
          </div>
        </div>
      </div>
    </>
  );
}