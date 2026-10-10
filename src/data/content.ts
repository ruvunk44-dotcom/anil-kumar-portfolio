// All facts below are taken verbatim from the previous portfolio (index.html) and resume.
export const LINKEDIN = 'https://www.linkedin.com/in/yw5pbgt1bwfy/';
export const EMAIL = 'anilkumarnellore88@gmail.com';
export const LOCATION = 'Bangalore Urban, India';

export type Accent = 'cyan' | 'violet' | 'emerald' | 'amber' | 'blue' | 'slate';

export const nav = [
  ['home', 'Home'], ['about', 'About'], ['expertise', 'Expertise'], ['experience', 'Experience'],
  ['architecture', 'Architecture'], ['certifications', 'Certifications'], ['contact', 'Contact'],
] as const;

export const stats = [
  { value: '17+', label: 'Years Integration Experience', count: 17 },
  { value: 'SAP BTP', label: 'Integration Architecture' },
  { value: 'Cloud + On-Premise', label: 'Hybrid Landscapes' },
  { value: 'Global', label: 'Implementation Experience' },
];

export const techStrip = ['SAP BTP', 'Integration Suite', 'CPI', 'PI/PO', 'S/4HANA', 'SuccessFactors', 'API Integration', 'Hybrid Integration'];

export interface Scenario { title: string; detail: string; protocol: string; related: string[] }
export const scenarios: Record<string, Scenario> = {
  'S/4HANA': { title: 'SAP S/4HANA Integration', detail: 'Enterprise application data exchange', protocol: 'IDoc / RFC / REST', related: ['SAP ERP'] },
  'SuccessFactors': { title: 'SuccessFactors Integration', detail: 'Employee lifecycle and enterprise HR integration', protocol: 'OData / REST', related: ['SAP ERP', 'Third-party Payroll'] },
  'SAP ERP': { title: 'SAP ERP Integration', detail: 'Employee and enterprise data exchange', protocol: 'IDoc / RFC', related: ['SuccessFactors', 'SAP S/4HANA'] },
  'Ariba': { title: 'SAP Ariba Integration', detail: 'Procurement data synchronisation', protocol: 'API-based integration', related: ['SAP ERP'] },
  'API Management': { title: 'API Management', detail: 'API optimisation and testing', protocol: 'REST / SOAP', related: [] },
  'Active Directory': { title: 'Active Directory Integration', detail: 'Employee lifecycle data exchange', protocol: 'CPI / employee data interfaces', related: ['SuccessFactors'] },
  'Kronos': { title: 'Kronos Integration', detail: 'Employee demographics for workforce systems', protocol: 'CPI / demographic interfaces', related: ['SuccessFactors'] },
  'Salesforce': { title: 'Salesforce Connectivity', detail: 'Representative third-party enterprise application connectivity', protocol: 'API integration scenario', related: [] },
  'SAP BW': { title: 'SAP BW Integration', detail: 'Employee data exchange supporting reporting', protocol: 'CPI / data interfaces', related: ['SuccessFactors'] },
  'External Systems': { title: 'External Application Integration', detail: 'SAP and non-SAP enterprise data exchange', protocol: 'REST / SOAP / SFTP / EDI', related: [] },
  'Third-party Payroll': { title: 'Payroll Integration', detail: 'Employee and payment-file data exchange', protocol: 'CPI / file-based interfaces', related: ['SuccessFactors', 'SAP ERP'] },
  'SAP C4C': { title: 'SAP C4C Integration', detail: 'Enterprise application connectivity', protocol: 'PO / CPI / application adapters', related: [] },
  'AWS': { title: 'Cloud Application Connectivity', detail: 'Representative cloud platform integration scenario', protocol: 'Cloud and hybrid integration', related: [] },
};
scenarios['SAP S/4HANA'] = scenarios['S/4HANA'];
scenarios['SAP Ariba'] = scenarios['Ariba'];
scenarios['External Applications'] = scenarios['External Systems'];

export const heroNodes: { name: string; accent: Accent }[] = [
  { name: 'S/4HANA', accent: 'cyan' }, { name: 'SuccessFactors', accent: 'cyan' }, { name: 'Ariba', accent: 'cyan' },
  { name: 'API Management', accent: 'violet' }, { name: 'Salesforce', accent: 'slate' }, { name: 'External Systems', accent: 'amber' },
  { name: 'Kronos', accent: 'slate' }, { name: 'Active Directory', accent: 'emerald' }, { name: 'SAP BW', accent: 'cyan' }, { name: 'SAP ERP', accent: 'cyan' },
];
export const heroProtocols = ['OData', 'REST', 'IDoc / RFC', 'SFTP / EDI', 'SOAP'];

export const about = {
  title: ['A career built', 'around integration.'],
  sub: 'From SAP XI/PI to enterprise architecture.',
  lead: 'I design integrations that connect enterprise systems, business processes and people.',
  paras: [
    'My career began with SAP XI/PI and progressed through PI/PO, integration leadership and SAP CPI to SAP Integration Suite, BTP and enterprise integration architecture.',
    'I work across SAP and non-SAP applications, cloud-to-cloud and cloud-to-on-premise scenarios, and hybrid landscapes. My experience includes API-based, real-time and batch integration.',
    'Across global implementation programmes, I have worked from requirements and technical architecture through solution design, integration standards, testing, deployment and production support.',
  ],
};

export const expertise: { title: string; items: string[]; accent: Accent; icon: number }[] = [
  { title: 'SAP BTP & Integration Suite', accent: 'cyan', icon: 0, items: ['SAP BTP', 'SAP Integration Suite', 'Cloud Integration / CPI', 'Cloud Connector', 'API Management', 'Cloud ALM'] },
  { title: 'SAP integration platforms', accent: 'blue', icon: 1, items: ['SAP PI/PO', 'PO 7.5', 'XI/PI', 'iFlows', 'SuccessFactors Integration Center'] },
  { title: 'Enterprise applications', accent: 'slate', icon: 2, items: ['S/4HANA', 'ERP', 'ERP HCM', 'SuccessFactors', 'Ariba', 'C4C', 'Hybris', 'MDG', 'BW'] },
  { title: 'API & connectivity', accent: 'violet', icon: 3, items: ['REST', 'SOAP', 'OData', 'IDoc', 'RFC', 'HTTP', 'FTP', 'SFTP', 'JSON', 'XML'] },
  { title: 'EDI & B2B integration', accent: 'amber', icon: 4, items: ['EDI', 'ANSI X12', 'AS2', 'RNIF', 'PIDX XML'] },
  { title: 'Security & architecture', accent: 'emerald', icon: 5, items: ['OAuth', 'SAML', 'Kerberos', 'X.509', 'MFA', 'PGP', 'PKCS#7', 'Hybrid integration', 'Standards', 'Error handling', 'Performance optimisation'] },
];

export interface Job { date: string; location: string; role: string; company: string; project: string; bullets: string[]; recent?: boolean }
export const jobs: Job[] = [
  { recent: true, date: 'March 2024 – Present', location: 'Abu Dhabi, UAE', role: 'Senior SAP Integration Consultant', company: 'Lyve Global Technology', project: 'Project: MDSAP', bullets: [
    'Lead SuccessFactors integration design, testing and deployment, aligning interface solutions with business, functional and technical stakeholders.',
    'Prepare Integration Requirement Documents and Data Mapping Documents for development, testing and handover.',
    'Implement Employee Central-to-SAP ERP integrations for employee mini-master, organisational and cost-centre data.',
    'Build CPI integrations using SuccessFactors and OData APIs for Active Directory, Kronos, Benefit Focus and SAP BW.',
    'Deliver third-party payroll, employee payment-file and demographic interfaces using CPI and Integration Center.'] },
  { recent: true, date: 'December 2019 – February 2024', location: 'Munich, Germany', role: 'SAP Integration Architect', company: 'TENTHPIN', project: 'Clients: Woodstream, STCS, SGS, ELM, YAS Holdings', bullets: [
    'Led blueprinting workshops and translated requirements into technical specifications for SAP and non-SAP integrations.',
    'Designed SAP PO 7.5 and CPI patterns for maintainable cloud and on-premise connectivity.',
    'Delivered S/4HANA, SuccessFactors, MDI and SAP Ariba interfaces across hybrid landscapes.',
    'Optimised API Management, integrated Cloud ALM and developed custom SAP PO modules.',
    'Refined performance and error handling, tested integration flows and contributed to standards and knowledge transfer.'] },
  { date: 'August 2018 – December 2019', location: 'Al Farwaniyah, Kuwait', role: 'SAP Integration Lead Consultant', company: 'Arabian Construction Company', project: 'Client: Kuwait National Guard', bullets: [
    'Led SAP PO/CPI delivery connecting SAP Hybris and C4C; designed integration processes and configured adapters.',
    'Implemented error handling, system health checks and performance optimisation, and coordinated testing.'] },
  { date: 'April 2017 – July 2018', location: 'Riyadh, Saudi Arabia', role: 'Senior SAP PO/CPI Consultant', company: 'Advanced Electronics Company', project: 'Project: TAQAT', bullets: [
    'Oversaw integration activities within NetWeaver PI 7.5 and S/4HANA implementations, including SAP ERP IS-U connectivity.',
    'Prepared integration documentation and coordinated system builds and refreshes with SAP Basis.'] },
  { date: 'April 2014 – March 2017', location: 'Chennai, India', role: 'SAP Integration Lead', company: 'Digital Intelligence Systems', project: 'Client: ExxonMobil', bullets: [
    'Analysed functional specifications and designed ANSI X12 EDI interfaces for external business data exchange.',
    'Coordinated technical dependencies and prepared cut-over documentation.'] },
  { date: 'September 2012 – April 2014', location: 'Bengaluru, India', role: 'SAP PI/PO Developer', company: 'Infosys', project: 'Clients: ModelN, Syngene', bullets: [
    'Developed and refined interfaces during SAP PI implementation and production support.',
    'Configured ALE in SAP R/3 and supported System Landscape Directory business-system entries.'] },
  { date: 'July 2009 – August 2012', location: 'Bengaluru, India', role: 'SAP XI/PI Consultant', company: 'ITC Infotech', project: 'Clients: General Motors Corp, Metal Man', bullets: [
    'Developed and maintained SAP PI interfaces for implementation and production support.',
    'Configured ALE, supported landscape configuration and resolved integration issues with cross-functional teams.'] },
];

// Architecture explorer: description text is verbatim; diagram endpoints/chips reuse terms already on the site.
export const capabilities: { id: string; title: string; text: string; accent: Accent; left: string[]; right: string[]; chips: string[] }[] = [
  { id: 'hybrid', title: 'Hybrid integration', accent: 'blue', text: 'Integration between cloud and on-premise enterprise applications.', left: ['Cloud applications'], right: ['On-premise applications'], chips: ['Cloud Integration / CPI', 'Cloud Connector', 'SAP PO 7.5'] },
  { id: 'sap', title: 'SAP & non-SAP integration', accent: 'cyan', text: 'Connecting SAP systems with third-party platforms and enterprise applications.', left: ['S/4HANA', 'SuccessFactors', 'SAP Ariba'], right: ['Third-party platforms', 'Enterprise applications'], chips: ['SAP Integration Suite', 'iFlows'] },
  { id: 'api', title: 'API-based integration', accent: 'violet', text: 'REST, SOAP and OData interfaces across business applications.', left: ['Business applications'], right: ['Business applications'], chips: ['REST', 'SOAP', 'OData', 'API Management'] },
  { id: 'sf', title: 'SuccessFactors integration', accent: 'cyan', text: 'Employee Central interfaces with ERP, Active Directory, payroll, Kronos, BW and external systems.', left: ['Employee Central'], right: ['ERP', 'Active Directory', 'Payroll', 'Kronos', 'BW', 'External systems'], chips: ['CPI', 'Integration Center', 'OData APIs'] },
  { id: 'edi', title: 'EDI / B2B integration', accent: 'amber', text: 'Enterprise data exchange using EDI, ANSI X12, AS2, RNIF and industry formats.', left: ['Enterprise'], right: ['External systems'], chips: ['EDI', 'ANSI X12', 'AS2', 'RNIF', 'PIDX XML'] },
  { id: 'gov', title: 'Integration governance', accent: 'emerald', text: 'Standards, technical documentation, error handling, testing, performance optimisation and production support.', left: ['Design'], right: ['Production support'], chips: ['Standards', 'Error handling', 'Testing', 'OAuth', 'SAML', 'X.509', 'PGP'] },
];

export const landscape = {
  left: ['SAP S/4HANA', 'SAP ERP', 'SuccessFactors', 'SAP Ariba', 'SAP C4C', 'SAP BW'],
  right: ['Active Directory', 'Kronos', 'Salesforce', 'Third-party Payroll', 'AWS', 'External Applications'],
  leftProtocols: ['REST · SOAP · OData', 'IDoc · RFC'],
  rightProtocols: ['REST · SOAP · OData', 'SFTP · EDI'],
  caption: 'Representative technologies and enterprise integration scenarios from professional experience. Systems are shown conceptually, across separate projects and scenarios.',
};

export const certs = [
  { year: '2023', title: 'SAP Integration Suite', level: 'SAP Certified Development Associate' },
  { year: '2022', title: 'SAP BTP Extensions with SAP Cloud Application Programming Model', level: 'SAP Certified Development Associate' },
  { year: '2019', title: 'SAP Cloud Platform Integration', level: 'SAP Certified Application Associate' },
];

export const journey = ['SAP XI/PI', 'SAP PI/PO', 'Integration Lead', 'SAP CPI', 'Integration Suite', 'SAP BTP', 'Enterprise Architecture'];

export const education = [
  { title: 'Master of Business Administration', place: 'GITAM University · Bengaluru, India', year: '2020' },
  { title: 'Bachelor of Engineering – Computer Science', place: 'Sri Krishnadevaraya University · Anantapur, Andhra Pradesh, India', year: '2009' },
];
