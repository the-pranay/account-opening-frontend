'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  Shield,
  Building2,
} from 'lucide-react';

interface SignupForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignupForm) => {
    setError('');
    console.log('Signup attempt with:', data);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── LEFT PANEL ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 42%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: 'linear-gradient(160deg, #001e3c 0%, #002f4a 40%, #004d40 100%)',
          overflow: 'hidden',
          px: 6,
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,191,165,0.1) 0%, transparent 70%)',
            top: '8%',
            right: '-12%',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,35,126,0.12) 0%, transparent 70%)',
            bottom: '8%',
            left: '-8%',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }}>
          <Box sx={{ height: 50, overflow: 'hidden', mb: 4 }}>
            <img
              src="/idigibank-logo.png"
              alt="idigiBank"
              style={{ height: 100, marginTop: -25, objectFit: 'contain' }}
            />
          </Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: '#fff', mb: 2, letterSpacing: '-0.02em' }}
          >
            Join idigiBank
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            Create your executive account and start opening customer accounts with India&apos;s most trusted digital banking platform.
          </Typography>

          {/* Trust indicators */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              mt: 5,
              pt: 4,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { icon: <Shield size={18} />, text: '256-bit SSL' },
              { icon: <Building2 size={18} />, text: 'RBI Compliant' },
            ].map((item) => (
              <Box
                key={item.text}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.4)' }}
              >
                {item.icon}
                <Typography variant="caption" fontWeight={500}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── RIGHT PANEL ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 6 },
          py: 4,
          background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 3 }}>
            <img src="/idigibank-logo.png" alt="idigiBank" style={{ height: 40, objectFit: 'contain' }} />
          </Box>

          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Fill in your details to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full Name */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8 }}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} color="#546e7a" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#fff' } }}
            />

            {/* Email */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8 }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="you@bank.com"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#546e7a" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#fff' } }}
            />

            {/* Phone */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8 }}>
              Phone Number
            </Typography>
            <TextField
              fullWidth
              placeholder="+91 98765 43210"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: { value: /^[\d\s+()-]{10,15}$/, message: 'Enter a valid phone number' },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={18} color="#546e7a" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#fff' } }}
            />

            {/* Password */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must include uppercase, lowercase, and number',
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#546e7a" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#fff' } }}
            />

            {/* Confirm Password */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8 }}>
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#546e7a" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirm((p) => !p)} edge="end">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#fff' } }}
            />

            {/* Terms */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  {...register('terms', { required: 'You must accept the terms' })}
                  sx={{ color: '#546e7a', '&.Mui-checked': { color: '#00695c' } }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Box component="span" sx={{ color: '#00695c', fontWeight: 600, cursor: 'pointer' }}>
                    Terms of Service
                  </Box>{' '}
                  and{' '}
                  <Box component="span" sx={{ color: '#00695c', fontWeight: 600, cursor: 'pointer' }}>
                    Privacy Policy
                  </Box>
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
            {errors.terms && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2, ml: 1.5 }}>
                {errors.terms.message}
              </Typography>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
              sx={{
                mt: 1,
                borderRadius: '12px',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
                boxShadow: '0 6px 24px rgba(0,105,92,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 30px rgba(0,105,92,0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </Button>
          </Box>

          {/* Sign in link */}
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#00695c', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
