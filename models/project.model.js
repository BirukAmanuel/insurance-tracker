class ProjectInsurance {
    constructor(data) {
      this.BORROWER_NAME = data.BORROWER_NAME;
      this.LOAN_APPROVED = data.LOAN_APPROVED;
      this.COLLATERAL_TYPE = data.COLLATERAL_TYPE;
      this.COLLATERAL_VALUE = data.COLLATERAL_VALUE;
      this.SUM_INSURED = data.SUM_INSURED;
      this.INSURANCE_PREMIUM = data.INSURANCE_PREMIUM;
      this.INSURED_ON = data.INSURED_ON;
      this.EXPIRED_ON = data.EXPIRED_ON;
      this.POLICY_TYPES = data.POLICY_TYPES;
      this.COMPANY = data.COMPANY;
      this.CO_BENEFICIARY = data.CO_BENEFICIARY;
      this.PLATE_NO = data.PLATE_NO;
      this.REMARK = data.REMARK;
      this.ASSET_ID = data.ASSET_ID;
      this.USER_ID = data.USER_ID;
      this.STATUS = data.STATUS;
    }
  }
  
  module.exports = ProjectInsurance;
  