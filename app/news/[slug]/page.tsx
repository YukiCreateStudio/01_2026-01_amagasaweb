import Article from "@/app/_component/Article";
import ButtonLink from "@/app/_component/ButtonLink";
import { getNewsDetail } from "@/data/microcms";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { dk?: string };
};

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
