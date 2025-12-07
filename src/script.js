const translations = {
  en: {
    "brand.role": "Software Engineer",
    "brand.tagline": "Experienced software engineer and architect working on distributed, messaging and cloud-based systems.",
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.cv": "Full CV",
    "nav.contact": "Contact",
    "hero.title": "Portfolio & Curriculum Vitae",
    "hero.subtitle": "This page presents a modern, accessible portfolio view and the complete, unmodified CV content in English and French.",
    "hero.ctaExperience": "View experience timeline",
    "hero.ctaCv": "Jump to full CV",
    "contact.title": "Contact",
    "contact.phoneFr": "Phone (FR)",
    "contact.phoneTn": "Phone (TN)",
    "card.skillsTitle": "Skills & Technologies",
    "card.skillsText": "Full list of skills, methodologies, tools and technologies is preserved exactly from the CV documents below.",
    "card.experienceTitle": "Professional Experience",
    "card.experienceText": "Experience across banking, insurance, telecom, agriculture, call-center systems, transport and pharmaceutical supply.",
    "card.languagesTitle": "Languages",
    "card.languagesText": "Bilingual English / French. Use the language switch above to display interface text in your preferred language.",
    "timeline.title": "Experience timeline",
    "timeline.note": "All job details and project descriptions are shown in full in the CV section. The timeline below serves as a visual guide.",
    "cv.title": "Full CV (unmodified)",
    "cv.intro": "The following sections contain the complete text from the original CV documents in English and French. No information has been removed, changed or summarized.",
    "cv.enTitle": "English CV",
    "cv.enIntroTitle": "Skills, tools and information systems",
    "cv.enExpTitle": "Professional experience (original text)",
    "cv.frTitle": "French CV",
    "cv.frIntroTitle": "Compétences, outils et systèmes d'information",
    "cv.frExpTitle": "Projets professionnels (texte original)",
    "footer.note": "Complete CV text in English and French preserved exactly as in the original documents."
  },
  fr: {
    "brand.role": "Ingénieur logiciel",
    "brand.tagline": "Ingénieur logiciel et architecte expérimenté sur les systèmes distribués, de messagerie et orientés cloud.",
    "nav.about": "À propos",
    "nav.experience": "Expérience",
    "nav.cv": "CV complet",
    "nav.contact": "Contact",
    "hero.title": "Portfolio & Curriculum Vitae",
    "hero.subtitle": "Cette page présente un portfolio moderne et accessible ainsi que le contenu complet et non modifié du CV en anglais et en français.",
    "hero.ctaExperience": "Voir la frise d'expérience",
    "hero.ctaCv": "Aller au CV complet",
    "contact.title": "Contact",
    "contact.phoneFr": "Téléphone (FR)",
    "contact.phoneTn": "Téléphone (TN)",
    "card.skillsTitle": "Compétences & technologies",
    "card.skillsText": "La liste complète des compétences, méthodologies, outils et technologies est conservée exactement à partir des CV ci-dessous.",
    "card.experienceTitle": "Expérience professionnelle",
    "card.experienceText": "Expérience dans la banque, l’assurance, les télécoms, l’agriculture, les centres d’appels, le transport et le secteur pharmaceutique.",
    "card.languagesTitle": "Langues",
    "card.languagesText": "Bilingue anglais / français. Utilisez le sélecteur de langue ci-dessus pour afficher le texte de l’interface dans votre langue.",
    "timeline.title": "Frise chronologique d'expérience",
    "timeline.note": "Tous les détails de postes et descriptions de projets se trouvent dans la section CV. La frise ci-dessous sert de vue synthétique.",
    "cv.title": "CV complet (non modifié)",
    "cv.intro": "Les sections suivantes contiennent le texte intégral des CV originaux en anglais et en français. Aucune information n’a été retirée, modifiée ou résumée.",
    "cv.enTitle": "CV anglais",
    "cv.enIntroTitle": "Compétences, outils et systèmes d'information",
    "cv.enExpTitle": "Expérience professionnelle (texte original)",
    "cv.frTitle": "CV français",
    "cv.frIntroTitle": "Compétences, outils et systèmes d'information",
    "cv.frExpTitle": "Projets professionnels (texte original)",
    "footer.note": "Texte intégral du CV en anglais et en français conservé exactement comme dans les documents d’origine."
  }
};

function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  document.body.classList.toggle("lang-en", lang === "en");
  document.body.classList.toggle("lang-fr", lang === "fr");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  setLanguage("en");
});