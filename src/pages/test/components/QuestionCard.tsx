/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { cubicBezier, motion } from 'framer-motion'
import diagnosisTextSource from '../data/diagnosisText.json'
import { type FlowNode, type FlowOption } from '../types/palette'

type QuestionCardProps = {
  question: FlowNode
  currentIndex: number
  totalQuestions: number
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
  onPrev: () => void
  onNext: () => void
  canGoPrev: boolean
}

const diagnosisText = diagnosisTextSource

const easeOut = cubicBezier(0.22, 1, 0.36, 1)

const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelect,
  onPrev,
  onNext,
  canGoPrev,
}: QuestionCardProps) => {
  const { helper, progressTemplate, statusLabel, unselected, back, next, viewResult, optionAriaLabel } =
    diagnosisText.questionCard

  const progressLabel = progressTemplate
    .replace('{current}', String(currentIndex + 1))
    .replace('{total}', String(totalQuestions))

  const selectedOption: FlowOption | undefined = question.options.find(option => option.id === selectedOptionId)
  const status = selectedOption ? selectedOption.label : unselected
  const primaryActionLabel = selectedOption?.next.kind === 'result' ? viewResult : next

  return (
    <Card
      css={styles.card}
      component={motion.section}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <CardContent css={styles.content}>
        <Box css={styles.header}>
          <Box css={styles.progressWrapper}>
            <span css={styles.progressBadge}>{progressLabel}</span>
            <Typography variant="h5" component="h2" fontWeight={700} css={styles.questionTitle}>
              {question.title}
            </Typography>
            <Typography variant="body1" css={styles.prompt}>
              {question.prompt}
            </Typography>
            {question.detail ? (
              <Typography variant="body2" color="text.secondary" css={styles.helperText}>
                {question.detail}
              </Typography>
            ) : null}
          </Box>
          <Typography variant="body2" color="text.secondary" css={styles.helper}>
            {helper}
          </Typography>
        </Box>

        <Box component="ul" css={styles.optionList} aria-label={optionAriaLabel}>
          {question.options.map(option => {
            const selected = option.id === selectedOptionId
            return (
              <li key={option.id} css={styles.optionItem}>
                <Button
                  fullWidth
                  variant={selected ? 'contained' : 'outlined'}
                  color={selected ? 'primary' : 'inherit'}
                  onClick={() => onSelect(option.id)}
                  css={styles.optionButton(selected)}
                >
                  <Box css={styles.optionContent}>
                    <Typography variant="subtitle1" fontWeight={700} css={styles.optionLabel(selected)}>
                      {option.label}
                    </Typography>
                    {option.description ? (
                      <Typography variant="body2" color="inherit" css={styles.optionDescription}>
                        {option.description}
                      </Typography>
                    ) : null}
                  </Box>
                </Button>
              </li>
            )
          })}
        </Box>

        <Box css={styles.statusRow}>
          <Typography variant="body2" color="text.secondary">
            {statusLabel}: {status}
          </Typography>
          <Box css={styles.navRow}>
            <Button variant="outlined" color="primary" onClick={onPrev} disabled={!canGoPrev}>
              {back}
            </Button>
            <Button variant="contained" color="primary" onClick={onNext} disabled={!selectedOptionId}>
              {primaryActionLabel}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QuestionCard

const styles = {
  card: css({
    borderRadius: 28,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(244, 250, 255, 0.92))',
    boxShadow: '0 24px 48px rgba(23, 43, 77, 0.16)',
  }),
  content: css({
    display: 'grid',
    gap: 28,
    padding: '32px clamp(20px, 4vw, 48px)',
  }),
  header: css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  }),
  progressWrapper: css({
    display: 'grid',
    gap: 12,
  }),
  progressBadge: css({
    borderRadius: 999,
    padding: '6px 16px',
    background: 'rgba(25, 118, 210, 0.12)',
    color: '#0D47A1',
    fontWeight: 700,
    letterSpacing: 1.2,
    width: 'fit-content',
  }),
  questionTitle: css({
    marginTop: 4,
  }),
  prompt: css({
    marginTop: 4,
    lineHeight: 1.6,
  }),
  helperText: css({
    marginTop: 4,
  }),
  helper: css({
    maxWidth: 260,
    marginLeft: 'auto',
  }),
  optionList: css({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 16,
  }),
  optionItem: css({
    display: 'block',
  }),
  optionButton: (selected: boolean) =>
    css({
      justifyContent: 'flex-start',
      padding: '18px 20px',
      borderRadius: 20,
      borderWidth: selected ? 0 : 1,
      textTransform: 'none',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      boxShadow: selected ? '0 18px 34px rgba(25, 118, 210, 0.26)' : 'none',
      background: selected
        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.92), rgba(33, 203, 243, 0.86))'
        : 'rgba(255,255,255,0.9)',
      color: selected ? '#fff' : 'inherit',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: selected ? '0 22px 40px rgba(25, 118, 210, 0.32)' : '0 12px 24px rgba(15, 81, 156, 0.12)',
        background: selected
          ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.95), rgba(33, 203, 243, 0.9))'
          : 'rgba(245, 249, 255, 0.96)',
      },
    }),
  optionContent: css({
    display: 'grid',
    gap: 6,
    textAlign: 'left',
  }),
  optionLabel: (selected: boolean) =>
    css({
      color: selected ? '#fff' : 'inherit',
    }),
  optionDescription: css({
    opacity: 0.9,
  }),
  statusRow: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  }),
  navRow: css({
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  }),
}
