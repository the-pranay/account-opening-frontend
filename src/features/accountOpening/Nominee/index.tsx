'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { addNominee, removeNominee } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import DataTable from '@/components/tables/DataTable';
import AddNomineeModal from '@/components/modals/AddNomineeModal';
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
  const [modalOpen, setModalOpen] = useState(false);

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
          onClick={onComplete}
          size="large"
          sx={{ borderRadius: '8px', px: 4 }}
        >
          Submit Account
        </Button>
      </Box>
    </Paper>
  );
}
