'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import toast from 'react-hot-toast';
import { applyInitialFunding, getErrorMessage } from '@/services/accountApi';

const schema = z.object({
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
  fundingMode: z.string().min(1, 'Funding mode is required'),
});

type FormData = z.infer<typeof schema>;

const FUNDING_MODES = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'FUND_TRANSFER', label: 'Fund Transfer' },
];

interface InitialFundingProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function InitialFundingStep({ onBack, onComplete }: InitialFundingProps) {
  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);
  const [isSaving, setIsSaving] = useState(false);

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
      toast.error('Account Opening ID is missing. Please complete Step 1 first.');
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
        toast.success('Initial funding applied successfully');
        onComplete();
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
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Initial Funding
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Apply initial deposit amount. Mode can be Cash, Cheque, or Fund Transfer.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInput
              name="amount"
              control={control}
              label="Amount"
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
          <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="large"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: '8px', px: 4 }}
          >
            Save & Continue
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
