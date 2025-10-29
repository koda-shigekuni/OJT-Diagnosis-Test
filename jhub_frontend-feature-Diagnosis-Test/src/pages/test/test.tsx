/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/material'
import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import ContentsWrapper from '../common/contentsWrapper'
import ProgressTracker from './components/ProgressTracker'
import QuestionCard from './components/QuestionCard'
import ResultView from './components/ResultView'
import TitleScreen from './components/TitleScreen'
import diagnosisTextSource from './data/diagnosisText.json'
import {
  TOTAL_QUESTIONS,
  flowChart,
  getFlowNode,
  getOptionById,
  isResultTransition,
  paletteTypes,
  traitCatalog,
} from './paletteData'
import { type FlowStep, type FlowNode } from './types/palette'
import { rankTraitInsights } from './utils/flow'

type Phase = 'intro' | 'quiz' | 'result'

type ResultState = {
  typeId: keyof typeof paletteTypes
  steps: FlowStep[]
}

const diagnosisText = diagnosisTextSource

const easeOut = cubicBezier(0.22, 1, 0.36, 1)

const transitionProps = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.4, ease: easeOut },
}

const initialStep = () => ({ nodeId: flowChart.root } as FlowStep)

const TestPage = () => {
  const [phase, setPhase] = useState<Phase>('intro')
  const [steps, setSteps] = useState<FlowStep[]>([initialStep()])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState<ResultState | null>(null)

  const currentStep = steps[currentIndex]
  const currentNode: FlowNode | undefined = currentStep ? getFlowNode(currentStep.nodeId) : undefined
  const selectedOptionId = currentStep?.answer?.optionId ?? null

  const answeredCount = useMemo(
    () => steps.filter(step => Boolean(step.answer)).length,
    [steps],
  )

  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100)

  const rankedTraits = useMemo(() => {
    if (!result) {
      return []
    }
    return rankTraitInsights(result.steps, traitCatalog)
  }, [result])

  const handleStart = () => {
    setPhase('quiz')
    setSteps([initialStep()])
    setCurrentIndex(0)
    setResult(null)
  }

  const handleSelect = (optionId: string) => {
    if (!currentNode) {
      return
    }
    const option = getOptionById(currentNode, optionId)
    if (!option) {
      return
    }

    setSteps(prev => {
      const existingStep = prev[currentIndex]
      if (!existingStep) {
        return prev
      }

      if (existingStep.answer?.optionId === option.id) {
        return prev
      }

      const nextSteps = prev.slice(0, currentIndex + 1)
      nextSteps[currentIndex] = {
        ...existingStep,
        answer: {
          optionId: option.id,
          traits: option.traits,
          next: option.next,
        },
      }

      return nextSteps
    })
  }

  const handlePrev = () => {
    if (currentIndex === 0) {
      return
    }
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    const step = steps[currentIndex]
    if (!step?.answer || !currentNode) {
      return
    }

    const option = getOptionById(currentNode, step.answer.optionId)
    if (!option) {
      return
    }

    if (isResultTransition(option.next)) {
      const snapshot = steps.slice(0, currentIndex + 1)
      setResult({ typeId: option.next.result, steps: snapshot })
      setPhase('result')
      return
    }

    const targetNodeId = option.next.target

    setSteps(prev => {
      const trimmed = prev.slice(0, currentIndex + 1)
      const nextStep = trimmed[currentIndex + 1]
      if (nextStep?.nodeId === targetNodeId) {
        return trimmed
      }
      return [...trimmed, { nodeId: targetNodeId }]
    })
    setCurrentIndex(prev => prev + 1)
  }

  const handleRestart = () => {
    setPhase('intro')
    setSteps([initialStep()])
    setCurrentIndex(0)
    setResult(null)
  }

  const totalQuestions = TOTAL_QUESTIONS
  const questionForView: FlowNode | undefined = phase === 'quiz' ? currentNode : undefined

  return (
    <ContentsWrapper title={diagnosisText.titles[phase]}>
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" {...transitionProps}>
            <TitleScreen onStart={handleStart} />
          </motion.div>
        )}

        {phase === 'quiz' && questionForView && (
          <motion.div key={`question-${questionForView.id}`} {...transitionProps}>
            <Box css={styles.quizLayout}>
              <ProgressTracker progress={progress} answeredCount={answeredCount} total={totalQuestions} />
              <QuestionCard
                question={questionForView}
                currentIndex={currentIndex}
                totalQuestions={totalQuestions}
                selectedOptionId={selectedOptionId}
                onSelect={handleSelect}
                onPrev={handlePrev}
                onNext={handleNext}
                canGoPrev={currentIndex > 0}
              />
            </Box>
          </motion.div>
        )}

        {phase === 'result' && result && (
          <motion.div key="result" {...transitionProps}>
            <ResultView
              typeId={result.typeId}
              traitRanking={rankedTraits}
              answeredCount={result.steps.filter(step => step.answer).length}
              totalQuestions={totalQuestions}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ContentsWrapper>
  )
}

export default TestPage

const styles = {
  quizLayout: css({
    display: 'grid',
    gap: 28,
    maxWidth: 'min(1040px, 100%)',
    margin: '0 auto',
    padding: '8px clamp(8px, 2vw, 16px) 48px',
  }),
}
