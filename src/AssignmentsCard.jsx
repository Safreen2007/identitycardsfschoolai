import { useState, useEffect, useRef } from "react";

const ASSIGNMENTS = [
  { id:1, name:"Calculus II Paper",   course:"MATH 201", due:"Today",     urgent:true  },
  { id:2, name:"Data Structures Lab", course:"CS 301",   due:"Tomorrow",  urgent:false },
  { id:3, name:"Physics Problem Set", course:"PHYS 110", due:"Friday",    urgent:false },
  { id:4, name:"Micro Essay",         course:"ECON 210", due:"Next Week", urgent:false },
];

// ── Upload Assignment Button ──────────────────────────────────────────────────
function UploadAssignmentButton({ t }) {
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showAssignPicker, setShowAssignPicker] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setTimeout(() => setShowAssignPicker(true), 400);
  };
  const handleScan = () => { fileRef.current.setAttribute("capture","environment"); fileRef.current.setAttribute("accept","image/*"); fileRef.current.click(); };
  const handleUpload = () => { fileRef.current.removeAttribute("capture"); fileRef.current.setAttribute("accept",".png,.jpg,.jpeg,.docx,.pdf"); fileRef.current.click(); };
  const reset = () => { setUploadedFile(null); setShowAssignPicker(false); setSelectedAssignment(null); setShowModal(false); };
  const fileIcon = (name) => { if(!name) return "📄"; const ext=name.split(".").pop().toLowerCase(); if(ext==="pdf") return "📕"; if(ext==="docx") return "📝"; return "🖼️"; };

  const modalBg = t.modalBg || "rgba(5,15,50,0.9)";
  const modalText = t.modalText || "white";
  const modalSub = t.modalSub || "rgba(180,210,240,0.55)";

  return (
    <>
      <div style={{position:"absolute",bottom:28,left:18,right:18,zIndex:5}}>
        <button onClick={()=>setShowModal(true)} style={{
          width:"100%",padding:"13px 0",borderRadius:14,
          background:t.uploadBtnBg||"rgba(255,255,255,0.15)",
          backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
          border:`0.5px solid ${t.uploadBtnBorder||"rgba(255,255,255,0.3)"}`,
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:700,
          color:t.uploadBtnText||"white",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.uploadBtnText||"white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Assignment
        </button>
      </div>
      <input ref={fileRef} type="file" onChange={handleFile} style={{display:"none"}}/>
      {showModal && (
        <div style={{position:"absolute",inset:0,zIndex:20,background:modalBg,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:26,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px"}}>
          <button onClick={reset} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.1)",border:"0.5px solid rgba(255,255,255,0.2)",borderRadius:"50%",width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:modalText,fontSize:14}}>✕</button>
          {!uploadedFile ? (
            <>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:700,color:modalText,marginBottom:4,textAlign:"center"}}>Upload Assignment</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:modalSub,marginBottom:20,textAlign:"center"}}>Accepted: PNG · JPG · DOCX · PDF</div>
              <div style={{width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                <button onClick={handleScan} style={{padding:"18px 10px",borderRadius:14,background:"rgba(255,255,255,0.08)",border:"0.5px solid rgba(255,255,255,0.2)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <div><div style={{fontSize:12,fontWeight:700,color:modalText,marginBottom:2}}>Scan</div><div style={{fontSize:9,color:modalSub,fontFamily:"'Inter',sans-serif"}}>Use camera</div></div>
                </button>
                <button onClick={handleUpload} style={{padding:"18px 10px",borderRadius:14,background:`${t.shineColors?.[0]}22`||"rgba(255,255,255,0.1)",border:`0.5px solid ${t.shineColors?.[0]}55`||"0.5px solid rgba(255,255,255,0.2)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={t.shineColors?.[0]||"rgba(255,255,255,0.8)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div><div style={{fontSize:12,fontWeight:700,color:t.shineColors?.[0]||"rgba(255,255,255,0.8)",marginBottom:2}}>Upload</div><div style={{fontSize:9,color:modalSub,fontFamily:"'Inter',sans-serif"}}>From device</div></div>
                </button>
              </div>
              <div style={{width:"100%",display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:0.5,background:"rgba(255,255,255,0.1)"}}/>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:modalSub,letterSpacing:"0.06em"}}>OR DRAG & DROP</span>
                <div style={{flex:1,height:0.5,background:"rgba(255,255,255,0.1)"}}/>
              </div>
            </>
          ) : !showAssignPicker ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <div style={{fontSize:32}}>{fileIcon(uploadedFile.name)}</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:600,color:modalText,textAlign:"center"}}>{uploadedFile.name}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,color:modalSub}}>Uploading...</div>
            </div>
          ) : (
            <>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:700,color:modalText,marginBottom:6,textAlign:"center"}}>Attach to Assignment</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,color:modalSub,marginBottom:16,textAlign:"center"}}>{fileIcon(uploadedFile.name)} {uploadedFile.name}</div>
              <div style={{width:"100%",display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                {ASSIGNMENTS.map(a=>(
                  <button key={a.id} onClick={()=>setSelectedAssignment(a.id)} style={{width:"100%",padding:"10px 14px",borderRadius:10,background:selectedAssignment===a.id?`${t.shineColors?.[0]}33`:"rgba(255,255,255,0.08)",border:selectedAssignment===a.id?`0.5px solid ${t.shineColors?.[0]}88`:"0.5px solid rgba(255,255,255,0.15)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.2s"}}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:11,fontWeight:600,color:modalText}}>{a.name}</div>
                      <div style={{fontSize:9,color:modalSub,marginTop:2}}>{a.course} · Due {a.due}</div>
                    </div>
                    {selectedAssignment===a.id && <div style={{width:16,height:16,borderRadius:"50%",background:t.shineColors?.[1]||"#4a90ff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
                  </button>
                ))}
              </div>
              <button disabled={!selectedAssignment} onClick={reset} style={{width:"100%",padding:"11px",borderRadius:12,background:selectedAssignment?`${t.shineColors?.[1]}55`:"rgba(255,255,255,0.06)",border:selectedAssignment?`0.5px solid ${t.shineColors?.[1]}88`:"0.5px solid rgba(255,255,255,0.1)",cursor:selectedAssignment?"pointer":"not-allowed",fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:700,color:selectedAssignment?t.shineColors?.[0]||"white":"rgba(255,255,255,0.3)",transition:"all 0.2s"}}>
                {selectedAssignment ? "Attach & Go to Assignment →" : "Select an Assignment"}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default function AssignmentsCard({ visible, themeObj }) {
  const t = themeObj || {
    bg:"linear-gradient(135deg,#4b8ccd 0%,#a6bfd8 50%,#2a78c6 100%)",
    l1:"#cce4ff",l1e:"#ffffff",l2:"#a8ccf0",l2e:"#ddeeff",l3:"#b8c8e8",l3e:"#e0eeff",
    dots:["#0a1e5e","#3a78c8","#6aaae0","#a0c8e8"],
    dotShadows:["0 0 8px #1a3aae","0 0 6px #3a78c8","0 0 6px #6aaae0","0 0 6px #a0c8e8"],
    badgeBgs:["rgba(10,30,100,0.5)","rgba(58,120,200,0.2)","rgba(106,170,224,0.15)","rgba(160,200,232,0.12)"],
    badgeColors:["#88b8ff","#88c0ff","#a8d4f8","#c0daf5"],
    badgeBorders:["rgba(100,150,255,0.3)","rgba(88,160,255,0.3)","rgba(140,190,240,0.3)","rgba(180,215,245,0.25)"],
    dueBg:"rgba(8,28,75,0.55)",cardBg:"rgba(255,255,255,0.1)",
    titleColor:"rgba(255,255,255,0.95)",courseColor:"rgba(180,210,240,0.55)",
    uploadBtnBg:"rgba(255,255,255,0.15)",uploadBtnBorder:"rgba(255,255,255,0.3)",uploadBtnText:"white",
    modalBg:"rgba(5,15,50,0.9)",modalText:"white",modalSub:"rgba(180,210,240,0.55)",
    shineColors:["#4a90d9","#1e5fb5","#88c0ff"],
  };

  const [phase, setPhase] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!visible) { setPhase(0); setIsExpanded(false); return; }
    const t1=setTimeout(()=>setPhase(1),400);
    const t2=setTimeout(()=>setPhase(2),1300);
    const t3=setTimeout(()=>setPhase(3),2200);
    const t4=setTimeout(()=>setPhase(4),3100);
    return()=>[t1,t2,t3,t4].forEach(clearTimeout);
  },[visible]);

  const movedUp = phase >= 4;
  const lineBase = {
    fontFamily:"'Space Grotesk','Inter',sans-serif",
    fontWeight:800,textAlign:"center",whiteSpace:"nowrap",
    letterSpacing:"0.01em",lineHeight:1.4,
    transition:"opacity 0.65s ease, transform 0.65s ease",
  };
  const collapsed=[0,12,22,30];
  const expanded=[0,82,164,246];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=IBM+Plex+Mono:wght@400&display=swap');
        @keyframes shineSpin{0%{background-position:0% 0%}50%{background-position:100% 100%}100%{background-position:0% 0%}}
        @keyframes cardFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .ac-card{transition:top 0.9s cubic-bezier(0.075,0.82,0.165,1);}
        .ac-card-0{animation:cardFadeUp 0.5s ease forwards 0.0s;}
        .ac-card-1{animation:cardFadeUp 0.5s ease forwards 0.12s;}
        .ac-card-2{animation:cardFadeUp 0.5s ease forwards 0.24s;}
        .ac-card-3{animation:cardFadeUp 0.5s ease forwards 0.36s;}
      `}</style>

      <div style={{width:320,height:500,borderRadius:26,background:t.bg,position:"relative",overflow:"hidden",flexShrink:0,boxSizing:"border-box"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 55%)",pointerEvents:"none",zIndex:0}}/>

        {/* Sentences */}
        <div style={{
          position:"absolute",left:18,right:18,
          top:movedUp?18:"50%",
          transform:movedUp?"translateY(0)":"translateY(-50%)",
          transition:"top 0.8s cubic-bezier(0.23,1,0.32,1),transform 0.8s cubic-bezier(0.23,1,0.32,1)",
          textAlign:"center",zIndex:2,
        }}>
          <div style={{...lineBase,fontSize:20,opacity:phase>=1?1:0,transform:phase>=1?"translateY(0)":"translateY(10px)"}}>
            <span style={{color:t.l1}}>You have </span><span style={{color:t.l1e}}>3 assignments</span><span style={{color:t.l1}}> due</span>
          </div>
          <div style={{...lineBase,fontSize:17,opacity:phase>=2?1:0,transform:phase>=2?"translateY(0)":"translateY(10px)"}}>
            <span style={{color:t.l2}}>Your </span><span style={{color:t.l2e}}>12 assignments</span><span style={{color:t.l2}}> are over</span>
          </div>
          <div style={{...lineBase,fontSize:14,opacity:phase>=3?1:0,transform:phase>=3?"translateY(0)":"translateY(10px)"}}>
            <span style={{color:t.l3}}>You submitted </span><span style={{color:t.l3e}}>1</span><span style={{color:t.l3}}> late</span>
          </div>
        </div>

        {/* Stacked cards */}
        {phase>=4 && (
          <div onClick={()=>setIsExpanded(e=>!e)} style={{position:"absolute",top:120,left:18,right:18,cursor:"pointer",zIndex:3,height:330}}>
            {ASSIGNMENTS.map((a,i)=>{
              const top=isExpanded?expanded[i]:collapsed[i];
              const hiddenBehind = !isExpanded && i > 0;
              return (
                <div key={a.id}
                  className={`ac-card ac-card-${i}`}
                  style={{
                    position:"absolute",left:0,right:0,top,
                    height:70,borderRadius:13,padding:"11px 13px",
                    display:"flex",alignItems:"center",gap:10,
                    background:a.urgent?t.dueBg:t.cardBg,
                    backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                    border:a.urgent
                      ? `1.5px solid ${(t.shineColors&&t.shineColors[0])||"rgba(255,255,255,0.85)"}`
                      : "0.5px solid rgba(255,255,255,0.18)",
                    boxShadow:"0 4px 16px rgba(0,0,0,0.12)",
                    zIndex:ASSIGNMENTS.length-i,
                    opacity: hiddenBehind ? 0 : undefined,
                    pointerEvents: hiddenBehind ? "none" : "auto",
                    transition:"opacity 0.3s ease, top 0.9s cubic-bezier(0.075,0.82,0.165,1)",
                    boxSizing:"border-box",
                  }}>
                  <div style={{width:9,height:9,borderRadius:"50%",flexShrink:0,background:t.dots[i],boxShadow:t.dotShadows[i]}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:t.titleColor,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name}</div>
                    <div style={{fontSize:9,color:t.courseColor}}>{a.course}</div>
                  </div>
                  <div style={{fontSize:9,fontWeight:700,marginLeft:"auto",flexShrink:0,padding:"2px 9px",borderRadius:8,background:t.badgeBgs[i],color:t.badgeColors[i],border:`0.5px solid ${t.badgeBorders[i]}`}}>{a.due}</div>
                </div>
              );
            })}
            <div style={{position:"absolute",bottom:-22,left:0,right:0,textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Inter',sans-serif"}}>
              {isExpanded?"Tap to collapse":"Tap to expand"}
            </div>
          </div>
        )}

        {phase>=4 && !isExpanded && <UploadAssignmentButton t={t}/>}

        <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center",zIndex:4,pointerEvents:"none"}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.14em",color:t.badgeColors?.[3]||"rgba(180,210,240,0.35)"}}>AF05 0000 0005 5301</span>
        </div>
      </div>
    </>
  );
}