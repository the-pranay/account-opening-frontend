// ═══════════════════════════════════════════════════════════════
// Form Field Constants & Dropdown Options
// ═══════════════════════════════════════════════════════════════

export const CUSTOMER_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'joint', label: 'Joint' },
  { value: 'trust', label: 'Trust' },
  { value: 'minor', label: 'Minor' },
];

export const PRODUCT_CLASSES = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
  { value: 'salary', label: 'Salary Account' },
  { value: 'nre', label: 'NRE Account' },
  { value: 'nro', label: 'NRO Account' },
];

export const CURRENCIES = [
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
];

export const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
  { value: 'fd', label: 'Fixed Deposit (FD) Account' },
  { value: 'rd', label: 'Recurring Deposit (RD) Account' },
  { value: 'salary', label: 'Salary Account' },
];

export const PRODUCT_GROUPS = [
  { value: 'retail', label: 'Retail Banking' },
  { value: 'corporate', label: 'Corporate Banking' },
  { value: 'sme', label: 'SME Banking' },
  { value: 'wealth', label: 'Wealth Management' },
];

export const MODE_OF_OPERATIONS = [
  { value: 'single', label: 'Single' },
  { value: 'jointly', label: 'Jointly' },
  { value: 'either_or_survivor', label: 'Either or Survivor' },
  { value: 'anyone', label: 'Anyone' },
  { value: 'former_or_survivor', label: 'Former or Survivor' },
];

export const CUSTOMER_ROLES = [
  { value: 'primary', label: 'Primary Holder' },
  { value: 'secondary', label: 'Secondary Holder' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'power_of_attorney', label: 'Power of Attorney' },
  { value: 'mandate_holder', label: 'Mandate Holder' },
];

export const DOCUMENT_TYPES = [
  { value: 'identity', label: 'Identity Proof' },
  { value: 'address', label: 'Address Proof' },
  { value: 'photograph', label: 'Photograph' },
  { value: 'income', label: 'Income Proof' },
  { value: 'signature', label: 'Signature Card' },
];

export const DOCUMENT_CATEGORIES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'bank_statement', label: 'Bank Statement' },
];

export const ADDRESS_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'office', label: 'Office' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'correspondence', label: 'Correspondence' },
];

export const ACCOMMODATION_TYPES = [
  { value: 'owned', label: 'Owned' },
  { value: 'rented', label: 'Rented' },
  { value: 'company_provided', label: 'Company Provided' },
  { value: 'family', label: 'Family' },
];

export const INSTRUMENT_TYPES = [
  { value: 'cheque', label: 'Cheque' },
  { value: 'demand_draft', label: 'Demand Draft' },
  { value: 'pay_order', label: 'Pay Order' },
];

export const CHEQUE_TYPES = [
  { value: 'bearer', label: 'Bearer' },
  { value: 'order', label: 'Order' },
  { value: 'crossed', label: 'Crossed' },
];

export const STATEMENT_FACILITIES = [
  { value: 'email', label: 'Email' },
  { value: 'registered_address', label: 'Registered Address' },
  { value: 'branch_pickup', label: 'Branch Pickup' },
];

export const CHANNELS = [
  { value: 'internet_banking', label: 'Internet Banking' },
  { value: 'mobile_banking', label: 'Mobile Banking' },
  { value: 'branch', label: 'Branch' },
  { value: 'atm', label: 'ATM' },
  { value: 'pos', label: 'POS' },
];

export const PAYMENT_MODES = [
  { value: 'neft', label: 'NEFT' },
  { value: 'rtgs', label: 'RTGS' },
  { value: 'imps', label: 'IMPS' },
  { value: 'upi', label: 'UPI' },
];

export const PAYMENT_METHODS = [
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
];

export const PAYMENT_TYPES = [
  { value: 'domestic', label: 'Domestic' },
  { value: 'international', label: 'International' },
];

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'other', label: 'Other' },
];

export const COUNTRIES = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
];

export const SEARCH_BY_OPTIONS = [
  { value: 'customerId', label: 'Customer ID' },
  { value: 'name', label: 'Customer Name' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'pan', label: 'PAN Number' },
  { value: 'aadhaar', label: 'Aadhaar Number' },
];

export const FEE_TYPES = [
  { value: 'one_time', label: 'One Time' },
  { value: 'recurring', label: 'Recurring' },
  { value: 'transaction', label: 'Transaction Based' },
];

export const NEGOTIATED_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'flat', label: 'Flat' },
  { value: 'none', label: 'None' },
];

export const STEPPER_STEPS = [
  'New Account',
  'Product Selection',
  'Relationship',
  'Associated Documents',
  'Basic Details',
  'Transaction Limits',
  'Nominee',
] as const;

// Column mapping for offline form import
export const OFFLINE_COLUMN_MAP: Record<string, string> = {
  CustomerName: 'customerName',
  customername: 'customerName',
  customer_name: 'customerName',
  CustomerID: 'customerId',
  customerid: 'customerId',
  customer_id: 'customerId',
  BranchCode: 'branchCode',
  branchcode: 'branchCode',
  branch_code: 'branchCode',
  AccountType: 'accountType',
  accounttype: 'accountType',
  account_type: 'accountType',
  NomineeName: 'nomineeName',
  nomineename: 'nomineeName',
  nominee_name: 'nomineeName',
  Address: 'address',
  address: 'address',
  Phone: 'phone',
  phone: 'phone',
  Email: 'email',
  email: 'email',
};

export const ALLOWED_FILE_TYPES = {
  documents: {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  offline: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'text/csv': ['.csv'],
  },
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
