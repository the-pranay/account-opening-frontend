'use client';

import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Upload, X, FileText } from 'lucide-react';
import { MAX_FILE_SIZE } from '@/constants/formFields';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  files?: File[];
  onRemoveFile?: (index: number) => void;
}

export default function FileUpload({
  onFilesAccepted,
  accept,
  maxSize = MAX_FILE_SIZE,
  multiple = false,
  files = [],
  onRemoveFile,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        // handled by parent via toast
      }
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: '12px',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isDragActive ? 'rgba(0, 150, 136, 0.05)' : 'rgba(255,255,255,0.02)',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 150, 136, 0.05)',
          },
        }}
      >
        <input {...getInputProps()} />
        <Upload size={40} style={{ opacity: 0.5, marginBottom: 8 }} />
        <Typography variant="body1" fontWeight={500}>
          {isDragActive ? 'Drop files here...' : 'Drag & Drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          or click to browse • Max {formatSize(maxSize)}
        </Typography>
      </Box>

      {files.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {files.map((file, index) => (
            <ListItem
              key={`${file.name}-${index}`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                mb: 0.5,
              }}
              secondaryAction={
                onRemoveFile && (
                  <IconButton edge="end" size="small" onClick={() => onRemoveFile(index)}>
                    <X size={16} />
                  </IconButton>
                )
              }
            >
              <FileText size={18} style={{ marginRight: 8, opacity: 0.6 }} />
              <ListItemText
                primary={file.name}
                secondary={formatSize(file.size)}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
