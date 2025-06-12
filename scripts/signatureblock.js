// signatureblock.js

  function renderSignatureBlock() {
  const wrapper = document.createElement("div");
  wrapper.id = "signature-section";

  wrapper.innerHTML = `
    <div id="patient-signature-block" class="form-section">
      <h3>Patient Acknowledgement:</h3>
      <p class="fine-print">
        I understand that by signing this payment plan, I am allowing Longhorn Imaging to run my card every month that my plan designates for the above amount until the balance is paid in full. I further acknowledge that once my payment plan is entered, I am not able to make any adjustments and the above agreement is final. Should my card decline more than two times, I understand I will be billed for my remaining balance.
      </p>
      <div class="form-row-inline">
        <label>Patient Name (Printed):</label><input type="text" />
        <label>Patient Signature:</label><input type="text" class="signature-field" />
        <label>Date:</label><input type="date" />
      </div>
    </div>

    <div id="cardholder-signature-block" class="form-section hidden">
      <h3>Cardholder Authorization:</h3>
      <p class="fine-print">
        I understand that this authorization will remain in effect until I cancel it in person or over the phone, and I agree to notify Longhorn Imaging Centers in person or over the phone of any changes in my account information or termination of this authorization at least 15 days prior to the next billing date. If the above noted payment dates fall on a weekend or holiday, I understand that the payments may be executed on the next business day. I acknowledge that the origination of Credit Card transactions to my account must comply with the provisions of U.S. law. I certify that I am an authorized user of this Credit Card and will not dispute these scheduled transactions; so long as the transactions correspond to the terms indicated in this authorization form.
      </p>
      <div class="form-row-inline">
        <label>Cardholder Name (Printed):</label><input type="text" />
        <label>Cardholder Signature:</label><input type="text" class="signature-field" />
        <label>Date:</label><input type="date" />
      </div>
    </div>
  `;

  document.getElementById("form-wrapper").appendChild(wrapper);

  // No additional logic here because patientinfo.js controls visibility
}
