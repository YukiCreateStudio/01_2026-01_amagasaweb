import CategoryTag from "@/app/_component/CategoryTag";
import NewsList from "@/app/_component/NewsList";
import Pagination from "@/app/_component/Pagination";
import { NEWS_LIMIT } from "@/app/_constants";
import { getCategoryDetail, getNewsList } from "@/data/microcms";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  // 1. まず params を await して中身を取り出す
  const { id, current: currentParam } = await params;

  // 2. 取り出した値を使って category を取得
  const category = await getCategoryDetail(id);

  // 3. 数値に変換
  const current = parseInt(currentParam, 10);
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
