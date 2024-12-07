export default {
  title: '連接 MEGO 機械人',
  text: '解鎖任務 • 獲取積分 • 分享到您的群組',

  text2: '將其發送到群聊以激活 MEGO 機械人',
  user: [
    {
      text: [
        { content: '點擊"', status: false },
        { content: '開始', status: true },
        { content: '"綁定到您的個人聊天窗口', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://www.baidu.com',
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
        { content: '點擊下面的', status: false },
        { content: '打開 MEGO 機器人', status: true },
        { content: '按鈕以訪問 MEGO 機器人頁面，然後選擇', status: false },
        { content: '將 MEGO 添加到群組', status: true },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        {
          content: '選擇一個您擁有管理員權限的 Telegram 群組，並',
          status: false,
        },
        { content: '添加 Megofun_bot', status: true },
        { content: '作為管理員。', status: false },
      ],
      copy: false,
      copyText: '"',
      imgUrl: '',
    },
    {
      text: [
        { content: '設置完成後，您將看到一個', status: false },
        { content: '已連接', status: true },
        { content: '消息，確認連接成功。', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
