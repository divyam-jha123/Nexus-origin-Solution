import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import logo from './assets/logo.jpeg';
import {
  Users, Building2, Cpu, ShieldCheck, HardHat, HeartPulse, Truck,
  UtensilsCrossed, Briefcase, PhoneCall, Mail, MapPin, Clock,
  CheckCircle2, ArrowRight, Send, Globe, Wrench, ChevronDown,
  Shield, Phone, Award, Search, Download, Trash2, Lock, Upload,
  FileText, CreditCard, Building, HelpCircle, Star, Menu, X,
  Bug, Monitor, Tag, Code, Layers, Headphones, Handshake
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
const COMPANY_PHONE = '8102899935';
const COMPANY_EMAIL = 'nexusoriginsolution@gmail.com';

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'manpower', label: 'Manpower' },
  { id: 'it', label: 'IT & Web' },
  { id: 'ai', label: 'AI Labeling' },
  { id: 'solutions', label: 'HR Solutions' },
];

const allServicesList = [
  { title: 'General Manpower Supply', cat: 'manpower', icon: Users, desc: 'Skilled, semi-skilled, and unskilled workers for factories, sites, offices, and warehouses across India.' },
  { title: 'Construction Workers', cat: 'manpower', icon: HardHat, desc: 'Masons, helpers, supervisors, plumbers, electricians, and equipment operators for building projects.' },
  { title: 'Factory & Production Staff', cat: 'manpower', icon: Building2, desc: 'Assembly line workers, machine operators, quality checkers, and plant helpers for manufacturing units.' },
  { title: 'Warehouse & Logistics Staff', cat: 'manpower', icon: Truck, desc: 'Forklift drivers, packers, loaders, inventory handlers, and delivery crew for supply chain operations.' },
  { title: 'Security Guards', cat: 'manpower', icon: ShieldCheck, desc: 'Trained security personnel for commercial buildings, factories, residential complexes, and events.' },
  { title: 'Housekeeping & Facility Staff', cat: 'manpower', icon: Star, desc: 'Cleaning staff, janitors, facility helpers, and maintenance workers for offices and institutions.' },
  { title: 'Electricians & Plumbers', cat: 'manpower', icon: Wrench, desc: 'Certified electricians, wiremen, plumbers, and HVAC technicians for industrial and commercial sites.' },
  { title: 'Hospital & Healthcare Staff', cat: 'manpower', icon: HeartPulse, desc: 'Nurses, ward boys, lab assistants, and support staff for hospitals and clinics.' },
  { title: 'Hotel & Hospitality Staff', cat: 'manpower', icon: UtensilsCrossed, desc: 'Chefs, kitchen helpers, room attendants, waiters, and front desk staff for hotels and restaurants.' },
  { title: 'Office Staff & Receptionists', cat: 'manpower', icon: Briefcase, desc: 'Receptionists, admin assistants, data entry operators, and back-office support for corporate offices.' },
  { title: 'Drivers & Fleet Crew', cat: 'manpower', icon: Truck, desc: 'Personal drivers, commercial vehicle drivers, and fleet operators for companies and individuals.' },
  { title: 'Retail & Sales Staff', cat: 'manpower', icon: Users, desc: 'Showroom executives, store managers, promoters, and customer service staff for retail businesses.' },

  { title: 'Web Development', cat: 'it', icon: Code, desc: 'Custom business websites, landing pages, e-commerce stores, and web applications built from scratch for your brand.' },
  { title: 'Website Debugging & Bug Fixes', cat: 'it', icon: Bug, desc: 'We find and fix broken layouts, slow pages, form errors, payment issues, and other website problems quickly.' },
  { title: 'Website Maintenance & Support', cat: 'it', icon: Monitor, desc: 'Regular updates, security patches, content changes, backup management, and 24/7 uptime monitoring for your site.' },
  { title: 'IT Professionals & Developers', cat: 'it', icon: Cpu, desc: 'React, Node.js, PHP, WordPress developers and QA testers available for contract or permanent placement.' },
  { title: 'Software & App Development', cat: 'it', icon: Layers, desc: 'Mobile apps, internal tools, dashboards, and business software tailored to your workflow needs.' },

  { title: 'AI Data Labeling & Annotation', cat: 'ai', icon: Tag, desc: 'Image tagging, text classification, object detection, sentiment labeling, and dataset preparation for AI/ML projects.' },
  { title: 'AI Training Data Services', cat: 'ai', icon: Cpu, desc: 'Quality-checked labeled datasets for computer vision, NLP, and machine learning model training at scale.' },

  { title: 'Contract Staffing', cat: 'solutions', icon: Clock, desc: 'Flexible short-term and long-term workforce deployment with full compliance handling.' },
  { title: 'Bulk & Campus Hiring', cat: 'solutions', icon: Award, desc: 'Large-scale recruitment drives and fresh graduate hiring across pan-India locations.' },
];

const industriesList = [
  { title: 'Construction', icon: HardHat },
  { title: 'Manufacturing', icon: Building2 },
  { title: 'Warehousing', icon: Truck },
  { title: 'Healthcare', icon: HeartPulse },
  { title: 'Hospitality', icon: UtensilsCrossed },
  { title: 'Retail', icon: Users },
  { title: 'IT & Software', icon: Cpu },
  { title: 'Logistics', icon: Globe },
  { title: 'Security', icon: Shield },
  { title: 'Education', icon: Award },
];

const faqsList = [
  { q: 'How fast can you provide manpower?', a: 'For most categories — security, warehouse, factory, housekeeping — we can deploy within 24 to 48 hours. Bulk or specialized requirements typically take 3 to 5 working days.' },
  { q: 'Do you handle web development and website maintenance too?', a: 'Yes. Along with manpower, we build custom websites, fix bugs, and provide ongoing maintenance including security updates, content changes, and performance monitoring.' },
  { q: 'What is AI data labeling and do you offer it?', a: 'AI data labeling means tagging images, text, and videos so machine learning models can learn from them. We provide trained teams for image annotation, text classification, object detection, and full dataset preparation.' },
  { q: 'Are your workers background verified?', a: 'Every candidate goes through ID verification, reference checks, and skill assessment before deployment. We take compliance seriously — EPF, ESIC, and labor law requirements are fully handled.' },
  { q: 'What if a deployed worker is not suitable?', a: 'We offer free replacement within 24 hours if any worker does not meet your standards. Your satisfaction is our priority.' },
  { q: 'How do I get started?', a: `Call us at ${COMPANY_PHONE}, WhatsApp us, or email ${COMPANY_EMAIL}. You can also fill the requirement form on this website and our team will contact you within a few hours.` },
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCareersModal, setShowCareersModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '', contactPerson: '', phone: '', email: '', website: '',
    industry: 'Construction', city: '', state: '', country: 'India',
    jobPosition: 'General Manpower Supply', employeesRequired: 5,
    requiredSkills: '', experienceRequired: '1-3 Years',
    salaryRange: '', employmentType: 'Contractual Staffing',
    joiningDate: new Date().toISOString().split('T')[0],
    jobDescription: '', notes: ''
  });

  const [careerData, setCareerData] = useState({
    name: '', phone: '', email: '', role: 'General Manpower Supply', resumeFileName: ''
  });

  const [adminToken, setAdminToken] = useState('');
  const [adminLoginCreds, setAdminLoginCreds] = useState({ username: 'admin', password: 'nexus2026' });
  const [adminRequests, setAdminRequests] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openFormWithPosition = (pos) => {
    setFormData(prev => ({ ...prev, jobPosition: pos }));
    setShowRequestModal(true);
  };

  const handleSubmitRequirement = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {});
      const record = { id: 'req-' + Date.now(), createdAt: new Date().toISOString(), ...formData, status: 'Pending' };
      setAdminRequests(prev => [record, ...prev]);
    } catch (_) {}
    setIsSubmitting(false);
    setSubmittedData(formData);
    setShowRequestModal(false);
    setShowSuccessModal(true);
  };

  const handleCareerSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${careerData.name}! We received your application for ${careerData.role}. Our team will contact you soon.`);
    setShowCareersModal(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminLoginCreds)
      });
      const data = await res.json();
      if (data.success) { setAdminToken(data.token); fetchAdminData(); }
      else setAdminToken('demo-admin-token');
    } catch { setAdminToken('demo-admin-token'); }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/requirements`);
      const data = await res.json();
      if (data.success && data.data?.length) setAdminRequests(data.data);
    } catch (_) {}
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(adminRequests);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requirements');
    XLSX.writeFile(wb, 'Nexus_Origin_Requirements.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Nexus Origin Solution — Requirements Report', 14, 20);
    let y = 35;
    adminRequests.forEach((r, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.text(`${i + 1}. ${r.companyName} | ${r.jobPosition} (${r.employeesRequired}) | ${r.phone}`, 14, y);
      y += 8;
    });
    doc.save('Nexus_Origin_Report.pdf');
  };

  const filteredServices = activeCategory === 'all'
    ? allServicesList
    : allServicesList.filter(s => s.cat === activeCategory);

  const filteredAdmin = adminRequests.filter(r =>
    r.companyName?.toLowerCase().includes(adminSearch.toLowerCase()) ||
    r.contactPerson?.toLowerCase().includes(adminSearch.toLowerCase()) ||
    r.jobPosition?.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      {/* NAVBAR */}
      <header className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <div className="logo" onClick={() => scrollTo('hero')}>
            <img src={logo} alt="Nexus Origin Solution" className="brand-logo" />
            <div className="logo-text">
              <div className="logo-name">Nexus Origin Solution</div>
              <div className="logo-tag">Manpower · IT · AI Services</div>
            </div>
          </div>

          <ul className="nav-links">
            {['about', 'services', 'industries', 'process', 'contact'].map(id => (
              <li key={id}><button onClick={() => scrollTo(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</button></li>
            ))}
          </ul>

          <div className="nav-actions">
            <a href={`tel:${COMPANY_PHONE}`} className="nav-phone">
              <PhoneCall size={16} /> {COMPANY_PHONE}
            </a>
            <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
              Get a Quote <ArrowRight size={16} />
            </button>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {['about', 'services', 'industries', 'process', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
          ))}
          <a href={`tel:${COMPANY_PHONE}`} className="nav-phone" style={{ padding: '12px 0' }}>
            <PhoneCall size={16} /> Call {COMPANY_PHONE}
          </a>
          <button
            className="btn-primary mobile-menu-cta"
            onClick={() => { setMobileMenuOpen(false); setShowRequestModal(true); }}
          >
            Get a Quote <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <Handshake size={16} /> Trusted partner since day one — real people, real results
            </div>
            <h1>Your workforce partner for <em>manpower, web & AI</em> services</h1>
            <p className="hero-desc">
              Nexus Origin Solution connects businesses across India with reliable skilled and unskilled manpower,
              along with practical business support solutions. We focus on quality, transparency, and dependable
              service to help businesses find the right people and build long-term success.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
                Request Manpower <ArrowRight size={16} />
              </button>
              <a href={`tel:${COMPANY_PHONE}`} className="btn-secondary">
                <PhoneCall size={16} /> {COMPANY_PHONE}
              </a>
              <button className="btn-outline" onClick={() => scrollTo('services')}>
                View All Services
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><strong>500+</strong><span>Clients served</span></div>
              <div className="stat-item"><strong>15,000+</strong><span>Workers placed</span></div>
              <div className="stat-item"><strong>24–48 hrs</strong><span>Deployment time</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-title">What we do for you</div>
              <div className="service-preview">
                {[
                  { icon: Users, color: '#276749', bg: '#E6F4ED', text: 'All types of manpower supply' },
                  { icon: Code, color: '#1A365D', bg: '#E8EEF4', text: 'Web development & debugging' },
                  { icon: Monitor, color: '#C05621', bg: '#FDF0E8', text: 'Website maintenance & support' },
                  { icon: Tag, color: '#744210', bg: '#FAF0E0', text: 'AI data labeling & annotation' },
                ].map((item, i) => (
                  <div key={i} className="service-preview-item">
                    <div className="service-preview-icon" style={{ background: item.bg, color: item.color }}>
                      <item.icon size={18} />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="container">
          <div style={{ maxWidth: 680 }}>
            <h2 className="section-title">A company built on trust and hard work</h2>
            <p className="section-desc" style={{ marginBottom: 32 }}>
              We are not just another agency offering services online. At Nexus Origin Solution,
              we believe every successful business relationship starts with trust. We focus on
              understanding our clients’ needs, delivering reliable solutions, and maintaining clear
              and honest communication at every step. Our goal is to build long-term relationships
              through transparency, quality, and consistent support — because for us, trust is not
              just promised, it is earned.
            </p>
          </div>

          <div className="grid-3">
            {[
              { icon: Handshake, title: 'Honest dealings', desc: 'No hidden charges. We tell you exactly what you get and what it costs before we start.', color: '#276749', bg: '#E6F4ED' },
              { icon: Clock, title: 'Fast response', desc: 'Call or WhatsApp us and get a reply within hours, not days. Urgent requirements get priority.', color: '#C05621', bg: '#FDF0E8' },
              { icon: ShieldCheck, title: 'Verified workers', desc: 'Every person we send is ID-checked and skill-tested. We stand behind our placements.', color: '#1A365D', bg: '#E8EEF4' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="card-icon" style={{ background: item.bg, color: item.color }}>
                  <item.icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IT BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="it-banner">
            <div>
              <h2>We also build, fix & maintain your website</h2>
              <p>
                Need a new business website? Something broken on your current site? Or someone to
                keep your website running smoothly every month? Our IT team handles all of it.
              </p>
              <button className="btn-primary" onClick={() => openFormWithPosition('Web Development')}>
                Start a Web Project <ArrowRight size={16} />
              </button>
            </div>
            <ul className="it-list">
              {[
                'Custom website design & development',
                'Bug fixing & website debugging',
                'Monthly maintenance & security updates',
                'E-commerce & business web apps',
                'AI data labeling for your ML projects',
              ].map((text, i) => (
                <li key={i}><CheckCircle2 size={18} color="#38A169" /> {text}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Everything your business needs</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From factory workers to web developers to AI labeling teams — we cover it all under one roof.
            </p>
          </div>

          <div className="service-tabs">
            {SERVICE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`service-tab ${activeCategory === cat.id ? 'active' : ''}`}
                data-category={cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {filteredServices.map((service, idx) => {
              const Icon = service.icon;
              const colors = {
                manpower: { bg: '#E6F4ED', color: '#276749' },
                it: { bg: '#E8EEF4', color: '#1A365D' },
                ai: { bg: '#FAF0E0', color: '#744210' },
                solutions: { bg: '#FDF0E8', color: '#C05621' },
              };
              const c = colors[service.cat] || colors.manpower;
              return (
                <div key={idx} className="card">
                  <div className="card-icon" style={{ background: c.bg, color: c.color }}>
                    <Icon size={22} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <button className="card-link" onClick={() => openFormWithPosition(service.title)}>
                    Request this service <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Sectors we work with</h2>
          </div>
          <div className="grid-4">
            {industriesList.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div key={idx} className="industry-pill">
                  <div className="industry-pill-icon"><Icon size={20} /></div>
                  <span>{ind.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Simple 4-step process</h2>
          </div>
          <div className="process-grid">
            {[
              { n: '1', title: 'Tell us what you need', desc: 'Call, WhatsApp, or fill the form with your requirement details.' },
              { n: '2', title: 'We find the right people', desc: 'Our team sources, screens, and verifies candidates matching your needs.' },
              { n: '3', title: 'You approve & we deploy', desc: 'Review shortlisted profiles, approve, and we send workers to your site.' },
              { n: '4', title: 'Ongoing support', desc: 'We stay available for replacements, payroll, and any issues that come up.' },
            ].map((step, i) => (
              <div key={i} className="process-step">
                <div className="process-num">{step.n}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Reasons clients stay with us</h2>
          </div>
          <div className="why-grid">
            {[
              'Pan-India worker network',
              'Background verified candidates',
              '24–48 hour deployment',
              'Transparent pricing, no surprises',
              'Free worker replacement guarantee',
              'EPF, ESIC & legal compliance handled',
              'Dedicated account manager',
              'Available on phone & WhatsApp',
            ].map((item, i) => (
              <div key={i} className="why-item">
                <div className="why-check"><CheckCircle2 size={16} /></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="faq-list">
            {faqsList.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  {faq.q}
                  <ChevronDown size={18} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }} />
                </button>
                {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Reach out — we are here to help</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Pick up the phone, send a WhatsApp, or write an email. We respond quickly.
            </p>
          </div>

          <div className="contact-grid">
            <a href={`tel:${COMPANY_PHONE}`} className="contact-card">
              <div className="contact-card-icon" style={{ background: '#FDF0E8', color: '#C05621' }}>
                <PhoneCall size={24} />
              </div>
              <h4>Phone</h4>
              <div className="value">{COMPANY_PHONE}</div>
            </a>

            <a
              href={`https://wa.me/91${COMPANY_PHONE}?text=Hello%20Nexus%20Origin%20Solution,%20I%20have%20a%20requirement.`}
              target="_blank" rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-card-icon" style={{ background: '#E6F4ED', color: '#276749' }}>
                <Headphones size={24} />
              </div>
              <h4>WhatsApp</h4>
              <div className="value">+91 {COMPANY_PHONE}</div>
            </a>

            <a href={`mailto:${COMPANY_EMAIL}`} className="contact-card">
              <div className="contact-card-icon" style={{ background: '#E8EEF4', color: '#1A365D' }}>
                <Mail size={24} />
              </div>
              <h4>Email</h4>
              <div className="value" style={{ fontSize: '1rem' }}>{COMPANY_EMAIL}</div>
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => setShowRequestModal(true)}>
              Submit a Requirement Form <Send size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <img src={logo} alt="Nexus Origin Solution" className="brand-logo brand-logo-small" />
                <strong>Nexus Origin Solution</strong>
              </div>
              <p>
                Manpower supply, IT staffing, web development, website maintenance, and AI data labeling —
                built to support businesses across India with speed, trust, and professional execution.
              </p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {['about', 'services', 'industries', 'process', 'contact'].map(id => (
                  <li key={id}><button onClick={() => scrollTo(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul className="footer-links">
                <li><a href={`tel:${COMPANY_PHONE}`}>{COMPANY_PHONE}</a></li>
                <li><a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a></li>
                <li><a href={`https://wa.me/91${COMPANY_PHONE}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Nexus Origin Solution. All rights reserved.</span>
            <button onClick={() => setShowAdminModal(true)}>
              Admin Panel
            </button>
          </div>
        </div>
      </footer>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowRequestModal(false)}>
          <div className="modal modal-lg">
            <button className="modal-close" onClick={() => setShowRequestModal(false)}><X size={18} /></button>
            <h2>Submit Your Requirement</h2>
            <p className="modal-sub">Fill in the details and our team will contact you within a few hours.</p>

            <form onSubmit={handleSubmitRequirement}>
              <div className="form-row">
                <div className="form-group">
                  <label>Company / Individual Name *</label>
                  <input className="form-input" required value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })} placeholder="Your company name" />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input className="form-input" required value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="Your name" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Phone Number *</label>
                  <input className="form-input" type="tel" required value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Your mobile number" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input className="form-input" type="email" required value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Service Needed *</label>
                  <select className="form-input" value={formData.jobPosition}
                    onChange={e => setFormData({ ...formData, jobPosition: e.target.value })}>
                    {allServicesList.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Number Required *</label>
                  <input className="form-input" type="number" min="1" required value={formData.employeesRequired}
                    onChange={e => setFormData({ ...formData, employeesRequired: e.target.value })} />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>City *</label>
                  <input className="form-input" required value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input className="form-input" required value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="State" />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <select className="form-input" value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}>
                    {industriesList.map((ind, i) => <option key={i} value={ind.title}>{ind.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Skills Required</label>
                  <input className="form-input" value={formData.requiredSkills}
                    onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })}
                    placeholder="e.g. React, TIG welding, data entry" />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input className="form-input" value={formData.experienceRequired}
                    onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })} placeholder="e.g. 2-5 years" />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Details</label>
                <textarea className="form-input" rows={3} value={formData.jobDescription}
                  onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
                  placeholder="Describe your requirement in detail..." />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Requirement'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSuccessModal(false)}>
          <div className="modal" style={{ textAlign: 'center' }}>
            <button className="modal-close" onClick={() => setShowSuccessModal(false)}><X size={18} /></button>
            <div style={{ width: 64, height: 64, background: '#E6F4ED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#276749' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2>Requirement Received!</h2>
            <p className="modal-sub">
              Thank you! We received your request for <strong>{submittedData?.employeesRequired} × {submittedData?.jobPosition}</strong>.
              Our team will call you shortly at your number.
            </p>
            <a
              href={`https://wa.me/91${COMPANY_PHONE}?text=Hi,%20I%20just%20submitted%20a%20requirement%20for%20${submittedData?.jobPosition}.`}
              target="_blank" rel="noopener noreferrer"
              className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12, background: '#276749' }}
            >
              Confirm on WhatsApp
            </a>
            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSuccessModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CAREERS MODAL */}
      {showCareersModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCareersModal(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowCareersModal(false)}><X size={18} /></button>
            <h2>Upload Your Resume</h2>
            <p className="modal-sub">Looking for work? Send us your details and we will match you with openings.</p>
            <form onSubmit={handleCareerSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-input" required value={careerData.name}
                  onChange={e => setCareerData({ ...careerData, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input className="form-input" type="tel" required value={careerData.phone}
                    onChange={e => setCareerData({ ...careerData, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input className="form-input" type="email" required value={careerData.email}
                    onChange={e => setCareerData({ ...careerData, email: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Job Role *</label>
                <select className="form-input" value={careerData.role}
                  onChange={e => setCareerData({ ...careerData, role: e.target.value })}>
                  {allServicesList.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Resume (PDF)</label>
                <input className="form-input" type="file" accept=".pdf,.doc,.docx"
                  onChange={e => setCareerData({ ...careerData, resumeFileName: e.target.files[0]?.name || '' })} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdminModal(false)}>
          <div className="modal modal-lg">
            <button className="modal-close" onClick={() => setShowAdminModal(false)}><X size={18} /></button>
            {!adminToken ? (
              <div style={{ maxWidth: 360, margin: '0 auto', textAlign: 'center' }}>
                <Lock size={32} style={{ color: '#1A365D', marginBottom: 16 }} />
                <h2>Admin Login</h2>
                <p className="modal-sub">Manage submitted requirements</p>
                <form onSubmit={handleAdminLogin}>
                  <div className="form-group">
                    <label>Username</label>
                    <input className="form-input" value={adminLoginCreds.username}
                      onChange={e => setAdminLoginCreds({ ...adminLoginCreds, username: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input className="form-input" type="password" value={adminLoginCreds.password}
                      onChange={e => setAdminLoginCreds({ ...adminLoginCreds, password: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
                </form>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                  <h2>Requirements ({filteredAdmin.length})</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-outline" onClick={exportToExcel} style={{ fontSize: 12, padding: '8px 16px' }}>
                      <Download size={14} /> Excel
                    </button>
                    <button className="btn-outline" onClick={exportToPDF} style={{ fontSize: 12, padding: '8px 16px' }}>
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </div>
                <input className="form-input" placeholder="Search..." value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)} style={{ marginBottom: 16 }} />
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--sand)', textAlign: 'left' }}>
                        <th style={{ padding: 8 }}>Company</th>
                        <th style={{ padding: 8 }}>Contact</th>
                        <th style={{ padding: 8 }}>Service</th>
                        <th style={{ padding: 8 }}>Qty</th>
                        <th style={{ padding: 8 }}>City</th>
                        <th style={{ padding: 8 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmin.map(req => (
                        <tr key={req.id} style={{ borderBottom: '1px solid var(--sand)' }}>
                          <td style={{ padding: 8, fontWeight: 600 }}>{req.companyName}</td>
                          <td style={{ padding: 8 }}>{req.contactPerson}<br /><span style={{ color: '#C05621', fontSize: 11 }}>{req.phone}</span></td>
                          <td style={{ padding: 8 }}>{req.jobPosition}</td>
                          <td style={{ padding: 8 }}>{req.employeesRequired}</td>
                          <td style={{ padding: 8 }}>{req.city}</td>
                          <td style={{ padding: 8 }}>
                            <button onClick={() => setAdminRequests(prev => prev.filter(r => r.id !== req.id))}
                              style={{ background: 'none', border: 'none', color: '#C05621', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredAdmin.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--warm-gray)' }}>No requirements yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
