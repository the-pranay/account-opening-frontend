'use client';

import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  fullWidth?: boolean;
}

export default function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  disabled = false,
  multiline = false,
  rows = 1,
  required = false,
  fullWidth = true,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
          required={required}
          fullWidth={fullWidth}
          error={!!error}
          helperText={error?.message}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      )}
    />
  );
}
