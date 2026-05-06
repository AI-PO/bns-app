"use client";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { RevealOnView, SectionEyebrow } from "@/common/components/bn";

export const FinalCTA = () => (
  <section id="cta" className="relative bg-bn-bg text-bn-text py-20 md:py-36 overflow-hidden">
    <div aria-hidden className="absolute inset-0 bn-grid-dark bn-grid-fade pointer-events-none opacity-60" />
    <div aria-hidden className="absolute inset-0 bn-orange-glow opacity-80 pointer-events-none" />
    <div className="relative mx-auto max-w-[720px] px-5 lg:px-10 text-center">
      <RevealOnView className="mb-8 flex justify-center">
        <SectionEyebrow chapter="06" label="Get started" tone="dark" />
      </RevealOnView>
      <RevealOnView delay={0.05}>
        <h2 className="bn-section-title text-bn-text mb-5">
          Your name. On Bitcoin. <span className="text-bn-accent">Forever.</span>
        </h2>
      </RevealOnView>
      <RevealOnView delay={0.12}>
        <p className="bn-sub text-bn-text-2 mb-12 max-w-[520px] mx-auto">
          Create an account or log in to search, buy and manage your .btc name on Bitcoin.
        </p>
      </RevealOnView>
      <RevealOnView delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login"
            className="inline-flex items-center justify-center gap-2 bg-bn-accent text-white font-medium text-[15px] px-8 py-4 rounded-full hover:bg-bn-accent-hover transition-colors shadow-[0_8px_24px_-8px_rgba(247,147,26,0.6)]">
            Get started free <ArrowRight weight="bold" size={16} />
          </Link>
          <Link href="/app/marketplace"
            className="inline-flex items-center justify-center bg-white/10 text-white font-medium text-[15px] px-8 py-4 rounded-full hover:bg-white/15 transition-colors border border-white/20">
            Browse marketplace
          </Link>
        </div>
        <p className="mt-5 text-[13px] text-bn-text-muted">No wallet required to sign up · Connect when you&apos;re ready to buy</p>
      </RevealOnView>
    </div>
  </section>
);
