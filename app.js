/* =========================================================
   SUBSCRIPTION LEDGER
   Shared JavaScript for all three pages
   ========================================================= */


/* -------------------------
   STORAGE
------------------------- */

const STORAGE_KEY = "subscription-ledger-data";


function getSubscriptions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Could not load subscriptions:", error);
    return [];
  }
}


function saveSubscriptions(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}


/* -------------------------
   DATE HELPERS
------------------------- */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];


function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}


function parseDate(value) {
  if (!value) return null;

  const parts = value.split("-").map(Number);

  return new Date(
    parts[0],
    parts[1] - 1,
    parts[2]
  );
}


function dateString(date) {
  const y = date.getFullYear();

  const m = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const d = String(
    date.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
}


function formatDate(value) {
  const d =
    typeof value === "string"
      ? parseDate(value)
      : value;

  if (!d) return "—";

  return (
    MONTHS[d.getMonth()] +
    " " +
    d.getDate() +
    ", " +
    d.getFullYear()
  );
}


function shortDate(value) {
  const d =
    typeof value === "string"
      ? parseDate(value)
      : value;

  if (!d) return "—";

  return (
    MONTHS[d.getMonth()] +
    " " +
    d.getDate()
  );
}


function daysBetween(a, b) {
  return Math.round(
    (b - a) / 86400000
  );
}


function daysUntil(dateStringValue) {
  const target = parseDate(dateStringValue);

  if (!target) return 999999;

  return daysBetween(
    today(),
    target
  );
}


/* -------------------------
   MONEY
------------------------- */

function money(value) {
  return "$" +
    Number(value || 0).toFixed(2);
}


function monthlyCost(sub) {
  const cost = Number(sub.cost) || 0;

  if (sub.cycle === "weekly") {
    return cost * 52 / 12;
  }

  if (sub.cycle === "yearly") {
    return cost / 12;
  }

  return cost;
}


function annualCost(sub) {
  return monthlyCost(sub) * 12;
}


/* -------------------------
   STATUS
------------------------- */

function unusedFor60Days(sub) {
  if (!sub.lastUsed) return false;

  const last = parseDate(sub.lastUsed);

  if (!last) return false;

  return daysBetween(
    last,
    today()
  ) >= 60;
}


function renewalStatus(sub) {
  const days = daysUntil(sub.next);

  if (days < 0) {
    return {
      label: "Past due",
      className: "warning"
    };
  }

  if (days <= 7) {
    return {
      label: `${days} days`,
      className: "warning"
    };
  }

  if (days <= 30) {
    return {
      label: `${days} days`,
      className: "warning"
    };
  }

  return {
    label: `${days} days`,
    className: ""
  };
}


/* -------------------------
   ESCAPE HTML
------------------------- */

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent =
    value == null ? "" : value;

  return div.innerHTML;
}


/* =========================================================
   HOME PAGE
========================================================= */

function renderHome() {
  const subscriptions = getSubscriptions();

  const monthly =
    subscriptions.reduce(
      (sum, sub) =>
        sum + monthlyCost(sub),
      0
    );

  const annual = monthly * 12;

  const unused =
    subscriptions.filter(
      unusedFor60Days
    );

  renderHomeStats(
    subscriptions,
    monthly,
    annual,
    unused
  );

  renderHomeUpcoming(
    subscriptions
  );

  renderHomeCategories(
    subscriptions
  );

  renderBudgetMessage(
    monthly,
    unused
  );
}


function renderHomeStats(
  subscriptions,
  monthly,
  annual,
  unused
) {
  const container =
    document.getElementById(
      "homeStats"
    );

  if (!container) return;

  container.innerHTML = `

    <div class="stat">
      <span class="stat-value">
        ${money(monthly)}
      </span>

      <span class="stat-label">
        Monthly spending
      </span>
    </div>

    <div class="stat">
      <span class="stat-value">
        ${money(annual)}
      </span>

      <span class="stat-label">
        Yearly spending
      </span>
    </div>

    <div class="stat">
      <span class="stat-value">
        ${subscriptions.length}
      </span>

      <span class="stat-label">
        Active subscriptions
      </span>
    </div>

    <div class="stat ${unused.length ? "red" : "green"}">
      <span class="stat-value">
        ${unused.length}
      </span>

      <span class="stat-label">
        Possible cuts
      </span>
    </div>

  `;
}


function renderHomeUpcoming(
  subscriptions
) {
  const container =
    document.getElementById(
      "homeUpcoming"
    );

  if (!container) return;

  const upcoming =
    [...subscriptions]
      .sort(
        (a, b) =>
          parseDate(a.next) -
          parseDate(b.next)
      )
      .slice(0, 5);

  if (!upcoming.length) {
    container.innerHTML = `
      <div class="empty-state">
        No subscriptions logged yet.
      </div>
    `;

    return;
  }

  container.innerHTML =
    upcoming.map(sub => {

      const days =
        daysUntil(sub.next);

      let dateText;

      if (days < 0) {
        dateText = "Past due";
      } else if (days === 0) {
        dateText = "Today";
      } else if (days === 1) {
        dateText = "Tomorrow";
      } else {
        dateText =
          `in ${days} days`;
      }

      return `

        <div class="home-charge">

          <div>

            <div class="charge-name">
              ${escapeHTML(sub.name)}
            </div>

            <div class="charge-date">
              ${dateText} ·
              ${shortDate(sub.next)}
            </div>

          </div>

          <div class="charge-cost">
            ${money(sub.cost)}
          </div>

        </div>

      `;

    }).join("");
}


function categoryTotals(
  subscriptions
) {
  const totals = {};

  subscriptions.forEach(sub => {

    const category =
      sub.category || "Other";

    totals[category] =
      (totals[category] || 0) +
      monthlyCost(sub);

  });

  return totals;
}


function renderHomeCategories(
  subscriptions
) {
  const container =
    document.getElementById(
      "homeCategories"
    );

  if (!container) return;

  const totals =
    categoryTotals(subscriptions);

  const entries =
    Object.entries(totals)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );

  if (!entries.length) {

    container.innerHTML = `
      <div class="empty-state">
        Add subscriptions to see
        your spending breakdown.
      </div>
    `;

    return;
  }

  const max = entries[0][1];

  container.innerHTML =
    entries.map(
      ([category, value]) => {

        const width =
          max > 0
            ? (value / max) * 100
            : 0;

        return `

          <div class="category-row">

            <div class="category-head">

              <span>
                ${escapeHTML(category)}
              </span>

              <span>
                ${money(value)}
              </span>

            </div>

            <div class="bar">

              <div
                class="bar-fill"
                style="width:${width}%"
              ></div>

            </div>

          </div>

        `;
      }
    ).join("");
}


function renderBudgetMessage(
  monthly,
  unused
) {
  const container =
    document.getElementById(
      "budgetMessage"
    );

  if (!container) return;

  if (!monthly) {

    container.innerHTML = `
      <p>
        Your ledger is empty.
        Add your first subscription
        to start tracking your budget.
      </p>
    `;

    return;
  }

  if (unused.length) {

    const possibleSavings =
      unused.reduce(
        (sum, sub) =>
          sum + monthlyCost(sub),
        0
      );

    container.innerHTML = `

      <p>
        You currently spend
        <strong>${money(monthly)}</strong>
        per month.
      </p>

      <p>
        You have
        <strong>${unused.length}</strong>
        subscription(s) that haven't
        been used in 60+ days.
      </p>

      <p>
        Reviewing them could potentially
        free up about
        <strong>${money(possibleSavings)}</strong>
        per month.
      </p>

    `;

  } else {

    container.innerHTML = `

      <p>
        Your current recurring commitment
        is <strong>${money(monthly)}</strong>
        per month.
      </p>

      <p>
        Nothing is currently flagged as
        unused for 60+ days.
      </p>

    `;
  }
}


/* =========================================================
   AUDIT PAGE
========================================================= */

let editingId = null;


function initAudit() {

  const form =
    document.getElementById(
      "subForm"
    );

  if (!form) return;

  const d = today();

  const todayLine =
    document.getElementById(
      "todayLine"
    );

  if (todayLine) {
    todayLine.textContent =
      formatDate(d);
  }

  const nextInput =
    document.getElementById(
      "f-next"
    );

  if (nextInput && !nextInput.value) {
    nextInput.value =
      dateString(d);
  }

  form.addEventListener(
    "submit",
    handleFormSubmit
  );

  const cancelButton =
    document.getElementById(
      "cancelEditBtn"
    );

  if (cancelButton) {
    cancelButton.addEventListener(
      "click",
      resetForm
    );
  }

  const ledger =
    document.getElementById(
      "ledgerList"
    );

  if (ledger) {
    ledger.addEventListener(
      "click",
      handleLedgerAction
    );
  }

  const clearButton =
    document.getElementById(
      "clearAllBtn"
    );

  if (clearButton) {
    clearButton.addEventListener(
      "click",
      clearAll
    );
  }

  setupStreamingField();

  renderAudit();
}


/* -------------------------
   STREAMING SITE FIELD
------------------------- */

function setupStreamingField() {

  const category =
    document.getElementById(
      "f-category"
    );

  const streamingField =
    document.getElementById(
      "streamingSiteField"
    );

  const streamingSite =
    document.getElementById(
      "f-streaming-site"
    );

  if (
    !category ||
    !streamingField ||
    !streamingSite
  ) {
    return;
  }

  function updateStreamingVisibility() {

    const isStreaming =
      category.value === "Streaming";

    streamingField.style.display =
      isStreaming
        ? "block"
        : "none";

    if (!isStreaming) {
      streamingSite.value = "";
    }
  }

  category.addEventListener(
    "change",
    updateStreamingVisibility
  );

  updateStreamingVisibility();
}


/* -------------------------
   FORM SUBMIT
------------------------- */

function handleFormSubmit(event) {

  event.preventDefault();

  const name =
    document.getElementById(
      "f-name"
    ).value.trim();

  const cost =
    Number(
      document.getElementById(
        "f-cost"
      ).value
    );

  const cycle =
    document.getElementById(
      "f-cycle"
    ).value;

  const next =
    document.getElementById(
      "f-next"
    ).value;

  const lastUsed =
    document.getElementById(
      "f-used"
    ).value;

  const category =
    document.getElementById(
      "f-category"
    ).value;

  const streamingInput =
    document.getElementById(
      "f-streaming-site"
    );

  const streamingSite =
    category === "Streaming" &&
    streamingInput
      ? streamingInput.value
      : "";

  const msg =
    document.getElementById(
      "formMsg"
    );

  if (
    !name ||
    !cost ||
    cost <= 0 ||
    !next
  ) {

    if (msg) {
      msg.textContent =
        "Please complete all required fields.";
    }

    return;
  }

  if (
    category === "Streaming" &&
    !streamingSite
  ) {

    if (msg) {
      msg.textContent =
        "Please select a streaming site.";
    }

    return;
  }

  const subscriptions =
    getSubscriptions();

  if (editingId !== null) {

    const index =
      subscriptions.findIndex(
        sub =>
          String(sub.id) ===
          String(editingId)
      );

    if (index !== -1) {

      subscriptions[index] = {
        ...subscriptions[index],

        name,
        cost,
        cycle,
        next,
        lastUsed,
        category,
        streamingSite
      };

    }

  } else {

    subscriptions.push({

      id:
        Date.now().toString(),

      name,
      cost,
      cycle,
      next,
      lastUsed,
      category,
      streamingSite

    });

  }

  saveSubscriptions(
    subscriptions
  );

  resetForm();

  renderAudit();

  if (typeof renderHome === "function") {
    renderHome();
  }

  if (typeof renderInsights === "function") {
    renderInsights();
  }
}


/* -------------------------
   RESET FORM
------------------------- */

function resetForm() {

  const form =
    document.getElementById(
      "subForm"
    );

  if (!form) return;

  editingId = null;

  form.reset();

  const nextInput =
    document.getElementById(
      "f-next"
    );

  if (nextInput) {
    nextInput.value =
      dateString(today());
  }

  const streamingField =
    document.getElementById(
      "streamingSiteField"
    );

  if (streamingField) {
    streamingField.style.display =
      "none";
  }

  const submitButton =
    document.getElementById(
      "submitBtn"
    );

  if (submitButton) {
    submitButton.textContent =
      "Add line";
  }

  const cancelButton =
    document.getElementById(
      "cancelEditBtn"
    );

  if (cancelButton) {
    cancelButton.style.display =
      "none";
  }

  const msg =
    document.getElementById(
      "formMsg"
    );

  if (msg) {
    msg.textContent = "";
  }
}


/* -------------------------
   RENDER AUDIT
------------------------- */

function renderAudit() {

  const subscriptions =
    getSubscriptions();

  renderAuditSummary(
    subscriptions
  );

  renderTimeline(
    subscriptions
  );

  renderLedger(
    subscriptions
  );
}


function renderAuditSummary(
  subscriptions
) {

  const container =
    document.getElementById(
      "summaryRow"
    );

  if (!container) return;

  const monthly =
    subscriptions.reduce(
      (sum, sub) =>
        sum + monthlyCost(sub),
      0
    );

  const annual =
    monthly * 12;

  container.innerHTML = `

    <div class="stat">
      <span class="stat-value">
        ${money(monthly)}
      </span>
      <span class="stat-label">
        Monthly
      </span>
    </div>

    <div class="stat">
      <span class="stat-value">
        ${money(annual)}
      </span>
      <span class="stat-label">
        Annual
      </span>
    </div>

    <div class="stat">
      <span class="stat-value">
        ${subscriptions.length}
      </span>
      <span class="stat-label">
        Subscriptions
      </span>
    </div>

  `;
}


/* -------------------------
   TIMELINE
------------------------- */

function renderTimeline(
  subscriptions
) {

  const container =
    document.getElementById(
      "timelineTrack"
    );

  if (!container) return;

  const now = today();

  const end = new Date(now);

  end.setDate(
    end.getDate() + 45
  );

  const upcoming =
    subscriptions
      .filter(sub => {

        const next =
          parseDate(sub.next);

        return (
          next &&
          next >= now &&
          next <= end
        );

      })
      .sort(
        (a, b) =>
          parseDate(a.next) -
          parseDate(b.next)
      );

  if (!upcoming.length) {

    container.innerHTML = `
      <div class="empty-state">
        No charges in the next 45 days.
      </div>
    `;

    return;
  }

  container.innerHTML =
    upcoming.map(sub => `

      <div class="timeline-item">

        <div class="timeline-date">
          ${shortDate(sub.next)}
        </div>

        <div class="timeline-name">
          ${escapeHTML(sub.name)}
        </div>

        <div class="timeline-cost">
          ${money(sub.cost)}
        </div>

      </div>

    `).join("");
}


/* -------------------------
   LEDGER
------------------------- */

function renderLedger(
  subscriptions
) {

  const container =
    document.getElementById(
      "ledgerList"
    );

  if (!container) return;

  if (!subscriptions.length) {

    container.innerHTML = `
      <div class="empty-state">
        No subscriptions logged yet.
      </div>
    `;

    return;
  }

  const sorted =
    [...subscriptions].sort(
      (a, b) =>
        parseDate(a.next) -
        parseDate(b.next)
    );

  container.innerHTML =
    sorted.map(sub => {

      const status =
        renewalStatus(sub);

      const site =
        sub.category === "Streaming"
          ? sub.streamingSite || "Streaming"
          : "";

      return `

        <div class="ledger-item">

          <div class="ledger-main">

            <div class="ledger-name">
              ${escapeHTML(sub.name)}
            </div>

            <div class="ledger-meta">

              ${escapeHTML(
                sub.category || "Other"
              )}

              ${
                site
                  ? ` · ${escapeHTML(site)}`
                  : ""
              }

              ·
              ${escapeHTML(
                sub.cycle || "monthly"
              )}

            </div>

          </div>

          <div class="ledger-date">
            ${shortDate(sub.next)}
          </div>

          <div class="ledger-cost">
            ${money(sub.cost)}
          </div>

          <div class="ledger-status ${status.className}">
            ${status.label}
          </div>

          <div class="ledger-actions">

            <button
              type="button"
              class="secondary"
              data-action="edit"
              data-id="${escapeHTML(sub.id)}"
            >
              Edit
            </button>

            <button
              type="button"
              class="secondary"
              data-action="delete"
              data-id="${escapeHTML(sub.id)}"
            >
              Delete
            </button>

          </div>

        </div>

      `;

    }).join("");
}


/* -------------------------
   LEDGER ACTIONS
------------------------- */

function handleLedgerAction(event) {

  const button =
    event.target.closest(
      "button[data-action]"
    );

  if (!button) return;

  const id =
    button.dataset.id;

  const action =
    button.dataset.action;

  if (action === "edit") {
    editSubscription(id);
  }

  if (action === "delete") {
    deleteSubscription(id);
  }
}


function editSubscription(id) {

  const subscriptions =
    getSubscriptions();

  const sub =
    subscriptions.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!sub) return;

  editingId = id;

  document.getElementById(
    "f-name"
  ).value =
    sub.name || "";

  document.getElementById(
    "f-cost"
  ).value =
    sub.cost || "";

  document.getElementById(
    "f-cycle"
  ).value =
    sub.cycle || "monthly";

  document.getElementById(
    "f-next"
  ).value =
    sub.next || "";

  document.getElementById(
    "f-used"
  ).value =
    sub.lastUsed || "";

  const category =
    document.getElementById(
      "f-category"
    );

  category.value =
    sub.category || "";

  const streamingField =
    document.getElementById(
      "streamingSiteField"
    );

  const streamingSite =
    document.getElementById(
      "f-streaming-site"
    );

  if (
    sub.category === "Streaming"
  ) {

    if (streamingField) {
      streamingField.style.display =
        "block";
    }

    if (streamingSite) {
      streamingSite.value =
        sub.streamingSite || "";
    }

  } else {

    if (streamingField) {
      streamingField.style.display =
        "none";
    }

    if (streamingSite) {
      streamingSite.value = "";
    }

  }

  const submitButton =
    document.getElementById(
      "submitBtn"
    );

  if (submitButton) {
    submitButton.textContent =
      "Save changes";
  }

  const cancelButton =
    document.getElementById(
      "cancelEditBtn"
    );

  if (cancelButton) {
    cancelButton.style.display =
      "inline-block";
  }

  const form =
    document.getElementById(
      "subForm"
    );

  if (form) {
    form.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}


function deleteSubscription(id) {

  const subscriptions =
    getSubscriptions();

  const sub =
    subscriptions.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!sub) return;

  const confirmed =
    confirm(
      `Delete "${sub.name}" from your ledger?`
    );

  if (!confirmed) return;

  const remaining =
    subscriptions.filter(
      item =>
        String(item.id) !==
        String(id)
    );

  saveSubscriptions(
    remaining
  );

  renderAudit();
}


/* -------------------------
   CLEAR ALL
------------------------- */

function clearAll() {

  const subscriptions =
    getSubscriptions();

  if (!subscriptions.length) {
    return;
  }

  const confirmed =
    confirm(
      "Are you sure you want to clear all subscription entries?"
    );

  if (!confirmed) return;

  localStorage.removeItem(
    STORAGE_KEY
  );

  resetForm();

  renderAudit();
}


/* =========================================================
   INSIGHTS PAGE
========================================================= */

function renderInsights() {

  const container =
    document.getElementById(
      "insightStats"
    );

  if (!container) return;

  const subscriptions =
    getSubscriptions();

  const monthly =
    subscriptions.reduce(
      (sum, sub) =>
        sum + monthlyCost(sub),
      0
    );

  const annual =
    monthly * 12;

  const unused =
    subscriptions.filter(
      unusedFor60Days
    );

  renderInsightStats(
    subscriptions,
    monthly,
    annual,
    unused
  );

  renderRenewals(
    subscriptions
  );

  renderExpensive(
    subscriptions
  );

  renderCuts(
    unused
  );

  renderCategoryChart(
    subscriptions
  );

  renderDataTable(
    subscriptions
  );
}


/* -------------------------
   INSIGHT STATS
------------------------- */

function renderInsightStats(
  subscriptions,
  monthly,
  annual,
  unused
) {

  const container =
    document.getElementById(
      "insightStats"
    );

  if (!container) return;

  container.innerHTML = `

    <div class="stat">
      <span class="stat-value">
        ${money(monthly)}
      </span>

      <span class="stat-label">
        Monthly spending
      </span>
    </div>

    <div class="stat">
      <span class="stat-value">
        ${money(annual)}
      </span>

      <span class="stat-label">
        Yearly spending
      </span>
    </div>

    <div class="stat">
      <span class="stat-value">
        ${subscriptions.length}
      </span>

      <span class="stat-label">
        Subscriptions
      </span>
    </div>

    <div class="stat ${unused.length ? "red" : "green"}">
      <span class="stat-value">
        ${money(
          unused.reduce(
            (sum, sub) =>
              sum + monthlyCost(sub),
            0
          )
        )}
      </span>

      <span class="stat-label">
        Potential monthly savings
      </span>
    </div>

  `;
}


/* -------------------------
   RENEWALS
------------------------- */

function renderRenewals(
  subscriptions
) {

  const container =
    document.getElementById(
      "renewalList"
    );

  if (!container) return;

  const upcoming =
    [...subscriptions]
      .sort(
        (a, b) =>
          parseDate(a.next) -
          parseDate(b.next)
      )
      .filter(sub => {

        const days =
          daysUntil(sub.next);

        return days <= 30;

      });

  if (!upcoming.length) {

    container.innerHTML = `
      <div class="empty-state">
        No renewals in the next 30 days.
      </div>
    `;

    return;
  }

  container.innerHTML =
    upcoming.map(sub => {

      const days =
        daysUntil(sub.next);

      let text;

      if (days < 0) {
        text = "Past due";
      } else if (days === 0) {
        text = "Today";
      } else if (days === 1) {
        text = "Tomorrow";
      } else {
        text = `In ${days} days`;
      }

      return `

        <div class="insight-row">

          <div>
            <strong>
              ${escapeHTML(sub.name)}
            </strong>

            <div class="small-text">
              ${
                sub.category === "Streaming" &&
                sub.streamingSite
                  ? escapeHTML(
                      sub.streamingSite
                    )
                  : escapeHTML(
                      sub.category || "Other"
                    )
              }
            </div>
          </div>

          <div>
            ${text}
          </div>

          <div>
            ${money(sub.cost)}
          </div>

        </div>

      `;

    }).join("");
}


/* -------------------------
   EXPENSIVE
------------------------- */

function renderExpensive(
  subscriptions
) {

  const container =
    document.getElementById(
      "expensiveList"
    );

  if (!container) return;

  const sorted =
    [...subscriptions]
      .sort(
        (a, b) =>
          monthlyCost(b) -
          monthlyCost(a)
      )
      .slice(0, 5);

  if (!sorted.length) {

    container.innerHTML = `
      <div class="empty-state">
        No subscription data yet.
      </div>
    `;

    return;
  }

  container.innerHTML =
    sorted.map(sub => {

      const site =
        sub.category === "Streaming" &&
        sub.streamingSite
          ? ` · ${escapeHTML(sub.streamingSite)}`
          : "";

      return `

        <div class="insight-row">

          <div>
            <strong>
              ${escapeHTML(sub.name)}
            </strong>

            <div class="small-text">
              ${escapeHTML(
                sub.category || "Other"
              )}${site}
            </div>
          </div>

          <div>
            ${money(monthlyCost(sub))}
            / month
          </div>

        </div>

      `;

    }).join("");
}


/* -------------------------
   CUTS
------------------------- */

function renderCuts(
  unused
) {

  const container =
    document.getElementById(
      "cutList"
    );

  const savingBox =
    document.getElementById(
      "savingBox"
    );

  if (!container) return;

  if (!unused.length) {

    container.innerHTML = `
      <div class="empty-state">
        Nothing is currently flagged
        as unused for 60+ days.
      </div>
    `;

    if (savingBox) {
      savingBox.innerHTML = `
        <strong>$0.00</strong>
        potential monthly savings
      `;
    }

    return;
  }

  const savings =
    unused.reduce(
      (sum, sub) =>
        sum + monthlyCost(sub),
      0
    );

  container.innerHTML =
    unused.map(sub => {

      const site =
        sub.category === "Streaming" &&
        sub.streamingSite
          ? ` · ${escapeHTML(sub.streamingSite)}`
          : "";

      return `

        <div class="insight-row">

          <div>

            <strong>
              ${escapeHTML(sub.name)}
            </strong>

            <div class="small-text">
              ${escapeHTML(
                sub.category || "Other"
              )}${site}
            </div>

          </div>

          <div>
            ${money(monthlyCost(sub))}
            / month
          </div>

        </div>

      `;

    }).join("");

  if (savingBox) {

    savingBox.innerHTML = `
      <strong>
        ${money(savings)}
      </strong>
      potential monthly savings
    `;

  }
}


/* -------------------------
   CATEGORY CHART
------------------------- */

function renderCategoryChart(
  subscriptions
) {

  const container =
    document.getElementById(
      "categoryChart"
    );

  if (!container) return;

  const totals =
    categoryTotals(
      subscriptions
    );

  const entries =
    Object.entries(totals)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );

  if (!entries.length) {

    container.innerHTML = `
      <div class="empty-state">
        Add subscriptions to see
        your spending breakdown.
      </div>
    `;

    return;
  }

  const max =
    entries[0][1];

  container.innerHTML =
    entries.map(
      ([category, value]) => {

        const width =
          max > 0
            ? (value / max) * 100
            : 0;

        return `

          <div class="category-row">

            <div class="category-head">

              <span>
                ${escapeHTML(category)}
              </span>

              <span>
                ${money(value)}
              </span>

            </div>

            <div class="bar">

              <div
                class="bar-fill"
                style="width:${width}%"
              ></div>

            </div>

          </div>

        `;

      }
    ).join("");
}


/* -------------------------
   COMPLETE DATA TABLE
------------------------- */

function renderDataTable(
  subscriptions
) {

  const container =
    document.getElementById(
      "dataTable"
    );

  if (!container) return;

  if (!subscriptions.length) {

    container.innerHTML = `
      <tr>
        <td colspan="7">
          No subscription records yet.
        </td>
      </tr>
    `;

    return;
  }

  const sorted =
    [...subscriptions].sort(
      (a, b) =>
        parseDate(a.next) -
        parseDate(b.next)
    );

  container.innerHTML =
    sorted.map(sub => {

      const status =
        renewalStatus(sub);

      const streamingSite =
        sub.category === "Streaming"
          ? sub.streamingSite || "—"
          : "—";

      return `

        <tr>

          <td>
            ${escapeHTML(sub.name)}
          </td>

          <td>
            ${escapeHTML(
              sub.category || "Other"
            )}
          </td>

          <td>
            ${escapeHTML(
              streamingSite
            )}
          </td>

          <td>
            ${money(sub.cost)}
          </td>

          <td>
            ${money(
              monthlyCost(sub)
            )}
          </td>

          <td>
            ${formatDate(sub.next)}
          </td>

          <td class="${status.className}">
            ${escapeHTML(status.label)}
          </td>

        </tr>

      `;

    }).join("");
}
