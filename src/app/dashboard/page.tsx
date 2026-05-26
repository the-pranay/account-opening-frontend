'use client';

import React, { useState, useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/tables/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { CUSTOMER_TYPES, SEARCH_BY_OPTIONS } from '@/constants/formFields';
import { searchCustomer, getMyApplications, getErrorMessage } from '@/services/accountApi';
import { useAuth, ProtectedRoute } from '@/services/authContext';
import type { CustomerSearchResult, AccountOpeningResponse } from '@/types/accountTypes';
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
  LogOut,
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

const appColumnHelper = createColumnHelper<AccountOpeningResponse>();

const applicationColumns = [
  appColumnHelper.accessor('id', { header: 'ID' }),
  appColumnHelper.accessor('productClass', { header: 'Product' }),
  appColumnHelper.accessor('branchCode', { header: 'Branch' }),
  appColumnHelper.accessor('cbsAccountNumber', {
    header: 'CBS Account',
    cell: (info) => info.getValue() || '—',
  }),
  appColumnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const color = status === 'ACTIVE' ? 'success' : status === 'REJECTED' ? 'error' : status === 'SUBMITTED' ? 'info' : 'warning';
      return <Chip label={status} size="small" color={color} sx={{ fontWeight: 600 }} />;
    },
  }),
  appColumnHelper.accessor('createdAt', {
    header: 'Created',
    cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '—',
  }),
];

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [customerType, setCustomerType] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [applications, setApplications] = useState<AccountOpeningResponse[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Fetch user's applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getMyApplications();
        if (response.success && response.data) {
          setApplications(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApplications();
  }, []);

  const handleSearch = async () => {
    if (!searchValue) {
      toast.error('Please enter a search value');
      return;
    }
    setSearching(true);
    try {
      const response = await searchCustomer({ customerType, searchBy, searchValue });
      // API returns ApiResponse format — data can be array or object
      const results = response.success && response.data
        ? (Array.isArray(response.data) ? response.data : [response.data])
        : [];
      setSearchResults(results);
      toast.success(`Found ${results.length} customer(s)`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const userInitials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
    : 'U';
  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
    : 'User';

  const accountTypes = [
    { type: 'Savings Account', icon: <PiggyBank size={24} />, color: '#00695c', path: '/account-opening?type=savings' },
    { type: 'Current Account', icon: <Landmark size={24} />, color: '#1a237e', path: '/account-opening?type=current' },
    { type: 'Fixed Deposit (FD) Account', icon: <CreditCard size={24} />, color: '#e65100', path: '/account-opening?type=fd' },
    { type: 'Recurring Deposit (RD) Account', icon: <Wallet size={24} />, color: '#6a1b9a', path: '/account-opening?type=rd' },
    { type: 'Salary Account', icon: <Building2 size={24} />, color: '#0d47a1', path: '/account-opening?type=salary' },
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
              <Image
                src="/idigibank-logo.png"
                alt="idigiBank"
                width={240}
                height={80}
                style={{ marginTop: -21, marginBottom: -21, objectFit: 'contain' }}
                priority
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
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#00695c', fontSize: '0.85rem' }}>{userInitials}</Avatar>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                {userName}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={logout}
              startIcon={<LogOut size={16} />}
              sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', '&:hover': { color: '#fff' } }}
            >
              Logout
            </Button>
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
                SelectProps={{ MenuProps: { disablePortal: false, sx: { zIndex: 9999 } } }}
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
                SelectProps={{ MenuProps: { disablePortal: false, sx: { zIndex: 9999 } } }}
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
                startIcon={searching ? <CircularProgress size={18} color="inherit" /> : <Search size={18} />}
                onClick={handleSearch}
                disabled={searching}
                sx={{ py: '8.5px' }}
              >
                {searching ? 'Searching…' : 'Check'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        <Grid container spacing={3}>
          <Grid size={12}>
            <DataTable
              data={searchResults}
              columns={customerColumns}
              title="Search Results"
            />
          </Grid>

          {/* My Applications */}
          <Grid size={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                My Applications
              </Typography>
              {loadingApps ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <DataTable data={applications} columns={applicationColumns} />
              )}
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
                  router.push(acc.path);
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
