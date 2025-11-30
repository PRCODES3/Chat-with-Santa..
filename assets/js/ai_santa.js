// HYBRID MODE: client key today, server proxy later

// 1) Client-side key (fast to launch, not as secure)
// Put your own key here ONLY for testing / low-stakes use.
let OPENAI_API_KEY = ""; // <--- add for immediate use (testing)

// 2) Optional server proxy endpoint (recommended for selling)
const SERVER_PROXY_URL = ""; // e.g. "/api/santa-chat"

// SYSTEM PROMPT for Santa-Deep
const SANTA_SYSTEM_PROMPT = `
You are Santa Claus with a deep, warm, magical voice and personality.
You speak slowly, kindly, and encouragingly to kids.
You never promise specific gifts, never ask for private data, and keep everything family-friendly.
You refer to yourself as Santa, use "Ho Ho Ho" sometimes, and always make the child feel special.
`;

// ===== GPT-POWERED SANTA CHAT (TEXT) =====
async function sendSantaChat() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  const log = document.getElementById("chat-log");
  addChatMessage("You", text, "me");
  input.value = "";

  addChatMessage("Santa", "Ho Ho Ho… let me think about that for a moment…", "santa");

  try {
    let reply;
    if (SERVER_PROXY_URL) {
      reply = await santaChatViaServer(text);
    } else {
      reply = await santaChatClientSide(text);
    }
    // replace placeholder
    log.lastChild.textContent = `Santa: ${reply}`;
  } catch (err) {
    console.error(err);
    log.lastChild.textContent = "Santa: Ho Ho Ho… I’m having trouble connecting right now.";
  }
}

function addChatMessage(sender, text, cssClass) {
  const log = document.getElementById("chat-log");
  const div = document.createElement("div");
  div.className = "chat-msg " + (cssClass || "");
  div.textContent = `${sender}: ${text}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// CLIENT-SIDE CHAT (uses fetch directly to OpenAI)
async function santaChatClientSide(userText) {
  if (!OPENAI_API_KEY) throw new Error("No OpenAI API key set in ai_santa.js");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SANTA_SYSTEM_PROMPT },
        { role: "user", content: userText }
      ]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "Ho Ho Ho! Santa loves your message!";
}

// SERVER-PROXY CHAT (for when you add backend later)
async function santaChatViaServer(userText) {
  const res = await fetch(SERVER_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: userText, character: currentCharacter })
  });
  const data = await res.json();
  return data.reply || "Ho Ho Ho! Santa loves your message!";
}

// ===== AI VOICE CALL HOOKS (Hybrid Mode) =====

// Today: we simulate with text + browser speech
// Later: you (or your dev) replace this with OpenAI Realtime voice streaming.

let calling = false;

async function startSantaCall() {
  const status = document.getElementById("call-status");
  if (calling) return;
  calling = true;
  status.textContent = "Connecting to Santa’s AI voice…";

  // Simple demo: ask one question via prompt
  const question = prompt("What would the child like to say to Santa?", "I’ve been good this year!");
  if (!question) {
    status.textContent = "Call cancelled.";
    calling = false;
    return;
  }

  try {
    let reply;
    if (SERVER_PROXY_URL) {
      reply = await santaChatViaServer(question);
    } else {
      reply = await santaChatClientSide(question);
    }

    status.textContent = "Santa is answering…";
    // Browser TTS as Santa-Deep stand-in:
    const utter = new SpeechSynthesisUtterance(reply);
    utter.pitch = 0.7; // deeper
    utter.rate = 0.9;  // slower
    utter.voice = speechSynthesis.getVoices().find(v => v.name.toLowerCase().includes("male")) || null;
    speechSynthesis.speak(utter);

    utter.onend = () => {
      status.textContent = "Santa finished speaking. Call ended.";
      calling = false;
    };
  } catch (e) {
    console.error(e);
    status.textContent = "Santa had trouble connecting. Try again.";
    calling = false;
  }
}

function endSantaCall() {
  speechSynthesis.cancel();
  calling = false;
  const status = document.getElementById("call-status");
  if (status) status.textContent = "Call ended.";
}
