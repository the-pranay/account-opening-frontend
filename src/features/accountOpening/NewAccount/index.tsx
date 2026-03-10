'use client';

import React, { useCallback, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setNewAccount, importOfflineData } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import { CUSTOMER_TYPES, PRODUCT_CLASSES, CURRENCIES } from '@/constants/formFields';
import { parseOfflineForm } from '@/utils/offlineFormParser';
import { FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  customerType: z.string().min(1, 'Customer Type is required'),
  productClass: z.string().min(1, 'Product Class is required'),
  customerId: z.string()
    .min(1, 'Customer ID is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed')
    .min(3, 'Customer ID must be at least 3 characters')
    .max(20, 'Customer ID must be at most 20 characters'),
  customerName: z.string()
    .min(1, 'Customer Name is required')
    .regex(/^[A-Za-z\s.]+$/, 'Only letters, spaces, and dots allowed')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  branchCode: z.string()
    .min(1, 'Branch Code is required')
    .regex(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed')
    .min(2, 'Branch Code must be at least 2 characters')
    .max(10, 'Branch Code must be at most 10 characters'),
  branchName: z.string()
    .min(1, 'Branch Name is required')
    .regex(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .min(2, 'Branch Name must be at least 2 characters')
    .max(100, 'Branch Name must be at most 100 characters'),
  currency: z.string().min(1, 'Currency is required'),
  bankCode: z.string()
    .min(1, 'Bank Code is required')
    .regex(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed')
    .min(2, 'Bank Code must be at least 2 characters')
    .max(10, 'Bank Code must be at most 10 characters'),
});

type FormData = z.infer<typeof schema>;

interface NewAccountProps {
  onNext: () => void;
}

export default function NewAccountStep({ onNext }: NewAccountProps) {
  const dispatch = useDispatch();
  const savedData = useSelector((state: RootState) => state.accountOpening.newAccount);
  const [importResult, setImportResult] = useState<{ matched: string[]; missing: string[] } | null>(null);

  const { control, handleSubmit, reset } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: savedData,
  });

  const onSubmit = (data: FormData) => {
    dispatch(setNewAccount(data));
    toast.success('New Account details saved');
    onNext();
  };

  const handleOfflineImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // Reset form with imported data
        reset({
          ...savedData,
          customerName: result.data[0].customerName || savedData.customerName,
          customerId: result.data[0].customerId || savedData.customerId,
          branchCode: result.data[0].branchCode || savedData.branchCode,
        });
        setImportResult({ matched: result.matchedFields, missing: result.missingFields });
        toast.success(`Imported ${result.matchedFields.length} fields from file`);
      }
    } catch {
      toast.error('Failed to parse file');
    }
    e.target.value = '';
  }, [dispatch, reset, savedData]);

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
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
          <input
            type="file"
            hidden
            accept=".xlsx,.xls,.csv"
            onChange={handleOfflineImport}
          />
        </Button>
      </Box>

      {importResult && (
        <Alert
          severity={importResult.missing.length > 0 ? 'warning' : 'success'}
          sx={{ mb: 3, borderRadius: '8px' }}
          onClose={() => setImportResult(null)}
        >
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>Matched:</Typography>
              {importResult.matched.map((f) => (
                <Chip key={f} label={f} size="small" color="success" icon={<CheckCircle size={14} />} />
              ))}
            </Box>
            {importResult.missing.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>Missing:</Typography>
                {importResult.missing.map((f) => (
                  <Chip key={f} label={f} size="small" color="warning" icon={<AlertCircle size={14} />} />
                ))}
              </Box>
            )}
          </Box>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="customerType" control={control} label="Customer Type" options={CUSTOMER_TYPES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="productClass" control={control} label="Product Class" options={PRODUCT_CLASSES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="customerId" control={control} label="Customer ID" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="customerName" control={control} label="Customer Name" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="branchCode" control={control} label="Branch Code" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="branchName" control={control} label="Branch Name" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="currency" control={control} label="Currency" options={CURRENCIES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="bankCode" control={control} label="Bank Code" required />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} size="large" sx={{ borderRadius: '8px', px: 4 }}>
          Save & Continue
        </Button>
      </Box>
    </Paper>
  );
}
