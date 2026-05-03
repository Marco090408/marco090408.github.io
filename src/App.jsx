import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
const SUPABASE_URL = "https://hciitzxkkaggkawcpnci.supabase.co";
const SUPABASE_KEY = "sb_publishable_foATWsdcdbm70O4LWMN1Jg_hLw-BDzf";


// ─── Fonts via style injection ────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body, #root { background: #f6f8fa; min-height: 100vh; }

    .ts-app {
      font-family: 'IBM Plex Sans', sans-serif;
      background: #f6f8fa;
      color: #1f2328;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    .ts-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 56px;
      background: #ffffff;
      border-bottom: 1px solid #d0d7de;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .ts-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ts-logo-icon {
      width: 28px;
      height: 28px;
      background: #dcffe4;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .ts-logo-name {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
      color: #1f2328;
    }
    .ts-logo-name span { color: #1a7f37; }
    .ts-header-meta {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .ts-badge {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 4px;
      padding: 3px 8px;
      color: #656d76;
    }
    .ts-badge.demo { color: #bc4c00; border-color: #bc4c0044; background: #fff8f0; }
    .ts-badge.connected { color: #1a7f37; border-color: #1a7f3744; background: #dcffe4; }

    /* ── Main layout ── */
    .ts-main {
      flex: 1;
      padding: 24px 32px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    /* ── Page title ── */
    .ts-page-title {
      margin-bottom: 24px;
    }
    .ts-page-title h1 {
      font-size: 20px;
      font-weight: 600;
      color: #1f2328;
    }
    .ts-page-title p {
      font-size: 13px;
      color: #656d76;
      margin-top: 4px;
    }

    /* ── KPI cards ── */
    .ts-kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .ts-kpi {
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      padding: 16px 20px;
      position: relative;
      overflow: hidden;
    }
    .ts-kpi::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
    }
    .ts-kpi.green::before { background: #1a7f37; }
    .ts-kpi.red::before   { background: #cf222e; }
    .ts-kpi.orange::before { background: #bc4c00; }
    .ts-kpi.blue::before  { background: #0969da; }

    .ts-kpi-label {
      font-size: 11px;
      color: #656d76;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-family: 'IBM Plex Mono', monospace;
      margin-bottom: 8px;
    }
    .ts-kpi-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 28px;
      font-weight: 500;
      line-height: 1;
    }
    .ts-kpi.green .ts-kpi-value { color: #1a7f37; }
    .ts-kpi.red   .ts-kpi-value { color: #cf222e; }
    .ts-kpi.orange .ts-kpi-value { color: #bc4c00; }
    .ts-kpi.blue  .ts-kpi-value { color: #0969da; }
    .ts-kpi-sub {
      font-size: 11px;
      color: #9198a1;
      margin-top: 6px;
    }

    /* ── Two-col layout ── */
    .ts-content-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 16px;
      margin-bottom: 16px;
    }

    /* ── Table ── */
    .ts-card {
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      overflow: hidden;
    }
    .ts-card-header {
      padding: 14px 20px;
      border-bottom: 1px solid #d0d7de;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ts-card-title {
      font-size: 13px;
      font-weight: 600;
      color: #1f2328;
      font-family: 'IBM Plex Mono', monospace;
    }
    .ts-card-subtitle {
      font-size: 11px;
      color: #9198a1;
    }
    table.ts-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .ts-table th {
      padding: 10px 16px;
      text-align: left;
      font-size: 11px;
      font-family: 'IBM Plex Mono', monospace;
      color: #9198a1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 400;
      border-bottom: 1px solid #d0d7de;
      background: #f6f8fa;
    }
    .ts-table td {
      padding: 11px 16px;
      border-bottom: 1px solid #d0d7de44;
      vertical-align: middle;
    }
    .ts-table tr:last-child td { border-bottom: none; }
    .ts-table tr { transition: background 0.1s; cursor: pointer; }
    .ts-table tr:hover td { background: #f3f4f6; }
    .ts-table tr.selected td { background: #ddf4ff; }

    .mono { font-family: 'IBM Plex Mono', monospace; }

    /* ── Status pill ── */
    .ts-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 500;
    }
    .ts-status.kritisch { background: #ffeef0; color: #cf222e; border: 1px solid #cf222e44; }
    .ts-status.warnung  { background: #fff8f0; color: #bc4c00; border: 1px solid #bc4c0044; }
    .ts-status.ok       { background: #dcffe4; color: #1a7f37; border: 1px solid #1a7f3744; }
    .ts-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor;
      animation: pulse-dot 2s infinite; }
    .ts-status.ok .ts-status-dot { animation: none; }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* ── Throttling bar ── */
    .ts-bar-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ts-bar {
      height: 6px;
      border-radius: 3px;
      background: #e6ebf1;
      flex: 1;
      overflow: hidden;
    }
    .ts-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.6s ease;
    }
    .ts-bar-fill.kritisch { background: linear-gradient(90deg, #cf222e, #f85149); }
    .ts-bar-fill.warnung  { background: linear-gradient(90deg, #bc4c00, #f0883e); }
    .ts-bar-fill.ok       { background: linear-gradient(90deg, #1a7f37, #3fb950); }

    /* ── Side panel: temp chart ── */
    .ts-chart-area {
      padding: 16px 8px 8px;
    }

    /* ── Generate button ── */
    .ts-generate-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
    }
    .ts-generate-info h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2328;
    }
    .ts-generate-info p {
      font-size: 12px;
      color: #656d76;
      margin-top: 3px;
    }
    .ts-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .ts-btn.primary {
      background: #1a7f37;
      color: #fff;
    }
    .ts-btn.primary:hover:not(:disabled) { background: #2da44e; transform: translateY(-1px); box-shadow: 0 4px 12px #1a7f3744; }
    .ts-btn.primary:disabled { background: #e6ebf1; color: #9198a1; cursor: not-allowed; }
    .ts-btn.sm { padding: 6px 14px; font-size: 12px; }

    /* ── Spinner ── */
    @keyframes spin { to { transform: rotate(360deg); } }
    .ts-spinner {
      width: 14px; height: 14px;
      border: 2px solid #ffffff44;
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* ── Report ── */
    .ts-report {
      background: #ffffff;
      border: 1px solid #1a7f3744;
      border-radius: 8px;
      overflow: hidden;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ts-report-header {
      background: linear-gradient(135deg, #f0fdf4, #d1fae5);
      border-bottom: 1px solid #1a7f3733;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ts-report-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      color: #1a7f37;
      font-weight: 500;
    }
    .ts-report-meta {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: #9198a1;
    }
    .ts-report-body {
      padding: 24px;
      line-height: 1.7;
      font-size: 13.5px;
      color: #444c56;
      white-space: pre-wrap;
    }
    .ts-report-body h2 {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      color: #1a7f37;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 20px 0 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #d0d7de;
    }
    .ts-report-body h2:first-child { margin-top: 0; }
    .ts-report-body p { margin-bottom: 10px; }
    .ts-report-body strong { color: #1f2328; font-weight: 600; }
    .ts-report-body .highlight-red { color: #cf222e; font-family: 'IBM Plex Mono', monospace; }
    .ts-report-body .highlight-green { color: #1a7f37; font-family: 'IBM Plex Mono', monospace; }
    .ts-report-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 12.5px;
      font-family: 'IBM Plex Mono', monospace;
    }
    .ts-report-body table th {
      padding: 8px 12px;
      background: #f6f8fa;
      color: #9198a1;
      text-align: left;
      border: 1px solid #d0d7de;
      font-size: 11px;
    }
    .ts-report-body table td {
      padding: 8px 12px;
      border: 1px solid #d0d7de;
      color: #444c56;
    }
    .ts-report-body table tr:nth-child(even) td { background: #f6f8fa44; }

    /* ── Typing cursor ── */
    .ts-cursor {
      display: inline-block;
      width: 2px;
      height: 14px;
      background: #1a7f37;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* ── Device detail panel ── */
    .ts-detail {
      padding: 16px;
      font-size: 12px;
    }
    .ts-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      border-bottom: 1px solid #d0d7de;
      color: #656d76;
    }
    .ts-detail-row:last-child { border-bottom: none; }
    .ts-detail-row .val {
      font-family: 'IBM Plex Mono', monospace;
      color: #1f2328;
      font-size: 12px;
    }

    /* ── Temp sparkline ── */
    .ts-temp-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: #9198a1;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f6f8fa; }
    ::-webkit-scrollbar-thumb { background: #d0d7de; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #b0b7c0; }

    /* ── Footer ── */
    .ts-footer {
      text-align: center;
      padding: 16px;
      font-size: 11px;
      color: #9198a1;
      border-top: 1px solid #d0d7de;
      font-family: 'IBM Plex Mono', monospace;
    }
  `}</style>
);



// ─── Generate synthetic temp timeline for selected device ─────────────────────
function makeTempCurve(device) {
  const base = device.temp - 15;
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const activity = (hour >= 8 && hour <= 18) ? 1 : 0.2;
    const spike = (hour === 10 || hour === 14 || hour === 16) ? 1 : 0;
    const noise = (Math.random() - 0.5) * 4;
    const val = base + activity * 18 + spike * device.throttling * 0.3 + noise;
    return { h: `${hour}:00`, t: Math.round(Math.max(50, Math.min(100, val))) };
  });
}

// ─── Report markdown-to-HTML renderer (minimal) ──────────────────────────────
function renderReport(text) {
  // Convert simple markdown to structured HTML
  const lines = text.split('\n');
  const result = [];
  let inTable = false;

  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      result.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      result.push(`<p><strong>${line.slice(2,-2)}</strong></p>`);
    } else if (line.startsWith('| ')) {
      if (!inTable) { result.push('<table><tbody>'); inTable = true; }
      const cells = line.split('|').filter(c => c.trim());
      if (line.includes('---')) {
        // skip separator
      } else if (i < 5 || lines[i+1]?.includes('---')) {
        result.push('<tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr>');
      } else {
        result.push('<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>');
      }
    } else {
      if (inTable) { result.push('</tbody></table>'); inTable = false; }
      if (line.trim()) {
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`(.*?)`/g, `<span style="font-family:'IBM Plex Mono',monospace;color:#0969da;background:#f0f3f9;padding:1px 5px;border-radius:3px">$1</span>`)
          .replace(/🔴/g, '<span class="highlight-red">●</span>')
          .replace(/🟡/g, '<span style="color:#bc4c00">●</span>')
          .replace(/🟢/g, '<span class="highlight-green">●</span>');
        result.push(`<p>${formatted}</p>`);
      } else {
        result.push('<br/>');
      }
    }
  });
  if (inTable) result.push('</tbody></table>');
  return result.join('');
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ThermalSenseApp() {
  // FLEET state lives here — hooks must be inside a component
  const [FLEET, setFLEET] = useState([]);

  useEffect(() => {
    const headers = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` };

    // EPL comes directly from agent's epl_estimate field, averaged in device_summary view
    fetch(`${SUPABASE_URL}/rest/v1/device_summary`, { headers })
    .then(r => r.json())
    .then(summaryRows => {
      const mapped = (Array.isArray(summaryRows) ? summaryRows : []).map(r => {
        const thr = parseFloat(r.avg_throttling) || 0;
        const epl = Math.round((parseFloat(r.avg_epl ?? r.epl_estimate) || 0) * 10) / 10;
        return {
          id:         r.device_id,
          nutzer:     r.nutzer || r.hostname,
          rolle:      "Mitarbeiter",
          gerät:      r.gerät || r.model || "Unbekannt",
          alter:      2.0,
          temp:       parseFloat(r.max_temp) || 0,
          throttling: thr,
          epl,
          status:     thr > 20 ? "kritisch" : thr > 10 ? "warnung" : "ok",
          kosten:     70000,
        };
      });
      setFLEET(mapped);
    })
    .catch(err => console.error("Supabase fetch error:", err));
  }, []);

  // selected starts null — set it once FLEET loads
  const [selected, setSelected] = useState(null);
  const [tempCurve, setTempCurve] = useState([]);

  useEffect(() => {
    if (FLEET.length > 0 && !selected) {
      setSelected(FLEET[0]);
      // tempCurve will be fetched by the selected?.id effect below
    }
  }, [FLEET]);

  // Fetch real temperature history whenever the selected device changes
  useEffect(() => {
    if (!selected) return;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    fetch(
      `${SUPABASE_URL}/rest/v1/telemetry?device_id=eq.${selected.id}&timestamp=gte.${encodeURIComponent(since)}&select=timestamp,cpu_temp&order=timestamp.asc`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    )
    .then(r => r.json())
    .then(rows => {
      const curve = (Array.isArray(rows) ? rows : [])
        .filter(r => r.cpu_temp != null)
        .map(r => ({
          h: new Date(r.timestamp).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
          t: Math.round(parseFloat(r.cpu_temp)),
        }));
      setTempCurve(curve);
    })
    .catch(err => console.error("Temp history fetch error:", err));
  }, [selected?.id]);
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [displayedReport, setDisplayedReport] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const reportRef = useRef(null);

  const criticalDevices = FLEET.filter(d => d.status === "kritisch");
  const warnDevices = FLEET.filter(d => d.status === "warnung");
  const totalEPLCost = FLEET.reduce((sum, d) => {
    const verlust = d.kosten * (0.18 * (d.throttling / 100));
    return sum + verlust;
  }, 0);
  const fleetScore = Math.round(100 - FLEET.reduce((s,d) => s + d.epl, 0) / FLEET.length * 8);

  const handleSelectDevice = (d) => {
    setSelected(d);
    // tempCurve is fetched by the selected?.id useEffect above
  };

  // Typewriter effect for report
  useEffect(() => {
    if (!report || !isTyping) return;
    setDisplayedReport("");
    let i = 0;
    const chunkSize = 8;
    const interval = setInterval(() => {
      i += chunkSize;
      setDisplayedReport(report.slice(0, i));
      if (i >= report.length) {
        setDisplayedReport(report);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [report, isTyping]);

  useEffect(() => {
    if (showReport && reportRef.current) {
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [showReport]);

  const generateReport = async () => {
    setIsGenerating(true);
    setShowReport(true);
    setDisplayedReport("");

    const fleetSummary = FLEET.map(d =>
      `- ${d.nutzer} (${d.gerät}): ${d.temp}°C, Throttling ${d.throttling}%, EPL ${d.epl}%, Status: ${d.status}`
    ).join("\n");

    const prompt = `Du bist ein KI-Analyst für IT-Flottenmanagement bei thermalMS GmbH.
Analysiere folgende Geräteflotte der SMA Solar Technology AG und erstelle einen professionellen Diagnosebericht auf Deutsch.

Flottendaten:
${fleetSummary}

Flottengesundheit: ${fleetScore}/100
Geschätzter Jahresverlust: €${Math.round(totalEPLCost).toLocaleString('de-DE')}
Kritische Geräte: ${criticalDevices.length}

Erstelle einen strukturierten Bericht mit folgenden Abschnitten (Markdown mit ## für Überschriften):
## 1. Zusammenfassung
## 2. Kritische Geräte (Sofortmaßnahmen erforderlich)
## 3. Quantifizierter Produktivitätsverlust
## 4. thermalMS-Maßnahmenplan
## 5. Return on Investment (ROI)
## 6. Priorisierte Handlungsempfehlungen
## Fazit

Nutze die echten Daten aus der Flotte. Füge eine ROI-Rechnung mit PCM-Modul à €80 pro Gerät und €4/Gerät/Monat SaaS ein.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Fehler: Keine Antwort erhalten.";
      setReport(text);
      setIsTyping(true);
    } catch (err) {
      setReport("Fehler beim Abrufen des KI-Berichts: " + err.message);
      setIsTyping(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const statusLabel = { kritisch: "KRITISCH", warnung: "WARNUNG", ok: "OK" };
  const tempColor = (t) => t >= 90 ? "#cf222e" : t >= 80 ? "#bc4c00" : "#1a7f37";

  // Don't render until FLEET and selected are ready
  if (!selected) {
    return (
      <>
        <FontStyle />
        <div className="ts-app" style={{justifyContent:"center",alignItems:"center"}}>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",color:"#9198a1",fontSize:13,marginTop:80,textAlign:"center"}}>
            ● Lade Flottendaten…
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FontStyle />
      <div className="ts-app">
        {/* ── Header ── */}
        <header className="ts-header">
          <div className="ts-logo">
            <div className="ts-logo-icon">🌡</div>
            <div className="ts-logo-name">thermal<span>MS</span></div>
          </div>
          <div className="ts-header-meta">
            <span className="ts-badge connected">● KI-Agent verbunden</span>
            <span className="ts-badge">SMA Solar AG · DACH-Flotte</span>
            <span className="ts-badge demo">TECH DEMO</span>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="ts-main">
          {/* Page title */}
          <div className="ts-page-title">
            <h1>Flottendiagnose — Thermal Throttling Monitor</h1>
            <p>Echtzeit-Analyse · 8 Geräte überwacht · Letzter Sync: {new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})} Uhr</p>
          </div>

          {/* KPI row */}
          <div className="ts-kpi-row">
            <div className="ts-kpi green">
              <div className="ts-kpi-label">Flottengesundheit</div>
              <div className="ts-kpi-value">{fleetScore}</div>
              <div className="ts-kpi-sub">von 100 Punkten</div>
            </div>
            <div className="ts-kpi red">
              <div className="ts-kpi-label">Kritische Geräte</div>
              <div className="ts-kpi-value">{criticalDevices.length}</div>
              <div className="ts-kpi-sub">Sofortmaßnahme erforderlich</div>
            </div>
            <div className="ts-kpi orange">
              <div className="ts-kpi-label">Warnungen</div>
              <div className="ts-kpi-value">{warnDevices.length}</div>
              <div className="ts-kpi-sub">Beobachtung empfohlen</div>
            </div>
            <div className="ts-kpi blue">
              <div className="ts-kpi-label">Jährl. Produktivitätsverlust</div>
              <div className="ts-kpi-value">€ {Math.round(totalEPLCost/1000)}k</div>
              <div className="ts-kpi-sub">durch Thermal Throttling</div>
            </div>
          </div>

          {/* Content grid */}
          <div className="ts-content-grid">
            {/* Fleet table */}
            <div className="ts-card">
              <div className="ts-card-header">
                <span className="ts-card-title">GERÄTEÜBERSICHT</span>
                <span className="ts-card-subtitle">Klick zum Auswählen</span>
              </div>
              <table className="ts-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nutzer</th>
                    <th>Gerät</th>
                    <th>Max. Temp.</th>
                    <th>Throttling</th>
                    <th>EPL</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {FLEET.map(d => (
                    <tr
                      key={d.id}
                      className={selected.id === d.id ? "selected" : ""}
                      onClick={() => handleSelectDevice(d)}
                    >
                      <td className="mono" style={{color:"#9198a1"}}>{String(d.id).padStart(2,'0')}</td>
                      <td>
                        <div style={{fontWeight:500, fontSize:13}}>{d.nutzer}</div>
                        <div style={{fontSize:11,color:"#9198a1"}}>{d.rolle}</div>
                      </td>
                      <td style={{color:"#656d76",fontSize:12}}>{d.gerät}</td>
                      <td className="mono" style={{color: tempColor(d.temp), fontWeight:500}}>
                        {d.temp}°C
                      </td>
                      <td>
                        <div className="ts-bar-wrap">
                          <div className="ts-bar" style={{width:80}}>
                            <div
                              className={`ts-bar-fill ${d.status}`}
                              style={{width:`${Math.min(100, d.throttling * 2.5)}%`}}
                            />
                          </div>
                          <span className="mono" style={{fontSize:12, color: tempColor(d.temp), minWidth:30}}>
                            {d.throttling}%
                          </span>
                        </div>
                      </td>
                      <td className="mono" style={{fontSize:12, color:"#656d76"}}>{d.epl}%</td>
                      <td>
                        <span className={`ts-status ${d.status}`}>
                          <span className="ts-status-dot"/>
                          {statusLabel[d.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right panel */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {/* Device detail */}
              <div className="ts-card">
                <div className="ts-card-header">
                  <span className="ts-card-title">GERÄT {String(selected.id).padStart(2,'0')}</span>
                  <span className={`ts-status ${selected.status}`} style={{fontSize:10}}>
                    <span className="ts-status-dot"/>
                    {statusLabel[selected.status]}
                  </span>
                </div>
                <div className="ts-detail">
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:600,color:'#1f2328'}}>{selected.nutzer}</div>
                    <div style={{fontSize:12,color:'#656d76'}}>{selected.rolle}</div>
                  </div>
                  {[
                    ["Gerät", selected.gerät],
                    ["Gerätealter", selected.alter + " Jahre"],

                    ["Max. Temperatur", selected.temp + "°C"],
                    ["Throttling", selected.throttling + "%"],
                    ["EPL / Jahr", selected.epl + "%"],
                    ["Prod.-Verlust", `€ ${Math.round(selected.kosten * 0.18 * selected.throttling / 100).toLocaleString('de-DE')} / Jahr`],
                    ["PCM-Kompatibel", "✓ Ja"],
                  ].map(([k,v]) => (
                    <div className="ts-detail-row" key={k}>
                      <span>{k}</span>
                      <span className="val" style={{
                        color: k === "Max. Temperatur" ? tempColor(selected.temp)
                              : k === "Prod.-Verlust" ? "#cf222e"
                              : k === "PCM-Kompatibel" ? "#1a7f37"
                              : undefined
                      }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temp chart */}
              <div className="ts-card">
                <div className="ts-card-header">
                  <span className="ts-card-title">TEMPERATURVERLAUF</span>
                  <span className="ts-card-subtitle">letzte 24 h · {tempCurve.length} Messpunkte</span>
                </div>
                <div className="ts-chart-area">
                  {tempCurve.length === 0 ? (
                    <div style={{height:140,display:"flex",alignItems:"center",justifyContent:"center",
                      color:"#9198a1",fontSize:12,fontFamily:"'IBM Plex Mono',monospace"}}>
                      Keine Messdaten in den letzten 24 h
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={tempCurve} margin={{top:5,right:12,left:-20,bottom:0}}>
                      <XAxis dataKey="h" tick={{fill:"#9198a1",fontSize:9,fontFamily:"'IBM Plex Mono'"}}
                        tickLine={false} axisLine={false}
                        interval={Math.max(0, Math.floor(tempCurve.length / 6) - 1)} />
                      <YAxis tick={{fill:"#9198a1",fontSize:9,fontFamily:"'IBM Plex Mono'"}}
                        tickLine={false} axisLine={false}
                        domain={([min, max]) => [Math.max(0, Math.floor(min) - 5), Math.ceil(max) + 5]}
                        tickFormatter={(v) => `${v}°`} />
                      <Tooltip
                        contentStyle={{background:"#ffffff",border:"1px solid #d0d7de",borderRadius:6,fontSize:11,fontFamily:"'IBM Plex Mono'"}}
                        labelStyle={{color:"#656d76"}}
                        itemStyle={{color:"#1f2328"}}
                        formatter={(v) => [`${v}°C`, "Temp"]}
                      />
                      <ReferenceLine y={90} stroke="#cf222e44" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="t"
                        stroke={tempColor(selected.temp)}
                        strokeWidth={1.5} dot={false}
                        activeDot={{r:3,fill:tempColor(selected.temp)}} />
                    </LineChart>
                  </ResponsiveContainer>
                  )}
                  <div style={{textAlign:'center',fontSize:10,color:'#9198a1',fontFamily:"'IBM Plex Mono'",marginTop:2}}>
                    ── {tempColor(selected.temp) === "#cf222e" ? "Kritisch" : tempColor(selected.temp) === "#bc4c00" ? "Warnung" : "Normal"} &nbsp;|&nbsp; Throttling-Schwelle: 90°C
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate bar */}
          <div className="ts-generate-bar">
            <div className="ts-generate-info">
              <h3>KI-Diagnosebericht generieren</h3>
              <p>
                Claude analysiert alle 8 Geräte und erstellt eine priorisierte Handlungsempfehlung mit ROI-Berechnung.
                {" "}
                <span style={{color:'#bc4c00', fontFamily:"'IBM Plex Mono'",fontSize:11}}>
                  {criticalDevices.length} kritische Geräte · geschätzter Jahresverlust: €{Math.round(totalEPLCost/1000)}k
                </span>
              </p>
            </div>
            <button
              className="ts-btn primary"
              onClick={generateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><span className="ts-spinner"/>Analysiere…</>
              ) : (
                <>⚡ KI-Bericht generieren</>
              )}
            </button>
          </div>

          {/* Report */}
          {showReport && (
            <div className="ts-report" ref={reportRef}>
              <div className="ts-report-header">
                <div>
                  <div className="ts-report-title">
                    ▸ thermalMS KI-Diagnosebericht · SMA Solar AG
                  </div>
                  <div className="ts-report-meta" style={{marginTop:4}}>
                    Generiert: {new Date().toLocaleString('de-DE')} · Modell: Claude Sonnet · 8 Geräte analysiert
                  </div>
                </div>
                {!isTyping && !isGenerating && displayedReport && (
                  <button className="ts-btn primary sm" onClick={() => {
                    const blob = new Blob([displayedReport], {type:'text/plain'});
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'thermalMS_Bericht_SMA.txt';
                    a.click();
                  }}>
                    ↓ Export
                  </button>
                )}
              </div>
              <div className="ts-report-body">
                {isGenerating && !displayedReport ? (
                  <div style={{color:'#9198a1',fontFamily:"'IBM Plex Mono'",fontSize:12}}>
                    ● Verbinde mit Claude API…<span className="ts-cursor"/>
                  </div>
                ) : (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: renderReport(displayedReport) }}
                    />
                    {isTyping && <span className="ts-cursor"/>}
                  </>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="ts-footer">
          thermalMS GmbH · Tech Demo v1.0 · business@school Wettbewerb 2025/2026 · Geisenheim
          &nbsp;·&nbsp; KI-Analyse powered by Claude (Anthropic)
        </footer>
      </div>
    </>
  );
}
