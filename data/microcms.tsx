import { createClient, MicroCMSContentId } from "microcms-js-sdk";
import { MicroCMSQueries } from "microcms-js-sdk";

// MicroCMSのクライアント設定

if (!process.env.MICROCMS_DOMAIN) {
  throw new Error("MICROCMS_DOMAIN　が設定されていません");
}

if (!process.env.MICROCMS_APIKEY) {
  throw new Error("MICROCMS_APIKEY　が設定されていません");
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_DOMAIN,
  apiKey: process.env.MICROCMS_APIKEY,
});

//NewsListデータを取得
export const getNewsList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList({
    endpoint: "news",
    queries,
    customRequestInit: {
      next: { revalidate: 1 },
    },
  });
  return listData;
};
// CategoryDetailデータを取得
export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail({
    endpoint: "categories",
    contentId,
    customRequestInit: {
      next: { revalidate: 1 },
    },
  });
  return detailData;
};

// NewsDetailデータを取得
export const getNewsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail({
    endpoint: "news",
    contentId,
    queries,
    customRequestInit: {
      next: { revalidate: 1 },
    },
  });
  return detailData;
};

// ニュースの全データ取得
export const getAllNewsList = async () => {
  const listData = await client.getAllContents({
    endpoint: "news",
  });
  return listData;
};
export const getAllCategoryList = async () => {
  const listData = await client.getAllContents({
    endpoint: "categories",
  });
  return listData;
};
