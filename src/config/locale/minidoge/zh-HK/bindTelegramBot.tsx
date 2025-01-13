export default {
  title: '連接 MINIDOGE 機器人',
  text: '解鎖任務 • 獲取積分 • 分享到您的群組',

  text2: '將其發送到群聊以啟動 MINIDOGE 機器人',
  user: [
    {
      text: [
        { content: '點擊"', status: false },
        { content: '開始', status: true },
        { content: '"綁定到您的個人聊天窗口', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://mini-doge.com',
    },
    {
      text: [
        { content: '綁定完成後，您將看到', status: false },
        { content: '成功', status: true, copy: false },
        {
          content: ' 顯示，您可以選擇此通知方式來接收未來通知的交易提醒',
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
        { content: '打開', status: false },
        { content: '{{botName}}', status: true },
        { content: '將其添加到您的 Telegram 群組', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        { content: '機器人添加到群組後，輸入', status: false },
        { content: '/Bind {{code}}', status: true },
      ],
      copy: true,
      copyText: '/Bind {{code}}',
      imgUrl: 'https://mini-doge.com',
    },
  ],
}

