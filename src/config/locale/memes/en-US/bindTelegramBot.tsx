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
        {
          content: 'Click the',
          status: false,
        },
        { content: 'Open MEGO Bot', status: true },
        {
          content: 'button below to access the MEGO Bot page, then select',
          status: false,
        },
        { content: 'Add MEGO to a group', status: true },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        {
          content:
            'Choose a Telegram group where you have admin privileges and',
          status: false,
        },
        { content: 'add Megofun_bot', status: true },
        { content: 'as an administrator.', status: false },
      ],
      copy: false,
      copyText: '"',
      imgUrl: '',
    },
    {
      text: [
        { content: 'Once the setup is complete, you’ll see a', status: false },
        { content: 'Connected', status: true },
        {
          content:
            'message in the group, confirming the connection was successful.',
          status: false,
        },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
