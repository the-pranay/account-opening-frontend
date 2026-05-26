'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { addDocument, removeDocument } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import DataTable from '@/components/tables/DataTable';
import UploadDocumentModal from '@/components/modals/UploadDocumentModal';
import { createColumnHelper } from '@tanstack/react-table';
import type { AccountDocument } from '@/types/accountTypes';
import { Upload, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<AccountDocument>();

interface DocumentsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentsStep({ onNext, onBack }: DocumentsProps) {
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.accountOpening.documents);
  const newAccount = useSelector((state: RootState) => state.accountOpening.newAccount);
  const [modalOpen, setModalOpen] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const columns = [
    columnHelper.accessor('customerId', { header: 'Customer ID' }),
    columnHelper.accessor('documentType', { header: 'Document Type' }),
    columnHelper.accessor('documentCategory', { header: 'Category' }),
    columnHelper.accessor('fileName', { header: 'File Name' }),
    columnHelper.accessor('fileSize', {
      header: 'Size',
      cell: (info) => formatSize(info.getValue()),
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      cell: () => (
        <Chip
          label="Pending Upload"
          size="small"
          color="warning"
          icon={<Clock size={14} />}
        />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => {
            dispatch(removeDocument(info.row.original.id));
            toast.success('Document removed');
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      ),
    }),
  ];

  // Save document locally only — files will be uploaded to the backend at final submit
  const handleSaveDocument = async (doc: AccountDocument): Promise<boolean> => {
    if (!doc.file) {
      toast.error('Please select a document file.');
      return false;
    }
    dispatch(addDocument(doc));
    toast.success('Document added — will be uploaded on Submit');
    return true;
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Associated Documents
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Upload size={18} />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Add Document
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
        Documents are stored locally and will be uploaded to the server when you submit the application.
      </Alert>

      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
        Account Level Documents
      </Typography>

      <DataTable data={documents} columns={columns} />

      <UploadDocumentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDocument}
        customerId={newAccount.customerId}
      />

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
