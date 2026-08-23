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
    try {
      const url = new URL(script.src);
      return url.pathname.replace(/\/[^/]*$/, '/');
    } catch {}
  }
  try {
    const url = new URL(window.location.href);
    return url.pathname.replace(/\/[^/]*$/, '/') + '/';
  } catch {
    return '/';
  }
}

async function loadJSON(path){
  const base = getBasePath();
  let url;
  try {
    url = new URL(path, base).href;
  } catch {
    url = new URL(path, window.location.origin + base).href;
  }
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

// Generate PDF dynamically using html2pdf - Oxford-style professional CV format
function generatePDF(locale, content) {
  const rtl = locale.langCode === "ar";

  const container = document.createElement("div");
  // A4 = 210mm x 297mm, with 20mm margins = 170mm x 257mm printable area
  container.style.width = "170mm";
  container.style.maxWidth = "170mm";
  container.style.margin = "0 auto";
  container.style.direction = rtl ? "rtl" : "ltr";
  container.style.textAlign = rtl ? "right" : "left";
  container.style.fontFamily = rtl ? "'Amiri', 'Noto Sans Arabic', serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif";
  container.style.fontSize = "10.5pt";
  container.style.lineHeight = "1.5";
  container.style.color = "#1a1a1a";
  container.style.whiteSpace = "normal";
  container.style.wordBreak = "break-word";
  container.style.overflowWrap = "break-word";
  container.style.overflow = "hidden";
  container.style.boxSizing = "border-box";
  container.style.padding = "0";
  container.style.background = "#fff";

  const primaryColor = "#1a3c5e";
  const secondaryColor = "#2c5f8a";
  const accentColor = "#3a7cb8";
  const textColor = "#1a1a1a";
  const mutedColor = "#555555";
  const lineColor = "#d0d0d0";

  container.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
        word-break: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }
      @page { margin: 20mm; }
      
      /* Page break controls */
      section { page-break-inside: avoid; }
      h1, h2, h3 { page-break-after: avoid; page-break-inside: avoid; }
      p, ul, li { page-break-inside: avoid; orphans: 3; widows: 3; }
      
      /* Header / Name block */
      .cv-header {
        border-bottom: 3px solid ${primaryColor};
        padding-bottom: 12px;
        margin-bottom: 18px;
      }
      .cv-name {
        font-size: 24pt;
        font-weight: 700;
        color: ${primaryColor};
        letter-spacing: -0.5px;
        margin: 0 0 4px 0;
        line-height: 1.2;
      }
      .cv-title {
        font-size: 12pt;
        font-weight: 400;
        color: ${secondaryColor};
        margin: 0 0 8px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .cv-contact {
        font-size: 9pt;
        color: ${mutedColor};
        line-height: 1.6;
      }
      .cv-contact a { color: ${accentColor}; text-decoration: none; }
      .cv-contact a:hover { text-decoration: underline; }
      .contact-item { display: inline-block; margin-right: 16px; }
      .contact-item:last-child { margin-right: 0; }
      .contact-label { font-weight: 600; color: ${textColor}; margin-right: 4px; }
      
      /* Section headers */
      .cv-section {
        margin-bottom: 16px;
      }
      .cv-section-title {
        font-size: 11pt;
        font-weight: 700;
        color: ${primaryColor};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid ${primaryColor};
        padding-bottom: 4px;
        margin: 0 0 12px 0;
      }
      
      /* Profile / Summary */
      .cv-profile {
        font-size: 10pt;
        line-height: 1.6;
        color: ${textColor};
        text-align: justify;
      }
      
      /* Experience */
      .experience-item {
        margin-bottom: 16px;
        page-break-inside: avoid;
      }
      .experience-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }
      .experience-role {
        font-size: 10.5pt;
        font-weight: 700;
        color: ${textColor};
        flex: 1;
        min-width: 0;
      }
      .experience-company {
        font-size: 10.5pt;
        font-weight: 600;
        color: ${primaryColor};
        white-space: nowrap;
      }
      .experience-meta {
        font-size: 9pt;
        color: ${mutedColor};
        margin-bottom: 6px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .experience-meta span { display: inline-flex; align-items: center; }
      .experience-description {
        font-size: 10pt;
        line-height: 1.55;
        color: ${textColor};
        margin-bottom: 6px;
      }
      .experience-bullets {
        margin: 6px 0 0 0;
        padding-left: ${rtl ? '0' : '18px'};
        padding-right: ${rtl ? '18px' : '0'};
      }
      .experience-bullets li {
        font-size: 9.5pt;
        line-height: 1.5;
        color: ${textColor};
        margin-bottom: 3px;
        position: relative;
      }
      .experience-bullets li::before {
        content: "▸ ";
        color: ${accentColor};
        font-weight: bold;
        position: absolute;
        left: ${rtl ? 'auto' : '-18px'};
        right: ${rtl ? '-18px' : 'auto'};
      }
      .experience-stack {
        font-size: 9pt;
        color: ${mutedColor};
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px solid ${lineColor};
      }
      .experience-stack strong { color: ${textColor}; }
      
      /* Skills */
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;
      }
      .skill-category {
        background: #f8f9fa;
        border: 1px solid ${lineColor};
        border-radius: 4px;
        padding: 8px 10px;
        page-break-inside: avoid;
      }
      .skill-category-title {
        font-size: 8.5pt;
        font-weight: 700;
        color: ${primaryColor};
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin: 0 0 6px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid ${lineColor};
      }
      .skill-items {
        font-size: 9pt;
        color: ${textColor};
        line-height: 1.5;
      }
      
      /* Education / Certifications */
      .education-item {
        margin-bottom: 10px;
        page-break-inside: avoid;
      }
      .education-title {
        font-size: 10pt;
        font-weight: 700;
        color: ${textColor};
        margin: 0 0 2px 0;
      }
      .education-institution {
        font-size: 9.5pt;
        font-weight: 600;
        color: ${primaryColor};
        margin: 0 0 2px 0;
      }
      .education-meta {
        font-size: 9pt;
        color: ${mutedColor};
        margin: 0;
      }
      
      /* Footer */
      .cv-footer {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid ${lineColor};
        font-size: 8pt;
        color: ${mutedColor};
        text-align: center;
      }
      
      /* RTL adjustments */
      ${rtl ? `
        .experience-bullets li::before { right: -18px; left: auto; }
        .contact-item { margin-left: 16px; margin-right: 0; }
      ` : ''}
    </style>

    <div class="cv-header">
      <h1 class="cv-name">${content.name}</h1>
      <p class="cv-title">${t(locale, "hero.subtitle")}</p>
      <div class="cv-contact">
        <span class="contact-item"><span class="contact-label">${t(locale,"contact.phone")}:</span> ${content.phone}</span>
        <span class="contact-item"><span class="contact-label">${t(locale,"contact.email")}:</span> <a href="mailto:${content.email}">${content.email}</a></span>
        <span class="contact-item"><span class="contact-label">${t(locale,"contact.linkedin")}:</span> <a href="${content.linkedin}" target="_blank">linkedin.com/in/mouadhjaber</a></span>
        <span class="contact-item"><span class="contact-label">Website:</span> <a href="${content.website}" target="_blank">mouadhjaber.com</a></span>
      </div>
    </div>

    <!-- PROFILE -->
    <section class="cv-section">
      <h2 class="cv-section-title">${t(locale, "about.title")}</h2>
      <p class="cv-profile">${t(locale, "about.body")}</p>
    </section>

    <!-- EXPERIENCE -->
    <section class="cv-section">
      <h2 class="cv-section-title">${t(locale, "experience.title")}</h2>
      ${content.experience.map(x => {
        const role     = rtl ? x.role_ar     : locale.langCode==="fr" ? x.role_fr     : x.role_en;
        const industry = rtl ? x.industry_ar : locale.langCode==="fr" ? x.industry_fr : x.industry_en;
        const dates    = rtl ? x.date_ar     : locale.langCode==="fr" ? x.date_fr     : x.date_en;
        const desc     = rtl ? x.full_description_ar : locale.langCode==="fr" ? x.full_description_fr : x.full_description_en;
        
        // Extract bullet points from description
        const bullets = [];
        const descDiv = document.createElement('div');
        descDiv.innerHTML = desc;
        const lists = descDiv.querySelectorAll('ul');
        lists.forEach(ul => {
          Array.from(ul.querySelectorAll('li')).forEach(li => {
            bullets.push(li.textContent.trim());
          });
        });
        // If no bullets, use highlights
        if (bullets.length === 0) {
          const highlights = locale.langCode==="ar" ? x.highlights_ar : locale.langCode==="fr" ? x.highlights_fr : x.highlights_en;
          if (highlights) highlights.forEach(h => bullets.push(h));
        }
        
        // Get clean description text (first paragraph or summary)
        const firstP = descDiv.querySelector('p');
        const summaryText = firstP ? firstP.textContent.trim() : '';
        
        return `
          <div class="experience-item">
            <div class="experience-header">
              <span class="experience-role">${role}</span>
              <span class="experience-company">${x.company}</span>
            </div>
            <div class="experience-meta">
              <span>${industry}</span>
              <span>${dates}</span>
            </div>
            ${summaryText ? `<p class="experience-description">${summaryText}</p>` : ''}
            ${bullets.length > 0 ? `
              <ul class="experience-bullets">
                ${bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            ` : ''}
            <div class="experience-stack"><strong>${t(locale, "skills.tools") || 'Technologies'}:</strong> ${x.stack}</div>
          </div>
        `;
      }).join("")}
    </section>

    <!-- SKILLS -->
    <section class="cv-section">
      <h2 class="cv-section-title">${t(locale, "skills.title")}</h2>
      <div class="skills-grid">
        ${renderSkillsPDF(content.skills, locale, rtl)}
      </div>
    </section>

    <!-- CERTIFICATIONS -->
    ${content.certifications && content.certifications.length > 0 ? `
    <section class="cv-section">
      <h2 class="cv-section-title">${t(locale, "diploma.cert_title") || 'Certifications'}</h2>
      ${content.certifications.map(cert => `
        <div class="education-item">
          <p class="education-title">${cert.title}</p>
          <p class="education-institution">${cert.issuer}</p>
          <p class="education-meta">${t(locale, "diploma.issued") || 'Issued'} ${cert.date}${cert.credential_id && !cert.credential_id.startsWith("REPLACE") ? ` · ${t(locale, "diploma.credential") || 'Credential'}: ${cert.credential_id}` : ''}</p>
        </div>
      `).join('')}
    </section>
    ` : ''}

    <!-- EDUCATION -->
    <section class="cv-section">
      <h2 class="cv-section-title">${t(locale, "diploma.label") || 'Education'}</h2>
      <div class="education-item">
        <p class="education-title">${t(locale, "diploma.label") || 'Engineering Degree'}</p>
        <p class="education-institution">${t(locale, "diploma.cert_title") || 'Engineering School'}</p>
        <p class="education-meta">${content.diploma ? `<a href="${content.diploma}" target="_blank">${t(locale, "diploma.verify") || 'View Diploma'}</a>` : ''}</p>
      </div>
    </section>

    <div class="cv-footer">
      ${content.name} — ${t(locale, "hero.subtitle")} — ${new Date().getFullYear()} — Generated from mouadhjaber.com
    </div>
  `;

  document.body.appendChild(container);

  html2pdf().set({
    margin: [20, 20, 20, 20],
    filename: `${content.name.replace(/\s+/g, '_')}_CV_${locale.langCode}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      allowTaint: true,
      width: 720,
      windowWidth: 720
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'p' },
    pagebreak: { mode: 'avoid-all', avoid: ['section', 'h1', 'h2', 'h3', '.experience-item', '.skill-category', '.education-item'] }
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
    <div class="skill-category">
      <div class="skill-category-title">${labels[key]}</div>
      <div class="skill-items">${skills[key].join(", ")}</div>
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
