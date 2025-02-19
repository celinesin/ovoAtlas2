import actions from "actions";
import { DiffexpButtonsProps } from "./types";
import {
  DIFFEXP_SLOW_MSG,
  genTipMessageWarn,
  genTipDownloadMessage,
  genTipMessage,
} from "./constants";

export function useConnect({
  dispatch,
  differential,
  diffexpMayBeSlow,
  diffexpCellcountMax,
}: DiffexpButtonsProps) {
  function computeDiffExp() {
    if (differential.celllist1 && differential.celllist2) {
      dispatch(
        actions.requestDifferentialExpression(
          differential.celllist1,
          differential.celllist2
        )
      ).catch((error) => {
        console.error("Failed to request differential expression:", error);
      });
    }
  }
  /**
 * Downloads all differentially expressed genes.
 * It checks is teh two sets are available. --possible change. Later it also checks if DEA was already triggered.
 *  This function triggers the download process by dispatching the requestDownloadAllGenes
 * action. If the download fails, it logs an error to the console.
 */
  function downloadDiffExpAllGenes() {
    if (differential.celllist1 && differential.celllist2) {
      dispatch(actions.requestDownloadAllGenes()) // -> client/src/actions/index.ts
        .catch((error: any) => {
          console.error("Failed to download all differential expressed genes:", error);
        });
    }
  }

  const haveBothCellSets = !!differential.celllist1 && !!differential.celllist2;
  const haveEitherCellSet =
    !!differential.celllist1 || !!differential.celllist2;
  const slowMsg = diffexpMayBeSlow ? DIFFEXP_SLOW_MSG : "";
  const tipMessage = genTipMessage(slowMsg);
  const tipMessageDownload = genTipDownloadMessage(slowMsg);
  const tipMessageWarn = genTipMessageWarn(diffexpCellcountMax);
  const warnMaxSizeExceeded =
    haveEitherCellSet &&
    !!diffexpCellcountMax &&
    (differential.celllist1?.length ?? 0) +
      (differential.celllist2?.length ?? 0) >
      diffexpCellcountMax;

  return {
    computeDiffExp,
    downloadDiffExpAllGenes,
    haveBothCellSets,
    warnMaxSizeExceeded,
    tipMessage,
    tipMessageDownload,
    tipMessageWarn,
  };
}
