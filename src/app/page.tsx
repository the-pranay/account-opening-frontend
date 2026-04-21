'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  FileCheck,
  Headphones,
  ArrowRight,
  Building2,
  Globe,
  TrendingUp,
  ChevronRight,
  Menu,
} from 'lucide-react';

/* ───── Animated Counter ───── */
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <Typography variant="h3" fontWeight={800} sx={{ color: '#fff' }}>
      {count.toLocaleString()}
      {suffix}
    </Typography>
  );
}

/* ───── Feature Card ───── */
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: '20px',
        border: '1px solid rgba(0,105,92,0.1)',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,244,248,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        animation: `fadeIn 0.6s ease-out ${delay}ms both`,
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 60px rgba(0,105,92,0.12)',
          borderColor: 'rgba(0,105,92,0.3)',
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
        {description}
      </Typography>
    </Paper>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    {
      icon: <Shield size={28} color="#fff" />,
      title: 'Enterprise-Grade Security',
      description:
        'Bank-level encryption and multi-factor authentication keep every transaction and customer record protected around the clock.',
    },
    {
      icon: <FileCheck size={28} color="#fff" />,
      title: 'Seamless Onboarding',
      description:
        'Digitised KYC, e-signatures, and intelligent form pre-fill so new accounts are opened in minutes, not days.',
    },
    {
      icon: <Users size={28} color="#fff" />,
      title: 'Multi-Applicant Support',
      description:
        'Handle joint accounts, nominees, and complex customer relationships with an intuitive step-by-step workflow.',
    },
    {
      icon: <Headphones size={28} color="#fff" />,
      title: '24 / 7 Dedicated Support',
      description:
        'Our operations team is always available to help bank executives with onboarding issues or system queries.',
    },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Bank Branches' },
    { value: 12000, suffix: '+', label: 'Accounts Opened' },
    { value: 99, suffix: '%', label: 'Uptime SLA' },
    { value: 50, suffix: '+', label: 'Banking Partners' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ══════════ NAVBAR ══════════ */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(0,30,60,0.95)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ height: 38, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <img
                  src="/idigibank-logo.png"
                  alt="idigiBank"
                  style={{ height: 80, marginTop: -21, marginBottom: -21, objectFit: 'contain' }}
                />
              </Box>
            </Box>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {['Features', 'About', 'Contact'].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 500,
                    '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  {item}
                </Button>
              ))}
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.12)' }}
              />
              <Button
                variant="outlined"
                onClick={() => router.push('/login')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '10px',
                  px: 3,
                  '&:hover': {
                    borderColor: '#00bfa5',
                    background: 'rgba(0,191,165,0.08)',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/signup')}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
                  },
                }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile Menu Toggle */}
            <IconButton sx={{ display: { md: 'none' }, color: '#fff' }}>
              <Menu size={24} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ══════════ HERO ══════════ */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '90vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          background:
            'linear-gradient(160deg, #001e3c 0%, #002f4a 30%, #003c50 55%, #004d40 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,191,165,0.12) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,35,126,0.15) 0%, transparent 70%)',
            bottom: '-5%',
            left: '-3%',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        {/* Subtle grid pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 0.8,
              mb: 4,
              borderRadius: '999px',
              border: '1px solid rgba(0,191,165,0.25)',
              background: 'rgba(0,191,165,0.08)',
              animation: 'fadeIn 0.6s ease-out',
            }}
          >
            <Globe size={14} color="#00bfa5" />
            <Typography variant="caption" sx={{ color: '#00bfa5', fontWeight: 600, letterSpacing: 0.5 }}>
              Trusted by 500+ Bank Branches Nationwide
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
              lineHeight: 1.1,
              color: '#fff',
              mb: 3,
              letterSpacing: '-0.03em',
              animation: 'fadeIn 0.6s ease-out 100ms both',
            }}
          >
            Modern Banking.{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #00bfa5 0%, #64ffda 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Simplified.
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 400,
              maxWidth: 620,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.7,
              animation: 'fadeIn 0.6s ease-out 200ms both',
            }}
          >
            Empower your bank executives with a next-generation account opening
            platform — fast, secure, and beautifully intuitive.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              animation: 'fadeIn 0.6s ease-out 300ms both',
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} />}
              onClick={() => router.push('/signup')}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
                boxShadow: '0 8px 32px rgba(0,105,92,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
                  boxShadow: '0 12px 40px rgba(0,105,92,0.45)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ChevronRight size={20} />}
              onClick={() => router.push('/login')}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.25)',
                '&:hover': {
                  borderColor: '#00bfa5',
                  background: 'rgba(0,191,165,0.08)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ══════════ STATS BAR ══════════ */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #003c50 100%)',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((s) => (
              <Grid key={s.label} size={{ xs: 6, md: 3 }} sx={{ textAlign: 'center' }}>
                <AnimatedCounter end={s.value} suffix={s.suffix} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontWeight: 500 }}
                >
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════ FEATURES ══════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: '#f7f9fc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.5,
                mb: 2,
                borderRadius: '999px',
                background: 'rgba(0,105,92,0.08)',
              }}
            >
              <TrendingUp size={14} color="#00695c" />
              <Typography variant="caption" sx={{ color: '#00695c', fontWeight: 600 }}>
                Why idigiBank
              </Typography>
            </Box>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ mb: 2, letterSpacing: '-0.02em' }}
            >
              Built for{' '}
              <Box component="span" sx={{ color: '#00695c' }}>
                Modern Banking
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}
            >
              Everything your team needs to deliver exceptional banking experiences — from
              account opening to customer management.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <FeatureCard {...f} delay={i * 100} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════ CTA SECTION ══════════ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(160deg, #001e3c 0%, #003c50 50%, #004d40 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative ring */}
        <Box
          sx={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(0,191,165,0.08)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: '#fff', mb: 2, letterSpacing: '-0.02em' }}
          >
            Ready to Transform Your Banking?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, lineHeight: 1.7 }}
          >
            Join hundreds of bank branches already using idigiBank to onboard
            customers faster and more securely.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={20} />}
            onClick={() => router.push('/signup')}
            sx={{
              borderRadius: '12px',
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
              boxShadow: '0 8px 32px rgba(0,105,92,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* ══════════ FOOTER ══════════ */}
      <Box
        component="footer"
        sx={{
          py: 4,
          background: '#001226',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Building2 size={18} color="#00bfa5" />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                © {new Date().getFullYear()} idigiBank. All rights reserved.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
                <Typography
                  key={link}
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#00bfa5' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
