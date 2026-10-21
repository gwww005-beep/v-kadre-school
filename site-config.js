window.SCHOOL = Object.freeze({
  name: 'В кадре',
  demo: true,
  legalName: 'ИП Примеров Пример Примерович (демонстрационные данные)',
  inn: '000000000000',
  ogrn: '000000000000000',
  legalAddress: 'Москва, адрес будет указан перед запуском',
  phone: '+7 (000) 000-00-00',
  email: 'hello@school.example',
  privacyEmail: 'privacy@school.example',
  domain: 'school.example',
  studioAddress: '',
  monthlyPrice: null,
  pricePeriod: 'за 4 недели',
  priceApproved: false,
  // Set each package price and its billing period after approval.
  plans: [
    {id: 'start', price: null, period: ''},
    {id: 'practice', price: null, period: ''},
    {id: 'direction', price: null, period: ''}
  ],
  lessonsPerMonth: 8,
  cycleDescription: 'Темы повторяются по циклу. Порядок включения новичков согласуем перед записью.',
  legalApproved: false,
  leadsEnabled: false,
  endpoint: 'api/lead.php',
  policyVersion: '2026-10-21-presentation-draft',
  consentVersion: '2026-10-21-presentation-draft',
  photosIllustrative: true,
  // Add only teachers who have confirmed participation and approved publication.
  teachers: [],
  // Local MP4 / WebM only. Optional WebVTT captions. No tracking video embeds.
  videos: [
    {title:'Как проходят занятия',src:'',poster:'',captions:'',portrait:false},
    {title:'Практика перед камерой',src:'',poster:'',captions:'',portrait:true},
    {title:'Знакомство с преподавателем',src:'',poster:'',captions:'',portrait:true}
  ]
});
