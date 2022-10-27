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
  user: HTMLSelectElement;
  available: HTMLSelectElement;
}

const MuteDialog = (props: Props) => {
  const {context, addTaboo, requestClose} = props;
  const {id_str: identifier, screen_name: name} = context.tweet.user;
  const {keyword} = context;

  const handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const expireAt = DateUtility.addMinutes(Date.now(), Number.parseInt(event.currentTarget.available.value));
    const identifier = event.currentTarget.passenger.value;

    if (identifier == EVERYONE) {
      addTaboo({identifier: EVERYONE, name: "全員", keyword, expireAt: expireAt.getTime()});
    } else {
      addTaboo({identifier, name, keyword, expireAt: expireAt.getTime()});
    }

    requestClose();
  };

  return (
    <>
      <p className="title">[{keyword}]のミュート設定</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>対象ユーザ</label>
          <select name="user" className="form-control">
            <option value={identifier}>{name}のみ</option>
            <option value={EVERYONE}>全員</option>
          </select>
        </div>
        <div className="form-group">
          <label>期限</label>
          <select name="available" className="form-control">
            <option value={30}>30分</option>
            <option value={60}>1時間</option>
            <option value={60 * 24 * 7}>7日</option>
            <option value={60 * 24 * 30}>30日</option>
            <option value={60 * 24 * 90}>90日</option>
            <option value={60 * 24 * 365 * 10}>無期限</option>
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

export default MuteDialog;
