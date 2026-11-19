import { Heart, Leaf, Truck } from "lucide-react";
import { brand } from "@/lib/brand";
import { CurvyArrow, YarnBall } from "./doodles";
import WavyDivider from "./WavyDivider";

const items = [
  { icon: Leaf, title: "Handmade with love", text: "Every piece stitched by hand, never machine made." },
  { icon: YarnBall, title: "High quality yarn", text: "Carefully selected premium Turkish yarn, gentle to touch, durable and lint free." },
  { icon: Truck, title: "Nationwide delivery", text: "Anywhere in Pakistan, Cash on Delivery too." },
  { icon: Heart, title: "Custom designs available", text: "Your colours, your idea, our hooks." },
];

export default function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="mt-20">
      <WavyDivider color="cream" />
      <div className="bg-cream-200">
        <div className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex shrink-0 items-center gap-2 lg:w-[180px] lg:flex-col lg:items-start">
            <h2 id="why-title" className="-rotate-3 font-hand text-[34px] leading-none text-sage-900">
              Why {brand.name}?
            </h2>
            <CurvyArrow size={70} className="text-sage-700 lg:ml-10 lg:mt-2" />
          </div>
          <ul className="grid flex-1 grid-cols-2 gap-y-8 lg:grid-cols-4">
            {items.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className={`flex flex-col items-center px-3 text-center sm:px-5 ${i % 2 === 1 ? "border-l border-sage-300" : ""} ${i === 2 ? "lg:border-l lg:border-sage-300" : ""}`}
              >
                <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-pill bg-cream-50 text-sage-700 shadow-soft">
                  <Icon size={26} strokeWidth={1.6} />
                </span>
                <h3 className="font-hand text-[18px] leading-tight tracking-wide text-sage-900">{title}</h3>
                <p className="mt-1 max-w-[200px] text-[13px] leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
          <YarnBall size={92} className="floaty absolute -bottom-6 right-4 hidden text-sage-700/60 xl:block" />
        </div>
      </div>
      <WavyDivider color="cream" flip />
    </section>
  );
}
