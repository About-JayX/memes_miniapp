export default {
  title: 'Connect MINIDOGE Bot',
  text: 'Unlock Tasks • Earn Points • Share to Groups',

  text2: 'Send to group chat to activate MINIDOGE Bot',
  user: [
    {
      text: [
        { content: 'Click "', status: false },
        { content: 'Start', status: true },
        { content: '" to bind to your personal chat', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://mini-doge.com',
    },
    {
      text: [
        { content: 'After binding, you will see ', status: false },
        { content: 'Success', status: true, copy: false },
        {
          content: ' displayed. You can choose this notification method for future trade alerts',
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
        { content: 'Open ', status: false },
        { content: '{{botName}}', status: true },
        { content: ' and add it to your Telegram group', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        { content: 'After adding the bot to group, enter ', status: false },
        { content: '/Bind {{code}}', status: true },
      ],
      copy: true,
      copyText: '/Bind {{code}}',
      imgUrl: 'https://mini-doge.com',
    },
  ],
}
