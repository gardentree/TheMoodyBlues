import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Article from "./Article";
import BranchBundle from "./BranchBundle";
import adapters from "@libraries/adapter";
import * as actions from "@actions";
import {css} from "@emotion/react";
import {useForm} from "react-hook-form";

interface OwnProps {
  identifier: TMB.ScreenID;
}
interface StateProps {
  branches: TMB.ScreenID[];
  query: string;
}
interface FormProperty {
  query: string;
}

const Search = (props: OwnProps) => {
  const {identifier} = props;
  const {register, handleSubmit, setValue} = useForm<FormProperty>();

  const {branches, query} = useSelector<TMB.State, StateProps>((state) => {
    const {screens, lineage} = state;
    const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;
    const branches = adapters.lineage.getSelectors().selectById(lineage, identifier)?.branches || [];

    return {
      branches,
      query: screen.options?.query || "",
    };
  });
  setValue("query", query);

  const dispatch = useDispatch();
  function search(values: {query: string}) {
    dispatch(actions.searchTweets(values.query));
  }
  function didMount() {
    dispatch(actions.mountScreen(identifier));
  }

  useEffect(() => {
    didMount();
  }, []);

  return (
    <div css={styles}>
      <div style={{height: "100%"}}>
        <Article identifier={identifier}>
          <form className="search" onSubmit={handleSubmit(search)}>
            <div className="field">
              <input defaultValue="" {...register("query")} />
              <span
                className="icon icon-cancel-circled"
                style={{display: query ? "inline-block" : "none"}}
                onClick={() => {
                  search({query: ""});
                }}
              />
            </div>
          </form>
        </Article>

        <BranchBundle root={identifier} branches={branches} />
      </div>
    </div>
  );
};
export default Search;

const styles = css`
  height: 100%;

  form {
    height: 100%;

    & > div {
      position: relative;
    }

    .field {
      height: 100%;
      input {
        height: 100%;
        width: 100%;
        border: solid 1px #ddd;
        border-radius: 4px;
      }
      .form-control {
        padding-top: 0;
        padding-bottom: 0;
      }

      .icon {
        position: absolute;
        right: 8px;
        font-size: 14px;
        color: #888;

        &:active {
          color: #444;
        }
      }
    }
  }
`;
