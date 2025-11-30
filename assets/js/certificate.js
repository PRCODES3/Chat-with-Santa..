/* ============================================================
   Certificate Generator
   ============================================================ */

function generateCertificate() {
    const name = document.getElementById("child-name").value.trim();
    const output = document.getElementById("certificate-output");

    if (!name) {
        alert("Enter a name!");
        return;
    }

    output.innerHTML = `
        <div class="certificate">
            <h1>🎅 Nice List Certificate</h1>
            <h2>Awarded to:</h2>
            <h1 class="cert-name">${name}</h1>
            <p>For exceptional kindness and holiday spirit!</p>
            <h3>— Santa Claus</h3>
        </div>
    `;
}
