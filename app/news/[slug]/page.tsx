import Article from "@/app/_component/Article";
import { getNewsDetail } from "@/data/microcms";

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const news= await getNewsDetail(params.slug)
  console.log("news:",news);
  return (
    <>
      <Article news={news}/>
    </>
  );
}
