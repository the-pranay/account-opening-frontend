import axios from 'axios';
import type { CustomerSearchParams, OfflineFormData } from '@/types/accountTypes';
import type { AccountOpeningState } from '@/types/accountTypes';

// Axios instance with interceptors
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Attach auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Could refresh token here
    }
    return Promise.reject(error);
  }
);

// ─── API Functions ───────────────────────────────────────────

export const searchCustomer = async (params: CustomerSearchParams) => {
  const { data } = await api.get('/customer/search', { params });
  return data;
};

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const createAccount = async (accountData: Partial<AccountOpeningState>) => {
  const { data } = await api.post('/account/create', accountData);
  return data;
};

export const uploadDocument = async (formData: FormData) => {
  const { data } = await api.post('/document/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const addNominee = async (nomineeData: OfflineFormData) => {
  const { data } = await api.post('/nominee', nomineeData);
  return data;
};

// ─── Mock Data (for development without backend) ────────────

export const MOCK_CUSTOMERS = [
  { customerId: 'CUST001', customerName: 'Rajesh Kumar', customerType: 'Individual', branchCode: 'BR001', status: 'Active' },
  { customerId: 'CUST002', customerName: 'Priya Sharma', customerType: 'Individual', branchCode: 'BR002', status: 'Active' },
  { customerId: 'CUST003', customerName: 'Tata Industries Ltd', customerType: 'Corporate', branchCode: 'BR001', status: 'Active' },
  { customerId: 'CUST004', customerName: 'Amit Patel', customerType: 'Individual', branchCode: 'BR003', status: 'Inactive' },
  { customerId: 'CUST005', customerName: 'Global Solutions Pvt Ltd', customerType: 'Corporate', branchCode: 'BR002', status: 'Active' },
];

export const MOCK_PRODUCTS = [
  { productCode: 'SAV001', productName: 'Regular Savings', productClass: 'Savings', productGroup: 'Retail' },
  { productCode: 'SAV002', productName: 'Premium Savings', productClass: 'Savings', productGroup: 'Wealth' },
  { productCode: 'CUR001', productName: 'Business Current', productClass: 'Current', productGroup: 'Corporate' },
  { productCode: 'SAL001', productName: 'Salary Account', productClass: 'Salary', productGroup: 'Retail' },
];

export const MOCK_FEES = [
  { feeName: 'Account Opening Fee', feeType: 'One Time', baseFees: 500, negotiatedType: 'Flat', negotiatedFees: 100, netFees: 400 },
  { feeName: 'Annual Maintenance', feeType: 'Recurring', baseFees: 750, negotiatedType: 'Percentage', negotiatedFees: 10, netFees: 675 },
  { feeName: 'Cheque Book Fee', feeType: 'One Time', baseFees: 200, negotiatedType: 'None', negotiatedFees: 0, netFees: 200 },
  { feeName: 'Debit Card Fee', feeType: 'Recurring', baseFees: 300, negotiatedType: 'Flat', negotiatedFees: 50, netFees: 250 },
];

export const MOCK_TRANSACTION_LIMITS = [
  { id: '1', channel: 'Internet Banking', paymentMode: 'NEFT', paymentMethod: 'Debit', paymentType: 'Domestic', minimumLimit: 1, maximumLimit: 1000000, dailyLimit: 2000000, weeklyLimit: 10000000, monthlyLimit: 50000000 },
  { id: '2', channel: 'Mobile Banking', paymentMode: 'IMPS', paymentMethod: 'Debit', paymentType: 'Domestic', minimumLimit: 1, maximumLimit: 500000, dailyLimit: 1000000, weeklyLimit: 5000000, monthlyLimit: 20000000 },
  { id: '3', channel: 'Internet Banking', paymentMode: 'RTGS', paymentMethod: 'Debit', paymentType: 'Domestic', minimumLimit: 200000, maximumLimit: 5000000, dailyLimit: 10000000, weeklyLimit: 50000000, monthlyLimit: 100000000 },
  { id: '4', channel: 'ATM', paymentMode: 'UPI', paymentMethod: 'Debit', paymentType: 'Domestic', minimumLimit: 1, maximumLimit: 100000, dailyLimit: 200000, weeklyLimit: 500000, monthlyLimit: 2000000 },
  { id: '5', channel: 'Branch', paymentMode: 'NEFT', paymentMethod: 'Credit', paymentType: 'International', minimumLimit: 1000, maximumLimit: 2000000, dailyLimit: 5000000, weeklyLimit: 20000000, monthlyLimit: 50000000 },
];

export default api;
