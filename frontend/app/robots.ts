import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/citizen/"],
    },
    sitemap: "https://globalsmartcitizensfoundation.org/sitemap.xml",
  };
}
