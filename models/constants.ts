import { NodeNftNames } from "./types";

export const PAYOUTS_PER_DAY = 6;

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
  [NodeNftNames.Fuji]: require("../assets/PACK/Fuji/FUJI FIXE.jpg"),
  [NodeNftNames.MontBlanc]: require("../assets/PACK/Mont Blanc/MONT BLANC FIXE.jpg"),
  [NodeNftNames.Kilimanjaro]: require("../assets/PACK/Kilimandjaro/KILIMANDJARO FIXE.jpg"),
  [NodeNftNames.Ushuaia]: require("../assets/PACK/Ushuaia/USHUAIA RENDER0133.jpg"),
  [NodeNftNames.Everest]: require("../assets/PACK/Everest/EVEREST FIXE.jpg"),
};

export const NODENAME_TO_VIDEO = {
  [NodeNftNames.Fuji]: require("../assets/PACK/Fuji/FUJI ANIM.mp4"),
  [NodeNftNames.MontBlanc]: require("../assets/PACK/Mont Blanc/MONT BLANC ANIM.mp4"),
  [NodeNftNames.Kilimanjaro]: require("../assets/PACK/Kilimandjaro/KILIMANDJARO ANIM.mp4"),
  [NodeNftNames.Ushuaia]: require("../assets/PACK/Ushuaia/USHUAIA ANIM.mp4"),
  [NodeNftNames.Everest]: require("../assets/PACK/Everest/EVEREST ANIM.mp4"),
};

export const LUCKYBOX_IMAGE = require("../assets/PACK/Lucky Boxes/LUCKY BOX LVL 1.jpg");
export const LUCKYBOX_VIDEO = require("../assets/PACK/Lucky Boxes/LUCKY BOX LVL 1 ANIM.mp4");
