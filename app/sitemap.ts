import { MetadataRoute } from "next";
import { getAllNewsList, getAllCategoryList } from "@/data/microcms";

export const runtime = "edge";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

const buildUrl = (path?: string) => `${siteUrl}${path ?? ""}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsContents = await getAllNewsList();
  const categoryContents = await getAllCategoryList();

  const newsUrls: MetadataRoute.Sitemap = newsContents.map((content) => ({
    url: buildUrl(`/news/${content.id}`),
    lastModified: content.revisedAt,
  }));
  const categoryUrls: MetadataRoute.Sitemap = categoryContents.map(
    (content) => ({
      url: buildUrl(`/news/category/${content.id}`),
      lastModified: content.revisedAt,
    })
  );

  const now = new Date();
  return [
    {
      url: buildUrl(),
      lastModified: now,
    },
    {
      url: buildUrl("/news"),
      lastModified: now,
    },
    {
      url: buildUrl("/members"),
      lastModified: now,
    },
    ...newsUrls,
    ...categoryUrls,
  ];
}
