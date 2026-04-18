'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Activity,
  ArrowRight,
  Brain,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Lock,
  Network,
  Pause,
  Play,
  Shield,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo, { KylrixApp } from '@/components/Logo';

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  lede: string;
  accent: string;
  notes: string;
  objectionPrep?: string;
  renderVisual: () => React.ReactNode;
};

type AppPitch = {
  app: KylrixApp;
  label: string;
  accent: string;
  copy: string;
  edge: string;
};

const APP_PITCHES: AppPitch[] = [
  {
    app: 'note',
    label: 'Kylrix Note',
    accent: '#EC4899',
    copy: 'Structured knowledge with AI context.',
    edge: 'The graph stays local and owned.',
  },
  {
    app: 'vault',
    label: 'Kylrix Vault',
    accent: '#10B981',
    copy: 'Secrets, keys, and assets.',
    edge: 'Zero-knowledge storage by default.',
  },
  {
    app: 'flow',
    label: 'Kylrix Flow',
    accent: '#A855F7',
    copy: 'Tasks, calendars, and work state.',
    edge: 'Reactive orchestration across the stack.',
  },
  {
    app: 'connect',
    label: 'Kylrix Connect',
    accent: '#F59E0B',
    copy: 'Zero-knowledge communication.',
    edge: 'Private pulses, not data bloat.',
  },
];

const TAGLINE_VARIANTS = [
  'The open-source, E2EE Notion/Discord alternative.',
  'Open-source, encrypted work for teams.',
  'Notes, voice huddles, forms, and vaults in one graph.',
  'Everything talks to everything, securely.',
];

const surface = {
  bgcolor: '#161514',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '0 24px 80px rgba(0,0,0,0.42)',
};

function SectionLabel({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: accent,
        letterSpacing: '0.32em',
        fontWeight: 900,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  );
}

function MetricCard({
  accent,
  title,
  value,
  icon,
}: {
  accent: string;
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Paper
      sx={{
        ...surface,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: alpha(accent, 0.16),
          color: accent,
          flex: '0 0 auto',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
      </Box>
    </Paper>
  );
}

function AppTile({ app, label, accent, copy, edge }: AppPitch) {
  return (
    <Paper
      sx={{
        ...surface,
        p: 2.25,
        borderTop: `2px solid ${accent}`,
        display: 'grid',
        gap: 1.25,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Logo app={app} variant="icon" size={42} />
        <Box>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.05 }}>{label}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
            {copy}
          </Typography>
        </Box>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.55,
        }}
      >
        {edge}
      </Typography>
    </Paper>
  );
}

function SlideShell({
  slide,
  children,
}: {
  slide: Slide;
  children: React.ReactNode;
}) {
  return (
    <Grid container spacing={4.5} alignItems="center" sx={{ minHeight: { md: '62vh' } }}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Stack spacing={3.25}>
          <SectionLabel accent={slide.accent}>{slide.eyebrow}</SectionLabel>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Clash Display Variable", "Clash Display", sans-serif',
                fontSize: { xs: '2.8rem', md: '4.8rem' },
                lineHeight: 0.95,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                maxWidth: 720,
              }}
            >
              {slide.title}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: { xs: '1.02rem', md: '1.15rem' },
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            {slide.lede}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>{children}</Grid>
    </Grid>
  );
}

function HeroOrbit() {
  const orbitalCards = [
    { app: 'note' as KylrixApp, label: 'Note', x: -180, y: -110 },
    { app: 'vault' as KylrixApp, label: 'Vault', x: 180, y: -110 },
    { app: 'flow' as KylrixApp, label: 'Flow', x: -180, y: 110 },
    { app: 'connect' as KylrixApp, label: 'Connect', x: 180, y: 110 },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 460,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(99,102,241,0.16) 0%, rgba(0,0,0,0) 48%), radial-gradient(circle at 70% 30%, rgba(236,72,153,0.12) 0%, rgba(0,0,0,0) 32%), radial-gradient(circle at 30% 70%, rgba(245,158,11,0.08) 0%, rgba(0,0,0,0) 30%)',
          filter: 'blur(8px)',
        }}
      />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Paper
          sx={{
            ...surface,
            position: 'relative',
            px: 4,
            py: 4,
            borderRadius: 6,
            display: 'grid',
            justifyItems: 'center',
            gap: 2,
            maxWidth: 380,
          }}
        >
          <Logo app="root" size={112} variant="icon" animate />
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 900, fontSize: '1.55rem', letterSpacing: '-0.03em' }}>
              The open-source, E2EE Notion/Discord alternative.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)', mt: 0.75, lineHeight: 1.6 }}>
              Notes, voice huddles, forms, and a secure vault—deeply integrated so your tools finally talk to each other.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            <Chip label="E2EE" sx={{ bgcolor: alpha('#6366F1', 0.18), color: '#fff' }} />
            <Chip label="Open source" sx={{ bgcolor: alpha('#10B981', 0.18), color: '#fff' }} />
            <Chip label="Universal session" sx={{ bgcolor: alpha('#F59E0B', 0.18), color: '#fff' }} />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            {TAGLINE_VARIANTS.map((tagline) => (
              <Chip
                key={tagline}
                label={tagline}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.82)',
                  maxWidth: 320,
                }}
              />
            ))}
          </Stack>
        </Paper>
      </motion.div>

      {orbitalCards.map((item) => (
        <motion.div
          key={item.label}
          animate={{ x: item.x, y: [item.y, item.y - 8, item.y] }}
          transition={{ duration: 6 + Math.abs(item.x) / 100, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
          }}
        >
          <Paper
            sx={{
              ...surface,
              px: 2,
              py: 1.5,
              minWidth: 140,
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
            }}
          >
            <Logo app={item.app} variant="icon" size={34} />
            <Box>
              <Typography sx={{ fontWeight: 850, lineHeight: 1 }}>{item.label}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                Sovereign surface
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      ))}
    </Box>
  );
}

function ProblemVisual() {
  const items = [
    {
      title: 'Centralization',
      copy: 'Sensitive work lives on servers users do not control.',
      icon: <Shield size={20} />,
      accent: '#F59E0B',
    },
    {
      title: 'AI privacy risk',
      copy: 'Modern AI agents need access, but cloud processing is a security risk.',
      icon: <Brain size={20} />,
      accent: '#EC4899',
    },
    {
      title: 'Fragmented tools',
      copy: 'Users jump between disconnected apps that never share a real graph.',
      icon: <Boxes size={20} />,
      accent: '#A855F7',
    },
  ];

  return (
    <Stack spacing={2.25}>
      {items.map((item) => (
        <Paper
          key={item.title}
          sx={{
            ...surface,
            p: 2.25,
            borderLeft: `3px solid ${item.accent}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(item.accent, 0.16),
              color: item.accent,
              flex: '0 0 auto',
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>{item.title}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>
              {item.copy}
            </Typography>
          </Box>
        </Paper>
      ))}

      <Paper
        sx={{
          ...surface,
          p: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.22em' }}>
          WHY NOW
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 800, lineHeight: 1.65 }}>
          AI wants context, teams want speed, and users want control instead of surrender.
        </Typography>
      </Paper>
    </Stack>
  );
}

function TriadVisual() {
  return (
    <Stack spacing={2.25}>
      <Grid container spacing={2.25}>
        {APP_PITCHES.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
            <AppTile {...item} />
          </Grid>
        ))}
      </Grid>
      <Paper
        sx={{
          ...surface,
          p: 2.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 900 }}>One session across the stack.</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)', lineHeight: 1.55 }}>
            One owner. One encrypted graph. Specialized apps that feel distinct but behave as one system.
          </Typography>
        </Box>
        <Logo app="root" variant="icon" size={56} />
      </Paper>
    </Stack>
  );
}

function AgentsVisual() {
  return (
    <Stack spacing={2.25}>
      <Paper
        sx={{
          ...surface,
          p: 2.5,
          display: 'grid',
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: alpha('#6366F1', 0.16),
              display: 'grid',
              placeItems: 'center',
              color: '#6366F1',
            }}
          >
            <Brain size={22} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Kylrix Agents</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.56)' }}>
              Local-first AI that can see and act across encrypted apps.
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="Reads encrypted context" sx={{ bgcolor: alpha('#6366F1', 0.16), color: '#fff' }} />
          <Chip label="Acts on-device" sx={{ bgcolor: alpha('#10B981', 0.16), color: '#fff' }} />
          <Chip label="Leaves no cloud trail" sx={{ bgcolor: alpha('#EC4899', 0.16), color: '#fff' }} />
        </Stack>
      </Paper>

      <Paper
        sx={{
          ...surface,
          p: 2.5,
          display: 'grid',
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: alpha('#F59E0B', 0.16),
              display: 'grid',
              placeItems: 'center',
              color: '#F59E0B',
            }}
          >
            <Wallet size={22} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Kylrix Wallet</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.56)' }}>
              Non-custodial financial rails for autonomous on-chain settlement.
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Lock size={16} color="#F59E0B" />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.68)' }}>
              The user owns the keys, the state, and the execution path.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Activity size={16} color="#F59E0B" />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.68)' }}>
              Settlement becomes a native part of work, not an external ritual.
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        sx={{
          ...surface,
          p: 2.25,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Network size={18} color="#A855F7" />
          <Typography sx={{ fontWeight: 850 }}>If blockchain disappears, this breaks.</Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.66)', lineHeight: 1.55 }}>
          Composability, permissionless access, and trustless settlement are not decorations here.
        </Typography>
      </Paper>
    </Stack>
  );
}

function BusinessVisual() {
  return (
    <Stack spacing={2.25}>
      <Grid container spacing={2.25}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard accent="#6366F1" title="Core" value="Open-source" icon={<Layers3 size={18} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard accent="#10B981" title="Pro tier" value="Sovereign features" icon={<Sparkles size={18} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard accent="#F59E0B" title="Sync" value="Managed encrypted" icon={<Target size={18} />} />
        </Grid>
      </Grid>

      <Paper
        sx={{
          ...surface,
          p: 3,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.52)', letterSpacing: '0.22em' }}>
          TARGETS
        </Typography>
        <Stack spacing={2} sx={{ mt: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>2026 ARR target</Typography>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '2.75rem', letterSpacing: '-0.04em' }}>
              $400,000
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.05rem' }}>Scale trigger</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.6 }}>
              $5k - $10k MRR triggers the full-time transition to scale operations globally.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

function DesignVisual() {
  const swatches = [
    { name: 'Void', value: '#000000', accent: '#000000' },
    { name: 'Surface', value: '#161514', accent: '#161514' },
    { name: 'Highlight', value: '#1F1D1B', accent: '#1F1D1B' },
    { name: 'Indigo', value: '#6366F1', accent: '#6366F1' },
    { name: 'Emerald', value: '#10B981', accent: '#10B981' },
    { name: 'Amber', value: '#F59E0B', accent: '#F59E0B' },
    { name: 'Pink', value: '#EC4899', accent: '#EC4899' },
    { name: 'Amethyst', value: '#A855F7', accent: '#A855F7' },
  ];

  return (
    <Stack spacing={2.25}>
      <Grid container spacing={2.25}>
        {swatches.map((item) => (
          <Grid key={item.name} size={{ xs: 6, sm: 3 }}>
            <Paper
              sx={{
                ...surface,
                p: 1.5,
              }}
            >
              <Box
                sx={{
                  height: 54,
                  borderRadius: 2,
                  bgcolor: item.value,
                  border: item.value === '#000000' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              />
              <Typography sx={{ mt: 1.15, fontWeight: 850 }}>{item.name}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.56)' }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          ...surface,
          p: 2.5,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Logo app="root" variant="icon" size={44} />
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Pitch in code, not in a slide app.</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)', lineHeight: 1.55 }}>
              The visuals use the exact app geometry, colors, and logos so the pitch feels like a live surface.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

function ClosingVisual() {
  return (
    <Paper
      sx={{
        ...surface,
        p: { xs: 3, md: 4 },
        display: 'grid',
        gap: 2,
        justifyItems: 'center',
        textAlign: 'center',
      }}
    >
      <Logo app="root" variant="icon" size={96} animate />
      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: '1.7rem', letterSpacing: '-0.03em' }}>
          Build the sovereign layer for modern work.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.68)', mt: 1, lineHeight: 1.65 }}>
          Own the data. Keep the utility. Make the pitch feel like the product.
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
        <Chip label="Pilots" sx={{ bgcolor: alpha('#6366F1', 0.16), color: '#fff' }} />
        <Chip label="Partners" sx={{ bgcolor: alpha('#10B981', 0.16), color: '#fff' }} />
        <Chip label="Capital" sx={{ bgcolor: alpha('#F59E0B', 0.16), color: '#fff' }} />
      </Stack>
    </Paper>
  );
}

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: 0,
        eyebrow: 'VISION',
        title: 'Kylrix: The Sovereign Work OS',
        lede:
          'The open-source, E2EE Notion/Discord alternative: notes, voice huddles, forms, and a secure vault deeply integrated so the tools finally talk to each other.',
        accent: '#6366F1',
        notes:
          'Open with the trade-off we reject: modern productivity forces users to surrender data for utility. Kylrix keeps the utility and removes the surrender. Repeat the positioning in shorter form if needed: open-source, encrypted work for teams.',
        renderVisual: () => <HeroOrbit />,
      },
      {
        id: 1,
        eyebrow: 'PROBLEM',
        title: 'The privacy-utility paradox',
        lede:
          'Current productivity suites are still built on central trust, cloud exposure, and fragmented workflows—the opposite of an open-source, E2EE Notion/Discord alternative.',
        accent: '#F59E0B',
        notes:
          'Say the problem plainly: sensitive work data lives on servers users do not control, AI needs access but cloud processing is risky, and the tools people use do not share a sovereign graph.',
        objectionPrep:
          'If someone says this is just a nicer productivity suite, answer that the core difference is ownership: Kylrix keeps data encrypted, local-first, and composable across apps.',
        renderVisual: () => <ProblemVisual />,
      },
      {
        id: 2,
        eyebrow: 'WHY NOW',
        title: 'AI, trust, and work state changed at once',
        lede:
          'Modern AI agents need context, but the cloud is the wrong place for everything. Users also want one identity across every surface, not a stack of disconnected tools.',
        accent: '#A855F7',
        notes:
          'This is the timing slide. The market now expects agents, but that expectation collides with the privacy model of traditional SaaS. Kylrix is the answer to that collision.',
        renderVisual: () => (
          <Stack spacing={2.25}>
            <Paper sx={{ ...surface, p: 2.5 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>
                Three shifts happened together.
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                {[
                  ['AI moved from novelty to workflow.', '#6366F1'],
                  ['Users became more sensitive to cloud risk.', '#F59E0B'],
                  ['Teams need one session across every app.', '#10B981'],
                ].map(([text, accent]) => (
                  <Stack key={text} direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: accent,
                        flex: '0 0 auto',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
            <Paper sx={{ ...surface, p: 2.25 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.52)', letterSpacing: '0.22em' }}>
                THE WINDOW
              </Typography>
              <Typography sx={{ mt: 1, fontWeight: 850, lineHeight: 1.65 }}>
                Kylrix can be the private operating layer for the AI-first work era.
              </Typography>
            </Paper>
          </Stack>
        ),
      },
      {
        id: 3,
        eyebrow: 'SOLUTION',
        title: 'The Kylrix triad',
        lede:
          'Note, Vault, Flow, and Connect are not separate products. They are specialized surfaces in one sovereign graph: notes, voice huddles, forms, and secure vaults that actually talk to each other.',
        accent: '#10B981',
        notes:
          'Use the exact app logos and colors here. The pitch should visually prove that the ecosystem is one system with multiple faces, not a loose bundle of apps.',
        renderVisual: () => <TriadVisual />,
      },
      {
        id: 4,
        eyebrow: 'X-FACTOR',
        title: 'Agents + wallet',
        lede:
          'Local-first AI can see and act across encrypted apps without data leaving the device. The wallet turns the work OS into an execution layer.',
        accent: '#EC4899',
        notes:
          'This is the compounding layer. The apps are useful alone; the agents and wallet make them atomic and defensible.',
        objectionPrep:
          'If the blockchain question comes up, answer that settlement, permissionless access, and autonomous execution all break if you remove it.',
        renderVisual: () => <AgentsVisual />,
      },
      {
        id: 5,
        eyebrow: 'BUSINESS MODEL',
        title: 'How it becomes a business',
        lede:
          'Open-source core, paid sovereign layer, and managed encrypted sync for teams that want an open-source, E2EE Notion/Discord alternative without carrying all the burden.',
        accent: '#6366F1',
        notes:
          'Keep the numbers literal. The model should be crisp: the open-source core drives adoption, Sovereign Pro monetizes advanced agentic features, and managed sync captures teams that want control plus convenience.',
        objectionPrep:
          'If the ask is challenged, do not invent one. Keep the current deck honest and replace the placeholder only after the actual raise or partnership target is set.',
        renderVisual: () => <BusinessVisual />,
      },
      {
        id: 6,
        eyebrow: 'DESIGN PHILOSOPHY',
        title: 'Muted Bold, but code-defined',
        lede:
          'Pitch black canvas. Deep ash surfaces. Rim-lit hardware. Real app components and exact logos instead of generic slideware.',
        accent: '#F59E0B',
        notes:
          'Explain that the deck is built in code on purpose. The pitch should feel like a live product surface because Kylrix itself is a live product surface.',
        renderVisual: () => <DesignVisual />,
      },
      {
        id: 7,
        eyebrow: 'CLOSING',
        title: 'Make the work sovereign.',
        lede:
          'Kylrix is the layer where identity, secrets, tasks, comms, and AI stay sovereign. Build the future of work without surrendering control—because your tools should finally talk to each other.',
        accent: '#10B981',
        notes:
          'End with conviction. If this is for external use, replace the generic closing with the exact ask, milestone, and audience before sending.',
        renderVisual: () => <ClosingVisual />,
      },
    ],
    []
  );

  const activeSlide = slides[currentSlide];

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 12000);

    return () => window.clearInterval(timer);
  }, [isPlaying, slides.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
      if (event.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
      if (event.key === ' ') {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (event.key.toLowerCase() === 'n') {
        setShowNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slides.length]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#000',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 38%), radial-gradient(circle at top right, rgba(245,158,11,0.12), transparent 32%), radial-gradient(circle at bottom center, rgba(16,185,129,0.08), transparent 34%)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 3.5 }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ flexWrap: 'wrap' }}
          >
            <Logo app="root" variant="full" size={42} />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                label={`${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 800 }}
              />
              <IconButton
                onClick={() => setIsPlaying((prev) => !prev)}
                sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </IconButton>
              <IconButton
                onClick={() => setShowNotes((prev) => !prev)}
                sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Sparkles size={18} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                sx={{
                  flex: 1,
                  height: 3,
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: index <= currentSlide ? '100%' : '0%',
                    height: '100%',
                    bgcolor: index === currentSlide ? slide.accent : 'rgba(255,255,255,0.26)',
                    transition: 'width 240ms ease, background-color 240ms ease',
                  }}
                />
              </Box>
            ))}
          </Stack>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <SlideShell slide={activeSlide}>{activeSlide.renderVisual()}</SlideShell>
            </motion.div>
          </AnimatePresence>

          {showNotes && (
            <Paper
              sx={{
                ...surface,
                p: 2.25,
                display: 'grid',
                gap: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="caption" sx={{ letterSpacing: '0.22em', color: 'rgba(255,255,255,0.5)' }}>
                  SPEAKER NOTES
                </Typography>
                {activeSlide.objectionPrep ? (
                  <Chip
                    label="Objection prep included"
                    sx={{ bgcolor: alpha(activeSlide.accent, 0.16), color: '#fff' }}
                  />
                ) : null}
              </Stack>
              <Typography sx={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
                {activeSlide.notes}
              </Typography>
              {activeSlide.objectionPrep ? (
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    bgcolor: alpha(activeSlide.accent, 0.08),
                    border: `1px solid ${alpha(activeSlide.accent, 0.18)}`,
                  }}
                >
                  <Typography variant="caption" sx={{ color: activeSlide.accent, letterSpacing: '0.18em' }}>
                    HARD QUESTION
                  </Typography>
                  <Typography sx={{ mt: 0.75, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>
                    {activeSlide.objectionPrep}
                  </Typography>
                </Box>
              ) : null}
            </Paper>
          )}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ flexWrap: 'wrap' }}
          >
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ChevronRight />
              </IconButton>
            </Stack>

            <Button
              onClick={() =>
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : (prev + 1) % slides.length))
              }
              endIcon={<ArrowRight />}
              sx={{
                color: '#000',
                bgcolor: activeSlide.accent,
                fontWeight: 900,
                px: 2.5,
                '&:hover': {
                  bgcolor: activeSlide.accent,
                  filter: 'brightness(1.08)',
                },
              }}
            >
              {activeSlide.id === slides.length - 1 ? 'Close deck' : 'Next slide'}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
