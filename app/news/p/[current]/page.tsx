import NewsList from "@/app/_component/NewsList";
import Pagination from "@/app/_component/Pagination";
import { NEWS_LIMIT } from "@/app/_constants";
import { getNewsList } from "@/data/microcms";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ current: string }>;
};

export default async function Page({ params }: Props) {

  const {current:currentParam} = await params;

  const current = parseInt(currentParam, 10);
  if (Number.isNaN(current) || current < 1) {
    notFound();
  }
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIMIT,
    offset: NEWS_LIMIT * (current - 1),
  });
  if (news.length === 0) {
    notFound();
  }
  return (
    <>
      <NewsList news={news} />
      <Pagination totalCount={totalCount} current={current} />
    </>
  );
}
