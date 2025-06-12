// patientinfo.js

document.addEventListener("DOMContentLoaded", function () {
  const formWrapper = document.getElementById("form-wrapper");

  // Create Patient and Payment Information section
  const patientInfoSection = document.createElement("section");
  patientInfoSection.className = "form-section";
  patientInfoSection.innerHTML = `
    <h2>Patient and Payment Information</h2>

    <div class="form-row-inline">
      <label for="patientName">Patient Name:</label>
      <input type="text" id="patientName" />
      <label for="accountNumber">Account #:</label>
      <input type="text" id="accountNumber" />
    </div>

    <div class="form-row">
      <label for="patientEmail">Patient Email:</label>
      <input type="email" id="patientEmail" />
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
  // Attach credit card formatting listener after element is injected
const ccNumberInput = document.getElementById("ccNumber");

if (ccNumberInput) {
  // Insert logo element next to the CC input
  const ccLogo = document.createElement("img");
  ccLogo.id = "card-logo";
  ccLogo.style.display = "none";
  ccNumberInput.parentNode.insertBefore(ccLogo, ccNumberInput.nextSibling);

  // Attach credit card formatting listener
  ccNumberInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
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
  <button id="printButton">Print</button>
`;
formWrapper.appendChild(buttonContainer);
const clearButton = document.getElementById("clearButton");
if (clearButton) {
  clearButton.addEventListener("click", function () {
    location.reload();
  });
}
const printButton = document.getElementById("printButton");
if (printButton) {
  printButton.addEventListener("click", function () {
    // Mask CC Details
    const ccNumberInput = document.getElementById("ccNumber");
    const cvvInput = document.getElementById("cvv")
    let originalCC = "";
    let originalCVV = "";
    if (ccNumberInput) {
      originalCC = ccNumberInput.value;
      let digits = originalCC.replace(/\D/g, "");
      if (digits.length > 4) {
        let masked = "XXXX XXXX XXXX " + digits.slice(-4);
        ccNumberInput.value = masked;
      }
    }

    if (cvvInput) {
      originalCVV = cvvInput.value;
      cvvInput.value = "XXX";
    }

    // Add print-specific class
    document.body.classList.add("printable");

    // Print
    window.print();

    // Restore CC Details
    if (ccNumberInput) {
      ccNumberInput.value = originalCC;
    }
    if (cvvInput){
      cvvInput.value = originalCVV;
    }

    // Remove print-specific class
    document.body.classList.remove("printable");
  });
}
  
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
      <input type="text" id="billingAddress" />
    </div>
    <div class="form-row">
      <label for="billingPhone">Phone #:</label>
      <input type="tel" id="billingPhone" />
    </div>
    <div class="form-row">
      <label for="billingEmail">Email:</label>
      <input type="email" id="billingEmail" />
    </div>
  </div>
`;
  } else {
    patientSignatureSection.innerHTML = `
      <h3>Patient Acknowledgement:</h3>
      <p class="fine-print">
        I understand that by signing this payment plan, I am allowing Longhorn Imaging to run my card every month that my plan designates for the above amount until the balance is paid in full. I further acknowledge that once my payment plan is entered, I am not able to make any adjustments and the above agreement is final. Should my card decline more than two times, I understand I will be billed for my remaining balance.
      </p>
      <div class="form-row-inline">
        <label>Patient Name (Printed):</label><input type="text" />
        <label>Patient Signature:</label><input type="text" class="signature-field" />
        <label>Date:</label><input type="date" />
      </div>
    `;
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
