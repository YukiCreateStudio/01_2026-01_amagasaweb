import { getNewsList } from "@/data/microcms";
import NewsList from "../_component/NewsList";
import { NEWS_LIMIT } from "../_constants";

export default async function Page() {
  const {contents:news}= await getNewsList({
    limit:NEWS_LIMIT,
  })
  return (
    <>
      <NewsList news={news}/>
    </>
  );
}
