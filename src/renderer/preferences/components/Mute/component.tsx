import * as React from "react";
import {useState, useEffect} from "react";
import {test} from "@libraries/silencer";

const {facade} = window;

interface Form extends HTMLFormElement {
  keyword: HTMLInputElement;
}

const Mute = () => {
  const [keywords, setKeywords] = useState(() => facade.storage.getMuteKeywords());
  const [tweets, setTweets] = useState<Twitter.Tweet[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const keyword = event.currentTarget.keyword.value.toLowerCase();
    let newKeywords = keywords.concat();
    newKeywords.push(keyword);
    newKeywords.sort();
    newKeywords = [...new Set(newKeywords)];

    facade.storage.setMuteKeywords(newKeywords);

    event.currentTarget.keyword.value = "";
    setKeywords(newKeywords);
    setMatched([]);
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode == 8) {
      const newKeywords = keywords.concat();

      const keyword = event.currentTarget.textContent!;
      const index = newKeywords.indexOf(keyword);
      newKeywords.splice(index, 1);

      facade.storage.setMuteKeywords(newKeywords);

      setKeywords(newKeywords);
    }
  };
  const handleChangeEntry = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.currentTarget.value;

    if (keyword.length > 0) {
      const matched: string[] = tweets.map((tweet) => test(tweet, [keyword])).filter((result) => result) as string[];

      setMatched(matched);
    } else {
      setMatched([]);
    }
  };

  useEffect(() => {
    const promises = facade.storage
      .getTimelinePreferences()
      .filter((preference) => preference.mute)
      .map((preference: TheMoodyBlues.Store.TimelinePreference) => {
        return facade.storage.getTweets(preference.identity);
      });

    Promise.all(promises).then((allTweets: Twitter.Tweet[][]) => {
      setTweets(allTweets.flat());
    });
  }, []);

  const list = keywords.map((keyword, index: number) => {
    return (
      <li key={index} onKeyDown={handleKeyDown} tabIndex={-1}>
        {keyword}
      </li>
    );
  });

  const matchedList = matched.slice(0, 10).map((text, index) => {
    return (
      <li className="list-group-item" key={index}>
        {text}
      </li>
    );
  });

  return (
    <div className="PreferencesMute">
      <form onSubmit={handleSubmit}>
        <ul className="entry list-group">
          <li className="list-group-header">
            <input name="keyword" type="text" className="form-control" onChange={handleChangeEntry} />
            <label>{matched.length} tweets matched</label>
          </li>
          {matchedList}
        </ul>
      </form>
      <ul className="keywords">{list}</ul>
    </div>
  );
};
export default Mute;
