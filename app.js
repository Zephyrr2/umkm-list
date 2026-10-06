(function () {
  "use strict";

  const data = typeof UMKM !== "undefined" && Array.isArray(UMKM) ? UMKM : [];

  const listEl = document.getElementById("list");
  const countEl = document.getElementById("count");
  const emptyEl = document.getElementById("empty");
  const searchEl = document.getElementById("search");
  const filtersEl = document.getElementById("filters");

  let activeCategory = "Semua";

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderChips() {
    const categories = ["Semua"];
    data.forEach(function (u) {
      if (u.kategori && categories.indexOf(u.kategori) === -1) categories.push(u.kategori);
    });
    filtersEl.innerHTML = categories
      .map(function (k) {
        const active = k === activeCategory ? " chip-active" : "";
        return (
          '<button type="button" class="chip' + active + '" data-kategori="' + esc(k) + '">' + esc(k) + "</button>"
        );
      })
      .join("");
  }

  function render() {
    const q = searchEl.value.trim().toLowerCase();
    const hasil = data.filter(function (u) {
      const cocokKategori = activeCategory === "Semua" || u.kategori === activeCategory;
      const hay = (u.nama + " " + u.alamat + " " + u.kategori).toLowerCase();
      return cocokKategori && hay.indexOf(q) !== -1;
    });

    countEl.textContent = hasil.length ? hasil.length + " UMKM ditemukan" : "";
    emptyEl.hidden = hasil.length > 0;

    listEl.innerHTML = hasil
      .map(function (u) {
        return (
          '<article class="card" role="link" tabindex="0" data-url="' + esc(u.maps) + '" aria-label="Buka ' + esc(u.nama) + ' di Google Maps">' +
          '<div class="card-top">' +
          '<span class="badge">' + esc(u.kategori) + "</span>" +
          "<h3>" + esc(u.nama) + "</h3>" +
          '<p class="addr">' + esc(u.alamat) + "</p>" +
          "</div>" +
          '<div class="card-foot"><span>Buka di Google Maps</span><span class="arrow" aria-hidden="true">&rarr;</span></div>' +
          "</article>"
        );
      })
      .join("");
  }

  function bukaMaps(url) {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  searchEl.addEventListener("input", render);

  filtersEl.addEventListener("click", function (e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.kategori;
    filtersEl.querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("chip-active", c === chip);
    });
    render();
  });

  listEl.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (card) bukaMaps(card.dataset.url);
  });

  listEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    bukaMaps(card.dataset.url);
  });

  // ---------- QR Code ----------
  const qrContainer = document.getElementById("qrcode");
  const qrUrlEl = document.getElementById("qr-url");
  const qrNote = document.getElementById("qr-note");
  const btnPng = document.getElementById("dl-png");
  const btnSvg = document.getElementById("dl-svg");

  const pageUrl = window.location.href.replace(/#.*$/, "");
  let qr = null;

  function drawCanvas(source) {
    const count = source.getModuleCount();
    const quiet = 4;
    const scale = 12;
    const size = (count + quiet * 2) * scale;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#111111";
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (source.isDark(r, c)) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
    }
    return canvas;
  }

  function renderQR() {
    qrUrlEl.textContent = pageUrl;

    if (typeof window.qrcode !== "function") {
      qrContainer.classList.add("qr-fallback");
      qrContainer.textContent = "QR gagal dimuat. Buka: " + pageUrl;
      btnPng.disabled = true;
      btnSvg.disabled = true;
      return;
    }

    if (window.location.protocol === "file:") {
      qrNote.hidden = false;
      qrNote.textContent =
        "Halaman dibuka langsung dari file, jadi QR menunjukkan alamat file. Setelah di-hosting online, QR otomatis menunjukkan alamat web yang benar.";
    }

    try {
      qr = window.qrcode(0, "M");
      qr.addData(pageUrl);
      qr.make();
      qrContainer.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 4, scalable: true });
    } catch (err) {
      qrContainer.textContent = "QR gagal dibuat: " + err.message;
      btnPng.disabled = true;
      btnSvg.disabled = true;
    }
  }

  btnPng.addEventListener("click", function () {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = drawCanvas(qr).toDataURL("image/png");
    a.download = "qr-daftar-umkm.png";
    a.click();
  });

  btnSvg.addEventListener("click", function () {
    if (!qr) return;
    const svg = qrContainer.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qr-daftar-umkm.svg";
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 1000);
  });

  renderChips();
  render();
  renderQR();
})();
