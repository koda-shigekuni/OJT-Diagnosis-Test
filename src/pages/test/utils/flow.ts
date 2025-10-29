import { type FlowStep, type TraitId, type TraitInsight } from '../types/palette'

export type TraitRanking = {
  trait: TraitId
  count: number
  insight: TraitInsight
}

export const rankTraitInsights = (
  steps: FlowStep[],
  traitMap: Record<TraitId, TraitInsight>,
  limit = 3,
): TraitRanking[] => {
  const tally = new Map<TraitId, number>()

  steps.forEach(step => {
    if (!step.answer) {
      return
    }
    step.answer.traits.forEach(trait => {
      const next = (tally.get(trait) ?? 0) + 1
      tally.set(trait, next)
    })
  })

  const ranking = Array.from(tally.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([trait, count]) => ({ trait, count, insight: traitMap[trait] }))
    .filter(entry => Boolean(entry.insight))

  return ranking
}
