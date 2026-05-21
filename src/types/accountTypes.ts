// ═══════════════════════════════════════════════════════════════
// Bank Account Opening System — TypeScript Definitions
// ═══════════════════════════════════════════════════════════════

// ─── Generic API Response ────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ─── Authentication ──────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  branchCode?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  cbsCustomerId: string;
  branchCode: string;
}

// ─── Account Opening Request/Response ────────────────────────
export interface NewAccountRequest {
  productClass: 'CASA' | 'LOAN' | 'TD' | 'RD';
  customerType: string;
  branchCode: string;
  currencyCode?: string;
}

export interface ProductSelectionRequest {
  accountOpeningRequestId: number;
  offerCode: string;
  productCode: string;
  offerName?: string;
  accountType?: string;
  productGroup?: string;
  totalFees?: number;
  operatingInstructionTemplateId?: string;
}

export interface CoApplicantRequest {
  cbsCustomerId: string;
  customerName: string;
  customerRole: string;
  existingCustomer: boolean;
}

export interface RelationshipRequest {
  accountOpeningRequestId: number;
  modeOfOperation: string;
  coApplicants?: CoApplicantRequest[];
}

export interface DocumentUploadRequest {
  accountOpeningRequestId: number;
  documentType: string;
  documentCategory: string;
  fileName: string;
  indexCategory?: string;
  documentId?: string;
  versionNo?: number;
  filePath?: string;
}

export interface BasicDetailsRequest {
  accountOpeningRequestId: number;
  accountName?: string;
  debitCardVariant?: string;
  netBankingRequested?: boolean;
  mobileBankingRequested?: boolean;
  chequeBookRequested?: boolean;
  passbookRequested?: boolean;
  preferredContactNumber?: string;
  preferredEmail?: string;
}

export interface NomineeDetail {
  firstName: string;
  middleName?: string;
  lastName?: string;
  gender: string;
  dateOfBirth: string;
  relationship: string;
  sharePercentage: number;
  mobileNumber?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  postalCode?: string;
}

export interface NomineeRequest {
  accountOpeningRequestId: number;
  nominees: NomineeDetail[];
}

export interface InitialFundingRequest {
  accountOpeningRequestId: number;
  amount: number;
  fundingMode: string;
}

// ─── Account Opening Response ────────────────────────────────
export interface CoApplicantResponse {
  id: number;
  cbsCustomerId: string;
  customerName: string;
  customerRole: string;
  existingCustomer: boolean;
}

export interface NomineeResponse {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  relationship: string;
  sharePercentage: number;
  mobileNumber: string;
  email: string;
}

export type AccountStatus =
  | 'DRAFT'
  | 'PRODUCT_SELECTED'
  | 'RELATIONSHIP_SET'
  | 'DOCUMENTS_UPLOADED'
  | 'BASIC_DETAILS_DONE'
  | 'LIMITS_CONFIGURED'
  | 'NOMINEE_ADDED'
  | 'SUBMITTED'
  | 'KYC_PENDING'
  | 'KYC_VERIFIED'
  | 'ACTIVE'
  | 'REJECTED';

export interface AccountOpeningResponse {
  id: number;
  productClass: 'CASA' | 'LOAN' | 'TD' | 'RD';
  customerType: string;
  branchCode: string;
  bankCode: string;
  currencyCode: string;
  offerCode: string;
  offerName: string;
  productCode: string;
  accountType: string;
  totalFees: number;
  cbsAccountNumber: string;
  modeOfOperation: string;
  coApplicants: CoApplicantResponse[];
  accountName: string;
  debitCardVariant: string;
  nominees: NomineeResponse[];
  initialFundingAmount: number;
  fundingMode: string;
  cbsCustomerId: string;
  welcomeKitReference: string;
  status: AccountStatus;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}

// ─── KYC ─────────────────────────────────────────────────────
export interface KycVerifyRequest {
  accountOpeningRequestId: number;
  aadhaarNumber: string;
  panNumber: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface KycResultResponse {
  accountOpeningRequestId: number;
  verified: boolean;
  amlClean: boolean;
  riskScore: number;
  kycStatus: string;
  remarks: string;
  accountOpeningStatus: string;
  approved: boolean;
}

export interface OcrRequestBody {
  accountOpeningRequestId: number;
  documentPath: string;
  documentType: string;
}

export interface KycVerifyResponse {
  verified: boolean;
  amlClean: boolean;
  riskScore: number;
  status: string;
  remarks: string;
  extractedName: string;
  extractedDob: string;
  extractedAddress: string;
  approved: boolean;
}

export interface KycStatusResponse {
  accountOpeningRequestId: number;
  currentStatus: string;
  kycVerified: boolean;
  canProceed: boolean;
}

// ─── Legacy Frontend Types (kept for component compatibility) ─

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
  accountOpeningRequestId: number | null;
  cbsAccountNumber: string;
  status: AccountStatus | '';
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
