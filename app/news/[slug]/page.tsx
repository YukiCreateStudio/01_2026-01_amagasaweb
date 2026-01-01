import Article from "@/app/_component/Article";
import ButtonLink from "@/app/_component/ButtonLink";
import { getNewsDetail } from "@/data/microcms";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { dk?: string };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const data = await getNewsDetail(params.slug, { draftKey: searchParams.dk });
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
  const news = await getNewsDetail(params.slug, {
    draftKey: searchParams.dk,
  }).catch(notFound);
  return (
    <>
      <Article news={news} />
      <ButtonLink href={`/news`}>ニュース一覧へ</ButtonLink>
    </>
  );
}
