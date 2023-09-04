// ==> move the related behaviors to the subclass
// Since the behaviors are complicated, so I use extract methods in the base class first
function createRating(voyage, history) {
  if (voyage.zone === "china" && history.some((v) => v.zone === "china")) {
    return new ChinaRating(voyage, history);
  }
  return new Rating(voyage, history);
}

class Rating {
  constructor(voyage, history) {
    this.voyage = voyage;
    this.history = history;
  }

  get value() {
    const vpf = this.voyageProfitFactor;
    const vr = this.voyageRisk;
    const chr = this.captainHistoryRisk;
    if (vpf * 3 > vr + chr * 2) return "A";
    return "B";
  }

  get voyageRisk() {
    let result = 1;
    if (this.voyage.length > 4) result += 2;
    if (this.voyage.length > 8) result += this.voyage.length - 8;
    if (["china", "east-indies"].includes(this.voyage.zone)) result += 4;
    return Math.max(result, 0);
  }

  get captainHistoryRisk() {
    let result = 1;
    if (this.history.length < 5) result += 4;
    result += this.history.filter((v) => v.profit < 0).length;
    //if (this.voyage.zone === "china" && this.hasChina) result -= 2; // move this line to the subclass
    return Math.max(result, 0);
  }

  get voyageProfitFactor() {
    let result = 2;
    if (this.voyage.zone === "china") result += 1;
    if (this.voyage.zone === "east-indies") result += 1;
    // if (this.voyage.zone === "china" && this.hasChina) {
    //   result += 3;
    //   if (this.history.length > 10) result += 1;
    //   if (this.voyage.length > 12) result += 1;
    //   if (this.voyage.length > 18) result -= 1;
    // } else {
    //   if (this.history.length > 8) result += 1;
    //   if (this.voyage.length > 14) result -= 1;
    // } extract these code to a new method
    result += this.profitAfterAdjusting
    return result;
  }

  get profitAfterAdjusting() {
    let result = 0;
    if (this.history.length > 8) result += 1;
    if (this.voyage.length > 14) result -= 1;
    return result;
  }
}

class ChinaRating extends Rating {
  get captainHistoryRisk() {
    const result = super.captainHistoryRisk - 2;
    return Math.max(result, 0);
  }

  get voyageProfitFactor() {
    return super.voyageProfitFactor;
  }

  get profitAfterAdjusting() {
    let result = 0;
    result += 3;
    if (this.history.length > 10) result += 1;
    if (this.voyage.length > 12) result += 1;
    if (this.voyage.length > 18) result -= 1;
    return result;
  }
}
