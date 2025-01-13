export default {
  title: '连接 MINIDOGE 机器人',
  text: '解锁任务 • 获取积分 • 分享到您的群组',

  text2: '将其发送到群聊以激活 MINIDOGE 机器人',
  user: [
    {
      text: [
        { content: '点击"', status: false },
        { content: '开始', status: true },
        { content: '"绑定到您的个人聊天窗口', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://mini-doge.com',
    },
    {
      text: [
        { content: '绑定完成后，您将看到', status: false },
        { content: '成功', status: true, copy: false },
        {
          content: ' 显示，您可以选择此通知方式来接收未来通知的交易提醒',
          status: false,
        },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
  group: [
    {
      text: [
        { content: '打开', status: false },
        { content: '{{botName}}', status: true },
        { content: '将其添加到您的 Telegram 群组', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        { content: '机器人添加到群组后，输入', status: false },
        { content: '/Bind {{code}}', status: true },
      ],
      copy: true,
      copyText: '/Bind {{code}}',
      imgUrl: 'https://mini-doge.com',
    },
    {
      text: [
        { content: '最后，您将看到', status: false },
        { content: '"Connected"', status: true },
        {
          content: ' 显示在群聊中。',
          status: false,
        },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
