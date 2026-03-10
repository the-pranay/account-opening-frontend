'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/tables/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { CUSTOMER_TYPES, SEARCH_BY_OPTIONS } from '@/constants/formFields';
import { MOCK_CUSTOMERS } from '@/services/accountApi';
import type { CustomerSearchResult } from '@/types/accountTypes';
import {
  Search,
  PlusCircle,
  Landmark,
  CreditCard,
  Wallet,
  PiggyBank,
  Building2,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<CustomerSearchResult>();

const customerColumns = [
  columnHelper.accessor('customerId', { header: 'Customer ID' }),
  columnHelper.accessor('customerName', { header: 'Customer Name' }),
  columnHelper.accessor('customerType', { header: 'Customer Type' }),
  columnHelper.accessor('branchCode', { header: 'Branch Code' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <Chip
        label={info.getValue()}
        size="small"
        color={info.getValue() === 'Active' ? 'success' : 'default'}
        sx={{ fontWeight: 600 }}
      />
    ),
  }),
];

export default function DashboardPage() {
  const router = useRouter();
  const [customerType, setCustomerType] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const handleSearch = () => {
    if (!searchValue) {
      toast.error('Please enter a search value');
      return;
    }
    // Mock search
    const results = MOCK_CUSTOMERS.filter((c) =>
      c.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResults(results);
    toast.success(`Found ${results.length} customer(s)`);
  };

  const accountTypes = [
    { type: 'Savings Account', icon: <PiggyBank size={24} />, color: '#00695c', path: '/account-opening?type=savings' },
    { type: 'Current Account', icon: <Landmark size={24} />, color: '#1a237e', path: '/account-opening?type=current' },
    { type: 'Fixed Deposit (FD) Account', icon: <CreditCard size={24} />, color: '#e65100', path: '#' },
    { type: 'Recurring Deposit (RD) Account', icon: <Wallet size={24} />, color: '#6a1b9a', path: '#' },
    { type: 'Salary Account', icon: <Building2 size={24} />, color: '#0d47a1', path: '#' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #001e3c 0%, #003c50 50%, #004d40 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ height: 38, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <img
                src="/idigibank-logo.png"
                alt="idigiBank"
                style={{ height: 80, marginTop: -21, marginBottom: -21, objectFit: 'contain' }}
              />
            </Box>
            <Typography component="span" sx={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 400, color: '#fff' }}>
              Account Opening System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Bell size={20} color="rgba(255,255,255,0.6)" style={{ cursor: 'pointer' }} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#00695c', fontSize: '0.85rem' }}>BK</Avatar>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                Bank Executive
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <LayoutDashboard size={24} color="#00695c" />
              <Typography variant="h4" fontWeight={800} color="text.primary">
                Dashboard
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Search customers and manage account openings
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlusCircle size={20} />}
            onClick={() => setAccountModalOpen(true)}
            sx={{ borderRadius: '10px', px: 3, py: 1.5 }}
          >
            Add New Account
          </Button>
        </Box>

        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,244,248,0.95) 100%)',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Customer Search
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                select
                label="Customer Type"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                {CUSTOMER_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                select
                label="Search By"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                {SEARCH_BY_OPTIONS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Search Value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                fullWidth
                size="small"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Search size={18} />}
                onClick={handleSearch}
                sx={{ py: '8.5px' }}
              >
                Check
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results / Account Sections */}
        <Grid container spacing={3}>
          <Grid size={12}>
            <DataTable
              data={searchResults}
              columns={customerColumns}
              title="Search Results"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 200,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Landmark size={20} color="#00695c" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Savings Accounts
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                No savings accounts to display. Use &quot;Add New Account&quot; to create one.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 200,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PiggyBank size={20} color="#e65100" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Term Deposits
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                No term deposits to display.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Account Type Selection Modal */}
      <Dialog
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #001e3c, #003c50)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Select Account Type
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List>
            {accountTypes.map((acc) => (
              <ListItemButton
                key={acc.type}
                onClick={() => {
                  setAccountModalOpen(false);
                  if (acc.path !== '#') {
                    router.push(acc.path);
                  } else {
                    toast('Coming soon!', { icon: '🚧' });
                  }
                }}
                sx={{
                  py: 2,
                  px: 3,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: `${acc.color}08`,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: acc.color, minWidth: 48 }}>
                  {acc.icon}
                </ListItemIcon>
                <ListItemText
                  primary={acc.type}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
