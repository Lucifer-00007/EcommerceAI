import type { Product } from "@/types/ecommerce";

export type ClothImage = {
  src: string;
  alt: string;
};

const imagesBySlug: Record<string, string[]> = {
  "cloud-hoodie": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDuyta3DkYSc1yGBy4thotfJ3AcSU_9MjKEhuPPDua1ybwTOUYrveBUVH1r47G8x7zFXQBCW6kREffZ-Md7dOvzL0U1vbg5hbYLqDW1nUrGPRQd2kyoO-_pfDQGR-92WULg3hdEF8smYLP6WuXbO_1UDS1qLyqn9x2tVID_JyEpr9aK665NruFbGwIswNdCOIKB1IY-0ewKXAYtNCjP71ktP_bE1Msxpai1T2WBuiGp62iwZgRAUiVInXAfQ6YC4ykc8L0MWgqmbBg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDW7tb9yn0ZxyMOvhvJKmsnsfTd_LCUmHVmMmxXHptwclkItCJJSYDrycO1VJUvgbmY0UQazcLPKNOoXBOzAyfzKfYiDlJOwGhyiTtf6dv3ZXQNkS6GLyTjHgAYIBLoL1BdW4PYE82myZLlT4SJRXfp_Bosc2qZG92lhuEN3AgU95PT0skSbwHNoHfIEbePaL2TFjwYVI3XCXeqPm1af6OaX6RNQ4sGphWS1zsQI3s1a-ccFCPlCcmCvSXOCPWEXZANbiGgLiUTlx0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_nTX8q4iSgxJuPmllLuBym-TS6UNirx793OK1ay8T7cTu-9kZF-zezVm78In7_YThi47O0jtMjQHmKqOKRgWA6H143I5IlupRvF3FW8Y-zGk66YVys9QaBvV4bx3rgxpjKQzftZSbEf6i8RnNJ79T9arpWlrt05tUlyw7QBhudC90aB3DmLlC0aXoN8HF0tfVeQvh6FmLjQtw_F1G2GsEyND0Qn9rOtb-iANACFwVOhohB8m9p9f0jR5BKmboK5F9oBhKrBYh4a0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLvitFfXdeYiQIsB2GntuTheIwgPebcHKY-rRHNycELzVpgl3CbV0X3dg5aJEC5EUeObjiLwg9B-lBMLPToKYZXImf086s-pJnMz2y32x5QB4XJQYyfR4d7d8KuQy1J3Z27e490zDQk-Zl-5TRh2AwD_Ifx2HWg4jEqKTY10z4wvPW8-yGSwlwjg6a8d-m6wuHj7SQUEcmy12OEq-GIJZvbYEHA_Negr9comNrOkmAe_tFOkFseJRLd6EGIVy6g1_1OcDqCvMthys",
  ],
  "everyday-tee": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFNHa3NI6V2zjafV5ZP6bD6GQOzkDBxzLQUf3AxiY9a_YqUO8_Lqm6N4b5-JdYc6u_45XcuJ5Fj4zvjiYMUjRIcglyioaAcA-o-JWrFiGoMykzETHSNk9SMHuNEhEXgAntxJB92Ff-85TA2mv-AUJMZmFX7B8yw_5sVrozKOfD43814tRMNKSUwGSYEBX-LauH6tKfCrYZG6SqA23CgBwqEZhqkOyTUl4Az1fmIp81SCVzn2tQ97CHoVDW8wHQ3RyRGVsV_KbI3Xc",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAaDW4g6Sk8Lfx1Eb0_SholJAqhQ3kSnD4Q-r2smuhqbJxWOFqAVIphApG-bOV14e79ljCuLu6oiywi_LXD8fSgSBZR7Xfd2UA4FIdk4IpWdwIctPpNz17SAVaa_5VF0AFeHdz4-o3DabhuT7d5G7xyBIDqiZBJmCZWg5q7xNchSeY3OG2M2vc8sLUanuPoCMTtvGlaajLcYBv3r6BZ_7mST1pY1K2ln9v_wS2jEU6Lh9evdrIx_VKuQPJL2c1TLIKmpNkc5-aPkp8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDRaIOOZvjX5QDUyNE8MR-_VQ8AzhlmvuEK2Hde81Hl0_ved0wJF2FwEk0FvJBX2jKxQ_BO6JBaAJ4Zyhbbik7Udn7cYceufMxnUIdcoyNhlI_RJnLvqVCfinNnxe3AxcJ1vC4Sd1GpTKvFUenfhowUWesHikESfvxl6_ZDCbIKyqBgKm_UxYKczfHEG3lUeKP61wlaqfODV2JcMQo9zwpav8Hmuqu8iRvPHpAeVfyLqSF7rqVJQE2OtCE0Fnl7ZypU04Z_XyO1EEg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpkWCQ-irbV2_wjc-IQ2Xo04OtQ64VH_XJPChaXm0rilI0wAWoc-Rzmf5kiqiA_16WXxf80DORSkiZsOSGVWXsgVhe4PN4JDlovJCR2Po0uOTJZg0pdsGecV_VPBjFQSZ0F2SMPAuuLEiXBK3f-KO4StOUw-AfwVedZugamDVjIIezbkUcpLMmIA_Nx6jUw2cwilWWtEEKvaZ1SetVh6Yc4_Dck51Irb6PxadufzJBrQUQ7iSqve1oCzzymRoxc10UwIsaEAnyVqc",
  ],
};

export function getClothImages(product: Product): ClothImage[] {
  const mapped = imagesBySlug[product.slug];
  if (mapped?.length) {
    return mapped.map((src, idx) => ({
      src,
      alt: `${product.name}${idx ? ` (${idx + 1})` : ""}`,
    }));
  }

  const fallback = product.images.length ? product.images : [{ src: "/products/category-apparel.svg", alt: "Clothing item" }];
  const base = fallback[0];
  return Array.from({ length: Math.max(1, Math.min(4, fallback.length || 1)) }).map((_, idx) => ({
    src: fallback[idx]?.src ?? base.src,
    alt: fallback[idx]?.alt ?? `${base.alt}${idx ? ` (${idx + 1})` : ""}`,
  }));
}

