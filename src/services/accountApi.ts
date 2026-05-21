import axios from 'axios';
import type {
  CustomerSearchParams,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  AuthResponse,
  AccountOpeningResponse,
  NewAccountRequest,
  ProductSelectionRequest,
  RelationshipRequest,
  DocumentUploadRequest,
  BasicDetailsRequest,
  NomineeRequest,
  InitialFundingRequest,
  KycVerifyRequest,
  OcrRequestBody,
  KycResultResponse,
  KycVerifyResponse,
  KycStatusResponse,
} from '@/types/accountTypes';

// ─── Axios Instance ──────────────────────────────────────────
const api = axios.create({
  baseURL: 'https://idigicloudbank-acount-opening-service-1.onrender.com/api',
  timeout: 180000, // 180s — Render free tier needs time for cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (with auto-retry for timeouts) ─────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Auto-retry on timeout or network error (up to 2 retries)
    if (
      (error.code === 'ECONNABORTED' || !error.response) &&
      config &&
      (!config._retryCount || config._retryCount < 2)
    ) {
      config._retryCount = (config._retryCount || 0) + 1;
      console.log(`Retrying request (attempt ${config._retryCount}/2): ${config.url}`);
      return api(config);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth Helpers ────────────────────────────────────────────
export const saveAuthData = (authResponse: AuthResponse) => {
  localStorage.setItem('token', authResponse.accessToken);
  localStorage.setItem('user', JSON.stringify({
    userId: authResponse.userId,
    email: authResponse.email,
    firstName: authResponse.firstName,
    lastName: authResponse.lastName,
    role: authResponse.role,
    cbsCustomerId: authResponse.cbsCustomerId,
    branchCode: authResponse.branchCode,
  }));
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getAuthUser = (): Partial<AuthResponse> | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ═══════════════════════════════════════════════════════════════
// Authentication APIs
// ═══════════════════════════════════════════════════════════════

export const loginUser = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

// ═══════════════════════════════════════════════════════════════
// UI Bridge APIs (match frontend endpoint paths)
// ═══════════════════════════════════════════════════════════════

export const searchCustomer = async (params: CustomerSearchParams) => {
  const { data } = await api.get('/customer/search', { params });
  return data;
};

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const createAccount = async (accountData: Record<string, unknown>) => {
  const { data } = await api.post('/account/create', accountData);
  return data;
};

export const uploadDocument = async (formData: FormData) => {
  const { data } = await api.post('/document/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const addNomineeUI = async (nomineeData: Record<string, unknown>) => {
  const { data } = await api.post('/nominee', nomineeData);
  return data;
};

// ═══════════════════════════════════════════════════════════════
// Account Opening — 7-Step Flow
// ═══════════════════════════════════════════════════════════════

/** Step 1: Initiate new account */
export const initiateNewAccount = async (
  request: NewAccountRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/step1/initiate', request);
  return data;
};

/** Step 2: Select product */
export const selectProduct = async (
  request: ProductSelectionRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/step2/select-product', request);
  return data;
};

/** Step 3: Set relationship & co-applicants */
export const setRelationship = async (
  request: RelationshipRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/step3/set-relationship', request);
  return data;
};

/** Step 4: Upload document */
export const uploadStepDocument = async (
  request: DocumentUploadRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/step4/upload-document', request);
  return data;
};

/** Step 5: Save basic details */
export const saveBasicDetails = async (
  request: BasicDetailsRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/step5/basic-details', request);
  return data;
};

/** Step 6: Get transaction limits (read-only from CBS) */
export const getTransactionLimits = async (
  accountOpeningRequestId: number
): Promise<ApiResponse<unknown>> => {
  const { data } = await api.get(`/account-opening/step6/transaction-limits/${accountOpeningRequestId}`);
  return data;
};

/** Step 7: Add nominees */
export const addNominees = async (
  request: NomineeRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/step7/add-nominees', request);
  return data;
};

/** Step 8: Initial funding */
export const applyInitialFunding = async (
  request: InitialFundingRequest
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post('/account-opening/funding', request);
  return data;
};

/** Submit application (final) */
export const submitApplication = async (
  accountOpeningRequestId: number
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post(`/account-opening/submit/${accountOpeningRequestId}`);
  return data;
};

/** Issue welcome kit */
export const issueWelcomeKit = async (
  accountOpeningRequestId: number
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.post(`/account-opening/welcome-kit/${accountOpeningRequestId}`);
  return data;
};

// ─── Query APIs ──────────────────────────────────────────────

/** Get account opening request by ID */
export const getAccountOpeningById = async (
  id: number
): Promise<ApiResponse<AccountOpeningResponse>> => {
  const { data } = await api.get(`/account-opening/${id}`);
  return data;
};

/** Get all applications for the logged-in user */
export const getMyApplications = async (): Promise<ApiResponse<AccountOpeningResponse[]>> => {
  const { data } = await api.get('/account-opening/my-applications');
  return data;
};

/** Admin: Get all applications */
export const getAllApplications = async (): Promise<ApiResponse<AccountOpeningResponse[]>> => {
  const { data } = await api.get('/account-opening/admin/all');
  return data;
};

// ═══════════════════════════════════════════════════════════════
// KYC APIs
// ═══════════════════════════════════════════════════════════════

/** KYC Verification */
export const verifyKyc = async (
  request: KycVerifyRequest
): Promise<ApiResponse<KycResultResponse>> => {
  const { data } = await api.post('/kyc/verify', request);
  return data;
};

/** OCR Document Extraction */
export const extractOcr = async (
  request: OcrRequestBody
): Promise<ApiResponse<KycVerifyResponse>> => {
  const { data } = await api.post('/kyc/ocr', request);
  return data;
};

/** Get KYC Status */
export const getKycStatus = async (
  accountOpeningRequestId: number
): Promise<ApiResponse<KycStatusResponse>> => {
  const { data } = await api.get(`/kyc/status/${accountOpeningRequestId}`);
  return data;
};

// ─── Error Helper ────────────────────────────────────────────
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Backend returns ApiResponse with message
    const apiMessage = error.response?.data?.message;
    if (apiMessage) return apiMessage;
    if (error.response?.status === 401) return 'Session expired. Please login again.';
    if (error.response?.status === 403) return 'You do not have permission to perform this action.';
    if (error.response?.status === 404) return 'Resource not found.';
    if (error.response?.status === 500) return 'Internal server error. Please try again later.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. The server may be starting up — please try again.';
    if (!error.response) return 'Network error. Please check your connection.';
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
};

export default api;
