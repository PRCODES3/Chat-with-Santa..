/* ============================================================
   ChatwithSanta.ai — Santa Chat Engine (GPT)
   ============================================================ */

async function sendSantaMessage() {
    const input = document.getElementById("chat-input");
    const output = document.getElementById("chat-output");

    const text = input.value.trim();
    if (!text) return;

    output.innerHTML += `<div class="child-msg">${text}</div>`;
    input.value = "";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are Santa Claus. Speak warmly and magically." },
                { role: "user", content: text }
            ]
        })
    });

    const data = await res.json();
    const santa = data.choices[0].message.content;

    output.innerHTML += `<div class="santa-msg">${santa}</div>`;
}
