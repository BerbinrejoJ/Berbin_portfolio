let portfolioData = null;
let intentsData = null;

const $ = (id) => document.getElementById(id);
const chatbot = $("chatbot");
const chatMessages = $("chatMessages");
const userInput = $("userInput");

async function loadData() {
  try {
    const [portfolioResponse, intentsResponse] = await Promise.all([
      fetch("./data/portfolio.json"),
      fetch("./data/intents.json")
    ]);

    if (!portfolioResponse.ok || !intentsResponse.ok) {
      throw new Error("Could not load chatbot data.");
    }

    portfolioData = await portfolioResponse.json();
    intentsData = await intentsResponse.json();

    renderPortfolio();
  } catch (error) {
    console.error(error);
    addMessage("bot", "I couldn't load my portfolio data. Please refresh the page.");
  }
}

function renderPortfolio() {
  const skillsGrid = $("skillsGrid");
  Object.entries(portfolioData.skills).forEach(([category, skills]) => {
    const card = document.createElement("article");
    card.className = "card skill-card";
    card.innerHTML = `<h3>${escapeHtml(category)}</h3><p>${skills.map(escapeHtml).join(" • ")}</p>`;
    skillsGrid.appendChild(card);
  });

  const projectsGrid = $("projectsGrid");
  portfolioData.projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "card project-card";
    card.innerHTML = `
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tags">${project.technologies.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      <ul>${project.details.map(d => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
    `;
    projectsGrid.appendChild(card);
  });

  $("certificationsList").innerHTML = portfolioData.certifications
    .map(c => `<div class="cert-item">${escapeHtml(c)}</div>`).join("");
}

function normalize(text) {
  return text.toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findIntent(question) {
  const q = normalize(question);
  let best = { score: 0, intent: null };

  for (const intent of intentsData.intents) {
    let score = 0;
    for (const pattern of intent.patterns) {
      const p = normalize(pattern);
      if (q === p) score += 100;
      if (q.includes(p)) score += 45;
      const qWords = new Set(q.split(" "));
      const pWords = p.split(" ");
      score += pWords.filter(w => w.length > 2 && qWords.has(w)).length * 7;
    }
    if (score > best.score) best = { score, intent };
  }
  return best.score >= 7 ? best.intent : null;
}

function answerFor(key) {
  const p = portfolioData;

  if (key === "about") return p.personal.summary;
  if (key === "skills") {
    return Object.entries(p.skills).map(([k,v]) => `${k}: ${v.join(", ")}`).join("\n");
  }
  if (key === "education") {
    return p.education.map(e => `${e.institution}\n${e.degree} — ${e.period}${e.score ? ` — ${e.score}` : ""}`).join("\n\n");
  }
  if (key === "projects") {
    return p.projects.map(x => `${x.name} (${x.technologies.join(", ")})\n${x.description}`).join("\n\n");
  }
  if (key === "certifications") return p.certifications.map((x,i) => `${i+1}. ${x}`).join("\n");
  if (key === "achievements") return `${p.coding_profiles.SkillRack}\n${p.coding_profiles.LeetCode}\n\n${p.achievements.join("\n")}`;
  if (key === "contact") return `Email: ${p.personal.email}\nPhone: ${p.personal.phone}\nLinkedIn: ${p.personal.linkedin}\nGitHub: ${p.personal.github}`;
  if (key === "interests") return p.interests.join(", ");
  if (key === "languages") return p.languages_known.join(", ");
  if (key === "soft_skills") return p.soft_skills.join(", ");
  return null;
}

function sendQuestion(question) {
  const text = question.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  const intent = findIntent(text);
  let answer = "I don't have that information in Berbin's portfolio yet. Try asking about his skills, education, projects, certifications, achievements, interests, or contact details.";

  if (intent?.answer) answer = intent.answer;
  else if (intent?.answer_key) answer = answerFor(intent.answer_key);

  setTimeout(() => addMessage("bot", answer), 250);
}

function addMessage(type, text) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

$("openChatbot").addEventListener("click", () => {
  chatbot.style.display = "flex";
  userInput.focus();
});
$("closeChatbot").addEventListener("click", () => chatbot.style.display = "none");
$("sendMessage").addEventListener("click", () => sendQuestion(userInput.value));
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendQuestion(userInput.value);
});
document.querySelectorAll(".suggestions button").forEach(btn => {
  btn.addEventListener("click", () => sendQuestion(btn.dataset.question));
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

loadData();
