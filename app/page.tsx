import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star as StarIcon } from "lucide-react";
import { photos } from "@/lib/photos";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategorySidebar from "@/components/CategorySidebar";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import PinnedNote, { HandwrittenAside } from "@/components/PinnedNote";
import WhyUs from "@/components/WhyUs";
import Newsletter from "@/components/Newsletter";
import { InstagramIcon, WhatsAppIcon } from "@/components/social-icons";
import { CurvyArrow, Heart, Sparkle, Sprig, Star, YarnBall } from "@/components/doodles";
import { brand, categories, whatsappLink } from "@/lib/brand";
import { bestsellers } from "@/lib/products";

const reviews = [
  { name: "Hira K.", city: "Karachi", text: "The bunny is even softer in person. My daughter hasn't let go of it since it arrived!", rating: 5 },
  { name: "Mahnoor A.", city: "Islamabad", text: "Ordered a custom tote in my wedding colours — packaging, note, everything was so thoughtful.", rating: 5 },
  { name: "Zara T.", city: "Lahore", text: "The tulip bouquet sits on my desk and gets compliments every single day. Worth it.", rating: 5 },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="mx-auto flex max-w-[1280px] gap-6 lg:pr-6">
        <CategorySidebar active="all" />
        <div className="flex flex-1 flex-col-reverse gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-0">
          <div className="relative lg:w-[42%] lg:pl-4">
            <Sparkle size={30} className="mb-1 -ml-1 text-wood" />
            <h1 className="-rotate-1 font-hand text-[40px] leading-[1.05] text-sage-900 sm:text-[52px] xl:text-[62px]">
              Tiny stitches,
              <br />
              big happiness
              <Heart size={34} className="ml-2 inline-block -translate-y-2 rotate-12 fill-blush-200 text-wood" />
            </h1>
            <p className="mt-5 max-w-[380px] font-hand text-[19px] leading-snug tracking-wide text-muted sm:text-[21px]">
              Soft crochet friends, bags and little home joys — each one stitched slowly by hand, just for you.
            </p>
            <div className="mt-7 flex items-center gap-4">
              <Link href="/shop" className="btn-primary group px-8">
                Shop Now <ArrowRight size={18} className="arrow-nudge" />
              </Link>
              <CurvyArrow size={70} className="hidden -scale-x-100 rotate-[200deg] text-sage-700 sm:block" />
            </div>
            <div className="mt-8 flex items-center gap-3 text-[13px] text-muted">
              <span className="flex -space-x-2">
                {["bg-blush-200", "bg-cream-200", "bg-sage-100"].map((c) => (
                  <span key={c} className={`h-8 w-8 rounded-pill border-2 border-cream-50 ${c}`} />
                ))}
              </span>
              <span>
                <b className="font-logo text-sage-900">2,400+</b> happy homes across Pakistan
              </span>
            </div>
          </div>

          <div className="relative mt-2 lg:mt-6 lg:flex-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-cream-200 shadow-soft lg:aspect-[5/4] lg:rounded-[36px]">
              <Image
                src={photos.hero}
                alt="A handmade crochet teddy bear sitting beside a cup of coffee"
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <YarnBall size={74} className="floaty absolute -bottom-6 -left-3 hidden text-wood sm:block" />
            <PinnedNote className="absolute -top-4 right-3 sm:right-8">good things are handmade ♡</PinnedNote>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Shop by category */}
        <section aria-labelledby="cat-title" className="mt-16 lg:mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="cat-title" className="section-title flex items-center gap-2">
              Shop by Category <Sparkle size={28} className="text-wood" />
            </h2>
            <Link href="/shop" className="btn-ghost group shrink-0">
              Explore All <ArrowRight size={17} className="arrow-nudge" />
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
            {categories.slice(0, 5).map((c, i) => (
              <CategoryCard key={c.slug} category={c} index={i} />
            ))}
          </div>
        </section>

        {/* Bestsellers */}
        <section id="bestsellers" aria-labelledby="best-title" className="mt-16 scroll-mt-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="best-title" className="section-title flex items-center gap-2">
              Bestsellers <Heart size={26} className="fill-blush-200 text-wood" />
            </h2>
            <Link href="/shop" className="btn-ghost group shrink-0">
              View all <ArrowRight size={17} className="arrow-nudge" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>

        {/* Custom orders */}
        <section id="custom" aria-labelledby="custom-title" className="mt-20 scroll-mt-6">
          <div className="relative grid items-center gap-8 overflow-hidden rounded-[28px] bg-blush-100 p-5 shadow-soft sm:p-8 md:grid-cols-2 lg:p-12">
            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <figure className="-rotate-3 rounded-[16px] bg-cream-50 p-2 pb-1 shadow-soft">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[12px]">
                  <Image src={photos.sketch} alt="A crochet pattern sketch with yarn and a hook" fill unoptimized sizes="(min-width: 768px) 20vw, 40vw" className="object-cover" />
                </div>
                <figcaption className="py-1.5 text-center font-hand text-[15px] text-sage-900">your idea</figcaption>
              </figure>
              <CurvyArrow size={56} className="text-sage-700" />
              <figure className="rotate-3 rounded-[16px] bg-cream-50 p-2 pb-1 shadow-soft">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[12px]">
                  <Image src={photos.finished} alt="A finished crochet bunny next to flowers" fill unoptimized sizes="(min-width: 768px) 20vw, 40vw" className="object-cover" />
                </div>
                <figcaption className="py-1.5 text-center font-hand text-[15px] text-sage-900">our stitches</figcaption>
              </figure>
            </div>
            <div>
              <HandwrittenAside className="mb-2 text-wood">dream it, we&apos;ll hook it</HandwrittenAside>
              <h2 id="custom-title" className="section-title">Have something special in mind?</h2>
              <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-muted">
                Send us a sketch, a photo or just an idea — a mini version of your pet, a bag in your colours, a name on
                a teddy. We&apos;ll share a quote and a little preview before we start.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappLink("Hi! I'd like to order a custom piece.")} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                  Order a custom piece <ArrowRight size={18} className="arrow-nudge" />
                </a>
                <a href={whatsappLink("Hi! I have a question about custom orders.")} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <WhatsAppIcon size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
            <Star size={26} className="absolute right-6 top-6 text-wood" />
          </div>
        </section>

        {/* Our story */}
        <section id="story" aria-labelledby="story-title" className="mt-20 grid scroll-mt-6 items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] rounded-tl-[90px] bg-sage-100 shadow-soft">
              <Image
                src={photos.maker}
                alt={`Hands crocheting with a hook — ${brand.maker.name} at work on a new piece`}
                fill
                unoptimized
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover"
              />
            </div>
            <Sprig size={58} className="absolute -right-4 -top-4 text-sage-600" />
            <PinnedNote className="absolute -bottom-6 -left-2 -rotate-3 sm:-left-6">since 2021, one loop at a time</PinnedNote>
          </div>
          <div>
            <p className="font-hand text-[18px] tracking-wide text-wood">meet the maker</p>
            <h2 id="story-title" className="section-title">Hi, I&apos;m {brand.maker.name} ♡</h2>
            <div className="mt-4 max-w-[520px] space-y-3 text-[15px] leading-relaxed text-muted">
              <p>
                {brand.name} started on a rainy afternoon with one hook, one ball of yarn and a very wonky bunny. Today
                it&apos;s a tiny studio where every toy, bag and bouquet is still made by hand, one stitch at a time.
              </p>
              <p>
                I choose soft cotton yarns that are safe for babies and kind to the planet, and I check every piece
                twice before it&apos;s wrapped. Slight differences are part of the charm — no two are exactly alike.
              </p>
            </div>
            <p className="mt-6 -rotate-2 font-hand text-[30px] text-sage-900">— {brand.maker.name}</p>
          </div>
        </section>

        {/* Reviews */}
        <section aria-labelledby="reviews-title" className="mt-24">
          <div className="mb-8 text-center">
            <p className="font-hand text-[18px] tracking-wide text-wood">kind words</p>
            <h2 id="reviews-title" className="section-title inline-flex items-center gap-2">
              Little notes from happy homes <Heart size={26} className="text-wood" />
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <figure
                key={r.name}
                className={`relative rounded-card bg-cream-200 p-6 shadow-soft ${i === 1 ? "md:-translate-y-3 md:rotate-1" : "md:-rotate-1"}`}
              >
                <span className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <StarIcon key={k} size={15} className="fill-wood text-wood" />
                  ))}
                </span>
                <blockquote className="mt-3 text-[15px] leading-relaxed text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-4 font-hand text-[19px] tracking-wide text-sage-900">
                  {r.name} <span className="text-[15px] text-muted">· {r.city}</span>
                </figcaption>
                <Heart size={20} className="absolute right-5 top-5 text-blush-200" />
              </figure>
            ))}
          </div>
        </section>
      </main>

      <WhyUs />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Instagram + newsletter */}
        <section aria-labelledby="insta-title" className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="insta-title" className="section-title flex items-center gap-2">
              @{brand.instagram}
            </h2>
            <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noopener noreferrer" className="btn-ghost group">
              <InstagramIcon size={18} /> Follow along <ArrowRight size={17} className="arrow-nudge" />
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
            {photos.instagram.map((src, i) => (
              <a
                key={src}
                href={`https://instagram.com/${brand.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram post ${i + 1}`}
                className="group relative aspect-square overflow-hidden rounded-card bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
              >
                <Image src={src} alt="" fill unoptimized sizes="(min-width: 1024px) 16vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-sage-900/0 text-cream-50 opacity-0 transition group-hover:bg-sage-900/30 group-hover:opacity-100">
                  <Heart size={30} />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 rounded-[28px] bg-cream-100 px-5 py-10 text-center">
            <Heart size={28} className="fill-blush-200 text-wood" />
            <h3 className="font-hand text-[30px] leading-tight text-sage-900 sm:text-[36px]">Join the cozy club</h3>
            <p className="max-w-[420px] text-[15px] text-muted">
              New drops, behind-the-hook stories and a little 10% welcome gift. No spam, only soft things.
            </p>
            <Newsletter />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
