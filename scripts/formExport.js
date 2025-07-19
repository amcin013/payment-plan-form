// formExport.js

// Collects values from form fields with specific IDs and downloads a JSON file
function gatherFormDataAsJSON() {
  const fieldIDs = [
    "patientName",
    "accountNumber",
    "patientEmail",
    "ccNumber",
    "cvv",
    "expDate",
    "nameOnCard",
    "nameMatchCheckbox",
    "authName",
    "relationship",
    "relationshipOther",
    "billingPhone",
    "billingEmail",
    "remainingBalance",
    "installmentCount",
    "startDate",
    "patientAddress",
    "patientAddressHidden",
    "billingAddressHidden",
    "billingAddress",
    "formDate",
    "fullResponsibility",
    "installmentCount",
    "remainingBalance",
    "startDate",
    "tosPayment",
  ];

  const formData = {};

  fieldIDs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.tagName === "INPUT" || el.tagName === "SELECT") {
      if (el.type === "checkbox") {
        formData[id] = el.checked;
      } else {
        formData[id] = el.value;
      }
    } else if (el.tagName === "GMPX-PLACE-PICKER") {
      formData[id] = el.value || "";
    }
  });

  // Unmask sensitive data manually from DOM before masking was applied (if needed)
  const ccRaw = document.getElementById("ccNumber")?.getAttribute("data-raw") || document.getElementById("ccNumber")?.value;
  const cvvRaw = document.getElementById("cvv")?.getAttribute("data-raw") || document.getElementById("cvv")?.value;
  formData["ccNumber"] = ccRaw;
  formData["cvv"] = cvvRaw;

  return formData;
}

// Trigger download of JSON file
function downloadFormDataJSON() {
  const data = gatherFormDataAsJSON();
  const rawAccount = data.accountNumber || "unknown";
  const rawFormDate = data.formDate || "no-date";
  const safeAccount = rawAccount.replace(/[^a-zA-Z0-9-_]/g, "_");
  const safeDate = rawFormDate.replace(/[^a-zA-Z0-9-_]/g, "_");
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `payment_plan_${safeAccount}_${safeDate}.json`;
  link.click();
}

loadPublicKey().then(key => {
  console.log("✅ Public key loaded:", key);
}).catch(err => {
  console.error("❌ Failed to load public key:", err);
});

// Test data filling functionality
// This is for development purposes to quickly fill the form with test data
window.addEventListener("DOMContentLoaded", () => {
  const fillButton = document.getElementById("fillTestDataButton");

  if (fillButton) {
    fillButton.addEventListener("click", () => {
      const testData = {
        patientName: "John Doe",
        accountNumber: "JJDOE123456",
        patientEmail: "johndoe@example.com",
        ccNumber: "6111111111111111",
        expDate: "12/26",
        cvv: "123",
        nameOnCard: "Jane Doe",
        nameMatchCheckbox: false,
        authName: "Jane Doe",
        relationship: "Spouse",
        billingPhone: "512-555-1234",
        billingEmail: "billing@example.com",
        remainingBalance: "450.00",
        installmentCount: "3",
        startDate: "2025-08-01",
        fullResponsibility: true,
        tosPayment: true
      };

      Object.entries(testData).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.type === "checkbox") {
          el.checked = value;
        } else {
          el.value = value;
        }
      });

      console.log("🧪 Test data filled");
    });
  }
});

// Hook up the export button
window.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("submitBillingButton");
  if (exportBtn) {
    exportBtn.addEventListener("click", downloadFormDataJSON);
  }
});
