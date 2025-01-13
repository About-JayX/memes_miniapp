export default {
  title: 'MINIDOGE 봇 연결',
  text: '태스크 해제 • 포인트 획득 • 그룹 공유',

  text2: 'MINIDOGE 봇을 활성화하려면 그룹 채팅에 전송',
  user: [
    {
      text: [
        { content: '"', status: false },
        { content: '시작', status: true },
        { content: '"을 클릭하여 개인 채팅에 연결', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: 'https://mini-doge.com',
    },
    {
      text: [
        { content: '연결 완료 후 ', status: false },
        { content: '성공', status: true, copy: false },
        {
          content: ' 표시가 나타납니다. 향후 거래 알림을 받을 수 있습니다',
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
        { content: '', status: false },
        { content: '{{botName}}', status: true },
        { content: '을 열어 텔레그램 그룹에 추가', status: false },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        { content: '봇을 그룹에 추가한 후 ', status: false },
        { content: '/Bind {{code}}', status: true },
        { content: ' 입력', status: false },
      ],
      copy: true,
      copyText: '/Bind {{code}}',
      imgUrl: 'https://mini-doge.com',
    },
  ],
}
