// Same Web3Forms integration used on the Calyco Paints site
// (src/services/siteVisitSubmit.js) — client-side, no backend required.
const WEB3FORMS_KEY = "52da37be-e058-4a07-92c1-a07f95c25f6b";
const TO_EMAIL = "calycopaints@gmail.com";

export async function submitToWeb3Forms(subject: string, message: string, fromName = "Calyco Interiors") {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      to: TO_EMAIL,
      subject,
      from_name: fromName,
      message
    })
  });
  if (!res.ok) throw new Error(`Web3Forms ${res.status}`);
  return res.json();
}
