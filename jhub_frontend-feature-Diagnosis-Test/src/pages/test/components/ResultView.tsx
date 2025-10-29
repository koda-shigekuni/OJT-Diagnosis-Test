/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { alpha, darken, lighten } from '@mui/material/styles'
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material'
import { cubicBezier, motion } from 'framer-motion'
import diagnosisTextSource from '../data/diagnosisText.json'
import { paletteTypes } from '../paletteData'
import { type PaletteTypeDefinition } from '../types/palette'
import { type TraitRanking } from '../utils/flow'

type ResultViewProps = {
  typeId: PaletteTypeDefinition['id']
  traitRanking: TraitRanking[]
  answeredCount: number
  totalQuestions: number
  onRestart: () => void
}

const diagnosisText = diagnosisTextSource

const easeOut = cubicBezier(0.22, 1, 0.36, 1)

const ResultView = ({ typeId, traitRanking, answeredCount, totalQuestions, onRestart }: ResultViewProps) => {
  const type = paletteTypes[typeId]
  if (!type) {
    return null
  }

  const summary = diagnosisText.resultView
  const gradient = createGradient(type.accent)
  const keywordChips = type.keywords.slice(0, 4)

  return (
    <Box css={styles.layout}>
      <Card
        css={styles.summaryCard(gradient.background, gradient.text)}
        component={motion.section}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <CardContent css={styles.summaryContent}>
          <Box css={styles.summaryHeader}>
            <Typography variant="overline" css={styles.overline}>
              {summary.summaryOverline}
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={800} css={styles.title}>
              {`${type.icon} ${type.name}`}
            </Typography>
            <Typography variant="h6" component="p" css={styles.subtitle}>
              {type.subtitle}
            </Typography>
            <Typography variant="body1" css={styles.description}>
              {summary.summaryDescription}
            </Typography>
          </Box>

          <Box css={styles.keywordRow}>
            {keywordChips.map(keyword => (
              <Chip key={keyword} label={keyword} css={styles.keywordChip} />
            ))}
          </Box>

          <Box css={styles.detailGrid}>
            <Box>
              <Typography variant="subtitle2" css={styles.sectionLabel}>
                強み
              </Typography>
              <Typography variant="body1">{type.strengths}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" css={styles.sectionLabel}>
                {summary.weaknessPrefix}
              </Typography>
              <Typography variant="body2">{type.weaknesses}</Typography>
            </Box>
          </Box>

          <Typography variant="caption" css={styles.answerCount}>
            {`回答した設問数: ${answeredCount} / ${totalQuestions}`}
          </Typography>
        </CardContent>
      </Card>

      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOut, delay: 0.05 }}
        css={styles.traitSection}
      >
        <Typography variant="h5" component="h3" fontWeight={700}>
          {summary.tendencyHeading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary.tendencyHint}
        </Typography>
        <Box css={styles.traitGrid}>
          {traitRanking.map(entry => (
            <Box key={entry.trait} css={styles.traitCard}>
              <Typography variant="subtitle1" fontWeight={700}>
                {entry.insight.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.insight.description}
              </Typography>
              <Chip label={`x${entry.count}`} size="small" css={styles.traitBadge} />
            </Box>
          ))}
          {traitRanking.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              選択肢から特徴的な傾向はまだ読み取れませんでした。もう一度診断してみましょう。
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut, delay: 0.1 }}
        css={styles.restartWrapper}
      >
        <Button variant="contained" size="large" onClick={onRestart} data-testid="restart-button">
          {summary.restart}
        </Button>
      </Box>
    </Box>
  )
}

export default ResultView

const createGradient = (accent: string) => {
  const primary = alpha(accent, 0.92)
  const lighter = alpha(lighten(accent, 0.28), 0.96)
  const darker = alpha(darken(accent, 0.26), 0.88)
  return {
    background: `linear-gradient(135deg, ${lighter} 0%, ${primary} 45%, ${darker} 100%)`,
    text: '#ffffff',
  }
}

const styles = {
  layout: css({
    display: 'grid',
    gap: 28,
    maxWidth: 880,
    margin: '0 auto',
  }),
  summaryCard: (background: string, textColor: string) =>
    css({
      borderRadius: 32,
      background,
      color: textColor,
      boxShadow: '0 32px 56px rgba(0, 0, 0, 0.24)',
      overflow: 'hidden',
    }),
  summaryContent: css({
    display: 'grid',
    gap: 24,
    padding: '40px clamp(24px, 5vw, 56px)',
  }),
  summaryHeader: css({
    display: 'grid',
    gap: 12,
  }),
  overline: css({
    letterSpacing: 4,
    opacity: 0.8,
  }),
  title: css({
    lineHeight: 1.1,
  }),
  subtitle: css({
    opacity: 0.9,
  }),
  description: css({
    opacity: 0.92,
    lineHeight: 1.6,
  }),
  keywordRow: css({
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  }),
  keywordChip: css({
    borderRadius: 999,
    fontWeight: 600,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#ffffff',
    borderColor: 'rgba(255,255,255,0.24)',
  }),
  detailGrid: css({
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  }),
  sectionLabel: css({
    opacity: 0.85,
    letterSpacing: 1,
  }),
  answerCount: css({
    opacity: 0.8,
  }),
  traitSection: css({
    display: 'grid',
    gap: 16,
    padding: '24px clamp(16px, 4vw, 24px)',
    borderRadius: 28,
    background: 'linear-gradient(135deg, rgba(245, 248, 255, 0.96), rgba(230, 240, 255, 0.92))',
    boxShadow: '0 18px 32px rgba(20, 50, 120, 0.12)',
  }),
  traitGrid: css({
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  }),
  traitCard: css({
    position: 'relative',
    padding: '20px 20px 24px',
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 14px 28px rgba(33, 150, 243, 0.08)',
    display: 'grid',
    gap: 8,
  }),
  traitBadge: css({
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(33,150,243,0.16)',
    borderColor: 'rgba(33,150,243,0.32)',
    fontWeight: 600,
  }),
  restartWrapper: css({
    display: 'flex',
    justifyContent: 'center',
  }),
}
