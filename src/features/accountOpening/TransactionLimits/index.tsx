'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { Info } from 'lucide-react';

interface TransactionLimitsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function TransactionLimitsStep({ onNext, onBack }: TransactionLimitsProps) {
  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Transaction Limits
      </Typography>

      <Alert
        severity="info"
        icon={<Info size={20} />}
        sx={{ borderRadius: '10px', mb: 3 }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
          Auto-Configured After Account Creation
        </Typography>
        <Typography variant="body2">
          Transaction limits are automatically assigned by the CBS (Core Banking System) when the account is created.
          You will be able to view and manage them from the dashboard after submission.
        </Typography>
      </Alert>

      <Box
        sx={{
          p: 3,
          borderRadius: '12px',
          bgcolor: 'rgba(0,105,92,0.05)',
          border: '1px solid rgba(0,105,92,0.15)',
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="success.dark" sx={{ mb: 1.5 }}>
          Default Limits Applied:
        </Typography>
        {[
          { label: 'Daily Transfer Limit', value: '₹1,00,000' },
          { label: 'Weekly Transfer Limit', value: '₹5,00,000' },
          { label: 'Monthly Transfer Limit', value: '₹20,00,000' },
          { label: 'ATM Withdrawal Limit', value: '₹25,000 / day' },
          { label: 'POS Transaction Limit', value: '₹1,00,000 / day' },
        ].map((item) => (
          <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid rgba(0,105,92,0.08)' }}>
            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
            <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext} size="large" sx={{ borderRadius: '8px', px: 4 }}>
          Save & Continue
        </Button>
      </Box>
    </Paper>
  );
}
