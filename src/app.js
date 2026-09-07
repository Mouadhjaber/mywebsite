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
async function generatePDF(locale, content) {
  const rtl = locale.langCode === "ar";

  const pc = "#1a3c5e", sc = "#2c5f8a", ac = "#3a7cb8", tc = "#1a1a1a", mc = "#555555", lc = "#d0d0d0";
  const ff = rtl ? "'Amiri','Noto Sans Arabic',serif" : "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const padR = rtl ? 'padding-right:18px;' : 'padding-left:18px;';
  const bulletPos = rtl ? 'right:-18px;left:auto' : 'left:-18px;right:auto';

  const el = (tag, styles, attrs="", inner="") =>
    `<${tag} style="${styles}" ${attrs}>${inner}</${tag}>`;

  const s = (p) => (p||"");

  let html = "";

  // HEADER
  html += el("div", `font-family:${ff};font-size:10.5pt;color:${tc};border-bottom:3px solid ${pc};padding-bottom:12px;margin-bottom:18px;box-sizing:border-box;word-break:break-word;`,
    "",
    el("h1", `font-size:24pt;font-weight:700;color:${pc};margin:0 0 4px 0;line-height:1.2;`, "", content.name) +
    el("p", `font-size:12pt;font-weight:400;color:${sc};margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;`, "", t(locale, "hero.subtitle")) +
    el("div", `font-size:9pt;color:${mc};line-height:1.6;`,
      "",
      el("span", `display:inline-block;margin-right:16px;`, "", el("b", `color:${tc};`, "", s(t(locale,"contact.phone"))+": ") + content.phone) +
      el("span", `display:inline-block;margin-right:16px;`, "", el("b", `color:${tc};`, "", s(t(locale,"contact.email"))+": ") + content.email) +
      el("span", `display:inline-block;margin-right:16px;`, "", el("b", `color:${tc};`, "", s(t(locale,"contact.linkedin"))+": ") + "linkedin.com/in/mouadhjaber") +
      el("span", `display:inline-block;`, "", el("b", `color:${tc};`, "", "Website: ") + "mouadhjaber.com")
    )
  );

  // PROFILE
  html += `<section style="margin-bottom:16px;font-family:${ff};">
    <h2 style="font-size:11pt;font-weight:700;color:${pc};text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${pc};padding-bottom:4px;margin:0 0 12px 0;">${t(locale, "about.title")}</h2>
    <p style="font-size:10pt;line-height:1.6;color:${tc};text-align:justify;">${t(locale, "about.body")}</p>
  </section>`;

  // EXPERIENCE
  html += `<section style="margin-bottom:16px;font-family:${ff};">
    <h2 style="font-size:11pt;font-weight:700;color:${pc};text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${pc};padding-bottom:4px;margin:0 0 12px 0;">${t(locale, "experience.title")}</h2>`;

  content.experience.forEach(x => {
    const role = rtl ? x.role_ar : locale.langCode==="fr" ? x.role_fr : x.role_en;
    const industry = rtl ? x.industry_ar : locale.langCode==="fr" ? x.industry_fr : x.industry_en;
    const dates = rtl ? x.date_ar : locale.langCode==="fr" ? x.date_fr : x.date_en;
    const desc = rtl ? x.full_description_ar : locale.langCode==="fr" ? x.full_description_fr : x.full_description_en;

    const bullets = [];
    const descDiv = document.createElement('div');
    descDiv.innerHTML = desc;
    descDiv.querySelectorAll('ul li').forEach(li => bullets.push(li.textContent.trim()));
    if (bullets.length === 0) {
      const hl = locale.langCode==="ar" ? x.highlights_ar : locale.langCode==="fr" ? x.highlights_fr : x.highlights_en;
      if (hl) hl.forEach(h => bullets.push(h));
    }
    const firstP = descDiv.querySelector('p');
    const summaryText = firstP ? firstP.textContent.trim() : '';

    let bulletHtml = "";
    if (bullets.length > 0) {
      bulletHtml = `<ul style="margin:6px 0 0 0;${padR}">` +
        bullets.map(b => `<li style="font-size:9.5pt;line-height:1.5;color:${tc};margin-bottom:3px;position:relative;list-style:none;">▸ ${b}</li>`).join("") +
        `</ul>`;
    }

    html += `<div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:4px;">
        <span style="font-size:10.5pt;font-weight:700;color:${tc};flex:1;">${role}</span>
        <span style="font-size:10.5pt;font-weight:600;color:${pc};white-space:nowrap;">${x.company}</span>
      </div>
      <div style="font-size:9pt;color:${mc};margin-bottom:6px;">${industry} &bull; ${dates}</div>
      ${summaryText ? `<p style="font-size:10pt;line-height:1.55;color:${tc};margin-bottom:6px;">${summaryText}</p>` : ''}
      ${bulletHtml}
      <div style="font-size:9pt;color:${mc};margin-top:6px;padding-top:6px;border-top:1px solid ${lc};"><strong style="color:${tc};">${t(locale, "skills.tools") || 'Technologies'}:</strong> ${x.stack}</div>
    </div>`;
  });

  html += `</section>`;

  // SKILLS
  const labels = {
    architecture: t(locale,"skills.architecture"), methods: t(locale,"skills.methods"),
    process: t(locale,"skills.process"), modeling: t(locale,"skills.modeling"),
    communication: t(locale,"skills.communication"), patterns: t(locale,"skills.patterns"),
    microsoft: t(locale,"skills.microsoft"), other_langs: t(locale,"skills.other_langs"),
    ibm: t(locale,"skills.ibm"), scripting: t(locale,"skills.scripting"),
    is: t(locale,"skills.is"), tools: t(locale,"skills.tools"),
  };
  html += `<section style="margin-bottom:16px;font-family:${ff};">
    <h2 style="font-size:11pt;font-weight:700;color:${pc};text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${pc};padding-bottom:4px;margin:0 0 12px 0;">${t(locale, "skills.title")}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">`;

  Object.keys(content.skills).forEach(key => {
    html += `<div style="background:#f8f9fa;border:1px solid ${lc};border-radius:4px;padding:8px 10px;">
      <div style="font-size:8.5pt;font-weight:700;color:${pc};text-transform:uppercase;letter-spacing:0.3px;margin:0 0 6px 0;padding-bottom:4px;border-bottom:1px solid ${lc};">${labels[key]}</div>
      <div style="font-size:9pt;color:${tc};line-height:1.5;">${content.skills[key].join(", ")}</div>
    </div>`;
  });

  html += `</div></section>`;

  // CERTIFICATIONS
  if (content.certifications && content.certifications.length > 0) {
    html += `<section style="margin-bottom:16px;font-family:${ff};">
      <h2 style="font-size:11pt;font-weight:700;color:${pc};text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${pc};padding-bottom:4px;margin:0 0 12px 0;">${t(locale, "diploma.cert_title") || 'Certifications'}</h2>`;
    content.certifications.forEach(cert => {
      html += `<div style="margin-bottom:10px;">
        <p style="font-size:10pt;font-weight:700;color:${tc};margin:0 0 2px 0;">${cert.title}</p>
        <p style="font-size:9.5pt;font-weight:600;color:${pc};margin:0 0 2px 0;">${cert.issuer}</p>
        <p style="font-size:9pt;color:${mc};margin:0;">${t(locale, "diploma.issued") || 'Issued'} ${cert.date}${cert.credential_id && !cert.credential_id.startsWith("REPLACE") ? ` · ${t(locale, "diploma.credential") || 'Credential'}: ${cert.credential_id}` : ''}</p>
      </div>`;
    });
    html += `</section>`;
  }

  // EDUCATION
  html += `<section style="margin-bottom:16px;font-family:${ff};">
    <h2 style="font-size:11pt;font-weight:700;color:${pc};text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid ${pc};padding-bottom:4px;margin:0 0 12px 0;">${t(locale, "diploma.label") || 'Education'}</h2>
    <div style="margin-bottom:10px;">
      <p style="font-size:10pt;font-weight:700;color:${tc};margin:0 0 2px 0;">${t(locale, "diploma.label") || 'Engineering Degree'}</p>
      <p style="font-size:9.5pt;font-weight:600;color:${pc};margin:0 0 2px 0;">${t(locale, "diploma.cert_title") || 'Engineering School'}</p>
      <p style="font-size:9pt;color:${mc};margin:0;">${content.diploma ? `<a href="${content.diploma}" style="color:${ac};text-decoration:none;">${t(locale, "diploma.verify") || 'View Diploma'}</a>` : ''}</p>
    </div>
  </section>`;

  // FOOTER
  html += `<div style="margin-top:20px;padding-top:10px;border-top:1px solid ${lc};font-size:8pt;color:${mc};text-align:center;font-family:${ff};">
    ${content.name} — ${t(locale, "hero.subtitle")} — ${new Date().getFullYear()} — Generated from mouadhjaber.com
  </div>`;

  const container = document.createElement("div");
  container.style.cssText = `width:720px;margin:0;direction:${rtl?"rtl":"ltr"};text-align:${rtl?"right":"left"};font-family:${ff};font-size:10.5pt;line-height:1.5;color:${tc};background:#fff;padding:20px;box-sizing:border-box;position:fixed;top:0;left:0;opacity:1;pointer-events:none;z-index:9999;`;
  container.innerHTML = html;
  document.body.appendChild(container);

  await new Promise(r => setTimeout(r, 500));

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, allowTaint: true });
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availW = pdfW - margin * 2;
    const imgW = availW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let y = margin;

    if (imgH <= pdfH - margin * 2) {
      pdf.addImage(imgData, 'JPEG', margin, margin, imgW, imgH);
    } else {
      let remaining = canvas.height;
      let srcY = 0;
      const sliceH = canvas.width * (pdfH - margin * 2) / imgW;
      while (remaining > 0) {
        if (srcY > 0) pdf.addPage();
        const actualSliceH = Math.min(sliceH, remaining);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = actualSliceH;
        const ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, actualSliceH, 0, 0, canvas.width, actualSliceH);
        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
        const slicePdfH = (actualSliceH * imgW) / canvas.width;
        pdf.addImage(sliceData, 'JPEG', margin, margin, imgW, slicePdfH);
        srcY += actualSliceH;
        remaining -= actualSliceH;
      }
    }

    pdf.save(`${content.name.replace(/\s+/g, '_')}_CV_${locale.langCode}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
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
  const items = t(locale, "services.items") || t(locale, "services") || [];
  if(!Array.isArray(items)) return;
  items.forEach(svc => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="service-icon">${svc.icon || ""}</div>
      <h3 class="service-title">${svc.title || ""}</h3>
      <p class="service-desc">${svc.desc || ""}</p>
    `;
    grid.appendChild(card);
  });
}

function renderCareerPhases(locale, content){
  const container = $("#career-timeline");
  if(!container) return;
  container.innerHTML = "";
  const phases = t(locale, "career_phases.phases") || [];
  if(!Array.isArray(phases)) return;
  phases.forEach(phase => {
    const div = document.createElement("div");
    div.className = "career-phase";
    div.innerHTML = `
      <div class="career-period">${phase.period}</div>
      <div class="career-content">
        <h3 class="career-phase-title">${phase.title}</h3>
        <p class="career-phase-desc">${phase.desc}</p>
        <div class="career-companies">${phase.companies}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderCaseStudies(locale, content){
  const grid = $("#case-studies-grid");
  if(!grid) return;
  grid.innerHTML = "";
  const studies = t(locale, "case_studies.items") || [];
  if(!Array.isArray(studies)) return;
  studies.forEach(study => {
    const div = document.createElement("div");
    div.className = "case-study-card";
    div.innerHTML = `
      <div class="case-study-header">
        <div class="case-study-company">${study.company}</div>
        <div class="case-study-industry">${study.industry}</div>
      </div>
      <h3 class="case-study-title">${study.title}</h3>
      <div class="case-study-role">${study.role}</div>
      <div class="case-study-section">
        <div class="case-study-label">${t(locale, "case_studies.challenge")}</div>
        <p>${study.challenge}</p>
      </div>
      <div class="case-study-section">
        <div class="case-study-label">${t(locale, "case_studies.solution")}</div>
        <p>${study.solution}</p>
      </div>
      <div class="case-study-section">
        <div class="case-study-label">${t(locale, "case_studies.impact")}</div>
        <p>${study.impact}</p>
      </div>
      <div class="case-study-tech">
        <span class="case-study-label">${t(locale, "case_studies.technologies")}</span>
        <div class="case-study-badges">
          ${(study.technologies||study.highlights||[]).map(t => `<span class="badge">${t}</span>`).join("")}
        </div>
      </div>
    `;
    grid.appendChild(div);
  });
}

function renderSkillsCategorized(locale, content){
  const container = $("#skills-categorized");
  if(!container) return;
  container.innerHTML = "";
  
  const groups = {
    core: [".NET (C#, VB.NET)","ASP.NET","Web API / REST","Entity Framework","LINQ"],
    architecture: ["Software Architecture","DDD","Microservices","Event-driven","API Design","Legacy Modernization"],
    cloud: ["Microsoft Azure","Cloud Architecture","Azure Service Bus","Identity & Security"],
    devops: ["Azure DevOps","CI/CD","Docker","DevSecOps","Sonar"],
    messaging: ["Kafka","Protocol Buffers","WCF","REST","Ultra Messaging"],
    modern: ["Flutter","JavaScript","Angular","React","Python","AI / Agents"],
    additional: ["SQL Server","Oracle","C","C++","PowerShell","VBScript","Visual Studio","TeamCity","TFS/Azure DevOps"]
  };
  
  Object.keys(groups).forEach(key => {
    const label = t(locale, `skills.${key}`);
    const items = groups[key];
    const section = document.createElement("div");
    section.className = "skill-group";
    section.innerHTML = `
      <div class="skill-group-title">${label}</div>
      <div class="skill-group-items">
        ${items.map(s => `<span class="badge">${s}</span>`).join("")}
      </div>
    `;
    container.appendChild(section);
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
  const valueEl = $("#hero-value");
  if(valueEl) valueEl.textContent = t(locale, "hero.valueProp");
  
  // Trust bar
  const trustIndustries = $("#trust-industries");
  if(trustIndustries) trustIndustries.textContent = t(locale, "trust.industries");

  // About / Skills
  $("#about-title").textContent  = t(locale, "about.title");
  $("#about-body").textContent   = t(locale, "about.body");
  $("#skills-title").textContent = t(locale, "skills.title");

  // Section headings
  const servicesTitle = $("#services-title");
  if(servicesTitle) servicesTitle.textContent = t(locale, "services.title");
  const careerTitle = $("#career-title");
  if(careerTitle) careerTitle.textContent = t(locale, "career_phases.title");
  const caseStudiesTitle = $("#case-studies-title");
  if(caseStudiesTitle) caseStudiesTitle.textContent = t(locale, "case_studies.title");
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
  contactLink.href = "#case-studies";

  // Render all sections
  renderSkillsCategorized(locale, content);
  renderCertifications(locale, content);
  renderServices(locale, content);
  renderCareerPhases(locale, content);
  renderCaseStudies(locale, content);

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
