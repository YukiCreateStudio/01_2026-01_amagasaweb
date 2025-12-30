import NewsList from "@/app/_component/NewsList";
import SearchField from "@/app/_component/SearchField";
import { NEWS_LIMIT } from "@/app/_constants";
import { getNewsList } from "@/data/microcms";

type Props = {
  searchParams: {
    q: string;
  };
};

export default async function Page({ searchParams }: Props) {
  console.log(searchParams.q);
  const { contents: news } = await getNewsList({
    limit: NEWS_LIMIT,
    q: searchParams.q,
  });
  return (
    <>
      <SearchField/>
      <NewsList news={news} />
    </>
  );
}
