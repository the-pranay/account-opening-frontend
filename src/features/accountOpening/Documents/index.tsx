'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { useDispatch, useSelector } from 'react-redux';
import { addDocument, removeDocument } from '@/store/accountSlice';
import type { RootState } from '@/store/store';
import DataTable from '@/components/tables/DataTable';
import UploadDocumentModal from '@/components/modals/UploadDocumentModal';
import { createColumnHelper } from '@tanstack/react-table';
import type { AccountDocument } from '@/types/accountTypes';
import { Upload, Trash2, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<AccountDocument>();

interface DocumentsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentsStep({ onNext, onBack }: DocumentsProps) {
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.accountOpening.documents);
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
    columnHelper.accessor('uploadDate', {
      header: 'Upload Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      cell: () => (
        <Chip label="Uploaded" size="small" color="success" icon={<FileCheck size={14} />} />
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
          Upload Document
        </Button>
      </Box>

      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
        Account Level Documents
      </Typography>

      <DataTable data={documents} columns={columns} />

      <UploadDocumentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(doc) => {
          dispatch(addDocument(doc));
          toast.success('Document uploaded successfully');
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '8px', px: 4 }}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext} size="large" sx={{ borderRadius: '8px', px: 4 }}>
          Continue
        </Button>
      </Box>
    </Paper>
  );
}
