// data/members.ts
export type Member = {
  id: number;
  name: string;
  presentationDate: string | null;
};

export const members: Member[] = [
  { id: 1, name: '伊藤(太)', presentationDate: null },
  { id: 2, name: '大黒', presentationDate: null },
  { id: 3, name: '豊丸', presentationDate: null },
  { id: 4, name: '堀川', presentationDate: null },
  { id: 5, name: '眞野', presentationDate: null },
  { id: 6, name: '三上', presentationDate: null },
  { id: 7, name: '柳川', presentationDate: null },
  { id: 8, name: '柳沢', presentationDate: null },
  { id: 9, name: 'ライ', presentationDate: null },
];