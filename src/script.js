
(function () {
  const translations = {
    en: {
      "brand.tagline": "Senior Software Engineer & Architect",
      "nav.summary": "Summary",
      "nav.experience": "Experience",
      "nav.fullcv": "Full CV",
      "nav.contact": "Contact",
      "hero.title": "Senior Software Engineer & Architect",
      "hero.subtitle": "Designing and building distributed, message-driven, real-time systems across banking, insurance, telecom, asset management, pharma, agriculture, and transport.",
      "hero.card.expertise": "Expertise",
      "hero.card.expertiseText": ".NET, C#, distributed architectures, messaging, microservices, DevOps / DevSecOps, Azure, and high-availability back-end systems.",
      "hero.card.domains": "Domains",
      "hero.card.domainsText": "Banking, insurance, asset management, pharma supply, telecom, call-center systems, agriculture cooperative, and transport.",
      "hero.card.value": "Value",
      "hero.card.valueText": "From legacy modernization to cloud-native architectures, delivering reliable, maintainable, and secure software platforms.",
      "sidebar.title": "Key Information",
      "sidebar.locationLabel": "Location:",
      "sidebar.locationValue": "France / International",
      "sidebar.experienceLabel": "Experience:",
      "sidebar.experienceValue": "+15 years",
      "sidebar.phoneLabel": "Phone:",
      "sidebar.emailLabel": "Email:",
      "experience.title": "Professional Experience (Timeline)",
      "experience.subtitle": "Structured timeline view built directly from the detailed French CV. Each entry preserves the original content and structure (Contexte, Tools, Technologies, etc.).",
      "fullcv.title": "Full CV",
      "fullcv.subtitle": "Complete CV content in English and French exactly as in the original documents.",
      "fullcv.enTitle": "English CV",
      "fullcv.frTitle": "French CV",
      "fullcv.arTitle": "CV (Arabic UI, English content)",
      "contact.title": "Contact",
      "contact.text": "For opportunities, collaborations, or consulting missions, feel free to reach out by email, phone, or LinkedIn.",
      "contact.phoneLabel": "Phone:",
      "contact.emailLabel": "Email:",
      "footer.built": "Built as a static, SEO-friendly portfolio from the original CV documents."
    },
    fr: {
      "brand.tagline": "Ingénieur logiciel senior & Architecte",
      "nav.summary": "Résumé",
      "nav.experience": "Expérience",
      "nav.fullcv": "CV complet",
      "nav.contact": "Contact",
      "hero.title": "Ingénieur logiciel senior & Architecte",
      "hero.subtitle": "Conception et développement de systèmes distribués temps réel orientés messages dans la banque, l’assurance, les télécoms, la gestion d’actifs, la pharmacie, l’agriculture et le transport.",
      "hero.card.expertise": "Expertise",
      "hero.card.expertiseText": ".NET, C#, architectures distribuées, messaging, microservices, DevOps / DevSecOps, Azure et back-ends haute disponibilité.",
      "hero.card.domains": "Secteurs",
      "hero.card.domainsText": "Banque, assurance, gestion d’actifs, chaîne pharmaceutique, télécom, centres d’appels, coopérative agricole et transport.",
      "hero.card.value": "Valeur",
      "hero.card.valueText": "De la modernisation du legacy aux architectures cloud-native, en livrant des plateformes fiables, maintenables et sécurisées.",
      "sidebar.title": "Informations clés",
      "sidebar.locationLabel": "Localisation :",
      "sidebar.locationValue": "France / International",
      "sidebar.experienceLabel": "Expérience :",
      "sidebar.experienceValue": "+15 ans",
      "sidebar.phoneLabel": "Téléphone :",
      "sidebar.emailLabel": "Email :",
      "experience.title": "Expérience professionnelle (Timeline)",
      "experience.subtitle": "Vue chronologique construite directement à partir du CV détaillé en français. Chaque entrée préserve le contenu et la structure d’origine (Contexte, Tools, Technologies, etc.).",
      "fullcv.title": "CV complet",
      "fullcv.subtitle": "Contenu complet du CV en anglais et en français, identique aux documents d’origine.",
      "fullcv.enTitle": "CV anglais",
      "fullcv.frTitle": "CV français",
      "fullcv.arTitle": "CV (interface arabe, contenu anglais)",
      "contact.title": "Contact",
      "contact.text": "Pour des opportunités, collaborations ou missions de consulting, vous pouvez me contacter par email, téléphone ou via LinkedIn.",
      "contact.phoneLabel": "Téléphone :",
      "contact.emailLabel": "Email :",
      "footer.built": "Réalisé comme un portfolio statique, optimisé SEO, à partir des CV d’origine."
    },
    ar: {
      "brand.tagline": "مهندس برمجيات أول ومهندس حلول",
      "nav.summary": "الملخص",
      "nav.experience": "الخبرة",
      "nav.fullcv": "السيرة الذاتية",
      "nav.contact": "التواصل",
      "hero.title": "مهندس برمجيات أول ومهندس حلول",
      "hero.subtitle": "تصميم وتطوير أنظمة موزعة وتطبيقات لحظية معتمدة على الرسائل في مجالات البنوك، التأمين، الاتصالات، إدارة الأصول، الصيدلة، الزراعة والنقل.",
      "hero.card.expertise": "الخبرة",
      "hero.card.expertiseText": ".NET و C# والهندسة المعمارية الموزعة وأنظمة المراسلة والـ Microservices و DevOps و Azure والأنظمة الخلفية عالية الاعتمادية.",
      "hero.card.domains": "القطاعات",
      "hero.card.domainsText": "البنوك، التأمين، إدارة الأصول، سلسلة التوريد الدوائية، الاتصالات، مراكز الاتصال، التعاونيات الزراعية، والنقل.",
      "hero.card.value": "القيمة",
      "hero.card.valueText": "من تحديث الأنظمة القديمة إلى البنى السحابية الحديثة، مع التركيز على الموثوقية وسهولة الصيانة والأمان.",
      "sidebar.title": "معلومات أساسية",
      "sidebar.locationLabel": "الموقع:",
      "sidebar.locationValue": "فرنسا / دولي",
      "sidebar.experienceLabel": "الخبرة:",
      "sidebar.experienceValue": "+15 سنة",
      "sidebar.phoneLabel": "الهاتف:",
      "sidebar.emailLabel": "البريد:",
      "experience.title": "الخبرة المهنية (محور زمني)",
      "experience.subtitle": "عرض زمني مبني مباشرة من السيرة الذاتية التفصيلية باللغة الفرنسية مع الحفاظ على البنية الأصلية (Contexte، Tools، Technologies، وغيرها).",
      "fullcv.title": "السيرة الذاتية",
      "fullcv.subtitle": "نص السيرة الذاتية الكامل بالإنجليزية والفرنسية كما هو في المستندات الأصلية.",
      "fullcv.enTitle": "السيرة الذاتية بالإنجليزية",
      "fullcv.frTitle": "السيرة الذاتية بالفرنسية",
      "fullcv.arTitle": "السيرة الذاتية (واجهة عربية، محتوى إنجليزي)",
      "contact.title": "التواصل",
      "contact.text": "للحصول على فرص عمل أو تعاون أو استشارات، يمكن التواصل عبر البريد الإلكتروني أو الهاتف أو لينكدإن.",
      "contact.phoneLabel": "الهاتف:",
      "contact.emailLabel": "البريد:",
      "footer.built": "موقع بورتفوليو ثابت، محسّن لمحركات البحث، مبني مباشرة من السيرة الذاتية الأصلية."
    }
  };

  function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  function setLanguage(lang) {
    document.body.classList.remove("lang-en", "lang-fr", "lang-ar");
    document.body.classList.add("lang-" + lang);
    document.documentElement.lang = lang === "ar" ? "ar" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    applyTranslations(lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const lang = btn.getAttribute("data-lang");
        setLanguage(lang);
      });
    });
    // Default language
    setLanguage("en");
  });
})();
