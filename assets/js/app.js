// Simple screen router
function showScreen(name) {
  // top-level screens
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  if (name === "landing") {
    document.getElementById("landing").classList.add("active");
    return;
  }
  document.getElementById("app-shell").classList.add("active");

  // tabs
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const tab = document.querySelector(`.tab[data-tab='${name}']`);
  if (tab) tab.classList.add("active");

  // app screens
  document.querySelectorAll(".app-screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(`screen-${name}`);
  if (screen) screen.classList.add("active");
}

function openAppFromLanding() {
  showScreen("home");
}

function scrollToPricing() {
  document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
}

// PAYWALL
function openCheckout(plan) {
  // Replace these with your real Stripe Checkout links
  const links = {
    elf: "https://buy.stripe.com/...",
    northpole: "https://buy.stripe.com/...",
    lifetime: "https://buy.stripe.com/..."
  };
  const url = links[plan];
  if (!url) {
    alert("Stripe link not set yet.");
    return;
  }
  window.open(url, "_blank");
}

function openPaywall() {
  document.getElementById("paywall").classList.remove("hidden");
}
function closePaywall() {
  document.getElementById("paywall").classList.add("hidden");
}

// PARENT GATE
function showParentModal() {
  document.getElementById("parent-modal").classList.remove("hidden");
}
function closeParentModal() {
  document.getElementById("parent-modal").classList.add("hidden");
}

function checkParentGate() {
  const val = document.getElementById("parent-answer").value.trim();
  const err = document.getElementById("parent-error");
  if (val !== "10") {
    err.textContent = "That answer is not correct.";
    return;
  }
  err.textContent = "";
  document.getElementById("parent-panel").classList.remove("hidden");
}

// CERTIFICATE
function generateCertificate() {
  const name = document.getElementById("cert-name").value || "Super Star";
  const canvas = document.getElementById("cert-canvas");
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // border
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // text
  ctx.fillStyle = "#b22222";
  ctx.font = "48px serif";
  ctx.fillText("Nice List Certificate", 180, 160);

  ctx.fillStyle = "#3b1a16";
  ctx.font = "36px serif";
  ctx.fillText(name, 320, 300);

  ctx.font = "24px serif";
  ctx.fillText("Santa is very proud of you!", 220, 360);

  document.getElementById("download-cert-btn").classList.remove("hidden");
}

function downloadCertificate() {
  const canvas = document.getElementById("cert-canvas");
  const link = document.createElement("a");
  link.download = "nice-list-certificate.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// CHARACTER SELECTOR
let currentCharacter = "santa";
function setCharacter(char) {
  currentCharacter = char;
  alert(`Character set to: ${char}. Santa’s responses will match this style.`);
}
