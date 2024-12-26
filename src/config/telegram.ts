const isDev = import.meta.env.DEV

export const telegramRobotUrl = 'https://t.me/PixelManRBot'

export const telegramInitData: any = isDev
  ? {
      initData:
        'user=%7B%22id%22%3A6350461487%2C%22first_name%22%3A%22Jay%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22About_JayX%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FtZhbey6fYSSs4bUEWe-CRX8wn5nC3Zi5AEsCcFNAoAW5bHx4tumrsNx9IwWlXnHL.svg%22%7D&chat_instance=2675484783253216124&chat_type=sender&start_param=open_true&auth_date=1735196342&signature=49hjf-xIjbeFSqzL2WogYbfoLtAY2WMQh5j4vrX76g7mD8tPDF7WtmX4vJNUX4_g4dJweXqN6T_Hzbg_MIzxAQ&hash=4e14093123b9dd52f0aad0f334508df429d6984675c537146aa41587c4e95874',
      initDataUnsafe: {
        user: {
          id: 6350461487,
          first_name: 'Jay',
          last_name: '',
          username: 'About_JayX',
          language_code: 'zh-hans',
          allows_write_to_pm: true,
          photo_url:
            'https://t.me/i/userpic/320/tZhbey6fYSSs4bUEWe-CRX8wn5nC3Zi5AEsCcFNAoAW5bHx4tumrsNx9IwWlXnHL.svg',
        },
        chat_instance: '2675484783253216124',
        chat_type: 'sender',
        start_param: 'open_true',
        auth_date: '1735196342',
        signature:
          '49hjf-xIjbeFSqzL2WogYbfoLtAY2WMQh5j4vrX76g7mD8tPDF7WtmX4vJNUX4_g4dJweXqN6T_Hzbg_MIzxAQ',
        hash: '4e14093123b9dd52f0aad0f334508df429d6984675c537146aa41587c4e95874',
      },
    }
  : {}
