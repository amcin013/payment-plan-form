// formExport.js

// Collects values from form fields with specific IDs and downloads a JSON file
function gatherFormDataAsJSON() {
  const fieldIDs = [
    "patientName",
    "accountNumber",
    "patientEmail",
    "ccNumber",
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
  formData["ccNumber"] = ccRaw;

  return formData;
}

// Hook up the export button
window.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("submitBillingButton");
  if (exportBtn) {
    exportBtn.addEventListener("click", downloadFormDataJSON);
  }
});

// Generate AES key and IV for encryption
// This is used to encrypt the JSON data before sending it to the server
async function generateAESKeyAndIV() {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM
  return { key, iv };
}
// Encrypt JSON data using AES-GCM
// This function takes the AES key, IV, and JSON data, and returns the encrypted ciphertext
async function encryptWithAESKey(key, iv, jsonData) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(jsonData);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedData
  );

  return ciphertext;
}
// Encrypt AES key with RSA public key
// This function takes the RSA public key and the AES key, and returns the encrypted AES key
async function encryptAESKeyWithRSA(publicKey, aesKey) {
  const rawKey = await crypto.subtle.exportKey("raw", aesKey);

  const encryptedKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawKey
  );

  return encryptedKey; // returns ArrayBuffer
}


loadPublicKey().then(key => {
  console.log("✅ Public key loaded:", key);
}).catch(err => {
  console.error("❌ Failed to load public key:", err);
});

// Trigger download of JSON file
/*--- Old function, replaced with new downloadFormDataJSON() ---*/
/*--- 
async function downloadFormDataJSON() {
  const data = gatherFormDataAsJSON();
  const rawAccount = data.accountNumber || "unknown";
  const rawFormDate = data.formDate || "no-date";
  const safeAccount = rawAccount.replace(/[^a-zA-Z0-9-_]/g, "_");
  const safeDate = rawFormDate.replace(/[^a-zA-Z0-9-_]/g, "_");

  const jsonString = JSON.stringify(data, null, 2);

  try {
    const publicKey = await loadPublicKey(); // your existing working function
    const encoded = new TextEncoder().encode(jsonString);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      encoded
    );

    const base64Encrypted = btoa(
      String.fromCharCode(...new Uint8Array(encryptedBuffer))
    );

    const blob = new Blob([base64Encrypted], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payment_plan_${safeAccount}_${safeDate}.json`;
    link.click();

    console.log("✅ Encrypted JSON downloaded");
  } catch (err) {
    console.error("❌ Encryption failed:", err);
    alert("Encryption failed. See console for details.");
  }
}
 ---*/

 // New function to download form data as hybrid-encrypted JSON
// This function gathers form data, encrypts it with AES, and then encrypts the AES key with RSA
// Finally, it downloads the encrypted data as a JSON file  
async function downloadFormDataJSON() {
  const data = gatherFormDataAsJSON();
  const rawAccount = data.accountNumber || "unknown";
  const rawFormDate = data.formDate || "no-date";
  const safeAccount = rawAccount.replace(/[^a-zA-Z0-9-_]/g, "_");
  const safeDate = rawFormDate.replace(/[^a-zA-Z0-9-_]/g, "_");

  const jsonString = JSON.stringify(data);

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

  try {
    const publicKey = await loadPublicKey();
    const { key: aesKey, iv } = await generateAESKeyAndIV();
    const encryptedBuffer = await encryptWithAESKey(aesKey, iv, jsonString);

  // Split ciphertext and tag
  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const tag = encryptedBytes.slice(-16);
  const ciphertext = encryptedBytes.slice(0, -16);

  // Combine ciphertext + tag
  const encryptedData = new Uint8Array(ciphertext.length + tag.length);
  encryptedData.set(ciphertext);
  encryptedData.set(tag, ciphertext.length);

    const encryptedAESKey = await encryptAESKeyWithRSA(publicKey, aesKey);

    // Convert buffers to base64
    const encryptedBundle = {
      key: bufferToBase64(encryptedAESKey),
      iv: bufferToBase64(iv),
      data: bufferToBase64(encryptedData)
    };

    const blob = new Blob([JSON.stringify(encryptedBundle, null, 2)], {
      type: "application/json"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payment_plan_${safeAccount}_${safeDate}.json`;
    link.click();
    console.log("✅ Hybrid-encrypted JSON file downloaded");
  } catch (err) {
    console.error("❌ Hybrid encryption failed:", err);
    alert("Encryption failed. Check console for details.");
  }

}


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
        ccNumber: "6011111111111111",
        expDate: "12/26",
        cvv: "123",
        nameOnCard: "Jane Doe",
        nameMatchCheckbox: false,
        authName: "Jane Doe",
        billingEmail: "janedoe@example.com",
        relationship: "Spouse",
        billingPhone: "512-555-1234",
        billingEmail: "billing@example.com",
        remainingBalance: "400.00",
        installmentCount: "3",
        startDate: "2025-08-01",
        fullResponsibility: "550.00",
        tosPayment: "150.00",
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
