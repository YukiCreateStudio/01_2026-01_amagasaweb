import CategoryTag from "@/app/_component/CategoryTag";
import NewsList from "@/app/_component/NewsList";
import Pagination from "@/app/_component/Pagination";
import { NEWS_LIMIT } from "@/app/_constants";
import { getCategoryDetail, getNewsList } from "@/data/microcms";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const category = await getCategoryDetail(params.id);
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIMIT,
    filters: `category[equals]${category.id}`,
  });
  return (
    <>
      <CategoryTag category={category} />
      の一覧
      <NewsList news={news} />
      <Pagination totalCount={totalCount} basePath={`/news/category/${category.id}`} />
    </>
  );
}
