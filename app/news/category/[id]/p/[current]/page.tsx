import CategoryTag from "@/app/_component/CategoryTag";
import NewsList from "@/app/_component/NewsList";
import Pagination from "@/app/_component/Pagination";
import { NEWS_LIMIT } from "@/app/_constants";
import { getCategoryDetail, getNewsList } from "@/data/microcms";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
    current: string;
  };
};

export default async function Page({ params }: Props) {
  const category = await getCategoryDetail(params.id);
  const current = parseInt(params.current, 10);
  if (Number.isNaN(current) || current < 1) {
    notFound();
  }
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIMIT,
    filters: `category[equals]${category.id}`,
    offset: 10 * (current - 1),
  });
  if (news.length === 0) {
    notFound();
  }
  return (
    <>
      <CategoryTag category={category} />
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        basePath={`/news/category/${category.id}`}
      />
    </>
  );
}
