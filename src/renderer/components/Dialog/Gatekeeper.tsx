import {useDispatch} from "react-redux";
import * as DateUtility from "date-fns";
import {EVERYONE} from "@shared/defaults";
import * as actions from "@actions";

interface OwnProps {
  context: TMB.TweetMenu;
  requestClose(): void;
}

interface Form extends HTMLFormElement {
  passenger: HTMLSelectElement;
  available: HTMLSelectElement;
}

const Gatekeeper = (props: OwnProps) => {
  const {context, requestClose} = props;
  const {keyword} = context;
  const dispatch = useDispatch<actions.Dispatch>();

  const passengers = [];
  passengers.push(makePassengerTag(context.tweet.user.id_str, context.tweet.user.screen_name));
  if (context.tweet.retweeted_status) {
    passengers.push(makePassengerTag(context.tweet.retweeted_status.user.id_str, context.tweet.retweeted_status.user.screen_name));
  }
  passengers.push(makePassengerTag(EVERYONE, "全員"));

  const handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const available = Number.parseInt(event.currentTarget.available.value);
    const expireAt = available ? DateUtility.addMinutes(Date.now(), Number.parseInt(event.currentTarget.available.value)).getTime() : 0;
    const [identifier, name] = event.currentTarget.passenger.value.split(":");

    dispatch(actions.addTaboo({identifier, name, keyword, expireAt}));

    requestClose();
  };

  return (
    <>
      <h1 className="title invert">[{keyword}]のミュート設定</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>対象ユーザ</label>
          <select name="passenger" className="form-control">
            {passengers}
          </select>
        </div>
        <div className="form-group">
          <label>期限</label>
          <select name="available" className="form-control">
            {[
              [0, "無期限"],
              [1, "1分"],
              [30, "30分"],
              [60, "1時間"],
              [60 * 24 * 7, "7日"],
              [60 * 24 * 30, "30日"],
              [60 * 24 * 90, "90日"],
            ].map(([value, title]) => {
              return (
                <option key={value} value={value}>
                  {title}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-form btn-primary">
            追加する
          </button>
        </div>
      </form>
    </>
  );
};
export default Gatekeeper;

function makePassengerTag(identifier: TMB.PassengerIdentifier, name: string) {
  return (
    <option key={identifier} value={`${identifier}:${name}`}>
      {name}
    </option>
  );
}
