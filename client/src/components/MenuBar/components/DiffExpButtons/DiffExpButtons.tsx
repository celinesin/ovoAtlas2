import React from "react";
import { connect } from "react-redux";
import { ButtonGroup, AnchorButton, Tooltip } from "@blueprintjs/core";

import * as globals from "~/globals";
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './menubar.css' or its correspo... Remove this comment to see the full error message
import styles from "../../menubar.css";
import CellSetButton from "./components/CellSetButton/CellSetButton";
import {
  DiffexpButtonsProps,
  mapDispatchToProps,
  mapStateToProps,
} from "./types";
import { useConnect } from "./connect";

function DiffexpButtons(props: DiffexpButtonsProps): JSX.Element {
  const { dispatch, differential, diffexpMayBeSlow, diffexpCellcountMax } =
    props;

  const {
    computeDiffExp,
    downloadDiffExpAllGenes,
    warnMaxSizeExceeded,
    tipMessageWarn,
    tipMessageDownload,
    haveBothCellSets,
    tipMessage,
  } = useConnect({
    dispatch,
    differential,
    diffexpMayBeSlow,
    diffexpCellcountMax,
  });

  return (
    <ButtonGroup className={styles.menubarButton}>
      <CellSetButton eitherCellSetOneOrTwo={1} />
      <CellSetButton eitherCellSetOneOrTwo={2} />
      <Tooltip
        content={warnMaxSizeExceeded ? tipMessageWarn : tipMessage}
        position="bottom"
        hoverOpenDelay={globals.tooltipHoverOpenDelayQuick}
        intent={warnMaxSizeExceeded ? "danger" : "none"}
      >
        <AnchorButton
          disabled={!haveBothCellSets || warnMaxSizeExceeded}
          intent={warnMaxSizeExceeded ? "danger" : "primary"}
          data-testid="diffexp-button"
          loading={differential.loading ?? false}
          icon="left-join"
          fill
          onClick={computeDiffExp}
        />
      </Tooltip>
      <Tooltip // new Tolltip with description
        content={warnMaxSizeExceeded ? tipMessageWarn : tipMessageDownload}
        position="bottom"
        hoverOpenDelay={globals.tooltipHoverOpenDelayQuick}
        intent={warnMaxSizeExceeded ? "danger" : "none"}
      >
        <AnchorButton // added button
            disabled={!differential.haveDEA}  // disabled until computeDiffExp has been clicked 
            intent={warnMaxSizeExceeded ? "danger" : "primary"}
            data-testid="diffexp-button-all-genes" // necessary for tests?
            icon="download" // Updated icon for download
            onClick={downloadDiffExpAllGenes} // initiating the download -> connect.ts
          />
      </Tooltip>
    </ButtonGroup>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DiffexpButtons);
