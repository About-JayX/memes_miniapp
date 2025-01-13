const isDev = import.meta.env.DEV;

export const telegramRobotUrl = "https://t.me/PixelManRBot";

export const telegramInitData: any = isDev
  ? {
      initData:
        "user=%7B%22id%22%3A1875953573%2C%22first_name%22%3A%22Mr.%20Monkey%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Monkey_Gentle%22%2C%22language_code%22%3A%22zh-hans%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FQHIJ1xmOGBK9zsc38d_KmzFO1eCSUwnH10wSlcHvmCw.svg%22%7D&chat_instance=7642789811510913495&chat_type=sender&start_param=open_true&auth_date=1736754098&signature=FIyuWtuWHIZa7uWrKkqM7t05qTZlQkEzEvaEh62dyBDIjLNugvpn6kw0fbljmNpry4U897Qdw0ZGD43YXtlTAQ&hash=dcf4cbf9f2418165a9691d3a7d137578366e3241a3c66b12ca2c3a56a4c84fe5",
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
        chat_instance: "7642789811510913495",
        chat_type: "sender",
        start_param: "open_true",
        auth_date: "1736754098",
        signature:
          "FIyuWtuWHIZa7uWrKkqM7t05qTZlQkEzEvaEh62dyBDIjLNugvpn6kw0fbljmNpry4U897Qdw0ZGD43YXtlTAQ",
        hash: "dcf4cbf9f2418165a9691d3a7d137578366e3241a3c66b12ca2c3a56a4c84fe5",
      },
    }
  : {};
