'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setProductSelection } from '@/store/accountSlice';
import { selectProduct, getErrorMessage } from '@/services/accountApi';
import type { RootState } from '@/store/store';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import DatePickerField from '@/components/forms/DatePicker';
import { ACCOUNT_TYPES, PRODUCT_GROUPS, PRODUCT_CLASSES, CURRENCIES, OFFERS, PRODUCT_CODES_BY_GROUP } from '@/constants/formFields';

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
  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, setValue } = useForm<FormData>({
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

  const offerName = useWatch({ control, name: 'offerName' });
  const productGroup = useWatch({ control, name: 'productGroup' });

  useEffect(() => {
    if (offerName) {
      const offer = OFFERS.find((o) => o.value === offerName);
      if (offer) {
        setValue('offerCode', offer.code, { shouldValidate: true });
      }
    }
  }, [offerName, setValue]);

  const productCodeOptions = productGroup ? PRODUCT_CODES_BY_GROUP[productGroup] || [] : [];

  const onSubmit = async (data: FormData) => {
    if (!accountOpeningRequestId) {
      toast.error('Account Opening ID is missing. Please complete Step 1 first.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await selectProduct({
        accountOpeningRequestId,
        offerCode: data.offerCode,
        productCode: data.productCode,
        offerName: data.offerName,
        accountType: data.accountType,
        productGroup: data.productGroup,
        totalFees: 0,
      });

      if (response.success) {
        dispatch(setProductSelection(data));
        onNext();
      } else {
        throw new Error(response.message || 'Failed to save product selection');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Product Selection
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormInput name="offerCode" control={control} label="Offer Code" required disabled />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SelectInput name="offerName" control={control} label="Offer Name" options={OFFERS} required />
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
          <SelectInput name="productCode" control={control} label="Product Code" options={productCodeOptions} required disabled={!productGroup} />
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          size="large"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: '8px', px: 4 }}
        >
          Save & Continue
        </Button>
      </Box>
    </Paper>
  );
}
