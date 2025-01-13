export const env = import.meta.env.MODE.split("-")[1];

export const symbol = env === "memes" ? "MEMES" : env === "minidoge" ? "𝕏Ð" : "MEGO";

export const isMinidoge = env === "minidoge";
export const isMemes = env === "memes";
export const isMego = env === "mego";
