// installmentplan.js

document.addEventListener("DOMContentLoaded", function () {
  const formWrapper = document.getElementById("form-wrapper");

  const installmentSection = document.createElement("section");
  installmentSection.className = "form-section";
  installmentSection.innerHTML = `
    <h2>Installment Plan</h2>
    <div class="form-row">
     <label for="formDate">Date:</label>
     <input type="date" id="formDate" />
    </div>
    <div class="form-row">
      <label for="fullResponsibility">Per our agreement, your full responsibility is:</label>
      <input type="text" id="fullResponsibility" step="0.01" min="0" />
    </div>

    <div class="form-row">
      <label for="tosPayment">At time of service (TOS), you have agreed to pay:</label>
      <input type="text" id="tosPayment" step="0.01" min="0" />
    </div>

    <div class="form-row">
      <label for="remainingBalance">After initial payment your remaining balance is:</label>
      <input type="text" id="remainingBalance" step="0.01" min="0" readonly />
    </div>

    <div class="form-row">
      <label for="installmentCount">We will split into:</label>
      <input type="text" id="installmentCount" min="1" />
      <span id="installmentPlan"></span>
    </div>

    <div class="form-row">
      <label for="startDate">Your first payment will be pulled:</label>
      <input type="date" id="startDate" />
      <span id="monthlyDayText"></span>
    </div>

    <div class="form-row" id="dateErrorRow" style="color:red; display:none;">
      Selected start date must be today or in the future.
    </div>
  `;

  formWrapper.appendChild(installmentSection);

  const formDateInput = document.getElementById("formDate");
    if (formDateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  formDateInput.value = `${yyyy}-${mm}-${dd}`;
}


  // Element references
  const fullResponsibilityInput = document.getElementById("fullResponsibility");
  const tosPaymentInput = document.getElementById("tosPayment");
  const remainingBalanceInput = document.getElementById("remainingBalance");
  const installmentCountInput = document.getElementById("installmentCount");
  const installmentPlanText = document.getElementById("installmentPlan");
  const startDateInput = document.getElementById("startDate");
  const monthlyDayText = document.getElementById("monthlyDayText");
  const dateErrorRow = document.getElementById("dateErrorRow");

  // Functions

  /*-- New Code Inserted --*/
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function parseCurrency(value) {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}
function attachCurrencyHandlers(input) {
  input.addEventListener("blur", function () {
    if (input.value) {
      const num = parseFloat(input.value);
      if (!isNaN(num)) input.value = formatCurrency(num);
    }
  });

  input.addEventListener("focus", function () {
    if (input.value) {
      input.value = parseCurrency(input.value);
    }
  });
}
  
/*-- New Code End Insert --*/
  function calculateRemainingBalance() {
    const full = parseCurrency(fullResponsibilityInput.value) || 0;
    const tos = parseCurrency(tosPaymentInput.value) || 0;
    const remaining = full - tos;
    remainingBalanceInput.value = formatCurrency(remaining);
    calculatePaymentPlan();
  }

  function calculatePaymentPlan() {
    const balance = parseCurrency(remainingBalanceInput.value) || 0;
    const numPayments = parseInt(installmentCountInput.value) || 1;

    if (numPayments < 1) {
      installmentPlanText.textContent = "";
      return;
    }

    const basePayment = balance / numPayments;
    const decimalPlaces = (basePayment.toString().split('.')[1] || '').length;

    if (decimalPlaces <= 2) {
      installmentPlanText.textContent = `${numPayments} payments of ${formatCurrency(basePayment)}`;
    } else {
      const largerPayment = Math.floor(basePayment * 100) / 100 + 0.01;
      const largerCount = numPayments - 1;
      const totalLarger = largerPayment * largerCount;
      const finalPayment = balance - totalLarger;
      installmentPlanText.textContent = `${largerCount} payments of $${largerPayment.toFixed(2)} and 1 payment of $${finalPayment}`;
    }
  }

function updateMonthlyDayText() {
  if (!startDateInput.value) {
    monthlyDayText.innerHTML = "";
    return;
  }

  const selectedDateParts = startDateInput.value.split("-");
  const selectedDate = new Date(
    parseInt(selectedDateParts[0], 10),
    parseInt(selectedDateParts[1], 10) - 1,
    parseInt(selectedDateParts[2], 10)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    dateErrorRow.style.display = "block";
    monthlyDayText.innerHTML = "";
    return;
  } else {
    dateErrorRow.style.display = "none";
  }

  const day = selectedDate.getDate();
  const suffix = getDaySuffix(day);

  monthlyDayText.innerHTML = `
    and the ${day}${suffix} of every month until the balance is paid in full.
    <br><small class="fine-print">
      Note: If your scheduled plan includes a payment that falls on the following dates — February 29–31st, or the 31st of April, June, September, or November — those payments will be processed on the first day of the following month.
    </small>
  `;
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
  fullResponsibilityInput.addEventListener("input", calculateRemainingBalance);
  tosPaymentInput.addEventListener("input", calculateRemainingBalance);
  installmentCountInput.addEventListener("input", calculatePaymentPlan);
  startDateInput.addEventListener("change", updateMonthlyDayText);

  //New
attachCurrencyHandlers(fullResponsibilityInput);
attachCurrencyHandlers(tosPaymentInput);
attachCurrencyHandlers(remainingBalanceInput);

});
