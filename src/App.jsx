import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";

const G = () => (
  <style>{`
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #F2F4F6;
      color: #191F28;
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    input, button, select { font-family: inherit; }
    ::-webkit-scrollbar { display: none; }

    /* ── 카드 ── */
    .card  { background: #fff; border-radius: 20px; padding: 20px; margin-bottom: 8px; }
    .card-sm { background: #fff; border-radius: 16px; padding: 18px; }

    /* ── 타이포 ── */
    .t-label  { font-size: 13px; color: #8B95A1; font-weight: 500; }
    .t-big    { font-size: 32px; font-weight: 800; color: #191F28; letter-spacing: -1.5px; line-height: 1.1; }
    .t-mid    { font-size: 22px; font-weight: 700; color: #191F28; letter-spacing: -0.8px; }
    .t-sm     { font-size: 17px; font-weight: 700; color: #191F28; letter-spacing: -0.3px; }
    .t-cap    { font-size: 12px; color: #8B95A1; font-weight: 400; }
    .t-unit   { font-size: 15px; font-weight: 500; color: #8B95A1; margin-left: 3px; }
    .t-unit-sm{ font-size: 12px; color: #8B95A1; margin-left: 2px; }

    /* ── 색상 ── */
    .c-blue   { color: #3182F6; }
    .c-green  { color: #00B493; }
    .c-red    { color: #F04452; }
    .c-amber  { color: #F5A623; }
    .c-dim    { color: #8B95A1; }

    /* ── 구분선 ── */
    .divider { height: 1px; background: #F2F4F6; margin: 14px 0; }

    /* ── 프로그레스 ── */
    .pb { background: #F2F4F6; border-radius: 99px; height: 5px; overflow: hidden; }
    .pf { height: 100%; border-radius: 99px; background: #3182F6; transition: width .7s ease; }
    .pf.green { background: #00B493; }
    .pf.amber { background: #F5A623; }

    /* ── 인풋 ── */
    .inp {
      width: 100%; background: #F2F4F6; border: none; border-radius: 12px;
      padding: 13px 16px; color: #191F28; font-size: 15px; outline: none;
      transition: background .15s;
    }
    .inp::placeholder { color: #C4CAD4; }
    .inp:focus { background: #E8EDF2; }
    .inp-sm { padding: 9px 12px; font-size: 13px; border-radius: 10px; }

    /* ── 버튼 ── */
    .btn-blue {
      background: #3182F6; border: none; border-radius: 12px;
      padding: 13px 20px; color: #fff; font-size: 15px; font-weight: 600;
      transition: opacity .15s; cursor: pointer; white-space: nowrap;
    }
    .btn-blue:active { opacity: .8; }
    .btn-ghost {
      background: #F2F4F6; border: none; border-radius: 10px;
      padding: 8px 14px; color: #4E5968; font-size: 13px; font-weight: 500;
      transition: background .15s; cursor: pointer;
    }
    .btn-ghost:active { background: #E8EDF2; }
    .btn-ghost.active { color: #3182F6; background: #EBF3FE; }

    /* ── 탭 ── */
    .tab-wrap { display: flex; background: #fff; border-radius: 16px; padding: 4px; margin-bottom: 10px; gap: 2px; }
    .tab { flex: 1; padding: 9px 0; font-size: 13px; font-weight: 500; color: #8B95A1; background: none; border: none; border-radius: 12px; cursor: pointer; transition: all .2s; }
    .tab.on { background: #3182F6; color: #fff; font-weight: 700; }

    /* ── 태그/칩 ── */
    .tag { display: inline-flex; align-items: center; background: #F2F4F6; border: none; border-radius: 8px; padding: 7px 13px; color: #4E5968; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
    .tag.on-blue  { background: #EBF3FE; color: #3182F6; font-weight: 700; }
    .tag.on-green { background: #E6F7F4; color: #00B493; font-weight: 700; }
    .tag.on-red   { background: #FEECEE; color: #F04452; font-weight: 700; }

    .chip { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
    .chip-e1 { background: #E6F7F4; color: #00B493; }
    .chip-e2 { background: #FEF5E7; color: #F5A623; }
    .chip-e3 { background: #EBF3FE; color: #3182F6; }

    /* ── 할일 ── */
    .todo-item {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 0; border-bottom: 1px solid #F2F4F6;
      background: none; border-left: none; border-right: none; border-top: none;
      width: 100%; text-align: left; cursor: pointer; transition: opacity .15s;
    }
    .todo-item:last-child { border-bottom: none; }
    .todo-item.done { opacity: .38; }
    .chk {
      width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
      border: 1.5px solid #D1D9E0;
      display: flex; align-items: center; justify-content: center; font-size: 11px;
      transition: all .2s;
    }
    .chk.on { background: #00B493; border-color: #00B493; color: #fff; }

    /* ── 종목 행 ── */
    .hold-row { padding: 14px 0; border-bottom: 1px solid #F2F4F6; }
    .hold-row:last-child { border-bottom: none; }

    /* ── 레이아웃 ── */
    .row   { display: flex; align-items: center; justify-content: space-between; }
    .row-s { display: flex; align-items: center; gap: 8px; }
    .section-title { font-size: 11px; font-weight: 700; color: #C4CAD4; letter-spacing: .5px; text-transform: uppercase; margin: 16px 0 4px; }

    /* ── 경보 배지 ── */
    .badge-red   { background: #FEECEE; border-radius: 14px; padding: 14px 16px; margin-bottom: 8px; }
    .badge-amber { background: #FEF5E7; border-radius: 14px; padding: 14px 16px; margin-bottom: 8px; }

    /* ── 룰박스 ── */
    .rule-box { background: #F7F8FA; border-radius: 14px; padding: 16px; }

    /* ── 애니메이션 ── */
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    .fade { animation: fadeUp .22s ease both; }

    /* ── 거래 패널 ── */
    .trade-panel { background: #F7F8FA; border-radius: 16px; padding: 16px; margin-bottom: 14px; }

    /* ── 통계 그리드 ── */
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .stat-box { background: #F7F8FA; border-radius: 14px; padding: 14px; }
  `}</style>
);

/* ── 데이터 ── */
const DEFAULT_HOLDINGS = [
  { ticker:"NVDA", qty:0, avgPrice:0, engine:3 },
  { ticker:"META", qty:0, avgPrice:0, engine:3 },
  { ticker:"PLTR", qty:0, avgPrice:0, engine:2 },
  { ticker:"QLD",  qty:0, avgPrice:0, engine:1 },
];
const DEFAULT_STATE = {
  totalCash: 8500,
  engine2Profit: 0,
  e3_nvda_rounds: 1,
  e3_meta_rounds: 1,
  holdings: DEFAULT_HOLDINGS,
  trades: [],
  earningsCalendar: [
    { ticker:"META", date:"2026-07-30" },
    { ticker:"NVDA", date:"2026-08-27" },
    { ticker:"PLTR", date:"2026-08-04" },
  ],
  todos: [
    { id:1,  text:"현대차 전량 매도",                   done:false, cat:"day1", urgent:true },
    { id:2,  text:"SK하이닉스 전량 매도",               done:false, cat:"day1", urgent:true },
    { id:3,  text:"MSTR 지정가 전량 매도 (밤 11시↑)",   done:false, cat:"day1", urgent:true },
    { id:4,  text:"JOBY 지정가 전량 매도 (밤 11시↑)",   done:false, cat:"day1", urgent:true },
    { id:5,  text:"ARKF 지정가 전량 매도 (밤 11시↑)",   done:false, cat:"day1", urgent:true },
    { id:6,  text:"단타용 1,000만원 배정",              done:false, cat:"day2" },
    { id:7,  text:"NVDA 1회차 분할매수",                done:false, cat:"day2" },
    { id:8,  text:"META 1회차 분할매수",                done:false, cat:"day2" },
    { id:9,  text:"남은 현금 토스 파킹통장 이체",        done:false, cat:"day2" },
    { id:10, text:"QLD 오늘 5만원 매수",                done:false, cat:"daily" },
  ],
  lastPrices: {},
  priceUpdatedAt: null,
};
const SK   = "inv_v5";
const UKRW = 1380;

function load() {
  try { const s = localStorage.getItem(SK); if (s) return JSON.parse(s); } catch {}
  return DEFAULT_STATE;
}

async function fetchPrices(tickers) {
  const out = {};
  await Promise.all(tickers.map(async t => {
    try {
      const r = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=1d`);
      const j = await r.json();
      const p = j?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (p) out[t] = +p.toFixed(2);
    } catch {}
  }));
  return out;
}

function buildSim(base) {
  const rows = [];
  let e1 = 500, e3 = 7000, cash = base * .12;
  for (let i = 0; i <= 60; i++) {
    const d = new Date(2026, 4 + i, 1);
    if (i > 0) { e1 = e1 * (1 + .20/12) + 180; e3 = e3 * (1 + .40/12) + 30; }
    rows.push({
      label: `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getFullYear()).slice(2)}`,
      total: Math.round(e1 + e3 + cash + i * 15),
      goal:  100000,
    });
  }
  return rows;
}

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid #E8EDF2",borderRadius:12,padding:"10px 14px",fontSize:12,boxShadow:"0 4px 16px rgba(0,0,0,.08)"}}>
      <div style={{color:"#8B95A1",marginBottom:4}}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{color:p.color,fontWeight:700}}>{p.name}: {Number(p.value).toLocaleString()}만원</div>)}
    </div>
  );
};

/* ── 메인 ── */
export default function App() {
  const [d, setD]             = useState(load);
  const [tab, setTab]         = useState("home");
  const [loading, setLoading] = useState(false);
  const [usdKrw, setUsdKrw]  = useState(UKRW);
  const [cashIn, setCashIn]   = useState("");
  const [e2In,   setE2In]     = useState("");
  const [showTrade, setShowTrade] = useState(false);
  const [tf, setTf]           = useState({ ticker:"NVDA", type:"buy", qty:"", price:"" });
  const [editing, setEditing] = useState(null);

  useEffect(() => { try { localStorage.setItem(SK, JSON.stringify(d)); } catch {} }, [d]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const tks = [...new Set(d.holdings.map(h => h.ticker))];
    const ps  = await fetchPrices(tks);
    setD(p => ({ ...p, lastPrices: { ...p.lastPrices, ...ps },
      priceUpdatedAt: new Date().toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit" }) }));
    setLoading(false);
  }, [d.holdings]);

  useEffect(() => { refresh(); }, []); // eslint-disable-line

  /* 계산값 */
  const pr        = d.lastPrices;
  const stockKRW  = d.holdings.reduce((s,h) => s + (h.qty * (pr[h.ticker]||0) * usdKrw / 10000), 0);
  const totalAsset= Math.round(stockKRW + d.totalCash);
  const pct       = Math.min(totalAsset / 100000 * 100, 100);
  const cashRatio = d.totalCash / Math.max(totalAsset, 1) * 100;
  const today     = new Date();
  const earnings  = d.earningsCalendar.map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.date) - today) / 86400000) }));
  const alertE    = earnings.filter(e => e.daysLeft >= 0 && e.daysLeft <= 7);
  const warnE     = earnings.filter(e => e.daysLeft > 7 && e.daysLeft <= 14);
  const simData   = buildSim(totalAsset);
  const hitIdx    = simData.findIndex(s => s.total >= 100000);
  const e3Val     = d.holdings.filter(h => h.engine === 3).reduce((s,h) => s + (h.qty * (pr[h.ticker]||h.avgPrice) * usdKrw / 10000), 0);
  const pieData   = [
    { name:"엔진1", value: Math.round(stockKRW*.1)||200, color:"#00B493" },
    { name:"엔진2", value: 3000,                         color:"#F5A623" },
    { name:"엔진3", value: Math.round(e3Val)||500,       color:"#3182F6" },
    { name:"현금",  value: d.totalCash,                  color:"#D1D9E0" },
  ];

  function execTrade() {
    const q = parseFloat(tf.qty), p = parseFloat(tf.price);
    if (!q || !p) return;
    setD(prev => ({
      ...prev,
      holdings: prev.holdings.map(h => {
        if (h.ticker !== tf.ticker) return h;
        if (tf.type === "buy") { const tq = h.qty + q; return { ...h, qty: tq, avgPrice: +((h.qty*h.avgPrice + q*p)/tq).toFixed(2) }; }
        return { ...h, qty: Math.max(0, h.qty - q) };
      }),
      trades: [{ date: new Date().toLocaleDateString("ko-KR"), ticker: tf.ticker, type: tf.type, qty: q, price: p }, ...prev.trades].slice(0, 50),
    }));
    setTf(f => ({ ...f, qty:"", price:"" }));
    setShowTrade(false);
  }

  function toggleTodo(id) { setD(p => ({ ...p, todos: p.todos.map(t => t.id === id ? { ...t, done: !t.done } : t) })); }

  const day1  = d.todos.filter(t => t.cat === "day1");
  const day2  = d.todos.filter(t => t.cat === "day2");
  const daily = d.todos.filter(t => t.cat === "daily");
  const TABS  = [["home","홈"],["portfolio","종목"],["simulation","시뮬"],["plan","계획"]];

  return (
    <>
      <G />
      <div style={{ background:"#F2F4F6", minHeight:"100vh" }}>
        <div style={{ maxWidth:480, margin:"0 auto", padding:"0 0 60px" }}>

          {/* ── 헤더 ── */}
          <div style={{ background:"#fff", padding:"52px 20px 24px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:13, color:"#8B95A1", fontWeight:500, marginBottom:8 }}>10억 시스템 2.0</div>
                <div className="t-big">
                  {totalAsset.toLocaleString()}
                  <span className="t-unit">만원</span>
                </div>
              </div>
              <button className="btn-ghost" onClick={refresh} style={{ marginTop:4, flexShrink:0 }}>
                {loading ? "조회중" : "새로고침"}
              </button>
            </div>
            <div className="pb" style={{ marginBottom:8 }}>
              <div className="pf" style={{ width:`${pct}%` }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span className="t-cap" style={{ color:"#3182F6", fontWeight:600 }}>{pct.toFixed(1)}% 달성</span>
              <span className="t-cap">목표 10억까지 {(100000-totalAsset).toLocaleString()}만원 남음</span>
            </div>
          </div>

          {/* 경보 */}
          <div style={{ padding:"0 12px" }}>
            {alertE.length > 0 && (
              <div className="badge-red fade">
                <div style={{ fontSize:13, fontWeight:700, color:"#F04452", marginBottom:3 }}>실적발표 임박 🚨</div>
                <div style={{ fontSize:12, color:"#C0424E" }}>{alertE.map(e => `${e.ticker} D-${e.daysLeft}일`).join(" · ")} — 단타 전량매도 필요</div>
              </div>
            )}
            {warnE.length > 0 && !alertE.length && (
              <div className="badge-amber fade">
                <div style={{ fontSize:13, fontWeight:600, color:"#E09400", marginBottom:3 }}>실적발표 2주 이내 ⚠️</div>
                <div style={{ fontSize:12, color:"#B07A1A" }}>{warnE.map(e => `${e.ticker} D-${e.daysLeft}일`).join(" · ")}</div>
              </div>
            )}
          </div>

          {/* ── 탭 ── */}
          <div style={{ padding:"0 12px" }}>
            <div className="tab-wrap">
              {TABS.map(([k,l]) => (
                <button key={k} className={`tab${tab===k?" on":""}`} onClick={() => setTab(k)}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── 콘텐츠 ── */}
          <div style={{ padding:"0 12px" }} className="fade">

            {/* ════ 홈 ════ */}
            {tab === "home" && <>

              {/* 자산 현황 */}
              <div className="card">
                <div className="row" style={{ marginBottom:16 }}>
                  <span className="t-label">자산 현황</span>
                  <span className="t-cap">{d.priceUpdatedAt ? `${d.priceUpdatedAt} 기준` : "—"}</span>
                </div>
                <div className="stat-grid" style={{ marginBottom:16 }}>
                  <div className="stat-box">
                    <div className="t-cap" style={{ marginBottom:5 }}>주식 평가액</div>
                    <div style={{ fontSize:19, fontWeight:700, color:"#191F28", letterSpacing:"-0.5px" }}>
                      {Math.round(stockKRW).toLocaleString()}<span className="t-unit-sm">만</span>
                    </div>
                  </div>
                  <div className="stat-box" style={{ background: cashRatio >= 10 ? "#F7F8FA" : "#FEECEE" }}>
                    <div className="t-cap" style={{ marginBottom:5 }}>현금 방패 {cashRatio < 10 ? "⚠️" : ""}</div>
                    <div style={{ fontSize:19, fontWeight:700, color: cashRatio >= 10 ? "#191F28" : "#F04452", letterSpacing:"-0.5px" }}>
                      {d.totalCash.toLocaleString()}<span className="t-unit-sm">만</span>
                    </div>
                    <div style={{ fontSize:11, color: cashRatio >= 10 ? "#8B95A1" : "#F04452", marginTop:2, fontWeight:600 }}>
                      {cashRatio.toFixed(1)}% {cashRatio >= 10 ? "정상" : "부족"}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <input className="inp" placeholder="파킹통장 금액 입력 (만원)"
                    value={cashIn} onChange={e => setCashIn(e.target.value)}
                    onKeyDown={e => { if (e.key==="Enter" && cashIn) { setD(p => ({ ...p, totalCash: parseInt(cashIn)||p.totalCash })); setCashIn(""); } }}
                  />
                  <button className="btn-blue" style={{ padding:"13px 18px" }}
                    onClick={() => { if (cashIn) { setD(p => ({ ...p, totalCash: parseInt(cashIn)||p.totalCash })); setCashIn(""); } }}>
                    저장
                  </button>
                </div>
              </div>

              {/* 엔진2 수익 */}
              <div className="card">
                <div className="row" style={{ marginBottom:12 }}>
                  <span className="t-label">엔진2 단타 수익</span>
                  {d.engine2Profit >= 200 && <span style={{ fontSize:12, fontWeight:700, color:"#F5A623" }}>엔진3 이전 필요 →</span>}
                </div>
                <div style={{ fontSize:28, fontWeight:800, color: d.engine2Profit>=200 ? "#F5A623" : "#191F28", letterSpacing:"-1px", marginBottom:12 }}>
                  {d.engine2Profit.toLocaleString()}<span className="t-unit">만원</span>
                </div>
                <div className="pb" style={{ marginBottom:6 }}>
                  <div className="pf amber" style={{ width:`${Math.min(d.engine2Profit/200*100,100)}%`, background:"#F5A623" }} />
                </div>
                <div className="row" style={{ marginBottom:14 }}>
                  <span className="t-cap">목표 200만원</span>
                  <span className="t-cap">{Math.min(d.engine2Profit/200*100,100).toFixed(0)}%</span>
                </div>
                <input className="inp" placeholder="수익 금액 업데이트 (만원)"
                  value={e2In} onChange={e => setE2In(e.target.value)}
                  onKeyDown={e => { if (e.key==="Enter" && e2In) { setD(p => ({ ...p, engine2Profit: parseInt(e2In)||p.engine2Profit })); setE2In(""); } }}
                />
              </div>

              {/* 오늘 할 일 */}
              <div className="card">
                <div className="row" style={{ marginBottom:4 }}>
                  <span className="t-label">오늘 할 일</span>
                  <button className="btn-ghost" style={{ fontSize:12 }}
                    onClick={() => setD(p => ({ ...p, todos: p.todos.map(t => t.cat==="daily" ? { ...t, done:false } : t) }))}>
                    루틴 초기화
                  </button>
                </div>
                {day1.some(t => !t.done) && <>
                  <div className="section-title">Day 1 · 계좌 대청소</div>
                  {day1.map(t => <TodoItem key={t.id} t={t} onToggle={toggleTodo} />)}
                </>}
                {day1.every(t => t.done) && day2.some(t => !t.done) && <>
                  <div className="section-title">Day 2 · 1회차 장전</div>
                  {day2.map(t => <TodoItem key={t.id} t={t} onToggle={toggleTodo} />)}
                </>}
                <div className="section-title">매일 루틴</div>
                {daily.map(t => <TodoItem key={t.id} t={t} onToggle={toggleTodo} />)}
                {daily.every(t => t.done) && (
                  <div style={{ textAlign:"center", padding:"14px 0", fontSize:14, color:"#00B493", fontWeight:700 }}>
                    오늘 루틴 완료 ✓
                  </div>
                )}
              </div>
            </>}

            {/* ════ 종목 ════ */}
            {tab === "portfolio" && <>
              <div className="card">
                <div className="row" style={{ marginBottom:16 }}>
                  <span className="t-label">보유 종목</span>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span className="t-cap">$1=</span>
                    <input className="inp inp-sm" style={{ width:60 }} value={usdKrw}
                      onChange={e => setUsdKrw(parseFloat(e.target.value)||UKRW)} />
                    <span className="t-cap">원</span>
                    <button className="btn-ghost" onClick={() => setShowTrade(f => !f)}>
                      {showTrade ? "닫기" : "+ 거래"}
                    </button>
                  </div>
                </div>

                {showTrade && (
                  <div className="trade-panel">
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                      {["NVDA","META","PLTR","QLD","BTC"].map(tk => (
                        <button key={tk} className={`tag${tf.ticker===tk?" on-blue":""}`} onClick={() => setTf(f => ({ ...f, ticker:tk }))}>{tk}</button>
                      ))}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                      <button className={`tag${tf.type==="buy"?" on-green":""}`} style={{ justifyContent:"center" }} onClick={() => setTf(f => ({ ...f, type:"buy" }))}>매수</button>
                      <button className={`tag${tf.type==="sell"?" on-red":""}`}  style={{ justifyContent:"center" }} onClick={() => setTf(f => ({ ...f, type:"sell" }))}>매도</button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                      <input className="inp" placeholder="수량 (주)" value={tf.qty}   onChange={e => setTf(f => ({ ...f, qty:e.target.value }))} />
                      <input className="inp" placeholder="단가 ($)"  value={tf.price} onChange={e => setTf(f => ({ ...f, price:e.target.value }))} />
                    </div>
                    <button className="btn-blue" style={{ width:"100%", background: tf.type==="buy" ? "#00B493" : "#F04452" }} onClick={execTrade}>
                      {tf.type==="buy" ? "매수 기록" : "매도 기록"}
                    </button>
                  </div>
                )}

                {d.holdings.map(h => {
                  const cp  = pr[h.ticker] || 0;
                  const ev  = h.qty * cp * usdKrw / 10000;
                  const co  = h.qty * h.avgPrice * usdKrw / 10000;
                  const pnl = ev - co;
                  const pp  = co > 0 ? pnl / co * 100 : 0;
                  return (
                    <div key={h.ticker} className="hold-row">
                      <div className="row">
                        <div className="row-s">
                          <span style={{ fontSize:16, fontWeight:700 }}>{h.ticker}</span>
                          <span className={`chip chip-e${h.engine}`}>E{h.engine}</span>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:17, fontWeight:700 }}>{Math.round(ev).toLocaleString()}<span className="t-unit-sm">만</span></div>
                          <div style={{ fontSize:12, fontWeight:600, color: pnl >= 0 ? "#00B493" : "#F04452" }}>
                            {pnl >= 0 ? "+" : ""}{Math.round(pnl).toLocaleString()}만 ({pp.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                      <div className="row" style={{ marginTop:8 }}>
                        <span className="t-cap">{h.qty}주 × ${cp||"—"} · 평균 ${h.avgPrice}</span>
                        <button className="btn-ghost" style={{ fontSize:12, padding:"6px 12px" }}
                          onClick={() => setEditing(editing?.ticker===h.ticker ? null : { ticker:h.ticker, qty:String(h.qty), avgPrice:String(h.avgPrice) })}>
                          수정
                        </button>
                      </div>
                      {editing?.ticker === h.ticker && (
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8, marginTop:10 }}>
                          <input className="inp" style={{ fontSize:13 }} placeholder="수량" value={editing.qty} onChange={e => setEditing(f => ({ ...f, qty:e.target.value }))} />
                          <input className="inp" style={{ fontSize:13 }} placeholder="평균단가($)" value={editing.avgPrice} onChange={e => setEditing(f => ({ ...f, avgPrice:e.target.value }))} />
                          <button className="btn-blue" style={{ padding:"0 14px" }} onClick={() => {
                            setD(p => ({ ...p, holdings: p.holdings.map(hh => hh.ticker===h.ticker ? { ...hh, qty:parseFloat(editing.qty)||0, avgPrice:parseFloat(editing.avgPrice)||0 } : hh) }));
                            setEditing(null);
                          }}>저장</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {d.trades.length > 0 && (
                <div className="card">
                  <div className="t-label" style={{ marginBottom:12 }}>최근 거래</div>
                  {d.trades.slice(0,8).map((t,i) => (
                    <div key={i} className="row" style={{ padding:"10px 0", borderBottom:"1px solid #F2F4F6" }}>
                      <div className="row-s">
                        <span style={{ fontSize:14, fontWeight:700 }}>{t.ticker}</span>
                        <span style={{ fontSize:12, fontWeight:600, color: t.type==="buy" ? "#00B493" : "#F04452" }}>
                          {t.type==="buy" ? "매수" : "매도"}
                        </span>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div className="t-cap">{t.qty}주 × ${t.price}</div>
                        <div style={{ fontSize:11, color:"#C4CAD4" }}>{t.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>}

            {/* ════ 시뮬 ════ */}
            {tab === "simulation" && <>
              <div className="card">
                <div className="t-label" style={{ marginBottom:4 }}>5년 자산 성장 시뮬레이션</div>
                <div className="t-cap" style={{ marginBottom:16 }}>현재 {totalAsset.toLocaleString()}만원 → 목표 100,000만원</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={simData} margin={{ left:-28, right:4 }}>
                    <XAxis dataKey="label" tick={{ fill:"#C4CAD4", fontSize:9 }} interval={11} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:"#C4CAD4", fontSize:9 }} tickFormatter={v => `${(v/10000).toFixed(0)}억`} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Line dataKey="total" stroke="#3182F6" strokeWidth={2.5} dot={false} name="예상 총자산" />
                    <Line dataKey="goal"  stroke="#E8EDF2" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="목표 10억" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="t-cap" style={{ marginTop:8 }}>엔진1 연20%, 엔진3 연40% 복리, 단타 월30만 수익 가정</div>
              </div>

              <div className="stat-grid" style={{ marginBottom:8 }}>
                <div className="card-sm">
                  <div className="t-label" style={{ marginBottom:10 }}>목표 달성 예상</div>
                  {hitIdx > 0 ? (
                    <>
                      <div style={{ fontSize:20, fontWeight:800, color:"#00B493", letterSpacing:"-0.5px" }}>{simData[hitIdx].label}</div>
                      <div className="t-cap" style={{ marginTop:4 }}>{hitIdx}개월 후</div>
                      <div className="pb" style={{ marginTop:12 }}>
                        <div className="pf green" style={{ width:`${(hitIdx/60)*100}%`, background:"#00B493" }} />
                      </div>
                    </>
                  ) : <div style={{ fontSize:14, fontWeight:700, color:"#F04452" }}>5년 내 미달성</div>}
                </div>

                <div className="card-sm">
                  <div className="t-label" style={{ marginBottom:10 }}>엔진별 기여 (연)</div>
                  <ResponsiveContainer width="100%" height={90}>
                    <BarChart data={[
                      { n:"E1", v:600,                         c:"#00B493" },
                      { n:"E2", v:360,                         c:"#F5A623" },
                      { n:"E3", v:Math.round(e3Val*.4)||2800,  c:"#3182F6" },
                    ]} margin={{ left:-10, right:0, top:4, bottom:0 }}>
                      <XAxis dataKey="n" tick={{ fill:"#8B95A1", fontSize:11 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip formatter={v => [`${v.toLocaleString()}만원`]} contentStyle={{ background:"#fff", border:"1px solid #E8EDF2", borderRadius:10, fontSize:11 }} />
                      <Bar dataKey="v" radius={[5,5,0,0]}>
                        {["#00B493","#F5A623","#3182F6"].map((c,i) => <Cell key={i} fill={c} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div className="t-label" style={{ marginBottom:16 }}>자산 비중</div>
                <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                  <ResponsiveContainer width={110} height={110}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" paddingAngle={2}>
                        {pieData.map((e,i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex:1 }}>
                    {pieData.map((p,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F2F4F6" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:8, height:8, borderRadius:2, background:p.color, flexShrink:0 }} />
                          <span style={{ fontSize:13, color:"#4E5968" }}>{p.name}</span>
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:"#191F28" }}>{p.value.toLocaleString()}만</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>}

            {/* ════ 계획 ════ */}
            {tab === "plan" && <>
              {/* 실적발표 */}
              <div className="card">
                <div className="t-label" style={{ marginBottom:14 }}>실적발표 캘린더</div>
                {earnings.map((e,i) => {
                  const c = e.daysLeft<=7 ? "#F04452" : e.daysLeft<=14 ? "#E09400" : "#8B95A1";
                  const bg= e.daysLeft<=7 ? "#FEECEE" : e.daysLeft<=14 ? "#FEF5E7" : "#F7F8FA";
                  return (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:bg, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#191F28", marginBottom:2 }}>{e.ticker}</div>
                        <div className="t-cap">{e.date}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:18, fontWeight:800, color:c }}>D-{e.daysLeft}</div>
                        <div style={{ fontSize:11, color:c, fontWeight:600, marginTop:2 }}>
                          {e.daysLeft<=7 ? "즉시 매도" : e.daysLeft<=14 ? "매도 준비" : "여유 있음"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 엔진3 분할매수 */}
              <div className="card">
                <div className="t-label" style={{ marginBottom:14 }}>엔진3 분할매수 진행도</div>
                {[
                  { ticker:"NVDA", key:"e3_nvda_rounds", pct:"43%",  desc:"-25% 추적 손절매" },
                  { ticker:"META", key:"e3_meta_rounds", pct:"20%+", desc:"AI수혜 + 현금창출" },
                ].map(item => (
                  <div key={item.ticker} style={{ padding:"14px 0", borderBottom:"1px solid #F2F4F6" }}>
                    <div className="row" style={{ marginBottom:10 }}>
                      <div className="row-s">
                        <span style={{ fontSize:15, fontWeight:700 }}>{item.ticker}</span>
                        <span className="t-cap">{item.pct}</span>
                      </div>
                      <div style={{ display:"flex", gap:5 }}>
                        {[1,2,3,4].map(r => (
                          <button key={r} className={`tag${d[item.key]>=r?" on-blue":""}`}
                            style={{ padding:"6px 11px", fontSize:12 }}
                            onClick={() => setD(p => ({ ...p, [item.key]:r }))}>
                            {r}회
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pb">
                      <div className="pf" style={{ width:`${(d[item.key]/4)*100}%` }} />
                    </div>
                    <div className="t-cap" style={{ marginTop:5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* 2대 철칙 */}
              <div className="card">
                <div className="t-label" style={{ marginBottom:12 }}>2대 절대 철칙</div>
                <div className="rule-box" style={{ marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#F04452", marginBottom:6 }}>철칙 1 — 실적발표 7일 전</div>
                  <div style={{ fontSize:13, color:"#4E5968", lineHeight:1.7 }}>단타계좌 해당 종목 전량 매도 (수익률 불문)<br />어닝쇼크 -15% 갭 하락 방어</div>
                </div>
                <div className="rule-box">
                  <div style={{ fontSize:13, fontWeight:700, color:"#3182F6", marginBottom:6 }}>철칙 2 — 현금 10~15% 상시 유지</div>
                  <div style={{ fontSize:13, color:"#4E5968", lineHeight:1.7 }}>파킹통장 봉인 유지<br />나스닥 -20% 패닉셀링 시 슈퍼총알 발사</div>
                </div>
              </div>

              {/* 월급 배분 + 정기 일정 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div className="card-sm">
                  <div className="t-label" style={{ marginBottom:12 }}>월급 배분</div>
                  {[
                    { bank:"신한", txt:"고정지출", c:"#6366f1" },
                    { bank:"하나", txt:"생활비",   c:"#8b5cf6" },
                    { bank:"한투", txt:"연금 30만", c:"#3182F6" },
                    { bank:"토스", txt:"투자+파킹", c:"#00B493" },
                  ].map(item => (
                    <div key={item.bank} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid #F2F4F6" }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:5, background:`${item.c}18`, color:item.c, minWidth:28, textAlign:"center" }}>{item.bank}</span>
                      <span style={{ fontSize:12, color:"#4E5968" }}>{item.txt}</span>
                    </div>
                  ))}
                </div>

                <div className="card-sm">
                  <div className="t-label" style={{ marginBottom:12 }}>정기 일정</div>
                  {[
                    { when:"매일",   txt:"QLD 5만원" },
                    { when:"16일",   txt:"ACE 30만원" },
                    { when:"월급날", txt:"4곳 이체" },
                    { when:"+200만", txt:"E3 이전" },
                    { when:"NQ-20%", txt:"총알 발사" },
                  ].map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:"1px solid #F2F4F6", alignItems:"center" }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#3182F6", minWidth:42, flexShrink:0 }}>{item.when}</span>
                      <span style={{ fontSize:12, color:"#4E5968" }}>{item.txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>}

          </div>
        </div>
      </div>
    </>
  );
}

function TodoItem({ t, onToggle }) {
  return (
    <button className={`todo-item${t.done ? " done" : ""}`} onClick={() => onToggle(t.id)}>
      <span className={`chk${t.done ? " on" : ""}`}>{t.done ? "✓" : ""}</span>
      <span style={{ fontSize:14, color: t.urgent&&!t.done ? "#F04452" : "#191F28", fontWeight: t.urgent&&!t.done ? 600 : 400, textDecoration: t.done ? "line-through" : "none" }}>
        {t.text}
      </span>
    </button>
  );
}
