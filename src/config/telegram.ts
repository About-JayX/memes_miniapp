import CryptoJS from 'crypto-js'

const isDev = import.meta.env.DEV

export const telegramRobotUrl = 'https://t.me/minidoge_x_bot'

export const telegramInitData: any = isDev
  ? {
      initData:
        'user=%7B%22id%22%3A6350461487%2C%22first_name%22%3A%22Jay%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22About_JayX%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FtZhbey6fYSSs4bUEWe-CRX8wn5nC3Zi5AEsCcFNAoAW5bHx4tumrsNx9IwWlXnHL.svg%22%7D&chat_instance=-952195440344692071&chat_type=sender&auth_date=1737015342&signature=XU79hQakqnrMF8281MsE08O9i_8eQWn0ELIZJ_xo7vSH9xLYEbaIdQ2wQA7ZFeCfzwT-KCkIZx2YOubo69JJCA&hash=085567fe15b072b30b37ce2d863db7961c7434de98226af7e461e15ad0849ae1',
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
        chat_instance: '-952195440344692071',
        chat_type: 'sender',
        auth_date: '1737015342',
        signature:
          'XU79hQakqnrMF8281MsE08O9i_8eQWn0ELIZJ_xo7vSH9xLYEbaIdQ2wQA7ZFeCfzwT-KCkIZx2YOubo69JJCA',
        hash: '085567fe15b072b30b37ce2d863db7961c7434de98226af7e461e15ad0849ae1',
      },
    }
  : {}

export const generateHash = (data: string, key: string) => {
  return CryptoJS.HmacSHA256(data, key).toString();
};
