'use client';

import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, ProtectedRoute } from '@/services/authContext';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import toast from 'react-hot-toast';
import { applyInitialFunding, getErrorMessage } from '@/services/accountApi';
import { Bell, CheckCircle2, Wallet, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  fundingMode: z.string().min(1, 'Funding mode is required'),
});

type FormData = z.infer<typeof schema>;

const FUNDING_MODES = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'FUND_TRANSFER', label: 'Fund Transfer' },
];

function InitialFundingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountOpeningRequestId = Number(searchParams.get('id'));
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [done, setDone] = useState(false);

  const userInitials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const { control, handleSubmit } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      amount: 0,
      fundingMode: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!accountOpeningRequestId) {
      toast.error('Account Opening ID is missing.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await applyInitialFunding({
        accountOpeningRequestId,
        amount: data.amount,
        fundingMode: data.fundingMode,
      });

      if (response.success) {
        toast.success('Initial funding applied successfully!');
        setDone(true);
      } else {
        throw new Error(response.message || 'Failed to apply initial funding');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9' }}>
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
        {/* Full progress — all 7 steps done */}
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00bfa5, #00e5ff)',
            },
          }}
        />
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Back to Dashboard link */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/dashboard')}
            sx={{ color: 'text.secondary' }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Application Submitted banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CheckCircle2 size={40} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Application Submitted Successfully!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              All 7 steps are complete. Now you can apply the initial deposit to activate your account.
            </Typography>
          </Box>
          {accountOpeningRequestId ? (
            <Chip
              label={`Application ID: ${accountOpeningRequestId}`}
              sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
            />
          ) : null}
        </Paper>

        {/* Initial Funding Form / Success State */}
        {done ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={64} color="#00897b" style={{ margin: '0 auto 16px' }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Initial Funding Applied!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Your account has been funded. The account is now fully activated.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/dashboard')}
              sx={{
                borderRadius: '10px',
                px: 6,
                background: 'linear-gradient(135deg, #00695c, #00897b)',
                '&:hover': { background: 'linear-gradient(135deg, #004d40, #00695c)' },
              }}
            >
              Go to Dashboard
            </Button>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Wallet size={24} color="#00897b" />
              <Typography variant="h6" fontWeight={700}>
                Initial Funding
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Apply the initial deposit amount to activate your account. Mode can be Cash, Cheque, or Fund Transfer.
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormInput
                    name="amount"
                    control={control}
                    label="Deposit Amount (₹)"
                    type="number"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <SelectInput
                    name="fundingMode"
                    control={control}
                    label="Funding Mode"
                    options={FUNDING_MODES}
                    required
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/dashboard')}
                  sx={{ borderRadius: '8px', px: 4 }}
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSaving}
                  startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Wallet size={18} />}
                  sx={{
                    borderRadius: '8px',
                    px: 5,
                    background: 'linear-gradient(135deg, #00695c, #00897b)',
                    '&:hover': { background: 'linear-gradient(135deg, #004d40, #00695c)' },
                  }}
                >
                  {isSaving ? 'Applying Funding...' : 'Apply Initial Funding'}
                </Button>
              </Box>
            </form>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default function InitialFundingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
        <InitialFundingContent />
      </Suspense>
    </ProtectedRoute>
  );
}
