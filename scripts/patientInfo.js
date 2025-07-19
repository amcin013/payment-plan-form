// patientinfo.js

document.addEventListener("DOMContentLoaded", function () {
  const formWrapper = document.getElementById("form-wrapper");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmailField(input, errorSpan) {
    if (!input) return;

    const email = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorSpan.textContent = "Please enter a valid email address.";
      input.classList.add("input-error");
      return false;
    } else {
      errorSpan.textContent = "";
      input.classList.remove("input-error");
      return true;
    }
  }

  function formatAndValidatePhone(input, errorSpan) {
  if (!input) return;

  // Remove all non-digit characters
  const digits = input.value.replace(/\D/g, '');

   if (digits.length === 10) {
    const area = digits.slice(0, 3);
    const central = digits.slice(3, 6);
    const line = digits.slice(6);
    input.value = `(${area})${central}-${line}`;
    input.classList.remove("input-error");
    errorSpan.textContent = "";
    return true;
  } else {
    errorSpan.textContent = "Please enter a valid 10-digit US phone number.";
    input.classList.add("input-error");
    return false;
  }
}
  
  // Create Patient and Payment Information section
  const patientInfoSection = document.createElement("section");
  patientInfoSection.className = "form-section";
  patientInfoSection.innerHTML = `
    <input type="hidden" id="patientAddressHidden" />
    <input type="hidden" id="billingAddressHidden" />
    <h2>Patient and Payment Information</h2>

    <div class="form-row-inline">
      <label for="patientName">Patient Name:</label>
      <input type="text" id="patientName" />
      <label for="accountNumber">Account #:</label>
      <input type="text" id="accountNumber" />
    </div>

    <div class="form-row">
      <label for="patientEmail">Patient Email:</label>
      <input type="email" id="patientEmail" name="patientEmail" required />
      <span id="patientEmailError" class="error-message"></span>
    </div>

    <div class="form-row-inline">
      <label for="ccNumber">CC #:</label>
      <input type="text" id="ccNumber" maxlength="20" />
      <label for="expDate">Exp (MM/YY):</label>
      <input type="text" id="expDate" maxlength="5" size="3" />
      <label for="cvv">CVV:</label>
      <input type="text" id="cvv" maxlength="3" size="3" />
    </div>

    <div class="form-row-inline">
      <label for="nameOnCard">Name on Card:</label>
      <input type="text" id="nameOnCard" />
      <input type="checkbox" id="nameMatchCheckbox" />
      <label for="nameMatchCheckbox" class="note">Name differs but refers to the same person (e.g., maiden name).</label>
    </div>

  

    <div id="patient-signature-section" class="form-section">
      <!-- Signature section dynamically populated -->
    </div>
  `;

  formWrapper.appendChild(patientInfoSection);
  // Bind validation after the DOM elements are injected
const patientEmail = document.getElementById("patientEmail");
const patientEmailError = document.getElementById("patientEmailError");

if (patientEmail && patientEmailError) {
  patientEmail.addEventListener("blur", () => {
    validateEmailField(patientEmail, patientEmailError);
  });
}

const ccNumberInput = document.getElementById("ccNumber");

if (ccNumberInput) {
  // Insert logo element next to the CC input
  const ccLogo = document.createElement("img");
  ccLogo.id = "card-logo";
  ccLogo.style.display = "none";
  ccNumberInput.parentNode.insertBefore(ccLogo, ccNumberInput.nextSibling);

  // Attach credit card formatting listener
  ccNumberInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "").slice(0, 16);
    let formatted = value;
    let cardType = "";

    if (/^4/.test(value)) {
      formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      cardType = "Visa";
      ccLogo.src = "./assets/visa.png";
    } else if (/^5[1-5]/.test(value)) {
      formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      cardType = "MasterCard";
      ccLogo.src = "./assets/mastercard.png";
    } else if (/^3[47]/.test(value)) {
      formatted = value.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
      cardType = "American Express";
      ccLogo.src = "./assets/amex.png";
    } else if (/^6(?:011|5)/.test(value)) {
      formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      cardType = "Discover";
      ccLogo.src = "./assets/discover.png";
    } else {
      ccLogo.style.display = "inline-block";
    }

    this.value = formatted.trim();
    if (cardType) {
      ccLogo.alt = cardType;
      ccLogo.style.display = "inline-block";
    }
  });
}


const expDateInput = document.getElementById("expDate");

if (expDateInput) {
  expDateInput.addEventListener("blur", function () {
    const val = this.value.trim();
    const now = new Date();
    let isValid = false;

    // Validate MM/YY format
    if (/^(0[1-9]|1[0-2])\/?(\d{2})$/.test(val)) {
      const [mm, yy] = val.split("/");
      const expMonth = parseInt(mm, 10);
      const expYear = parseInt("20" + yy, 10);

      // Set expiration date to the last day of the month
      const expDate = new Date(expYear, expMonth, 0);
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (expDate >= currentMonth) {
        isValid = true;
      }
    }

    // Style the input field
    this.style.backgroundColor = isValid ? "" : "#ffd6d6";
  });
}



  const remainingBalanceInput = document.getElementById("remainingBalance");
  const startDateInput = document.getElementById("startDate");


  // Create Cardholder Authorization section
  const cardholderAuthorizationSection = document.createElement("div");
  cardholderAuthorizationSection.id = "cardholder-authorization-section";
  cardholderAuthorizationSection.className = "form-section";
  formWrapper.appendChild(cardholderAuthorizationSection);

  const buttonContainer = document.createElement("div");
buttonContainer.id = "form-buttons";
buttonContainer.innerHTML = `
  <button id="clearButton">Clear</button>
  <button id="printButton">Print For Signature</button>
  <button id="submitBillingButton">File Billing</button>

`;

formWrapper.appendChild(buttonContainer);
const clearButton = document.getElementById("clearButton");
if (clearButton) {
  clearButton.addEventListener("click", function () {
    document.getElementById("form-wrapper").reset?.();
    window.location.reload(); // fallback if reset() isn't supported
  });
}

const printButton = document.getElementById("printButton");
if (printButton) {
  printButton.addEventListener("click", function () {
    const ccNumberInput = document.getElementById("ccNumber");
    const cvvInput = document.getElementById("cvv");
    let originalCC = "";
    let originalCVV = "";

    if (ccNumberInput) {
      originalCC = ccNumberInput.value;
      const digits = originalCC.replace(/\D/g, "");
      if (digits.length > 4) {
        ccNumberInput.value = "XXXX XXXX XXXX " + digits.slice(-4);
      }
    }

    if (cvvInput) {
      originalCVV = cvvInput.value;
      cvvInput.value = "XXX";
    }

    document.body.classList.add("printable");
    window.print();
    document.body.classList.remove("printable");

    // Restore values
    if (ccNumberInput) ccNumberInput.value = originalCC;
    if (cvvInput) cvvInput.value = originalCVV;
  });
}

document.getElementById("submitBillingButton")?.addEventListener("click", () => {
  if (typeof downloadFormDataJSON === "function") {
    downloadFormDataJSON();
  } else {
    console.error("downloadFormDataJSON not defined");
  }
});


  
  // Element references
  const patientNameInput = document.getElementById("patientName");
  const nameOnCardInput = document.getElementById("nameOnCard");
  const checkbox = document.getElementById("nameMatchCheckbox");
  const patientSignatureSection = document.getElementById("patient-signature-section");

  // Update signature section
function updatePatientSection() {
  const patientName = patientNameInput.value.trim().toLowerCase();
  const cardholderName = nameOnCardInput.value.trim().toLowerCase();
  const isMatch = patientName && cardholderName && patientName === cardholderName;
  const isCheckboxChecked = checkbox.checked;

  // Defensive coding: check that these inputs exist
  const remainingBalanceInput = document.getElementById("remainingBalance");
  const installmentCountInput = document.getElementById("installmentCount");
  const startDateInput = document.getElementById("startDate");

  const balance = remainingBalanceInput ? parseFloat(remainingBalanceInput.value) || 0 : 0;
  const numPayments = installmentCountInput ? parseInt(installmentCountInput.value) || 1 : 1;

  let paymentText = "";
  const basePayment = balance / numPayments;
  const decimalPlaces = (basePayment.toString().split('.')[1] || '').length;

  if (decimalPlaces <= 2) {
    paymentText = `$${basePayment.toFixed(2)}`;
  } else {
    const largerPayment = Math.floor(basePayment * 100) / 100 + 0.01;
    const largerCount = numPayments - 1;
    const totalLarger = largerPayment * largerCount;
    const finalPayment = (balance - totalLarger).toFixed(2);
    paymentText = `${largerCount} payments of $${largerPayment.toFixed(2)} and 1 payment of $${finalPayment}`;
  }

  let dynamicDayText = "___";
  if (startDateInput && startDateInput.value) {
    const selectedDateParts = startDateInput.value.split("-");
    const selectedDate = new Date(
      parseInt(selectedDateParts[0], 10),
      parseInt(selectedDateParts[1], 10) - 1,
      parseInt(selectedDateParts[2], 10)
    );
    const day = selectedDate.getDate();
    const suffix = getDaySuffix(day);
    dynamicDayText = `${day}${suffix}`;
  }

  if (cardholderName && !isMatch && !isCheckboxChecked) {
    patientSignatureSection.innerHTML = `
  <h3>Cardholder Acknowledgement:</h3>
  <div id="cardholderExtraFields">
    <p class="note bold">
      If the patient is utilizing a debit or credit card with a person's name other than their own, please have the cardholder complete the below information.
    </p>

    <div class="form-row">
      <label for="authName">I, </label>
      <input type="text" id="authName" /> authorize Longhorn Imaging Centers to charge my credit card indicated above in monthly installments until the balance listed above has been paid for the above patient who is
      <select id="relationship">
        <option value="">--Select--</option>
        <option value="spouse">Spouse</option>
        <option value="child">Child</option>
        <option value="parent">Parent</option>
        <option value="sibling">Sibling</option>
        <option value="grandparent">Grandparent</option>
        <option value="other">Other</option>
      </select>
      <input type="text" id="relationshipOther" placeholder="Please specify" style="display:none;" />
      to me.
    </div>

    <div class="form-row">
      <p class="fine-print">
        This plan includes ${paymentText}.
      </p>
    </div>

    <div class="form-row">
      <p class="fine-print">
        Payments will be charged on the ${dynamicDayText} of each month.
      </p>
    </div>

    <div class="form-row">
      <label for="billingAddress">Billing Address:</label>
      <gmpx-place-picker id="billingAddress" style="width: 100%;"></gmpx-place-picker>
    </div>
    <div class="form-row">
      <label for="billingPhone">Phone #:</label>
      <input type="tel" id="billingPhone" />
    </div>
    <div class="form-row">
      <label for="billingEmail">Email:</label>
      <input type="email" id="billingEmail" name="billingEmail" required/>
      <span id="billingEmailError" class="error-message"></span>
    </div>
  </div>
`;
  const authNameInput = document.getElementById("authName");
const nameOnCardValue = document.getElementById("nameOnCard")?.value?.trim();

if (authNameInput && nameOnCardValue) {
  authNameInput.value = nameOnCardValue;
}

  const billingPhone = document.getElementById("billingPhone");
const billingPhoneError = document.createElement("span");
billingPhoneError.id = "billingPhoneError";
billingPhoneError.className = "error-message";
billingPhone?.parentNode.appendChild(billingPhoneError);

if (billingPhone && !billingPhone.hasAttribute("data-bound")) {
  billingPhone.addEventListener("blur", () => {
    formatAndValidatePhone(billingPhone, billingPhoneError);
  });
  billingPhone.setAttribute("data-bound", "true");
}

  // Attach validation after billing email is injected
  const billingEmail = document.getElementById("billingEmail");
  const billingEmailError = document.getElementById("billingEmailError");

  if (billingEmail && !billingEmail.hasAttribute("data-bound")) {
    billingEmail.addEventListener("blur", () => {
      validateEmailField(billingEmail, billingEmailError);
    });
    billingEmail.setAttribute("data-bound", "true");
  }
  } else {
    patientSignatureSection.innerHTML = `
      <h3>Patient Acknowledgement:</h3>
      <p class="fine-print">
        I understand that by signing this payment plan, I am allowing Longhorn Imaging to run my card every month that my plan designates for the above amount until the balance is paid in full. I further acknowledge that once my payment plan is entered, I am not able to make any adjustments and the above agreement is final. Should my card decline more than two times, I understand I will be billed for my remaining balance.
      </p>
      <div class="form-row-inline">
        <label>Patient Name (Printed):</label><input type="text" />
        <label>Patient Signature:</label><input type="text" class="signature-field" /><br>
        <label>Date:</label><input type="date" />
      </div>
    `;
  }
  const billingPicker = document.getElementById("billingAddress");

billingPicker?.addEventListener("gmpx-placechange", (event) => {
  const place = event.target.value;
  console.log("💰 Billing address selected:", place);

  // Optional: use place.formattedAddress or place.addressComponents
});
if (cardholderName && !isMatch && !isCheckboxChecked) {
  document.body.classList.add("cardholder-compact");
} else {
  document.body.classList.remove("cardholder-compact");
}

}
  // Update cardholder authorization section
  function updateCardholderAuthorizationSection() {
    const patientName = patientNameInput.value.trim().toLowerCase();
    const cardholderName = nameOnCardInput.value.trim().toLowerCase();
    const isMatch = patientName && cardholderName && patientName === cardholderName;
    const isCheckboxChecked = checkbox.checked;

    if (cardholderName && !isMatch && !isCheckboxChecked) {
      cardholderAuthorizationSection.innerHTML = `
        <h3>Cardholder Authorization:</h3>
        <p class="fine-print">
          I understand that this authorization will remain in effect until I cancel it in person or over the phone, and I agree to notify Longhorn Imaging Centers in person or over the phone of any changes in my account information or termination of this authorization at least 15 days prior to the next billing date. If the above noted payment dates fall on a weekend or holiday, I understand that the payments may be executed on the next business day. I acknowledge that the origination of Credit Card transactions to my account must comply with the provisions of U.S. law. I certify that I am an authorized user of this Credit Card and will not dispute these scheduled transactions; so long as the transactions correspond to the terms indicated in this authorization form.
        </p>
        <div class="form-row-inline">
          <label>Cardholder Name (Printed):</label><input type="text" />
          <label>Cardholder Signature:</label><input type="text" class="signature-field" />
          <label>Date:</label><input type="date" />
        </div>
      `;
    } else {
      cardholderAuthorizationSection.innerHTML = "";
    }
  }

  function getDaySuffix(day) {
   if (day >= 11 && day <= 13) return "th";
     switch (day % 10) {
       case 1: return "st";
       case 2: return "nd";
       case 3: return "rd";
     default: return "th";
  }
}

  // Event listeners
  patientNameInput.addEventListener("input", () => {
    updatePatientSection();
    updateCardholderAuthorizationSection();
  });
  nameOnCardInput.addEventListener("blur", () => {
    updatePatientSection();
    updateCardholderAuthorizationSection();
  });
  checkbox.addEventListener("change", () => {
    updatePatientSection();
    updateCardholderAuthorizationSection();
  });

  // Initialize on load
  updatePatientSection();
  updateCardholderAuthorizationSection();

  // "Other" relationship handling
  document.addEventListener("change", (e) => {
    const relationshipDropdown = document.getElementById("relationship");
    const relationshipOtherInput = document.getElementById("relationshipOther");
    if (relationshipDropdown && relationshipOtherInput) {
      relationshipOtherInput.style.display = relationshipDropdown.value === "other" ? "inline-block" : "none";
    }
  });
});
// Wait for both DOM and Google Maps to be ready before injecting autocomplete
Promise.all([
  new Promise((resolve) => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", resolve);
    }
  }),
  window.gmpReady
]).then(() => {
  const patientAddressRow = document.createElement("div");
  patientAddressRow.className = "form-row-inline";

  const patientLabel = document.createElement("label");
  patientLabel.setAttribute("for", "patientAddress");
  patientLabel.textContent = "Patient Address:";

const patientPicker = document.createElement("gmpx-place-picker");
patientPicker.id = "patientAddress";
patientPicker.style.width = "100%";

patientAddressRow.appendChild(patientLabel);
patientAddressRow.appendChild(patientPicker);


  const section = document.querySelector(".form-section");
  if (section) {
    section.appendChild(patientAddressRow);
    // Patient address listener
patientPicker.addEventListener("gmpx-placechange", (event) => {
  const place = event.target.value;
  console.log("🏥 Patient address selected:", place);
  const formatted = place?.formattedAddress || "";
      document.getElementById("patientAddressHidden").value = formatted;
  // Optional: Do something with it
  // e.g., document.getElementById("someHiddenField").value = place.formattedAddress;
});

  //  console.log('autocomplete element upgrade check:', customElements.get('gmpx-place-autocomplete'));
  }
});
