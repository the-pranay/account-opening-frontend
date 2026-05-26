'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNewAccount,
  importOfflineData,
  setAccountOpeningRequestId,
  setAccountStatus,
} from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import { CUSTOMER_TYPES, PRODUCT_CLASSES, CURRENCIES } from '@/constants/formFields';
import { parseOfflineForm } from '@/utils/offlineFormParser';
import { initiateNewAccount, getErrorMessage, getAuthUser } from '@/services/accountApi';
import { FileSpreadsheet, CheckCircle, AlertCircle, User, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Validation Schema ───────────────────────────────────────
// Note: customerId and customerName are display-only (read from auth),
// so they are NOT in the schema — only the fields actually sent to backend.
const schema = z.object({
  customerType: z.string().min(1, 'Customer Type is required'),
  productClass: z.string().min(1, 'Product Class is required'),
  branchCode: z
    .string()
    .min(1, 'Branch Code is required')
    .regex(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed')
    .min(2, 'Branch Code must be at least 2 characters')
    .max(15, 'Branch Code must be at most 15 characters'),
  currencyCode: z.string().min(1, 'Currency is required'),
});

type FormData = z.infer<typeof schema>;

interface NewAccountProps {
  onNext: () => void;
}

export default function NewAccountStep({ onNext }: NewAccountProps) {
  const dispatch = useDispatch();
  const savedData = useSelector((state: RootState) => state.accountOpening.newAccount);
  const [importResult, setImportResult] = useState<{
    matched: string[];
    missing: string[];
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Read the logged-in user's CBS customer ID and name from localStorage
  const authUser = getAuthUser();
  const displayCustomerId = authUser?.cbsCustomerId ?? '—';
  const displayCustomerName =
    authUser?.firstName || authUser?.lastName
      ? `${authUser?.firstName ?? ''} ${authUser?.lastName ?? ''}`.trim()
      : '—';

  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerType: savedData.customerType || '',
      productClass: savedData.productClass || '',
      branchCode: savedData.branchCode || authUser?.branchCode || '',
      currencyCode: savedData.currency || 'INR',
    },
  });

  // Pre-fill branchCode from user profile if available and not already set
  useEffect(() => {
    if (!savedData.branchCode && authUser?.branchCode) {
      setValue('branchCode', authUser.branchCode);
    }
  }, [authUser?.branchCode, savedData.branchCode, setValue]);

  const onSubmit = async (data: FormData) => {
    // Persist form state to Redux (keep existing fields, update changed ones)
    dispatch(
      setNewAccount({
        customerType: data.customerType,
        productClass: data.productClass,
        branchCode: data.branchCode,
        currency: data.currencyCode,
        // Display-only — stored so other steps can read them
        customerId: authUser?.cbsCustomerId ?? '',
        customerName: displayCustomerName,
        bankCode: 'AXB',
      })
    );

    setSubmitting(true);
    try {
      const response = await initiateNewAccount({
        productClass: data.productClass as 'CASA' | 'LOAN' | 'TD' | 'RD',
        customerType: data.customerType,
        branchCode: data.branchCode,
        currencyCode: data.currencyCode,
      });

      if (response.success && response.data) {
        dispatch(setAccountOpeningRequestId(response.data.id));
        dispatch(setAccountStatus(response.data.status));
        toast.success('Account initiated successfully');
        onNext();
      } else {
        toast.error(response.message || 'Failed to initiate account');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOfflineImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await parseOfflineForm(file);
        if (result.errors.length > 0) {
          toast.error(result.errors[0]);
          return;
        }
        if (result.data.length > 0) {
          dispatch(importOfflineData(result.data[0]));
          reset({
            customerType: savedData.customerType || '',
            productClass: savedData.productClass || '',
            branchCode: result.data[0].branchCode || savedData.branchCode || '',
            currencyCode: savedData.currency || 'INR',
          });
          setImportResult({ matched: result.matchedFields, missing: result.missingFields });
          toast.success(`Imported ${result.matchedFields.length} fields from file`);
        }
      } catch {
        toast.error('Failed to parse file');
      }
      e.target.value = '';
    },
    [dispatch, reset, savedData]
  );

  return (
    <Paper
      elevation={0}
      sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          New Account Details
        </Typography>
        <Button
          component="label"
          variant="outlined"
          startIcon={<FileSpreadsheet size={18} />}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Import Offline Form
          <input type="file" hidden accept=".xlsx,.xls,.csv" onChange={handleOfflineImport} />
        </Button>
      </Box>

      {/* ── Import Result ── */}
      {importResult && (
        <Alert
          severity={importResult.missing.length > 0 ? 'warning' : 'success'}
          sx={{ mb: 3, borderRadius: '8px' }}
          onClose={() => setImportResult(null)}
        >
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Matched:
              </Typography>
              {importResult.matched.map((f) => (
                <Chip key={f} label={f} size="small" color="success" icon={<CheckCircle size={14} />} />
              ))}
            </Box>
            {importResult.missing.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  Missing:
                </Typography>
                {importResult.missing.map((f) => (
                  <Chip key={f} label={f} size="small" color="warning" icon={<AlertCircle size={14} />} />
                ))}
              </Box>
            )}
          </Box>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* ── Read-only: Customer ID (from CBS, set at registration) ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
            CBS Customer ID
          </Typography>
          <TextField
            fullWidth
            value={displayCustomerId}
            disabled
            size="small"
            InputProps={{
              startAdornment: <Hash size={16} style={{ marginRight: 6, color: '#78909c' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f5f5f5' },
            }}
            helperText="Assigned during registration"
          />
        </Grid>

        {/* ── Read-only: Customer Name ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
            Customer Name
          </Typography>
          <TextField
            fullWidth
            value={displayCustomerName}
            disabled
            size="small"
            InputProps={{
              startAdornment: <User size={16} style={{ marginRight: 6, color: '#78909c' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f5f5f5' },
            }}
            helperText="From your registered profile"
          />
        </Grid>

        {/* ── Customer Type ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput
            name="customerType"
            control={control}
            label="Customer Type"
            options={CUSTOMER_TYPES}
            required
          />
        </Grid>

        {/* ── Product Class ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput
            name="productClass"
            control={control}
            label="Product Class"
            options={PRODUCT_CLASSES}
            required
          />
        </Grid>

        {/* ── Branch Code ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="branchCode" control={control} label="Branch Code" required />
        </Grid>

        {/* ── Currency ── */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput
            name="currencyCode"
            control={control}
            label="Currency"
            options={CURRENCIES}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          size="large"
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          sx={{ borderRadius: '8px', px: 4 }}
        >
          {submitting ? 'Initiating…' : 'Save & Continue'}
        </Button>
      </Box>
    </Paper>
  );
}
