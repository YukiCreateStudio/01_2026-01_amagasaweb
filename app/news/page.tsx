import { getNewsList } from "@/data/microcms";
import NewsList from "../_component/NewsList";
import { NEWS_LIMIT } from "../_constants";
import Pagination from "../_component/Pagination";

export default async function Page() {
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIMIT,
  });
  return (
    <>
      <NewsList news={news} />
      <Pagination totalCount={totalCount} />
    </>
  );
}
