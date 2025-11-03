// Parse "money-like" input: allow commas, reject negatives/invalids.
function parseMoney(raw) {
  const cleaned = (raw ?? "").trim().replace(/,/g, "");
  if (cleaned === "") throw new Error("Please enter a value.");
  const val = Number(cleaned);
  if (!Number.isFinite(val)) throw new Error("Please enter a valid number (e.g., 50000 or 50,000).");
  if (val < 0) throw new Error("Values cannot be negative.");
  return val;
}

// GBP formatter (2 dp).
const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function computeMonthlyTakehome(income, taxDue) {
  if (taxDue > income) throw new Error("Tax due cannot exceed income.");
  const netAnnual = income - taxDue;
  const monthly = netAnnual / 12;
  return { netAnnual, monthly };
}

function showError(msg) {
  document.getElementById("result").textContent = "";
  document.getElementById("error").textContent = msg;
}

function showResult(netAnnual, monthly) {
  document.getElementById("error").textContent = "";
  document.getElementById("result").innerHTML =
    `Net annual income: <strong>${gbp.format(netAnnual)}</strong><br>` +
    `Monthly income: <strong>${gbp.format(monthly)}</strong>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const incomeEl = document.getElementById("income");
  const taxEl = document.getElementById("taxDue");
  const btn = document.getElementById("calcBtn");

  const doCalc = () => {
    try {
      const income = parseMoney(incomeEl.value);
      const tax = parseMoney(taxEl.value);
      const { netAnnual, monthly } = computeMonthlyTakehome(income, tax);
      showResult(netAnnual, monthly);
    } catch (e) {
      showError(e.message || String(e));
    }
  };

  btn.addEventListener("click", doCalc);
  [incomeEl, taxEl].forEach(el => el.addEventListener("keydown", e => {
    if (e.key === "Enter") doCalc();
  }));
});
