export const env = import.meta.env.MODE.split("-")[1];

export const symbol = env === "memes" ? "MEMES" : "MEGO";
