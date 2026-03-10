'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/components/forms/FormInput';
import SelectInput from '@/components/forms/SelectInput';
import FileUpload from '@/components/upload/FileUpload';
import { DOCUMENT_TYPES, DOCUMENT_CATEGORIES, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/formFields';
import type { AccountDocument } from '@/types/accountTypes';

const schema = z.object({
  customerId: z.string()
    .min(1, 'Customer ID is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed')
    .min(3, 'Customer ID must be at least 3 characters')
    .max(20, 'Customer ID must be at most 20 characters'),
  documentType: z.string().min(1, 'Document Type is required'),
  documentCategory: z.string().min(1, 'Document Category is required'),
});

type FormData = z.infer<typeof schema>;

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (doc: AccountDocument) => void;
}

export default function UploadDocumentModal({ open, onClose, onSave }: UploadDocumentModalProps) {
  const [files, setFiles] = useState<File[]>([]);

  const { control, handleSubmit, reset } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerId: '',
      documentType: '',
      documentCategory: '',
    },
  });

  const handleFilesAccepted = (accepted: File[]) => {
    setFiles(accepted);
  };

  const onSubmit = (data: FormData) => {
    if (files.length === 0) return;
    const file = files[0];
    const doc: AccountDocument = {
      id: `DOC-${Date.now()}`,
      customerId: data.customerId,
      documentType: data.documentType,
      documentCategory: data.documentCategory,
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      file,
    };
    onSave(doc);
    reset();
    setFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #001e3c, #003c50)', color: '#fff' }}>
        Upload Document
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <FormInput name="customerId" control={control} label="Customer ID" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SelectInput name="documentType" control={control} label="Document Type" options={DOCUMENT_TYPES} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SelectInput name="documentCategory" control={control} label="Document Category" options={DOCUMENT_CATEGORIES} required />
          </Grid>
          <Grid size={12}>
            <FileUpload
              onFilesAccepted={handleFilesAccepted}
              accept={ALLOWED_FILE_TYPES.documents}
              maxSize={MAX_FILE_SIZE}
              files={files}
              onRemoveFile={() => setFiles([])}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={files.length === 0}
          sx={{ borderRadius: '8px' }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
