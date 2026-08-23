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

function getBasePath(){
  const script = document.querySelector('script[src*="app.js"]');
  if(script && script.src){
    const url = new URL(script.src, window.location.href);
    return url.pathname.replace(/\/[^/]*$/, '/');
  }
  return window.location.pathname.replace(/\/[^/]*$/, '/') + '/';
}

async function loadJSON(path){
  const base = getBasePath();
  const url = new URL(path, base).href;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Failed to load ${url}`);
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

  // Update Schema.org JSON-LD with full structured data
  const jobTitles = {
    en: "Senior .NET Engineer",
    fr: "Ingénieur .NET Senior",
    ar: "مهندس .NET أول",
    es: "Ingeniero .NET Senior",
    zh: "资深 .NET 工程师"
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": content.name,
    "jobTitle": jobTitles[locale.langCode] || jobTitles.en,
    "url": content.website,
    "email": content.email,
    "telephone": content.phone.replace(/\s+/g, ""),
    "sameAs": [content.linkedin, "https://www.crunchbase.com/organization/vermeg", "https://www.crunchbase.com/organization/aswat", "https://en.wikipedia.org/wiki/Alternative_trading_system", "https://en.wikipedia.org/wiki/Precision_agriculture"],
    "description": locale.seo?.description || "",
    "knowsAbout": [
      ...content.skills.microsoft,
      ...content.skills.methods,
      ...content.skills.process
    ].slice(0, 15),
    "worksFor": content.experience.length > 0 ? {
      "@type": "Organization",
      "name": content.experience[0].company
    } : undefined
  };
  $("#jsonld").textContent = JSON.stringify(schema);
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

// Generate PDF dynamically using html2pdf
function generatePDF(locale, content) {
  const rtl = locale.langCode === "ar";

  const container = document.createElement("div");
  container.style.width = "180mm";
  container.style.margin = "0 auto";
  container.style.direction = rtl ? "rtl" : "ltr";
  container.style.textAlign = rtl ? "right" : "left";
  container.style.fontFamily = rtl ? "'Amiri', serif" : "Arial, Helvetica, sans-serif";
  container.style.fontSize = "10px";
  container.style.lineHeight = "1.3";
  container.style.color = "#000";
  container.style.whiteSpace = "normal";
  container.style.wordBreak = "break-word";
  container.style.overflowWrap = "break-word";

  container.innerHTML = `
    <style>
      section { page-break-inside: avoid; margin-bottom: 8px; }
      h1, h2, h3 {
        page-break-inside: avoid;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }
      p, ul, li { page-break-inside: avoid; }
    </style>

    <section>
      <h1>${content.name}</h1>
      <p>${t(locale,"hero.subtitle")}</p>
      <p>
        ${t(locale,"contact.phone")}: ${content.phone}<br/>
        ${t(locale,"contact.email")}: ${content.email}<br/>
        ${t(locale,"contact.linkedin")}: ${content.linkedin}<br/>
        Website: ${content.website}
      </p>
    </section>
    <hr/>
    <section>
      <h2>${t(locale,"about.title")}</h2>
      <p>${t(locale,"about.body")}</p>
    </section>
    <hr/>
    <section>
      <h2>${t(locale,"skills.title")}</h2>
      ${renderSkillsPDF(content.skills, locale, rtl)}
    </section>
    <hr/>
    <section>
      <h2>${t(locale,"experience.title")}</h2>
    </section>
    <hr/>
    ${content.experience.map(x => {
      const role     = rtl ? x.role_ar     : locale.langCode==="fr" ? x.role_fr     : x.role_en;
      const industry = rtl ? x.industry_ar : locale.langCode==="fr" ? x.industry_fr : x.industry_en;
      const dates    = rtl ? x.date_ar     : locale.langCode==="fr" ? x.date_fr     : x.date_en;
      const desc     = rtl ? x.full_description_ar : locale.langCode==="fr" ? x.full_description_fr : x.full_description_en;
      return `
        <section>
          <h3 style="display:flex;justify-content:space-between;">
            <span>${role}</span><span>${x.company}</span>
          </h3>
          <p><em>${industry} • ${dates}</em></p>
          ${desc}
          <p><strong>Stack:</strong> ${x.stack}</p>
        </section>
        <hr/>
      `;
    }).join("")}
  `;

  document.body.appendChild(container);

  html2pdf().set({
    margin: [15, 15, 15, 15],
    filename: `${content.name}-${locale.langCode}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'p' }
  }).from(container).save().then(() => {
    document.body.removeChild(container);
  });
}

function renderSkillsPDF(skills, locale, rtl) {
  const labels = {
    architecture: t(locale,"skills.architecture"),
    methods:      t(locale,"skills.methods"),
    process:      t(locale,"skills.process"),
    modeling:     t(locale,"skills.modeling"),
    communication:t(locale,"skills.communication"),
    patterns:     t(locale,"skills.patterns"),
    microsoft:    t(locale,"skills.microsoft"),
    other_langs:  t(locale,"skills.other_langs"),
    ibm:          t(locale,"skills.ibm"),
    scripting:    t(locale,"skills.scripting"),
    is:           t(locale,"skills.is"),
    tools:        t(locale,"skills.tools"),
  };
  return Object.keys(skills).map(key => `
    <div style="margin-bottom:6px;">
      <strong>${labels[key]}:</strong>
      <span>${skills[key].join(", ")}</span>
    </div>
  `).join("");
}

function renderServices(locale, content){
  const grid = $("#services-grid");
  if(!grid) return;
  grid.innerHTML = "";
  (content.services || []).forEach(svc => {
    const title = locale.langCode === "ar" ? svc.title_ar : locale.langCode === "fr" ? svc.title_fr : svc.title_en;
    const desc  = locale.langCode === "ar" ? svc.desc_ar  : locale.langCode === "fr" ? svc.desc_fr  : svc.desc_en;
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="service-icon">${svc.icon}</div>
      <h3 class="service-title">${title}</h3>
      <p class="service-desc">${desc}</p>
      <div class="service-stack">${svc.stack}</div>
    `;
    grid.appendChild(card);
  });
}

function renderCertifications(locale, content){
  const list = $("#cert-list");
  if(!list) return;
  list.innerHTML = "";
  const certs = content.certifications || [];
  if(!certs.length) return;

  const heading = document.createElement("div");
  heading.className = "cert-heading";
  heading.textContent = t(locale, "diploma.cert_title");
  list.appendChild(heading);

  certs.forEach(cert => {
    const item = document.createElement("div");
    item.className = "cert-item";
    const hasId = cert.credential_id && !cert.credential_id.startsWith("REPLACE");
    item.innerHTML = `
      <div class="cert-name">🏅 ${cert.title}</div>
      <div class="cert-meta">
        ${cert.issuer} · ${t(locale,"diploma.issued")} ${cert.date}
        ${hasId ? `· <span class="cert-id">${t(locale,"diploma.credential")}: <strong>${cert.credential_id}</strong></span>` : ""}
      </div>
    `;
    list.appendChild(item);
  });

  // Update diploma button labels
  const d1 = $("#diploma-label");
  const d2 = $("#diploma-label2");
  if(d1) d1.textContent = t(locale, "diploma.label");
  if(d2) d2.textContent = t(locale, "diploma.label");
}

function renderProjects(locale, content){
  const grid = $("#projects-grid");
  if(!grid) return;
  grid.innerHTML = "";
  const sectorLabel = t(locale, "projects_section.sector");
  (content.projects || []).forEach(proj => {
    const title  = locale.langCode === "ar" ? proj.title_ar  : locale.langCode === "fr" ? proj.title_fr  : proj.title_en;
    const desc   = locale.langCode === "ar" ? proj.desc_ar   : locale.langCode === "fr" ? proj.desc_fr   : proj.desc_en;
    const sector = locale.langCode === "ar" ? proj.sector_ar : locale.langCode === "fr" ? proj.sector_fr : proj.sector_en;
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-sector">${sectorLabel}: <strong>${sector}</strong></div>
      <h3 class="project-title">${title}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-stack">${proj.stack}</div>
    `;
    grid.appendChild(card);
  });
}

function render(locale, content){
  $("#brand-name").textContent = content.name;

  $$("#nav a").forEach(a => {
    const key = a.getAttribute("data-i18n");
    a.textContent = t(locale, key);
  });

  // Hero
  $("#hero-title").textContent   = t(locale, "hero.title");
  $("#hero-subtitle").textContent = t(locale, "hero.subtitle");
  const taglineEl = $("#hero-tagline");
  if(taglineEl) taglineEl.textContent = t(locale, "hero.tagline");

  // About / Skills
  $("#about-title").textContent  = t(locale, "about.title");
  $("#about-body").textContent   = t(locale, "about.body");
  $("#skills-title").textContent = t(locale, "skills.title");

  // Section headings
  const servicesTitle = $("#services-title");
  if(servicesTitle) servicesTitle.textContent = t(locale, "services.title");
  const projectsTitle = $("#projects-title");
  if(projectsTitle) projectsTitle.textContent = t(locale, "projects_section.title");
  $("#exp-title").textContent    = t(locale, "experience.title");

  // Contact
  $("#contact-title").textContent = t(locale, "contact.title");
  const sub = $("#contact-subtitle");
  if(sub) sub.textContent = t(locale, "contact.subtitle");
  const cta = $("#contact-cta");
  if(cta){ cta.textContent = t(locale, "contact.cta"); cta.href = `mailto:${content.email}`; }

  $("#search").setAttribute("placeholder", t(locale, "search.placeholder"));
  $("#contact-phone-label").textContent   = t(locale, "contact.phone");
  $("#contact-email-label").textContent   = t(locale, "contact.email");
  $("#contact-linkedin-label").textContent = t(locale, "contact.linkedin");
  const profilesLabel = $("#contact-profiles-label");
  if (profilesLabel) profilesLabel.textContent = t(locale, "contact.profiles");

  $("#phone").textContent = content.phone;
  $("#phone").href = `tel:${content.phone.replace(/\s+/g,'')}`;
  $("#email").textContent = content.email;
  $("#email").href = `mailto:${content.email}`;
  $("#linkedin").textContent = content.linkedin.replace(/https?:\/\//,"");
  $("#linkedin").href = content.linkedin;
  $("#whatsapp").href = content.whatsapp;

  // Hire Me button
  const hireBtn = $("#hire-btn");
  if(hireBtn) hireBtn.textContent = t(locale, "hero.ctaHire");

  // CV / Projects buttons
  const cvLink = $("#cv-link");
  cvLink.textContent = t(locale, "hero.ctaPrimary");
  cvLink.onclick = null;
  cvLink.addEventListener("click", (e) => {
    e.preventDefault();
    generatePDF(locale, content);
  });
  const contactLink = $("#contact-link");
  contactLink.textContent = t(locale, "hero.ctaSecondary");
  contactLink.href = "#projects";

  // Skills badges
  const badgeContainer = $("#skills-badges");
  badgeContainer.innerHTML = "";
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
  skillBuckets.forEach(s => {
    const k = normalizeSearch(s);
    if(seen.has(k)) return;
    seen.add(k);
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = s;
    badgeContainer.appendChild(span);
  });

  // Certifications, Services & Projects
  renderCertifications(locale, content);
  renderServices(locale, content);
  renderProjects(locale, content);

  // Experience timeline
  const timeline = $("#timeline");
  timeline.innerHTML = "";
  content.experience.forEach(x => {
    const div = document.createElement("div");
    div.className = "item";
    div.setAttribute("data-search", normalizeSearch([
      x.company, x.industry_en, x.industry_fr, x.industry_ar,
      x.date_en, x.date_fr, x.date_ar,
      x.role_en, x.role_fr, x.role_ar,
      x.stack, ...(x.highlights_en||[]), ...(x.highlights_fr||[]), ...(x.highlights_ar||[])
    ].join(" ")));

    const head = document.createElement("div");
    head.className = "item-head";

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = `${x.company} — ${locale.langCode==="ar"?x.role_ar:locale.langCode==="fr"?x.role_fr:x.role_en}`;

    const meta = document.createElement("div");
    meta.className = "item-meta";
    meta.textContent = `${locale.langCode==="ar"?x.industry_ar:locale.langCode==="fr"?x.industry_fr:x.industry_en} • ${locale.langCode==="ar"?x.date_ar:locale.langCode==="fr"?x.date_fr:x.date_en}`;

    head.appendChild(title);
    head.appendChild(meta);

    const ul = document.createElement("ul");
    const highlights = locale.langCode==="ar"?x.highlights_ar:locale.langCode==="fr"?x.highlights_fr:x.highlights_en;
    (highlights||[]).forEach(h => {
      const li = document.createElement("li");
      li.textContent = h;
      ul.appendChild(li);
    });

    const readMoreText = {
      en: "Read more",
      fr: "Lire la suite",
      ar: "اقرأ المزيد",
      es: "Leer más",
      zh: "阅读更多"
    };
    const hideText = {
      en: "Hide",
      fr: "Masquer",
      ar: "إخفاء",
      es: "Ocultar",
      zh: "收起"
    };

    const toggle = document.createElement("button");
    toggle.className = "accordion-toggle";
    toggle.textContent = readMoreText[locale.langCode] || readMoreText.en;

    const full = document.createElement("div");
    full.className = "accordion-content";
    const descKey = locale.langCode === "ar" ? "full_description_ar" : locale.langCode === "fr" ? "full_description_fr" : locale.langCode === "es" ? "full_description_en" : locale.langCode === "zh" ? "full_description_en" : "full_description_en";
    full.innerHTML = x[descKey];

    toggle.addEventListener("click", () => {
      const open = full.classList.toggle("open");
      toggle.textContent = open
        ? (hideText[locale.langCode] || hideText.en)
        : (readMoreText[locale.langCode] || readMoreText.en);
    });

    const stack = document.createElement("div");
    stack.className = "small";
    stack.textContent = x.stack;

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
    items.forEach(it => {
      const hay = normalizeSearch(it.getAttribute("data-search")||"");
      it.style.display = (q==="" || hay.includes(q)) ? "" : "none";
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
    ar: await loadJSON("./locales/ar.json"),
    es: await loadJSON("./locales/es.json"),
    zh: await loadJSON("./locales/zh.json")
  };

  const setLang = async (code) => {
    const locale = locales[code] || locales.en;
    setQueryParam("lang", locale.langCode);
    localStorage.setItem("lang", locale.langCode);
    langSelect.value = locale.langCode;
    setDirAndRTL(locale);
    applySEO(locale, content);
    render(locale, content);
    bindSearch();
  };

  langSelect.addEventListener("change", (e) => setLang(e.target.value));
  await setLang(requested);
}

main().catch(err => {
  console.error(err);
  document.body.innerHTML = "<div style='padding:24px;font-family:system-ui;color:#111;background:#fff'>Failed to load site assets.</div>";
});
