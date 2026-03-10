'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { setBasicDetails } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import {
  ADDRESS_TYPES,
  ACCOMMODATION_TYPES,
  INSTRUMENT_TYPES,
  CHEQUE_TYPES,
} from '@/constants/formFields';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  addressType: z.string().min(1, 'Address Type is required'),
  accommodationType: z.string().min(1, 'Accommodation Type is required'),
  preferredContactNumber: z.string()
    .min(1, 'Contact Number is required')
    .regex(/^[0-9]+$/, 'Contact Number must contain only digits')
    .min(10, 'Contact Number must be at least 10 digits')
    .max(15, 'Contact Number must be at most 15 digits'),
  preferredEmail: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  chequeBookFacility: z.boolean(),
  chequeBooks: z.array(
    z.object({
      instrumentType: z.string().min(1, 'Required'),
      chequeType: z.string().min(1, 'Required'),
      numberOfLeaves: z.coerce.number().min(1, 'Min 1'),
    })
  ),
  internetBankingView: z.boolean(),
  internetBankingPerform: z.boolean(),
  internetBankingApprove: z.boolean(),
  statementEmail: z.boolean(),
  statementAddress: z.boolean(),
  statementBranch: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface BasicDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function BasicDetailsStep({ onNext, onBack }: BasicDetailsProps) {
  const dispatch = useDispatch();
  const savedData = useSelector((state: RootState) => state.accountOpening.basicDetails);

  const { control, handleSubmit, watch } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      addressType: savedData.addressType,
      accommodationType: savedData.accommodationType,
      preferredContactNumber: savedData.preferredContactNumber,
      preferredEmail: savedData.preferredEmail,
      chequeBookFacility: savedData.chequeBookFacility,
      chequeBooks: savedData.chequeBooks.length > 0 ? savedData.chequeBooks : [],
      internetBankingView: savedData.internetBanking.view,
      internetBankingPerform: savedData.internetBanking.perform,
      internetBankingApprove: savedData.internetBanking.approve,
      statementEmail: savedData.accountStatementFacility.includes('email'),
      statementAddress: savedData.accountStatementFacility.includes('registered_address'),
      statementBranch: savedData.accountStatementFacility.includes('branch_pickup'),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'chequeBooks' });
  const hasChequeBook = watch('chequeBookFacility');

  const onSubmit = (data: FormData) => {
    const statementFacility: string[] = [];
    if (data.statementEmail) statementFacility.push('email');
    if (data.statementAddress) statementFacility.push('registered_address');
    if (data.statementBranch) statementFacility.push('branch_pickup');

    dispatch(
      setBasicDetails({
        addressType: data.addressType,
        accommodationType: data.accommodationType,
        preferredContactNumber: data.preferredContactNumber,
        preferredEmail: data.preferredEmail,
        chequeBookFacility: data.chequeBookFacility,
        chequeBooks: data.chequeBooks,
        internetBanking: {
          view: data.internetBankingView,
          perform: data.internetBankingPerform,
          approve: data.internetBankingApprove,
        },
        accountStatementFacility: statementFacility,
      })
    );
    toast.success('Basic details saved');
    onNext();
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Basic Details
      </Typography>

      {/* Contact Details */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Customer Contact Details
      </Typography>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectInput name="addressType" control={control} label="Address Type" options={ADDRESS_TYPES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectInput name="accommodationType" control={control} label="Accommodation Type" options={ACCOMMODATION_TYPES} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormInput name="preferredContactNumber" control={control} label="Preferred Contact Number" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormInput name="preferredEmail" control={control} label="Preferred Email" type="email" required />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Cheque Book */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Cheque Book Facility
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={hasChequeBook}
              onChange={() => {}} // controlled by RHF
              color="primary"
            />
          }
          label=""
          sx={{ mr: 0 }}
        />
      </Box>

      {hasChequeBook && (
        <>
          {fields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <SelectInput name={`chequeBooks.${index}.instrumentType`} control={control} label="Instrument Type" options={INSTRUMENT_TYPES} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <SelectInput name={`chequeBooks.${index}.chequeType`} control={control} label="Cheque Type" options={CHEQUE_TYPES} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormInput name={`chequeBooks.${index}.numberOfLeaves`} control={control} label="Number of Leaves" type="number" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton color="error" onClick={() => remove(index)}>
                  <Trash2 size={18} />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="text"
            startIcon={<Plus size={16} />}
            onClick={() => append({ instrumentType: '', chequeType: '', numberOfLeaves: 25 })}
            sx={{ textTransform: 'none', mt: 1 }}
          >
            Add Cheque Book
          </Button>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Internet Banking */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Internet Banking Access
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={<Checkbox defaultChecked={savedData.internetBanking.view} />}
          label="View"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked={savedData.internetBanking.perform} />}
          label="Perform"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked={savedData.internetBanking.approve} />}
          label="Approve"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Account Statement */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Account Statement Facility
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={<Checkbox defaultChecked={savedData.accountStatementFacility.includes('email')} />}
          label="Email"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked={savedData.accountStatementFacility.includes('registered_address')} />}
          label="Registered Address"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked={savedData.accountStatementFacility.includes('branch_pickup')} />}
          label="Branch Pickup"
        />
      </Box>

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
