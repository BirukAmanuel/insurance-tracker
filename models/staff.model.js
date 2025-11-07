class StaffInsurance {
  constructor(data) {
    this.ID = data.ID;
    this.FULL_NAME = data.FULL_NAME;
    this.EMAIL = data.EMAIL;
    this.LOAN_AMOUNT = data.LOAN_AMOUNT;
    this.LOAN_TYPE = data.LOAN_TYPE;
    this.SUM_INSURED = data.SUM_INSURED;
    this.PREMIUM_AMOUNT = data.PREMIUM_AMOUNT;
    this.INSURED_ON = data.INSURED_ON;
    this.EXPIRED_ON = data.EXPIRED_ON;
    this.POLICY_TYPE = data.POLICY_TYPE;
    this.COMPANY = data.COMPANY;
    this.CO_BENEFICIARY = data.CO_BENEFICIARY;
    this.REMARK = data.REMARK;
    this.USER_ID = data.USER_ID;
    this.STATUS = data.STATUS;
    this.AUTHORIZER_ID = data.AUTHORIZER_ID;
  }
}

module.exports = StaffInsurance;
