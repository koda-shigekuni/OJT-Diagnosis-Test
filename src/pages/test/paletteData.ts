import flowChartDefinition from './data/flowChart'
import paletteTypesSource from './data/paletteTypes.json'
import {
  type FlowChartDefinition,
  type FlowNode,
  type FlowNodeId,
  type FlowOption,
  type FlowTransition,
  type TraitId,
  type TraitInsight,
  type PaletteTypeDefinition,
  type PaletteTypeId,
} from './types/palette'

const paletteTypes = (paletteTypesSource as PaletteTypeDefinition[]).reduce(
  (acc, type) => {
    acc[type.id] = type
    return acc
  },
  {} as Record<PaletteTypeId, PaletteTypeDefinition>,
)

const flowChart: FlowChartDefinition = flowChartDefinition

const FLOW_TOTAL_QUESTIONS = flowChart.totalQuestions

const getFlowNode = (id: FlowNodeId): FlowNode | undefined => flowChart.nodes[id]

const getOptionById = (node: FlowNode, optionId: string): FlowOption | undefined =>
  node.options.find(option => option.id === optionId)

const isResultTransition = (transition: FlowTransition): transition is { kind: 'result'; result: PaletteTypeId } =>
  transition.kind === 'result'

const traitCatalog: Record<TraitId, TraitInsight> = flowChart.traits

export {
  FLOW_TOTAL_QUESTIONS as TOTAL_QUESTIONS,
  flowChart,
  getFlowNode,
  getOptionById,
  isResultTransition,
  paletteTypes,
  traitCatalog,
}
