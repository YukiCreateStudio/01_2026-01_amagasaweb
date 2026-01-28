import Article from "@/app/_component/Article";
import ButtonLink from "@/app/_component/ButtonLink";
import { getNewsDetail } from "@/data/microcms";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// params と searchParams を Promise 型に変更
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
// await で中身を取り出す
  const { slug } = await params;
  const { dk } = await searchParams;

  const data = await getNewsDetail(slug, { draftKey: dk });

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.thumbnail?.url ?? ""],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  // await で中身を取り出す
  const { slug } = await params;
  const { dk } = await searchParams;

  const news = await getNewsDetail(slug, {
    draftKey: dk,
  }).catch(notFound);

  return (
    <>
      <Article news={news} />
      <ButtonLink href={`/news`}>ニュース一覧へ</ButtonLink>
    </>
  );
}
