export type PaletteTypeId =
  | 'indigo'
  | 'crimson'
  | 'emerald'
  | 'sunlight'
  | 'obsidian'
  | 'lavender'
  | 'tangerine'
  | 'turquoise'

export type PaletteTypeDefinition = {
  id: PaletteTypeId
  name: string
  subtitle: string
  keywords: string[]
  strengths: string
  weaknesses: string
  icon: string
  accent: string
  surface: string
}

export type FlowNodeId = `q${number}`

export type FlowTransition =
  | { kind: 'node'; target: FlowNodeId }
  | { kind: 'result'; result: PaletteTypeId }

export type TraitId =
  | 'structure_first'
  | 'documentation'
  | 'experimentation'
  | 'momentum'
  | 'people_focus'
  | 'empathy_support'
  | 'reflection'
  | 'bridge_builder'
  | 'quality_guard'
  | 'delivery_focus'
  | 'uplift'
  | 'aesthetic'

export type FlowOption = {
  id: string
  label: string
  description?: string
  traits: TraitId[]
  next: FlowTransition
}

export type FlowNode = {
  id: FlowNodeId
  title: string
  prompt: string
  detail?: string
  options: FlowOption[]
}

export type FlowAnswer = {
  optionId: string
  traits: TraitId[]
  next: FlowTransition
}

export type FlowStep = {
  nodeId: FlowNodeId
  answer?: FlowAnswer
}

export type TraitInsight = {
  id: TraitId
  title: string
  description: string
  emphasis?: string
}

export type FlowChartDefinition = {
  root: FlowNodeId
  order: FlowNodeId[]
  nodes: Record<FlowNodeId, FlowNode>
  traits: Record<TraitId, TraitInsight>
  totalQuestions: number
}
