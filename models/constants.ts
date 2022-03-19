import { NodeNftNames } from "./types";

export const NAME_TO_URL = {
  [NodeNftNames.Fuji]: "fuji",
  [NodeNftNames.MontBlanc]: "mont-blanc",
  [NodeNftNames.Kilimanjaro]: "kilimanjaro",
  [NodeNftNames.Ushuaia]: "ushuaia",
  [NodeNftNames.Everest]: "everest",
};

export const URL_TO_NAME = {
  fuji: NodeNftNames.Fuji,
  "mont-blanc": NodeNftNames.MontBlanc,
  kilimanjaro: NodeNftNames.Kilimanjaro,
  ushuaia: NodeNftNames.Ushuaia,
  everest: NodeNftNames.Everest,
};

export type Url = "fuji" | "mont-blanc" | "kilimanjaro" | "ushuaia" | "everest";

export const NODENAME_TO_IMAGE = {
  [NodeNftNames.Fuji]:
    "https://ipfs.io/ipfs/QmPL9nCnvhH7bxPmnBPVbqoTUbYJJBp6wKuFgZUCQ6YE85?filename=FUJI%20FIXE.jpg",
  [NodeNftNames.MontBlanc]:
    "https://ipfs.io/ipfs/QmY4qYu8jJQKzdNghzNsSdovVacyv9qEAeekHLPfwMCPRW?filename=MONT%20BLANC%20FIXE.jpg",
  [NodeNftNames.Kilimanjaro]:
    "https://ipfs.io/ipfs/QmPC1raEZ4acMve2XDcRbY7yVLjwrrMYTS8xJTHhavJx32?filename=KILIMANDJARO%20FIXE.jpg",
  [NodeNftNames.Ushuaia]:
    "https://ipfs.io/ipfs/QmdwE4ZbMzKUR1CHP2cbCPitnccChqiaEEGsyuMx4kn1np?filename=USHUAIA%20RENDER0133.jpg",
  [NodeNftNames.Everest]:
    "https://ipfs.io/ipfs/QmNkSYLUNGdiGfZjoC68C5qth9PKkZFkge9m5xtBhiH27L?filename=EVEREST%20FIXE.jpg",
};

export const NODENAME_TO_VIDEO = {
  [NodeNftNames.Fuji]:
    "https://ipfs.io/ipfs/QmbqaNCGuqnMzzLq5pB8x75nWNeY55W7TBqfjwyt14w51M?filename=FUJI%20ANIM.mp4",
  [NodeNftNames.MontBlanc]:
    "https://ipfs.io/ipfs/QmSm4mzJQmy97oqnN1jbxYXMQ2GE1TGz2dQsYucMivLyLV?filename=MONT%20BLANC%20ANIM.mp4",
  [NodeNftNames.Kilimanjaro]:
    "https://ipfs.io/ipfs/QmZJqJUAUcQ4PhxSCS1QFrG1PrKZRYwZLv6yhdorXi6HYU?filename=KILIMANDJARO%20ANIM.mp4",
  [NodeNftNames.Ushuaia]:
    "https://ipfs.io/ipfs/QmdotjoP4x6CLFsSvKY96uTCGTwWmEURvxSuPMfdy4LxX4?filename=USHUAIA%20ANIM.mp4",
  [NodeNftNames.Everest]:
    "https://ipfs.io/ipfs/Qmf9Gwn9oVaCfj4H5cRzxhwGiAMxHbEX5wVFAGdE7yBXoi?filename=EVEREST%20ANIM.mp4",
};

export const luckyBoxes = [
  { index: 1, name: "Lucky Box #1", cost: 30 },
  { index: 2, name: "Lucky Box #2", cost: 55 },
  { index: 3, name: "Lucky Box #3", cost: 250 },
  { index: 4, name: "Lucky Box #4", cost: 400 },
];

export const LUCKY_BOX_BY_INDEX = {
  [1]: { index: 1, name: "Lucky Box #1", cost: 30 },
  [2]: { index: 2, name: "Lucky Box #2", cost: 55 },
  [3]: { index: 3, name: "Lucky Box #3", cost: 250 },
  [4]: { index: 4, name: "Lucky Box #4", cost: 400 },
};

export type LuckyBoxId = "1" | "2" | "3" | "4";
