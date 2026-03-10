'use client';

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactionLimits } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import DataTable from '@/components/tables/DataTable';
import { MOCK_TRANSACTION_LIMITS } from '@/services/accountApi';
import { createColumnHelper } from '@tanstack/react-table';
import type { TransactionLimit } from '@/types/accountTypes';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<TransactionLimit>();

const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;

const columns = [
  columnHelper.accessor('channel', { header: 'Channel' }),
  columnHelper.accessor('paymentMode', { header: 'Payment Mode' }),
  columnHelper.accessor('paymentMethod', { header: 'Payment Method' }),
  columnHelper.accessor('paymentType', { header: 'Payment Type' }),
  columnHelper.accessor('minimumLimit', { header: 'Min Limit', cell: (info) => formatAmount(info.getValue()) }),
  columnHelper.accessor('maximumLimit', { header: 'Max Limit', cell: (info) => formatAmount(info.getValue()) }),
  columnHelper.accessor('dailyLimit', { header: 'Daily Limit', cell: (info) => formatAmount(info.getValue()) }),
  columnHelper.accessor('weeklyLimit', { header: 'Weekly Limit', cell: (info) => formatAmount(info.getValue()) }),
  columnHelper.accessor('monthlyLimit', { header: 'Monthly Limit', cell: (info) => formatAmount(info.getValue()) }),
];

interface TransactionLimitsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function TransactionLimitsStep({ onNext, onBack }: TransactionLimitsProps) {
  const dispatch = useDispatch();
  const savedLimits = useSelector((state: RootState) => state.accountOpening.transactionLimits);

  useEffect(() => {
    if (savedLimits.length === 0) {
      dispatch(setTransactionLimits(MOCK_TRANSACTION_LIMITS));
    }
  }, [dispatch, savedLimits.length]);

  const data = savedLimits.length > 0 ? savedLimits : MOCK_TRANSACTION_LIMITS;

  const handleNext = () => {
    dispatch(setTransactionLimits(data));
    toast.success('Transaction limits saved');
    onNext();
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Transaction Limits
      </Typography>

      <DataTable data={data} columns={columns} pageSize={10} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext} size="large" sx={{ borderRadius: '8px', px: 4 }}>
          Save & Continue
        </Button>
      </Box>
    </Paper>
  );
}
