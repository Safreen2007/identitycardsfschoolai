import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import IdentityCard from "./IdentityCard";
import AssignmentsCard from "./AssignmentsCard";
import LeaderboardCard from "./LeaderboardCard";
import AICreditsCard from "./AICreditsCard";

import whiteCard  from "./cards/white.png";
import purpleCard from "./cards/purple.png";
import pinkCard   from "./cards/pink.png";
import blueCard   from "./cards/blue.png";
import greenCard  from "./cards/green.png";

// ── Card colorways ─────────────────────────────────────────────────────────
const CARDS = [
  { key:"white",  name:"Royal Pop White",  img:whiteCard,  numCol:"rgba(40,35,30,0.45)",  amb:"#b0a898", ring:"rgba(80,70,60,0.55)",   shimmer:"rgba(255,255,255,0.52)", shadowColor:"rgba(160,150,140,0.35)", accent:"#5c4f3d", shineColor:["#87b9eb","#346596","#d8e2ec"] },
  { key:"purple", name:"Royal Pop Purple", img:purpleCard, numCol:"rgba(60,30,110,0.5)",  amb:"#8860c8", ring:"rgba(130,80,210,0.65)", shimmer:"rgba(210,190,255,0.4)",  shadowColor:"rgba(100,60,200,0.3)",  accent:"#7848d0", shineColor:["#e8c0f8","#9040c0","#f0d8fc"] },
  { key:"pink",   name:"Royal Pop Pink",   img:pinkCard,   numCol:"rgba(160,40,80,0.48)", amb:"#d05070", ring:"rgba(220,70,100,0.65)", shimmer:"rgba(255,200,220,0.4)",  shadowColor:"rgba(200,80,120,0.3)",  accent:"#d84878", shineColor:["#f7c5cf","#d45c7a","#fce4ea"] },
  { key:"blue",   name:"Royal Pop Blue",   img:blueCard,   numCol:"rgba(10,55,130,0.48)", amb:"#2068c8", ring:"rgba(30,90,210,0.65)",  shimmer:"rgba(180,215,255,0.4)",  shadowColor:"rgba(30,100,220,0.3)",  accent:"#1868d0", shineColor:["#87b9eb","#346596","#d8e2ec"] },
  { key:"green",  name:"Royal Pop Green",  img:greenCard,  numCol:"rgba(10,70,30,0.48)",  amb:"#22a050", ring:"rgba(25,130,65,0.65)",  shimmer:"rgba(180,240,200,0.4)",  shadowColor:"rgba(20,140,70,0.3)",   accent:"#189848", shineColor:["#b8f0a0","#4a8830","#d8f5c8"] },
];

// ── Dashboard themes per card colorway ───────────────────────────────────────
const DASH_THEMES = {
  blue: [
    { id:"identity",    label:"Identity",    bg:"linear-gradient(135deg,#88b5e1 0%,#d4fffc 50%,#acd6ff 100%)",   font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#d8eeff 50%,#a6cff5 100%)", shineColor:["#87b9eb","#346596","#d8e2ec"] },
    { id:"assignments", label:"Assignments", bg:"linear-gradient(135deg,#4b8ccd 0%,#a6bfd8 50%,#2a78c6 100%)",   font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#e0f0ff 0%,#b8d8ff 50%,#7ab8f5 100%)", shineColor:["#87b9eb","#346596","#d8e2ec"] },
    { id:"leaderboard", label:"Leaderboard", bg:"linear-gradient(135deg,#1568bb 0%,#8cb6b6 50%,#0665c4 100%)",   font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#c8e8e8 50%,#80c0c0 100%)", shineColor:["#87b9eb","#346596","#d8e2ec"] },
    { id:"credits",     label:"AI Credits",  bg:"linear-gradient(135deg,#0f3d6b 0%,#61a9cd 50%,#12487d 100%)",   font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#a0d8f0 0%,#ffffff 50%,#60b8e0 100%)", shineColor:["#87b9eb","#346596","#d8e2ec"] },
    { id:"wallet",      label:"Wallet",      bg:"linear-gradient(135deg,#0f3d6b 0%,#2a6a9a 50%,#12487d 100%)",   font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#d0e8ff 0%,#ffffff 50%,#90c0f0 100%)", shineColor:["#87b9eb","#346596","#d8e2ec"] },
  ],
  white: [
    { id:"identity",    label:"Identity",    bg:"linear-gradient(135deg,#cbc6c6 0%,#ffffff 50%,#cbc6c6 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#d0d0d0 50%,#a8a8a8 100%)", shineColor:["#ffffff","#efefef","#ffffff"] },
    { id:"assignments", label:"Assignments", bg:"linear-gradient(135deg,#ababab 0%,#dddddd 50%,#ababab 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#cccccc 50%,#888888 100%)", shineColor:["#ffffff","#efefef","#ffffff"] },
    { id:"leaderboard", label:"Leaderboard", bg:"linear-gradient(135deg,#767676 0%,#bfbfbf 50%,#767676 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#c0c0c0 50%,#808080 100%)", shineColor:["#ffffff","#efefef","#ffffff"] },
    { id:"credits",     label:"AI Credits",  bg:"linear-gradient(135deg,#646363 0%,#999898 50%,#646363 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#e0e0e0 0%,#ffffff 50%,#b0b0b0 100%)", shineColor:["#ffffff","#efefef","#ffffff"] },
    { id:"wallet",      label:"Wallet",      bg:"linear-gradient(135deg,#272727 0%,#8b8989 50%,#272727 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#d0d0d0 0%,#ffffff 50%,#909090 100%)", shineColor:["#ffffff","#efefef","#ffffff"] },
  ],
  pink: [
    { id:"identity",    label:"Identity",    bg:"linear-gradient(135deg,#efa9b5 0%,#ffffff 50%,#efa9b5 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#fcd6de 50%,#e8869a 100%)", shineColor:["#f7c5cf","#d45c7a","#fce4ea"] },
    { id:"assignments", label:"Assignments", bg:"linear-gradient(135deg,#dc8b99 0%,#f4ead2 50%,#dc8b99 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#f9dde3 50%,#c8607a 100%)", shineColor:["#f7c5cf","#d45c7a","#fce4ea"] },
    { id:"leaderboard", label:"Leaderboard", bg:"linear-gradient(135deg,#ff768f 0%,#f8c4eb 50%,#ff768f 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#fde8f5 50%,#f770a0 100%)", shineColor:["#f7c5cf","#d45c7a","#fce4ea"] },
    { id:"credits",     label:"AI Credits",  bg:"linear-gradient(135deg,#c22a73 0%,#f6a186 50%,#c22a73 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffd6e0 0%,#ffffff 50%,#f5a0c0 100%)", shineColor:["#f7c5cf","#d45c7a","#fce4ea"] },
    { id:"wallet",      label:"Wallet",      bg:"linear-gradient(135deg,#862352 0%,#f686b2 50%,#862352 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffc8de 0%,#ffffff 50%,#e870a8 100%)", shineColor:["#f7c5cf","#d45c7a","#fce4ea"] },
  ],
  green: [
    { id:"identity",    label:"Identity",    bg:"linear-gradient(135deg,#cfffbd 0%,#ffffff 50%,#cfffbd 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#d8f5c8 50%,#9ecc88 100%)", shineColor:["#b8f0a0","#4a8830","#d8f5c8"] },
    { id:"assignments", label:"Assignments", bg:"linear-gradient(135deg,#ace199 0%,#fff9d9 50%,#719b62 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#d0f0b8 50%,#5a8848 100%)", shineColor:["#b8f0a0","#4a8830","#d8f5c8"] },
    { id:"leaderboard", label:"Leaderboard", bg:"linear-gradient(135deg,#739f63 0%,#e6f6c8 50%,#5d8b4d 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#c8e8a8 50%,#4a7838 100%)", shineColor:["#b8f0a0","#4a8830","#d8f5c8"] },
    { id:"credits",     label:"AI Credits",  bg:"linear-gradient(135deg,#335925 0%,#b5d47b 50%,#335d24 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#c8e8a0 0%,#ffffff 50%,#90c060 100%)", shineColor:["#b8f0a0","#4a8830","#d8f5c8"] },
    { id:"wallet",      label:"Wallet",      bg:"linear-gradient(135deg,#28491d 0%,#b3eb4c 50%,#315424 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#b0e880 0%,#ffffff 50%,#78c040 100%)", shineColor:["#b8f0a0","#4a8830","#d8f5c8"] },
  ],
  purple: [
    { id:"identity",    label:"Identity",    bg:"linear-gradient(135deg,#f1c0f4 0%,#ffffff 50%,#f5c4f8 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#ead8f8 50%,#c090e0 100%)", shineColor:["#e8c0f8","#9040c0","#f0d8fc"] },
    { id:"assignments", label:"Assignments", bg:"linear-gradient(135deg,#f39ef8 0%,#f6efd8 50%,#fa9dff 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#e8d0f8 50%,#b060d8 100%)", shineColor:["#e8c0f8","#9040c0","#f0d8fc"] },
    { id:"leaderboard", label:"Leaderboard", bg:"linear-gradient(135deg,#c965cf 0%,#ffc2ea 50%,#c965cf 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#ffffff 0%,#f0c0f8 50%,#a050c0 100%)", shineColor:["#e8c0f8","#9040c0","#f0d8fc"] },
    { id:"credits",     label:"AI Credits",  bg:"linear-gradient(135deg,#904f94 0%,#e47ec1 50%,#904f94 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#e0b8f8 0%,#ffffff 50%,#c080e8 100%)", shineColor:["#e8c0f8","#9040c0","#f0d8fc"] },
    { id:"wallet",      label:"Wallet",      bg:"linear-gradient(135deg,#622a65 0%,#c64ceb 50%,#622a65 100%)", font:"'Open Sans',sans-serif", labelGradient:"linear-gradient(135deg,#d8a0f8 0%,#ffffff 50%,#b060e0 100%)", shineColor:["#e8c0f8","#9040c0","#f0d8fc"] },
  ],
};

// Derive DASH_CARDS from active theme
function getDashCards(cardKey) {
  return DASH_THEMES[cardKey] || DASH_THEMES.blue;
}

// ── Component-level themes (passed as themeObj to each card) ─────────────────
const COMPONENT_THEMES = {
  blue: {
    identity: {
      bg:"linear-gradient(135deg,#88b5e1 0%,#d4fffc 50%,#acd6ff 100%)",
      nameGradient:"linear-gradient(135deg,#5580aa 0%,#7ab8d8 50%,#5580aa 100%)",
      ic:"#5580aa",label:"#5580aa",value:"#7a9cbd",cardNum:"rgba(90,130,170,0.5)",
      freePlanText:"#2d5a8a",freePlanBg:"rgba(255,255,255,0.15)",freePlanBorder:"rgba(255,255,255,0.3)",
    },
    assignments: {
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
    },
    leaderboard: {
      bg:"linear-gradient(135deg,#1568bb 0%,#8ca1b6 50%,#0665c4 100%)",
      l1:"#cce4ff",l1e:"#ffffff",l2:"#a8ccf0",l2e:"#ddeeff",l3:"#b8c8e8",
      textColor:"rgba(255,255,255,0.9)",subColor:"rgba(180,210,240,0.6)",
      sessionBg:"rgba(8,28,75,0.6)",sessionTitle:"rgba(255,255,255,0.9)",sessionSub:"rgba(180,210,240,0.55)",
      sessionShine:["#4a90d9","#1e5fb5","#88c0ff"],sessionArrowBg:"rgba(255,255,255,0.1)",sessionArrowBorder:"rgba(255,255,255,0.2)",sessionArrowColor:"rgba(255,255,255,0.8)",
    },
    credits: {
      bg:"linear-gradient(135deg,#0f3d6b 0%,#61a9cd 50%,#12487d 100%)",
      titleColor:"rgba(255,255,255,0.9)",subColor:"rgba(180,210,240,0.55)",
      valueColor:"white",subValueColor:"rgba(180,210,240,0.6)",
      barBg:"rgba(255,255,255,0.12)",barFill:"linear-gradient(90deg,#88c8ff,#4a90d9)",
      barHighlight:"linear-gradient(180deg,#88c8ff,#4a90d9)",barDefault:"rgba(255,255,255,0.22)",
      barLabelColor:"rgba(180,210,240,0.5)",graphLabel:"rgba(180,210,240,0.5)",
      graphSublabel:"rgba(180,210,240,0.35)",tooltipBg:"rgba(5,15,50,0.92)",tooltipColor:"white",
      freePlanText:"rgba(255,255,255,0.8)",
      paymentBg:"linear-gradient(135deg,#0f3d6b 0%,#61a9cd 50%,#12487d 100%)",
      paymentText:"white",paymentSub:"rgba(180,210,240,0.55)",paymentInput:"rgba(255,255,255,0.08)",
      paymentInputBorder:"rgba(255,255,255,0.18)",paymentLabel:"rgba(180,210,240,0.5)",
    },
  },
  white: {
    identity: {
      bg:"linear-gradient(135deg,#cbc6c6 0%,#ffffff 50%,#cbc6c6 100%)",
      nameGradient:"linear-gradient(135deg,#444444 0%,#888888 50%,#444444 100%)",
      ic:"#666666",label:"#555555",value:"#888888",cardNum:"rgba(80,80,80,0.5)",
      freePlanText:"#222222",freePlanBg:"rgba(0,0,0,0.08)",freePlanBorder:"rgba(0,0,0,0.18)",
    },
    assignments: {
      bg:"linear-gradient(135deg,#ababab 0%,#dddddd 50%,#ababab 100%)",
      l1:"#444444",l1e:"#111111",l2:"#555555",l2e:"#222222",l3:"#666666",l3e:"#333333",
      dots:["#111111","#444444","#777777","#aaaaaa"],
      dotShadows:["0 0 6px #333","0 0 5px #666","0 0 5px #999","0 0 5px #bbb"],
      badgeBgs:["rgba(0,0,0,0.3)","rgba(0,0,0,0.18)","rgba(0,0,0,0.1)","rgba(0,0,0,0.06)"],
      badgeColors:["#111111","#333333","#555555","#777777"],
      badgeBorders:["rgba(0,0,0,0.4)","rgba(0,0,0,0.25)","rgba(0,0,0,0.15)","rgba(0,0,0,0.1)"],
      dueBg:"rgba(20,20,20,0.55)",cardBg:"rgba(0,0,0,0.1)",
      titleColor:"rgba(20,20,20,0.9)",courseColor:"rgba(60,60,60,0.7)",
      uploadBtnBg:"rgba(0,0,0,0.12)",uploadBtnBorder:"rgba(0,0,0,0.22)",uploadBtnText:"#111111",
      modalBg:"rgba(30,30,30,0.92)",modalText:"#ffffff",modalSub:"rgba(200,200,200,0.6)",
      shineColors:["#ffffff","#efefef","#ffffff"],
    },
    leaderboard: {
      bg:"linear-gradient(135deg,#767676 0%,#bfbfbf 50%,#767676 100%)",
      l1:"#333333",l1e:"#111111",l2:"#444444",l2e:"#222222",l3:"#555555",
      textColor:"rgba(20,20,20,0.9)",subColor:"rgba(60,60,60,0.65)",
      globeBase:[0.45, 0.45, 0.45],
      globeMarker:[0.95, 0.95, 0.95],
      globeGlow:[0.65, 0.65, 0.65],
      tooltipBg:"rgba(20,20,20,0.88)",
      sessionBg:"rgba(20,20,20,0.5)",sessionTitle:"rgba(255,255,255,0.9)",sessionSub:"rgba(200,200,200,0.6)",
      sessionShine:["#ffffff","#efefef","#ffffff"],sessionArrowBg:"rgba(255,255,255,0.15)",sessionArrowBorder:"rgba(255,255,255,0.25)",sessionArrowColor:"rgba(255,255,255,0.85)",
    },
    credits: {
      bg:"linear-gradient(135deg,#646363 0%,#999898 50%,#646363 100%)",
      titleColor:"rgba(255,255,255,0.9)",subColor:"rgba(220,220,220,0.7)",
      valueColor:"white",subValueColor:"rgba(220,220,220,0.7)",
      barBg:"rgba(255,255,255,0.2)",barFill:"linear-gradient(90deg,#ffffff,#cccccc)",
      barHighlight:"linear-gradient(180deg,#ffffff,#cccccc)",barDefault:"rgba(255,255,255,0.3)",
      barLabelColor:"rgba(220,220,220,0.7)",graphLabel:"rgba(220,220,220,0.7)",
      graphSublabel:"rgba(200,200,200,0.5)",tooltipBg:"rgba(20,20,20,0.92)",tooltipColor:"white",
      freePlanText:"rgba(255,255,255,0.85)",
      paymentBg:"linear-gradient(135deg,#646363 0%,#999898 50%,#646363 100%)",
      paymentText:"white",paymentSub:"rgba(220,220,220,0.6)",paymentInput:"rgba(255,255,255,0.12)",
      paymentInputBorder:"rgba(255,255,255,0.2)",paymentLabel:"rgba(220,220,220,0.55)",
    },
  },
  pink: {
    identity: {
      bg:"linear-gradient(135deg,#efa9b5 0%,#ffffff 50%,#efa9b5 100%)",
      nameGradient:"linear-gradient(135deg,#a03060 0%,#d45c7a 50%,#a03060 100%)",
      ic:"#b84870",label:"#a03060",value:"#c0607a",cardNum:"rgba(160,48,96,0.45)",
      freePlanText:"#8c1e4a",freePlanBg:"rgba(255,255,255,0.2)",freePlanBorder:"rgba(180,80,120,0.35)",
    },
    assignments: {
      bg:"linear-gradient(135deg,#dc8b99 0%,#f4ead2 50%,#dc8b99 100%)",
      l1:"#8c1a35",l1e:"#5a0820",l2:"#9e2545",l2e:"#6b1030",l3:"#b03055",l3e:"#7a1838",
      dots:["#7a1040","#c22a73","#e8608a","#f4a0b8"],
      dotShadows:["0 0 8px #9a1050","0 0 6px #c22a73","0 0 6px #e8608a","0 0 6px #f4a0b8"],
      badgeBgs:["rgba(122,16,64,0.5)","rgba(194,42,115,0.2)","rgba(232,96,138,0.15)","rgba(244,160,184,0.12)"],
      badgeColors:["#ffb0cc","#ffb8d0","#f8c8d8","#fad4e0"],
      badgeBorders:["rgba(255,100,160,0.3)","rgba(255,120,170,0.3)","rgba(240,160,190,0.3)","rgba(250,190,210,0.25)"],
      dueBg:"rgba(80,10,40,0.55)",cardBg:"rgba(255,255,255,0.15)",
      titleColor:"rgba(60,10,30,0.92)",courseColor:"rgba(140,40,80,0.65)",
      uploadBtnBg:"rgba(255,255,255,0.2)",uploadBtnBorder:"rgba(200,80,120,0.4)",uploadBtnText:"#6a1030",
      modalBg:"rgba(60,5,25,0.92)",modalText:"white",modalSub:"rgba(240,180,200,0.65)",
      shineColors:["#f7c5cf","#d45c7a","#fce4ea"],
    },
    leaderboard: {
      bg:"linear-gradient(135deg,#ff768f 0%,#f8c4eb 50%,#ff768f 100%)",
      l1:"#6b0a28",l1e:"#3d0018",l2:"#7a1535",l2e:"#4a0020",l3:"#8c2040",
      rankBronze:"#7a2800",
      textColor:"rgba(60,0,25,0.95)",subColor:"rgba(100,20,50,0.7)",
      globeBase:[0.72, 0.25, 0.38],
      globeMarker:[1.0, 0.75, 0.82],
      globeGlow:[0.85, 0.30, 0.50],
      tooltipBg:"rgba(80,5,30,0.88)",
      sessionBg:"rgba(80,10,40,0.65)",sessionTitle:"rgba(255,255,255,0.95)",sessionSub:"rgba(255,210,225,0.75)",
      sessionShine:["#f7c5cf","#d45c7a","#fce4ea"],sessionArrowBg:"rgba(255,255,255,0.2)",sessionArrowBorder:"rgba(255,255,255,0.35)",sessionArrowColor:"rgba(255,255,255,0.95)",
    },
    credits: {
      bg:"linear-gradient(135deg,#c22a73 0%,#f6a186 50%,#c22a73 100%)",
      titleColor:"rgba(255,255,255,0.95)",subColor:"rgba(255,210,225,0.65)",
      valueColor:"white",subValueColor:"rgba(255,210,225,0.75)",
      barBg:"rgba(255,255,255,0.15)",barFill:"linear-gradient(90deg,#ffb0cc,#e8608a)",
      barHighlight:"linear-gradient(180deg,#ffb0cc,#e8608a)",barDefault:"rgba(255,255,255,0.25)",
      barLabelColor:"rgba(255,210,225,0.6)",graphLabel:"rgba(255,210,225,0.6)",
      graphSublabel:"rgba(255,190,210,0.45)",tooltipBg:"rgba(80,5,35,0.92)",tooltipColor:"white",
      freePlanText:"rgba(255,255,255,0.9)",
      paymentBg:"linear-gradient(135deg,#c22a73 0%,#f6a186 50%,#c22a73 100%)",
      paymentText:"white",paymentSub:"rgba(255,210,225,0.65)",paymentInput:"rgba(255,255,255,0.1)",
      paymentInputBorder:"rgba(255,180,210,0.25)",paymentLabel:"rgba(255,210,225,0.6)",
    },
  },
  green: {
    identity: {
      bg:"linear-gradient(135deg,#cfffbd 0%,#ffffff 50%,#cfffbd 100%)",
      nameGradient:"linear-gradient(135deg,#2e6018 0%,#4a8830 50%,#2e6018 100%)",
      ic:"#3a7020",label:"#2e6018",value:"#4a8030",cardNum:"rgba(50,90,30,0.45)",
      freePlanText:"#1e4810",freePlanBg:"rgba(255,255,255,0.2)",freePlanBorder:"rgba(80,160,50,0.35)",
    },
    assignments: {
      bg:"linear-gradient(135deg,#ace199 0%,#fff9d9 50%,#719b62 100%)",
      l1:"#1a4a08",l1e:"#0d2e04",l2:"#255810",l2e:"#143808",l3:"#306618",l3e:"#1a4208",
      dots:["#0d3005","#2a6810","#50a030","#88cc60"],
      dotShadows:["0 0 8px #1a5008","0 0 6px #2a6810","0 0 6px #50a030","0 0 6px #88cc60"],
      badgeBgs:["rgba(15,50,5,0.5)","rgba(42,104,16,0.2)","rgba(80,160,48,0.15)","rgba(136,204,96,0.12)"],
      badgeColors:["#90e060","#98e870","#b0ee90","#c8f4a8"],
      badgeBorders:["rgba(80,180,40,0.3)","rgba(90,190,50,0.3)","rgba(120,210,70,0.3)","rgba(160,230,100,0.25)"],
      dueBg:"rgba(10,40,5,0.55)",cardBg:"rgba(255,255,255,0.15)",
      titleColor:"rgba(15,45,5,0.92)",courseColor:"rgba(40,90,20,0.65)",
      uploadBtnBg:"rgba(255,255,255,0.2)",uploadBtnBorder:"rgba(80,160,40,0.4)",uploadBtnText:"#1e4810",
      modalBg:"rgba(8,35,4,0.92)",modalText:"white",modalSub:"rgba(180,240,140,0.65)",
      shineColors:["#b8f0a0","#4a8830","#d8f5c8"],
    },
    leaderboard: {
      bg:"linear-gradient(135deg,#739f63 0%,#e6f6c8 50%,#5d8b4d 100%)",
      l1:"#0e3806",l1e:"#061e02",l2:"#185010",l2e:"#0a3006",l3:"#225e16",
      rankBronze:"#5a3800",
      textColor:"rgba(10,40,5,0.95)",subColor:"rgba(30,80,15,0.7)",
      globeBase:[0.25, 0.55, 0.18],
      globeMarker:[0.85, 1.0, 0.70],
      globeGlow:[0.30, 0.70, 0.20],
      tooltipBg:"rgba(8,35,4,0.88)",
      sessionBg:"rgba(10,40,5,0.65)",sessionTitle:"rgba(255,255,255,0.95)",sessionSub:"rgba(200,240,160,0.75)",
      sessionShine:["#b8f0a0","#4a8830","#d8f5c8"],sessionArrowBg:"rgba(255,255,255,0.2)",sessionArrowBorder:"rgba(255,255,255,0.35)",sessionArrowColor:"rgba(255,255,255,0.95)",
    },
    credits: {
      bg:"linear-gradient(135deg,#335925 0%,#b5d47b 50%,#335d24 100%)",
      titleColor:"rgba(255,255,255,0.95)",subColor:"rgba(200,240,160,0.7)",
      valueColor:"white",subValueColor:"rgba(200,240,160,0.75)",
      barBg:"rgba(255,255,255,0.15)",barFill:"linear-gradient(90deg,#b8f080,#60b830)",
      barHighlight:"linear-gradient(180deg,#b8f080,#60b830)",barDefault:"rgba(255,255,255,0.25)",
      barLabelColor:"rgba(200,240,160,0.6)",graphLabel:"rgba(200,240,160,0.6)",
      graphSublabel:"rgba(180,220,140,0.45)",tooltipBg:"rgba(8,35,4,0.92)",tooltipColor:"white",
      freePlanText:"rgba(255,255,255,0.9)",
      paymentBg:"linear-gradient(135deg,#335925 0%,#b5d47b 50%,#335d24 100%)",
      paymentText:"white",paymentSub:"rgba(200,240,160,0.65)",paymentInput:"rgba(255,255,255,0.1)",
      paymentInputBorder:"rgba(160,220,100,0.25)",paymentLabel:"rgba(200,240,160,0.6)",
    },
  },
  purple: {
    identity: {
      bg:"linear-gradient(135deg,#f1c0f4 0%,#ffffff 50%,#f5c4f8 100%)",
      nameGradient:"linear-gradient(135deg,#6a1880,#9040c0,#6a1880)",
      ic:"#7a20a0",label:"#6a1880",value:"#9050b0",cardNum:"rgba(100,30,130,0.45)",
      freePlanText:"#520e6a",freePlanBg:"rgba(255,255,255,0.2)",freePlanBorder:"rgba(160,80,200,0.35)",
    },
    assignments: {
      bg:"linear-gradient(135deg,#f39ef8 0%,#f6efd8 50%,#fa9dff 100%)",
      l1:"#4a0868",l1e:"#2e0440",l2:"#5a1278",l2e:"#3a084e",l3:"#6a1e88",l3e:"#481060",
      dots:["#3a0458","#7820a8","#b060d8","#d8a0f0"],
      dotShadows:["0 0 8px #5a0880","0 0 6px #7820a8","0 0 6px #b060d8","0 0 6px #d8a0f0"],
      badgeBgs:["rgba(60,4,88,0.5)","rgba(120,32,168,0.2)","rgba(176,96,216,0.15)","rgba(216,160,240,0.12)"],
      badgeColors:["#d890f8","#e0a0f8","#e8b8fc","#f0ccfe"],
      badgeBorders:["rgba(180,80,240,0.3)","rgba(200,100,250,0.3)","rgba(220,140,255,0.3)","rgba(235,180,255,0.25)"],
      dueBg:"rgba(50,5,75,0.55)",cardBg:"rgba(255,255,255,0.15)",
      titleColor:"rgba(45,5,65,0.92)",courseColor:"rgba(100,30,140,0.65)",
      uploadBtnBg:"rgba(255,255,255,0.2)",uploadBtnBorder:"rgba(160,80,210,0.4)",uploadBtnText:"#420860",
      modalBg:"rgba(40,4,60,0.92)",modalText:"white",modalSub:"rgba(220,170,248,0.65)",
      shineColors:["#e8c0f8","#9040c0","#f0d8fc"],
    },
    leaderboard: {
      bg:"linear-gradient(135deg,#c965cf 0%,#ffc2ea 50%,#c965cf 100%)",
      l1:"#3e0458",l1e:"#220230",l2:"#4e1068",l2e:"#300840",l3:"#5e1878",
      rankBronze:"#6a3800",
      textColor:"rgba(40,4,60,0.95)",subColor:"rgba(90,20,120,0.7)",
      globeBase:[0.55, 0.20, 0.65],
      globeMarker:[0.95, 0.78, 1.0],
      globeGlow:[0.70, 0.25, 0.85],
      tooltipBg:"rgba(40,4,60,0.90)",
      sessionBg:"rgba(50,5,75,0.65)",sessionTitle:"rgba(255,255,255,0.95)",sessionSub:"rgba(230,190,255,0.75)",
      sessionShine:["#e8c0f8","#9040c0","#f0d8fc"],sessionArrowBg:"rgba(255,255,255,0.2)",sessionArrowBorder:"rgba(255,255,255,0.35)",sessionArrowColor:"rgba(255,255,255,0.95)",
    },
    credits: {
      bg:"linear-gradient(135deg,#904f94 0%,#e47ec1 50%,#904f94 100%)",
      titleColor:"rgba(255,255,255,0.95)",subColor:"rgba(235,190,255,0.7)",
      valueColor:"white",subValueColor:"rgba(235,190,255,0.75)",
      barBg:"rgba(255,255,255,0.15)",barFill:"linear-gradient(90deg,#d890f8,#9040c0)",
      barHighlight:"linear-gradient(180deg,#d890f8,#9040c0)",barDefault:"rgba(255,255,255,0.25)",
      barLabelColor:"rgba(235,190,255,0.6)",graphLabel:"rgba(235,190,255,0.6)",
      graphSublabel:"rgba(215,170,240,0.45)",tooltipBg:"rgba(40,4,60,0.92)",tooltipColor:"white",
      freePlanText:"rgba(255,255,255,0.9)",
      paymentBg:"linear-gradient(135deg,#904f94 0%,#e47ec1 50%,#904f94 100%)",
      paymentText:"white",paymentSub:"rgba(235,190,255,0.65)",paymentInput:"rgba(255,255,255,0.1)",
      paymentInputBorder:"rgba(200,140,240,0.25)",paymentLabel:"rgba(235,190,255,0.6)",
    },
  },
};

function getComponentTheme(cardKey) {
  return COMPONENT_THEMES[cardKey] || COMPONENT_THEMES.blue;
}
function ShineBorder({ children, color, borderRadius=28, borderWidth=1.5, duration=5, style }) {
  const colors = Array.isArray(color) ? color.join(",") : color;
  return (
    <div style={{ position:"relative", borderRadius, ...style }}>
      <div style={{
        position:"absolute", inset:0, borderRadius,
        background:`radial-gradient(transparent,transparent,${colors},transparent,transparent)`,
        backgroundSize:"300% 300%",
        WebkitMask:`linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        mask:`linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite:"xor",
        maskComposite:"exclude",
        padding:borderWidth,
        animation:`shineSpin ${duration}s linear infinite`,
        pointerEvents:"none",
        zIndex:10,
      }}/>
      <div style={{ position:"relative", zIndex:2, borderRadius:borderRadius-borderWidth, overflow:"hidden", height:"100%" }}>
        {children}
      </div>
    </div>
  );
}

// ── NFC Screen ──────────────────────────────────────────────────────────────
function NFCScreen({ onTap }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.04}} onClick={onTap}
      style={{position:"fixed",inset:0,background:"#080810",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",userSelect:"none",fontFamily:"'Outfit',sans-serif"}}>
      <motion.div animate={{scale:[1,1.18,1],opacity:[0.8,1,0.8]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
        style={{position:"absolute",width:340,height:340,borderRadius:"50%",background:"radial-gradient(circle,rgba(120,80,220,0.2) 0%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",width:150,height:150,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:44}}>
        {[0,1,2].map(i=>(
          <motion.div key={i} animate={{scale:[0.45,2.5],opacity:[0.85,0]}} transition={{duration:2.4,repeat:Infinity,delay:i*0.7,ease:"easeOut"}}
            style={{position:"absolute",width:72,height:72,borderRadius:"50%",border:"1.8px solid rgba(140,100,255,0.55)"}}/>
        ))}
        <div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#9060e0,#5030b0)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 30px rgba(120,80,220,0.55)",zIndex:1}}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.4" opacity="0.4"/>
            <circle cx="12" cy="12" r="6.5" stroke="white" strokeWidth="1.4" opacity="0.7"/>
            <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.4" opacity="0.9"/>
            <circle cx="12" cy="12" r="1.3" fill="white"/>
          </svg>
        </div>
      </div>
      <div style={{textAlign:"center",zIndex:1}}>
        <div style={{fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:12,fontWeight:500}}>FSCHOOL AI</div>
        <div style={{fontSize:23,fontWeight:700,color:"rgba(255,255,255,0.88)",marginBottom:10,letterSpacing:"-0.02em"}}>Tap your card</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Hold NFC card near device</div>
      </div>
      <div style={{position:"absolute",bottom:44,fontSize:10,color:"rgba(255,255,255,0.18)",letterSpacing:"0.14em",textTransform:"uppercase"}}>Click anywhere to simulate</div>
    </motion.div>
  );
}

// ── NFC Overlay ─────────────────────────────────────────────────────────────
function NFCOverlay({ card, onClose, onActivated }) {
  const [progress,setProgress]=useState(0);
  const [statusText,setStatusText]=useState("Scanning\u2026");
  const [done,setDone]=useState(false);

  useEffect(()=>{
    const steps=[
      {pct:28,text:"Card detected\u2026",delay:800},
      {pct:56,text:"Reading card data\u2026",delay:1600},
      {pct:82,text:"Verifying identity\u2026",delay:2400},
      {pct:100,text:"\u2713 Authenticated",delay:3200},
    ];
    const timers=steps.map(s=>setTimeout(()=>{
      setProgress(s.pct);setStatusText(s.text);
      if(s.pct===100){setDone(true);setTimeout(()=>{onClose();onActivated();},1200);}
    },s.delay));
    return()=>timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:999,background:"rgba(8,8,16,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif"}}>
      <div style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.26)",marginBottom:30}}>FSCHOOL AI · NFC ACTIVATION</div>
      <div style={{position:"relative",width:160,height:160,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:30}}>
        <div style={{width:54,height:90,borderRadius:9,border:"2.5px solid rgba(255,255,255,0.55)",background:"rgba(255,255,255,0.05)",position:"relative",zIndex:2}}>
          <div style={{position:"absolute",top:7,left:"50%",transform:"translateX(-50%)",width:14,height:2.5,borderRadius:2,background:"rgba(255,255,255,0.35)"}}/>
        </div>
        <div style={{position:"absolute",right:-20,top:"50%",transform:"translateY(-50%) rotate(12deg)",width:54,height:34,borderRadius:7,overflow:"hidden",zIndex:3,border:"1.5px solid rgba(255,255,255,0.3)"}}>
          <img src={card.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        {[0,0.65,1.3].map((delay,i)=>(
          <motion.div key={i} animate={{scale:[0.5,2.6],opacity:[0.85,0]}} transition={{duration:2.1,repeat:Infinity,delay,ease:"easeOut"}}
            style={{position:"absolute",top:"50%",left:"50%",width:60,height:60,borderRadius:"50%",border:`1.8px solid ${card.ring}`,transform:"translate(-50%,-50%)"}}/>
        ))}
      </div>
      <div style={{fontSize:21,fontWeight:700,color:"rgba(255,255,255,0.9)",marginBottom:8,letterSpacing:"-0.02em",textAlign:"center"}}>
        {done?"Card Activated":"Hold Near Reader"}
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.36)",marginBottom:36,textAlign:"center",maxWidth:240,lineHeight:1.7}}>
        {done?"Welcome back, Alex Chen":"Keep your FSchool AI card near the top of your iPhone"}
      </div>
      <div style={{width:230,height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,overflow:"hidden",marginBottom:10}}>
        <motion.div animate={{width:`${progress}%`}} transition={{duration:0.45,ease:"easeOut"}} style={{height:"100%",background:"white",borderRadius:2}}/>
      </div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",letterSpacing:"0.06em",marginBottom:34}}>{statusText}</div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.55)",fontFamily:"'Outfit',sans-serif",fontSize:13,padding:"12px 32px",borderRadius:10,cursor:"pointer"}}>Cancel</button>
    </motion.div>
  );
}

// ── 3D Card (card selector screen) ──────────────────────────────────────────
function Card3D({ card, onNFC }) {
  const sceneRef=useRef(null);
  const [tilt,setTilt]=useState({x:12,y:-8});
  const [mouse,setMouse]=useState({x:0.3,y:0.25});
  const [hovering,setHovering]=useState(false);

  const handleMouseMove=useCallback((e)=>{
    const r=sceneRef.current.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    setTilt({x:12-(y-0.5)*2*15,y:-8+(x-0.5)*2*17});setMouse({x,y});
  },[]);
  const handleMouseLeave=useCallback(()=>{setTilt({x:12,y:-8});setMouse({x:0.3,y:0.25});setHovering(false);},[]);
  const handleTouchMove=useCallback((e)=>{
    e.preventDefault();
    const r=sceneRef.current.getBoundingClientRect();
    const t=e.touches[0];
    const x=(t.clientX-r.left)/r.width,y=(t.clientY-r.top)/r.height;
    setTilt({x:12-(y-0.5)*2*12,y:-8+(x-0.5)*2*14});setMouse({x,y});
  },[]);

  const specX=mouse.x*100,specY=mouse.y*100;
  const shadowX=(tilt.y/17)*18,shadowY=(-tilt.x/15)*14+22;

  return (
    <div ref={sceneRef} style={{width:368,height:232,perspective:1100,margin:"0 auto",position:"relative"}}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={()=>setHovering(true)}
      onTouchMove={handleTouchMove} onTouchEnd={handleMouseLeave}>
      <motion.div animate={{rotateX:tilt.x,rotateY:tilt.y,scale:hovering?1.025:1}}
        transition={{type:"spring",stiffness:260,damping:26,mass:0.75}}
        style={{width:"100%",height:"100%",transformStyle:"preserve-3d",borderRadius:22,cursor:"grab",position:"relative"}}>
        <div style={{position:"absolute",inset:0,borderRadius:22,overflow:"hidden",
          boxShadow:`${shadowX}px ${shadowY}px ${hovering?85:65}px -8px rgba(0,0,0,0.88),0 2px 0 rgba(255,255,255,0.72) inset,0 -1px 0 rgba(0,0,0,0.07) inset`}}>
          <img src={card.img} alt={card.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",borderRadius:22}}/>
          <div style={{position:"absolute",inset:0,borderRadius:22,pointerEvents:"none",zIndex:3,background:`linear-gradient(130deg,${card.shimmer} 0%,rgba(255,255,255,0.05) 45%,transparent 70%)`}}/>
          <div style={{position:"absolute",inset:0,borderRadius:22,pointerEvents:"none",zIndex:4,background:`radial-gradient(ellipse 50% 38% at ${specX}% ${specY}%,rgba(255,255,255,0.34) 0%,rgba(255,255,255,0.09) 40%,transparent 70%)`,transition:"background 0.04s linear"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:1.5,borderRadius:"22px 22px 0 0",background:"linear-gradient(90deg,transparent 4%,rgba(255,255,255,0.9) 50%,transparent 96%)",zIndex:6}}/>
          <div style={{position:"absolute",bottom:15,left:0,right:0,display:"flex",justifyContent:"center",zIndex:7,pointerEvents:"none"}}>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.2em",fontWeight:500,color:card.numCol}}>AF05 &nbsp;0000 &nbsp;0005 &nbsp;5301</span>
          </div>
          <div onClick={onNFC} style={{position:"absolute",left:16,bottom:11,cursor:"pointer",zIndex:8,opacity:0.35,color:card.numCol}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.4"/>
              <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.4" opacity="0.65"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" opacity="0.85"/>
              <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div style={{position:"absolute",right:-10,top:12,bottom:12,width:10,borderRadius:"0 6px 6px 0",background:"linear-gradient(180deg,rgba(0,0,0,0.09),rgba(0,0,0,0.27),rgba(0,0,0,0.09))",zIndex:-1}}/>
        <div style={{position:"absolute",bottom:-9,left:12,right:12,height:9,borderRadius:"0 0 6px 6px",background:"linear-gradient(90deg,rgba(0,0,0,0.12),rgba(0,0,0,0.3),rgba(0,0,0,0.12))",zIndex:-1}}/>
      </motion.div>
    </div>
  );
}

// ── Vertical Dashboard Stack ─────────────────────────────────────────────────
function VerticalDashboard({ card, onBack }) {
  const [currentIndex,setCurrentIndex]=useState(0);
  const lastNavTime=useRef(0);
  const NAV_COOLDOWN=400;
  const DASH_CARDS = getDashCards(card.key);
  const compTheme = getComponentTheme(card.key);

  const dashLen = DASH_CARDS.length;
  const navigate=useCallback((dir)=>{
    const now=Date.now();
    if(now-lastNavTime.current<NAV_COOLDOWN) return;
    lastNavTime.current=now;
    setCurrentIndex(prev=>{
      const next=prev+dir;
      if(next<0||next>=dashLen) return prev;
      return next;
    });
  },[dashLen]);

  useEffect(()=>{
    const onWheel=(e)=>{ if(Math.abs(e.deltaY)>30) navigate(e.deltaY>0?1:-1); };
    window.addEventListener("wheel",onWheel,{passive:true});
    return()=>window.removeEventListener("wheel",onWheel);
  },[navigate]);

  useEffect(()=>{
    const onKey=(e)=>{ if(e.key==="ArrowDown") navigate(1); if(e.key==="ArrowUp") navigate(-1); };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[navigate]);

  const handleDragEnd=useCallback((_,info)=>{
    if(info.offset.y<-50) navigate(1);
    else if(info.offset.y>50) navigate(-1);
  },[navigate]);

  const getCardStyle=(index)=>{
    const diff=index-currentIndex;
    if(diff===0)  return {y:0,    scale:1,    opacity:1,    zIndex:5, rotateX:0   };
    if(diff===-1) return {y:-185, scale:0.88, opacity:0.60, zIndex:4, rotateX:8   };
    if(diff===-2) return {y:-325, scale:0.76, opacity:0.32, zIndex:3, rotateX:14  };
    if(diff===1)  return {y:185,  scale:0.88, opacity:0.60, zIndex:4, rotateX:-8  };
    if(diff===2)  return {y:325,  scale:0.76, opacity:0.32, zIndex:3, rotateX:-14 };
    return {y:diff>0?500:-500,scale:0.65,opacity:0,zIndex:0,rotateX:0};
  };

  const isVisible=(index)=>Math.abs(index-currentIndex)<=2;

  // Ambient color per card — use first shine color of each dash card
  const ambColors = DASH_CARDS.map(dc => dc.shineColor[0]);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:20}} transition={{duration:0.45}}
      style={{position:"fixed",inset:0,background:"#0a0a12",fontFamily:"'Outfit',sans-serif",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>

      {/* Ambient */}
      <motion.div animate={{background:ambColors[currentIndex]}} transition={{duration:0.7}}
        style={{position:"absolute",width:500,height:500,borderRadius:"50%",filter:"blur(100px)",top:-150,left:-120,opacity:0.13,pointerEvents:"none"}}/>
      <motion.div animate={{background:ambColors[currentIndex]}} transition={{duration:0.7}}
        style={{position:"absolute",width:380,height:380,borderRadius:"50%",filter:"blur(100px)",bottom:-100,right:-80,opacity:0.09,pointerEvents:"none"}}/>

      {/* Back */}
      <button onClick={onBack}
        style={{position:"absolute",top:52,left:20,zIndex:20,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"0.5px solid rgba(255,255,255,0.15)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.7)"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>

      {/* Header */}
      <div style={{position:"absolute",top:42,left:0,right:0,textAlign:"center",zIndex:10,pointerEvents:"none"}}>
        <div style={{fontSize:9,letterSpacing:"0.24em",textTransform:"uppercase",color:"rgba(255,255,255,0.22)",marginBottom:4}}>FSCHOOL AI</div>
        <div style={{position:"relative",height:44,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{opacity:0, y:12, filter:"blur(6px)"}}
              animate={{opacity:1, y:0,  filter:"blur(0px)"}}
              exit={{opacity:0,   y:-12, filter:"blur(6px)"}}
              transition={{duration:0.35, ease:"easeInOut"}}
              style={{
                position:"absolute",
                fontFamily:"'Open Sans','Courier New',monospace",
                fontSize:32,
                fontWeight:700,
                letterSpacing:"-0.01em",
                background: DASH_CARDS[currentIndex].labelGradient,
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                display:"inline-block",
                whiteSpace:"nowrap",
              }}>
              {DASH_CARDS[currentIndex].label}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Card stack */}
      <div style={{position:"relative",width:340,height:560,perspective:"1200px",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {DASH_CARDS.map((dashCard,index)=>{
          if(!isVisible(index)) return null;
          const st=getCardStyle(index);
          const isCurrent=index===currentIndex;

          return (
            <motion.div key={dashCard.id}
              animate={{y:st.y,scale:st.scale,opacity:st.opacity,rotateX:st.rotateX,zIndex:st.zIndex}}
              transition={{type:"spring",stiffness:300,damping:30,mass:1}}
              drag={isCurrent?"y":false}
              dragConstraints={{top:0,bottom:0}}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              style={{position:"absolute",transformStyle:"preserve-3d",zIndex:st.zIndex,cursor:isCurrent?"grab":"default"}}>

              <ShineBorder color={dashCard.shineColor || card.shineColor} borderRadius={28} borderWidth={1.5} duration={5}
                style={{width:320,height:500}}>
                <div style={{width:"100%",height:"100%",borderRadius:26,overflow:"hidden",position:"relative",
                  boxShadow:isCurrent?"0 28px 70px -10px rgba(0,0,0,0.8),0 12px 28px -8px rgba(0,0,0,0.5)":"0 10px 30px -10px rgba(0,0,0,0.6)"}}>

                  {index===0 ? (
                    <div style={{width:"100%",height:"100%",overflowY:"auto",overflowX:"hidden"}}>
                      <IdentityCard themeObj={compTheme.identity}/>
                    </div>
                  ) : index===1 ? (
                    <div style={{width:"100%",height:"100%",overflowY:"auto",overflowX:"hidden"}}>
                      <AssignmentsCard visible={currentIndex===1} themeObj={compTheme.assignments}/>
                    </div>
                  ) : index===2 ? (
                    <div style={{width:"100%",height:"100%",overflow:"hidden"}}>
                      <LeaderboardCard visible={currentIndex===2} themeObj={compTheme.leaderboard}/>
                    </div>
                  ) : index===3 ? (
                    <div style={{width:"100%",height:"100%",overflow:"hidden"}}>
                      <AICreditsCard visible={currentIndex===3} themeObj={compTheme.credits}/>
                    </div>
                  ) : (
                    // ── Card 5: Wallet placeholder ──
                    <div style={{width:"100%",height:"100%",background:dashCard.bg,position:"relative"}}>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%,rgba(255,255,255,0.04) 100%)",pointerEvents:"none"}}/>
                      <div style={{position:"absolute",bottom:18,left:0,right:0,textAlign:"center"}}>
                        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.18em",color:compTheme.identity.cardNum}}>AF05 0000 0005 5301</span>
                      </div>
                    </div>
                  )}
                </div>
              </ShineBorder>
            </motion.div>
          );
        })}
      </div>

      {/* Nav dots */}
      <div style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:8,alignItems:"center",zIndex:20}}>
        {DASH_CARDS.map((_,i)=>(
          <button key={i} onClick={()=>setCurrentIndex(i)}
            style={{width:6,height:i===currentIndex?22:6,borderRadius:3,background:i===currentIndex?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.22)",border:"none",cursor:"pointer",padding:0,transition:"all 0.3s ease"}}/>
        ))}
      </div>

      {/* Counter */}
      <div style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,zIndex:20}}>
        <span style={{fontSize:28,fontWeight:300,color:"rgba(255,255,255,0.65)",lineHeight:1,letterSpacing:"-0.03em"}}>
          {String(currentIndex+1).padStart(2,"0")}
        </span>
        <div style={{width:1,height:20,background:"rgba(255,255,255,0.15)"}}/>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.28)"}}>
          {String(DASH_CARDS.length).padStart(2,"0")}
        </span>
      </div>

      {/* Swipe hint */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:0.6}}
        style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:5,zIndex:20,pointerEvents:"none"}}>
        <motion.svg animate={{y:[0,-6,0]}} transition={{repeat:Infinity,duration:1.6,ease:"easeInOut"}}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12l7-7 7 7"/>
        </motion.svg>
        <span style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)"}}>Scroll or drag</span>
        <motion.svg animate={{y:[0,6,0]}} transition={{repeat:Infinity,duration:1.6,ease:"easeInOut"}}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

// ── Card Selector Screen ─────────────────────────────────────────────────────
function CardScreen({ activeCard, setActiveCard, onNFC, onOpenDashboard }) {
  const card=CARDS[activeCard];
  return (
    <motion.div key="cardscreen" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.5,ease:"easeOut"}}
      style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"30px 16px 44px",position:"relative",overflow:"hidden"}}>
      <motion.div animate={{background:card.amb}} transition={{duration:0.85}}
        style={{position:"absolute",width:480,height:480,borderRadius:"50%",filter:"blur(100px)",top:-150,left:-120,opacity:0.14,pointerEvents:"none"}}/>
      <motion.div animate={{background:card.amb}} transition={{duration:0.85}}
        style={{position:"absolute",width:360,height:360,borderRadius:"50%",filter:"blur(100px)",bottom:-100,right:-90,opacity:0.1,pointerEvents:"none"}}/>

      <div style={{textAlign:"center",marginBottom:6,position:"relative",zIndex:1}}>
        <div style={{fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)"}}>FSCHOOL AI</div>
        <div style={{fontSize:17,fontWeight:700,color:"rgba(255,255,255,0.72)",letterSpacing:"-0.01em",marginTop:5}}>Identity Card</div>
      </div>

      <div style={{position:"relative",zIndex:1,width:"100%"}}>
        <Card3D card={card} onNFC={onNFC}/>
      </div>

      <motion.button onClick={onOpenDashboard} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
        style={{display:"flex",alignItems:"center",gap:8,background:`${card.accent}18`,border:`0.5px solid ${card.accent}55`,borderRadius:12,padding:"11px 22px",cursor:"pointer",marginBottom:22,position:"relative",zIndex:1,color:card.accent,fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Open Dashboard
      </motion.button>

      <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.26)",marginBottom:11,textAlign:"center",position:"relative",zIndex:1}}>Card Colorway</div>
      <div style={{display:"flex",gap:13,justifyContent:"center",marginBottom:24,position:"relative",zIndex:1}}>
        {CARDS.map((c,i)=>(
          <motion.button key={c.key} onClick={()=>setActiveCard(i)} whileHover={{scale:1.1}}
            animate={{scale:i===activeCard?1.18:1,y:i===activeCard?-3:0}}
            style={{width:46,height:46,borderRadius:"50%",padding:0,cursor:"pointer",overflow:"hidden",border:i===activeCard?"2.5px solid rgba(255,255,255,0.92)":"2.5px solid rgba(255,255,255,0.15)",background:"none"}}>
            <img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%",display:"block"}}/>
          </motion.button>
        ))}
      </div>

      <div style={{width:"100%",maxWidth:368,background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 18px",display:"flex",flexDirection:"column",gap:11,marginBottom:14,position:"relative",zIndex:1}}>
        {[
          {label:"Cardholder",value:"Alex Chen",mono:false},
          {label:"Card Number",value:"AF05 0000 0005 5301",mono:true},
          {label:"Colorway",value:card.name,mono:false},
          {label:"Status",value:"\u25cf Active",mono:false,green:true},
        ].map((row,i)=>(
          <div key={i}>
            {i>0&&<div style={{height:0.5,background:"rgba(255,255,255,0.06)",marginBottom:11}}/>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{row.label}</span>
              <span style={{fontSize:12,fontWeight:600,color:row.green?"#4ade80":"rgba(255,255,255,0.7)",fontFamily:row.mono?"'IBM Plex Mono',monospace":"inherit"}}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>

      <motion.button whileHover={{background:"rgba(255,255,255,0.12)"}} whileTap={{scale:0.98}} onClick={onNFC}
        style={{width:"100%",maxWidth:368,padding:14,borderRadius:12,border:"0.5px solid rgba(255,255,255,0.13)",background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.8)",fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,letterSpacing:"0.04em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:9,position:"relative",zIndex:1}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" opacity="0.35"/><circle cx="12" cy="12" r="6.5" opacity="0.65"/>
          <circle cx="12" cy="12" r="3" opacity="0.9"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
        </svg>
        Hold Near Reader to Activate
      </motion.button>
    </motion.div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]         = useState("nfc");
  const [activeCard,setActiveCard] = useState(0);
  const [showNFC,setShowNFC]       = useState(false);
  const card = CARDS[activeCard];

  return (
    <div style={{minHeight:"100vh",background:"#0a0a12",fontFamily:"'Outfit',sans-serif"}}>
      <AnimatePresence mode="wait">
        {screen==="nfc" && <NFCScreen key="nfc" onTap={()=>setScreen("card")}/>}
        {screen==="card" && (
          <CardScreen key="card" activeCard={activeCard} setActiveCard={setActiveCard}
            onNFC={()=>setShowNFC(true)} onOpenDashboard={()=>setScreen("dashboard")}/>
        )}
        {screen==="dashboard" && (
          <VerticalDashboard key={`dashboard-${card.key}`} card={card} onBack={()=>setScreen("card")}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNFC && <NFCOverlay card={card} onClose={()=>setShowNFC(false)} onActivated={()=>setScreen("dashboard")}/>}
      </AnimatePresence>
    </div>
  );
}