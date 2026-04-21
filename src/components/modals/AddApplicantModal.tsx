'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import { CUSTOMER_ROLES } from '@/constants/formFields';
import type { Applicant } from '@/types/accountTypes';

const schema = z.object({
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
  customerRole: z.string().min(1, 'Customer Role is required'),
  isExistingCustomer: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface AddApplicantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (applicant: Applicant) => void;
}

export default function AddApplicantModal({ open, onClose, onSave }: AddApplicantModalProps) {
  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerId: '',
      customerName: '',
      customerRole: '',
      isExistingCustomer: true,
    },
  });

  const isExisting = watch('isExistingCustomer');

  const onSubmit = (data: FormData) => {
    onSave({
      id: `APL-${Date.now()}`,
      ...data,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #001e3c, #003c50)', color: '#fff' }}>
        Add Applicant
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isExisting}
                  onChange={(e) => {
                    const val = e.target.checked;
                    // manually set via control not possible easily, use reset
                    reset((prev) => ({ ...prev, isExistingCustomer: val }));
                  }}
                  color="primary"
                />
              }
              label="Is Customer with Bank?"
            />
          </Grid>
          <Grid size={12}>
            <FormInput name="customerId" control={control} label="Customer ID" required />
          </Grid>
          <Grid size={12}>
            <FormInput name="customerName" control={control} label="Customer Name" required />
          </Grid>
          <Grid size={12}>
            <SelectInput name="customerRole" control={control} label="Customer Role" options={CUSTOMER_ROLES} required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ borderRadius: '8px' }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
