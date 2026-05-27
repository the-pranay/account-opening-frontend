// ═══════════════════════════════════════════════════════════════
// Form Field Constants & Dropdown Options
// ═══════════════════════════════════════════════════════════════

export const CUSTOMER_TYPES = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'JOINT', label: 'Joint' },
  { value: 'TRUST', label: 'Trust' },
  { value: 'MINOR', label: 'Minor' },
];

export const PRODUCT_CLASSES = [
  { value: 'CASA', label: 'CASA (Savings / Current)' },
  { value: 'LOAN', label: 'Loan Account' },
  { value: 'TD', label: 'Term Deposit (FD)' },
  { value: 'RD', label: 'Recurring Deposit (RD)' },
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
  { value: 'SINGLE', label: 'Single' },
  { value: 'JOINTLY', label: 'Jointly' },
  { value: 'ANYONE_OR_SURVIVOR', label: 'Anyone or Survivor' },
  { value: 'EITHER_OR_SURVIVOR', label: 'Either or Survivor' },
  { value: 'FORMER_OR_SURVIVOR', label: 'Former or Survivor' },
];

export const CUSTOMER_ROLES = [
  { value: 'primary', label: 'Primary Holder' },
  { value: 'secondary', label: 'Secondary Holder' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'power_of_attorney', label: 'Power of Attorney' },
  { value: 'mandate_holder', label: 'Mandate Holder' },
];

export const DOCUMENT_TYPES = [
  { value: 'AADHAAR', label: 'Aadhaar Card' },
  { value: 'PAN', label: 'PAN Card' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' },
  { value: 'RATION_CARD', label: 'Ration Card' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'VOTER_ID', label: 'Voter ID' },
];

export const DOCUMENT_CATEGORIES = [
  { value: 'IDENTITY_PROOF', label: 'Identity Proof' },
  { value: 'ADDRESS_PROOF', label: 'Address Proof' },
  { value: 'PHOTOGRAPH', label: 'Photograph' },
  { value: 'INCOME_PROOF', label: 'Income Proof' },
  { value: 'SIGNATURE_CARD', label: 'Signature Card' },
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

export const BANK_CODES = [
  { value: 'IDIGI', label: 'idigiBank' },
];

export const BRANCHES = [
  { value: 'Mumbai', label: 'Mumbai', code: 'MUM001' },
  { value: 'Delhi', label: 'Delhi', code: 'DEL002' },
  { value: 'Bengaluru', label: 'Bengaluru', code: 'BEN003' },
  { value: 'Hyderabad', label: 'Hyderabad', code: 'HYD004' },
  { value: 'Ahmedabad', label: 'Ahmedabad', code: 'AHM005' },
  { value: 'Chennai', label: 'Chennai', code: 'CHE006' },
  { value: 'Kolkata', label: 'Kolkata', code: 'KOL007' },
  { value: 'Surat', label: 'Surat', code: 'SUR008' },
  { value: 'Pune', label: 'Pune', code: 'PUN009' },
  { value: 'Jaipur', label: 'Jaipur', code: 'JAI010' },
  { value: 'Lucknow', label: 'Lucknow', code: 'LUC011' },
  { value: 'Kanpur', label: 'Kanpur', code: 'KAN012' },
  { value: 'Nagpur', label: 'Nagpur', code: 'NAG013' },
  { value: 'Indore', label: 'Indore', code: 'IND014' },
  { value: 'Thane', label: 'Thane', code: 'THA015' },
  { value: 'Bhopal', label: 'Bhopal', code: 'BHO016' },
  { value: 'Visakhapatnam', label: 'Visakhapatnam', code: 'VIS017' },
  { value: 'Pimpri-Chinchwad', label: 'Pimpri-Chinchwad', code: 'PIM018' },
  { value: 'Patna', label: 'Patna', code: 'PAT019' },
  { value: 'Vadodara', label: 'Vadodara', code: 'VAD020' },
  { value: 'Ghaziabad', label: 'Ghaziabad', code: 'GHA021' },
  { value: 'Ludhiana', label: 'Ludhiana', code: 'LUD022' },
  { value: 'Agra', label: 'Agra', code: 'AGR023' },
  { value: 'Nashik', label: 'Nashik', code: 'NAS024' },
  { value: 'Faridabad', label: 'Faridabad', code: 'FAR025' },
  { value: 'Meerut', label: 'Meerut', code: 'MEE026' },
  { value: 'Rajkot', label: 'Rajkot', code: 'RAJ027' },
  { value: 'Kalyan-Dombivli', label: 'Kalyan-Dombivli', code: 'KAL028' },
  { value: 'Vasai-Virar', label: 'Vasai-Virar', code: 'VAS029' },
  { value: 'Varanasi', label: 'Varanasi', code: 'VAR030' },
  { value: 'Srinagar', label: 'Srinagar', code: 'SRI031' },
  { value: 'Aurangabad', label: 'Aurangabad', code: 'AUR032' },
  { value: 'Dhanbad', label: 'Dhanbad', code: 'DHA033' },
  { value: 'Amritsar', label: 'Amritsar', code: 'AMR034' },
  { value: 'Navi Mumbai', label: 'Navi Mumbai', code: 'NAV035' },
  { value: 'Allahabad', label: 'Allahabad', code: 'ALL036' },
  { value: 'Howrah', label: 'Howrah', code: 'HOW037' },
  { value: 'Ranchi', label: 'Ranchi', code: 'RAN038' },
  { value: 'Gwalior', label: 'Gwalior', code: 'GWA039' },
  { value: 'Jabalpur', label: 'Jabalpur', code: 'JAB040' },
  { value: 'Coimbatore', label: 'Coimbatore', code: 'COI041' },
  { value: 'Vijayawada', label: 'Vijayawada', code: 'VIJ042' },
  { value: 'Jodhpur', label: 'Jodhpur', code: 'JOD043' },
  { value: 'Madurai', label: 'Madurai', code: 'MAD044' },
  { value: 'Raipur', label: 'Raipur', code: 'RAI045' },
  { value: 'Kota', label: 'Kota', code: 'KOT046' },
  { value: 'Guwahati', label: 'Guwahati', code: 'GUW047' },
  { value: 'Chandigarh', label: 'Chandigarh', code: 'CHA048' },
  { value: 'Solapur', label: 'Solapur', code: 'SOL049' },
  { value: 'Hubli-Dharwad', label: 'Hubli-Dharwad', code: 'HUB050' },
];

export const OFFERS = [
  { value: 'Welcome Bonus Offer', label: 'Welcome Bonus Offer', code: 'OFF-WBO-01' },
  { value: 'Zero Balance Corporate', label: 'Zero Balance Corporate', code: 'OFF-ZBC-02' },
  { value: 'Premium Wealth Plan', label: 'Premium Wealth Plan', code: 'OFF-PWP-03' },
  { value: 'Student Lite Account', label: 'Student Lite Account', code: 'OFF-SLA-04' },
  { value: 'Senior Citizen Advantage', label: 'Senior Citizen Advantage', code: 'OFF-SCA-05' },
];

export const PRODUCT_CODES_BY_GROUP: Record<string, { value: string; label: string; }[]> = {
  retail: [
    { value: 'RET-SAV-001', label: 'Retail Savings Standard' },
    { value: 'RET-CUR-002', label: 'Retail Current Plus' },
    { value: 'RET-SAL-003', label: 'Retail Salary Account' },
  ],
  corporate: [
    { value: 'CORP-CUR-101', label: 'Corporate Current Prime' },
    { value: 'CORP-EEFC-102', label: 'Corporate EEFC Account' },
  ],
  sme: [
    { value: 'SME-CUR-201', label: 'SME Business Basic' },
    { value: 'SME-CUR-202', label: 'SME Business Pro' },
  ],
  wealth: [
    { value: 'WLTH-SAV-301', label: 'Wealth Savings Elite' },
    { value: 'WLTH-INV-302', label: 'Wealth Investment Account' },
  ],
};
