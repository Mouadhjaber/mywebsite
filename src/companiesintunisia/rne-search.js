(function () {
  'use strict';
  // Change this value on the page only if your deployment exposes another same-origin proxy.
  const SEARCH_ENDPOINT = '/api/rne/search';
  const COMPANIES_ENDPOINT = '/api/rne/companies';
  const form = document.getElementById('search-form');
  const input = document.getElementById('company-query');
  const panel = document.getElementById('state-panel');
  const title = document.getElementById('state-title');
  const description = document.getElementById('state-description');
  const results = document.getElementById('results');
  const submit = form.querySelector('button');
  const languageSelect = document.getElementById('language-select');
  const loadCompaniesButton = document.getElementById('load-companies');
  const companyListState = document.getElementById('company-list-state');
  const companyListMessage = document.getElementById('company-list-message');
  const companyListItems = document.getElementById('company-list-items');
  const companyPagination = document.getElementById('company-pagination');
  const previousCompanies = document.getElementById('companies-prev');
  const nextCompanies = document.getElementById('companies-next');
  const companiesPage = document.getElementById('companies-page');
  const LANGUAGES = { fr: 'fr-TN', en: 'en', ar: 'ar-TN', es: 'es', zh: 'zh-CN' };
  const COPY = {
    fr: { pageTitle: 'RNE • Recherche d’entreprise tunisienne', backHome: 'Retour au portfolio', language: 'Langue', proxyContext: 'Recherche via votre passerelle autorisée', registry: 'REGISTRE NATIONAL DES ENTREPRISES · TUNISIE', heroTitle: 'Voir l’essentiel.<br><em>Respecter l’accès.</em>', lede: 'Recherchez une entreprise par dénomination ou identifiant unique. Les informations affichées dépendent exclusivement de votre accès autorisé.', searchArea: 'Recherche d’entreprise', queryLabel: 'Dénomination ou identifiant unique', queryPlaceholder: 'Ex. Société Exemple ou 1234567A', search: 'Rechercher', searchHelp: 'La recherche est transmise à votre proxy local sécurisé — aucune donnée d’accès n’est demandée ici.', ready: 'Prêt à rechercher', emptyTitle: 'Une fiche, quand elle est accessible.', emptyDescription: 'Saisissez une dénomination ou un identifiant unique pour lancer la recherche.', searchResult: 'RÉSULTAT DE RECHERCHE', newSearch: 'Nouvelle recherche', notProvided: 'Non communiqué', notProvidedF: 'Non communiquée', notProvidedStatus: 'Statut non communiqué', notProvidedLegal: 'Forme juridique non communiquée', uniqueId: 'Identifiant unique', registeredOffice: 'Siège', activity: 'Activité', updated: 'Dernière mise à jour', financialReading: 'LECTURE FINANCIÈRE', financialTitle: 'Indicateurs & trajectoire', financialAuthorized: 'Uniquement si transmis par la source autorisée.', multiYear: 'Performance pluriannuelle', authorizedData: 'Données sous autorisation', contracts: 'CONTRATS', ubo: 'BÉNÉFICIAIRES EFFECTIFS', financialDocs: 'DOCUMENTS FINANCIERS', authorizedAccess: 'Accès sous autorisation', authorizedOnly: 'Disponibles uniquement lorsque votre accès autorisé le permet.', footer: 'RNE Explorer · Interface de consultation · Les données ne sont jamais complétées ou supposées.', loadingTitle: 'Recherche en cours…', loadingText: 'Interrogation de votre passerelle locale autorisée.', incompleteTitle: 'Recherche incomplète', incompleteText: 'Saisissez une dénomination ou un identifiant unique avant de continuer.', notFoundTitle: 'Aucune fiche trouvée', notFoundText: 'Aucun résultat n’a été retourné pour cette recherche.', unavailableTitle: 'Service momentanément indisponible', unavailableText: 'La passerelle /api/rne/search est indisponible ou non configurée. Réessayez plus tard.', errorTitle: 'La recherche n’a pas abouti', errorText: 'La réponse de la passerelle ne peut pas être affichée. Réessayez.', malformedTitle: 'Réponse non exploitable', malformedText: 'La passerelle a répondu, mais sans fiche entreprise utilisable.', resultReceived: 'Fiche reçue depuis la passerelle autorisée.', noFinancials: 'Aucun indicateur financier n’a été transmis par la source autorisée pour cette fiche.', unit: 'Unité', currency: 'Devise', notCommunicated: 'non communiquée', source: 'Source', availability: 'Disponibilité', disclosure: 'Les calculs sont affichés uniquement lorsque les valeurs source autorisées le permettent.', unauthorized: 'Non autorisé', sourceLabel: 'source', calculated: 'calculé', fiscalYear: 'Exercice', fieldRevenue: 'Chiffre d’affaires (CA)', fieldNetIncome: 'Résultat net', fieldAssets: 'Total actif', fieldLiabilities: 'Total passif', fieldDebt: 'Dette totale', fieldCurrentAssets: 'Actifs courants', fieldCurrentLiabilities: 'Passifs courants', fieldEquity: 'Capitaux propres', fieldOCF: 'Flux de trésorerie opérationnel', growth: 'Croissance du CA', margin: 'Marge nette', roe: 'ROE', roa: 'ROA', liquidity: 'Ratio de liquidité générale' },
    en: { pageTitle: 'RNE • Tunisian company search', backHome: 'Back to portfolio', language: 'Language', proxyContext: 'Search through your authorized gateway', registry: 'NATIONAL BUSINESS REGISTER · TUNISIA', heroTitle: 'See what matters.<br><em>Respect access.</em>', lede: 'Search by company name or unique identifier. Displayed information depends exclusively on your authorized access.', searchArea: 'Company search', queryLabel: 'Company name or unique identifier', queryPlaceholder: 'E.g. Example Company or 1234567A', search: 'Search', searchHelp: 'Your search is sent to your secure local proxy — no access credentials are requested here.', ready: 'Ready to search', emptyTitle: 'A record, when it is accessible.', emptyDescription: 'Enter a company name or unique identifier to start.', searchResult: 'SEARCH RESULT', newSearch: 'New search', notProvided: 'Not provided', notProvidedF: 'Not provided', notProvidedStatus: 'Status not provided', notProvidedLegal: 'Legal form not provided', uniqueId: 'Unique identifier', registeredOffice: 'Registered office', activity: 'Activity', updated: 'Last updated', financialReading: 'FINANCIAL VIEW', financialTitle: 'Indicators & trajectory', financialAuthorized: 'Only when supplied by the authorized source.', multiYear: 'Multi-year performance', authorizedData: 'Authorized data', contracts: 'CONTRACTS', ubo: 'BENEFICIAL OWNERS', financialDocs: 'FINANCIAL DOCUMENTS', authorizedAccess: 'Authorized access only', authorizedOnly: 'Available only when your authorized access permits it.', footer: 'RNE Explorer · Consultation interface · Data is never completed or assumed.', loadingTitle: 'Searching…', loadingText: 'Querying your authorized local gateway.', incompleteTitle: 'Incomplete search', incompleteText: 'Enter a company name or unique identifier before continuing.', notFoundTitle: 'No record found', notFoundText: 'No result was returned for this search.', unavailableTitle: 'Service temporarily unavailable', unavailableText: 'The /api/rne/search gateway is unavailable or not configured. Please try again later.', errorTitle: 'Search did not complete', errorText: 'The gateway response cannot be displayed. Please try again.', malformedTitle: 'Unusable response', malformedText: 'The gateway replied, but without a usable company record.', resultReceived: 'Record received from the authorized gateway.', noFinancials: 'No financial indicator was supplied by the authorized source for this record.', unit: 'Unit', currency: 'Currency', notCommunicated: 'not provided', source: 'Source', availability: 'Availability', disclosure: 'Calculations appear only when authorized source values allow them.', unauthorized: 'Unauthorized', sourceLabel: 'source', calculated: 'calculated', fiscalYear: 'Fiscal year', fieldRevenue: 'Revenue', fieldNetIncome: 'Net income', fieldAssets: 'Total assets', fieldLiabilities: 'Total liabilities', fieldDebt: 'Total debt', fieldCurrentAssets: 'Current assets', fieldCurrentLiabilities: 'Current liabilities', fieldEquity: 'Equity', fieldOCF: 'Operating cash flow', growth: 'Revenue growth', margin: 'Net margin', roe: 'ROE', roa: 'ROA', liquidity: 'Current ratio' },
    ar: { pageTitle: 'RNE • بحث الشركات التونسية', backHome: 'العودة إلى الملف الشخصي', language: 'اللغة', proxyContext: 'البحث عبر بوابتك المصرح بها', registry: 'السجل الوطني للمؤسسات · تونس', heroTitle: 'اطّلع على الأساس.<br><em>واحترم صلاحيات الوصول.</em>', lede: 'ابحث باسم الشركة أو المعرّف الفريد. تعتمد المعلومات المعروضة حصراً على صلاحية وصولك المصرح بها.', searchArea: 'البحث عن شركة', queryLabel: 'اسم الشركة أو المعرّف الفريد', queryPlaceholder: 'مثال: شركة نموذجية أو 1234567A', search: 'بحث', searchHelp: 'يُرسل البحث إلى وكيلك المحلي الآمن — لا تُطلب بيانات دخول هنا.', ready: 'جاهز للبحث', emptyTitle: 'سجل، عندما يكون الوصول إليه متاحاً.', emptyDescription: 'أدخل اسم الشركة أو المعرّف الفريد للبدء.', searchResult: 'نتيجة البحث', newSearch: 'بحث جديد', notProvided: 'غير متاح', notProvidedF: 'غير متاحة', notProvidedStatus: 'الحالة غير متاحة', notProvidedLegal: 'الشكل القانوني غير متاح', uniqueId: 'المعرّف الفريد', registeredOffice: 'المقر', activity: 'النشاط', updated: 'آخر تحديث', financialReading: 'القراءة المالية', financialTitle: 'المؤشرات والمسار', financialAuthorized: 'فقط عند توفيرها من المصدر المصرح به.', multiYear: 'الأداء متعدد السنوات', authorizedData: 'بيانات خاضعة للتصريح', contracts: 'العقود', ubo: 'المستفيدون الفعليون', financialDocs: 'الوثائق المالية', authorizedAccess: 'وصول بموجب تصريح', authorizedOnly: 'متاحة فقط عندما تسمح صلاحية وصولك المصرح بها.', footer: 'RNE Explorer · واجهة استعلام · لا تُستكمل البيانات ولا يُفترض أي منها.', loadingTitle: 'جارٍ البحث…', loadingText: 'جارٍ الاستعلام من بوابتك المحلية المصرح بها.', incompleteTitle: 'بحث غير مكتمل', incompleteText: 'أدخل اسم الشركة أو المعرّف الفريد قبل المتابعة.', notFoundTitle: 'لم يتم العثور على سجل', notFoundText: 'لم تُرجع هذه العملية أي نتيجة.', unavailableTitle: 'الخدمة غير متاحة مؤقتاً', unavailableText: 'بوابة /api/rne/search غير متاحة أو غير مهيأة. حاول لاحقاً.', errorTitle: 'لم يكتمل البحث', errorText: 'لا يمكن عرض استجابة البوابة. حاول مجدداً.', malformedTitle: 'استجابة غير قابلة للاستخدام', malformedText: 'استجابت البوابة، ولكن دون سجل شركة قابل للاستخدام.', resultReceived: 'تم استلام السجل من البوابة المصرح بها.', noFinancials: 'لم يُقدَّم أي مؤشر مالي من المصدر المصرح به لهذا السجل.', unit: 'الوحدة', currency: 'العملة', notCommunicated: 'غير متاحة', source: 'المصدر', availability: 'التوافر', disclosure: 'تظهر الحسابات فقط عندما تسمح قيم المصدر المصرح بها بذلك.', unauthorized: 'غير مصرّح', sourceLabel: 'مصدر', calculated: 'محسوب', fiscalYear: 'السنة المالية', fieldRevenue: 'الإيرادات', fieldNetIncome: 'صافي الربح', fieldAssets: 'إجمالي الأصول', fieldLiabilities: 'إجمالي الخصوم', fieldDebt: 'إجمالي الدين', fieldCurrentAssets: 'الأصول المتداولة', fieldCurrentLiabilities: 'الخصوم المتداولة', fieldEquity: 'حقوق الملكية', fieldOCF: 'التدفق النقدي التشغيلي', growth: 'نمو الإيرادات', margin: 'هامش صافي الربح', roe: 'العائد على حقوق الملكية', roa: 'العائد على الأصول', liquidity: 'نسبة السيولة الجارية' },
    es: { pageTitle: 'RNE • Búsqueda de empresas tunecinas', backHome: 'Volver al portafolio', language: 'Idioma', proxyContext: 'Búsqueda mediante su pasarela autorizada', registry: 'REGISTRO NACIONAL DE EMPRESAS · TÚNEZ', heroTitle: 'Vea lo esencial.<br><em>Respete el acceso.</em>', lede: 'Busque por nombre de empresa o identificador único. La información mostrada depende exclusivamente de su acceso autorizado.', searchArea: 'Búsqueda de empresa', queryLabel: 'Nombre de empresa o identificador único', queryPlaceholder: 'Ej. Empresa Ejemplo o 1234567A', search: 'Buscar', searchHelp: 'La búsqueda se envía a su proxy local seguro; aquí no se solicitan credenciales.', ready: 'Listo para buscar', emptyTitle: 'Una ficha, cuando sea accesible.', emptyDescription: 'Introduzca un nombre de empresa o identificador único para comenzar.', searchResult: 'RESULTADO DE BÚSQUEDA', newSearch: 'Nueva búsqueda', notProvided: 'No comunicado', notProvidedF: 'No comunicada', notProvidedStatus: 'Estado no comunicado', notProvidedLegal: 'Forma jurídica no comunicada', uniqueId: 'Identificador único', registeredOffice: 'Domicilio social', activity: 'Actividad', updated: 'Última actualización', financialReading: 'LECTURA FINANCIERA', financialTitle: 'Indicadores y trayectoria', financialAuthorized: 'Solo si lo transmite la fuente autorizada.', multiYear: 'Rendimiento plurianual', authorizedData: 'Datos bajo autorización', contracts: 'CONTRATOS', ubo: 'BENEFICIARIOS EFECTIVOS', financialDocs: 'DOCUMENTOS FINANCIEROS', authorizedAccess: 'Acceso bajo autorización', authorizedOnly: 'Disponible solo cuando lo permita su acceso autorizado.', footer: 'RNE Explorer · Interfaz de consulta · Los datos nunca se completan ni se presuponen.', loadingTitle: 'Buscando…', loadingText: 'Consultando su pasarela local autorizada.', incompleteTitle: 'Búsqueda incompleta', incompleteText: 'Introduzca un nombre de empresa o identificador único antes de continuar.', notFoundTitle: 'No se encontró ninguna ficha', notFoundText: 'La búsqueda no devolvió resultados.', unavailableTitle: 'Servicio temporalmente no disponible', unavailableText: 'La pasarela /api/rne/search no está disponible o no está configurada. Inténtelo más tarde.', errorTitle: 'La búsqueda no se completó', errorText: 'No se puede mostrar la respuesta de la pasarela. Inténtelo de nuevo.', malformedTitle: 'Respuesta no utilizable', malformedText: 'La pasarela respondió, pero sin una ficha de empresa utilizable.', resultReceived: 'Ficha recibida de la pasarela autorizada.', noFinancials: 'La fuente autorizada no proporcionó indicadores financieros para esta ficha.', unit: 'Unidad', currency: 'Moneda', notCommunicated: 'no comunicada', source: 'Fuente', availability: 'Disponibilidad', disclosure: 'Los cálculos solo se muestran cuando lo permiten los valores autorizados de la fuente.', unauthorized: 'No autorizado', sourceLabel: 'fuente', calculated: 'calculado', fiscalYear: 'Ejercicio', fieldRevenue: 'Ingresos', fieldNetIncome: 'Resultado neto', fieldAssets: 'Activo total', fieldLiabilities: 'Pasivo total', fieldDebt: 'Deuda total', fieldCurrentAssets: 'Activo corriente', fieldCurrentLiabilities: 'Pasivo corriente', fieldEquity: 'Patrimonio neto', fieldOCF: 'Flujo de caja operativo', growth: 'Crecimiento de ingresos', margin: 'Margen neto', roe: 'ROE', roa: 'ROA', liquidity: 'Ratio de liquidez corriente' },
    zh: { pageTitle: 'RNE • 突尼斯企业查询', backHome: '返回作品集', language: '语言', proxyContext: '通过您的授权网关查询', registry: '国家企业登记处 · 突尼斯', heroTitle: '查看关键内容。<br><em>尊重访问权限。</em>', lede: '可通过企业名称或唯一标识符查询。显示的信息完全取决于您的授权访问权限。', searchArea: '企业查询', queryLabel: '企业名称或唯一标识符', queryPlaceholder: '例如：示例公司或 1234567A', search: '查询', searchHelp: '查询将发送至您的安全本地代理；此处不会要求访问凭据。', ready: '可以查询', emptyTitle: '在可访问时显示企业档案。', emptyDescription: '输入企业名称或唯一标识符以开始查询。', searchResult: '查询结果', newSearch: '重新查询', notProvided: '未提供', notProvidedF: '未提供', notProvidedStatus: '未提供状态', notProvidedLegal: '未提供法律形式', uniqueId: '唯一标识符', registeredOffice: '注册办事处', activity: '业务活动', updated: '最后更新', financialReading: '财务解读', financialTitle: '指标与走势', financialAuthorized: '仅在授权来源提供时显示。', multiYear: '多年表现', authorizedData: '需授权的数据', contracts: '合同', ubo: '最终受益人', financialDocs: '财务文件', authorizedAccess: '仅限授权访问', authorizedOnly: '仅在您的授权访问允许时可用。', footer: 'RNE Explorer · 查询界面 · 绝不补全或假定数据。', loadingTitle: '正在查询…', loadingText: '正在查询您的授权本地网关。', incompleteTitle: '查询不完整', incompleteText: '请先输入企业名称或唯一标识符。', notFoundTitle: '未找到企业档案', notFoundText: '本次查询未返回结果。', unavailableTitle: '服务暂时不可用', unavailableText: '/api/rne/search 网关不可用或尚未配置，请稍后重试。', errorTitle: '查询未完成', errorText: '无法显示网关响应，请重试。', malformedTitle: '响应不可用', malformedText: '网关已响应，但没有可用的企业档案。', resultReceived: '已从授权网关接收企业档案。', noFinancials: '授权来源未为该档案提供财务指标。', unit: '单位', currency: '币种', notCommunicated: '未提供', source: '来源', availability: '可用性', disclosure: '仅当授权来源数值允许时才显示计算结果。', unauthorized: '未授权', sourceLabel: '来源', calculated: '计算值', fiscalYear: '财年', fieldRevenue: '营业收入', fieldNetIncome: '净利润', fieldAssets: '资产总额', fieldLiabilities: '负债总额', fieldDebt: '总债务', fieldCurrentAssets: '流动资产', fieldCurrentLiabilities: '流动负债', fieldEquity: '股东权益', fieldOCF: '经营活动现金流', growth: '收入增长率', margin: '净利率', roe: '净资产收益率', roa: '总资产收益率', liquidity: '流动比率' }
  };
  const LIST_COPY = {
    fr: { browseEyebrow: 'CONSULTATION AUTORISÉE', browseTitle: 'Parcourir les fiches disponibles', browseDescription: 'Cette liste est chargée uniquement à votre demande et ne représente que les fiches retournées par votre accès autorisé.', loadCompanies: 'Charger les entreprises', listInitial: 'Chargez une page pour consulter les fiches actuellement retournées par la source autorisée.', listLoading: 'Chargement de la page demandée…', listEmpty: 'Aucune fiche n’a été retournée pour cette page.', listUnavailable: 'La liste est momentanément indisponible. Réessayez plus tard.', listError: 'La liste ne peut pas être affichée. Réessayez.', listInvalid: 'La réponse de la liste est incomplète ou non exploitable.', previous: 'Précédent', next: 'Suivant', page: 'Page', pagination: 'Pagination', openCompany: 'Rechercher cette entreprise', listId: 'Identifiant unique', listStatus: 'Statut', listLegal: 'Forme juridique' },
    en: { browseEyebrow: 'AUTHORIZED BROWSING', browseTitle: 'Browse available records', browseDescription: 'This list loads only on your request and represents only records returned through your authorized access.', loadCompanies: 'Load companies', listInitial: 'Load a page to view records currently returned by the authorized source.', listLoading: 'Loading the requested page…', listEmpty: 'No records were returned for this page.', listUnavailable: 'The list is temporarily unavailable. Please try again later.', listError: 'The list cannot be displayed. Please try again.', listInvalid: 'The list response is incomplete or unusable.', previous: 'Previous', next: 'Next', page: 'Page', pagination: 'Pagination', openCompany: 'Search this company', listId: 'Unique identifier', listStatus: 'Status', listLegal: 'Legal form' },
    ar: { browseEyebrow: 'استعراض مصرّح به', browseTitle: 'تصفّح السجلات المتاحة', browseDescription: 'لا تُحمّل هذه القائمة إلا بطلب منك وتمثل فقط السجلات التي تُرجعها صلاحية وصولك المصرح بها.', loadCompanies: 'تحميل الشركات', listInitial: 'حمّل صفحة لعرض السجلات التي يعيدها المصدر المصرح به حالياً.', listLoading: 'جارٍ تحميل الصفحة المطلوبة…', listEmpty: 'لم تُرجع هذه الصفحة أي سجلات.', listUnavailable: 'القائمة غير متاحة مؤقتاً. حاول لاحقاً.', listError: 'لا يمكن عرض القائمة. حاول مجدداً.', listInvalid: 'استجابة القائمة غير مكتملة أو غير قابلة للاستخدام.', previous: 'السابق', next: 'التالي', page: 'الصفحة', pagination: 'ترقيم الصفحات', openCompany: 'البحث عن هذه الشركة', listId: 'المعرّف الفريد', listStatus: 'الحالة', listLegal: 'الشكل القانوني' },
    es: { browseEyebrow: 'CONSULTA AUTORIZADA', browseTitle: 'Explorar fichas disponibles', browseDescription: 'Esta lista se carga solo a petición suya y representa únicamente las fichas devueltas por su acceso autorizado.', loadCompanies: 'Cargar empresas', listInitial: 'Cargue una página para ver las fichas devueltas actualmente por la fuente autorizada.', listLoading: 'Cargando la página solicitada…', listEmpty: 'No se devolvieron fichas para esta página.', listUnavailable: 'La lista no está disponible temporalmente. Inténtelo más tarde.', listError: 'La lista no se puede mostrar. Inténtelo de nuevo.', listInvalid: 'La respuesta de la lista está incompleta o no es utilizable.', previous: 'Anterior', next: 'Siguiente', page: 'Página', pagination: 'Paginación', openCompany: 'Buscar esta empresa', listId: 'Identificador único', listStatus: 'Estado', listLegal: 'Forma jurídica' },
    zh: { browseEyebrow: '授权浏览', browseTitle: '浏览可用档案', browseDescription: '此列表仅在您请求时加载，并且仅代表您的授权访问返回的档案。', loadCompanies: '加载企业', listInitial: '加载页面以查看授权来源当前返回的档案。', listLoading: '正在加载请求的页面…', listEmpty: '该页面未返回任何档案。', listUnavailable: '列表暂时不可用，请稍后重试。', listError: '无法显示列表，请重试。', listInvalid: '列表响应不完整或不可用。', previous: '上一页', next: '下一页', page: '第', pagination: '分页', openCompany: '查询此企业', listId: '唯一标识符', listStatus: '状态', listLegal: '法律形式' }
  };
  // 503 is an intentional integration state: no company or financial data is implied until authorization is connected.
  const CONFIGURATION_COPY = {
    fr: { unavailableTitle: 'Connexion RNE en cours de configuration', unavailableText: 'La connexion autorisée au RNE est en cours de configuration. Les données réelles d’entreprise et financières apparaîtront après l’intégration autorisée.', listUnavailable: 'La connexion autorisée au RNE est en cours de configuration. Les données réelles d’entreprise et financières apparaîtront après l’intégration autorisée.' },
    en: { unavailableTitle: 'RNE connection is being configured', unavailableText: 'The authorized RNE connection is being configured. Real company and financial data will appear after authorized integration.', listUnavailable: 'The authorized RNE connection is being configured. Real company and financial data will appear after authorized integration.' },
    ar: { unavailableTitle: 'جارٍ إعداد اتصال RNE', unavailableText: 'يجري إعداد الاتصال المصرّح به بـ RNE. ستظهر بيانات الشركات والبيانات المالية الحقيقية بعد التكامل المصرّح به.', listUnavailable: 'يجري إعداد الاتصال المصرّح به بـ RNE. ستظهر بيانات الشركات والبيانات المالية الحقيقية بعد التكامل المصرّح به.' },
    es: { unavailableTitle: 'Se está configurando la conexión RNE', unavailableText: 'Se está configurando la conexión autorizada al RNE. Los datos reales de empresas y financieros aparecerán tras la integración autorizada.', listUnavailable: 'Se está configurando la conexión autorizada al RNE. Los datos reales de empresas y financieros aparecerán tras la integración autorizada.' },
    zh: { unavailableTitle: '正在配置 RNE 连接', unavailableText: '正在配置已授权的 RNE 连接。完成授权集成后将显示真实的企业和财务数据。', listUnavailable: '正在配置已授权的 RNE 连接。完成授权集成后将显示真实的企业和财务数据。' }
  };
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  let language = LANGUAGES[requestedLanguage] ? requestedLanguage : 'fr';
  let lastData = null;
  let lastCompanyList = null;
  let companyListPage = 1;
  function t(key) { return (CONFIGURATION_COPY[language] && CONFIGURATION_COPY[language][key]) || (COPY[language] && COPY[language][key]) || (LIST_COPY[language] && LIST_COPY[language][key]) || CONFIGURATION_COPY.fr[key] || COPY.fr[key] || LIST_COPY.fr[key] || key; }
  function applyLanguage() {
    const isArabic = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = t('pageTitle'); languageSelect.value = language;
    document.querySelectorAll('[data-i18n]').forEach(function (element) { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (element) { element.innerHTML = t(element.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) { element.placeholder = t(element.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (element) { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
  }

  function state(kind, heading, text, icon) {
    panel.className = 'state-panel is-' + kind;
    panel.querySelector('.state-icon').textContent = icon;
    title.textContent = heading;
    description.textContent = text;
    panel.hidden = false;
    results.hidden = true;
  }
  function text(value, fallback) { return value === undefined || value === null || value === '' ? fallback : String(value); }
  function pick(object, keys) { for (const key of keys) if (object && object[key] !== undefined && object[key] !== null && object[key] !== '') return object[key]; return null; }
  function safeValue(value) { return value === null || value === undefined || value === '' ? t('notProvided') : String(value); }
  function set(id, value, fallback) { document.getElementById(id).textContent = text(value, fallback); }
  function formatDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return value;
    const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(LANGUAGES[language], { dateStyle: 'medium' }).format(date);
  }
  function monogram(name) { return String(name || '?').trim().slice(0, 1).toLocaleUpperCase(LANGUAGES[language]); }
  function setCompanyListState(kind, messageKey) {
    companyListState.className = 'list-state is-' + kind;
    companyListMessage.dataset.i18n = messageKey;
    companyListMessage.textContent = t(messageKey);
    companyListState.hidden = false;
    companyListItems.hidden = true;
    companyPagination.hidden = true;
  }
  function listField(labelKey, value) {
    if (value === undefined || value === null || value === '') return null;
    const item = document.createElement('p'); item.className = 'company-list-field';
    const label = document.createElement('span'); label.textContent = t(labelKey);
    const content = document.createElement('b'); content.textContent = String(value);
    item.append(label, content); return item;
  }
  function renderCompanyList(payload) {
    const companies = payload && Array.isArray(payload.companies) ? payload.companies : null;
    const page = payload && payload.page;
    const pageSize = payload && payload.pageSize;
    if (!companies || !Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || (payload.hasNext !== undefined && typeof payload.hasNext !== 'boolean') || (payload.total !== undefined && (!Number.isFinite(payload.total) || payload.total < 0))) { setCompanyListState('error', 'listInvalid'); return false; }
    companyListItems.replaceChildren();
    const validCompanies = companies.filter(function (company) { return company && typeof company === 'object' && (pick(company, ['name', 'companyName', 'denomination']) || pick(company, ['uniqueId', 'id', 'identifier', 'registrationNumber'])); });
    if (!validCompanies.length) { setCompanyListState('empty', 'listEmpty'); return true; }
    validCompanies.forEach(function (company) {
      const name = pick(company, ['name', 'companyName', 'denomination']);
      const uniqueId = pick(company, ['uniqueId', 'id', 'identifier', 'registrationNumber']);
      const card = document.createElement('article'); card.className = 'company-list-card';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'company-list-open';
      button.setAttribute('aria-label', t('openCompany') + ' : ' + String(name || uniqueId));
      const title = document.createElement('h3'); title.textContent = String(name || uniqueId); button.appendChild(title);
      const fields = document.createElement('div'); fields.className = 'company-list-fields';
      [['listId', uniqueId], ['listStatus', company.status], ['listLegal', pick(company, ['legalForm', 'form'])]].forEach(function (field) { const item = listField(field[0], field[1]); if (item) fields.appendChild(item); });
      button.appendChild(fields); button.addEventListener('click', function () { input.value = String(uniqueId || name); form.requestSubmit(); });
      card.appendChild(button); companyListItems.appendChild(card);
    });
    const hasNext = payload.hasNext === true || (payload.hasNext === undefined && Number.isFinite(payload.total) && page * pageSize < payload.total);
    companyListPage = page; lastCompanyList = payload;
    companiesPage.textContent = t('page') + ' ' + new Intl.NumberFormat(LANGUAGES[language]).format(page);
    previousCompanies.disabled = page <= 1; nextCompanies.disabled = !hasNext;
    companyListState.hidden = true; companyListItems.hidden = false; companyPagination.hidden = false;
    return true;
  }
  async function loadCompanyPage(page) {
    setCompanyListState('loading', 'listLoading'); loadCompaniesButton.disabled = true;
    try {
      const response = await fetch(COMPANIES_ENDPOINT + '?page=' + encodeURIComponent(page) + '&pageSize=20', { headers: { Accept: 'application/json' } });
      if (response.status === 404 || response.status === 501 || response.status === 503) throw Object.assign(new Error('unavailable'), { unavailable: true });
      if (!response.ok) throw new Error('request');
      const payload = await response.json(); renderCompanyList(payload);
    } catch (error) {
      setCompanyListState(error.unavailable || error instanceof TypeError ? 'unavailable' : 'error', error.unavailable || error instanceof TypeError ? 'listUnavailable' : 'listError');
    } finally { loadCompaniesButton.disabled = false; }
  }

  /*
   * Normalized financial input, supplied by the authorized proxy only:
   * financials: { unit, currency, source, availability, years: [{
   *   year, revenue, netIncome, totalAssets, totalLiabilities, totalDebt,
   *   currentAssets, currentLiabilities, equity, operatingCashFlow
   * }] }. A field may also be { value, authorized: false } (or available:false).
   * Values are kept as supplied in the source table. Calculations accept only non-zero,
   * finite numeric values that are authorized; a missing, zero, or invalid source input blocks a ratio.
   */
  const FINANCIAL_FIELDS = [
    ['revenue', 'fieldRevenue'], ['netIncome', 'fieldNetIncome'], ['totalAssets', 'fieldAssets'],
    ['totalLiabilities', 'fieldLiabilities'], ['totalDebt', 'fieldDebt'], ['currentAssets', 'fieldCurrentAssets'],
    ['currentLiabilities', 'fieldCurrentLiabilities'], ['equity', 'fieldEquity'], ['operatingCashFlow', 'fieldOCF']
  ];
  function fieldValue(raw) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (raw.authorized === false || raw.available === false) return null;
      raw = raw.value;
    }
    if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
    if (typeof raw === 'string' && /^-?\d+(?:\.\d+)?$/.test(raw.trim())) return Number(raw);
    return null;
  }
  function rawDisplay(raw) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (raw.authorized === false || raw.available === false) return t('unauthorized');
      return raw.display !== undefined ? String(raw.display) : safeValue(raw.value);
    }
    return safeValue(raw);
  }
  function ratio(numerator, denominator) {
    return numerator !== null && denominator !== null && denominator !== 0 ? numerator / denominator : null;
  }
  function percent(value) { return value === null || !Number.isFinite(value) ? null : new Intl.NumberFormat(LANGUAGES[language], { style: 'percent', maximumFractionDigits: 1 }).format(value); }
  function multiple(value) { return value === null || !Number.isFinite(value) ? null : new Intl.NumberFormat(LANGUAGES[language], { maximumFractionDigits: 2 }).format(value) + '×'; }
  function financialLabel(item) { return t(item.label) + ' · ' + t(item.kind === 'derived' ? 'calculated' : 'sourceLabel'); }
  function renderFinancials(financials) {
    const years = Array.isArray(financials && financials.years) ? financials.years : [];
    const zone = document.getElementById('financials');
    const kpiGrid = document.getElementById('kpi-grid');
    const table = document.getElementById('performance-table');
    const disclosure = document.getElementById('financial-disclosure');
    kpiGrid.replaceChildren(); table.replaceChildren();
    const unit = text(financials && financials.unit, t('notCommunicated'));
    const currency = text(financials && financials.currency, t('notCommunicated'));
    document.getElementById('performance-unit').textContent = t('unit') + ' : ' + unit + ' · ' + t('currency') + ' : ' + currency;
    disclosure.textContent = t('source') + ' : ' + text(financials && financials.source, t('notCommunicated')) + ' · ' + t('availability') + ' : ' + text(financials && financials.availability, t('notCommunicated')) + '. ' + t('disclosure');
    const existingNotice = zone.querySelector('.no-financials');
    if (existingNotice) existingNotice.remove();
    zone.querySelector('.performance-card').hidden = false;
    if (!years.length) {
      const notice = document.createElement('div');
      notice.className = 'no-financials';
      notice.textContent = t('noFinancials');
      zone.appendChild(notice);
      zone.querySelector('.performance-card').hidden = true;
      return;
    }
    const latest = years[years.length - 1];
    const previous = years.length > 1 ? years[years.length - 2] : null;
    const value = function (row, key) { const number = row ? fieldValue(row[key]) : null; return number === 0 ? null : number; };
    const currentRevenue = value(latest, 'revenue');
    const previousRevenue = value(previous, 'revenue');
    const revenueGrowth = currentRevenue !== null && previousRevenue !== null ? ratio(currentRevenue - previousRevenue, previousRevenue) : null;
    const derived = [
      { label: 'growth', value: percent(revenueGrowth), kind: 'derived' },
      { label: 'margin', value: percent(ratio(value(latest, 'netIncome'), value(latest, 'revenue'))), kind: 'derived' },
      { label: 'roe', value: percent(ratio(value(latest, 'netIncome'), value(latest, 'equity'))), kind: 'derived' },
      { label: 'roa', value: percent(ratio(value(latest, 'netIncome'), value(latest, 'totalAssets'))), kind: 'derived' },
      { label: 'liquidity', value: multiple(ratio(value(latest, 'currentAssets'), value(latest, 'currentLiabilities'))), kind: 'derived' }
    ];
    const rawKpis = [['revenue', 'fieldRevenue'], ['netIncome', 'fieldNetIncome'], ['totalDebt', 'fieldDebt'], ['equity', 'fieldEquity'], ['operatingCashFlow', 'fieldOCF']]
      .map(function (entry) { return { label: entry[1], value: latest[entry[0]] === undefined ? null : rawDisplay(latest[entry[0]]), kind: 'source' }; });
    rawKpis.concat(derived).filter(function (item) { return item.value !== null; }).forEach(function (item) {
      const card = document.createElement('article'); card.className = 'kpi-card ' + item.kind;
      const label = document.createElement('p'); label.className = 'kpi-label'; label.textContent = financialLabel(item);
      const display = document.createElement('p'); display.className = 'kpi-value'; display.textContent = item.value;
      const year = document.createElement('p'); year.className = 'kpi-year'; year.textContent = t('fiscalYear') + ' ' + safeValue(latest.year);
      card.append(label, display, year); kpiGrid.appendChild(card);
    });
    const fields = FINANCIAL_FIELDS.filter(function (field) { return years.some(function (row) { return row[field[0]] !== undefined; }); });
    const tableEl = document.createElement('table'); const header = document.createElement('tr');
    [t('fiscalYear')].concat(fields.map(function (field) { return t(field[1]); })).forEach(function (label) { const th = document.createElement('th'); th.textContent = label; header.appendChild(th); });
    const thead = document.createElement('thead'); thead.appendChild(header); const tbody = document.createElement('tbody');
    years.forEach(function (row) { const tr = document.createElement('tr'); const year = document.createElement('td'); year.textContent = safeValue(row.year); tr.appendChild(year); fields.forEach(function (field) { const td = document.createElement('td'); td.textContent = rawDisplay(row[field[0]]); tr.appendChild(td); }); tbody.appendChild(tr); });
    tableEl.append(thead, tbody); table.appendChild(tableEl);
  }
  function render(data) {
    const company = data.company || data.result || data;
    const name = pick(company, ['name', 'denomination', 'companyName']);
    if (!name) { state('error', t('malformedTitle'), t('malformedText'), '!'); return; }
    set('company-name', name, t('notProvided')); set('company-monogram', monogram(name));
    set('company-status', pick(company, ['status', 'legalStatus']), t('notProvidedStatus'));
    set('company-legal-form', pick(company, ['legalForm', 'form']), t('notProvidedLegal'));
    set('company-id', pick(company, ['uniqueId', 'id', 'identifier', 'registrationNumber']), t('notProvided'));
    set('company-address', pick(company, ['address', 'registeredOffice', 'headOffice']), t('notProvided'));
    set('company-activity', pick(company, ['activity', 'mainActivity', 'sector']), t('notProvidedF'));
    set('company-updated', formatDate(pick(company, ['updatedAt', 'lastUpdated'])), t('notProvidedF'));
    document.getElementById('result-note').textContent = t('resultReceived');
    renderFinancials(company.financials || data.financials);
    panel.hidden = true; results.hidden = false; results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  form.addEventListener('submit', async function (event) {
    event.preventDefault(); const query = input.value.trim();
    if (!query) { state('error', t('incompleteTitle'), t('incompleteText'), '!'); input.focus(); return; }
    state('loading', t('loadingTitle'), t('loadingText'), '◌'); submit.disabled = true;
    try { const response = await fetch(SEARCH_ENDPOINT + '?q=' + encodeURIComponent(query), { headers: { Accept: 'application/json' } }); if (response.status === 404 || response.status === 501 || response.status === 503) throw Object.assign(new Error('unavailable'), { unavailable: true }); if (!response.ok) throw new Error('request'); const body = await response.json(); if (body && (body.found === false || body.status === 'not_found')) { state('empty', t('notFoundTitle'), t('notFoundText'), '⌕'); } else { lastData = body; render(body); } }
    catch (error) { state(error.unavailable || error instanceof TypeError ? 'unavailable' : 'error', error.unavailable || error instanceof TypeError ? t('unavailableTitle') : t('errorTitle'), error.unavailable || error instanceof TypeError ? t('unavailableText') : t('errorText'), error.unavailable || error instanceof TypeError ? '—' : '!'); }
    finally { submit.disabled = false; }
  });
  languageSelect.addEventListener('change', function () {
    language = LANGUAGES[this.value] ? this.value : 'fr';
    const url = new URL(window.location.href); url.searchParams.set('lang', language); window.history.replaceState({}, '', url);
    applyLanguage(); if (lastData && !results.hidden) render(lastData); if (lastCompanyList && !companyListItems.hidden) renderCompanyList(lastCompanyList);
  });
  loadCompaniesButton.addEventListener('click', function () { loadCompanyPage(1); });
  previousCompanies.addEventListener('click', function () { if (companyListPage > 1) loadCompanyPage(companyListPage - 1); });
  nextCompanies.addEventListener('click', function () { if (!nextCompanies.disabled) loadCompanyPage(companyListPage + 1); });
  document.getElementById('new-search').addEventListener('click', function () { results.hidden = true; state('empty', t('emptyTitle'), t('emptyDescription'), '⌕'); input.focus(); });
  applyLanguage();
}());
