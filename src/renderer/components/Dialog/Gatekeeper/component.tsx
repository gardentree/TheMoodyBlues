import React from "react";
import * as DateUtility from "date-fns";
import {EVERYONE} from "@shared/defaults";
import {DispatchProps} from "./container";

export interface OwnProps {
  context: TMB.TweetMenu;
  requestClose(): void;
}
type Props = OwnProps & DispatchProps;

interface Form extends HTMLFormElement {
  passenger: HTMLSelectElement;
  available: HTMLSelectElement;
}

const Gatekeeper = (props: Props) => {
  const {context, addTaboo, requestClose} = props;
  const {id_str: identifier, screen_name: name} = context.tweet.user;
  const {keyword} = context;

  const handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const available = Number.parseInt(event.currentTarget.available.value);
    const expireAt = available ? DateUtility.addMinutes(Date.now(), Number.parseInt(event.currentTarget.available.value)).getTime() : 0;
    const identifier = event.currentTarget.passenger.value;

    if (identifier == EVERYONE) {
      addTaboo({identifier: EVERYONE, name: "全員", keyword, expireAt});
    } else {
      addTaboo({identifier, name, keyword, expireAt});
    }

    requestClose();
  };

  return (
    <>
      <p className="title">[{keyword}]のミュート設定</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>対象ユーザ</label>
          <select name="passenger" className="form-control">
            <option value={identifier}>{name}のみ</option>
            <option value={EVERYONE}>全員</option>
          </select>
        </div>
        <div className="form-group">
          <label>期限</label>
          <select name="available" className="form-control">
            <option value={1}>1分</option>
            <option value={30}>30分</option>
            <option value={60}>1時間</option>
            <option value={60 * 24 * 7}>7日</option>
            <option value={60 * 24 * 30}>30日</option>
            <option value={60 * 24 * 90}>90日</option>
            <option value={0}>無期限</option>
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
