// =========================================================
// NAV — mobile toggle + active link on scroll
// =========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = document.querySelectorAll('main section[id], #hero');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// =========================================================
// SCROLL REVEAL — section headers/blocks fade up once
// =========================================================
const revealTargets = document.querySelectorAll('.section-head, .about-grid, .bento, .process-line, .skills-grid, .carousel-viewport, .ee-grid, .freelance-grid, .why-grid, .contact-grid, .closing-inner');
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));

// =========================================================
// BACKGROUND NETWORK CANVAS — subtle animated node graph
// =========================================================
(function backgroundNetwork() {
  const canvas = document.getElementById('net-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, nodes;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = Math.max(window.innerHeight, document.body.scrollHeight * 0.4);
    const count = Math.min(70, Math.floor((w * h) / 28000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(34,211,238,0.55)';

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) {
          ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - d / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  step();
})();

// =========================================================
// PROJECTS + CASE STUDIES
// =========================================================
const projects = [
  {
    index: '01',
    title: 'Windows Technical Support Lab',
    tags: ['Windows 10/11', 'Troubleshooting', 'System Administration'],
    desc: 'Demonstration environment covering Windows installation, user management, system troubleshooting, Event Viewer analysis, device troubleshooting and network configuration.',
    case: {
      Problem: 'A set of simulated end-user machines exhibiting common issues: failed logins, driver conflicts, slow boot times and misbehaving peripherals.',
      Environment: 'Windows 10 and Windows 11 virtual machines, local user accounts, standard office peripherals and a small test network.',
      Investigation: 'Reviewed Event Viewer logs, checked Device Manager for driver conflicts, used Task Manager and Resource Monitor to isolate performance bottlenecks, and reproduced login failures under controlled conditions.',
      'Root Cause': 'A mix of outdated drivers, misconfigured startup programs and a corrupted user profile were identified as the underlying causes across the test cases.',
      Solution: 'Updated or rolled back drivers, cleaned startup items, rebuilt the affected user profile, and applied targeted Windows updates.',
      Verification: 'Re-tested each machine through a full boot-to-login cycle, confirmed peripheral function and monitored Event Viewer for recurring errors.',
      'Lessons Learned': 'A consistent, log-first troubleshooting approach narrows down root cause far faster than guesswork, and documenting each fix saves time on repeat issues.'
    }
  },
  {
    index: '02',
    title: 'Small Business Network Design',
    tags: ['Cisco', 'TCP/IP', 'VLAN', 'DHCP', 'DNS'],
    desc: 'Designed a realistic small-office network architecture including router/firewall, managed switch, VLANs, DHCP, Wi-Fi and endpoint connectivity.',
    case: {
      Problem: 'A small office needed a segmented, reliable network to separate staff, guest and device traffic while keeping setup manageable.',
      Environment: 'Cisco router/firewall, managed switch, wireless access point, and a mix of desktops, laptops and printers.',
      Investigation: 'Mapped required departments and device types, assessed traffic and security separation needs, and planned IP addressing across segments.',
      'Root Cause': 'Not applicable — this was a design build rather than a fault diagnosis.',
      Solution: 'Configured VLANs for staff, guest and printer traffic, set up DHCP scopes per VLAN, configured inter-VLAN routing and applied basic firewall rules, and connected Wi-Fi to the appropriate VLAN.',
      Verification: 'Tested connectivity and isolation between VLANs, confirmed DHCP leases assigned correctly, and validated internet access and printer availability from each segment.',
      'Lessons Learned': 'Planning IP addressing and VLAN structure before configuration prevents most connectivity issues later, and clear labeling saves time during handover.'
    }
  },
  {
    index: '03',
    title: 'Windows Server Administration Lab',
    tags: ['Windows Server', 'Active Directory', 'DNS', 'DHCP', 'GPO'],
    desc: 'Virtual lab demonstrating domain services, users, groups, DNS, DHCP and Group Policy concepts.',
    case: {
      Problem: 'Needed a working domain environment to practice user/group management and policy enforcement in a controlled setting.',
      Environment: 'Windows Server virtual machine configured as a domain controller, with client VMs joined to the domain.',
      Investigation: 'Reviewed domain requirements: organizational units, security groups, DNS zones, DHCP scopes and baseline Group Policy needs.',
      'Root Cause': 'Not applicable — this was a build/configuration lab rather than a fault diagnosis.',
      Solution: 'Promoted the server to a domain controller, configured DNS and DHCP roles, created OU structure with users and groups, and applied Group Policy objects for baseline security and desktop settings.',
      Verification: 'Joined client machines to the domain, confirmed policy application with gpresult, and tested DNS resolution and DHCP lease assignment.',
      'Lessons Learned': 'A clear OU and group structure up front makes policy management and future troubleshooting significantly simpler.'
    }
  },
  {
    index: '04',
    title: 'Microsoft 365 Support Lab',
    tags: ['Microsoft 365', 'Outlook', 'Teams', 'User Support'],
    desc: 'Practical support scenarios covering Outlook configuration, Teams troubleshooting, account support and Microsoft 365 administration concepts.',
    case: {
      Problem: 'Common end-user issues within a Microsoft 365 tenant: Outlook profile errors, Teams call/audio issues and account access problems.',
      Environment: 'Microsoft 365 test tenant, Outlook desktop client, Microsoft Teams, and standard Windows endpoints.',
      Investigation: 'Reproduced each issue, checked account licensing and permissions, reviewed Outlook profile configuration, and tested Teams audio/device settings.',
      'Root Cause': 'Cases traced to corrupted Outlook profiles, incorrect licensing assignment and misconfigured default audio devices in Teams.',
      Solution: 'Rebuilt affected Outlook profiles, corrected license assignments in the admin center, and reset Teams device settings to defaults.',
      Verification: 'Confirmed mail flow and calendar sync in Outlook, tested Teams calls with working audio, and verified account access matched intended permissions.',
      'Lessons Learned': 'Most Microsoft 365 user issues are resolved faster by checking licensing and profile integrity first, before deeper technical investigation.'
    }
  },
  {
    index: '05',
    title: 'IT Help Desk Ticket System',
    tags: ['IT Support', 'Ticket Management', 'Troubleshooting'],
    desc: 'Created realistic IT support ticket scenarios demonstrating issue identification, investigation, root-cause analysis, resolution and documentation.',
    case: {
      Problem: 'A backlog of varied support tickets — hardware, software, network and account issues — needed a consistent handling process.',
      Environment: 'Simulated ticketing workflow covering desktop, network and account-related requests from end users.',
      Investigation: 'Triaged each ticket by category and urgency, gathered details from the reporting user, and reproduced the issue where possible.',
      'Root Cause': 'Root causes varied by ticket, spanning hardware faults, misconfiguration and user error — each documented individually.',
      Solution: 'Applied the appropriate fix per ticket category, escalating where a case required deeper infrastructure access.',
      Verification: 'Confirmed resolution directly with the reporting user and closed each ticket only after the issue was verified fixed.',
      'Lessons Learned': 'A consistent triage and documentation process keeps ticket backlogs manageable and improves resolution times over time.'
    }
  },
  {
    index: '06',
    title: 'Network Troubleshooting Case Study',
    tags: ['TCP/IP', 'DNS', 'Ping', 'Traceroute', 'Network Diagnostics'],
    desc: 'Structured network troubleshooting workflow for diagnosing connectivity problems from physical connectivity through application-level verification.',
    case: {
      Problem: 'An endpoint reported intermittent loss of internet access while other devices on the same network remained unaffected.',
      Environment: 'Small office LAN with a managed switch, Wi-Fi access point, and a mix of wired and wireless clients.',
      Investigation: 'Checked physical connectivity and link lights, used ping and traceroute to isolate where packet loss occurred, and reviewed DNS resolution behavior.',
      'Root Cause': 'A loose network cable at the switch port combined with an outdated network adapter driver on the affected device.',
      Solution: 'Reseated and replaced the faulty cable, updated the network adapter driver, and confirmed switch port settings.',
      Verification: 'Ran sustained ping tests and confirmed stable connectivity over an extended period, with no further packet loss reported.',
      'Lessons Learned': 'Starting from the physical layer and working upward keeps network troubleshooting efficient and avoids chasing the wrong cause.'
    }
  }
];

const track = document.getElementById('projectTrack');
track.innerHTML = projects.map((p, i) => `
  <article class="project-card">
    <p class="project-index">${p.index}</p>
    <h3>${p.title}</h3>
    <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    <p class="desc">${p.desc}</p>
    <button class="btn btn-ghost" data-project="${i}">View Case Study</button>
  </article>
`).join('');

// --- Carousel navigation ---
const prevBtn = document.getElementById('prevProject');
const nextBtn = document.getElementById('nextProject');
const dotsWrap = document.getElementById('carouselDots');
const viewport = document.querySelector('.carousel-viewport');

let perView = 3;
let page = 0;

function getPerView() {
  const w = window.innerWidth;
  if (w <= 620) return 1;
  if (w <= 900) return 2;
  return 3;
}

function pageCount() {
  return Math.max(1, Math.ceil(projects.length / perView));
}

function renderDots() {
  dotsWrap.innerHTML = Array.from({ length: pageCount() }, (_, i) =>
    `<button class="dot${i === page ? ' active' : ''}" data-page="${i}" aria-label="Go to page ${i + 1}"></button>`
  ).join('');
}

function update() {
  perView = getPerView();
  const maxPage = pageCount() - 1;
  if (page > maxPage) page = maxPage;

  const cardWidth = track.children[0] ? track.children[0].getBoundingClientRect().width : 0;
  const gap = 18;
  const offset = page * perView * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  prevBtn.disabled = page === 0;
  nextBtn.disabled = page === maxPage;
  renderDots();
}

prevBtn.addEventListener('click', () => { page = Math.max(0, page - 1); update(); });
nextBtn.addEventListener('click', () => { page = Math.min(pageCount() - 1, page + 1); update(); });
dotsWrap.addEventListener('click', (e) => {
  const dot = e.target.closest('.dot');
  if (!dot) return;
  page = +dot.dataset.page;
  update();
});
window.addEventListener('resize', update);
window.addEventListener('load', update);
setTimeout(update, 50);

// --- Case study modal ---
const modal = document.getElementById('caseModal');
const modalTitle = document.getElementById('modalTitle');
const modalTags = document.getElementById('modalTags');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

track.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-project]');
  if (!btn) return;
  const p = projects[+btn.dataset.project];
  modalTitle.textContent = p.title;
  modalTags.textContent = p.tags.join(' · ');
  modalBody.innerHTML = Object.entries(p.case).map(([label, text]) => `
    <div class="modal-block">
      <h4>${label}</h4>
      <p>${text}</p>
    </div>
  `).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modalClose.focus();
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// =========================================================
// CONTACT FORM — front-end only handler
// =========================================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Thanks — this form is a UI demo. Connect it to your email/CRM of choice to receive requests.';
  contactForm.reset();
});

// =========================================================
// DOWNLOAD CV — placeholder until a real CV file is added
// =========================================================
document.getElementById('downloadCvBtn').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Add your CV file (e.g. musrif-cv.pdf) to the project folder and update this button\'s link to point to it.');
});
