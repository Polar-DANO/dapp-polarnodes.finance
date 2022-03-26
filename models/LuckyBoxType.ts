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

  return lb.nodeTypes.map((nodeType, id) => {
    const probability = individualProbabilities[id]
    return {
      nodeType,
      probability
    }
  })
}
