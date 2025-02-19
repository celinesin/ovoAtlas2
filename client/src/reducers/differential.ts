import { AnyAction } from "redux";
import { LabelArray } from "../util/dataframe";

export interface DifferentialState {
  loading: boolean | null;
  error: Error | string | null;
  celllist1: LabelArray | null;
  celllist2: LabelArray | null;
  haveDEA: boolean | false; // boolean to save whether DEA has been done already
  downloadAll: { allGenes: any[] } | null; // save all DE genes 
}

const Differential = (
  state: DifferentialState = {
    loading: null,
    error: null,
    celllist1: null,
    celllist2: null,
    haveDEA: false,  // saves if DEA was triggered
    downloadAll: null // list where all_genes are saved
  },
  action: AnyAction
) => {
  switch (action.type) {
    case "request differential expression started":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "request differential expression success":
      return {
        ...state,
        error: null,
        haveDEA: true, // set to true, so that the download is possible 
        loading: false,
      };
    case "request differential expression error":
      return {
        ...state,
        loading: false,
        error: action.data,
      };
    case "store current cell selection as differential set 1":
      return {
        ...state,
        celllist1: action.data,
      };
     // Update state to store the allGenes data separately.
    case "store allGenes separately":
      return {
        ...state,
        downloadAll: action.data, 
      };
    case "store current cell selection as differential set 2":
      return {
        ...state,
        celllist2: action.data,
      };
    case "reset subset":
    case "subset to selection":
      return {
        ...state,
        celllist1: null,
        celllist2: null,
      };
    default:
      return state;
  }
};

export default Differential;
