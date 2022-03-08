import * as React from "react";
import {useState, useEffect} from "react";
import {test} from "@libraries/silencer";

const {facade} = window;

interface Form extends HTMLFormElement {
  keyword: HTMLInputElement;
}

const Mute = () => {
  const [preference, setPreference] = useState<TMB.MutePreference>({
    keywords: [],
    selfRetweet: false,
    withMedia: [],
    retweetReaction: [],
  });
  const [tweets, setTweets] = useState<Twitter.Tweet[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setPreference(await facade.storage.getMutePreference());
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const preferences = await facade.storage.getScreenPreferences();
      const promises = preferences
        .filter((preference) => preference.mute)
        .map((preference: TMB.ScreenPreference) => {
          return facade.storage.getTweets(preference.identity);
        });

      Promise.all(promises).then((allTweets: Twitter.Tweet[][]) => {
        setTweets(allTweets.flat());
      });
    })();
  }, []);

  const handleSubmit = (event: React.SyntheticEvent<Form>) => {
    event.preventDefault();

    const keyword = event.currentTarget.keyword.value.toLowerCase();
    let keywords = preference.keywords.concat();
    keywords.push(keyword);
    keywords.sort();
    keywords = [...new Set(keywords)];

    const newPreference = Object.assign({}, preference, {keywords});
    facade.storage.setMutePreference(newPreference);

    event.currentTarget.keyword.value = "";
    setPreference(newPreference);
    setMatched([]);
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode == 8) {
      const keywords = preference.keywords.concat();

      const keyword = event.currentTarget.textContent!;
      const index = keywords.indexOf(keyword);
      keywords.splice(index, 1);

      const newPreference = Object.assign({}, preference, {keywords});
      facade.storage.setMutePreference(newPreference);

      setPreference(newPreference);
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

  const list = preference.keywords.map((keyword, index: number) => {
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
