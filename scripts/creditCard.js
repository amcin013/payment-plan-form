// creditCard.js

document.addEventListener("DOMContentLoaded", function () {
    const ccNumberInput = document.getElementById("ccNumber");
    const ccLogo = document.createElement("img");
    ccLogo.id = "card-logo";
    ccLogo.style.display = "none";
    if (ccNumberInput && ccNumberInput.parentNode) {
        ccNumberInput.parentNode.insertBefore(ccLogo, ccNumberInput.nextSibling);
    }

    ccNumberInput?.addEventListener("input", function () {
        let value = this.value.replace(/\D/g, "");
        let formatted = value;
        let cardType = "";

        if (/^4/.test(value)) {
            // Visa
            formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
            cardType = "Visa";
            ccLogo.src = "/payment-plan-form/assets/visa.png";
        } else if (/^5[1-5]/.test(value)) {
            // MasterCard
            formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
            cardType = "MasterCard";
            ccLogo.src = "/payment-plan-form/assets/mastercard.png";
        } else if (/^3[47]/.test(value)) {
            // American Express
            formatted = value.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
            cardType = "American Express";
            ccLogo.src = "/payment-plan-form/assets/amex.png";
        } else if (/^6(?:011|5)/.test(value)) {
            // Discover
            formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
            cardType = "Discover";
            ccLogo.src = "/payment-plan-form/assets/discover.png";
        } else {
            ccLogo.style.display = "none";
        }

        this.value = formatted.trim();
        if (cardType) {
            ccLogo.alt = cardType;
            ccLogo.style.display = "inline";
        }
    });

    const expDateInput = document.getElementById("expDate");
    expDateInput?.addEventListener("blur", function () {
        const val = this.value.trim();
        const message = document.getElementById("expMessage");
        const now = new Date();
        let isValid = false;

        if (/^(0[1-9]|1[0-2])\/?(\d{2})$/.test(val)) {
            const [mm, yy] = val.split("/");
            const expDate = new Date(`20${yy}`, parseInt(mm), 0);
            if (expDate >= new Date(now.getFullYear(), now.getMonth(), 1)) {
                isValid = true;
            }
        }

        if (message) {
            message.style.display = isValid ? "none" : "block";
        }

        this.style.backgroundColor = isValid ? "" : "#ffd6d6";
    });

    // Update printable values for cardholder section
    function updatePrintableAuthorization() {
        const balance = parseFloat(document.getElementById("remainingBalance")?.value || "0").toFixed(2);
        const billingDay = document.getElementById("monthlyDayOutput")?.textContent || "[day]";

        const amountSpan = document.getElementById("printableRemainingBalance");
        const daySpan = document.getElementById("printableBillingDay");

        if (amountSpan) amountSpan.textContent = balance;
        if (daySpan) {
            const match = billingDay.match(/\d+(st|nd|rd|th)/);
            daySpan.textContent = match ? match[0] : "[day]";
        }
    }

    // Compare names and toggle cardholder authorization section
    function evaluateCardholderMatch() {
        const patientName = (document.getElementById("patientName")?.value || "").trim().toLowerCase();
        const ccName = (document.getElementById("nameOnCard")?.value || "").trim().toLowerCase();
        const override = document.getElementById("nameMatchCheckbox")?.checked;
        const section = document.getElementById("cardholder-warning");

        if (!section) return;

        if (patientName && ccName && patientName !== ccName && !override) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    }

    // Setup event listeners
    document.getElementById("remainingBalance")?.addEventListener("input", updatePrintableAuthorization);
    document.getElementById("startDate")?.addEventListener("change", updatePrintableAuthorization);

    document.getElementById("patientName")?.addEventListener("input", evaluateCardholderMatch);
    document.getElementById("nameOnCard")?.addEventListener("input", evaluateCardholderMatch);
    document.getElementById("nameMatchCheckbox")?.addEventListener("change", evaluateCardholderMatch);

    // Add phone number formatting (borrowed from v0.2)
    const phoneInput = document.getElementById("billingPhone");
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            let val = this.value.replace(/\D/g, '');
            if (val.length >= 10) {
                this.value = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6, 10)}`;
            }
        });
    }

    updatePrintableAuthorization();
});
