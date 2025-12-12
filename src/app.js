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

function normalize(s){
  return (s||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function applySEO(locale, content){
  document.title = locale.siteTitle;
  const desc = locale.seo?.description || "";
  const keywords = locale.seo?.keywords || "";
  $("#meta-desc").setAttribute("content", desc);
  $("#meta-keywords").setAttribute("content", keywords);
  $("#og-title").setAttribute("content", locale.siteTitle);
  $("#og-desc").setAttribute("content", desc);
  $("#jsonld").textContent = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"Person",
    "name": content.name,
    "jobTitle": locale.hero.subtitle,
    "email": content.email,
    "telephone": content.phone,
    "url": content.linkedin,
    "image": location.origin + "/assets/profile.jpg"
  }, null, 2);
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

function render(locale, content){
  $("#brand-name").textContent = content.name;

  $$("#nav a").forEach(a => {
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

  $("#cv-link").textContent = t(locale, "hero.ctaPrimary");
  $("#cv-link").href = locale.langCode === "ar" ? "./resume-ar.md" : "./";
  $("#cv-link").addEventListener("click", (e)=>{
    // For now, CV PDFs are not auto-generated; keep link to Markdown for Arabic and to provided docx assets if user replaces.
    // User can swap this later with actual PDFs.
  }, {once:true});

  $("#contact-link").textContent = t(locale, "hero.ctaSecondary");

  // Skills: turn content.skills into badge groups
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
  // Deduplicate
  const seen = new Set();
  skillBuckets.forEach(s => {
    const k = normalize(s);
    if(seen.has(k)) return;
    seen.add(k);
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = s;
    badgeContainer.appendChild(span);
  });

  // Experience timeline
  const timeline = $("#timeline");
  timeline.innerHTML = "";
  content.experience.forEach(x => {
    const div = document.createElement("div");
    div.className = "item";
    div.setAttribute("data-search", normalize([
      x.company, x.industry_en, x.date_en, x.role_en, x.stack, ...(x.highlights_en||[])
    ].join(" ")));

    const head = document.createElement("div");
    head.className = "item-head";

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = `${x.company} — ${x.role_en}`;

    const meta = document.createElement("div");
    meta.className = "item-meta";
    meta.textContent = `${x.industry_en} • ${x.date_en}`;

    head.appendChild(title);
    head.appendChild(meta);

    const ul = document.createElement("ul");
    (x.highlights_en||[]).forEach(h=>{
      const li = document.createElement("li");
      li.textContent = h;
      ul.appendChild(li);
    });

    const toggle = document.createElement("button");
    toggle.className = "accordion-toggle";
    toggle.textContent = "Read more";

    const full = document.createElement("div");
    full.className = "accordion-content";
    full.textContent =
      locale.langCode === "ar"
        ? (x.full_description_ar || "")
        : (x.full_description_en || "");

    toggle.addEventListener("click", ()=>{
      const open = full.classList.toggle("open");
      toggle.textContent = open ? "Hide" : "Read more";
    });

    const stack = document.createElement("div");
    stack.className = "small";
    stack.textContent = x.stack;

    div.appendChild(head);
    div.appendChild(ul);
    div.appendChild(full);
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
    const q = normalize(input.value.trim());
    items.forEach(it => {
      const hay = it.getAttribute("data-search") || "";
      it.style.display = (q === "" || hay.includes(q)) ? "" : "none";
    });
  };
  input.addEventListener("input", update);
}

async function main(){
  const requested = getQueryParam("lang") || localStorage.getItem("lang") || "en";
  const langSelect = $("#lang");

  const content = await loadJSON("./content.json");
  const locales = {
    en: await loadJSON("./locales/en.json"),
    fr: await loadJSON("./locales/fr.json"),
    ar: await loadJSON("./locales/ar.json"),
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

  langSelect.addEventListener("change", (e)=> setLang(e.target.value));
  await setLang(requested);
}

main().catch(err=>{
  console.error(err);
  document.body.innerHTML = "<div style='padding:24px;font-family:system-ui;color:#111;background:#fff'>Failed to load site assets.</div>";
});
