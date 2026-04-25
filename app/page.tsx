"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search, User, ShoppingCart, Star, ChevronRight, ChevronLeft,
  Check, Instagram, Facebook, MessageCircle, Heart, Paintbrush, Plus, Minus
} from "lucide-react"

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  category: string
  brand: string
  stars: number
}

interface CartItem extends Product {
  qty: number
}

interface ToastData {
  message: string
  type: "success" | "error" | "info"
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1, name: "Coral Rende Muito 18L", price: 259.90, imageUrl: "https://images.tcdn.com.br/img/img_prod/650361/tinta_acrilica_fosco_completo_coral_branco_18l_4025_1_20200422151912.jpg", category: "Tintas", brand: "Coral", stars: 5 },
  { id: 2, name: "Suvinil Cor & Proteção 18L", price: 289.90, imageUrl: "https://m.media-amazon.com/images/I/61kJlFbPaoL._AC_SX679_.jpg", category: "Tintas", brand: "Suvinil", stars: 5 },
  { id: 3, name: "Rolo de Pintura 23cm Atlas", price: 19.80, imageUrl: "https://images.tcdn.com.br/img/img_prod/650361/rolo_de_la_para_pintura_atlas_15cm_4025_1_20200422151912.jpg", category: "Ferramentas para Pintura", brand: "Atlas", stars: 4 },
  { id: 4, name: "Acabamento Iquine 3,6L", price: 205.90, imageUrl: "https://cdn.awsli.com.br/2500x2500/1869/1869036/produto/153855114/3ca522bacc.jpg", category: "Tintas", brand: "Iquine", stars: 4 },
  { id: 5, name: "Tinta PU Automotiva Preto 3,6L", price: 189.90, imageUrl: "https://tse4.mm.bing.net/th/id/OIP.4zWZc9f3nS2uR6pTj6m0UQHaHa", category: "Tintas", brand: "Coral", stars: 5 },
  { id: 6, name: "Primer PU Cinza 3,6L", price: 149.90, imageUrl: "https://tse3.mm.bing.net/th/id/OIP.qO6MysNn7M8jYzY2wqKz6QHaHa", category: "Impermeabilizante", brand: "Suvinil", stars: 4 },
  { id: 7, name: "Verniz PU Alto Brilho 900ml", price: 59.90, imageUrl: "https://cdn.awsli.com.br/600x700/1347/1347540/produto/53873337/thinner-900ml-anjo.jpg", category: "Sprays", brand: "Natrielli", stars: 5 },
  { id: 8, name: "Esmalte Sintético Branco 3,6L", price: 89.90, imageUrl: "https://m.media-amazon.com/images/I/5156f0sCGDL._AC_SX679_.jpg", category: "Tintas", brand: "Sherwin-Williams", stars: 5 },
]

const CATEGORIES = [
  { name: "Tintas", icon: "🪣" },
  { name: "Ferramentas para Pintura", icon: "🖌️" },
  { name: "Impermeabilizante", icon: "💧" },
  { name: "Sprays", icon: "🔵" },
  { name: "Outros", icon: "➕" },
]

const BRANDS = [
  { name: "Coral", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Coral_Tintas_Logo.svg/320px-Coral_Tintas_Logo.svg.png" },
  { name: "Indutil", logo: null },
  { name: "Sherwin-Williams", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sherwin-Williams_logo.svg/320px-Sherwin-Williams_logo.svg.png" },
  { name: "Suvinil", logo: null },
  { name: "Natrielli", logo: null },
  { name: "PPG", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/PPG_Industries_logo.svg/320px-PPG_Industries_logo.svg.png" },
]

const HERO_SLIDES = [
  { bg: "#1a1464", image: "https://images.tcdn.com.br/img/img_prod/650361/tinta_acrilica_fosco_completo_coral_branco_18l_4025_1_20200422151912.jpg", brand: "Coral", title: "renova", sub: "Creme de Pintura" },
  { bg: "#0d4a1a", image: "https://m.media-amazon.com/images/I/61kJlFbPaoL._AC_SX679_.jpg", brand: "Suvinil", title: "Cor & Proteção", sub: "Interior e Exterior" },
]

const fmt = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`

const StarRow = ({ count = 5, size = 12 }: { count?: number; size?: number }) => (
  <div style={{ display: "flex", gap: 1 }}>
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < count ? "#f59e0b" : "#d1d5db", fontSize: size }}>★</span>
    ))}
  </div>
)

// ─── AUTH UTILS ──────────────────────────────────────────────────────────────

const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("silver-user") !== null
}

// ─── HEADER ──────────────────────────────────────────────────────────────────

interface HeaderProps {
  cartCount: number
  onCartOpen: () => void
  onGoHome: () => void
  onGoCor: () => void
}

// ✅ JSX corrigido: todas as divs fechadas corretamente
const Header = ({ cartCount, onCartOpen, onGoHome, onGoCor }: HeaderProps) => (
  <header style={{ background: "#1a1464", padding: "10px 16px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Hamburger */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, cursor: "pointer" }}>
        <div style={{ width: 18, height: 2, background: "white" }} />
        <div style={{ width: 18, height: 2, background: "white" }} />
        <div style={{ width: 18, height: 2, background: "white" }} />
      </div>

      {/* Logo */}
      <div onClick={onGoHome} style={{ cursor: "pointer" }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: "white", lineHeight: 1, letterSpacing: "-1px" }}>Silver</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>tintas</div>
      </div>{/* ✅ div da logo fechada aqui */}

      {/* Search box */}
      <div style={{ flex: 1, background: "white", borderRadius: 4, display: "flex", alignItems: "center", padding: "5px 10px", gap: 6 }}>
        <Search size={14} color="#999" />
        <span style={{ fontSize: 12, color: "#bbb" }}>buscar...</span>
      </div>

      {/* Icons */}
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <button
          onClick={onGoCor}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "4px 10px", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
        >
          <Paintbrush size={12} />
          Cor
        </button>

        <User
          size={20}
          color="white"
          style={{ cursor: "pointer" }}
          onClick={() => { if (typeof window !== "undefined") window.location.href = "/login" }}
        />

        <div style={{ position: "relative", cursor: "pointer" }} onClick={onCartOpen}>
          <ShoppingCart size={20} color="white" />
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -6, right: -6, background: "#e53e3e", color: "white", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>{/* ✅ div icons fechada */}
    </div>{/* ✅ div flex principal fechada */}
  </header>
)

// ─── HERO CAROUSEL ────────────────────────────────────────────────────────────

// ✅ Divs internas do carousel fechadas corretamente
const HeroCarousel = () => {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 3500)
    return () => clearInterval(t)
  }, [])

  const slide = HERO_SLIDES[idx]

  return (
    <div style={{ position: "relative", background: slide.bg, overflow: "hidden", minHeight: 200, display: "flex", alignItems: "center", transition: "background 0.5s" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${slide.bg} 40%, rgba(255,255,255,0.05) 100%)` }} />

      {/* Texto */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, padding: "20px 16px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{slide.brand}</div>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 36, fontWeight: 900, color: "white", lineHeight: 1 }}>{slide.title}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{slide.sub}</div>
      </div>{/* ✅ div texto fechada */}

      {/* Imagem */}
      <div style={{ position: "relative", zIndex: 2, padding: "10px 10px 10px 0" }}>
        <img src={slide.image} alt={slide.title} style={{ height: 160, width: 130, objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }} />
      </div>{/* ✅ div imagem fechada */}

      {/* Controles */}
      <button onClick={() => setIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3 }}>
        <ChevronLeft size={16} color="white" />
      </button>
      <button onClick={() => setIdx(i => (i + 1) % HERO_SLIDES.length)}
        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3 }}>
        <ChevronRight size={16} color="white" />
      </button>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 3 }}>
        {HERO_SLIDES.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, background: i === idx ? "white" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  )
}

// ─── CATEGORIES GRID ─────────────────────────────────────────────────────────

// ✅ Fechamento do componente corrigido (removido o comentário //</div> mal posicionado)
const CategoriesGrid = ({ onCategoryClick }: { onCategoryClick: (cat: string) => void }) => (
  <div style={{ background: "white", padding: "20px 16px" }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 16, color: "#222" }}>O que procura?</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {CATEGORIES.map(cat => (
        <div key={cat.name} onClick={() => onCategoryClick(cat.name)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "#e8ecf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {cat.icon}
          </div>
          <span style={{ fontSize: 9, color: "#444", textAlign: "center", fontWeight: 600, textTransform: "uppercase", lineHeight: 1.2 }}>{cat.name}</span>
        </div>
      ))}
    </div>
  </div>
)

// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────
// ✅ Componente que estava faltando — adicionado para evitar crash

const FeaturedProducts = ({ onAdd, favorites, onToggleFavorite }: { onAdd: (p: Product) => void; favorites: number[]; onToggleFavorite: (id: number) => void }) => {
  const featured = PRODUCTS.slice(0, 4)
  return (
    <div style={{ background: "#f7f8fc", padding: "20px 16px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1464", marginBottom: 16 }}>Destaques</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {featured.map(p => (
          <div key={p.id} style={{ background: "white", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ background: "#f9fafb", padding: 10, position: "relative", textAlign: "center" }}>
              <img src={p.imageUrl} alt={p.name} style={{ height: 100, width: "100%", objectFit: "contain" }} />
              <button onClick={() => onToggleFavorite(p.id)}
                style={{ position: "absolute", top: 8, right: 8, background: favorites.includes(p.id) ? "#ef4444" : "white", border: "1px solid #ddd", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Heart size={14} color={favorites.includes(p.id) ? "white" : "#999"} fill={favorites.includes(p.id) ? "white" : "none"} />
              </button>
            </div>
            <div style={{ padding: "10px 10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1a1464", marginBottom: 2 }}>{p.brand}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#333", lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
              <StarRow count={p.stars} />
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1464", margin: "6px 0 8px" }}>{fmt(p.price)}</div>
              <button onClick={() => onAdd(p)} style={{ width: "100%", background: "#1a1464", color: "white", border: "none", borderRadius: 6, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                COMPRAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
// ✅ Componente que estava faltando — adicionado para evitar crash

const CategorySection = ({ onCategoryClick }: { onCategoryClick: (cat: string) => void }) => (
  <div style={{ background: "white", padding: "20px 16px" }}>
    <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1464", marginBottom: 12 }}>Categorias</h2>
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
      {CATEGORIES.map(cat => (
        <button key={cat.name} onClick={() => onCategoryClick(cat.name)}
          style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 20, border: "1px solid #d1d5db", background: "white", color: "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  </div>
)

// ─── STORE BANNER ─────────────────────────────────────────────────────────────

const StoreBanner = () => (
  <div style={{ display: "flex", background: "#f7f8fc", overflow: "hidden" }}>
    <div style={{ flex: 1, minHeight: 140, background: "#1a88d4", position: "relative", overflow: "hidden" }}>
      <img
        src="https://lh5.googleusercontent.com/p/AF1QipME5Ys4k0HB0q2f4I1H3HlFEXVFhqNGTTNGMJg=w426-h240-k-no"
        alt="Loja Silver Tintas"
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        onError={e => { (e.target as HTMLImageElement).style.display = "none" }} // ✅ cast correto
      />
    </div>
    <div style={{ flex: 1.2, background: "#1a1464", padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 8, lineHeight: 1.2 }}>conheça nossa<br />loja física</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
        Av. Arymana, 299B · Parque Universitário de Viracopos<br />
        Campinas – SP, 13056-464
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 600 }}>
        Telefone: (19) 3266-0789
      </div>
    </div>
  </div>
)

// ─── COLOR BANNER ─────────────────────────────────────────────────────────────

const ColorBanner = ({ setPage }: { setPage: (p: string) => void }) => (
  <div style={{ margin: "0 12px 16px", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", background: "#f0f4ff", position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", padding: "16px 14px", gap: 12 }}>
      <div style={{ width: 70, height: 70, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          {[
            { color: "#e53e3e", d: "M50,50 L50,10 A40,40 0 0,1 84,30 Z" },
            { color: "#ed8936", d: "M50,50 L84,30 A40,40 0 0,1 90,50 Z" },
            { color: "#ecc94b", d: "M50,50 L90,50 A40,40 0 0,1 84,70 Z" },
            { color: "#48bb78", d: "M50,50 L84,70 A40,40 0 0,1 50,90 Z" },
            { color: "#38b2ac", d: "M50,50 L50,90 A40,40 0 0,1 16,70 Z" },
            { color: "#4299e1", d: "M50,50 L16,70 A40,40 0 0,1 10,50 Z" },
            { color: "#805ad5", d: "M50,50 L10,50 A40,40 0 0,1 16,30 Z" },
            { color: "#e53e3e", d: "M50,50 L16,30 A40,40 0 0,1 50,10 Z" },
          ].map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
          <circle cx="50" cy="50" r="12" fill="white" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1464", lineHeight: 1.2, marginBottom: 4 }}>escolha a cor ideal para seu ambiente</div>
        <div style={{ fontSize: 10, color: "#666", marginBottom: 8 }}>Sua criatividade começa aqui, explore nossas cores.</div>
        <button onClick={() => setPage("cor")}
          style={{ background: "#1a1464", color: "white", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          Explorar <ChevronRight size={12} />
        </button>
      </div>
    </div>
    <div style={{ background: "#dbeafe", padding: "6px 14px", fontSize: 10, color: "#1e40af" }}>
      📸 @silverpintura
    </div>
  </div>
)

// ─── BRANDS SECTION ───────────────────────────────────────────────────────────

const BrandsSection = () => (
  <div style={{ background: "white", padding: "20px 16px 24px" }}>
    <h2 style={{ fontSize: 16, fontWeight: 800, textAlign: "center", marginBottom: 16, color: "#222", letterSpacing: 1, textTransform: "uppercase" }}>Procure por Marcas</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {BRANDS.map(brand => (
        <div key={brand.name}
          style={{ border: "1px solid #e5e7eb", borderRadius: 8, height: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", cursor: "pointer", background: "white" }}>
          {brand.logo ? (
            <img src={brand.logo} alt={brand.name} style={{ maxHeight: 30, maxWidth: "100%", objectFit: "contain" }}
              onError={e => {
                const img = e.target as HTMLImageElement       // ✅ cast correto
                img.style.display = "none"
                const sibling = img.nextSibling as HTMLElement | null
                if (sibling) sibling.style.display = "block"
              }} />
          ) : null}
          <span style={{ fontSize: 11, fontWeight: 700, color: "#333", display: brand.logo ? "none" : "block" }}>{brand.name}</span>
        </div>
      ))}
    </div>
  </div>
)

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer style={{ background: "#1a1464", color: "white", padding: "24px 16px 16px" }}>
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: "white" }}>Silver</div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>Qualidade que você confia</div>
    </div>
    <div style={{ display: "flex", gap: 14, margin: "14px 0" }}>
      <a href="https://wa.me/5519326607089" target="_blank" rel="noreferrer" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none" }}>
        <MessageCircle size={16} color="white" />
      </a>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Instagram size={16} color="white" />
      </div>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Facebook size={16} color="white" />
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Institucional</div>
        {["Sobre nós", "Loja", "Contato"].map(l => (
          <div key={l} style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 5, cursor: "pointer" }}>{l}</div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Atendimento</div>
        {["Central de ajuda", "Política de trocas", "Envio e entregas"].map(l => (
          <div key={l} style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 5, cursor: "pointer" }}>{l}</div>
        ))}
      </div>
    </div>
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
      © 2026 Silver Tintas · Av. Arymana, 299B · Campinas – SP · (19) 3266-0789
    </div>
  </footer>
)

// ─── WHATSAPP FAB ─────────────────────────────────────────────────────────────

// ─── WHATSAPP FAB ─────────────────────────────────────────────────────────────

const WhatsAppFAB = () => (
  <a  /* ✅ tag <a estava faltando */
    href="https://wa.me/551932660789?text=Olá! Gostaria de mais informações."
    target="_blank"
    rel="noreferrer"
    style={{ position: "fixed", bottom: 20, right: 16, width: 52, height: 52, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,211,102,0.5)", zIndex: 200, textDecoration: "none" }}>
    <MessageCircle size={26} color="white" fill="white" />
  </a>
)

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────

const ProductsPage = ({ onAdd, favorites, onToggleFavorite }: { onAdd: (p: Product) => void; favorites: number[]; onToggleFavorite: (id: number) => void }) => {
  const [selCat, setSelCat] = useState("Todos")
  const filtered = selCat === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === selCat)
  const cats = ["Todos", ...CATEGORIES.map(c => c.name)]

  return (
    <div style={{ background: "#f7f8fc", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1464", marginBottom: 12 }}>Produtos</h1>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setSelCat(cat)}
              style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: selCat === cat ? "none" : "1px solid #d1d5db", background: selCat === cat ? "#1a1464" : "white", color: selCat === cat ? "white" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "white", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ background: "#f9fafb", padding: 10, position: "relative", textAlign: "center" }}>
              <img src={p.imageUrl} alt={p.name} style={{ height: 110, width: "100%", objectFit: "contain" }} />
              <button onClick={() => onToggleFavorite(p.id)}
                style={{ position: "absolute", top: 8, right: 8, background: favorites.includes(p.id) ? "#ef4444" : "white", border: "1px solid #ddd", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Heart size={14} color={favorites.includes(p.id) ? "white" : "#999"} fill={favorites.includes(p.id) ? "white" : "none"} />
              </button>
            </div>
            <div style={{ padding: "10px 10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1a1464", marginBottom: 2 }}>{p.brand}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#333", lineHeight: 1.3, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.name}</div>
              <StarRow count={p.stars} />
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1464", margin: "6px 0 8px" }}>{fmt(p.price)}</div>
              <button onClick={() => onAdd(p)}
                style={{ width: "100%", background: "#1a1464", color: "white", border: "none", borderRadius: 6, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                COMPRAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── COLOR PAGE ───────────────────────────────────────────────────────────────

const ColorPage = () => {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    if (!code) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setResult(`Cor encontrada para ${code}: Preto Metálico`) }, 1200)
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "linear-gradient(135deg, #1a1464 0%, #2a52be 100%)", borderRadius: 12, padding: "20px 16px", marginBottom: 16, color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Paintbrush size={24} color="#fbbf24" />
          <div style={{ fontSize: 18, fontWeight: 800 }}>Consultar Cor</div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Digite o código da peça do veículo para encontrar a tinta correta.</p>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: "#333", display: "block", marginBottom: 8 }}>Código da cor</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Ex: NH731P"
            style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }} />
          <button onClick={handleSearch}
            style={{ background: "#1a1464", color: "white", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "..." : "Buscar"}
          </button>
        </div>
        {result && (
          <div style={{ marginTop: 12, padding: 12, background: "#ecfdf5", border: "1px solid #86efac", borderRadius: 8, fontSize: 13, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={18} /> {result}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── CART MODAL ───────────────────────────────────────────────────────────────

const CartModal = ({ cart, onClose, onRemove, onChangeQty, onCheckout }: {
  cart: CartItem[]
  onClose: () => void
  onRemove: (id: number) => void
  onChangeQty: (id: number, delta: number) => void
  onCheckout: () => void
}) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "white", width: "100%", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1464" }}>Carrinho</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999" }}>×</button>
        </div>
        {cart.length === 0 ? <p style={{ color: "#999", textAlign: "center", padding: 24 }}>Carrinho vazio</p> : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: 52, height: 52, objectFit: "contain" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#1a1464", fontWeight: 700 }}>{fmt(item.price)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <button onClick={() => onChangeQty(item.id, -1)} style={{ width: 24, height: 24, border: "1px solid #d1d5db", borderRadius: 4, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={12} /></button>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id, 1)} style={{ width: 24, height: 24, border: "1px solid #d1d5db", borderRadius: 4, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, padding: "12px 0", borderTop: "2px solid #e5e7eb" }}>
              <span>Total</span><span style={{ color: "#1a1464" }}>{fmt(subtotal)}</span>
            </div>
            <button onClick={onCheckout}
              style={{ width: "100%", background: "#1a1464", color: "white", border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 4 }}>
              FINALIZAR COMPRA
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [onClose])
  const bg = type === "success" ? "#059669" : type === "error" ? "#dc2626" : "#1a1464"
  return (
    <div style={{ position: "fixed", top: 70, right: 12, background: bg, color: "white", padding: "10px 16px", borderRadius: 10, zIndex: 400, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8, maxWidth: 280 }}>
      <Check size={16} />{message}
    </div>
  )
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────

export default function App() {
  const router = useRouter()
  const [page, setPage] = useState("home")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [toast, setToast] = useState<ToastData | null>(null)

  const showToast = useCallback((message: string, type: ToastData["type"] = "success") => setToast({ message, type }), [])

  const addToCart = useCallback((p: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id)
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }]
    })
    showToast(`${p.name} adicionado!`)
  }, [showToast])

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(i => i.id !== id))
    showToast("Removido do carrinho", "error")
  }, [showToast])

  const changeQty = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }, [])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const goToCategory = (_cat: string) => { setPage("produtos") }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ✅ Props corretas passadas ao Header */}
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onGoHome={() => setPage("home")}
        onGoCor={() => setPage("cor")}
      />

      {page === "home" && (
        <>
          <HeroCarousel />
          <CategoriesGrid onCategoryClick={goToCategory} />
          <FeaturedProducts onAdd={addToCart} favorites={favorites} onToggleFavorite={toggleFavorite} />
          <CategorySection onCategoryClick={goToCategory} />
          <StoreBanner />
          <ColorBanner setPage={setPage} />
          <BrandsSection />
          <Footer />
        </>
      )}

      {page === "produtos" && (
        <>
          <ProductsPage onAdd={addToCart} favorites={favorites} onToggleFavorite={toggleFavorite} />
          <Footer />
        </>
      )}

      {page === "cor" && (
        <>
          <ColorPage />
          <Footer />
        </>
      )}

      <WhatsAppFAB />

      {cartOpen && (
        <CartModal cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onChangeQty={changeQty}
          onCheckout={() => {
            setCartOpen(false)
            if (typeof window !== "undefined" && cart.length > 0) {
              localStorage.setItem("silver-cart", JSON.stringify(cart))
              window.location.href = "/checkout"
            }
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}