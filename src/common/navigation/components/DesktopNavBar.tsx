"use client";

import { m, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { WalletAccount } from "@/providers/walletContext";
import { WalletConnection } from "./WalletConnection";

export const DesktopNavBar: React.FC<{ account: WalletAccount | null }> = ({ account }) => {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.85)"]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <m.div
      style={{ backgroundColor: bg }}
      className="relative w-full h-[68px] px-5 lg:px-10 flex items-center justify-between text-bn-ink backdrop-blur-xl"
    >
      <m.div style={{ opacity: borderOpacity }} aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-bn-line" />

      <nav className="flex items-center gap-x-8">
        <Link href="/" className="flex-shrink-0">
          <Image src="/navbar_logo.svg" height={31} width={122} alt="Bitcoin Names" className="h-[38px] w-auto" />
        </Link>
        <Link href="/marketplace" className="text-[14px] font-medium text-bn-ink-2 hover:text-bn-ink transition-colors">
          Marketplace
        </Link>
        {account?.address && (
          <Link href="/register" className="text-[14px] font-medium text-bn-ink-2 hover:text-bn-ink transition-colors">
            Register
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-x-3">
        {account?.address ? (
          <Link href="/profile" className="text-[14px] font-medium text-bn-ink-2 hover:text-bn-ink transition-colors">
            My Names
          </Link>
        ) : (
          <span className="text-[13px] text-bn-ink-muted hidden lg:block">
            Connect wallet to buy &amp; manage names
          </span>
        )}
        <WalletConnection />
      </div>
    </m.div>
  );
};
