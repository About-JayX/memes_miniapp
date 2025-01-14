import bindTelegramBot from "./bindTelegramBot";
import integral from "./integral";
import invite from "./invite";
import message from "./message";
import openScreenAnimation from "./openScreenAnimation";
import _public from "./public";
import signin from "./signin";
import task from "./task";
import vote from "./vote";

export default {
  translation: {
    language: "한국어",
    lang: "언어",
    public: _public,
    task,
    integral,
    signin,
    invite,
    vote,
    message,
    openScreenAnimation,
    bindTelegramBot
  },
};