import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Article from "./Article";
import BranchBundle from "./BranchBundle";
import {reduxForm, Field, InjectedFormProps} from "redux-form";
import {formValueSelector} from "redux-form";
import adapters from "@libraries/adapter";
import * as actions from "@actions";
import {css} from "@emotion/react";

interface OwnProps {
  identifier: TMB.ScreenID;
}
interface StateProps {
  initialValues: {query: string};
  hasQuery: boolean;
  branches: TMB.ScreenID[];
}
interface FormProperty {
  query: string;
}

const Search = (props: OwnProps & InjectedFormProps<FormProperty, OwnProps>) => {
  const {identifier, handleSubmit, reset} = props;

  const {hasQuery, branches} = useSelector<TMB.State, StateProps>((state) => {
    const {screens, lineage} = state;
    const screen = adapters.screens.getSelectors().selectById(screens, identifier)!;
    const branches = adapters.lineage.getSelectors().selectById(lineage, identifier)?.branches || [];

    const selector = formValueSelector("Search");
    const query = selector(state, "query");

    return {
      initialValues: {query: screen.options?.query || ""},
      hasQuery: query && query.length > 0,
      branches,
    };
  });

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
              <Field name="query" component="input" type="search" className="form-control" />
              <span
                className="icon icon-cancel-circled"
                style={{display: hasQuery ? "inline-block" : "none"}}
                onClick={() => {
                  reset();
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
export default reduxForm<FormProperty, OwnProps>({
  form: "Search",
  enableReinitialize: true,
})(Search);

const styles = css`
  height: 100%;

  form {
    & > div {
      position: relative;
    }

    .field {
      input {
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
