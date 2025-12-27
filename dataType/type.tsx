import {
  MicroCMSListContent,
  MicroCMSImage,
  MicroCMSClient,
} from "microcms-js-sdk";

export type MembersType = {
  id: string;
  name: string;
  position: string;
  profile: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
};

export type NewsType = {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: MicroCMSImage;
} & MicroCMSListContent;
