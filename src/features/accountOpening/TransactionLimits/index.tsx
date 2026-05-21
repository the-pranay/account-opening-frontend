'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactionLimits } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import DataTable from '@/components/tables/DataTable';
import { getTransactionLimits as getTransactionLimitsApi, getErrorMessage } from '@/services/accountApi';
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
  const accountOpeningRequestId = useSelector((state: RootState) => state.accountOpening.accountOpeningRequestId);
  const [fetchingLimits, setFetchingLimits] = useState(false);

  useEffect(() => {
    const fetchLimits = async () => {
      if (!accountOpeningRequestId) return;
      if (savedLimits.length > 0) return; // Already fetched

      setFetchingLimits(true);
      try {
        const response = await getTransactionLimitsApi(accountOpeningRequestId);
        if (response.success && response.data) {
          const limitsData = Array.isArray(response.data) ? response.data : [];
          if (limitsData.length > 0) {
            dispatch(setTransactionLimits(limitsData));
          }
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setFetchingLimits(false);
      }
    };
    fetchLimits();
  }, [accountOpeningRequestId, dispatch, savedLimits.length]);

  const handleNext = () => {
    dispatch(setTransactionLimits(savedLimits));
    toast.success('Transaction limits saved');
    onNext();
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Transaction Limits
      </Typography>

      {fetchingLimits ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
          <CircularProgress size={32} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Fetching transaction limits from CBS...
          </Typography>
        </Box>
      ) : savedLimits.length > 0 ? (
        <DataTable data={savedLimits} columns={columns} pageSize={10} />
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No transaction limits available. They will be auto-configured after account activation.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext} size="large" disabled={fetchingLimits} sx={{ borderRadius: '8px', px: 4 }}>
          Save & Continue
        </Button>
      </Box>
    </Paper>
  );
}
