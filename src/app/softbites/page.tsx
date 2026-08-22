"use client";

import { useState } from "react";
import Image from "next/image";
import { InstagramIcon as Instagram } from "@/components/brand-icons";
import { MessageCircle, MapPin, Truck, Clock, Leaf, Heart, Star } from "lucide-react";
import Link from "next/link";

const products = [
  {
    name: "Chocolate Chip",
    chinese: "巧克力曲奇",
    price: "RM 35",
    description: "Classic soft & chewy with premium Belgian chocolate chips",
    tag: "Bestseller",
    rating: 5,
  },
  {
    name: "Matcha White Choc",
    chinese: "抹茶白巧克力",
    price: "RM 38",
    description: "Premium Uji matcha with creamy white chocolate chunks",
    tag: "Popular",
    rating: 5,
  },
  {
    name: "Lotus Biscoff",
    chinese: "焦糖饼干",
    price: "RM 38",
    description: "Loaded with Biscoff spread and cookie crumbles",
    tag: null,
    rating: 4,
  },
  {
    name: "Red Velvet",
    chinese: "红丝绒奶酪",
    price: "RM 40",
    description: "Rich red velvet with cream cheese frosting center",
    tag: "New",
    rating: 5,
  },
  {
    name: "Salted Caramel",
    chinese: "焦糖布朗尼",
    price: "RM 42",
    description: "Fudgy brownie cookies with sea salt caramel swirl",
    tag: null,
    rating: 4,
  },
];

const features = [
  { icon: Truck, title: "KL Delivery", desc: "Klang Valley wide" },
  { icon: Leaf, title: "Halal Certified", desc: "100% halal ingredients" },
  { icon: Clock, title: "Made Fresh", desc: "Baked to order" },
  { icon: Heart, title: "Less Sweet", desc: "Perfect balance" },
];

export default function SoftbitesPage() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-md bg-white/60 border-b border-white/50 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-amber-800/70 hover:text-amber-900 transition-colors"
          >
            &larr; Back
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/softbites-logo.jpg"
              alt="Softbites Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-semibold text-amber-900 tracking-wide">Softbites</span>
          </div>
          <a
            href="https://instagram.com/softbites_my"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors text-amber-800"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glass card hero */}
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
            <Image
              src="/softbites-logo.jpg"
              alt="Softbites Logo"
              width={120}
              height={120}
              className="rounded-full mx-auto mb-6 shadow-lg"
            />
            <p className="text-amber-700 text-sm tracking-widest uppercase mb-4">
              Handcrafted in Kuala Lumpur
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-amber-950 mb-2">Softbites</h1>
            <p className="text-2xl md:text-3xl text-amber-800/80 mb-2 font-light">云酥</p>
            <p className="text-xl md:text-2xl text-amber-800 mt-6 font-light">
              Soft-Baked Cookies, But Better
            </p>
            <p className="text-amber-700/70 mt-4 max-w-md mx-auto">
              Premium ingredients. No preservatives. Made fresh to order.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <a
                href="#menu"
                className="px-8 py-3 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors shadow-lg hover:shadow-xl font-medium"
              >
                View Menu
              </a>
              <a
                href="https://instagram.com/softbites_my"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white/60 backdrop-blur text-amber-900 rounded-full hover:bg-white/80 transition-colors border border-amber-200 font-medium flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                Order Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-white/50 rounded-2xl p-6 text-center border border-white/50 hover:bg-white/70 transition-all hover:scale-105"
            >
              <feature.icon className="w-8 h-8 mx-auto text-amber-700 mb-3" />
              <h3 className="font-semibold text-amber-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-amber-700/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / Founder */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-xl bg-white/50 rounded-3xl p-8 md:p-10 border border-white/50 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-950 mb-6 text-center">Our Story</h2>
            <p className="text-amber-800/80 leading-relaxed text-center mb-8">
              Born from a passion for creating the perfect cookie — soft on the inside, slightly
              crisp on the edges, and packed with premium ingredients. Every batch is made fresh to
              order, ensuring you get that just-out-of-the-oven experience.
            </p>

            {/* Founder Card */}
            <a
              href="https://www.instagram.com/sbhknn.im_voonhui/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur border border-white/50 hover:bg-white/80 transition-all mx-auto max-w-xs group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-2xl shadow-inner">
                👩‍🍳
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-900">VoonHui</p>
                <p className="text-sm text-amber-700/70">Founder & Head Baker</p>
              </div>
              <Instagram className="w-5 h-5 text-amber-400 group-hover:text-pink-500 transition-colors" />
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="menu" className="relative z-10 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-950 mb-2">Our Cookies</h2>
            <p className="text-amber-700/70">Box of 6 pieces • Made fresh to order</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="group backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onMouseEnter={() => setHoveredProduct(index)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Tag */}
                {product.tag && (
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full mb-4 font-medium ${
                      product.tag === "Bestseller"
                        ? "bg-amber-500 text-white"
                        : product.tag === "New"
                          ? "bg-emerald-500 text-white"
                          : product.tag === "Popular"
                            ? "bg-rose-400 text-white"
                            : "bg-amber-200 text-amber-800"
                    }`}
                  >
                    {product.tag}
                  </span>
                )}

                {/* Cookie visual */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                  🍪
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-amber-950 text-center">{product.name}</h3>
                <p className="text-sm text-amber-600 text-center mb-2">{product.chinese}</p>

                {/* Rating */}
                <div className="flex justify-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? "text-amber-400 fill-amber-400" : "text-amber-200"}`}
                    />
                  ))}
                </div>

                <p className="text-sm text-amber-700/70 text-center mb-4">{product.description}</p>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                  <span className="text-xl font-bold text-amber-900">{product.price}</span>
                  <Heart
                    className={`w-5 h-5 transition-all cursor-pointer ${
                      hoveredProduct === index
                        ? "text-rose-500 fill-rose-500 scale-110"
                        : "text-amber-300"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-amber-950 mb-2">Follow Us</h2>
            <a
              href="https://instagram.com/softbites_my"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-amber-700 hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @softbites_my
            </a>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {["🍪", "🎁", "🍫", "🥛", "✨", "💝"].map((emoji, index) => (
              <a
                key={index}
                href="https://instagram.com/softbites_my"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square backdrop-blur-lg bg-white/50 rounded-xl flex items-center justify-center text-3xl md:text-4xl border border-white/50 hover:bg-white/70 hover:scale-105 transition-all"
              >
                {emoji}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Order CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-lg mx-auto">
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 md:p-10 text-center border border-white/50 shadow-xl">
            <Image
              src="/softbites-logo.jpg"
              alt="Softbites Logo"
              width={80}
              height={80}
              className="rounded-full mx-auto mb-4 shadow-md"
            />
            <h2 className="text-2xl font-bold text-amber-950 mb-2">Ready to Order?</h2>
            <p className="text-amber-700/70 mb-8">
              DM us on Instagram or WhatsApp to place your order.
              <br />
              We deliver within Klang Valley!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://instagram.com/softbites_my"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-lg"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              <a
                href="https://wa.me/60123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors font-medium shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-amber-600">
              <MapPin className="w-4 h-4" />
              Kuala Lumpur, Malaysia
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 backdrop-blur-md bg-white/40 border-t border-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/softbites-logo.jpg"
              alt="Softbites Logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="font-semibold text-amber-900">Softbites 云酥</span>
          </div>
          <p className="text-sm text-amber-700/60 mb-4">Handcrafted with love in Kuala Lumpur</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://instagram.com/softbites_my"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors text-amber-700 hover:text-pink-500"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-amber-600/50 mt-6">
            &copy; {new Date().getFullYear()} Softbites. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
