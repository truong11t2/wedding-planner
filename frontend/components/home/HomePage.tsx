import { displayFont } from './fonts';
import Hero from './sections/Hero';
import Features from './sections/Features';
import ProductExperience from './sections/ProductExperience';
import PlanningTimeline from './sections/PlanningTimeline';
import Pricing from './sections/Pricing';
import Testimonials from './sections/Testimonials';
import Vendors from './sections/Vendors';
import FinalCta from './sections/FinalCta';

export default function HomePage() {
  return (
    <div className={displayFont.variable}>
      <Hero />
      <Features />
      <ProductExperience />
      <PlanningTimeline />
      {/* <Pricing /> */}
      <Testimonials />
      <Vendors />
      <FinalCta />
    </div>
  );
}
