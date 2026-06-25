const dotsContainer = document.getElementById("dots");
const DOT_COUNT = 20;


for (let i = 0; i < DOT_COUNT; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");

  // Random size
  const size = Math.random() * 10 + 6;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  // Random position
  dot.style.top = `${Math.random() * 100}%`;
  dot.style.left = `${Math.random() * 100}%`;

  // Random animation movement
  dot.style.setProperty("--x", `${(Math.random() - 0.5) * 60}px`);
  dot.style.setProperty("--y", `${(Math.random() - 0.5) * 60}px`);

  // Random duration & delay
  dot.style.animationDuration = `${Math.random() * 8 + 6}s`;
  dot.style.animationDelay = `${Math.random() * 5}s`;

  dotsContainer.appendChild(dot);
}

  let progress = 0;
  const splash = document.getElementById("splash");
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const loading = setInterval(() => {
    progress++;
    bar.style.width = progress + "%";
    text.textContent = "Loading " + progress + "%";

    if (progress >= 100) {
      clearInterval(loading);

      setTimeout(() => {
        // smooth fade and then remove from DOM to avoid blocking clicks
        splash.classList.add("fade-out");
        // wait for CSS transition then remove
        setTimeout(() => {
          try { splash.remove(); } catch (e) { /* ignore */ }
          document.body.classList.add('loaded');
        }, 900);
      }, 300);
    }
  }, 30); // ±3 detik

// --- Domain checker logic ---
function rdapCheck(fqdn) {
  const url = `https://rdap.org/domain/${fqdn}`;
  return fetch(url, { method: 'GET' }).then(resp => {
    if (resp.status === 200) return { fqdn, registered: true };
    if (resp.status === 404) return { fqdn, registered: false };
    return { fqdn, registered: null, status: resp.status };
  }).catch(err => ({ fqdn, registered: null, error: err.message }));
}

function renderResults(results) {
  const container = document.getElementById('domainResults');
  container.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'domain-result-list';

  results.forEach(r => {
    const item = document.createElement('div');
    item.className = 'domain-item p-2';
    if (r.registered === true) {
      item.innerHTML = `<span class="domain-unavailable">${r.fqdn} — Terdaftar</span>`;
    } else if (r.registered === false) {
      item.innerHTML = `<span class="domain-available">${r.fqdn} — Tersedia</span>`;
      // create CTA button to WhatsApp with prefilled message
      try {
        const msg = encodeURIComponent(`Halo saya ingin memesan website dengan domain ${r.fqdn}`);
        const a = document.createElement('a');
        a.className = 'btn btn-sm btn-success ms-2';
        a.href = `https://wa.me/6283192124659?text=${msg}`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = '🛒 Pesan Sekarang';
        item.appendChild(a);
      } catch (e) {
        // fallback: no button
      }
    } else if (r.error) {
      item.innerHTML = `<span class="domain-error">${r.fqdn} — Gagal: ${r.error}</span>`;
    } else {
      item.innerHTML = `<span class="domain-error">${r.fqdn} — Status: ${r.status}</span>`;
    }
    list.appendChild(item);
  });

  container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('checkDomainBtn');
  const input = document.getElementById('domainInput');

  btn.addEventListener('click', async () => {
    const name = (input.value || '').trim();
    const notice = document.getElementById('domainNotice');
    const resultsContainer = document.getElementById('domainResults');
    resultsContainer.innerHTML = '';

    if (!name) {
      resultsContainer.innerHTML = '<div class="text-danger">Masukkan nama domain terlebih dahulu.</div>';
      return;
    }

    // fixed TLD list (UI shows labels only)
    const tlds = ['.com', '.id', '.net', '.xyz', '.online', '.org', '.site', '.shop', '.my.id', '.sch', '.biz.id'];

    // disable button while checking
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Memeriksa...';

    const fqdns = tlds.map(t => {
      // handle TLDs that include a dot or second-level like .my.id or .biz.id
      if (t.startsWith('.')) return `${name}${t}`;
      return `${name}.${t}`;
    });

    const checks = fqdns.map(fqdn => rdapCheck(fqdn));

    const settled = await Promise.allSettled(checks);
    const results = settled.map(s => (s.status === 'fulfilled' ? s.value : { fqdn: 'unknown', registered: null, error: 'Fetch gagal' }));

    renderResults(results);

    // restore button
    btn.disabled = false;
    btn.textContent = originalText;

    // if many errors, show short guidance
    const hadErrors = results.some(r => r.registered === null);
    if (hadErrors) {
      notice.textContent = 'Beberapa pengecekan gagal — jika muncul "Gagal" kemungkinan dibatasi CORS. Untuk pengecekan 100% andal gunakan API server-side (mis. WHOIS/RDAP server dengan CORS atau backend proxy).';
    } else {
      notice.textContent = 'Hasil diambil dari layanan publik RDAP.';
    }
  });
});
