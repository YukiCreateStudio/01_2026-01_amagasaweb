import { MembersType } from "@/dataType/type";

export const members: { contents: MembersType[] } = {
  contents: [
    {
      id: "1",
      name: "田中太郎",
      position: "社長",
      profile: "１０万円もってます",
      image: {
        url: "/img-member1.jpg",
        width: 720,
        height: 720,
      },
    },
    {
      id: "2",
      name: "田中ゆき",
      position: "秘書",
      profile: "お金大好き",
      image: {
        url: "/img-member2.jpg",
        width: 720,
        height: 720,
      },
    },
    {
      id: "3",
      name: "田中こころ",
      position: "従業員",
      profile: "金食い虫",
      image: {
        url: "/img-member3.jpg",
        width: 720,
        height: 720,
      },
    },
  ],
};
