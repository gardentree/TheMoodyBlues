import {shell} from "electron";
import {OAuth} from "oauth";
import {buildDefaultStorage} from "./storage";
import {incarnate} from "./twitter_agent";
import TwitterClient from "twitter";
import TwitterClient2 from "twitter-v2";

const oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", process.env.CONSUMER_KEY!, process.env.CONSUMER_SECRET!, "1.0A", null, "HMAC-SHA1");
const storage = buildDefaultStorage();

function loadClient(): any | null {
  const accessKey = storage.getAccessKey();
  const accessSecret = storage.getAccessSecret();

  if (accessKey === void 0 || accessSecret === void 0) {
    return null;
  }

  return createClient({key: accessKey, secret: accessSecret});
}

interface Token {
  key: string;
  secret: string;
}

function createClient(accessToken: Token): TheMoodyBlues.TwitterAgent {
  const credentials = {
    consumer_key: process.env.CONSUMER_KEY!,
    consumer_secret: process.env.CONSUMER_SECRET!,
    access_token_key: accessToken.key,
    access_token_secret: accessToken.secret,
  };

  return incarnate(new TwitterClient(credentials), new TwitterClient2(credentials));
}

function getRequestToken() {
  return new Promise<Token>((resolve, reject) => {
    oauth.getOAuthRequestToken((error: any, key: string, secret: string, results: any) => {
      if (error) reject(error);

      resolve({key: key, secret: secret});
    });
  });
}
function getAccessToken(requestToken: Token, verifier: string) {
  return new Promise<Token>((resolve, reject) => {
    oauth.getOAuthAccessToken(requestToken.key, requestToken.secret, verifier, (error: any, accessKey: string, accessSecret: string) => {
      if (error) reject(error);

      resolve({key: accessKey, secret: accessSecret});
    });
  });
}

export function call(): TheMoodyBlues.TwitterAgent | null {
  const client = loadClient();
  if (client) {
    return client;
  } else {
    return null;
  }
}
export async function authorize(showVerifierForm: () => Promise<string>): Promise<TheMoodyBlues.TwitterAgent> {
  const agent = call();
  if (agent) {
    return agent;
  }

  const requestToken = await getRequestToken();
  shell.openExternal(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken.key}`);
  const verifier = await showVerifierForm();
  const accessToken = await getAccessToken(requestToken, verifier);

  storage.setAccessKey(accessToken.key);
  storage.setAccessSecret(accessToken.secret);

  return createClient(accessToken);
}
