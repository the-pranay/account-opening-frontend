'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { setCurrentStep, resetAccount, setLoading, setNewAccount, setProductSelection } from '@/store/accountSlice';
import { createAccount } from '@/services/accountApi';
import AccountStepper from '@/components/stepper/AccountStepper';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import NewAccountStep from '@/features/accountOpening/NewAccount';
import ProductSelectionStep from '@/features/accountOpening/ProductSelection';
import RelationshipStep from '@/features/accountOpening/Relationship';
import DocumentsStep from '@/features/accountOpening/Documents';
import BasicDetailsStep from '@/features/accountOpening/BasicDetails';
import TransactionLimitsStep from '@/features/accountOpening/TransactionLimits';
import NomineeStep from '@/features/accountOpening/Nominee';
import { Building2, Bell, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  savings: 'Savings Account',
  current: 'Current Account',
  fd: 'Fixed Deposit (FD) Account',
  rd: 'Recurring Deposit (RD) Account',
  salary: 'Salary Account',
};

export default function AccountOpeningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = searchParams.get('type') || 'savings';
  const accountLabel = ACCOUNT_TYPE_LABELS[accountType] || 'Account';
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.accountOpening.currentStep);
  const isLoading = useSelector((state: RootState) => state.accountOpening.isLoading);
  const accountState = useSelector((state: RootState) => state.accountOpening);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Sync URL account type into Redux so forms pre-fill correctly
  useEffect(() => {
    dispatch(setNewAccount({ productClass: accountType }));
    dispatch(setProductSelection({ accountType }));
  }, [accountType, dispatch]);

  const goNext = () => dispatch(setCurrentStep(currentStep + 1));
  const goBack = () => dispatch(setCurrentStep(currentStep - 1));
  const goToStep = (step: number) => {
    if (step <= currentStep) {
      dispatch(setCurrentStep(step));
    }
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    try {
      await createAccount(accountState);
      toast.success('Account created successfully!');
      dispatch(resetAccount());
      router.push('/dashboard');
    } catch {
      // Mock success for development
      toast.success('Account created successfully! (Mock)');
      dispatch(resetAccount());
      router.push('/dashboard');
    } finally {
      dispatch(setLoading(false));
      setConfirmOpen(false);
    }
  };

  const progress = ((currentStep + 1) / 7) * 100;

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Building2 size={28} color="#00bfa5" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
              CoreBank
              <Typography component="span" sx={{ fontSize: '0.75rem', ml: 1, opacity: 0.6, fontWeight: 400 }}>
                Account Opening System
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Bell size={20} color="rgba(255,255,255,0.6)" />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#00695c', fontSize: '0.85rem' }}>BK</Avatar>
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
        title="Submit Account"
        message="Do you want to perform this transaction? This will create the account in the system."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />

      {/* Full-screen loading overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '16px',
              p: 4,
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Processing...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Creating account, please wait
            </Typography>
            <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
