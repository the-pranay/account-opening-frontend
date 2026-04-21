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
  Shield,
  Building2,
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '', remember: false } });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── LEFT PANEL ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 45%',
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
            top: '10%',
            right: '-15%',
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
            bottom: '5%',
            left: '-10%',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        {/* Grid overlay */}
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
            Welcome Back
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            Sign in to access the enterprise account opening platform and manage customer accounts seamlessly.
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
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1,
              mb: 4,
            }}
          >
            <img src="/idigibank-logo.png" alt="idigiBank" style={{ height: 40, objectFit: 'contain' }} />
          </Box>

          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Enter your credentials to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                },
              }}
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
                minLength: { value: 6, message: 'Minimum 6 characters' },
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
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                },
              }}
            />

            {/* Remember + Forgot */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...register('remember')}
                    sx={{ color: '#546e7a', '&.Mui-checked': { color: '#00695c' } }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember me
                  </Typography>
                }
              />
              <Typography
                variant="body2"
                sx={{ color: '#00695c', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                Forgot password?
              </Typography>
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
              sx={{
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
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          {/* Sign up link */}
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#00695c', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
