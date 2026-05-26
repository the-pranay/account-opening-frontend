'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  setCurrentStep,
  resetAccount,
  setLoading,
  setNewAccount,
  setProductSelection,
} from '@/store/accountSlice';
import {
  selectProduct,
  setRelationship as setRelationshipApi,
  uploadDocument,
  uploadStepDocument,
  saveBasicDetails as saveBasicDetailsApi,
  addNominees,
  submitApplication,
  getErrorMessage,
} from '@/services/accountApi';
import { useAuth, ProtectedRoute } from '@/services/authContext';
import AccountStepper from '@/components/stepper/AccountStepper';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import NewAccountStep from '@/features/accountOpening/NewAccount';
import ProductSelectionStep from '@/features/accountOpening/ProductSelection';
import RelationshipStep from '@/features/accountOpening/Relationship';
import DocumentsStep from '@/features/accountOpening/Documents';
import BasicDetailsStep from '@/features/accountOpening/BasicDetails';
import TransactionLimitsStep from '@/features/accountOpening/TransactionLimits';
import NomineeStep from '@/features/accountOpening/Nominee';
import { Bell, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  savings: 'Savings Account',
  current: 'Current Account',
  fd: 'Fixed Deposit (FD) Account',
  rd: 'Recurring Deposit (RD) Account',
  salary: 'Salary Account',
};

const PRODUCT_CLASS_BY_ACCOUNT_TYPE: Record<string, 'CASA' | 'TD' | 'RD'> = {
  savings: 'CASA',
  current: 'CASA',
  salary: 'CASA',
  fd: 'TD',
  rd: 'RD',
};

// Individual submit progress steps shown in the overlay
const SUBMIT_STAGES = [
  'Saving product selection...',
  'Saving relationship details...',
  'Uploading documents...',
  'Saving basic details...',
  'Adding nominees...',
  'Finalizing & submitting account...',
];

function AccountOpeningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = searchParams.get('type') || 'savings';
  const accountLabel = ACCOUNT_TYPE_LABELS[accountType] || 'Account';
  const dispatch = useDispatch();
  const { user } = useAuth();

  const currentStep = useSelector((state: RootState) => state.accountOpening.currentStep);
  const isLoading = useSelector((state: RootState) => state.accountOpening.isLoading);

  // Read all step data from Redux
  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);
  const productSelection = useSelector((state: RootState) => state.accountOpening.productSelection);
  const relationship = useSelector((state: RootState) => state.accountOpening.relationship);
  const documents = useSelector((state: RootState) => state.accountOpening.documents);
  const basicDetails = useSelector((state: RootState) => state.accountOpening.basicDetails);
  const nominees = useSelector((state: RootState) => state.accountOpening.nominees);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitStage, setSubmitStage] = useState(0); // 0 = not submitting

  // Sync URL account type into Redux so forms pre-fill correctly
  useEffect(() => {
    const productClass = PRODUCT_CLASS_BY_ACCOUNT_TYPE[accountType] || 'CASA';
    dispatch(setNewAccount({ productClass }));
    dispatch(setProductSelection({ accountType, productClass }));
  }, [accountType, dispatch]);

  const goNext = () => dispatch(setCurrentStep(currentStep + 1));
  const goBack = () => dispatch(setCurrentStep(currentStep - 1));
  const goToStep = (step: number) => {
    if (step <= currentStep) {
      dispatch(setCurrentStep(step));
    }
  };

  /**
   * FINAL SUBMIT — fires remaining API calls sequentially after user confirms on Step 7.
   * 1. Select product
   * 2. Set relationship
   * 3. Upload each document (file upload + step attachment)
   * 4. Save basic details
   * 5. Add nominees
   * 6. Final submit
   */
  const handleSubmit = async () => {
    dispatch(setLoading(true));

    try {
      if (!accountOpeningRequestId) {
        throw new Error('Account opening request ID is missing. Please restart the process.');
      }

      // ── Step 1: Select product ────────────────────────────────
      setSubmitStage(1);
      const step2Response = await selectProduct({
        accountOpeningRequestId,
        offerCode: productSelection.offerCode,
        productCode: productSelection.productCode,
        offerName: productSelection.offerName,
        accountType: productSelection.accountType,
        productGroup: productSelection.productGroup,
        totalFees: 0,
      });

      if (!step2Response.success) {
        throw new Error(step2Response.message || 'Failed to save product selection');
      }

      // ── Step 2: Set relationship ──────────────────────────────
      setSubmitStage(2);
      const step3Response = await setRelationshipApi({
        accountOpeningRequestId,
        modeOfOperation: relationship.modeOfOperation,
        coApplicants: relationship.applicants.map((a) => ({
          cbsCustomerId: a.customerId,
          customerName: a.customerName,
          customerRole: a.customerRole,
          existingCustomer: a.isExistingCustomer,
        })),
      });

      if (!step3Response.success) {
        throw new Error(step3Response.message || 'Failed to save relationship details');
      }

      // ── Step 3: Upload documents ──────────────────────────────
      setSubmitStage(3);
      for (const doc of documents) {
        if (!doc.file) continue;

        const uploadResponse = await uploadDocument({
          file: doc.file,
          documentType: doc.documentType,
          documentCategory: doc.documentCategory,
          customerId: doc.customerId,
          accountOpeningId: accountOpeningRequestId,
        });

        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || `Failed to upload document: ${doc.fileName}`);
        }

        const uploaded = uploadResponse.data || {};
        const documentId = typeof uploaded.documentId === 'string' ? uploaded.documentId : undefined;
        const filePath =
          typeof uploaded.filePath === 'string'
            ? uploaded.filePath
            : typeof uploaded.documentPath === 'string'
              ? uploaded.documentPath
              : undefined;

        const stepDocResponse = await uploadStepDocument({
          accountOpeningRequestId,
          documentType: doc.documentType,
          documentCategory: doc.documentCategory,
          fileName: doc.fileName,
          documentId,
          filePath,
        });

        if (!stepDocResponse.success) {
          throw new Error(stepDocResponse.message || `Failed to attach document: ${doc.fileName}`);
        }
      }

      // ── Step 4: Save basic details ────────────────────────────
      setSubmitStage(4);
      const step5Response = await saveBasicDetailsApi({
        accountOpeningRequestId,
        preferredContactNumber: basicDetails.preferredContactNumber,
        preferredEmail: basicDetails.preferredEmail,
        chequeBookRequested: basicDetails.chequeBookFacility,
        netBankingRequested: basicDetails.internetBanking.view || basicDetails.internetBanking.perform,
        mobileBankingRequested: basicDetails.internetBanking.perform,
        passbookRequested: true,
      });

      if (!step5Response.success) {
        throw new Error(step5Response.message || 'Failed to save basic details');
      }

      // ── Step 5: Add nominees ──────────────────────────────────
      setSubmitStage(5);
      const step6Response = await addNominees({
        accountOpeningRequestId,
        nominees: nominees.map((n) => ({
          firstName: n.firstName,
          middleName: n.middleName || undefined,
          lastName: n.lastName || undefined,
          gender: n.gender,
          dateOfBirth: n.dateOfBirth,
          relationship: n.relationship,
          sharePercentage: n.shareHoldingPercentage,
          addressLine1: n.address?.addressLine1,
          addressLine2: n.address?.addressLine2,
          country: n.address?.country,
          postalCode: n.address?.postalCode,
        })),
      });

      if (!step6Response.success) {
        throw new Error(step6Response.message || 'Failed to save nominees');
      }

      // ── Step 6: Final submit ──────────────────────────────────
      setSubmitStage(6);
      const finalResponse = await submitApplication(accountOpeningRequestId);
      if (!finalResponse.success) {
        throw new Error(finalResponse.message || 'Final submission failed');
      }

      toast.success('Account submitted successfully!');
      dispatch(resetAccount());
      router.push('/dashboard');

    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(`Submission failed at Step ${submitStage}: ${message}`);
      console.error('Batch submit failed at stage', submitStage, err);
    } finally {
      dispatch(setLoading(false));
      setSubmitStage(0);
      setConfirmOpen(false);
    }
  };

  const progress = ((currentStep + 1) / 7) * 100;

  const userInitials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <NewAccountStep onNext={goNext} />;
      case 1:
        return <ProductSelectionStep onNext={goNext} onBack={goBack} />;
      case 2:
        return <RelationshipStep onNext={goNext} onBack={goBack} />;
      case 3:
        return <DocumentsStep onNext={goNext} onBack={goBack} />;
      case 4:
        return <BasicDetailsStep onNext={goNext} onBack={goBack} />;
      case 5:
        return <TransactionLimitsStep onNext={goNext} onBack={goBack} />;
      case 6:
        return <NomineeStep onBack={goBack} onComplete={() => setConfirmOpen(true)} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #001e3c 0%, #003c50 50%, #004d40 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ height: 38, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/idigibank-logo.png"
                alt="idigiBank"
                width={240}
                height={80}
                style={{ marginTop: -21, marginBottom: -21, objectFit: 'contain' }}
                priority
              />
            </Box>
            <Typography component="span" sx={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 400, color: '#fff' }}>
              Account Opening System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Bell size={20} color="rgba(255,255,255,0.6)" />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#00695c', fontSize: '0.85rem' }}>{userInitials}</Avatar>
          </Box>
        </Toolbar>
        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00bfa5, #00e5ff)',
            },
          }}
        />
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Back button + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/dashboard')}
            sx={{ color: 'text.secondary' }}
          >
            Back to Dashboard
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h5" fontWeight={700}>
            {accountLabel} Opening
          </Typography>
        </Box>

        {/* Stepper */}
        <AccountStepper activeStep={currentStep} onStepClick={goToStep} />

        {/* Step Content */}
        <Box className="animate-fade-in" key={currentStep}>
          {renderStep()}
        </Box>
      </Container>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Submit Account Application"
        message="All 7 steps are complete. This will send all your data to the backend and create the account. Are you sure you want to proceed?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />

      {/* Full-screen submit progress overlay */}
      {isLoading && submitStage > 0 && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '20px',
              p: 4,
              width: 420,
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              Submitting Application
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please wait while we process all 7 steps...
            </Typography>

            {/* Stage list */}
            {SUBMIT_STAGES.map((stage, index) => {
              const stageNum = index + 1;
              const isDone = stageNum < submitStage;
              const isActive = stageNum === submitStage;
              return (
                <Box
                  key={stage}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 0.8,
                    opacity: stageNum > submitStage ? 0.35 : 1,
                    transition: 'opacity 0.3s',
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} color="#00695c" />
                  ) : (
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isActive ? '#00695c' : '#ccc',
                        bgcolor: isActive ? 'transparent' : 'transparent',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {isActive && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: '2px',
                            borderRadius: '50%',
                            bgcolor: '#00695c',
                            animation: 'pulse 1s ease-in-out infinite',
                          }}
                        />
                      )}
                    </Box>
                  )}
                  <Typography
                    variant="body2"
                    fontWeight={isDone || isActive ? 600 : 400}
                    color={isDone ? 'success.main' : isActive ? 'text.primary' : 'text.disabled'}
                  >
                    {isDone ? `Step ${stageNum} ✓` : stage}
                  </Typography>
                </Box>
              );
            })}

            <LinearProgress
              sx={{
                mt: 3,
                borderRadius: 2,
                height: 6,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #00695c, #00bfa5)',
                  borderRadius: 2,
                },
              }}
              variant="determinate"
              value={((submitStage - 1) / SUBMIT_STAGES.length) * 100}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              Step {submitStage} of {SUBMIT_STAGES.length}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function AccountOpeningPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
        <AccountOpeningContent />
      </Suspense>
    </ProtectedRoute>
  );
}
