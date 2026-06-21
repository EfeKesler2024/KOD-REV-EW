import { useState, useRef } from "react";

const LANGS = ["Otomatik algıla", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "SQL", "HTML/CSS"];

const SEVERITY = {
  critical: { label: "Kritik", color: "#f85149", bg: "rgba(248,81,73,0.12)", icon: "✕" },
  warning:  { label: "Uyarı",  color: "#d29922", bg: "rgba(210,153,34,0.12)", icon: "▲" },
  info:     { label: "Öneri",  color: "#58a6ff", bg: "rgba(88,166,255,0.12)", icon: "i" },
  style:    { label: "Stil",   color: "#a371f7", bg: "rgba(163,113,247,0.12)", icon: "✎" },
};

const REVIEW_SYSTEM = `Sen kıdemli bir yazılım mühendisisin ve kod review yapıyorsun. Verilen kodu titizlikle incele.

SADECE geçerli JSON döndür, başka HİÇBİR şey yazma (markdown, açıklama, backtick yok).

JSON formatı:
{
  "language": "algılanan dil",
  "score": 0-100 arası genel kalite puanı (integer),
  "summary": "1-2 cümle Türkçe genel değerlendirme",
  "findings": [
    {
      "severity": "critical" | "warning" | "info" | "style",
      "line": satır numarası (integer, bilinmiyorsa null),
      "title": "kısa başlık (Türkçe)",
      "description": "sorunun açıklaması (Türkçe)",
      "suggestion": "nasıl düzeltilir (Türkçe)"
    }
  ],
  "improved_code": "tüm önerilerle iyileştirilmiş kodun tam hali (string)",
  "metrics": {
    "security": 0-100 güvenlik puanı (integer),
    "performance": 0-100 performans puanı (integer),
    "readability": 0-100 okunabilirlik puanı (integer),
    "maintainability": 0-100 sürdürülebilirlik puanı (integer)
  },
  "lang_mismatch": "kullanıcı bir dil seçtiyse ve kod o dilde DEĞİLSE, burada Türkçe net uyarı yaz (örn. 'Java seçtiniz ama kod Python.'). Uyumluysa veya dil seçilmediyse null."
}

Kurallar:
- Güvenlik açıkları, bug'lar, performans sorunları "critical" veya "warning"
- Best practice ve okunabilirlik "info"
- Biçimlendirme/isimlendirme "style"
- improved_code orijinal kodla aynı dilde, çalışır ve eksiksiz olsun
- ÖNEMLİ: improved_code'da SADECE gerçekten düzeltilmesi gereken satırları değiştir. Sorunsuz satırları girinti, boşluk ve biçim dahil BİREBİR AYNI bırak. Gereksiz yeniden biçimlendirme (reformat) YAPMA — yoksa karşılaştırma (diff) tüm dosyayı değişmiş gibi gösterir. Orijinalin girinti stilini (tab/boşluk sayısı), satır sonlarını ve boş satırlarını koru.
- findings boş olabilir (kod kusursuzsa)
- DİL KONTROLÜ: Kullanıcı belirli bir dil seçtiyse, kodun gerçekten o dilde olup olmadığını KONTROL ET. Uyumsuzsa "lang_mismatch" alanını net bir uyarıyla doldur, "language" alanına kodun GERÇEK dilini yaz, ve ilk finding olarak "critical" severity ile dil uyuşmazlığını ekle.`;

const KEYWORDS = new Set([
  "function","return","if","else","for","while","do","switch","case","break","continue",
  "const","let","var","class","new","import","from","export","default","async","await",
  "try","catch","finally","throw","typeof","instanceof","this","super","extends","yield",
  "def","elif","lambda","pass","raise","with","as","in","is","not","and","or","None","True","False","self","print",
  "public","private","protected","static","void","int","float","double","char","bool","string","boolean","long","short",
  "package","interface","implements","struct","enum","fn","mut","pub","use","impl","match","fmt","nil","func","go","defer","type",
  "SELECT","FROM","WHERE","INSERT","UPDATE","DELETE","JOIN","AND","OR","NULL","echo","require","include","null","true","false",
]);

function tokenize(line) {
  const tokens = [];
  const re = /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w])/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) tokens.push(["comment", m[1]]);
    else if (m[2]) tokens.push(["string", m[2]]);
    else if (m[3]) tokens.push(["number", m[3]]);
    else if (m[4]) tokens.push([KEYWORDS.has(m[4]) ? "keyword" : "ident", m[4]]);
    else if (m[5]) tokens.push(["ws", m[5]]);
    else if (m[6]) tokens.push(["punct", m[6]]);
  }
  return tokens;
}

const TOKEN_COLOR = {
  comment: "#8b949e", string: "#a5d6ff", number: "#79c0ff",
  keyword: "#ff7b72", ident: "#c9d1d9", punct: "#c9d1d9", ws: "#c9d1d9",
};

function Highlighted({ line }) {
  return (
    <>{tokenize(line).map((t, i) => (
      <span key={i} style={{ color: TOKEN_COLOR[t[0]] }}>{t[1]}</span>
    ))}</>
  );
}

function diffLines(a, b) {
  // Satır sonu ve sondaki boşlukları normalize et (görünmez farklar "değişiklik" sayılmasın)
  const norm = (s) => s.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");
  const A = norm(a).split("\n"), B = norm(b).split("\n");
  const n = A.length, m = B.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const rows = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { rows.push({ type: "same", text: A[i], ln: i + 1, rn: j + 1 }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { rows.push({ type: "del", text: A[i], ln: i + 1, rn: null }); i++; }
    else { rows.push({ type: "add", text: B[j], ln: null, rn: j + 1 }); j++; }
  }
  while (i < n) { rows.push({ type: "del", text: A[i], ln: i + 1, rn: null }); i++; }
  while (j < m) { rows.push({ type: "add", text: B[j], ln: null, rn: j + 1 }); j++; }
  return rows;
}

const DIFF_STYLE = {
  same: { bg: "transparent", gutter: "#484f58", sign: " " },
  add:  { bg: "rgba(63,185,80,0.15)", gutter: "#3fb950", sign: "+" },
  del:  { bg: "rgba(248,81,73,0.15)", gutter: "#f85149", sign: "-" },
};

// Birleşik diff satırlarını yan yana hizalar: del'leri add'lerle eşler.
function buildSplitRows(rows) {
  const out = [];
  let i = 0;
  while (i < rows.length) {
    const r = rows[i];
    if (r.type === "same") { out.push({ left: r, right: r }); i++; }
    else {
      const dels = [], adds = [];
      while (i < rows.length && rows[i].type === "del") dels.push(rows[i++]);
      while (i < rows.length && rows[i].type === "add") adds.push(rows[i++]);
      const max = Math.max(dels.length, adds.length);
      for (let k = 0; k < max; k++) out.push({ left: dels[k] || null, right: adds[k] || null });
    }
  }
  return out;
}

export default function KodReviewBot() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState(LANGS[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("findings");
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [diffView, setDiffView] = useState("unified");
  const [highlightLine, setHighlightLine] = useState(null);
  const editorWrapRef = useRef(null);
  const taRef = useRef(null);
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);
  const fileInputRef = useRef(null);

  const lineCount = code ? code.split("\n").length : 0;

  // Dosya uzantısından dil tespiti
  const EXT_TO_LANG = {
    js: "JavaScript", jsx: "JavaScript", mjs: "JavaScript", cjs: "JavaScript",
    ts: "TypeScript", tsx: "TypeScript",
    py: "Python", pyw: "Python",
    java: "Java",
    cpp: "C++", cc: "C++", cxx: "C++", "c++": "C++", hpp: "C++", h: "C++",
    cs: "C#",
    go: "Go",
    rs: "Rust",
    php: "PHP",
    rb: "Ruby",
    swift: "Swift",
    kt: "Kotlin", kts: "Kotlin",
    sql: "SQL",
    html: "HTML/CSS", htm: "HTML/CSS", css: "HTML/CSS",
  };

  function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target.result || "";
      setCode(content);
      setResult(null);
      setError(null);
      // Uzantıdan dili otomatik seç
      const ext = file.name.split(".").pop().toLowerCase();
      const detected = EXT_TO_LANG[ext];
      if (detected && LANGS.includes(detected)) {
        setLang(detected);
      }
    };
    reader.onerror = () => setError("Dosya okunamadı. Tekrar dene.");
    reader.readAsText(file);
    // Aynı dosyayı tekrar seçebilmek için input'u sıfırla
    e.target.value = "";
  }

  async function runReview() {
    if (!code.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    const userMsg = `${lang !== LANGS[0] ? `Kullanıcının seçtiği dil: ${lang}. Bu kodun gerçekten ${lang} olup olmadığını kontrol et; değilse uyar.\n\n` : ""}İncelenecek kod:\n\n${code}`;
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("API anahtarı eksik! .env dosyasına REACT_APP_OPENAI_API_KEY ekle.");
      }
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", max_tokens: 4000, temperature: 0.2,
          messages: [
            { role: "system", content: REVIEW_SYSTEM },
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`API hatası: ${data.error?.message || response.statusText}`);
      }
      let text = data.choices?.[0]?.message?.content || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      // JSON'u metin içinden çıkar (baştaki/sondaki fazlalıkları temizle)
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.slice(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(text);
      setResult(parsed); setTab("findings"); setFilter("all");
    } catch (err) {
      console.error("Review error:", err);
      setError(`Analiz tamamlanamadı: ${err.message || "bilinmeyen hata"}. Tekrar dene.`);
    } finally { setLoading(false); }
  }

  function copyImproved() {
    if (!result?.improved_code) return;
    const ta = document.createElement("textarea");
    ta.value = result.improved_code;
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  function exportPDF() {
    if (!result) return;
    const esc = (s) => String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const sevTr = { critical: "KRİTİK", warning: "UYARI", suggestion: "ÖNERİ", style: "STİL" };
    const sevColor = { critical: "#cf222e", warning: "#9a6700", suggestion: "#1a7f37", style: "#57606a" };
    const now = new Date().toLocaleString("tr-TR");
    const m = result.metrics || {};

    const findingsHtml = (result.findings || []).map((f) => `
      <div class="finding" style="border-left:4px solid ${sevColor[f.severity] || "#57606a"}">
        <div class="f-head">
          <span class="badge" style="background:${sevColor[f.severity] || "#57606a"}">${sevTr[f.severity] || esc(f.severity)}</span>
          ${f.line != null ? `<span class="f-line">Satır ${esc(f.line)}</span>` : ""}
        </div>
        <div class="f-title">${esc(f.title)}</div>
        <div class="f-desc">${esc(f.description)}</div>
      </div>`).join("");

    const metricRow = (label, val) => `
      <div class="metric">
        <div class="m-label">${label}</div>
        <div class="m-bar"><div class="m-fill" style="width:${val || 0}%"></div></div>
        <div class="m-val">${val || 0}/100</div>
      </div>`;

    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<title>Kod İnceleme Raporu</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #1f2328; margin: 0; padding: 32px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .sub { color: #57606a; font-size: 12px; margin-bottom: 20px; }
  .card { border: 1px solid #d0d7de; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
  .score-wrap { display: flex; align-items: center; gap: 16px; }
  .score { font-size: 40px; font-weight: 700; }
  .summary { font-size: 13px; line-height: 1.5; color: #1f2328; }
  h2 { font-size: 15px; margin: 0 0 12px; border-bottom: 1px solid #d0d7de; padding-bottom: 6px; }
  .metric { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 12px; }
  .m-label { width: 130px; }
  .m-bar { flex: 1; height: 8px; background: #eaeef2; border-radius: 4px; overflow: hidden; }
  .m-fill { height: 100%; background: #1a7f37; }
  .m-val { width: 56px; text-align: right; color: #57606a; }
  .finding { padding: 10px 12px; margin-bottom: 10px; background: #f6f8fa; border-radius: 4px; }
  .f-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .badge { color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
  .f-line { color: #57606a; font-size: 11px; }
  .f-title { font-weight: 600; font-size: 13px; margin-bottom: 3px; }
  .f-desc { font-size: 12px; line-height: 1.5; color: #424a53; }
  pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 12px; font-size: 11px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; font-family: 'SF Mono', Consolas, monospace; }
  .foot { margin-top: 24px; text-align: center; color: #8c959f; font-size: 10px; }
  @media print { body { padding: 0; } .card, .finding { break-inside: avoid; } .no-print { display: none !important; } }
  .topbar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #d0d7de; padding: 12px 0; margin: -32px -32px 20px; padding-left: 32px; padding-right: 32px; display: flex; justify-content: space-between; align-items: center; z-index: 10; }
  .dl-btn { background: #1f883d; color: #fff; border: none; border-radius: 6px; padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; }
  .dl-btn:hover { background: #1a7f37; }
  .dl-hint { color: #57606a; font-size: 12px; }
</style></head><body>
  <div class="topbar no-print">
    <span class="dl-hint">Rapor hazır. İndirmek için butona bas → açılan ekranda "PDF olarak kaydet" seç.</span>
    <button class="dl-btn" onclick="window.print()">⬇ PDF İndir</button>
  </div>
  <h1>🔍 Kod İnceleme Raporu</h1>
  <div class="sub">Dil: ${esc(result.language || lang)} &nbsp;·&nbsp; Tarih: ${esc(now)}</div>

  <div class="card">
    <div class="score-wrap">
      <div class="score" style="color:${result.score >= 70 ? "#1a7f37" : result.score >= 40 ? "#9a6700" : "#cf222e"}">${esc(result.score)}<span style="font-size:18px;color:#8c959f">/100</span></div>
      <div class="summary">${esc(result.summary)}</div>
    </div>
  </div>

  ${result.metrics ? `<div class="card"><h2>Metrikler</h2>
    ${metricRow("Güvenlik", m.security)}
    ${metricRow("Performans", m.performance)}
    ${metricRow("Okunabilirlik", m.readability)}
    ${metricRow("Sürdürülebilirlik", m.maintainability)}
  </div>` : ""}

  <div class="card"><h2>Bulgular (${(result.findings || []).length})</h2>
    ${findingsHtml || "<div style='color:#57606a;font-size:12px'>Bulgu yok.</div>"}
  </div>

  ${result.improved_code ? `<div class="card"><h2>İyileştirilmiş Kod</h2><pre>${esc(result.improved_code)}</pre></div>` : ""}

  <div class="foot">Kod İnceleme Botu ile oluşturuldu</div>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      setError("PDF için açılır pencereye izin ver (pop-up engelleyici).");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Otomatik yazdırma yok — kullanıcı rapor önizlemesini görür, "PDF İndir" butonuyla indirir
  }

  function jumpToLine(line) {
    if (line == null) return;
    setHighlightLine(line);
    const lineHeight = 20;
    const apply = () => {
      const ta = taRef.current;
      if (!ta) return;
      // editörü görünür alana getir (mobilde sağ panel kaplıyorsa)
      if (editorWrapRef.current) {
        editorWrapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // satırı dikey ortaya yakın konumla
      const visibleH = ta.clientHeight || 300;
      const target = Math.max(0, (line - 1) * lineHeight - visibleH / 2 + lineHeight);
      ta.scrollTop = target;
      if (highlightRef.current) highlightRef.current.scrollTop = target;
      if (gutterRef.current) gutterRef.current.scrollTop = target;
    };
    requestAnimationFrame(() => requestAnimationFrame(apply));
    setTimeout(() => setHighlightLine(null), 2400);
  }

  const counts = result
    ? result.findings.reduce((acc, f) => { acc[f.severity] = (acc[f.severity] || 0) + 1; return acc; }, {})
    : {};
  const visibleFindings = result
    ? result.findings.filter((f) => filter === "all" || f.severity === filter) : [];
  const scoreColor = (s) => (s >= 80 ? "#3fb950" : s >= 50 ? "#d29922" : "#f85149");
  const diffRows = result ? diffLines(code, result.improved_code) : [];
  const addCount = diffRows.filter((r) => r.type === "add").length;
  const delCount = diffRows.filter((r) => r.type === "del").length;
  const splitRows = buildSplitRows(diffRows);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#0d1117", color: "#c9d1d9",
      fontFamily: "'SF Mono','JetBrains Mono',Menlo,Consolas,monospace", fontSize: 13,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
        background: "#161b22", borderBottom: "1px solid #30363d", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <span style={{ marginLeft: 8, color: "#8b949e", fontSize: 12 }}>⌘ kod-review.bot</span>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0, flexWrap: "wrap" }}>
        <div ref={editorWrapRef} style={{
          flex: "1 1 360px", display: "flex", flexDirection: "column",
          borderRight: "1px solid #30363d", minHeight: 0, minWidth: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px", borderBottom: "1px solid #30363d", gap: 8, flexWrap: "wrap",
          }}>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{
              background: "#21262d", color: "#c9d1d9", border: "1px solid #30363d",
              borderRadius: 6, padding: "5px 8px", fontSize: 12, fontFamily: "inherit",
              outline: "none", cursor: "pointer",
            }}>{LANGS.map((l) => <option key={l}>{l}</option>)}</select>

            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.jsx,.mjs,.cjs,.ts,.tsx,.py,.pyw,.java,.cpp,.cc,.cxx,.hpp,.h,.cs,.go,.rs,.php,.rb,.swift,.kt,.kts,.sql,.html,.htm,.css,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{
              background: "#21262d", color: "#c9d1d9", border: "1px solid #30363d",
              borderRadius: 6, padding: "5px 10px", fontSize: 12, fontFamily: "inherit",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}>📁 Dosya Yükle</button>

            <span style={{ color: "#484f58", fontSize: 11, marginLeft: "auto" }}>{lineCount} satır</span>
          </div>

          <div style={{ flex: 1, display: "flex", minHeight: 0, background: "#0d1117", overflow: "hidden" }}>
            <div ref={gutterRef} style={{
              padding: "12px 6px 12px 12px", color: "#484f58", textAlign: "right",
              userSelect: "none", fontSize: 13, lineHeight: "20px", overflow: "hidden",
              minWidth: 40, background: "#0d1117", flexShrink: 0,
            }}>
              {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                <div key={i} style={{
                  color: highlightLine === i + 1 ? "#d29922" : "#484f58",
                  fontWeight: highlightLine === i + 1 ? 700 : 400,
                }}>{i + 1}</div>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative", minWidth: 0, background: "#0d1117" }}>
              <pre ref={highlightRef} aria-hidden style={{
                position: "absolute", inset: 0, margin: 0, padding: "12px",
                fontSize: 13, lineHeight: "20px", fontFamily: "inherit",
                whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "hidden",
                pointerEvents: "none", background: "#0d1117",
              }}>
                {(code || "").split("\n").map((ln, i) => (
                  <div key={i} style={{
                    background: highlightLine === i + 1 ? "rgba(210,153,34,0.28)" : "transparent",
                    transition: "background 0.3s", borderRadius: 2,
                  }}>{ln ? <Highlighted line={ln} /> : "\u00A0"}</div>
                ))}
              </pre>
              <textarea
                ref={taRef}
                value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                onScroll={(e) => {
                  const t = e.target.scrollTop;
                  if (highlightRef.current) highlightRef.current.scrollTop = t;
                  if (gutterRef.current) gutterRef.current.scrollTop = t;
                }}
                placeholder="// Review edilecek kodu buraya yapıştır..."
                style={{
                  position: "absolute", inset: 0, background: "transparent",
                  color: "transparent", caretColor: "#c9d1d9", border: "none",
                  outline: "none", resize: "none", padding: "12px", fontSize: 13,
                  lineHeight: "20px", fontFamily: "inherit", tabSize: 2,
                  whiteSpace: "pre-wrap", wordBreak: "break-word", overflowY: "auto",
                }}
              />
            </div>
          </div>

          <div style={{ padding: 12, borderTop: "1px solid #30363d" }}>
            <button onClick={runReview} disabled={!code.trim() || loading} style={{
              width: "100%", padding: "10px", borderRadius: 6, border: "none",
              background: code.trim() && !loading ? "#238636" : "#21262d",
              color: code.trim() && !loading ? "#fff" : "#484f58",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              cursor: code.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? (<><span className="spin" style={{
                width: 13, height: 13, border: "2px solid #484f58",
                borderTopColor: "#c9d1d9", borderRadius: "50%", display: "inline-block",
              }} /> İnceleniyor...</>) : "▶ Review Başlat"}
            </button>
          </div>
        </div>

        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
          {!result && !loading && !error && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "#484f58", padding: 24, textAlign: "center", gap: 8,
            }}>
              <div style={{ fontSize: 32 }}>🔍</div>
              <div>Sonuçlar burada görünecek</div>
              <div style={{ fontSize: 11, maxWidth: 240 }}>Kodunu sol tarafa yapıştır ve "Review Başlat"a bas</div>
            </div>
          )}

          {loading && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "#8b949e", gap: 12,
            }}>
              <span className="spin" style={{
                width: 28, height: 28, border: "3px solid #21262d",
                borderTopColor: "#58a6ff", borderRadius: "50%",
              }} />
              <div style={{ fontSize: 12 }}>Kod analiz ediliyor...</div>
            </div>
          )}

          {error && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "#f85149", gap: 8, padding: 24, textAlign: "center",
            }}>
              <div style={{ fontSize: 24 }}>⚠</div>
              <div style={{ fontSize: 12 }}>{error}</div>
            </div>
          )}

          {result && (
            <>
              {result.lang_mismatch && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px",
                  background: "rgba(248,81,73,0.15)", borderBottom: "1px solid #f85149",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 16, lineHeight: 1.2 }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#f85149", fontSize: 12.5, marginBottom: 2 }}>
                      Dil uyuşmazlığı
                    </div>
                    <div style={{ fontSize: 12, color: "#ffb3ae", lineHeight: 1.4 }}>
                      {result.lang_mismatch}
                    </div>
                  </div>
                </div>
              )}
              <div style={{
                padding: "14px", borderBottom: "1px solid #30363d", display: "flex",
                alignItems: "center", gap: 14,
              }}>
                <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                  <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#21262d" strokeWidth="5" />
                    <circle cx="28" cy="28" r="24" fill="none" stroke={scoreColor(result.score)}
                      strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 150.8} 150.8`} />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 16, fontWeight: 700, color: scoreColor(result.score),
                  }}>{result.score}</div>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 3 }}>
                    {result.language} · Kalite Puanı
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.4, color: "#c9d1d9" }}>{result.summary}</div>
                </div>
                <button onClick={exportPDF} title="Raporu PDF olarak indir" style={{
                  flexShrink: 0, alignSelf: "flex-start", background: "#21262d", color: "#c9d1d9",
                  border: "1px solid #30363d", borderRadius: 6, padding: "6px 10px",
                  fontSize: 11, fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                }}>📄 PDF</button>
              </div>

              {result.metrics && (
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px",
                  padding: "12px 14px", borderBottom: "1px solid #30363d", flexShrink: 0,
                }}>
                  {[
                    ["Güvenlik", result.metrics.security],
                    ["Performans", result.metrics.performance],
                    ["Okunabilirlik", result.metrics.readability],
                    ["Sürdürülebilirlik", result.metrics.maintainability],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                        <span style={{ color: "#8b949e" }}>{label}</span>
                        <span style={{ color: scoreColor(val ?? 0), fontWeight: 600 }}>{val ?? "-"}</span>
                      </div>
                      <div style={{ height: 5, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          width: `${val ?? 0}%`, height: "100%", background: scoreColor(val ?? 0),
                          borderRadius: 3, transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
                {[["findings", `Bulgular (${result.findings.length})`], ["diff", "Diff"], ["code", "İyileştirilmiş Kod"]].map(([k, label]) => (
                  <button key={k} onClick={() => setTab(k)} style={{
                    flex: 1, padding: "10px", background: "none", border: "none",
                    borderBottom: tab === k ? "2px solid #58a6ff" : "2px solid transparent",
                    color: tab === k ? "#c9d1d9" : "#8b949e", fontFamily: "inherit",
                    fontSize: 12, cursor: "pointer", fontWeight: tab === k ? 600 : 400,
                  }}>{label}</button>
                ))}
              </div>

              {tab === "findings" && (
                <>
                  <div style={{
                    display: "flex", gap: 6, padding: "10px 12px", flexWrap: "wrap",
                    borderBottom: "1px solid #21262d", flexShrink: 0,
                  }}>
                    <Chip active={filter === "all"} onClick={() => setFilter("all")}
                      color="#8b949e" label={`Tümü ${result.findings.length}`} />
                    {Object.entries(SEVERITY).map(([k, s]) =>
                      counts[k] ? (
                        <Chip key={k} active={filter === k} onClick={() => setFilter(k)}
                          color={s.color} label={`${s.label} ${counts[k]}`} />
                      ) : null)}
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                    {visibleFindings.length === 0 && (
                      <div style={{ textAlign: "center", color: "#3fb950", padding: 24, fontSize: 12 }}>
                        ✓ Bu kategoride sorun bulunamadı
                      </div>
                    )}
                    {visibleFindings.map((f, i) => {
                      const s = SEVERITY[f.severity] || SEVERITY.info;
                      return (
                        <div key={i}
                          onClick={() => f.line != null && jumpToLine(f.line)}
                          style={{
                            border: "1px solid #30363d", borderLeft: `3px solid ${s.color}`,
                            borderRadius: 6, padding: 12, marginBottom: 10, background: "#161b22",
                            cursor: f.line != null ? "pointer" : "default",
                          }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{
                              width: 18, height: 18, borderRadius: 4, background: s.bg, color: s.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, flexShrink: 0,
                            }}>{s.icon}</span>
                            <span style={{ fontWeight: 600, color: "#e6edf3", flex: 1 }}>{f.title}</span>
                            {f.line != null && (
                              <span style={{
                                color: "#58a6ff", fontSize: 11, display: "flex", alignItems: "center", gap: 3,
                                background: "rgba(88,166,255,0.12)", padding: "2px 7px", borderRadius: 10,
                                whiteSpace: "nowrap",
                              }}>↗ satır {f.line}</span>
                            )}
                          </div>
                          <div style={{ color: "#c9d1d9", lineHeight: 1.5, marginBottom: 8, fontSize: 12 }}>{f.description}</div>
                          {f.suggestion && (
                            <div style={{
                              background: "#0d1117", borderRadius: 5, padding: "8px 10px",
                              fontSize: 12, color: "#7ee787", lineHeight: 1.5, borderLeft: "2px solid #238636",
                            }}>💡 {f.suggestion}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {tab === "diff" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "8px 12px",
                    borderBottom: "1px solid #21262d", fontSize: 11, flexShrink: 0,
                  }}>
                    <span style={{ color: "#3fb950" }}>+{addCount} eklendi</span>
                    <span style={{ color: "#f85149" }}>−{delCount} silindi</span>
                    <div style={{ marginLeft: "auto", display: "flex", border: "1px solid #30363d", borderRadius: 6, overflow: "hidden" }}>
                      {[["unified", "Birleşik"], ["split", "Yan yana"]].map(([k, label]) => (
                        <button key={k} onClick={() => setDiffView(k)} style={{
                          padding: "4px 10px", border: "none", fontFamily: "inherit", fontSize: 11,
                          cursor: "pointer", background: diffView === k ? "#21262d" : "transparent",
                          color: diffView === k ? "#c9d1d9" : "#8b949e",
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {diffView === "unified" ? (
                    <div style={{ flex: 1, overflow: "auto" }}>
                      <div style={{ display: "flex", position: "sticky", top: 0, background: "#161b22",
                        borderBottom: "1px solid #30363d", fontSize: 10, color: "#8b949e", fontWeight: 600 }}>
                        <span style={{ width: 34, textAlign: "right", padding: "4px 6px", flexShrink: 0 }}>Eski</span>
                        <span style={{ width: 34, textAlign: "right", padding: "4px 6px", flexShrink: 0 }}>Yeni</span>
                        <span style={{ width: 16, flexShrink: 0 }} />
                        <span style={{ padding: "4px 8px" }}>Kod</span>
                      </div>
                      {diffRows.map((r, i) => {
                        const st = DIFF_STYLE[r.type];
                        return (
                          <div key={i} style={{ display: "flex", background: st.bg, lineHeight: "20px" }}>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "#484f58", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{r.ln ?? ""}</span>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "#484f58", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{r.rn ?? ""}</span>
                            <span style={{ width: 16, color: st.gutter, userSelect: "none", flexShrink: 0, textAlign: "center" }}>{st.sign}</span>
                            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, paddingRight: 8, opacity: r.type === "del" ? 0.85 : 1 }}>{r.text ? <Highlighted line={r.text} /> : "\u00A0"}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ flex: 1, overflow: "auto" }}>
                      <div style={{ display: "flex", position: "sticky", top: 0, background: "#161b22",
                        borderBottom: "1px solid #30363d", fontSize: 10, color: "#8b949e", fontWeight: 600 }}>
                        <span style={{ flex: 1, padding: "4px 8px", borderRight: "1px solid #30363d" }}>Eski</span>
                        <span style={{ flex: 1, padding: "4px 8px" }}>Yeni</span>
                      </div>
                      {splitRows.map((row, i) => (
                        <div key={i} style={{ display: "flex", lineHeight: "20px" }}>
                          <div style={{ flex: 1, display: "flex", minWidth: 0, borderRight: "1px solid #21262d",
                            background: row.left ? DIFF_STYLE[row.left.type].bg : "transparent" }}>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "#484f58", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{row.left?.ln ?? ""}</span>
                            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, paddingRight: 8, opacity: 0.95 }}>{row.left?.text ? <Highlighted line={row.left.text} /> : "\u00A0"}</span>
                          </div>
                          <div style={{ flex: 1, display: "flex", minWidth: 0,
                            background: row.right ? DIFF_STYLE[row.right.type].bg : "transparent" }}>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "#484f58", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{row.right?.rn ?? ""}</span>
                            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, paddingRight: 8 }}>{row.right?.text ? <Highlighted line={row.right.text} /> : "\u00A0"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "code" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{
                    display: "flex", justifyContent: "flex-end", padding: "8px 12px",
                    borderBottom: "1px solid #21262d",
                  }}>
                    <button onClick={copyImproved} style={{
                      background: "#21262d", border: "1px solid #30363d", color: "#c9d1d9",
                      borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer",
                      fontFamily: "inherit",
                    }}>{copied ? "✓ Kopyalandı" : "⧉ Kopyala"}</button>
                  </div>
                  <pre style={{
                    flex: 1, overflow: "auto", margin: 0, padding: 14, fontSize: 12.5,
                    lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word",
                  }}>
                    {(result.improved_code || "").split("\n").map((ln, i) => (
                      <div key={i}>{ln ? <Highlighted line={ln} /> : "\u00A0"}</div>
                    ))}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }
        textarea::placeholder { color: #484f58; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        select option { background: #21262d; }
      `}</style>
    </div>
  );
}

function Chip({ active, onClick, color, label }) {
  return (
    <button onClick={onClick} style={{
      background: active ? color : "transparent",
      color: active ? "#0d1117" : color,
      border: `1px solid ${color}`, borderRadius: 12, padding: "3px 10px",
      fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
    }}>{label}</button>
  );
}
