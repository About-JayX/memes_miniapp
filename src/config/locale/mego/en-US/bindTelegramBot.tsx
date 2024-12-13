export default {
  title: 'Connect with MEGO Bot',
  text: 'Unlock Tasks • Earn Points • Share in Your Group',

  text2: 'Send it in the group chat to activate MEGO Bot',
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
        { content: 'Open', status: false },
        { content: '{{botName}}', status: true },
        { content: 'add it to your Telegram group ', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        { content: 'Once the bot is added to your group, enter', status: false },
        { content: '/Bind {{code}}', status: true },
      ],
      copy: true,
      copyText: '/Bind {{code}}',
      imgUrl: 'https://www.baidu.com',
    },
    {
      text: [
        { content: 'Finally, you will see', status: false },
        { content: '"Connected"', status: true },
        {
          content: ' displayed in your group chat..',
          status: false,
        },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
