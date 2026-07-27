import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Categories } from "@/components/home/categories";
import { BestSellers } from "@/components/home/best-sellers";
import { PatternsTeaser } from "@/components/home/patterns-teaser";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Process } from "@/components/home/process";
import { CustomCta } from "@/components/home/custom-cta";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Categories />
      <BestSellers />
      <PatternsTeaser />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <CustomCta />
      <Newsletter />
    </>
  );
}
