'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  AccountOpeningState,
  NewAccount,
  ProductSelection,
  Relationship,
  Applicant,
  AccountDocument,
  BasicDetails,
  TransactionLimit,
  Nominee,
  OfflineFormData,
} from '@/types/accountTypes';

const initialNewAccount: NewAccount = {
  customerType: '',
  productClass: '',
  customerId: '',
  customerName: '',
  branchCode: '',
  branchName: '',
  currency: 'INR',
  bankCode: '',
};

const initialProductSelection: ProductSelection = {
  offerCode: '',
  offerName: '',
  accountType: '',
  productGroup: '',
  productClass: '',
  productCode: '',
  currency: 'INR',
  startDate: '',
  endDate: '',
  fees: [],
};

const initialRelationship: Relationship = {
  accountNumber: '',
  modeOfOperation: '',
  applicants: [],
};

const initialBasicDetails: BasicDetails = {
  addressType: '',
  accommodationType: '',
  preferredContactNumber: '',
  preferredEmail: '',
  chequeBookFacility: false,
  chequeBooks: [],
  internetBanking: { view: false, perform: false, approve: false },
  accountStatementFacility: [],
};

const initialState: AccountOpeningState = {
  currentStep: 0,
  newAccount: initialNewAccount,
  productSelection: initialProductSelection,
  relationship: initialRelationship,
  documents: [],
  basicDetails: initialBasicDetails,
  transactionLimits: [],
  nominees: [],
  isLoading: false,
  isDraftSaved: false,
};

const accountSlice = createSlice({
  name: 'accountOpening',
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    setNewAccount(state, action: PayloadAction<Partial<NewAccount>>) {
      state.newAccount = { ...state.newAccount, ...action.payload };
      state.isDraftSaved = false;
    },
    setProductSelection(state, action: PayloadAction<Partial<ProductSelection>>) {
      state.productSelection = { ...state.productSelection, ...action.payload };
      state.isDraftSaved = false;
    },
    setRelationship(state, action: PayloadAction<Partial<Relationship>>) {
      state.relationship = { ...state.relationship, ...action.payload };
      state.isDraftSaved = false;
    },
    addApplicant(state, action: PayloadAction<Applicant>) {
      state.relationship.applicants.push(action.payload);
      state.isDraftSaved = false;
    },
    removeApplicant(state, action: PayloadAction<string>) {
      state.relationship.applicants = state.relationship.applicants.filter(
        (a) => a.id !== action.payload
      );
    },
    addDocument(state, action: PayloadAction<AccountDocument>) {
      state.documents.push(action.payload);
      state.isDraftSaved = false;
    },
    removeDocument(state, action: PayloadAction<string>) {
      state.documents = state.documents.filter((d) => d.id !== action.payload);
    },
    setBasicDetails(state, action: PayloadAction<Partial<BasicDetails>>) {
      state.basicDetails = { ...state.basicDetails, ...action.payload };
      state.isDraftSaved = false;
    },
    setTransactionLimits(state, action: PayloadAction<TransactionLimit[]>) {
      state.transactionLimits = action.payload;
      state.isDraftSaved = false;
    },
    addNominee(state, action: PayloadAction<Nominee>) {
      state.nominees.push(action.payload);
      state.isDraftSaved = false;
    },
    removeNominee(state, action: PayloadAction<string>) {
      state.nominees = state.nominees.filter((n) => n.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    saveDraft(state) {
      state.isDraftSaved = true;
    },
    importOfflineData(state, action: PayloadAction<OfflineFormData>) {
      const d = action.payload;
      if (d.customerName) state.newAccount.customerName = d.customerName;
      if (d.customerId) state.newAccount.customerId = d.customerId;
      if (d.branchCode) state.newAccount.branchCode = d.branchCode;
      if (d.accountType) state.productSelection.accountType = d.accountType;
      if (d.phone) state.basicDetails.preferredContactNumber = d.phone;
      if (d.email) state.basicDetails.preferredEmail = d.email;
      state.isDraftSaved = false;
    },
    resetAccount() {
      return initialState;
    },
  },
});

export const {
  setCurrentStep,
  setNewAccount,
  setProductSelection,
  setRelationship,
  addApplicant,
  removeApplicant,
  addDocument,
  removeDocument,
  setBasicDetails,
  setTransactionLimits,
  addNominee,
  removeNominee,
  setLoading,
  saveDraft,
  importOfflineData,
  resetAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
