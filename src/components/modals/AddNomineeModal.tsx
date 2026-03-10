'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import DatePickerField from '@/components/forms/DatePicker';
import { GENDERS, RELATIONSHIPS, COUNTRIES } from '@/constants/formFields';
import type { Nominee } from '@/types/accountTypes';

const schema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .regex(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .max(50, 'First name must be at most 50 characters'),
  middleName: z.string().optional().default(''),
  lastName: z.string()
    .min(1, 'Last name is required')
    .regex(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .max(50, 'Last name must be at most 50 characters'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  shareHoldingPercentage: z.coerce.number().min(1, 'Min 1%').max(100, 'Max 100%'),
  addressLine1: z.string()
    .min(1, 'Address Line 1 is required')
    .min(3, 'Address must be at least 3 characters')
    .max(200, 'Address must be at most 200 characters'),
  addressLine2: z.string().optional().default(''),
  addressLine3: z.string().optional().default(''),
  addressLine4: z.string().optional().default(''),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string()
    .min(1, 'Postal code is required')
    .regex(/^[A-Za-z0-9\s-]+$/, 'Invalid postal code format')
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code must be at most 10 characters'),
});

type FormData = z.infer<typeof schema>;

interface AddNomineeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (nominee: Nominee) => void;
}

export default function AddNomineeModal({ open, onClose, onSave }: AddNomineeModalProps) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      relationship: '',
      shareHoldingPercentage: 0,
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      country: 'IN',
      postalCode: '',
    },
  });

  const onSubmit = (data: FormData) => {
    const nominee: Nominee = {
      id: `NOM-${Date.now()}`,
      firstName: data.firstName,
      middleName: data.middleName || '',
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      relationship: data.relationship,
      shareHoldingPercentage: data.shareHoldingPercentage,
      address: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || '',
        addressLine3: data.addressLine3 || '',
        addressLine4: data.addressLine4 || '',
        country: data.country,
        postalCode: data.postalCode,
      },
    };
    onSave(nominee);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #001e3c, #003c50)', color: '#fff' }}>
        Add Nominee
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormInput name="firstName" control={control} label="First Name" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormInput name="middleName" control={control} label="Middle Name" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormInput name="lastName" control={control} label="Last Name" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SelectInput name="gender" control={control} label="Gender" options={GENDERS} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DatePickerField name="dateOfBirth" control={control} label="Date of Birth" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SelectInput name="relationship" control={control} label="Relationship" options={RELATIONSHIPS} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormInput name="shareHoldingPercentage" control={control} label="Share Holding %" type="number" required />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Nominee Address
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInput name="addressLine1" control={control} label="Address Line 1" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInput name="addressLine2" control={control} label="Address Line 2" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInput name="addressLine3" control={control} label="Address Line 3" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInput name="addressLine4" control={control} label="Address Line 4" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SelectInput name="country" control={control} label="Country" options={COUNTRIES} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormInput name="postalCode" control={control} label="Postal Code" required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ borderRadius: '8px' }}>
          Save Nominee
        </Button>
      </DialogActions>
    </Dialog>
  );
}
