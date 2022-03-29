import { BigNumber } from 'ethers'

export interface LuckyBoxType {
  id: number;
  name: string;
  maxUser: BigNumber;
  maxBox: BigNumber;
  nodeTypes: string[];
  probabilities: BigNumber[];
  remaining: BigNumber[];
  price: BigNumber;
  features: string[];
}

export function computeProbabilities (lb: LuckyBoxType) {
  if (lb.nodeTypes.length !== lb.probabilities.length) {
    throw new Error('nodeTypes and probabilities must have the same length')
  }

  const individualProbabilities = lb.probabilities.map((cumSum, idx) => {
    if (idx === 0) {
      return cumSum
    }
    return cumSum.sub(lb.probabilities[idx - 1])
  }).map(probability => probability.toNumber() / 100)

  const prob = lb.nodeTypes.map((nodeType, id) => {
    const probability = individualProbabilities[id]
    return {
      nodeType,
      probability
    }
  })

  const groupSum = prob.reduce(
    (groups, { probability, nodeType }) => {
      if (!groups[nodeType]) {
        groups[nodeType] = 0
      }

      groups[nodeType] += probability
      return groups
    },
    {} as { [key: string]: number }
  )

  return Object.entries(groupSum).map(([nodeType, probability]) => ({ nodeType, probability }))
}

export function getPossibleTypes (lb: LuckyBoxType) {
  if (lb.nodeTypes.length !== lb.features.length) {
    throw new Error('nodeTypes and length must have the same length')
  }

  return lb.nodeTypes.map((nodeType, id) =>
    `${nodeType} ${lb.features[id]}`.trim()
  )
}
