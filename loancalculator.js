import { LightningElement, api, track } from 'lwc';

export default class LoanCalculator extends LightningElement {
  // Optional: receiving a record id if placed on a record page
  @api recordId;

  // Inputs (defaults can be adjusted or sourced from fields)
  @track propertyValue = 0;               // £
  @track specificNetLoan = 0;             // £
  @track arrangementFeePct = 2.00;        // %
  @track payRateMonthly = 0.90;           // % monthly (0.90 => 0.0090 as fraction)
  @track deferredInterestMonthly = 0.50;  // % monthly
  @track termMonths = 12;                 // months
  @track rolledMonths = 0;                // months of rolled interest
  @track bbr = 4.25;                      // % annual base rate (if you need it elsewhere)

  // Picklist options
  get termOptions() {
    return Array.from({ length: 16 }, (_, i) => {
      const v = i + 3; // 3..18
      return { label: `${v}`, value: v };
    });
  }

  // Formatters
  get money() {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 });
  }
  get percent() {
    return new Intl.NumberFormat('en-GB', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Core derived values
  get grossLoan() {
    // Convert % to fractions where appropriate
    const net = this.num(this.specificNetLoan);
    const arr = this.num(this.arrangementFeePct) / 100.0;           // fraction
    const pay = this.num(this.payRateMonthly) / 100.0;              // monthly fraction
    const def = this.num(this.deferredInterestMonthly) / 100.0;     // monthly fraction
    const term = this.int(this.termMonths);
    const rolled = Math.min(this.int(this.rolledMonths), term);

    // Guard rails
    if (net <= 0) return 0;
    // Denominator per your Excel-equivalent
    const denom = 1 - arr - (def * (term / 12)) - (pay * rolled);
    if (denom <= 0) return 0;

    return net / denom;
  }

  get grossLoanFormatted() {
    return this.money.format(this.grossLoan || 0);
  }

  get grossLtv() {
    const pv = this.num(this.propertyValue);
    if (pv <= 0) return 0;
    return this.grossLoan / pv;
  }

  get grossLtvFormatted() {
    return this.percent.format(this.grossLtv || 0);
  }

  get feesEstimate() {
    const arr = (this.num(this.arrangementFeePct) / 100.0) * this.grossLoan;
    // You can expand this with more fee types as needed.
    return Math.max(0, arr);
  }
  get feesFormatted() {
    return this.money.format(this.feesEstimate || 0);
  }

  // Handlers
  handleNumberChange = (e) => {
    const { name, value } = e.target;
    // LWC passes string; coerce safely
    this[name] = value === '' || value === null ? 0 : Number(value);
  };

  handlePicklistChange = (e) => {
    const { value } = e.detail;
    this.termMonths = Number(value);
    // keep rolled <= term
    if (this.rolledMonths > this.termMonths) {
      this.rolledMonths = this.termMonths;
    }
  };

  handleSliderChange = (e) => {
    this.rolledMonths = Number(e.detail.value);
  };

  // Utils
  num(v) { return isNaN(Number(v)) ? 0 : Number(v); }
  int(v) { return isNaN(parseInt(v, 10)) ? 0 : parseInt(v, 10); }
}
