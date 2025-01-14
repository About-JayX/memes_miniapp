const isDev = import.meta.env.DEV;

export const telegramRobotUrl = "https://t.me/PixelManRBot";

export const telegramInitData: any = isDev
  ? {
      initData:
        "user=%7B%22id%22%3A1875953573%2C%22first_name%22%3A%22Mr.%20Monkey%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Monkey_Gentle%22%2C%22language_code%22%3A%22zh-hans%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FQHIJ1xmOGBK9zsc38d_KmzFO1eCSUwnH10wSlcHvmCw.svg%22%7D&chat_instance=1318806447032551280&chat_type=private&auth_date=1736775585&signature=-bz_j-Q46i_OMYGUf-y6JNf2HzPVigfHKFQnk9_ICvQNV_nktdT5qCetU23rB3-bzdVI5vLai2gjqaRfgRCABA&hash=8460d43e9571a9dc2c6d59fec97c1d755995eb7435852fd2beb3f8a953d39b01",
      initDataUnsafe: {
        user: {
          id: 1875953573,
          first_name: "Mr. Monkey",
          last_name: "",
          username: "Monkey_Gentle",
          language_code: "zh-hans",
          is_premium: true,
          allows_write_to_pm: true,
          photo_url:
            "https://t.me/i/userpic/320/QHIJ1xmOGBK9zsc38d_KmzFO1eCSUwnH10wSlcHvmCw.svg",
        },
        chat_instance: "1318806447032551280",
        chat_type: "private",
        auth_date: "1736775585",
        signature:
          "-bz_j-Q46i_OMYGUf-y6JNf2HzPVigfHKFQnk9_ICvQNV_nktdT5qCetU23rB3-bzdVI5vLai2gjqaRfgRCABA",
        hash: "8460d43e9571a9dc2c6d59fec97c1d755995eb7435852fd2beb3f8a953d39b01",
      },
    }
  : {};
