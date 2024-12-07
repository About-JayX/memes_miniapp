const isDev = import.meta.env.DEV;

export const telegramRobotUrl = "https://t.me/PixelManRBot";

export const telegramInitData: any = isDev
  ? {
      initData:
        "user=%7B%22id%22%3A6086908373%2C%22first_name%22%3A%223042%22%2C%22last_name%22%3A%22s%22%2C%22username%22%3A%22s3042hjx%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fjay5JoBnLl-8Tsuqh01c7x4J2H6UCR1ckrYpo8O52o8ph_VI1AkdfbLK-nuk5hyk.svg%22%7D&chat_instance=-2086362816887371523&chat_type=private&start_param=open_true&auth_date=1733566047&signature=rVkEw5OlEGASklNJ0P_FGjzzlfJterqkrN8H2i6yRiu8HrvTwTmy-EXT31BJdJvle746v-rz5U5wk72Z1nrkCA&hash=10f77e828f2c4d5a20286104d47b100e3e3486c9899fe1f8e5203d4d639fe934",
      initDataUnsafe: {
        user: {
          id: 6086908373,
          first_name: "3042",
          last_name: "s",
          username: "s3042hjx",
          language_code: "zh-hans",
          allows_write_to_pm: true,
          photo_url:
            "https://t.me/i/userpic/320/jay5JoBnLl-8Tsuqh01c7x4J2H6UCR1ckrYpo8O52o8ph_VI1AkdfbLK-nuk5hyk.svg",
        },
        chat_instance: "-2086362816887371523",
        chat_type: "private",
        start_param: "open_true",
        auth_date: "1733566047",
        signature:
          "rVkEw5OlEGASklNJ0P_FGjzzlfJterqkrN8H2i6yRiu8HrvTwTmy-EXT31BJdJvle746v-rz5U5wk72Z1nrkCA",
        hash: "10f77e828f2c4d5a20286104d47b100e3e3486c9899fe1f8e5203d4d639fe934",
      },
    }
  : {};
