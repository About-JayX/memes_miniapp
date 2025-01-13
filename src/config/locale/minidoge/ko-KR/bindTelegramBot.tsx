export default {
  title: 'MEGO 봇과 연결하기',
  text: '작업 해제 • 포인트 적립 • 그룹에 공유',

  text2: 'MEGO 봇을 활성화하려면 그룹 채팅에 보내세요',
  user: [
    {
      text: [
        { content: '클릭 "', status: false },
        { content: '시작', status: true },
        { content: '" 개인 채팅 창에 연결하세요', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://www.baidu.com',
    },
    {
      text: [
        { content: '연결이 완료되면', status: false },
        { content: '성공', status: true, copy: false },
        {
          content: ' 이라는 표시가 나타납니다. 이 알림 방식을 선택하여 향후 거래 알림을 받을 수 있습니다.',
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
        { content: '열기', status: false },
        { content: '{{botName}}', status: true },
        { content: '를 Telegram 그룹에 추가하세요', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        { content: '봇이 그룹에 추가되면', status: false },
        { content: '/Bind {{code}}', status: true },
      ],
      copy: true,
      copyText: '/Bind {{code}}',
      imgUrl: 'https://www.baidu.com',
    },
    {
      text: [
        { content: '마지막으로', status: false },
        { content: '"Connected"', status: true },
        {
          content: '라는 메시지가 그룹 채팅에 표시됩니다.',
          status: false,
        },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
