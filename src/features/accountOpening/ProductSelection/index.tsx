'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { setProductSelection } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import DatePickerField from '@/components/forms/DatePicker';
import DataTable from '@/components/tables/DataTable';
import { ACCOUNT_TYPES, PRODUCT_GROUPS, PRODUCT_CLASSES, CURRENCIES } from '@/constants/formFields';
import { MOCK_FEES } from '@/services/accountApi';
import { createColumnHelper } from '@tanstack/react-table';
import type { Fee } from '@/types/accountTypes';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<Fee>();
const feeColumns = [
  columnHelper.accessor('feeName', { header: 'Fee Name' }),
  columnHelper.accessor('feeType', { header: 'Fee Type' }),
  columnHelper.accessor('baseFees', { header: 'Base Fees', cell: (info) => `₹${info.getValue().toLocaleString()}` }),
  columnHelper.accessor('negotiatedType', { header: 'Negotiated Type' }),
  columnHelper.accessor('negotiatedFees', { header: 'Negotiated Fees', cell: (info) => `₹${info.getValue().toLocaleString()}` }),
  columnHelper.accessor('netFees', { header: 'Net Fees', cell: (info) => `₹${info.getValue().toLocaleString()}` }),
];

const schema = z.object({
  offerCode: z.string()
    .min(1, 'Offer Code is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed')
    .max(20, 'Offer Code must be at most 20 characters'),
  offerName: z.string()
    .min(1, 'Offer Name is required')
    .regex(/^[A-Za-z0-9\s-]+$/, 'Only letters, numbers, spaces, and hyphens allowed')
    .max(100, 'Offer Name must be at most 100 characters'),
  accountType: z.string().min(1, 'Account Type is required'),
  productGroup: z.string().min(1, 'Product Group is required'),
  productClass: z.string().min(1, 'Product Class is required'),
  productCode: z.string()
    .min(1, 'Product Code is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed')
    .max(20, 'Product Code must be at most 20 characters'),
  currency: z.string().min(1, 'Currency is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
});

type FormData = z.infer<typeof schema>;

interface ProductSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProductSelectionStep({ onNext, onBack }: ProductSelectionProps) {
  const dispatch = useDispatch();
  const savedData = useSelector((state: RootState) => state.accountOpening.productSelection);

  const { control, handleSubmit } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      offerCode: savedData.offerCode,
      offerName: savedData.offerName,
      accountType: savedData.accountType,
      productGroup: savedData.productGroup,
      productClass: savedData.productClass,
      productCode: savedData.productCode,
      currency: savedData.currency,
      startDate: savedData.startDate,
      endDate: savedData.endDate,
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch(setProductSelection({ ...data, fees: MOCK_FEES }));
    toast.success('Product Selection saved');
    onNext();
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Product Selection
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="offerCode" control={control} label="Offer Code" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="offerName" control={control} label="Offer Name" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="accountType" control={control} label="Account Type" options={ACCOUNT_TYPES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="productGroup" control={control} label="Product Group" options={PRODUCT_GROUPS} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="productClass" control={control} label="Product Class" options={PRODUCT_CLASSES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="productCode" control={control} label="Product Code" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="currency" control={control} label="Currency" options={CURRENCIES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DatePickerField name="startDate" control={control} label="Start Date" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DatePickerField name="endDate" control={control} label="End Date" required />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <DataTable data={MOCK_FEES} columns={feeColumns} title="Fee Schedule" showPagination={false} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} size="large" sx={{ borderRadius: '8px', px: 4 }}>
          Save & Continue
        </Button>
      </Box>
    </Paper>
  );
}
