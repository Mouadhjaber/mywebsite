const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

function getQueryParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

function setQueryParam(name, value){
  const u = new URL(window.location.href);
  u.searchParams.set(name, value);
  history.replaceState({}, "", u.toString());
}

async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function normalizeSearch(s){
  if(!s) return "";
  return s.toString().toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g,"")
          .replace(/[أإآا]/g,"ا")
          .replace(/[يى]/g,"ي")
          .replace(/[ة]/g,"ه")
          .replace(/[ؤئ]/g,"ء")
          .trim();
}

function applySEO(locale, content){
  document.title = locale.siteTitle;
  const desc = locale.seo?.description || "";
  const keywords = locale.seo?.keywords || "";
  $("#meta-desc").setAttribute("content", desc);
  $("#meta-keywords").setAttribute("content", keywords);
  $("#og-title").setAttribute("content", locale.siteTitle);
  $("#og-desc").setAttribute("content", desc);
}

function setDirAndRTL(locale){
  const rtl = locale.dir === "rtl" || locale.langCode === "ar";
  document.documentElement.lang = locale.langCode;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", rtl);
}

function t(locale, path){
  return path.split(".").reduce((acc, k) => acc && acc[k], locale) ?? "";
}

// Generate PDF dynamically using jsPDF
function generatePDF(locale, content) {
  const rtl = locale.langCode === "ar";

  // Build document definition
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [15, 15, 15, 15], // [left, top, right, bottom] in mm
    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.3
    },
    content: [
      // HEADER
      { text: content.name, fontSize: 16, bold: true, margin: [0, 0, 0, 5], alignment: rtl ? 'right' : 'left' },
      { text: t(locale, "hero.subtitle"), margin: [0,0,0,5], alignment: rtl ? 'right' : 'left' },
      { 
        text: `${t(locale,"contact.phone")}: ${content.phone}\n${t(locale,"contact.email")}: ${content.email}\n${t(locale,"contact.linkedin")}: ${content.linkedin}`,
        margin: [0,0,0,5],
        alignment: rtl ? 'right' : 'left'
      },
      { canvas: [{ type: 'line', x1:0, y1:0, x2:595, y2:0, lineWidth: 1 }] },

      // ABOUT
      { text: t(locale,"about.title"), fontSize: 14, bold: true, margin: [0,5,0,2], alignment: rtl ? 'right' : 'left' },
      { text: t(locale,"about.body"), margin: [0,0,0,5], alignment: rtl ? 'right' : 'left' },

      // EXPERIENCE
      { text: t(locale,"experience.title"), fontSize: 14, bold: true, margin: [0,5,0,2], alignment: rtl ? 'right' : 'left' },
      ...content.experience.map(x => {
        const role = rtl ? x.role_ar : locale.langCode === 'fr' ? x.role_fr : x.role_en;
        const industry = rtl ? x.industry_ar : locale.langCode === 'fr' ? x.industry_fr : x.industry_en;
        const dates = rtl ? x.date_ar : locale.langCode === 'fr' ? x.date_fr : x.date_en;
        const desc = rtl ? x.full_description_ar : locale.langCode === 'fr' ? x.full_description_fr : x.full_description_en;
        const highlights = rtl ? x.highlights_ar : locale.langCode === 'fr' ? x.highlights_fr : x.highlights_en;

        return {
          stack: [
            { text: `${role} — ${x.company}`, fontSize: 12, bold: true, margin: [0,5,0,2], alignment: rtl ? 'right' : 'left' },
            { text: `${industry} • ${dates}`, italics: true, margin: [0,0,0,2], alignment: rtl ? 'right' : 'left' },
            { text: desc, margin: [0,0,0,2], alignment: rtl ? 'right' : 'left' },
            ...(highlights?.length ? [{ ul: highlights, margin: [0,0,0,2], alignment: rtl ? 'right' : 'left' }] : []),
            { text: `Stack: ${x.stack}`, margin: [0,0,0,2], italics: true, alignment: rtl ? 'right' : 'left' }
          ]
        };
      })
    ],
    defaultStyle: { alignment: rtl ? 'right' : 'left' }
  };

  pdfMake.createPdf(docDefinition).download(`${content.name}-${locale.langCode}.pdf`);
}









function render(locale, content){
  $("#brand-name").textContent = content.name;

  $$("#nav a").forEach(a=>{
    const key = a.getAttribute("data-i18n");
    a.textContent = t(locale, key);
  });

  $("#hero-title").textContent = t(locale, "hero.title");
  $("#hero-subtitle").textContent = t(locale, "hero.subtitle");
  $("#about-title").textContent = t(locale, "about.title");
  $("#about-body").textContent = t(locale, "about.body");
  $("#skills-title").textContent = t(locale, "skills.title");
  $("#exp-title").textContent = t(locale, "experience.title");
  $("#contact-title").textContent = t(locale, "contact.title");

  $("#search").setAttribute("placeholder", t(locale, "search.placeholder"));

  $("#contact-phone-label").textContent = t(locale, "contact.phone");
  $("#contact-email-label").textContent = t(locale, "contact.email");
  $("#contact-linkedin-label").textContent = t(locale, "contact.linkedin");

  $("#phone").textContent = content.phone;
  $("#phone").href = `tel:${content.phone.replace(/\s+/g,'')}`;
  $("#email").textContent = content.email;
  $("#email").href = `mailto:${content.email}`;
  $("#linkedin").textContent = content.linkedin.replace("https://","").replace("http://","");
  $("#linkedin").href = content.linkedin;
  $("#whatsapp").href = content.whatsapp;
  $("#cv-link").textContent = t(locale, "hero.ctaPrimary");
  $("#cv-link").addEventListener("click", (e) => {
    e.preventDefault();
    generatePDF(locale, content); // doc.save() happens inside generatePDF callback
  });

  $("#contact-link").textContent = t(locale, "hero.ctaSecondary");

  // Skills
  const badgeContainer = $("#skills-badges");
  badgeContainer.innerHTML="";
  const skillBuckets = [
    ...content.skills.methods,
    ...content.skills.process,
    ...content.skills.modeling,
    ...content.skills.patterns,
    ...content.skills.microsoft,
    ...content.skills.other_langs,
    ...content.skills.scripting,
    ...content.skills.tools
  ];
  const seen = new Set();
  skillBuckets.forEach(s=>{
    const k = normalizeSearch(s);
    if(seen.has(k)) return;
    seen.add(k);
    const span = document.createElement("span");
    span.className="badge";
    span.textContent=s;
    badgeContainer.appendChild(span);
  });

  // Experience
  const timeline=$("#timeline");
  timeline.innerHTML="";
  content.experience.forEach(x=>{
    const div=document.createElement("div");
    div.className="item";
    div.setAttribute("data-search", normalizeSearch([
      x.company, x.industry_en, x.industry_fr, x.industry_ar,
      x.date_en, x.date_fr, x.date_ar,
      x.role_en, x.role_fr, x.role_ar,
      x.stack, ...(x.highlights_en||[]), ...(x.highlights_fr||[]), ...(x.highlights_ar||[])
    ].join(" ")));

    const head=document.createElement("div");
    head.className="item-head";
    const title=document.createElement("div");
    title.className="item-title";
    title.textContent = `${x.company} — ${locale.langCode==="ar"?x.role_ar:locale.langCode==="fr"?x.role_fr:x.role_en}`;
    const meta=document.createElement("div");
    meta.className="item-meta";
    meta.textContent = `${locale.langCode==="ar"?x.industry_ar:locale.langCode==="fr"?x.industry_fr:x.industry_en} • ${locale.langCode==="ar"?x.date_ar:locale.langCode==="fr"?x.date_fr:x.date_en}`;
    head.appendChild(title);
    head.appendChild(meta);

    const ul=document.createElement("ul");
    const highlights = locale.langCode==="ar"?x.highlights_ar:locale.langCode==="fr"?x.highlights_fr:x.highlights_en;
    (highlights||[]).forEach(h=>{
      const li=document.createElement("li");
      li.textContent=h;
      ul.appendChild(li);
    });

    const toggle=document.createElement("button");
    toggle.className="accordion-toggle";
    if(locale.langCode==="ar") toggle.textContent="اقرأ المزيد";
    else if(locale.langCode==="fr") toggle.textContent="Lire la suite";
    else toggle.textContent="Read more";

    const full=document.createElement("div");
    full.className="accordion-content";
    full.innerHTML = locale.langCode==="ar"?x.full_description_ar:locale.langCode==="fr"?x.full_description_fr:x.full_description_en;

    toggle.addEventListener("click", ()=>{
      const open = full.classList.toggle("open");
      if(locale.langCode==="ar") toggle.textContent=open?"إخفاء":"اقرأ المزيد";
      else if(locale.langCode==="fr") toggle.textContent=open?"Masquer":"Lire la suite";
      else toggle.textContent=open?"Hide":"Read more";
    });

    const stack=document.createElement("div");
    stack.className="small";
    stack.textContent=x.stack;

    div.appendChild(head);
    div.appendChild(ul);
    div.appendChild(toggle);
    div.appendChild(full);
    div.appendChild(stack);

    timeline.appendChild(div);
  });
}

function bindSearch(){
  const input = $("#search");
  const items = $$("#timeline .item");

  const update = () => {
    const q = normalizeSearch(input.value.trim());
    items.forEach(it=>{
      const hay = normalizeSearch(it.getAttribute("data-search")||"");
      it.style.display = (q==="" || hay.includes(q))?"":"none";
    });
  };

  input.addEventListener("input", update);
  update();
}

async function main(){
  const requested = getQueryParam("lang") || localStorage.getItem("lang") || "en";
  const langSelect = $("#lang");

  const content = await loadJSON("./content.json");
  const locales = {
    en: await loadJSON("./locales/en.json"),
    fr: await loadJSON("./locales/fr.json"),
    ar: await loadJSON("./locales/ar.json")
  };

  const setLang = async (code)=>{
    const locale = locales[code]||locales.en;
    setQueryParam("lang", locale.langCode);
    localStorage.setItem("lang", locale.langCode);
    langSelect.value = locale.langCode;
    setDirAndRTL(locale);
    applySEO(locale, content);
    render(locale, content);
    bindSearch();
  };

  langSelect.addEventListener("change", (e)=>setLang(e.target.value));
  await setLang(requested);
}

main().catch(err=>{
  console.error(err);
  document.body.innerHTML="<div style='padding:24px;font-family:system-ui;color:#111;background:#fff'>Failed to load site assets.</div>";
});
