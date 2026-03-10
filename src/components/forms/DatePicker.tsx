'use client';

import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
}

export default function DatePickerField<T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
}: DatePickerProps<T>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MuiDatePicker
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
            disabled={disabled}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  },
                },
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
