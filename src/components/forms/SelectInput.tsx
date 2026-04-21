'use client';

import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export default function SelectInput<T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled = false,
  required = false,
  fullWidth = true,
}: SelectInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          label={label}
          disabled={disabled}
          required={required}
          fullWidth={fullWidth}
          error={!!error}
          helperText={error?.message}
          variant="outlined"
          size="small"
          SelectProps={{
            MenuProps: {
              disablePortal: false,
              sx: { zIndex: 9999 },
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  mt: 0.5,
                },
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#fff',
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Select {label}</em>
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
