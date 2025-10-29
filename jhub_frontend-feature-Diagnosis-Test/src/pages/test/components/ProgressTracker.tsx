/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import diagnosisTextSource from '../data/diagnosisText.json'

type ProgressTrackerProps = {
  progress: number
  answeredCount: number
  total: number
}

const diagnosisText = diagnosisTextSource

const ProgressTracker = ({ progress, answeredCount, total }: ProgressTrackerProps) => {
  const remaining = total - answeredCount
  const trackerText = diagnosisText.progressTracker
  const status = trackerText.statusTemplate
    .replace('{remaining}', String(remaining))
    .replace('{total}', String(total))
  return (
    <Box css={styles.tracker} role="status" aria-live="polite">
      <Box css={styles.metaRow}>
        <Box>
          <Typography variant="subtitle2" color="primary" fontWeight={700} css={styles.heading}>
            {trackerText.heading}
          </Typography>
          <Typography variant="h5" component="p" fontWeight={700}>
            {progress}% {trackerText.progressSuffix}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {status}
        </Typography>
      </Box>

      <LinearProgress variant="determinate" value={progress} css={styles.progressBar} />

      <Box css={styles.metaRow}>
        <Typography variant="body2" color="text.secondary">
          {trackerText.hint}
        </Typography>
        <Box css={styles.milestones}>
          <Chip label={`${trackerText.answered} ${answeredCount}`} color="primary" variant="outlined" />
          <Chip label={`${trackerText.unanswered} ${remaining}`} variant="outlined" />
        </Box>
      </Box>
    </Box>
  )
}

export default ProgressTracker

const styles = {
  tracker: css({
    background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.9) 0%, rgba(240, 244, 255, 0.9) 100%)',
    borderRadius: 24,
    padding: '24px clamp(16px, 4vw, 32px)',
    display: 'grid',
    gap: 16,
    boxShadow: '0 16px 36px rgba(38, 77, 145, 0.12)',
  }),
  metaRow: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  }),
  milestones: css({
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  }),
  heading: css({
    letterSpacing: 1,
  }),
  progressBar: css({
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      background: 'linear-gradient(90deg, #1976d2 0%, #26c6da 100%)',
    },
  }),
}
