import megoEnUS from "./mego/en-US";
import megoKoKR from "./mego/ko-KR";
import megoZhCn from "./mego/zh-CN";
import megoZhHk from "./mego/zh-HK";
import memesEnUS from "./memes/en-US";
import memesKoKR from "./memes/ko-KR";
import memesZhCn from "./memes/zh-CN";
import memesZhHk from "./memes/zh-HK";
import minidogeEnUS from "./minidoge/en-US";
import minidogeKoKR from "./minidoge/ko-KR";
import minidogeZhCn from "./minidoge/zh-CN";
import minidogeZhHk from "./minidoge/zh-HK";

import { env } from "@/config";

export default {
  "en-US": env === "memes" ? memesEnUS : env === "minidoge" ? minidogeEnUS : megoEnUS, // 英语（美式）
  "ko-KR": env === "memes" ? memesKoKR : env === "minidoge" ? minidogeKoKR : megoKoKR, // 韩语
  "zh-CN": env === "memes" ? memesZhCn : env === "minidoge" ? minidogeZhCn : megoZhCn, // 简体中文
  "zh-HK": env === "memes" ? memesZhHk : env === "minidoge" ? minidogeZhHk : megoZhHk, // 繁体中文（中国香港）
} as any;
