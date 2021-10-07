import {shell} from "electron";
import {OAuth} from "oauth";
import {setup} from "./twitter";
import storage from "./storage";
import Twitter from "twitter";

const oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", process.env.CONSUMER_KEY!, process.env.CONSUMER_SECRET!, "1.0A", null, "HMAC-SHA1");

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

function createClient(accessToken: Token): any {
  return setup(
    new Twitter({
      consumer_key: process.env.CONSUMER_KEY!,
      consumer_secret: process.env.CONSUMER_SECRET!,
      access_token_key: accessToken.key,
      access_token_secret: accessToken.secret,
    })
  );
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

export default async function authorize(getVerifier: () => string) {
  const client = loadClient();
  if (client) return client;

  const requestToken = await getRequestToken();
  shell.openExternal(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken.key}`);
  const verifier = await getVerifier();
  const accessToken = await getAccessToken(requestToken, verifier);

  storage.setAccessKey(accessToken.key);
  storage.setAccessSecret(accessToken.secret);

  return createClient(accessToken);
}
