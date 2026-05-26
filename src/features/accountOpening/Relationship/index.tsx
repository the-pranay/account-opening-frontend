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
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { setRelationship, addApplicant, removeApplicant } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import SelectInput from '@/components/forms/SelectInput';
import DataTable from '@/components/tables/DataTable';
import AddApplicantModal from '@/components/modals/AddApplicantModal';
import { MODE_OF_OPERATIONS } from '@/constants/formFields';
import { createColumnHelper } from '@tanstack/react-table';
import type { Applicant } from '@/types/accountTypes';
import { UserPlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { setRelationship as setRelationshipApi, getErrorMessage } from '@/services/accountApi';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!accountOpeningRequestId) {
      toast.error('Account Opening ID is missing. Please complete Step 1 first.');
      return;
    }

    setIsSaving(true);
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
        dispatch(setRelationship(data));
        onNext();
      } else {
        throw new Error(response.message || 'Failed to save relationship details');
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
        Relationship
      </Typography>

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
