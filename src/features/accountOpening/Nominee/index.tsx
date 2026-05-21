'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { addNominee, removeNominee } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import DataTable from '@/components/tables/DataTable';
import AddNomineeModal from '@/components/modals/AddNomineeModal';
import { addNominees, getErrorMessage } from '@/services/accountApi';
import { createColumnHelper } from '@tanstack/react-table';
import type { Nominee } from '@/types/accountTypes';
import { UserPlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<Nominee>();

interface NomineeProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function NomineeStep({ onBack, onComplete }: NomineeProps) {
  const dispatch = useDispatch();
  const nominees = useSelector((state: RootState) => state.accountOpening.nominees);
  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Name',
      cell: (info) => `${info.row.original.firstName} ${info.row.original.middleName} ${info.row.original.lastName}`.trim(),
    }),
    columnHelper.accessor('gender', { header: 'Gender' }),
    columnHelper.accessor('dateOfBirth', {
      header: 'Date of Birth',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('relationship', { header: 'Relationship' }),
    columnHelper.accessor('shareHoldingPercentage', {
      header: 'Share %',
      cell: (info) => `${info.getValue()}%`,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            dispatch(removeNominee(info.row.original.id));
            toast.success('Nominee removed');
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      ),
    }),
  ];

  const handleComplete = async () => {
    if (nominees.length === 0) {
      toast.error('Please add at least one nominee');
      return;
    }

    if (!accountOpeningRequestId) {
      toast.error('No account opening request found. Please complete Step 1 first.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await addNominees({
        accountOpeningRequestId,
        nominees: nominees.map((n) => ({
          firstName: n.firstName,
          middleName: n.middleName || undefined,
          lastName: n.lastName || undefined,
          gender: n.gender,
          dateOfBirth: n.dateOfBirth,
          relationship: n.relationship,
          sharePercentage: n.shareHoldingPercentage,
          addressLine1: n.address?.addressLine1,
          addressLine2: n.address?.addressLine2,
          country: n.address?.country,
          postalCode: n.address?.postalCode,
        })),
      });
      if (response.success) {
        toast.success('Nominees saved successfully');
        onComplete();
      } else {
        toast.error(response.message || 'Failed to save nominees');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Nominee Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<UserPlus size={18} />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Add Nominee
        </Button>
      </Box>

      <DataTable data={nominees} columns={columns} />

      <AddNomineeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(nominee) => {
          dispatch(addNominee(nominee));
          toast.success('Nominee added');
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleComplete}
          size="large"
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          sx={{ borderRadius: '8px', px: 4 }}
        >
          {submitting ? 'Saving Nominees…' : 'Submit Account'}
        </Button>
      </Box>
    </Paper>
  );
}
