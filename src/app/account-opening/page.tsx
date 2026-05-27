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
import InitialFundingStep from '@/features/accountOpening/InitialFunding';
import { Bell, ArrowLeft } from 'lucide-react';
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



function AccountOpeningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = searchParams.get('type') || 'savings';
  const accountLabel = ACCOUNT_TYPE_LABELS[accountType] || 'Account';
  const dispatch = useDispatch();
  const { user } = useAuth();

  // ── Pre-flight: check if user has a CBS Customer ID ──────────
  const hasCbsId = !!(user?.cbsCustomerId);

  const currentStep = useSelector((state: RootState) => state.accountOpening.currentStep);
  const isLoading = useSelector((state: RootState) => state.accountOpening.isLoading);

  // Read all step data from Redux (Currently unused)

  const [confirmOpen, setConfirmOpen] = useState(false);

  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);

  // Sync URL account type into Redux so forms pre-fill correctly
  useEffect(() => {
    const productClass = PRODUCT_CLASS_BY_ACCOUNT_TYPE[accountType] || 'CASA';
    dispatch(setNewAccount({ productClass }));
    dispatch(setProductSelection({ accountType, productClass }));
  }, [accountType, dispatch]);

  // Show warning toast if CBS Customer ID is missing
  useEffect(() => {
    if (!hasCbsId) {
      toast.error(
        'CBS Customer ID Missing: Your account was registered without a valid CBS ID — this will cause errors when submitting. Please log out and register again.',
        { duration: 8000, id: 'cbs-missing-toast' }
      );
    }
  }, [hasCbsId]);

  const goNext = () => dispatch(setCurrentStep(currentStep + 1));
  const goBack = () => dispatch(setCurrentStep(currentStep - 1));
  const goToStep = (step: number) => {
    if (step <= currentStep) {
      dispatch(setCurrentStep(step));
    }
  };

  const handleSubmit = async () => {
    if (!accountOpeningRequestId) {
      toast.error('Account Opening ID is missing. Please complete the form properly.');
      setConfirmOpen(false);
      return;
    }

    dispatch(setLoading(true));

    try {
      // ── Final submit ──────────────────────────────────
      const finalResponse = await submitApplication(accountOpeningRequestId);
      if (!finalResponse.success) {
        throw new Error(finalResponse.message || 'Final submission failed');
      }

      toast.success('Account submitted successfully!');
      dispatch(resetAccount());
      router.push('/dashboard');

    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(`Submission failed: ${message}`, { duration: 8000 });
      console.error('Final submit failed', err);
    } finally {
      dispatch(setLoading(false));
      setConfirmOpen(false);
    }
  };

  const progress = ((currentStep + 1) / 8) * 100;

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
        return <NomineeStep onBack={goBack} onComplete={goNext} />;
      case 7:
        return <InitialFundingStep onBack={goBack} onComplete={() => setConfirmOpen(true)} />;
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
        message="All 8 steps are complete. This will send all your data to the backend and create the account. Are you sure you want to proceed?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />


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
