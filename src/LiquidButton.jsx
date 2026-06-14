import { useState, useEffect } from "react";

function GlassFilter() {
  return (
    <svg style={{display:"none",position:"absolute"}}>
      <defs>
        <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence"/>
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise"/>
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="40" xChannelSelector="R" yChannelSelector="B" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur"/>
          <feComposite in="finalBlur" in2="finalBlur" operator="over"/>
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidButton({ children, onClick, style, className }) {
  const [pressed, setPressed]   = useState(false);
  const [hovered, setHovered]   = useState(false);
  const [isTouch, setIsTouch]   = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <>
      <GlassFilter/>
      <button
        onClick={onClick}
        onMouseDown={()=>setPressed(true)}
        onMouseUp={()=>setPressed(false)}
        onMouseEnter={()=>{ if(!isTouch) setHovered(true); }}
        onMouseLeave={()=>{ setPressed(false); setHovered(false); }}
        onTouchStart={()=>setPressed(true)}
        onTouchEnd={()=>setPressed(false)}
        onTouchCancel={()=>setPressed(false)}
        style={{
          position:"relative",
          display:"inline-flex",
          alignItems:"center",
          justifyContent:"center",
          cursor:"pointer",
          borderRadius:9999,
          border:"none",
          background:"transparent",
          padding:0,
          transform: pressed ? "translateY(1.5px) scale(0.98)" : "translateY(0) scale(1)",
          transition:"all 250ms cubic-bezier(0.1,0.4,0.2,1)",
          ...style,
        }}
      >
        {/* Glass shell with inset shadows from reference */}
        <div style={{
          position:"absolute",inset:0,borderRadius:9999,
          boxShadow:`
            0 0 6px rgba(0,0,0,0.03),
            0 2px 6px rgba(0,0,0,0.10),
            inset 3px 3px 0.5px -3px rgba(255,255,255,0.8),
            inset -3px -3px 0.5px -3px rgba(255,255,255,0.6),
            inset 1px 1px 1px -0.5px rgba(255,255,255,0.55),
            inset -1px -1px 1px -0.5px rgba(255,255,255,0.45),
            inset 0 0 6px 6px rgba(255,255,255,0.10),
            inset 0 0 2px 2px rgba(255,255,255,0.06),
            0 0 12px rgba(255,255,255,0.12)
          `,
          filter: hovered && !pressed && !isTouch ? "brightness(1.08)" : "none",
          transition:"all 250ms cubic-bezier(0.1,0.4,0.2,1)",
        }}/>

        {/* Backdrop blur glass layer */}
        <div style={{
          position:"absolute",inset:0,borderRadius:9999,
          backdropFilter:"blur(12px) saturate(160%)",
          WebkitBackdropFilter:"blur(12px) saturate(160%)",
          background:"linear-gradient(135deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.06) 100%)",
          border:"0.5px solid rgba(255,255,255,0.28)",
          overflow:"hidden",
        }}/>

        {/* Shine on press */}
        {pressed && (
          <div style={{position:"absolute",inset:0,borderRadius:9999,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",pointerEvents:"none",zIndex:20}}/>
        )}

        {/* Top glow on hover */}
        {hovered && !pressed && !isTouch && (
          <div style={{position:"absolute",inset:0,borderRadius:9999,background:"linear-gradient(to bottom,rgba(255,255,255,0.08),transparent)",pointerEvents:"none",zIndex:20}}/>
        )}

        {/* Content */}
        <div style={{position:"relative",zIndex:10,pointerEvents:"none"}}>
          {children}
        </div>
      </button>
    </>
  );
}

export default LiquidButton;