import { useState, useRef, useEffect } from "react";

const LANGS = ["Otomatik algıla", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "SQL", "HTML/CSS"];

// ---- Arayüz çevirileri (AI kullanılmaz, statik) ----
const I18N = {
  tr: {
    autoDetect: "Otomatik algıla",
    uploadFile: "📁 Dosya Yükle",
    translate: "🔄 Çevir",
    translateTitle: "Kodu başka bir dile çevir",
    translateBtn: "Çevir",
    translating: "Çevriliyor...",
    cancel: "İptal",
    targetLang: "Hedef dil:",
    revertOriginal: "↩ Orijinale dön",
    revertTitle: "Çeviriden önceki koda dön",
    lineCount: (n) => `${n} satır`,
    codePlaceholder: "// Review edilecek kodu buraya yapıştır...",
    startReview: "▶ Review Başlat",
    reviewing: " İnceleniyor...",
    pdf: "📄 PDF",
    resultsHere: "Sonuçlar burada görünecek",
    resultsHint: 'Kodunu sol tarafa yapıştır ve "Review Başlat"a bas',
    qualityScore: "Kalite Puanı",
    tabExplanation: "Açıklama",
    tabFindings: (n) => `Bulgular (${n})`,
    tabDiff: "Diff",
    tabCode: "İyileştirilmiş Kod",
    tabTests: "Testler",
    filterAll: "Tümü",
    codeExplanation: "📖 Kod Açıklaması",
    noExplanation: "Bu analiz için açıklama üretilmedi.",
    line: "Satır",
    copy: "⧉ Kopyala",
    copied: "✓ Kopyalandı",
    whatChanged: "✨ Neler değişti?",
    diffUnified: "Birleşik",
    diffSplit: "Yan yana",
    origTests: "Orijinal Kod Testleri",
    improvedTests: "İyileştirilmiş Kod Testleri",
    noTests: "Bu kod için test üretilmedi.",
    security: "Güvenlik",
    performance: "Performans",
    readability: "Okunabilirlik",
    maintainability: "Sürdürülebilirlik",
    metrics: "Metrikler",
    findings: "Bulgular",
    noFindings: "Bulgu yok.",
    improvedCode: "İyileştirilmiş Kod",
    unitTests: "🧪 Birim Testleri",
    reportTitle: "🔍 Kod İnceleme Raporu",
    reportDesc: "Kod kalite analizi raporu",
    lang: "Dil",
    date: "Tarih",
    pdfReady: 'Rapor hazır. İndirmek için butona bas → açılan ekranda "PDF olarak kaydet" seç.',
    pdfDownload: "⬇ PDF İndir",
    reportFooter: "Kod İnceleme Botu ile oluşturuldu",
    errFileRead: "Dosya okunamadı. Tekrar dene.",
    errNoKey: "API anahtarı eksik! .env dosyasına REACT_APP_OPENAI_API_KEY ekle.",
    errEmptyTranslation: "Çeviri boş döndü.",
    errTranslateFail: (m) => `Çeviri tamamlanamadı: ${m}. Tekrar dene.`,
    errPopup: "PDF için açılır pencereye izin ver (pop-up engelleyici).",
    sev: { critical: "Kritik", warning: "Uyarı", info: "Öneri", style: "Stil" },
    noProblemsInCategory: "✓ Bu kategoride sorun bulunamadı",
    jumpLine: "↗",
    added: (n) => `+${n} eklendi`,
    deleted: (n) => `−${n} silindi`,
    costLabel: "Bu oturum",
    costTokens: (p, c) => `${(p+c).toLocaleString()} token (${p.toLocaleString()} giriş · ${c.toLocaleString()} çıkış)`,
    costCalls: (n) => `${n} API çağrısı`,
    costReset: "Sıfırla",
    codeStats: "📊 Kod İstatistikleri",
    statTotalLines: "Toplam Satır",
    statCodeLines: "Kod Satırı",
    statCommentLines: "Yorum Satırı",
    statClasses: "Sınıf",
    statFunctions: "Fonksiyon",
    statIfElse: "If/Else",
    statLoops: "Döngü",
    statSwitches: "Switch/Match",
    statTryCatch: "Try/Catch",
    statCyclomaticComplexity: "Siklomatik Karmaşıklık",
    statMaxNesting: "Maks. İç İçe Derinlik",
    statAvgFuncLen: "Ort. Fonk. Uzunluğu (satır)",
    statLongestFunc: "En Uzun Fonksiyon (satır)",
    complexityLow: "Düşük",
    complexityMedium: "Orta",
    complexityHigh: "Yüksek",
    complexityVeryHigh: "Çok Yüksek",
  },
  en: {
    autoDetect: "Auto-detect",
    uploadFile: "📁 Upload File",
    translate: "🔄 Translate",
    translateTitle: "Translate code to another language",
    translateBtn: "Translate",
    translating: "Translating...",
    cancel: "Cancel",
    targetLang: "Target language:",
    revertOriginal: "↩ Back to original",
    revertTitle: "Revert to pre-translation code",
    lineCount: (n) => `${n} lines`,
    codePlaceholder: "// Paste the code to review here...",
    startReview: "▶ Start Review",
    reviewing: " Reviewing...",
    pdf: "📄 PDF",
    resultsHere: "Results will appear here",
    resultsHint: 'Paste your code on the left and click "Start Review"',
    qualityScore: "Quality Score",
    tabExplanation: "Explanation",
    tabFindings: (n) => `Findings (${n})`,
    tabDiff: "Diff",
    tabCode: "Improved Code",
    tabTests: "Tests",
    filterAll: "All",
    codeExplanation: "📖 Code Explanation",
    noExplanation: "No explanation was generated for this analysis.",
    line: "Line",
    copy: "⧉ Copy",
    copied: "✓ Copied",
    whatChanged: "✨ What changed?",
    diffUnified: "Unified",
    diffSplit: "Side by side",
    origTests: "Original Code Tests",
    improvedTests: "Improved Code Tests",
    noTests: "No tests were generated for this code.",
    security: "Security",
    performance: "Performance",
    readability: "Readability",
    maintainability: "Maintainability",
    metrics: "Metrics",
    findings: "Findings",
    noFindings: "No findings.",
    improvedCode: "Improved Code",
    unitTests: "🧪 Unit Tests",
    reportTitle: "🔍 Code Review Report",
    reportDesc: "Code quality analysis report",
    lang: "Language",
    date: "Date",
    pdfReady: 'Report ready. Click the button → choose "Save as PDF" in the dialog.',
    pdfDownload: "⬇ Download PDF",
    reportFooter: "Generated with Code Review Bot",
    errFileRead: "Could not read the file. Try again.",
    errNoKey: "API key missing! Add REACT_APP_OPENAI_API_KEY to your .env file.",
    errEmptyTranslation: "Translation came back empty.",
    errTranslateFail: (m) => `Translation failed: ${m}. Try again.`,
    errPopup: "Allow pop-ups for PDF (pop-up blocker).",
    sev: { critical: "Critical", warning: "Warning", info: "Suggestion", style: "Style" },
    noProblemsInCategory: "✓ No issues found in this category",
    jumpLine: "↗",
    added: (n) => `+${n} added`,
    deleted: (n) => `−${n} deleted`,
    costLabel: "This session",
    costTokens: (p, c) => `${(p+c).toLocaleString()} tokens (${p.toLocaleString()} in · ${c.toLocaleString()} out)`,
    costCalls: (n) => `${n} API call${n !== 1 ? "s" : ""}`,
    costReset: "Reset",
    codeStats: "📊 Code Statistics",
    statTotalLines: "Total Lines",
    statCodeLines: "Code Lines",
    statCommentLines: "Comment Lines",
    statClasses: "Classes",
    statFunctions: "Functions",
    statIfElse: "If/Else",
    statLoops: "Loops",
    statSwitches: "Switch/Match",
    statTryCatch: "Try/Catch",
    statCyclomaticComplexity: "Cyclomatic Complexity",
    statMaxNesting: "Max Nesting Depth",
    statAvgFuncLen: "Avg Function Length (lines)",
    statLongestFunc: "Longest Function (lines)",
    complexityLow: "Low",
    complexityMedium: "Medium",
    complexityHigh: "High",
    complexityVeryHigh: "Very High",
  },
};

const SEVERITY = {
  critical: { color: "var(--accent-red)", bg: "rgba(248,81,73,0.12)", icon: "✕" },
  warning:  { color: "var(--accent-yellow)", bg: "rgba(210,153,34,0.12)", icon: "▲" },
  info:     { color: "var(--accent-blue)", bg: "rgba(88,166,255,0.12)", icon: "i" },
  style:    { color: "var(--accent-purple)", bg: "rgba(163,113,247,0.12)", icon: "✎" },
};

const REVIEW_SYSTEM = `Sen kıdemli bir yazılım mühendisisin ve kod review yapıyorsun. Verilen kodu titizlikle incele.

SADECE geçerli JSON döndür, başka HİÇBİR şey yazma (markdown, açıklama, backtick yok).

JSON formatı:
{
  "language": "algılanan dil",
  "score": 0-100 arası genel kalite puanı (integer),
  "summary": "1-2 cümle Türkçe genel değerlendirme",
  "explanation": "Kodun ne yaptığının açık, anlaşılır Türkçe açıklaması (3-6 cümle). Kodun amacını, ana mantığını ve önemli adımlarını sade bir dille anlat; yeni başlayan birinin anlayabileceği şekilde, ama gereksiz uzatmadan.",
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
  "improved_explanation": "İyileştirilmiş kodda yapılan başlıca değişikliklerin ve bunların neden daha iyi olduğunun kısa Türkçe açıklaması (2-4 cümle). Değişiklik yoksa kodun zaten iyi olduğunu belirt.",
  "test_framework": "kodun diline uygun yaygın test çatısının adı (örn. JavaScript→Jest, Python→pytest, Java→JUnit, C#→xUnit, Go→testing, PHP→PHPUnit). Dil belirsizse en uygun olanı seç.",
  "tests": "ORİJİNAL kod için yazılmış, çalışır ve eksiksiz birim testleri (string). Test çatısının gerçek sözdizimini kullan. Temel durumlar + kenar durumlar (boş girdi, sınır değerleri, hatalı girdi) dahil olsun. Sadece kod, açıklama metni değil.",
  "improved_tests": "İYİLEŞTİRİLMİŞ kod için yazılmış, çalışır ve eksiksiz birim testleri (string). Aynı test çatısı. İyileştirilmiş koddaki değişiklikleri de kapsayacak şekilde güncel olsun.",
  "metrics": {
    "security": 0-100 güvenlik puanı (integer),
    "performance": 0-100 performans puanı (integer),
    "readability": 0-100 okunabilirlik puanı (integer),
    "maintainability": 0-100 sürdürülebilirlik puanı (integer)
  },
  "code_stats": {
    "total_lines": toplam satır sayısı (integer, boş+yorum dahil),
    "code_lines": yalnızca kod satırı sayısı (integer, boş ve salt yorum satırları hariç),
    "comment_lines": yorum satırı sayısı (integer),
    "classes": sınıf tanımı sayısı (integer),
    "functions": fonksiyon/metot tanımı sayısı (integer),
    "if_else": if/else/elif blok sayısı (integer),
    "loops": for/while/do döngüsü sayısı (integer),
    "switches": switch/match ifadesi sayısı (integer),
    "try_catch": try/catch/except bloğu sayısı (integer),
    "cyclomatic_complexity": tahmini siklomatik karmaşıklık (integer, 1'den başlar; her dal +1),
    "max_nesting_depth": kodda görülen maksimum iç içe girinti derinliği (integer),
    "avg_function_length": ortalama fonksiyon uzunluğu satır olarak (integer veya null),
    "longest_function_lines": en uzun fonksiyonun satır sayısı (integer veya null)
  },
  "lang_mismatch": "Kullanıcı bir dil seçtiyse ve kodun GERÇEK dili o seçilen dilden FARKLIYSA, MUTLAKA şu kalıpla yaz: 'Siz [SEÇİLEN_DİL] seçtiniz ama kod aslında [KODUN_GERÇEK_DİLİ] dilinde.' — köşeli parantezleri kullanıcının seçtiği dil ve kodun gerçekte yazıldığı dil ile değiştir, YÖNÜ KARIŞTIRMA. Diller aynıysa veya dil seçilmediyse null."
}

Kurallar:
- Güvenlik açıkları, bug'lar, performans sorunları "critical" veya "warning"
- Best practice ve okunabilirlik "info"
- Biçimlendirme/isimlendirme "style"
- improved_code orijinal kodla aynı dilde, çalışır ve eksiksiz olsun
- ÖNEMLİ: improved_code'da SADECE gerçekten düzeltilmesi gereken satırları değiştir. Sorunsuz satırları girinti, boşluk ve biçim dahil BİREBİR AYNI bırak. Gereksiz yeniden biçimlendirme (reformat) YAPMA — yoksa karşılaştırma (diff) tüm dosyayı değişmiş gibi gösterir. Orijinalin girinti stilini (tab/boşluk sayısı), satır sonlarını ve boş satırlarını koru.
- findings boş olabilir (kod kusursuzsa)
- "explanation" ve "improved_explanation" alanları HER ZAMAN doldurulmalı, asla boş bırakılmamalı.
- "tests" ve "improved_tests" HER ZAMAN gerçek, çalışır test kodu içermeli (boş bırakma). Kodun fonksiyon/sınıf içermediği durumlarda bile mantıklı temel testler yaz veya neden test yazılamayacağını tek satır yorum olarak belirt.
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
  comment: "var(--text-muted)", string: "var(--tok-string)", number: "var(--tok-number)",
  keyword: "var(--tok-keyword)", ident: "var(--text)", punct: "var(--text)", ws: "var(--text)",
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
  same: { bg: "transparent", gutter: "var(--text-faint)", sign: " " },
  add:  { bg: "rgba(63,185,80,0.15)", gutter: "var(--accent-green)", sign: "+" },
  del:  { bg: "rgba(248,81,73,0.15)", gutter: "var(--accent-red)", sign: "-" },
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
  const [tab, setTab] = useState("explanation");
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [diffView, setDiffView] = useState("unified");
  const [highlightLine, setHighlightLine] = useState(null);
  const [translateOpen, setTranslateOpen] = useState(false);
  const [translateTarget, setTranslateTarget] = useState("Python");
  const [translating, setTranslating] = useState(false);
  const [preTranslateCode, setPreTranslateCode] = useState(null);
  const [preTranslateLang, setPreTranslateLang] = useState(null);
  const [sessionCost, setSessionCost] = useState({ promptTokens: 0, completionTokens: 0, calls: 0 });
  const [uiLang, setUiLang] = useState(() => {
    try {
      const saved = typeof localStorage !== "undefined" && localStorage.getItem("uiLang");
      return saved === "en" || saved === "tr" ? saved : "tr";
    } catch { return "tr"; }
  });
  const t = I18N[uiLang];

  function toggleUiLang() {
    const next = uiLang === "tr" ? "en" : "tr";
    setUiLang(next);
    try { if (typeof localStorage !== "undefined") localStorage.setItem("uiLang", next); } catch {}
  }

  const [theme, setTheme] = useState(() => {
    try {
      const saved = typeof localStorage !== "undefined" && localStorage.getItem("theme");
      return saved === "light" || saved === "dark" ? saved : "dark";
    } catch { return "dark"; }
  });

  useEffect(() => {
    const bgMap = { dark: "#0d1117", light: "#ffffff" };
    const colorMap = { dark: "#c9d1d9", light: "#1f2328" };
    document.documentElement.style.background = bgMap[theme];
    document.documentElement.style.color = colorMap[theme];
    document.body.style.background = bgMap[theme];
    document.body.style.color = colorMap[theme];
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { if (typeof localStorage !== "undefined") localStorage.setItem("theme", next); } catch {}
  }
  const editorWrapRef = useRef(null);
  const taRef = useRef(null);
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);
  const lineRefs = useRef({});
  const gutterLineRefs = useRef({});
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
      setPreTranslateCode(null);
      setPreTranslateLang(null);
      // Uzantıdan dili otomatik seç
      const ext = file.name.split(".").pop().toLowerCase();
      const detected = EXT_TO_LANG[ext];
      if (detected && LANGS.includes(detected)) {
        setLang(detected);
      }
    };
    reader.onerror = () => setError(t.errFileRead);
    reader.readAsText(file);
    // Aynı dosyayı tekrar seçebilmek için input'u sıfırla
    e.target.value = "";
  }

  async function runTranslate() {
    if (!code.trim() || translating || loading) return;
    setTranslating(true); setError(null);
    const sourceLang = lang !== LANGS[0] ? lang : "otomatik algılanan dil";
    const sys = `Sen uzman bir yazılım çevirmenisin. Verilen kodu hedef programlama diline çevir.
SADECE çevrilmiş kodu döndür. Açıklama, yorum metni, markdown backtick (\`\`\`) YOK; yalnızca ham kod.
Kurallar:
- Kodun işlevselliğini birebir koru.
- Hedef dilin deyimsel (idiomatic) yazım kurallarına ve standart kütüphanelerine uy.
- Değişken/fonksiyon isimlerini anlamlı şekilde koru.
- Gerekli import/include ifadelerini ekle.
- Sadece kodu yaz, başka hiçbir şey yazma.`;
    const userMsg = `Kaynak dil: ${sourceLang}\nHedef dil: ${translateTarget}\n\nÇevrilecek kod:\n\n${code}`;
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(t.errNoKey);
      }
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", max_tokens: 16000, temperature: 0.2,
          messages: [
            { role: "system", content: sys },
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`API: ${data.error?.message || response.statusText}`);
      }
      let translated = data.choices?.[0]?.message?.content || "";
      // Olası markdown çitlerini temizle
      translated = translated.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```\s*$/, "").trim();
      if (!translated) throw new Error(t.errEmptyTranslation);
      if (data.usage) {
        setSessionCost(prev => ({
          promptTokens: prev.promptTokens + (data.usage.prompt_tokens || 0),
          completionTokens: prev.completionTokens + (data.usage.completion_tokens || 0),
          calls: prev.calls + 1,
        }));
      }
      // 4. adım: çeviriyi editöre yaz, dil seçiciyi hedef dile geçir.
      // Orijinal yedeği SADECE ilk çeviride al; zincirleme çevirilerde (JS→Python→Java)
      // en baştaki orijinale dönebilmek için üzerine yazma.
      if (preTranslateCode == null) {
        setPreTranslateCode(code);
        setPreTranslateLang(lang);
      }
      setCode(translated);
      if (LANGS.includes(translateTarget)) setLang(translateTarget);
      setResult(null); // eski review artık geçersiz
      setTranslateOpen(false);
    } catch (err) {
      console.error("Translate error:", err);
      setError(t.errTranslateFail(err.message || "?"));
    } finally { setTranslating(false); }
  }

  function revertTranslate() {
    if (preTranslateCode == null) return;
    setCode(preTranslateCode);
    if (preTranslateLang != null) setLang(preTranslateLang);
    setPreTranslateCode(null);
    setPreTranslateLang(null);
    setResult(null);
  }

  async function runReview() {
    if (!code.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    const langInstruction = uiLang === "en"
      ? "\n\nIMPORTANT: Write ALL human-readable text fields (summary, explanation, findings titles/descriptions/suggestions, improved_explanation, lang_mismatch) in ENGLISH. Keep JSON keys and code unchanged."
      : "\n\nÖNEMLİ: Tüm insan-okunur metin alanlarını (summary, explanation, bulgu başlık/açıklama/öneri, improved_explanation, lang_mismatch) TÜRKÇE yaz. JSON anahtarlarını ve kodu değiştirme.";
    const userMsg = `${lang !== LANGS[0] ? `KULLANICININ SEÇTİĞİ DİL: ${lang}\nGörev: Aşağıdaki kodun GERÇEKTE hangi dilde yazıldığını kendin tespit et. Eğer kodun gerçek dili "${lang}" DEĞİLSE, lang_mismatch alanını şu yönle doldur: kullanıcının seçtiği dil "${lang}", kodun gerçek dili ise senin tespit ettiğin dil. Yönü karıştırma.\n\n` : ""}İncelenecek kod:\n\n${code}`;
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) throw new Error(t.errNoKey);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o", max_tokens: 16000, temperature: 0.2,
          messages: [
            { role: "system", content: REVIEW_SYSTEM + langInstruction },
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(`API hatası: ${data.error?.message || response.statusText}`);
      let text = data.choices?.[0]?.message?.content || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) text = text.slice(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(text);
      if (data.usage) {
        setSessionCost(prev => ({
          promptTokens: prev.promptTokens + (data.usage.prompt_tokens || 0),
          completionTokens: prev.completionTokens + (data.usage.completion_tokens || 0),
          calls: prev.calls + 1,
        }));
      }
      setResult(parsed); setTab("explanation"); setFilter("all");
    } catch (err) {
      console.error("Review error:", err);
      setError(`Analiz tamamlanamadı: ${err.message || "bilinmeyen hata"}. Tekrar dene.`);
    } finally { setLoading(false); }
  }

  function copyImproved() {
    if (!result?.improved_code) return;
    copyText(result.improved_code, "improved");
  }

  function copyText(text, key) {
    if (!text) return;
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
    if (key === "improved") { setCopied(true); setTimeout(() => setCopied(false), 1500); }
    else { setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500); }
  }

  function exportPDF() {
    if (!result) return;
    const esc = (s) => String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const sevTr = {
      critical: t.sev.critical.toUpperCase(), warning: t.sev.warning.toUpperCase(),
      info: t.sev.info.toUpperCase(), suggestion: t.sev.info.toUpperCase(), style: t.sev.style.toUpperCase(),
    };
    const sevColor = { critical: "#cf222e", warning: "#9a6700", info: "#1a7f37", suggestion: "#1a7f37", style: "#57606a" };
    const now = new Date().toLocaleString(uiLang === "en" ? "en-US" : "tr-TR");
    const m = result.metrics || {};

    const findingsHtml = (result.findings || []).map((f) => `
      <div class="finding" style="border-left:4px solid ${sevColor[f.severity] || "#57606a"}">
        <div class="f-head">
          <span class="badge" style="background:${sevColor[f.severity] || "#57606a"}">${sevTr[f.severity] || esc(f.severity)}</span>
          ${f.line != null ? `<span class="f-line">${t.line} ${esc(f.line)}</span>` : ""}
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

    const html = `<!DOCTYPE html><html lang="${uiLang}"><head><meta charset="utf-8">
<title>${t.reportTitle.replace(/^🔍\s*/, "")}</title>
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
    <span class="dl-hint">${t.pdfReady}</span>
    <button class="dl-btn" onclick="window.print()">${t.pdfDownload}</button>
  </div>
  <h1>${t.reportTitle}</h1>
  <div class="sub">${t.lang}: ${esc(result.language || lang)} &nbsp;·&nbsp; ${t.date}: ${esc(now)}</div>

  <div class="card">
    <div class="score-wrap">
      <div class="score" style="color:${result.score >= 70 ? "#1a7f37" : result.score >= 40 ? "#9a6700" : "#cf222e"}">${esc(result.score)}<span style="font-size:18px;color:#8c959f">/100</span></div>
      <div class="summary">${esc(result.summary)}</div>
    </div>
  </div>

  ${result.explanation ? `<div class="card"><h2>${t.codeExplanation}</h2>
    <div style="font-size:13px;line-height:1.6;color:#1f2328;white-space:pre-wrap">${esc(result.explanation)}</div>
  </div>` : ""}

  ${result.metrics ? `<div class="card"><h2>${t.metrics}</h2>
    ${metricRow(t.security, m.security)}
    ${metricRow(t.performance, m.performance)}
    ${metricRow(t.readability, m.readability)}
    ${metricRow(t.maintainability, m.maintainability)}
  </div>` : ""}

  ${result.code_stats ? (() => {
    const s = result.code_stats;
    const cc = s.cyclomatic_complexity ?? 0;
    const ccLabel = cc <= 5 ? t.complexityLow : cc <= 10 ? t.complexityMedium : cc <= 20 ? t.complexityHigh : t.complexityVeryHigh;
    const ccColor = cc <= 5 ? "#1a7f37" : cc <= 10 ? "#0969da" : cc <= 20 ? "#9a6700" : "#cf222e";
    const statRow = (label, val, suffix) => val != null ? `<div class="metric"><span>${esc(label)}</span><span style="font-weight:700">${val}${suffix||""}</span></div>` : "";
    return `<div class="card"><h2>${t.codeStats}</h2>
      ${statRow(t.statTotalLines, s.total_lines)}
      ${statRow(t.statCodeLines, s.code_lines)}
      ${statRow(t.statCommentLines, s.comment_lines)}
      ${statRow(t.statClasses, s.classes)}
      ${statRow(t.statFunctions, s.functions)}
      ${statRow(t.statAvgFuncLen, s.avg_function_length)}
      ${statRow(t.statLongestFunc, s.longest_function_lines)}
      ${statRow(t.statIfElse, s.if_else)}
      ${statRow(t.statLoops, s.loops)}
      ${statRow(t.statSwitches, s.switches)}
      ${statRow(t.statTryCatch, s.try_catch)}
      ${statRow(t.statMaxNesting, s.max_nesting_depth)}
      <div class="metric"><span>${esc(t.statCyclomaticComplexity)}</span><span style="font-weight:700;color:${ccColor}">${cc} — ${esc(ccLabel)}</span></div>
    </div>`;
  })() : ""}

  <div class="card"><h2>${t.findings} (${(result.findings || []).length})</h2>
    ${findingsHtml || `<div style='color:#57606a;font-size:12px'>${t.noFindings}</div>`}
  </div>

  ${result.improved_code ? `<div class="card"><h2>${t.improvedCode}</h2>${result.improved_explanation ? `<div style="font-size:12px;line-height:1.6;color:#1a7f37;margin-bottom:10px;white-space:pre-wrap"><strong>${t.whatChanged.replace("?", ":")}</strong> ${esc(result.improved_explanation)}</div>` : ""}<pre>${esc(result.improved_code)}</pre></div>` : ""}

  ${(result.tests || result.improved_tests) ? `<div class="card"><h2>${t.unitTests}${result.test_framework ? ` <span style="font-size:12px;font-weight:400;color:#57606a">(${esc(result.test_framework)})</span>` : ""}</h2>
    ${result.tests ? `<div style="font-size:12px;font-weight:600;color:#0969da;margin:6px 0 4px">${t.origTests}</div><pre>${esc(result.tests)}</pre>` : ""}
    ${result.improved_tests ? `<div style="font-size:12px;font-weight:600;color:#1a7f37;margin:12px 0 4px">${t.improvedTests}</div><pre>${esc(result.improved_tests)}</pre>` : ""}
  </div>` : ""}

  <div class="foot">${t.reportFooter}</div>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      setError(t.errPopup);
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Otomatik yazdırma yok — kullanıcı rapor önizlemesini görür, "PDF İndir" butonuyla indirir
  }

  // Tek senkron noktası: textarea kaynaktır; highlight ve gutter ondan beslenir.
  function syncScroll(top, left) {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = top;
      highlightRef.current.scrollLeft = left;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = top; // gutter yatay kaymaz
  }

  function jumpToLine(line) {
    if (line == null) return;
    setHighlightLine(line);
    const apply = () => {
      const ta = taRef.current;
      if (!ta) return;
      // Aritmetik tahmin yerine, ışıtılan satırın GERÇEK DOM elemanının konumunu kullan.
      // Böylece highlight hangi satırı gösteriyorsa scroll da tam ona gider (kayma olmaz).
      const el = lineRefs.current[line];
      let target;
      if (el && el.offsetParent !== null) {
        const visibleH = ta.clientHeight || 300;
        const elH = el.offsetHeight || 20;
        // el.offsetTop, highlight içeriğinin (pre > inner div) üstüne göredir;
        // textarea içeriği aynı hizada başladığı için scrollTop olarak doğrudan kullanılabilir.
        target = el.offsetTop - visibleH / 2 + elH / 2;
      } else {
        // Yedek: eleman henüz yoksa aritmetik hesap.
        const padTop = parseFloat(getComputedStyle(ta).paddingTop) || 0;
        const visibleH = ta.clientHeight || 300;
        target = padTop + (line - 1) * 20 - visibleH / 2 + 10;
      }
      const maxTop = Math.max(0, ta.scrollHeight - ta.clientHeight);
      target = Math.min(maxTop, Math.max(0, target));
      // TEK kaynak: textarea'yı set et; highlight & gutter onScroll/syncScroll ile beslenir.
      ta.scrollTop = target;
      ta.scrollLeft = 0;
      syncScroll(ta.scrollTop, ta.scrollLeft);
    };
    requestAnimationFrame(() => requestAnimationFrame(apply));
    setTimeout(() => setHighlightLine(null), 2400);
  }

  const counts = result
    ? result.findings.reduce((acc, f) => { acc[f.severity] = (acc[f.severity] || 0) + 1; return acc; }, {})
    : {};
  const visibleFindings = result
    ? result.findings.filter((f) => filter === "all" || f.severity === filter) : [];
  const scoreColor = (s) => (s >= 80 ? "var(--accent-green)" : s >= 50 ? "var(--accent-yellow)" : "var(--accent-red)");

  // GPT-4o fiyatlandırması: $2.50/1M input, $10.00/1M output (Mayıs 2025 itibarıyla)
  const GPT4O_IN  = 2.50 / 1_000_000;
  const GPT4O_OUT = 10.00 / 1_000_000;
  const calcCost = (p, c) => (p * GPT4O_IN + c * GPT4O_OUT);
  const sessionDollars = calcCost(sessionCost.promptTokens, sessionCost.completionTokens);
  const diffRows = result ? diffLines(code, result.improved_code) : [];
  const addCount = diffRows.filter((r) => r.type === "add").length;
  const delCount = diffRows.filter((r) => r.type === "del").length;
  const splitRows = buildSplitRows(diffRows);

  return (
    <div className="app-root" data-theme={theme} style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "var(--bg)", color: "var(--text)",
      fontFamily: "'SF Mono','JetBrains Mono',Menlo,Consolas,monospace", fontSize: 13,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
        background: "var(--surface)", borderBottom: "1px solid var(--border)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <span style={{ marginLeft: 8, color: "var(--text-muted)", fontSize: 12 }}>⌘ kod-review.bot</span>
        <button onClick={toggleTheme}
          title={theme === "dark"
            ? (uiLang === "tr" ? "Aydınlık moda geç" : "Switch to light mode")
            : (uiLang === "tr" ? "Karanlık moda geç" : "Switch to dark mode")}
          style={{
            marginLeft: "auto", background: "var(--surface-2)", color: "var(--text)",
            border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px",
            fontSize: 12, fontFamily: "inherit", cursor: "pointer", fontWeight: 600,
            display: "flex", alignItems: "center", gap: 5,
          }}>{theme === "dark" ? "🌙" : "☀️"} {theme === "dark"
            ? (uiLang === "tr" ? "Koyu" : "Dark")
            : (uiLang === "tr" ? "Açık" : "Light")}</button>
        <button onClick={toggleUiLang} title={uiLang === "tr" ? "Switch to English" : "Türkçe'ye geç"} style={{
          background: "var(--surface-2)", color: "var(--text)",
          border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px",
          fontSize: 12, fontFamily: "inherit", cursor: "pointer", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 5,
        }}>🌐 {uiLang === "tr" ? "TR" : "EN"}</button>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0, flexWrap: "wrap", background: "var(--bg)" }}>
        <div ref={editorWrapRef} style={{
          flex: "1 1 360px", display: "flex", flexDirection: "column",
          borderRight: "1px solid var(--border)", minHeight: 0, minWidth: 0, height: "100%",
          background: "var(--bg)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px", borderBottom: "1px solid var(--border)", gap: 8, flexWrap: "wrap",
          }}>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{
              background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "5px 8px", fontSize: 12, fontFamily: "inherit",
              outline: "none", cursor: "pointer",
            }}>{LANGS.map((l) => <option key={l} value={l}>{l === LANGS[0] ? t.autoDetect : l}</option>)}</select>

            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.jsx,.mjs,.cjs,.ts,.tsx,.py,.pyw,.java,.cpp,.cc,.cxx,.hpp,.h,.cs,.go,.rs,.php,.rb,.swift,.kt,.kts,.sql,.html,.htm,.css,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{
              background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "5px 10px", fontSize: 12, fontFamily: "inherit",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}>{t.uploadFile}</button>

            <button onClick={() => setTranslateOpen((o) => !o)} disabled={!code.trim() || translating}
              title={t.translateTitle} style={{
              background: translateOpen ? "var(--accent-blue-strong)" : "var(--surface-2)",
              color: code.trim() && !translating ? "var(--text)" : "var(--text-faint)",
              border: `1px solid ${translateOpen ? "var(--accent-blue-strong)" : "var(--border)"}`,
              borderRadius: 6, padding: "5px 10px", fontSize: 12, fontFamily: "inherit",
              cursor: code.trim() && !translating ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: 5,
            }}>{t.translate}</button>

            {preTranslateCode != null && (
              <button onClick={revertTranslate} title={t.revertTitle} style={{
                background: "transparent", color: "var(--text-muted)", border: "none",
                fontSize: 11, fontFamily: "inherit", cursor: "pointer", padding: "4px 6px",
                textDecoration: "underline",
              }}>{t.revertOriginal}</button>
            )}

            <span style={{ color: "var(--text-faint)", fontSize: 11, marginLeft: "auto" }}>{t.lineCount(lineCount)}</span>
          </div>

          {translateOpen && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
              borderBottom: "1px solid var(--border)", background: "var(--surface)", flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.targetLang}</span>
              <select value={translateTarget} onChange={(e) => setTranslateTarget(e.target.value)} style={{
                background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)",
                borderRadius: 6, padding: "5px 8px", fontSize: 12, fontFamily: "inherit",
                outline: "none", cursor: "pointer",
              }}>{LANGS.filter((l) => l !== LANGS[0]).map((l) => <option key={l}>{l}</option>)}</select>
              <button onClick={runTranslate} disabled={translating} style={{
                background: translating ? "var(--surface-2)" : "var(--accent-blue-strong)", color: translating ? "var(--text-faint)" : "#fff",
                border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12,
                fontFamily: "inherit", fontWeight: 600, cursor: translating ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {translating ? (<><span className="spin" style={{
                  width: 12, height: 12, border: "2px solid var(--text-faint)", borderTopColor: "var(--text)",
                  borderRadius: "50%", display: "inline-block",
                }} /> {t.translating}</>) : t.translateBtn}
              </button>
              <button onClick={() => setTranslateOpen(false)} style={{
                background: "transparent", color: "var(--text-muted)", border: "none",
                fontSize: 12, fontFamily: "inherit", cursor: "pointer", padding: "4px 6px",
              }}>{t.cancel}</button>
            </div>
          )}

          <div style={{ flex: 1, display: "flex", minHeight: 0, background: "var(--bg)", overflow: "hidden" }}>
            <div ref={gutterRef} style={{
              padding: "12px 6px 12px 12px", color: "var(--text-faint)", textAlign: "right",
              userSelect: "none", fontSize: 13, lineHeight: "20px", overflow: "hidden",
              minWidth: 40, background: "var(--bg)", flexShrink: 0,
            }}>
              {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                <div key={i} ref={(el) => { gutterLineRefs.current[i + 1] = el; }} style={{
                  color: highlightLine === i + 1 ? "var(--accent-yellow)" : "var(--text-faint)",
                  fontWeight: highlightLine === i + 1 ? 700 : 400,
                }}>{i + 1}</div>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative", minWidth: 0, minHeight: 0, background: "var(--bg)" }}>
              <pre ref={highlightRef} aria-hidden className="hl-layer" style={{
                position: "absolute", inset: 0, margin: 0, padding: "12px",
                fontSize: 13, lineHeight: "20px", fontFamily: "inherit",
                whiteSpace: "pre", overflowX: "auto", overflowY: "hidden", tabSize: 2,
                pointerEvents: "none", background: "var(--bg)",
              }}>
                <div style={{ minWidth: "max-content" }}>
                {(code || "").split("\n").map((ln, i) => (
                  <div key={i} ref={(el) => { lineRefs.current[i + 1] = el; }} style={{
                    background: highlightLine === i + 1 ? "rgba(210,153,34,0.28)" : "transparent",
                    transition: "background 0.3s", borderRadius: 2,
                  }}>{ln ? <Highlighted line={ln} /> : "\u00A0"}</div>
                ))}
                </div>
              </pre>
              <textarea
                ref={taRef}
                value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                onScroll={(e) => {
                  syncScroll(e.target.scrollTop, e.target.scrollLeft);
                }}
                placeholder={t.codePlaceholder}
                style={{
                  position: "absolute", inset: 0, background: "transparent",
                  color: "transparent", caretColor: "var(--text)", border: "none",
                  outline: "none", resize: "none", padding: "12px", fontSize: 13,
                  lineHeight: "20px", fontFamily: "inherit", tabSize: 2,
                  whiteSpace: "pre", overflow: "auto",
                }}
              />
            </div>
          </div>

          <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
            <button onClick={runReview} disabled={!code.trim() || loading} style={{
              width: "100%", padding: "10px", borderRadius: 6, border: "none",
              background: code.trim() && !loading ? "var(--accent-green-btn)" : "var(--surface-2)",
              color: code.trim() && !loading ? "#fff" : "var(--text-faint)",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              cursor: code.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? (<><span className="spin" style={{
                width: 13, height: 13, border: "2px solid var(--text-faint)",
                borderTopColor: "var(--text)", borderRadius: "50%", display: "inline-block",
              }} />{t.reviewing}</>) : t.startReview}
            </button>
          </div>
        </div>

        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, background: "var(--bg)" }}>

          {!result && !loading && !error && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "var(--text-faint)", padding: 24, textAlign: "center", gap: 8,
            }}>
              <div style={{ fontSize: 32 }}>🔍</div>
              <div>{t.resultsHere}</div>
              <div style={{ fontSize: 11, maxWidth: 240 }}>{t.resultsHint}</div>
            </div>
          )}

          {loading && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "var(--text-muted)", gap: 12,
            }}>
              <span className="spin" style={{
                width: 28, height: 28, border: "3px solid var(--surface-2)",
                borderTopColor: "var(--accent-blue)", borderRadius: "50%",
              }} />
              <div style={{ fontSize: 12 }}>{t.reviewing.trim()}</div>
            </div>
          )}

          {error && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "var(--accent-red)", gap: 8, padding: 24, textAlign: "center",
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
                  background: "rgba(248,81,73,0.15)", borderBottom: "1px solid var(--accent-red)",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 16, lineHeight: 1.2 }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--accent-red)", fontSize: 12.5, marginBottom: 2 }}>
                      {uiLang === "en" ? "Language mismatch" : "Dil uyuşmazlığı"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--accent-red)", lineHeight: 1.4, opacity: 0.8 }}>
                      {result.lang_mismatch}
                    </div>
                  </div>
                </div>
              )}
              <div style={{
                padding: "14px", borderBottom: "1px solid var(--border)", display: "flex",
                alignItems: "center", gap: 14,
              }}>
                <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                  <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="28" cy="28" r="24" fill="none" stroke="var(--surface-2)" strokeWidth="5" />
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
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>
                    {result.language} · {t.qualityScore}
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.4, color: "var(--text)" }}>{result.summary}</div>
                </div>
                <button onClick={exportPDF} title={t.pdf} style={{
                  flexShrink: 0, alignSelf: "flex-start", background: "var(--surface-2)", color: "var(--text)",
                  border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px",
                  fontSize: 11, fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                }}>{t.pdf}</button>
              </div>

              {sessionCost.calls > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "7px 14px",
                  borderBottom: "1px solid var(--border)", background: "var(--surface)",
                  flexShrink: 0, flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t.costLabel}
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(63,185,80,0.10)", border: "1px solid rgba(63,185,80,0.25)",
                    borderRadius: 10, padding: "2px 9px",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-green)", fontFamily: "inherit" }}>
                      ${sessionDollars < 0.001 ? sessionDollars.toFixed(6) : sessionDollars < 0.01 ? sessionDollars.toFixed(5) : sessionDollars.toFixed(4)}
                    </span>
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                    {t.costTokens(sessionCost.promptTokens, sessionCost.completionTokens)}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-faint)" }}>·</span>
                  <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                    {t.costCalls(sessionCost.calls)}
                  </span>
                  <button onClick={() => setSessionCost({ promptTokens: 0, completionTokens: 0, calls: 0 })} style={{
                    marginLeft: "auto", background: "transparent", border: "none",
                    color: "var(--text-faint)", fontSize: 10, cursor: "pointer",
                    padding: "2px 5px", borderRadius: 4, fontFamily: "inherit",
                  }}>{t.costReset}</button>
                </div>
              )}

              {result.metrics && (
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px",
                  padding: "12px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0,
                }}>
                  {[
                    [t.security, result.metrics.security],
                    [t.performance, result.metrics.performance],
                    [t.readability, result.metrics.readability],
                    [t.maintainability, result.metrics.maintainability],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                        <span style={{ color: "var(--text-muted)" }}>{label}</span>
                        <span style={{ color: scoreColor(val ?? 0), fontWeight: 600 }}>{val ?? "-"}</span>
                      </div>
                      <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          width: `${val ?? 0}%`, height: "100%", background: scoreColor(val ?? 0),
                          borderRadius: 3, transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.code_stats && (() => {
                const s = result.code_stats;
                const cc = s.cyclomatic_complexity ?? 0;
                const ccColor = cc <= 5 ? "var(--accent-green)" : cc <= 10 ? "var(--accent-blue)" : cc <= 20 ? "var(--accent-yellow)" : "var(--accent-red)";
                const ccLabel = cc <= 5 ? t.complexityLow : cc <= 10 ? t.complexityMedium : cc <= 20 ? t.complexityHigh : t.complexityVeryHigh;
                const nestColor = (d) => d <= 3 ? "var(--accent-green)" : d <= 5 ? "var(--accent-yellow)" : "var(--accent-red)";
                const statBadge = (val, color) => (
                  <span style={{
                    display: "inline-block", minWidth: 28, padding: "1px 7px", borderRadius: 10,
                    background: "var(--surface-2)", color: color || "var(--text-bright)",
                    fontSize: 11, fontWeight: 700, textAlign: "center",
                  }}>{val ?? "—"}</span>
                );
                const row = (label, val, color, suffix) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {statBadge(val != null ? val + (suffix || "") : null, color)}
                    </span>
                  </div>
                );
                return (
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>{t.codeStats}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <div>
                        {row(t.statTotalLines, s.total_lines)}
                        {row(t.statCodeLines, s.code_lines)}
                        {row(t.statCommentLines, s.comment_lines)}
                        {row(t.statClasses, s.classes)}
                        {row(t.statFunctions, s.functions)}
                        {row(t.statAvgFuncLen, s.avg_function_length)}
                        {row(t.statLongestFunc, s.longest_function_lines)}
                      </div>
                      <div>
                        {row(t.statIfElse, s.if_else)}
                        {row(t.statLoops, s.loops)}
                        {row(t.statSwitches, s.switches)}
                        {row(t.statTryCatch, s.try_catch)}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.statCyclomaticComplexity}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 10, color: ccColor, fontWeight: 600 }}>{ccLabel}</span>
                            {statBadge(cc, ccColor)}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.statMaxNesting}</span>
                          {statBadge(s.max_nesting_depth, nestColor(s.max_nesting_depth ?? 0))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                {[["explanation", t.tabExplanation], ["findings", t.tabFindings(result.findings.length)], ["diff", t.tabDiff], ["code", t.tabCode], ["tests", t.tabTests]].map(([k, label]) => (
                  <button key={k} onClick={() => setTab(k)} style={{
                    flex: 1, padding: "10px", background: "none", border: "none",
                    borderBottom: tab === k ? "2px solid var(--accent-blue)" : "2px solid transparent",
                    color: tab === k ? "var(--text)" : "var(--text-muted)", fontFamily: "inherit",
                    fontSize: 12, cursor: "pointer", fontWeight: tab === k ? 600 : 400,
                  }}>{label}</button>
                ))}
              </div>

              {tab === "explanation" && (
                <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
                    color: "var(--accent-blue)", fontSize: 13, fontWeight: 600,
                  }}>
                    <span style={{ fontSize: 16 }}>📖</span> {t.codeExplanation.replace(/^📖\s*/, "")}
                  </div>
                  {result.explanation ? (
                    <div style={{
                      background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent-blue)",
                      borderRadius: 6, padding: "14px 16px", color: "var(--text)",
                      fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                    }}>{result.explanation}</div>
                  ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: 12, padding: 12 }}>
                      {t.noExplanation}
                    </div>
                  )}
                </div>
              )}

              {tab === "findings" && (
                <>
                  <div style={{
                    display: "flex", gap: 6, padding: "10px 12px", flexWrap: "wrap",
                    borderBottom: "1px solid var(--surface-2)", flexShrink: 0,
                  }}>
                    <Chip active={filter === "all"} onClick={() => setFilter("all")}
                      color="var(--text-muted)" label={`${t.filterAll} ${result.findings.length}`} />
                    {Object.entries(SEVERITY).map(([k, s]) =>
                      counts[k] ? (
                        <Chip key={k} active={filter === k} onClick={() => setFilter(k)}
                          color={s.color} label={`${t.sev[k]} ${counts[k]}`} />
                      ) : null)}
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                    {visibleFindings.length === 0 && (
                      <div style={{ textAlign: "center", color: "var(--accent-green)", padding: 24, fontSize: 12 }}>
                        ✓ Bu kategoride sorun bulunamadı
                      </div>
                    )}
                    {visibleFindings.map((f, i) => {
                      const s = SEVERITY[f.severity] || SEVERITY.info;
                      return (
                        <div key={i}
                          onClick={() => f.line != null && jumpToLine(f.line)}
                          style={{
                            border: "1px solid var(--border)", borderLeft: `3px solid ${s.color}`,
                            borderRadius: 6, padding: 12, marginBottom: 10, background: "var(--surface)",
                            cursor: f.line != null ? "pointer" : "default",
                          }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{
                              width: 18, height: 18, borderRadius: 4, background: s.bg, color: s.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, flexShrink: 0,
                            }}>{s.icon}</span>
                            <span style={{ fontWeight: 600, color: "var(--text-bright)", flex: 1 }}>{f.title}</span>
                            {f.line != null && (
                              <span style={{
                                color: "var(--accent-blue)", fontSize: 11, display: "flex", alignItems: "center", gap: 3,
                                background: "rgba(88,166,255,0.12)", padding: "2px 7px", borderRadius: 10,
                                whiteSpace: "nowrap",
                              }}>{t.jumpLine} {t.line} {f.line}</span>
                            )}
                          </div>
                          <div style={{ color: "var(--text)", lineHeight: 1.5, marginBottom: 8, fontSize: 12 }}>{f.description}</div>
                          {f.suggestion && (
                            <div style={{
                              background: "var(--bg)", borderRadius: 5, padding: "8px 10px",
                              fontSize: 12, color: "var(--accent-green-soft)", lineHeight: 1.5, borderLeft: "2px solid var(--accent-green-btn)",
                            }}>💡 {f.suggestion}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {tab === "diff" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg)" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "8px 12px",
                    borderBottom: "1px solid var(--surface-2)", fontSize: 11, flexShrink: 0,
                  }}>
                    <span style={{ color: "var(--accent-green)" }}>{t.added(addCount)}</span>
                    <span style={{ color: "var(--accent-red)" }}>{t.deleted(delCount)}</span>
                    <div style={{ marginLeft: "auto", display: "flex", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
                      {[["unified", t.diffUnified], ["split", t.diffSplit]].map(([k, label]) => (
                        <button key={k} onClick={() => setDiffView(k)} style={{
                          padding: "4px 10px", border: "none", fontFamily: "inherit", fontSize: 11,
                          cursor: "pointer", background: diffView === k ? "var(--surface-2)" : "transparent",
                          color: diffView === k ? "var(--text)" : "var(--text-muted)",
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {diffView === "unified" ? (
                    <div style={{ flex: 1, overflow: "auto" }}>
                      <div style={{ display: "flex", position: "sticky", top: 0, background: "var(--surface)",
                        borderBottom: "1px solid var(--border)", fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                        <span style={{ width: 34, textAlign: "right", padding: "4px 6px", flexShrink: 0 }}>Eski</span>
                        <span style={{ width: 34, textAlign: "right", padding: "4px 6px", flexShrink: 0 }}>Yeni</span>
                        <span style={{ width: 16, flexShrink: 0 }} />
                        <span style={{ padding: "4px 8px" }}>Kod</span>
                      </div>
                      {diffRows.map((r, i) => {
                        const st = DIFF_STYLE[r.type];
                        return (
                          <div key={i} style={{ display: "flex", background: st.bg, lineHeight: "20px" }}>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "var(--text-faint)", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{r.ln ?? ""}</span>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "var(--text-faint)", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{r.rn ?? ""}</span>
                            <span style={{ width: 16, color: st.gutter, userSelect: "none", flexShrink: 0, textAlign: "center" }}>{st.sign}</span>
                            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, paddingRight: 8, opacity: r.type === "del" ? 0.85 : 1 }}>{r.text ? <Highlighted line={r.text} /> : "\u00A0"}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ flex: 1, overflow: "auto" }}>
                      <div style={{ display: "flex", position: "sticky", top: 0, background: "var(--surface)",
                        borderBottom: "1px solid var(--border)", fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                        <span style={{ flex: 1, padding: "4px 8px", borderRight: "1px solid var(--border)" }}>Eski</span>
                        <span style={{ flex: 1, padding: "4px 8px" }}>Yeni</span>
                      </div>
                      {splitRows.map((row, i) => (
                        <div key={i} style={{ display: "flex", lineHeight: "20px" }}>
                          <div style={{ flex: 1, display: "flex", minWidth: 0, borderRight: "1px solid var(--surface-2)",
                            background: row.left ? DIFF_STYLE[row.left.type].bg : "transparent" }}>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "var(--text-faint)", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{row.left?.ln ?? ""}</span>
                            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, paddingRight: 8, opacity: 0.95 }}>{row.left?.text ? <Highlighted line={row.left.text} /> : "\u00A0"}</span>
                          </div>
                          <div style={{ flex: 1, display: "flex", minWidth: 0,
                            background: row.right ? DIFF_STYLE[row.right.type].bg : "transparent" }}>
                            <span style={{ width: 34, textAlign: "right", padding: "0 6px", color: "var(--text-faint)", userSelect: "none", flexShrink: 0, fontSize: 11 }}>{row.right?.rn ?? ""}</span>
                            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, paddingRight: 8 }}>{row.right?.text ? <Highlighted line={row.right.text} /> : "\u00A0"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "code" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg)" }}>
                  <div style={{
                    display: "flex", justifyContent: "flex-end", padding: "8px 12px",
                    borderBottom: "1px solid var(--surface-2)",
                  }}>
                    <button onClick={copyImproved} style={{
                      background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)",
                      borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer",
                      fontFamily: "inherit",
                    }}>{copied ? t.copied : t.copy}</button>
                  </div>
                  {result.improved_explanation && (
                    <div style={{
                      flexShrink: 0, padding: "10px 14px", borderBottom: "1px solid var(--surface-2)",
                      background: "rgba(63,185,80,0.06)",
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6, marginBottom: 5,
                        color: "var(--accent-green)", fontSize: 11, fontWeight: 600,
                      }}>{t.whatChanged}</div>
                      <div style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {result.improved_explanation}
                      </div>
                    </div>
                  )}
                  <pre style={{
                    flex: 1, overflow: "auto", margin: 0, padding: 14, fontSize: 12.5,
                    lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word",
                    background: "var(--bg)", color: "var(--text)",
                  }}>
                    {(result.improved_code || "").split("\n").map((ln, i) => (
                      <div key={i}>{ln ? <Highlighted line={ln} /> : "\u00A0"}</div>
                    ))}
                  </pre>
                </div>
              )}

              {tab === "tests" && (
                <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
                  {result.test_framework && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
                      background: "rgba(88,166,255,0.12)", color: "var(--accent-blue)", borderRadius: 12,
                      padding: "3px 11px", fontSize: 11, fontWeight: 600,
                    }}>🧪 {result.test_framework}</div>
                  )}

                  {[
                    ["tests", t.origTests, result.tests, "var(--accent-blue)"],
                    ["improved_tests", t.improvedTests, result.improved_tests, "var(--accent-green)"],
                  ].map(([key, title, content, color]) => (
                    <div key={key} style={{ marginBottom: 18 }}>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 6,
                      }}>
                        <span style={{ color, fontSize: 12, fontWeight: 600 }}>{title}</span>
                        {content && (
                          <button onClick={() => copyText(content, key)} style={{
                            background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)",
                            borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer",
                            fontFamily: "inherit",
                          }}>{copiedKey === key ? t.copied : t.copy}</button>
                        )}
                      </div>
                      {content ? (
                        <pre style={{
                          margin: 0, padding: 12, fontSize: 12, lineHeight: 1.6,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                          background: "var(--bg)", border: "1px solid var(--surface-2)",
                          borderLeft: `3px solid ${color}`, borderRadius: 6,
                        }}>
                          {content.split("\n").map((ln, i) => (
                            <div key={i}>{ln ? <Highlighted line={ln} /> : "\u00A0"}</div>
                          ))}
                        </pre>
                      ) : (
                        <div style={{ color: "var(--text-muted)", fontSize: 12, padding: 10 }}>
                          {t.noTests}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        html, body { margin: 0; padding: 0; min-height: 100%; }
        .app-root[data-theme="dark"] {
          --bg: #0d1117; --surface: #161b22; --surface-2: #21262d; --border: #30363d;
          --text: #c9d1d9; --text-bright: #e6edf3; --text-muted: #8b949e; --text-faint: #484f58;
          --accent-blue: #58a6ff; --accent-blue-strong: #1f6feb; --accent-green: #3fb950;
          --accent-green-btn: #238636; --accent-green-soft: #7ee787; --accent-yellow: #d29922;
          --accent-red: #f85149; --accent-purple: #a371f7;
          --tok-keyword: #ff7b72; --tok-string: #a5d6ff; --tok-number: #79c0ff;
        }
        .app-root[data-theme="light"] {
          --bg: #ffffff; --surface: #f6f8fa; --surface-2: #eaeef2; --border: #d0d7de;
          --text: #1f2328; --text-bright: #0a0c10; --text-muted: #57606a; --text-faint: #8c959f;
          --accent-blue: #0969da; --accent-blue-strong: #0969da; --accent-green: #1a7f37;
          --accent-green-btn: #1f883d; --accent-green-soft: #1a7f37; --accent-yellow: #9a6700;
          --accent-red: #cf222e; --accent-purple: #8250df;
          --tok-keyword: #cf222e; --tok-string: #0a3069; --tok-number: #0550ae;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }
        .app-root textarea::placeholder { color: var(--text-faint); }
        .app-root ::-webkit-scrollbar { width: 8px; height: 8px; }
        .app-root ::-webkit-scrollbar-track { background: var(--bg); }
        .app-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        /* Highlight katmanı: textarea ile aynı yatay scrollbar yerini ayırır (dikey hiza korunur)
           ama çubuğu görünmez kalır; gerçek kaydırma textarea'dan senkronlanır. */
        .app-root .hl-layer::-webkit-scrollbar { height: 8px; background: transparent; }
        .app-root .hl-layer::-webkit-scrollbar-thumb { background: transparent; }
        .app-root .hl-layer::-webkit-scrollbar-track { background: transparent; }
        .app-root select option { background: var(--surface-2); color: var(--text); }
        /* Tüm esnek panellerin boş alanları da temayı yansıtsın */
        .app-root pre { background: var(--bg); color: var(--text); }
        .app-root [data-panel] { background: var(--bg); }
      `}</style>
    </div>
  );
}

function Chip({ active, onClick, color, label }) {
  return (
    <button onClick={onClick} style={{
      background: active ? color : "transparent",
      color: active ? "var(--bg)" : color,
      border: `1px solid ${color}`, borderRadius: 12, padding: "3px 10px",
      fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
    }}>{label}</button>
  );
}
