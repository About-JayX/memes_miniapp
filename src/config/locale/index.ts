import megoEnUS from "./mego/en-US";
import megoKoKR from "./mego/ko-KR";
import megoZhCn from "./mego/zh-CN";
import megoZhHk from "./mego/zh-HK";
import memesEnUS from "./memes/en-US";
import memesKoKR from "./memes/ko-KR";
import memesZhCn from "./memes/zh-CN";
import memesZhHk from "./memes/zh-HK";

const env = import.meta.env.MODE.split("-")[1];

export default {
  "en-US": env === "memes" ? memesEnUS : megoEnUS, // 英语（美式）
  "ko-KR": env === "memes" ? memesKoKR : megoKoKR, // 韩语
  "zh-CN": env === "memes" ? memesZhCn : megoZhCn, // 简体中文
  "zh-HK": env === "memes" ? memesZhHk : megoZhHk, // 繁体中文（中国香港）
} as any;
