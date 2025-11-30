/* ============================================================
   Parent Lock / PIN
   ============================================================ */

let PARENT_PIN = "1234"; // You can change this

function unlockParentArea() {
    const pin = prompt("Enter parent PIN:");
    if (pin === PARENT_PIN) {
        window.location.href = "parents/index.html";
    } else {
        alert("Incorrect PIN");
    }
}
