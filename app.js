/*
 * TEMPLATE UNDANGAN DIGITAL
 * 1) Ubah DATA di bawah sesuai acara.
 * 2) Setelah deploy Apps Script, tempel URL Web App ke API_URL.
 * 3) Parameter nama tamu bisa dikirim lewat URL: ?to=Nama%20Tamu
 */
const API_URL = "https://script.google.com/macros/s/AKfycbwbSlYARQZ-24PLx7Ox0Siuzsb0YQMFQx7uWIB3LDuUOh24ApZKmNL-tYlUZ366zdo70A/exec";

const DATA = {
  title: "Undangan Pernikahan",
  groom: {
    name: "Hasyemi Nazar",
    parents: "Putra dari Bapak Tarbu dan Ibu Sainem",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85"
  },
  bride: {
    name: "Amanah Fidyaningsih",
    parents: "Putri dari Bapak Caryono dan Ibu Daniyah",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85"
  },
  dateISO: "2027-04-02T08:00:00+07:00", // format ISO, termasuk zona waktu
  dateLabel: "Jumat, 2 April 2027",
  intro: "Dengan penuh rasa syukur, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
  story: "Setiap pertemuan memiliki cerita. Kami bersyukur perjalanan ini membawa kami menuju hari istimewa yang ingin kami rayakan bersama keluarga dan sahabat.",
  events: [
    { title: "Akad Nikah", date: "Jumat, 2 April 2027", time: "08.00 WIB - selesai", address: "Alamat lokasi akad, Kota", map: "https://maps.google.com/?q=Lokasi+Akad" },
    { title: "Resepsi", date: "Jumat, 2 April 2027", time: "13.00 WIB - selesai", address: "Alamat lokasi resepsi, Kota", map: "https://maps.google.com/?q=Lokasi+Resepsi" }
  ],
  locationText: "Kehadiran dan doa restu Anda merupakan kebahagiaan bagi kami.",
  mapUrl: "https://maps.google.com/",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85"
  ]
};

const $ = (id) => document.getElementById(id);
const safeText = (value) => String(value ?? "");
const guestFromUrl = new URLSearchParams(window.location.search).get("to") || "Tamu Undangan";
let countdownTimer = null;

function setText(id, value) { $(id).textContent = safeText(value); }
function render() {
  document.title = `${DATA.groom.name} & ${DATA.bride.name} | Undangan Pernikahan`;
  setText("heroEyebrow", "THE WEDDING OF");
  setText("heroNames", `${DATA.groom.name} & ${DATA.bride.name}`);
  setText("heroDate", DATA.dateLabel);
  setText("guestName", guestFromUrl);
  setText("introText", DATA.intro);
  setText("groomName", DATA.groom.name);
  setText("groomParents", DATA.groom.parents);
  setText("brideName", DATA.bride.name);
  setText("brideParents", DATA.bride.parents);
  setText("storyText", DATA.story);
  setText("locationText", DATA.locationText);
  setText("footerNames", `${DATA.groom.name} & ${DATA.bride.name}`);
  $("groomPhoto").src = DATA.groom.photo;
  $("bridePhoto").src = DATA.bride.photo;
  $("mapButton").href = DATA.mapUrl;
  $("eventCards").replaceChildren();
  DATA.events.forEach((event) => {
    const card = document.createElement("article");
    card.className = "event-card";
    const title = document.createElement("h3"); title.textContent = event.title;
    const date = document.createElement("p"); date.className = "event-day"; date.textContent = event.date;
    const time = document.createElement("p"); time.textContent = event.time;
    const address = document.createElement("p"); address.textContent = event.address;
    const map = document.createElement("a"); map.className = "button"; map.href = event.map; map.target = "_blank"; map.rel = "noopener"; map.textContent = "Petunjuk Lokasi ↗";
    card.append(title, date, time, address, map);
    $("eventCards").append(card);
  });
  $("galleryGrid").replaceChildren();
  DATA.gallery.forEach((url, index) => {
    const img = document.createElement("img"); img.src = url; img.alt = `Foto galeri ${index + 1}`; img.loading = "lazy";
    $("galleryGrid").append(img);
  });
  $("rsvpName").value = guestFromUrl === "Tamu Undangan" ? "" : guestFromUrl;
  $("loadingScreen").classList.add("hidden");
  $("invitation").classList.remove("hidden");
  startCountdown();
  loadWishes();
}
function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);
  const target = new Date(DATA.dateISO).getTime();
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); diff %= 60000;
    const seconds = Math.floor(diff / 1000);
    setText("days", String(days).padStart(2, "0"));
    setText("hours", String(hours).padStart(2, "0"));
    setText("minutes", String(minutes).padStart(2, "0"));
    setText("seconds", String(seconds).padStart(2, "0"));
  }
  tick(); countdownTimer = setInterval(tick, 1000);
}
$("openInvitation").addEventListener("click", () => {
  document.body.classList.add("invitation-open");
  $("couple").scrollIntoView({ behavior: "smooth" });
});

function jsonp(params) {
  return new Promise((resolve, reject) => {
    if (!API_URL || API_URL.includes("PASTE_URL")) {
      reject(new Error("URL Apps Script belum diatur. Isi API_URL di app.js."));
      return;
    }
    const callbackName = "jsonpCallback_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const timeout = setTimeout(() => finish(new Error("Server tidak merespons. Periksa URL dan deployment Apps Script.")), 15000);
    function finish(error, data) {
      clearTimeout(timeout);
      try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
      script.remove();
      error ? reject(error) : resolve(data);
    }
    window[callbackName] = (data) => finish(null, data);
    const url = new URL(API_URL);
    Object.entries({ ...params, callback: callbackName }).forEach(([key, value]) => url.searchParams.set(key, value ?? ""));
    script.onerror = () => finish(new Error("Gagal menghubungi Apps Script. Periksa URL deployment."));
    script.src = url.toString();
    document.body.appendChild(script);
  });
}
async function loadWishes() {
  const container = $("wishesList");
  if (!API_URL || API_URL.includes("PASTE_URL")) {
    container.innerHTML = '<p class="muted">Ucapan akan tampil setelah koneksi Spreadsheet diatur.</p>';
    return;
  }
  try {
    const result = await jsonp({ action: "list" });
    container.replaceChildren();
    if (!result.ok || !result.data || result.data.length === 0) {
      container.innerHTML = '<p class="muted">Belum ada ucapan. Jadilah yang pertama mengirim doa.</p>';
      return;
    }
    result.data.slice().reverse().forEach((wish) => {
      const card = document.createElement("article"); card.className = "wish-card";
      const name = document.createElement("strong"); name.textContent = wish.name || "Tamu";
      const meta = document.createElement("div"); meta.className = "wish-meta"; meta.textContent = `${wish.attendance || "Belum konfirmasi"}${wish.count ? " · " + wish.count + " orang" : ""}`;
      const message = document.createElement("p"); message.textContent = wish.message || "";
      card.append(name, meta, message); container.append(card);
    });
  } catch (error) {
    container.innerHTML = '<p class="muted">Ucapan belum dapat dimuat. Periksa konfigurasi Apps Script.</p>';
    console.error(error);
  }
}
$("rsvpForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = $("rsvpStatus");
  const button = $("rsvpSubmit");
  button.disabled = true; button.textContent = "Mengirim...";
  status.textContent = "";
  const payload = {
    action: "submit",
    name: $("rsvpName").value.trim(),
    attendance: $("rsvpAttendance").value,
    count: $("rsvpCount").value,
    message: $("rsvpMessage").value.trim()
  };
  if (!payload.name || !payload.attendance) {
    status.textContent = "Nama dan konfirmasi kehadiran wajib diisi.";
    button.disabled = false; button.textContent = "Kirim Konfirmasi"; return;
  }
  try {
    const result = await jsonp(payload);
    if (!result.ok) throw new Error(result.message || "Gagal menyimpan data.");
    status.textContent = "Terima kasih! Konfirmasi dan ucapan Anda berhasil dikirim.";
    $("rsvpMessage").value = "";
    await loadWishes();
  } catch (error) {
    status.textContent = error.message || "Maaf, data belum berhasil dikirim.";
  } finally {
    button.disabled = false; button.textContent = "Kirim Konfirmasi";
  }
});
render();
