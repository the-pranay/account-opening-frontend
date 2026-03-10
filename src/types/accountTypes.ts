// ═══════════════════════════════════════════════════════════════
// Bank Account Opening System — TypeScript Definitions
// ═══════════════════════════════════════════════════════════════

// Step 1: New Account
export interface NewAccount {
  customerType: string;
  productClass: string;
  customerId: string;
  customerName: string;
  branchCode: string;
  branchName: string;
  currency: string;
  bankCode: string;
}

// Step 2: Product Selection
export interface Fee {
  feeName: string;
  feeType: string;
  baseFees: number;
  negotiatedType: string;
  negotiatedFees: number;
  netFees: number;
}

export interface ProductSelection {
  offerCode: string;
  offerName: string;
  accountType: string;
  productGroup: string;
  productClass: string;
  productCode: string;
  currency: string;
  startDate: string;
  endDate: string;
  fees: Fee[];
}

// Step 3: Relationship
export interface Applicant {
  id: string;
  customerId: string;
  customerName: string;
  customerRole: string;
  isExistingCustomer: boolean;
}

export interface Relationship {
  accountNumber: string;
  modeOfOperation: string;
  applicants: Applicant[];
}

// Step 4: Documents
export interface AccountDocument {
  id: string;
  customerId: string;
  documentType: string;
  documentCategory: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  file?: File;
}

// Step 5: Basic Details
export interface ChequeBook {
  instrumentType: string;
  chequeType: string;
  numberOfLeaves: number;
}

export interface InternetBanking {
  view: boolean;
  perform: boolean;
  approve: boolean;
}

export interface BasicDetails {
  addressType: string;
  accommodationType: string;
  preferredContactNumber: string;
  preferredEmail: string;
  chequeBookFacility: boolean;
  chequeBooks: ChequeBook[];
  internetBanking: InternetBanking;
  accountStatementFacility: string[];
}

// Step 6: Transaction Limits
export interface TransactionLimit {
  id: string;
  channel: string;
  paymentMode: string;
  paymentMethod: string;
  paymentType: string;
  minimumLimit: number;
  maximumLimit: number;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
}

// Step 7: Nominee
export interface NomineeAddress {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  country: string;
  postalCode: string;
}

export interface Nominee {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  relationship: string;
  shareHoldingPercentage: number;
  address: NomineeAddress;
}

// Root state
export interface AccountOpeningState {
  currentStep: number;
  newAccount: NewAccount;
  productSelection: ProductSelection;
  relationship: Relationship;
  documents: AccountDocument[];
  basicDetails: BasicDetails;
  transactionLimits: TransactionLimit[];
  nominees: Nominee[];
  isLoading: boolean;
  isDraftSaved: boolean;
}

// Customer search
export interface CustomerSearchParams {
  customerType: string;
  searchBy: string;
  searchValue: string;
}

export interface CustomerSearchResult {
  customerId: string;
  customerName: string;
  customerType: string;
  branchCode: string;
  status: string;
}

// Offline import
export interface OfflineFormData {
  customerName?: string;
  customerId?: string;
  branchCode?: string;
  accountType?: string;
  nomineeName?: string;
  address?: string;
  phone?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface ParsedOfflineResult {
  data: OfflineFormData[];
  matchedFields: string[];
  missingFields: string[];
  errors: string[];
}
