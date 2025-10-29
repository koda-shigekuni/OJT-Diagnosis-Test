/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, Chip, Typography } from '@mui/material'
import { cubicBezier, motion } from 'framer-motion'
import diagnosisTextSource from '../data/diagnosisText.json'
import { TOTAL_QUESTIONS, paletteTypes } from '../paletteData'

type TitleScreenProps = {
  onStart: () => void
}

const diagnosisText = diagnosisTextSource

const easeOut = cubicBezier(0.22, 1, 0.36, 1)

const PRIMARY_GREEN = '#00913A'
const SECONDARY_GREEN = '#6FBA2C'

const TitleScreen = ({ onStart }: TitleScreenProps) => {
  const { hero, stats, cta } = diagnosisText.titleScreen
  const typeCount = Object.keys(paletteTypes).length
  const description = hero.descriptionTemplate.replace('{totalQuestions}', String(TOTAL_QUESTIONS))

  const statEntries = stats.map(stat => {
    if (stat.valueKey === 'totalQuestions') {
      return { ...stat, value: `${TOTAL_QUESTIONS}` }
    }
    if (stat.valueKey === 'typeCount') {
      return { ...stat, value: `${typeCount}` }
    }
    return { ...stat, value: stat.staticValue ?? '' }
  })

  return (
    <Box css={styles.container}>
      <motion.div
        css={styles.hero}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <motion.div css={styles.headline} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Typography variant="overline" css={styles.heroOverline}>
            {hero.overline}
          </Typography>
          <Typography variant="h2" component="h1" fontWeight={800} css={styles.heroTitle}>
            {hero.title}
          </Typography>
          <Typography variant="h6" component="p" css={styles.heroDescription}>
            {description}
          </Typography>
        </motion.div>

        <motion.div
          css={styles.statsRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: easeOut }}
        >
          {statEntries.map(stat => (
            <Box
              key={stat.label}
              css={styles.statCard}
              component={motion.div}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              <Typography variant="subtitle2" css={styles.statLabel}>
                {stat.label}
              </Typography>
              <Typography variant="h4" component="p" fontWeight={700}>
                {stat.value}
              </Typography>
              <Typography variant="body2" css={styles.statDescription}>
                {stat.description}
              </Typography>
            </Box>
          ))}
        </motion.div>

        <motion.div
          css={styles.ctaWrapper}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: easeOut }}
        >
          <Button
            variant="contained"
            size="large"
            color="inherit"
            onClick={onStart}
            data-testid="start-test"
            css={styles.ctaButton}
          >
            {cta.button}
          </Button>
          <Typography variant="caption" display="block" css={styles.ctaNote}>
            {cta.note}
          </Typography>
        </motion.div>
      </motion.div>

      <motion.div
        css={styles.chipRow}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {Object.values(paletteTypes).map(type => (
          <motion.div
            key={type.id}
            variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          >
            <Chip label={`${type.icon} ${type.name}`} color="primary" variant="outlined" css={styles.typeChip} />
          </motion.div>
        ))}
      </motion.div>
    </Box>
  )
}

export default TitleScreen

const styles = {
  container: css({
    display: 'grid',
    gap: 40,
    justifyItems: 'center',
    padding: '48px 16px 32px',
  }),
  hero: css({
    width: 'min(960px, 100%)',
    background: `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, ${SECONDARY_GREEN} 48%, #E3FFC8 100%)`,
    borderRadius: 32,
    padding: '48px clamp(24px, 5vw, 56px)',
    color: '#fff',
    boxShadow: '0 24px 48px rgba(0, 68, 32, 0.28)',
    display: 'grid',
    gap: 24,
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: "''",
      position: 'absolute',
      inset: 12,
      borderRadius: 24,
      border: '1px solid rgba(255,255,255,0.24)',
      pointerEvents: 'none',
    },
    '@media (max-width: 600px)': {
      textAlign: 'center',
      gap: 20,
      padding: '40px 24px',
    },
  }),
  headline: css({
    display: 'grid',
    gap: 8,
    position: 'relative',
    zIndex: 1,
    textAlign: 'left',
    '@media (max-width: 600px)': {
      textAlign: 'center',
    },
  }),
  heroOverline: css({
    letterSpacing: 4,
    opacity: 0.8,
  }),
  heroTitle: css({
    lineHeight: 1.2,
  }),
  heroDescription: css({
    opacity: 0.9,
    fontWeight: 500,
  }),
  statsRow: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 16,
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 720px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 520px)': {
      gridTemplateColumns: '1fr',
    },
  }),
  statCard: css({
    padding: '16px 20px',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.32)',
    display: 'grid',
    gap: 6,
  }),
  statLabel: css({
    opacity: 0.8,
  }),
  statDescription: css({
    opacity: 0.85,
  }),
  ctaWrapper: css({
    position: 'relative',
    zIndex: 1,
  }),
  ctaButton: css({
    fontWeight: 700,
    paddingInline: 48,
    paddingBlock: 12,
    borderRadius: 999,
    color: '#fff',
    background: `linear-gradient(90deg, ${PRIMARY_GREEN} 0%, ${SECONDARY_GREEN} 100%)`,
    boxShadow: '0 14px 30px rgba(0, 68, 32, 0.3)',
    '&:hover': {
      background: `linear-gradient(90deg, ${PRIMARY_GREEN} 0%, ${SECONDARY_GREEN} 100%)`,
      filter: 'brightness(1.05)',
    },
  }),
  ctaNote: css({
    marginTop: 12,
    opacity: 0.8,
  }),
  chipRow: css({
    width: 'min(960px, 100%)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  }),
  typeChip: css({
    borderRadius: 999,
    paddingInline: 12,
    fontWeight: 600,
    borderColor: `${PRIMARY_GREEN}33`,
    color: PRIMARY_GREEN,
    backgroundColor: '#F2FFE9',
  }),
}
