interface StringElement {
  type: "string";
  entity: string;
}
interface HashtagElement {
  type: "hashtags";
  entity: Twitter.Hashtag;
}
interface MentionElement {
  type: "user_mentions";
  entity: Twitter.Mention;
}
interface URLElement {
  type: "urls";
  entity: Twitter.URL;
}
interface MediaElement {
  type: "media";
  entity: Twitter.Media;
}

type TweetElement = StringElement | HashtagElement | MentionElement | URLElement | MediaElement;

export function parseElements(tweet: Twitter.Tweet, expand: boolean): TweetElement[] {
  let entities: {type: "hashtags" | "user_mentions" | "urls" | "media"; entity: Twitter.EntityElement}[] = [];
  for (const type of ["hashtags", "user_mentions", "urls", "media"]) {
    if (!tweet.entities[type]) continue;

    entities = entities.concat(tweet.entities[type].map((entity: Twitter.EntityElement) => ({type: type, entity: entity})));
  }
  if (entities.length > 0) {
    entities.sort((a, b) => a.entity.indices[0] - b.entity.indices[0]);
  }

  const characters = Array.from(tweet.full_text);
  const elements: TweetElement[] = [];
  let start = 0;
  for (const entity of entities) {
    if (start < entity.entity.indices[0]) {
      const element = characters.slice(start, entity.entity.indices[0]).join("");
      elements.push({type: "string", entity: element});
    }
    if (tweet.display_text_range[1] >= entity.entity.indices[0]) {
      elements.push(entity as TweetElement);
    }

    start = entity.entity.indices[1];
  }
  if (start < characters.length) {
    const element = characters.slice(start, characters.length).join("");
    elements.push({type: "string", entity: element});
  }

  if (expand && tweet.quoted_status_permalink) {
    const last = elements.slice(-1)[0];
    if (last.type === "urls" && last.entity.url === tweet.quoted_status_permalink.url) {
      elements.pop();
    }
  }

  return elements;
}
