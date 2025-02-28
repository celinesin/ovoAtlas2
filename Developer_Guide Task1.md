# Developer Guide: Changes Introduced with Task 1

## Overview

In this update, a new feature was added to the application to allow users to download all differentially expressed genes in a TSV file. A download button was introduced and placed next to the DEA button.

## Detailed Changes

### 1. Added Download Button for DE Genes
- **File Modified**: `client/src/components/MenuBar/DiffExpButtons/DiffExpButtons.tsx`
- **Description**: 
  - A download button is now available next to the DEA button.
  - This button enables the download of all differentially expressed genes in a TSV file format after the DEA was triggered.

### 2. Implementation Details
- **Button Placement**:
  - The button was strategically placed next to the DEA button for user convenience.
  - A tooltip was added to show the function of the button
```typescript
  <Tooltip // new Tooltip with description
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
```
- **Download Functionality**:
  - The button triggers a function: downloadDiffExpAllGenes in `client/src/components/MenuBar/DiffExpButtons/connect.ts`that is calling the actions.requestDownloadAllGenes() in `client/src/actions/index.ts`

```typescript
  function downloadDiffExpAllGenes() {
    if (differential.celllist1 && differential.celllist2) {
      dispatch(actions.requestDownloadAllGenes()) // -> client/src/actions/index.ts
        .catch((error: any) => {
          console.error("Failed to download all differential expressed genes:", error);
        });
    }
  }
```

- actions.requestDownloadAllGenes() is then using the allGenes that was saved during the DEA and converts it to a tsv downloadable file.

```typescript
 /**
 * Downloads all genes data in TSV format. The function checks if the data is available,
 * formats it into a TSV string, creates a downloadable file, and triggers the download.
 * If no data is available, it logs a warning and exits early.
 */
  const requestDownloadAllGenes = () => 
    async (_dispatch: AppDispatch, getState: GetState) => {
      try {
        // track event for analytics purposes
        track(EVENTS.EXPLORER_DOWNLOAD_ALL_GENES_BUTTON_CLICKED, {});
        // retrieve the differential expression data from the Redux store
        const { differential } = getState();

        // check if downloadAll is empty
        if (!differential.downloadAll?.all_genes?.length) {
          console.warn("No allGenes data available for download.");
          return;
        }
  
        // header for the TSV file
        const header = "Gene\tLogFoldChange\tp-value\tadj p-value";

        // convert the array to TSV format
        const tsvRows = differential.downloadAll.all_genes.map((row: any[]) => row.join("\t"));
        const tsvStr = [header, ...tsvRows].join("\n");

        // create and download the TSV file
        const blob = new Blob([tsvStr], { type: "text/tab-separated-values" });
        const link = URL.createObjectURL(blob);

        const a = document.createElement("a");
        const dateString = new Date().toLocaleString();

        a.href = link;
        a.download = `differential_expression_all_genes_${dateString}.tsv`; // add a timestamp to file name 
        document.body.appendChild(a);
        a.click(); // trigger download
        document.body.removeChild(a); // clean up DOM
        
        URL.revokeObjectURL(link); // revoke object URL to free up memory
      } catch (error) {
        console.error("Failed to download all genes:", error);
      }
    };
```

- all_genes was added in the backend of the DEA. The changes were made in `server/compute/diffexp_cxg.py` and then returned to actions.requestDifferentialExpression where it was added to the differential state and can be called with differential.downloadAll.all_genes

```python
result = {
        "positive": [
            [sort_order[i], logfoldchanges_top_n[i], pvals_top_n[i], pvals_adj_top_n[i]] for i in range(top_n)
        ],
        "negative": [
            [sort_order[i], logfoldchanges_top_n[i], pvals_top_n[i], pvals_adj_top_n[i]]
            for i in range(-1, -1 - top_n, -1)
        ],
         "all_genes": [
            [sorted_all_genes_idx[i], logfoldchanges[sorted_all_genes_idx[i]], 
            pvals[sorted_all_genes_idx[i]], pvals_adj[sorted_all_genes_idx[i]]]
            for i in range(len(sorted_all_genes_idx))
        ],
    }
```
