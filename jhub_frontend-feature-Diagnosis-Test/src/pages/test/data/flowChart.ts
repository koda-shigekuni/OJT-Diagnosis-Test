import { type FlowChartDefinition, type FlowNode, type TraitInsight } from '../types/palette'

const traitCatalog: TraitInsight[] = [
  {
    id: 'structure_first',
    title: '構造から考える',
    description: '全体像を描きながら筋道を整理し、安定した土台を組み上げる傾向があります。',
  },
  {
    id: 'documentation',
    title: '言語化と共有を大切にする',
    description: '知識を残すことに価値を見いだし、ドキュメントやガイドでチームを支えます。',
  },
  {
    id: 'experimentation',
    title: 'まず触れて学ぶ',
    description: '試行錯誤を恐れずに手を動かし、検証しながら進むスピード感を持っています。',
  },
  {
    id: 'momentum',
    title: '推進力がある',
    description: '小さな前進を積み重ねてプロジェクトを前へと押し出す推進力が特徴です。',
  },
  {
    id: 'people_focus',
    title: '人を中心に据える',
    description: '周囲の様子をよく観察し、誰がどのように感じているかを気に掛けられます。',
  },
  {
    id: 'empathy_support',
    title: '伴走と共感',
    description: '困っている人に寄り添い、安心して進めるようサポートする姿勢が際立っています。',
  },
  {
    id: 'reflection',
    title: '内省して磨く',
    description: '選んだ方針を振り返り、より良い手法を模索する内省力があります。',
  },
  {
    id: 'bridge_builder',
    title: '橋渡し役になれる',
    description: '異なる立場や領域をつなぎ、共通言語を見つけ出す調整力が備わっています。',
  },
  {
    id: 'quality_guard',
    title: '品質を守る',
    description: '検証やルールを重視し、リスクを早期に検知する品質意識が高いタイプです。',
  },
  {
    id: 'delivery_focus',
    title: '成果に着地させる',
    description: 'スケジュールと優先度を見極め、着実にゴールへ導くことに長けています。',
  },
  {
    id: 'uplift',
    title: '場を明るくする',
    description: '前向きな声かけやリアクションで、チームのムードを温めることができます。',
  },
  {
    id: 'aesthetic',
    title: '体験をデザインする',
    description: '細部の美しさや心地よさに敏感で、印象的な体験づくりを得意とします。',
  },
]

// ----------------------------------------------------------
// 設問文と回答文を分かりやすく改訂したフルバージョン
// ----------------------------------------------------------

const flowNodes: FlowNode[] = [
  {
    id: 'q1',
    title: 'プロジェクト初日',
    prompt: 'プロジェクトの最初、何から始めますか？',
    detail: '最初に思いつく行動を選んでください。',
    options: [
      {
        id: 'q1-structure',
        label: 'まず要件を整理して全体の流れをつかむ',
        traits: ['structure_first', 'documentation'],
        next: { kind: 'node', target: 'q2' },
      },
      {
        id: 'q1-prototype',
        label: 'とりあえず手を動かして試してみる',
        traits: ['experimentation', 'momentum'],
        next: { kind: 'node', target: 'q5' },
      },
      {
        id: 'q1-team',
        label: 'まずチームで話して雰囲気をつくる',
        traits: ['people_focus', 'empathy_support'],
        next: { kind: 'node', target: 'q8' },
      },
    ],
  },
  {
    id: 'q2',
    title: '情報の集め方',
    prompt: '仕様を理解するとき、どこを重視しますか？',
    options: [
      {
        id: 'q2-map',
        label: '図やメモで整理して全体像をつかむ',
        traits: ['structure_first', 'reflection'],
        next: { kind: 'node', target: 'q3' },
      },
      {
        id: 'q2-quality',
        label: '既存のコードを読んで抜け漏れを確認する',
        traits: ['quality_guard', 'documentation'],
        next: { kind: 'node', target: 'q4' },
      },
      {
        id: 'q2-bridge',
        label: '関係者に話を聞いて現場のリアルを知る',
        traits: ['bridge_builder', 'people_focus'],
        next: { kind: 'node', target: 'q12' },
      },
    ],
  },
  {
    id: 'q3',
    title: '設計レビューの準備',
    prompt: '設計をまとめるとき、何を意識しますか？',
    options: [
      {
        id: 'q3-principle',
        label: 'ルールや考え方を整理して納得感を持たせる',
        traits: ['structure_first', 'reflection'],
        next: { kind: 'node', target: 'q13' },
      },
      {
        id: 'q3-risk',
        label: 'リスクや制約を洗い出して品質を固める',
        traits: ['quality_guard', 'documentation'],
        next: { kind: 'node', target: 'q4' },
      },
      {
        id: 'q3-bridge',
        label: '他職種の視点を取り入れて共通理解をつくる',
        traits: ['bridge_builder', 'empathy_support'],
        next: { kind: 'node', target: 'q12' },
      },
    ],
  },
  {
    id: 'q4',
    title: '品質を守る場面',
    prompt: 'レビューのとき、どこに一番気をつけますか？',
    options: [
      {
        id: 'q4-tests',
        label: 'テストやLintで不具合を早めに見つける',
        traits: ['quality_guard', 'delivery_focus'],
        next: { kind: 'node', target: 'q14' },
      },
      {
        id: 'q4-guides',
        label: 'ルールや知見をまとめてチームに共有する',
        traits: ['documentation', 'bridge_builder'],
        next: { kind: 'node', target: 'q12' },
      },
      {
        id: 'q4-polish',
        label: '見た目や体験を整えて完成度を高める',
        traits: ['aesthetic', 'reflection'],
        next: { kind: 'node', target: 'q11' },
      },
    ],
  },
  {
    id: 'q5',
    title: '動きながら考える',
    prompt: '新しい機能を頼まれたとき、どう動きますか？',
    options: [
      {
        id: 'q5-prototype',
        label: '小さく作って試しながら手応えをつかむ',
        traits: ['experimentation', 'momentum'],
        next: { kind: 'node', target: 'q6' },
      },
      {
        id: 'q5-plan',
        label: 'タスクを分けて計画的に進める',
        traits: ['delivery_focus', 'structure_first'],
        next: { kind: 'node', target: 'q7' },
      },
      {
        id: 'q5-experience',
        label: 'UIや雰囲気を描いて体験を先に固める',
        traits: ['aesthetic', 'experimentation'],
        next: { kind: 'node', target: 'q11' },
      },
    ],
  },
  {
    id: 'q6',
    title: '未知の技術への向き合い方',
    prompt: '新しい技術を使うとき、どう進めますか？',
    options: [
      {
        id: 'q6-dive',
        label: '試しながら仮説を立てて学ぶ',
        traits: ['experimentation', 'momentum'],
        next: { kind: 'node', target: 'q10' },
      },
      {
        id: 'q6-plan',
        label: '安全に進めるための検証計画を立てる',
        traits: ['quality_guard', 'delivery_focus'],
        next: { kind: 'node', target: 'q7' },
      },
      {
        id: 'q6-team',
        label: '仲間と知識をシェアしながら進める',
        traits: ['people_focus', 'uplift'],
        next: { kind: 'node', target: 'q9' },
      },
    ],
  },
  {
    id: 'q7',
    title: '締め切り直前の判断',
    prompt: 'リリース直前、どんな判断をしますか？',
    options: [
      {
        id: 'q7-kanban',
        label: '重要度を見直して計画通りに完了させる',
        traits: ['delivery_focus', 'structure_first'],
        next: { kind: 'node', target: 'q10' },
      },
      {
        id: 'q7-support',
        label: 'チームの状況を見てフォローに回る',
        traits: ['people_focus', 'empathy_support'],
        next: { kind: 'node', target: 'q9' },
      },
      {
        id: 'q7-polish',
        label: '最後の仕上げで印象をもう一段高める',
        traits: ['aesthetic', 'reflection'],
        next: { kind: 'node', target: 'q11' },
      },
    ],
  },
  {
    id: 'q8',
    title: 'チームの空気',
    prompt: 'チームが不安定なとき、どう動きますか？',
    options: [
      {
        id: 'q8-light',
        label: '雑談などで場をやわらげる',
        traits: ['uplift', 'people_focus'],
        next: { kind: 'node', target: 'q9' },
      },
      {
        id: 'q8-listen',
        label: '悩みを聞いて寄り添う',
        traits: ['empathy_support', 'bridge_builder'],
        next: { kind: 'node', target: 'q15' },
      },
      {
        id: 'q8-structure',
        label: '進め方を整理して安心できる流れをつくる',
        traits: ['documentation', 'structure_first'],
        next: { kind: 'node', target: 'q12' },
      },
    ],
  },
  {
    id: 'q9',
    title: 'ミーティングで意識すること',
    prompt: '朝会などのミーティングで、どう振る舞いますか？',
    options: [
      {
        id: 'q9-uplift',
        label: '前向きな雰囲気をつくって明るくする',
        traits: ['uplift', 'momentum'],
        next: { kind: 'result', result: 'sunlight' },
      },
      {
        id: 'q9-quiet',
        label: '困っている人を後からフォローする',
        traits: ['empathy_support', 'people_focus'],
        next: { kind: 'node', target: 'q15' },
      },
      {
        id: 'q9-vision',
        label: '完成形のイメージを共有して方向を合わせる',
        traits: ['aesthetic', 'experimentation'],
        next: { kind: 'node', target: 'q11' },
      },
    ],
  },
  {
    id: 'q10',
    title: '成果物のゴール',
    prompt: '短い期間で成果を出すとき、どこに重点を置きますか？',
    options: [
      {
        id: 'q10-experiment',
        label: 'まず試作して反応を確かめる',
        traits: ['experimentation', 'momentum'],
        next: { kind: 'result', result: 'crimson' },
      },
      {
        id: 'q10-delivery',
        label: '約束した範囲を確実に仕上げる',
        traits: ['delivery_focus', 'structure_first'],
        next: { kind: 'result', result: 'tangerine' },
      },
      {
        id: 'q10-surprise',
        label: '印象に残る演出で体験を高める',
        traits: ['aesthetic', 'reflection'],
        next: { kind: 'node', target: 'q11' },
      },
    ],
  },
  {
    id: 'q11',
    title: '体験の磨き方',
    prompt: 'UIやUXを改善するとき、何を大切にしますか？',
    options: [
      {
        id: 'q11-motion',
        label: '動きや細部のアニメーションにこだわる',
        traits: ['aesthetic', 'reflection'],
        next: { kind: 'result', result: 'lavender' },
      },
      {
        id: 'q11-story',
        label: 'ストーリーを描いて関係者の理解をそろえる',
        traits: ['bridge_builder', 'aesthetic'],
        next: { kind: 'node', target: 'q15' },
      },
      {
        id: 'q11-accessibility',
        label: '誰にとっても使いやすい設計を意識する',
        traits: ['quality_guard', 'empathy_support'],
        next: { kind: 'node', target: 'q12' },
      },
    ],
  },
  {
    id: 'q12',
    title: '領域をつなぐ視点',
    prompt: '複数チームの調整を任されたら、最初に何をしますか？',
    options: [
      {
        id: 'q12-translate',
        label: '専門用語をかみ砕いて共有する',
        traits: ['bridge_builder', 'structure_first'],
        next: { kind: 'result', result: 'turquoise' },
      },
      {
        id: 'q12-align',
        label: '共通のゴールを再確認して方向をそろえる',
        traits: ['reflection', 'bridge_builder'],
        next: { kind: 'node', target: 'q13' },
      },
      {
        id: 'q12-care',
        label: 'それぞれの課題を聞いてサポート体制を整える',
        traits: ['empathy_support', 'people_focus'],
        next: { kind: 'node', target: 'q15' },
      },
    ],
  },
  {
    id: 'q13',
    title: '意思決定のこだわり',
    prompt: '意見が分かれたとき、どんな基準で決めますか？',
    options: [
      {
        id: 'q13-architecture',
        label: '長く使える設計を優先して筋を通す',
        traits: ['structure_first', 'reflection'],
        next: { kind: 'result', result: 'indigo' },
      },
      {
        id: 'q13-standards',
        label: 'ルールを徹底して品質を守る',
        traits: ['quality_guard', 'delivery_focus'],
        next: { kind: 'node', target: 'q14' },
      },
      {
        id: 'q13-invite',
        label: '話し合いを重ねて納得感を高める',
        traits: ['bridge_builder', 'empathy_support'],
        next: { kind: 'node', target: 'q15' },
      },
    ],
  },
  {
    id: 'q14',
    title: '守り抜くライン',
    prompt: '問題を見つけたとき、どう対処しますか？',
    options: [
      {
        id: 'q14-zero',
        label: '原因を突き止めて再発を防ぐ',
        traits: ['quality_guard', 'documentation'],
        next: { kind: 'result', result: 'obsidian' },
      },
      {
        id: 'q14-teach',
        label: 'ルールと背景を共有してチームで守る',
        traits: ['bridge_builder', 'empathy_support'],
        next: { kind: 'node', target: 'q15' },
      },
      {
        id: 'q14-balance',
        label: 'リスクを説明して柔軟な解決策を探る',
        traits: ['reflection', 'structure_first'],
        next: { kind: 'result', result: 'indigo' },
      },
    ],
  },
  {
    id: 'q15',
    title: '寄り添い方',
    prompt: 'チームメンバーが迷っていたら、どうサポートしますか？',
    options: [
      {
        id: 'q15-support',
        label: '一緒に考えて寄り添いながら進める',
        traits: ['empathy_support', 'people_focus'],
        next: { kind: 'result', result: 'emerald' },
      },
      {
        id: 'q15-uplift',
        label: '前向きな声かけで背中を押す',
        traits: ['uplift', 'momentum'],
        next: { kind: 'result', result: 'sunlight' },
      },
      {
        id: 'q15-bridge',
        label: '関係者と調整して前に進める',
        traits: ['bridge_builder', 'structure_first'],
        next: { kind: 'result', result: 'turquoise' },
      },
    ],
  },
]

const flowChart: FlowChartDefinition = {
  root: 'q1',
  order: flowNodes.map(node => node.id),
  nodes: flowNodes.reduce<Record<FlowNode['id'], FlowNode>>(
    (acc, node) => {
      acc[node.id] = node
      return acc
    },
    {} as Record<FlowNode['id'], FlowNode>
  ),
  traits: traitCatalog.reduce<Record<TraitInsight['id'], TraitInsight>>(
    (acc, trait) => {
      acc[trait.id] = trait
      return acc
    },
    {} as Record<TraitInsight['id'], TraitInsight>
  ),
  totalQuestions: 15,
}

export default flowChart
