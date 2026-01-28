import NewsList from "@/app/_component/NewsList";
import SearchField from "@/app/_component/SearchField";
import { NEWS_LIMIT } from "@/app/_constants";
import { getNewsList } from "@/data/microcms";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {

  const { q } = await searchParams;

  const { contents: news } = await getNewsList({
    limit: NEWS_LIMIT,
    q: q,
  });
  return (
    <>
      <SearchField/>
      <NewsList news={news} />
    </>
  );
}
