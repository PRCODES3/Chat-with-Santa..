/* ============================================================
   ChatwithSanta.ai — REALTIME SANTA VOICE ENGINE
   Mode: Hybrid (Client-side key today, server later with no changes)
   Voice: Santa-Deep (slow, magical, warm)
   ============================================================ */

let santaConnection = null;
let santaStream = null;

// PUT YOUR API KEY HERE (TEMPORARY — works on GitHub Pages)
let OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

async function callSantaAI() {
    const status = document.getElementById("call-status");
    status.innerText = "🎅 Connecting to Santa…";

    if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
        alert("⚠️ Add your OpenAI API key inside assets/js/ai.js");
        return;
    }

    try {
        santaConnection = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime");

        santaConnection.onopen = () => {
            status.innerText = "🎅 Santa is joining the call…";

            // Send authentication
            santaConnection.send(JSON.stringify({
                type: "session.authenticate",
                data: { api_key: OPENAI_API_KEY }
            }));

            // Apply Santa-Deep voice
            santaConnection.send(JSON.stringify({
                type: "session.update",
                data: {
                    voice: "santa-deep",
                    instructions: `
                        You are Santa Claus. 
                        Speak warm, magical, slow, and jolly.
                        Address the child by name if provided.
                        Add small Ho Ho Ho moments naturally.
                    `
                }
            }));

            // Begin voice conversation
            santaConnection.send(JSON.stringify({
                type: "response.create",
                data: {
                    modalities: ["audio"],
                    audio: { voice: "santa-deep" },
                    instructions: "Start the conversation as Santa."
                }
            }));
        };

        santaConnection.onmessage = async (event) => {
            const msg = JSON.parse(event.data);

            // stream audio to child
            if (msg.type === "response.audio.delta") {
                if (!santaStream) {
                    santaStream = new AudioContext();
                    santaStream.destination;
                }
                const audioBuffer = await santaStream.decodeAudioData(msg.delta);
                const source = santaStream.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(santaStream.destination);
                source.start();
            }
        };

    } catch (err) {
        status.innerText = "❌ Error connecting to Santa.";
        console.error(err);
    }
}

