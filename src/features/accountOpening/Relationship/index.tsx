'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { setRelationship, addApplicant, removeApplicant, setCbsAccountNumber, setAccountStatus } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import SelectInput from '@/components/forms/SelectInput';
import DataTable from '@/components/tables/DataTable';
import AddApplicantModal from '@/components/modals/AddApplicantModal';
import { MODE_OF_OPERATIONS } from '@/constants/formFields';
import { setRelationship as setRelationshipApi, getErrorMessage } from '@/services/accountApi';
import { createColumnHelper } from '@tanstack/react-table';
import type { Applicant } from '@/types/accountTypes';
import { UserPlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<Applicant>();

const schema = z.object({
  modeOfOperation: z.string().min(1, 'Mode of Operation is required'),
});

type FormData = z.infer<typeof schema>;

interface RelationshipProps {
  onNext: () => void;
  onBack: () => void;
}

export default function RelationshipStep({ onNext, onBack }: RelationshipProps) {
  const dispatch = useDispatch();
  const savedData = useSelector((state: RootState) => state.accountOpening.relationship);
  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);
  const cbsAccountNumber = useSelector((state: RootState) => state.accountOpening.cbsAccountNumber);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      modeOfOperation: savedData.modeOfOperation,
    },
  });

  const columns = [
    columnHelper.accessor('customerId', { header: 'Customer ID' }),
    columnHelper.accessor('customerName', { header: 'Customer Name' }),
    columnHelper.accessor('customerRole', { header: 'Customer Role' }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            dispatch(removeApplicant(info.row.original.id));
            toast.success('Applicant removed');
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      ),
    }),
  ];

  const onSubmit = async (data: FormData) => {
    dispatch(setRelationship(data));

    if (!accountOpeningRequestId) {
      toast.error('No account opening request found. Please complete Step 1 first.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await setRelationshipApi({
        accountOpeningRequestId,
        modeOfOperation: data.modeOfOperation,
        coApplicants: savedData.applicants.map((a) => ({
          cbsCustomerId: a.customerId,
          customerName: a.customerName,
          customerRole: a.customerRole,
          existingCustomer: a.isExistingCustomer,
        })),
      });
      if (response.success) {
        if (response.data.cbsAccountNumber) {
          dispatch(setCbsAccountNumber(response.data.cbsAccountNumber));
        }
        dispatch(setAccountStatus(response.data.status));
        toast.success('Relationship details saved');
        onNext();
      } else {
        toast.error(response.message || 'Failed to set relationship');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Relationship
      </Typography>

      {cbsAccountNumber && (
        <Box sx={{ mb: 3, p: 2, borderRadius: '8px', bgcolor: 'rgba(0,191,165,0.08)', border: '1px solid rgba(0,191,165,0.2)' }}>
          <Typography variant="body2" fontWeight={600} color="success.main">
            CBS Account Number: {cbsAccountNumber}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectInput name="modeOfOperation" control={control} label="Mode of Operation" options={MODE_OF_OPERATIONS} required />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Co-Applicants
        </Typography>
        <Button
          variant="outlined"
          startIcon={<UserPlus size={18} />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Add Applicant
        </Button>
      </Box>

      <DataTable data={savedData.applicants} columns={columns} showPagination={false} />

      <AddApplicantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(applicant) => {
          dispatch(addApplicant(applicant));
          toast.success('Applicant added');
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          size="large"
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          sx={{ borderRadius: '8px', px: 4 }}
        >
          {submitting ? 'Saving…' : 'Save & Continue'}
        </Button>
      </Box>
    </Paper>
  );
}
