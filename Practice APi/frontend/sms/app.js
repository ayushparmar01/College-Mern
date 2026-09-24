/* =====================================================
   Practice API Console
   Same-origin: Express serves this folder, so paths are relative.
   ===================================================== */
const API = "";

/* ---------- Small helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
};

function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  $("#toasts").appendChild(el);
  setTimeout(() => el.classList.add("out"), 3200);
  setTimeout(() => el.remove(), 3700);
}

function setBusy(btn, busy) {
  if (!btn) return;
  btn.disabled = busy;
  btn.classList.toggle("busy", busy);
}

// Shows a success/error message inside any card/form that has a .form-msg
function formMsg(container, ok, text) {
  const el = $(".form-msg", container);
  el.textContent = text;
  el.className = `form-msg ${ok ? "ok" : "bad"}`;
}

/* ---------- API wrapper ---------- */
function inspect(method, path, status, ms, data) {
  const meta = $("#inspectMeta");
  meta.textContent = `${method} ${path} · ${status || "NETWORK ERROR"} · ${ms} ms`;
  meta.className = `meta ${status >= 200 && status < 300 ? "ok" : "bad"}`;
  $("#inspectBody").textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

async function api(path, { method = "GET", body, auth = false, silent = false } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = store.get("accessToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const t0 = performance.now();
  let status = 0;
  let data;
  try {
    const res = await fetch(API + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    status = res.status;
    const text = await res.text();
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  } catch (err) {
    data = {
      success: false,
      message: "Cannot reach the server. Is it running on port 5000?",
      error: err.message,
    };
  }

  if (!silent) inspect(method, path, status, Math.round(performance.now() - t0), data);
  return { ok: status >= 200 && status < 300, status, data };
}

function errText(res) {
  const d = res.data;
  if (res.status === 0) return d.message;
  if (d && typeof d === "object") {
    if (Array.isArray(d.errors) && d.errors.length) {
      return d.errors.map((e) => `${e.field}: ${e.message}`).join(", ");
    }
    const parts = [d.message, d.error && d.error !== d.message ? d.error : null].filter(Boolean);
    if (parts.length) return parts.join(" — ");
  }
  return `Request failed (${res.status})`;
}

/* ---------- Tabs ---------- */
function showTab(name) {
  $$(".tab").forEach((t) => {
    const isActive = t.dataset.tab === name;
    t.classList.toggle("text-indigo-600", isActive);
    t.classList.toggle("border-indigo-600", isActive);
    t.classList.toggle("text-slate-500", !isActive);
    t.classList.toggle("border-transparent", !isActive);
  });
  $$(".panel").forEach((p) => p.classList.toggle("active", p.id === `tab-${name}`));
  if (name === "analytics") loadAnalytics();
  if (name === "cards") loadCards();
}
$("#tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (btn) showTab(btn.dataset.tab);
});

/* ---------- Course name lookup ----------
   The practice collection stores `course` as an ObjectId and the backend has no
   "get courses" route, so we remember the titles of courses created from this UI. */
function courseText(course) {
  const id = String(course ?? "");
  const names = store.get("courseNames", {});
  if (names[id]) return names[id];
  if (/^[a-f0-9]{24}$/i.test(id)) return `#${id.slice(-6)}`;
  return id || "—";
}
function courseTag(course) {
  const id = String(course ?? "");
  const known = !!store.get("courseNames", {})[id];
  const isId = /^[a-f0-9]{24}$/i.test(id);
  return `<span class="tag ${!known && isId ? "dim" : ""}" title="${esc(id)}">${esc(courseText(course))}</span>`;
}

/* =====================================================
   STUDENTS
   ===================================================== */
const FILTERS = {
  all: () => "/api/practice/students",
  older21: () => "/api/practice/students/older21",
  mj: () => "/api/practice/students/mj",
  "name-a": () => "/api/practice/students/name-a",
  sorted: () => `/api/practice/students/sorted-by-age?order=${$("#sortOrder").value}`,
};

let activeFilter = "all";
let students = [];
let emptyMessage = "No students found.";
let studentsReq = 0;

function setState(kind, msg = "") {
  const el = $("#studentsState");
  el.hidden = !kind;
  el.className = `state ${kind}`;
  el.innerHTML = kind === "loading" ? '<span class="spinner"></span> Loading students…' : esc(msg);
}

function renderStudents() {
  const q = $("#search").value.trim().toLowerCase();
  const rows = students.filter(
    (s) => !q || [s.name, s.email, s.branch].some((v) => String(v ?? "").toLowerCase().includes(q))
  );

  $("#studentCount").textContent = rows.length;
  $("#studentsBody").innerHTML = rows
    .map(
      (s, i) => `
      <tr>
        <td class="num">${i + 1}</td>
        <td><div class="person"><span class="avatar">${esc((s.name || "?")[0].toUpperCase())}</span><strong>${esc(s.name)}</strong></div></td>
        <td>${esc(s.email)}</td>
        <td>${esc(s.age)}</td>
        <td><span class="tag">${esc(s.branch)}</span></td>
        <td>${courseTag(s.course)}</td>
      </tr>`
    )
    .join("");

  if (rows.length) setState("");
  else setState("empty", students.length ? "No loaded students match your search." : emptyMessage);
}

async function loadStudents() {
  const seq = ++studentsReq;
  const path = FILTERS[activeFilter]();
  $("#endpointLabel").textContent = `GET ${path}`;
  setState("loading");

  const res = await api(path);
  if (seq !== studentsReq) return; // a newer request replaced this one

  if (res.ok && Array.isArray(res.data?.data)) {
    students = res.data.data;
    emptyMessage = "No students found.";
    renderStudents();
  } else {
    students = [];
    $("#studentCount").textContent = 0;
    $("#studentsBody").innerHTML = "";
    // 404 from this API just means "no matches", so show it as an empty state
    setState(res.status === 404 ? "empty" : "error", errText(res));
  }
}

$("#filterChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeFilter = chip.dataset.filter;
  $$(".chip").forEach((c) => c.classList.toggle("active", c === chip));
  $("#sortOrder").hidden = activeFilter !== "sorted";
  loadStudents();
});
$("#sortOrder").addEventListener("change", loadStudents);
$("#refreshBtn").addEventListener("click", loadStudents);
$("#search").addEventListener("input", renderStudents);

/* =====================================================
   ANALYTICS
   ===================================================== */
async function loadBars(path, target, pick, fmt) {
  const box = $(target);
  box.innerHTML = '<div class="state"><span class="spinner"></span> Loading…</div>';

  const res = await api(path);
  const rows = res.data?.data;
  if (!res.ok || !Array.isArray(rows)) {
    box.innerHTML = `<div class="state error">${esc(errText(res))}</div>`;
    return;
  }
  if (!rows.length) {
    box.innerHTML = '<div class="state">No data yet.</div>';
    return;
  }

  const max = Math.max(...rows.map(pick), 1);
  box.innerHTML = rows
    .map((r) => {
      const v = pick(r);
      return `
        <div class="bar-row">
          <span>${courseTag(r._id)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${((v / max) * 100).toFixed(1)}%"></div></div>
          <span class="bar-value">${fmt(v)}</span>
        </div>`;
    })
    .join("");
}

function loadAnalytics() {
  loadBars("/api/practice/students/count-by-course", "#countBars", (r) => r.count, (v) => v);
  loadBars("/api/practice/students/average-age-by-course", "#ageBars", (r) => r.averageAge, (v) => v.toFixed(1));
}
$("#analyticsRefresh").addEventListener("click", loadAnalytics);

/* =====================================================
   FORMS (create course / student / teacher, auth)
   ===================================================== */
function bindForm(selector, handler) {
  const form = $(selector);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", form);
    setBusy(btn, true);
    try {
      await handler(Object.fromEntries(new FormData(form)), form);
    } finally {
      setBusy(btn, false);
    }
  });
}

async function createRecord(form, path, body, label) {
  const res = await api(path, { method: "POST", body });
  if (res.ok) {
    formMsg(form, true, `${label} created successfully.`);
    form.reset();
    toast(`${label} created`, "success");
  } else {
    formMsg(form, false, errText(res));
  }
  return res;
}

bindForm("#courseForm", async (data, form) => {
  const res = await createRecord(form, "/api/courses", data, "Course");
  if (res.ok && res.data?.data?._id) {
    const course = res.data.data;
    const names = store.get("courseNames", {});
    names[course._id] = course.title;
    store.set("courseNames", names);
    formMsg(form, true, `Course “${course.title}” created. ID: ${course._id}`);
  }
});

bindForm("#studentForm", (data, form) =>
  createRecord(form, "/api/students", { ...data, age: Number(data.age) }, "Student")
);

bindForm("#teacherForm", (data, form) =>
  createRecord(form, "/api/teachers/create", { ...data, experience: Number(data.experience) }, "Teacher")
);

/* =====================================================
   AUTH & USERS
   ===================================================== */
function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch { return null; }
}

function renderSession() {
  const user = store.get("user");
  const token = store.get("accessToken");
  const pill = $("#userPill");

  pill.textContent = user ? `${user.name} · ${user.role}` : "Signed out";
  pill.classList.toggle("on", !!user);
  $$(".needs-auth").forEach((b) => (b.disabled = !user));

  if (!user) {
    $("#sessionBox").innerHTML = '<p class="muted">You are not signed in. Log in to receive your tokens.</p>';
    return;
  }

  const claims = token ? decodeJwt(token) : null;
  const exp = claims?.exp ? new Date(claims.exp * 1000) : null;
  const expired = exp && exp < new Date();
  $("#sessionBox").innerHTML = `
    <dl class="kv">
      <dt>Name</dt><dd>${esc(user.name)}</dd>
      <dt>Email</dt><dd>${esc(user.email)}</dd>
      <dt>Role</dt><dd>${esc(user.role)}</dd>
      <dt>Access token</dt>
      <dd class="${expired ? "bad" : "ok"}">${exp ? (expired ? "Expired" : "Valid until " + esc(exp.toLocaleTimeString())) : "Stored"}</dd>
    </dl>`;
}

function clearSession() {
  ["accessToken", "refreshToken", "user"].forEach(store.remove);
  renderSession();
}

bindForm("#registerForm", async (data, form) => {
  const res = await api("/api/auth/register", { method: "POST", body: data });
  if (res.ok) {
    formMsg(form, true, "Account created. You can log in now.");
    form.reset();
    toast("Registered successfully", "success");
  } else {
    formMsg(form, false, errText(res));
  }
});

bindForm("#loginForm", async (data, form) => {
  const res = await api("/api/auth/login", { method: "POST", body: data });
  if (res.ok && res.data?.accessToken) {
    store.set("accessToken", res.data.accessToken);
    store.set("refreshToken", res.data.refreshToken);
    store.set("user", res.data.user);
    form.reset();
    formMsg(form, true, res.data.message || "Login successful");
    renderSession();
    toast(`Welcome, ${res.data.user.name}`, "success");
  } else {
    formMsg(form, false, errText(res));
  }
});

$("#profileBtn").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  setBusy(btn, true);
  const res = await api("/api/auth/profile", { auth: true });
  setBusy(btn, false);
  formMsg($("#sessionCard"), res.ok, res.ok ? `Token verified. Role in token: ${res.data.user?.role}` : errText(res));
});

$("#logoutBtn").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  setBusy(btn, true);
  const res = await api("/api/auth/logout", {
    method: "POST",
    auth: true,
    body: { refreshToken: store.get("refreshToken") },
  });
  setBusy(btn, false);
  clearSession(); // always clear locally, even if the token had already expired
  formMsg($("#sessionCard"), res.ok, res.ok ? "Logged out." : `Signed out locally. Server said: ${errText(res)}`);
});

async function loadUsers() {
  const btn = $("#usersBtn");
  const state = $("#usersState");
  setBusy(btn, true);
  state.hidden = false;
  state.className = "state";
  state.innerHTML = '<span class="spinner"></span> Loading users…';

  const res = await api("/api/users");
  setBusy(btn, false);

  const users = res.data?.users;
  if (!res.ok || !Array.isArray(users)) {
    $("#usersBody").innerHTML = "";
    state.className = "state error";
    state.textContent = errText(res);
    return;
  }

  $("#usersBody").innerHTML = users
    .map(
      (u) => `
      <tr>
        <td><div class="person"><span class="avatar">${esc((u.name || "?")[0].toUpperCase())}</span><strong>${esc(u.name)}</strong></div></td>
        <td>${esc(u.email)}</td>
        <td><span class="tag role-${esc(u.role)}">${esc(u.role || "—")}</span></td>
      </tr>`
    )
    .join("");

  state.hidden = users.length > 0;
  if (!users.length) state.textContent = "No users registered yet.";
}
$("#usersBtn").addEventListener("click", loadUsers);

/* =====================================================
   TOOLS
   ===================================================== */
$("#indexBtn").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  setBusy(btn, true);
  const res = await api("/api/practice/students/create-email", { method: "POST" });
  setBusy(btn, false);
  formMsg($("#indexCard"), res.ok, res.ok ? `${res.data.message} (${res.data.index})` : errText(res));
});

bindForm("#explainForm", async (data, form) => {
  const res = await api(`/api/practice/students/explain-email-query?email=${encodeURIComponent(data.email)}`);
  formMsg(form, res.ok, res.ok ? `${res.data.message}: ${res.data.email}` : errText(res));
});

/* =====================================================
   STUDENT CARDS (qualification & academics — stored locally)
   ===================================================== */
function recordsKey(id) { return `studentRecords:${id}`; }

function getRecords(id) {
  return store.get(recordsKey(id), { qualifications: [], academics: [] });
}
function saveRecords(id, data) { store.set(recordsKey(id), data); }

function gpaClass(gpa) { return Number(gpa) >= 7 ? "gpa-good" : "gpa-low"; }

function cardHtml(s) {
  const rec = getRecords(s._id);

  const qualHtml = rec.qualifications.length
    ? rec.qualifications.map((q, i) => `
        <li>
          <span>${esc(q.degree)} — ${esc(q.institution)} (${esc(q.year)})</span>
          <button class="del" data-kind="qualifications" data-sid="${s._id}" data-i="${i}" title="Remove">✕</button>
        </li>`).join("")
    : '<li class="mini-empty">No qualifications added yet.</li>';

  const acadHtml = rec.academics.length
    ? rec.academics.map((a, i) => `
        <li>
          <span>Sem ${esc(a.semester)} — <span class="${gpaClass(a.gpa)}">${esc(a.gpa)} GPA</span></span>
          <button class="del" data-kind="academics" data-sid="${s._id}" data-i="${i}" title="Remove">✕</button>
        </li>`).join("")
    : '<li class="mini-empty">No academic records yet.</li>';

  return `
    <div class="student-card" data-sid="${s._id}">
      <div class="student-card-head">
        <span class="avatar">${esc((s.name || "?")[0].toUpperCase())}</span>
        <div>
          <h4>${esc(s.name)}</h4>
          <p>${esc(s.email)}</p>
        </div>
      </div>
      <div class="mini-stats">
        <span class="tag">Age ${esc(s.age)}</span>
        <span class="tag">${esc(s.branch)}</span>
        ${courseTag(s.course)}
      </div>

      <strong>Qualifications</strong>
      <ul class="mini-list qual-list">${qualHtml}</ul>
      <form class="mini-form qual-form">
        <input name="degree" placeholder="Degree (B.Tech)" required />
        <input name="institution" placeholder="Institution" required />
        <input name="year" placeholder="Year" required style="grid-column:1/2" />
        <button class="btn" type="submit" style="grid-column:2/4">+ Add</button>
      </form>

      <strong>Academics</strong>
      <ul class="mini-list acad-list">${acadHtml}</ul>
      <form class="mini-form acad-form">
        <input name="semester" placeholder="Semester" required />
        <input name="gpa" type="number" step="0.01" min="0" max="10" placeholder="GPA (0-10)" required />
        <button class="btn" type="submit">+ Add</button>
      </form>
    </div>`;
}

let cardStudents = [];

function renderCards() {
  const q = $("#cardsSearch").value.trim().toLowerCase();
  const rows = cardStudents.filter(
    (s) => !q || [s.name, s.email, s.branch].some((v) => String(v ?? "").toLowerCase().includes(q))
  );
  $("#cardsGrid").innerHTML = rows.map(cardHtml).join("");
  const state = $("#cardsState");
  state.hidden = rows.length > 0;
  if (!rows.length) state.textContent = cardStudents.length ? "No students match your search." : "No students found.";
}

async function loadCards() {
  const state = $("#cardsState");
  state.hidden = false;
  state.className = "state";
  state.innerHTML = '<span class="spinner"></span> Loading students…';

  const res = await api("/api/practice/students");
  if (res.ok && Array.isArray(res.data?.data)) {
    cardStudents = res.data.data;
    renderCards();
  } else {
    cardStudents = [];
    $("#cardsGrid").innerHTML = "";
    state.className = "state error";
    state.textContent = errText(res);
  }
}

$("#cardsRefresh").addEventListener("click", loadCards);
$("#cardsSearch").addEventListener("input", renderCards);

// Add qualification / academic record (event delegation, since cards are re-rendered)
$("#cardsGrid").addEventListener("submit", (e) => {
  const form = e.target;
  if (!form.matches(".qual-form, .acad-form")) return;
  e.preventDefault();

  const sid = form.closest(".student-card").dataset.sid;
  const rec = getRecords(sid);
  const data = Object.fromEntries(new FormData(form));

  if (form.matches(".qual-form")) rec.qualifications.push(data);
  else rec.academics.push(data);

  saveRecords(sid, rec);
  renderCards();
  toast(form.matches(".qual-form") ? "Qualification added" : "Academic record added", "success");
});

// Remove a qualification / academic record
$("#cardsGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".del");
  if (!btn) return;
  const { kind, sid, i } = btn.dataset;
  const rec = getRecords(sid);
  rec[kind].splice(Number(i), 1);
  saveRecords(sid, rec);
  renderCards();
});

/* =====================================================
   SERVER STATUS + INIT
   ===================================================== */
// A cheap route that never touches the database. Any HTTP response means the server is up.
async function pingServer() {
  const res = await api("/api/practice/students/explain-email-query?email=ping", { silent: true });
  const online = res.status !== 0;
  $("#serverDot").className = `dot ${online ? "on" : "off"}`;
  $("#serverText").textContent = online ? "API online" : "API offline";
}

renderSession();
pingServer();
setInterval(pingServer, 15000);
loadStudents();