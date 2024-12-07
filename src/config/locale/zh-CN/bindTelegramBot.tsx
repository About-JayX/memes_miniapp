export default {
  title: '连接 MEGO 机器人',
  text: '解锁任务 • 获取积分 • 分享到您的群组',

  text2: '将其发送到群聊以激活 MEGO 机器人',
  user: [
    {
      text: [
        { content: '点击"', status: false },
        { content: '开始', status: true },
        { content: '"绑定到您的个人聊天窗口', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://www.baidu.com',
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
        { content: '点击下面的', status: false },
        { content: '打开 MEGO 机器人', status: true },
        { content: '按钮以访问 MEGO 机器人页面，然后选择', status: false },
        { content: '将 MEGO 添加到群组', status: true },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        {
          content: '选择一个您拥有管理员权限的 Telegram 群组，并',
          status: false,
        },
        { content: '添加 Megofun_bot', status: true },
        { content: '作为管理员。', status: false },
      ],
      copy: false,
      copyText: '"',
      imgUrl: '',
    },
    {
      text: [
        { content: '设置完成后，您将看到一个', status: false },
        { content: '已连接', status: true },
        { content: '消息，确认连接成功。', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
