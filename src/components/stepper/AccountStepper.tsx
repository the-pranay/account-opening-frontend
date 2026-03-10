'use client';

import React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import { STEPPER_STEPS } from '@/constants/formFields';

interface AccountStepperProps {
  activeStep: number;
  onStepClick?: (step: number) => void;
}

export default function AccountStepper({ activeStep, onStepClick }: AccountStepperProps) {
  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        px: 3,
        background: 'linear-gradient(135deg, rgba(0,30,60,0.95) 0%, rgba(0,60,80,0.9) 100%)',
        borderRadius: '16px',
        mb: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: 3,
            borderColor: 'rgba(255,255,255,0.15)',
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: '#00bfa5',
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: '#00bfa5',
          },
          '& .MuiStepIcon-root': {
            color: 'rgba(255,255,255,0.2)',
            fontSize: '2rem',
            '&.Mui-active': {
              color: '#00bfa5',
              filter: 'drop-shadow(0 0 8px rgba(0,191,165,0.5))',
            },
            '&.Mui-completed': {
              color: '#00bfa5',
            },
          },
          '& .MuiStepLabel-label': {
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.75rem',
            fontWeight: 500,
            mt: 0.5,
            '&.Mui-active': {
              color: '#fff',
              fontWeight: 700,
            },
            '&.Mui-completed': {
              color: 'rgba(255,255,255,0.8)',
            },
          },
        }}
      >
        {STEPPER_STEPS.map((label, index) => (
          <Step
            key={label}
            onClick={() => onStepClick?.(index)}
            sx={{ cursor: onStepClick ? 'pointer' : 'default' }}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
