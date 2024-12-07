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
          content:
            ' 이라는 표시가 나타납니다. 이 알림 방식을 선택하여 향후 거래 알림을 받을 수 있습니다.',
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
        { content: '아래 버튼을 클릭하여', status: false },
        { content: 'MEGO 봇을 열기', status: true },
        { content: 'MEGO 봇 페이지에 접속한 후', status: false },
        { content: '그룹에 MEGO 추가하기', status: true },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
    {
      text: [
        {
          content: '관리자 권한이 있는 Telegram 그룹을 선택하고',
          status: false,
        },
        { content: 'Megofun_bot을 추가', status: true },
        { content: '관리자로 설정합니다.', status: false },
      ],
      copy: false,
      copyText: '"',
      imgUrl: '',
    },
    {
      text: [
        { content: '설정이 완료되면', status: false },
        { content: '연결됨', status: true },
        {
          content:
            '이라는 메시지가 그룹에 표시되어 연결이 성공했음을 확인할 수 있습니다.',
          status: false,
        },
      ],
      copy: false,
      copyText: '',
      imgUrl: '',
    },
  ],
}
