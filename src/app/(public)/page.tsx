import Link from "next/link";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SpyBee",
  description:
    "Sistema moderno de gestión de incidentes para proyectos de construcción",
  url: "https://spybee.app",
  logo: "https://spybee.app/logo.png",
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SpyBee",
  description:
    "Sistema de gestión de incidentes para construcción con mapas interactivos y dashboards analíticos",
  url: "https://spybee.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  browserRequirements: "Requiere JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MXN",
  },
};

const technologies = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "UI" },
  { name: "TypeScript", category: "Lenguaje" },
  { name: "SCSS + Atomic Design", category: "Estilos" },
  { name: "Tailwind CSS v4", category: "Estilos" },
  { name: "Zustand", category: "Estado" },
  { name: "Hono", category: "API" },
  { name: "Drizzle ORM", category: "Base de datos" },
  { name: "PostgreSQL", category: "Base de datos" },
  { name: "Supabase", category: "Auth / Storage" },
  { name: "Mapbox GL JS", category: "Mapas" },
  { name: "Recharts", category: "Gráficos" },
  { name: "Zod", category: "Validación" },
  { name: "react-hook-form", category: "Formularios" },
  { name: "Storybook", category: "Componentes" },
];

const features = [
  {
    title: "Mapa Interactivo",
    description:
      "Visualiza incidentes en un mapa dinámico con Mapbox. Capas de calor, marcadores circulares, tarjetas hover y popups con detalle completo.",
    icon: "🗺️",
  },
  {
    title: "Dashboard Analítico",
    description:
      "Más de 15 métricas en tiempo real: desglose por estado y prioridad, tendencias mensuales, carga de trabajo, tasas de resolución y aprobación.",
    icon: "📊",
  },
  {
    title: "Gestión de Incidentes",
    description:
      "CRUD completo con prioridad, estado, geolocalización, asignación de responsables, observadores, etiquetas, archivos multimedia y borradores.",
    icon: "📋",
  },
  {
    title: "Autenticación Segura",
    description:
      "Auth con Supabase: registro, inicio de sesión, verificación de correo y sesiones persistentes. Roles y permisos por proyecto.",
    icon: "🔒",
  },
  {
    title: "Arquitectura Limpia",
    description:
      "Domain-Driven Design con separación en capas: dominio, aplicación e infraestructura. Atomic Design para componentes reutilizables.",
    icon: "🧱",
  },
  {
    title: "API Robusta",
    description:
      "Backend con Hono sobre Next.js API Routes. Validación con Zod, repositorios con Drizzle y controladores modulares.",
    icon: "⚡",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, webAppSchema]),
        }}
      />

      <header className="header">
        <nav className="nav">
          <Link href="/" className="logo" aria-label="SpyBee — Inicio">
            SpyBee
          </Link>
          <Link href="/register" className="cta-button">
            Crea una cuenta
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container hero-content">
            <h1 id="hero-title" className="hero-title">
              SpyBee
              <span className="hero-subtitle">
                Gestión de Incidentes en Construcción
              </span>
            </h1>
            <p className="hero-description">
              Plataforma moderna para reportar, visualizar y analizar
              incidentes en proyectos de construcción. Mapas interactivos,
              dashboards en tiempo real y una arquitectura robusta.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="button-primary">
                Crear cuenta gratis
              </Link>
              <a href="#tecnologias" className="button-secondary">
                Ver tecnologías
              </a>
            </div>
          </div>
        </section>

        <section
          className="about"
          id="acerca"
          aria-labelledby="about-title"
        >
          <div className="container">
            <h2 id="about-title" className="section-title">
              ¿Qué es SpyBee?
            </h2>
            <div className="about-grid">
              <div className="about-card">
                <h3 className="about-card-title">Para equipos de construcción</h3>
                <p>
                  SpyBee permite a supervisores, gerentes de proyecto y
                  trabajadores de campo reportar incidentes al instante desde
                  cualquier dispositivo. Geolocalización precisa, fotos,
                  prioridades y asignación automática.
                </p>
              </div>
              <div className="about-card">
                <h3 className="about-card-title">Decisiones basadas en datos</h3>
                <p>
                  Los dashboards analíticos transforman los datos de
                  incidentes en información accionable. Identifica patrones,
                  mide tiempos de respuesta y mejora la seguridad en obra.
                </p>
              </div>
              <div className="about-card">
                <h3 className="about-card-title">Tecnología de punta</h3>
                <p>
                  Construido con Next.js 16, React 19, TypeScript y una
                  arquitectura Domain-Driven Design. Escalable, mantenible y
                  listo para producción.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="technologies"
          id="tecnologias"
          aria-labelledby="tech-title"
        >
          <div className="container">
            <h2 id="tech-title" className="section-title">
              Stack Tecnológico
            </h2>
            <p className="section-description">
              15 tecnologías modernas trabajando en conjunto para ofrecer una
              experiencia robusta y escalable.
            </p>
            <div className="tech-grid">
              {technologies.map((tech) => (
                <article key={tech.name} className="tech-card">
                  <span className="tech-category">{tech.category}</span>
                  <span className="tech-name">{tech.name}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="features"
          id="caracteristicas"
          aria-labelledby="features-title"
        >
          <div className="container">
            <h2 id="features-title" className="section-title">
              Características Principales
            </h2>
            <div className="features-grid">
              {features.map((feature) => (
                <article key={feature.title} className="feature-card">
                  <span className="feature-icon" aria-hidden="true">
                    {feature.icon}
                  </span>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta" aria-labelledby="cta-title">
          <div className="container cta-content">
            <h2 id="cta-title" className="cta-title">
              Comienza a gestionar tus incidentes hoy
            </h2>
            <p className="cta-description">
              Regístrate gratis y descubre cómo SpyBee puede transformar la
              gestión de seguridad en tus proyectos de construcción.
            </p>
            <Link href="/register" className="button-primary button-cta">
              Crear cuenta gratis
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <span className="footer-logo">SpyBee</span>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} SpyBee. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>

      <style>{`
        /* ===== Reset & Base ===== */
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        /* ===== Container ===== */
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ===== Header / Navbar ===== */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 15, 26, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(240, 193, 16, 0.15);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.875rem 1.5rem;
        }

        .logo {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1.65rem;
          font-weight: 800;
          color: #f0c110;
          text-decoration: none;
          letter-spacing: -0.03em;
          transition: opacity 0.2s;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1.5rem;
          border-radius: 9999px;
          background: #f0c110;
          color: #0f0f1a;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }

        .cta-button:hover {
          background: #ffd94a;
          transform: translateY(-1px);
        }

        /* ===== Hero ===== */
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse 80% 60% at 50% 20%,
              rgba(240, 193, 16, 0.08) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 60% 50% at 80% 80%,
              rgba(240, 193, 16, 0.04) 0%,
              transparent 60%
            );
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          text-align: center;
          padding: 4rem 0;
        }

        .hero-title {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          color: #f0c110;
          line-height: 1.1;
          letter-spacing: -0.03em;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.75rem);
          font-weight: 500;
          color: #e0e0e0;
          letter-spacing: -0.01em;
        }

        .hero-description {
          max-width: 640px;
          margin: 1.5rem auto 2.5rem;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1.125rem;
          line-height: 1.7;
          color: #a0a0b0;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ===== Buttons ===== */
        .button-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 2rem;
          border-radius: 9999px;
          background: #f0c110;
          color: #0f0f1a;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }

        .button-primary:hover {
          background: #ffd94a;
          transform: translateY(-2px);
        }

        .button-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 2rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e0e0e0;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }

        .button-secondary:hover {
          border-color: #f0c110;
          color: #f0c110;
          transform: translateY(-2px);
        }

        /* ===== Sections ===== */
        section {
          padding: 5rem 0;
        }

        .section-title {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .section-description {
          text-align: center;
          color: #a0a0b0;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 3rem;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          line-height: 1.6;
        }

        /* ===== About ===== */
        .about {
          background: rgba(255, 255, 255, 0.02);
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .about-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          padding: 2rem;
          transition: border-color 0.2s, transform 0.2s;
        }

        .about-card:hover {
          border-color: rgba(240, 193, 16, 0.3);
          transform: translateY(-3px);
        }

        .about-card-title {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #f0c110;
          margin-bottom: 0.75rem;
        }

        .about-card p {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #b0b0c0;
        }

        /* ===== Technologies ===== */
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }

        .tech-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          text-align: center;
          transition: border-color 0.2s, transform 0.2s;
        }

        .tech-card:hover {
          border-color: rgba(240, 193, 16, 0.4);
          transform: translateY(-2px);
        }

        .tech-category {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          color: #f0c110;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .tech-name {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #e0e0e0;
        }

        /* ===== Features ===== */
        .features {
          background: rgba(255, 255, 255, 0.02);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .feature-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          transition: border-color 0.2s, transform 0.2s;
        }

        .feature-card:hover {
          border-color: rgba(240, 193, 16, 0.3);
          transform: translateY(-3px);
        }

        .feature-icon {
          display: block;
          font-size: 2.25rem;
          margin-bottom: 1rem;
          line-height: 1;
        }

        .feature-title {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #f0c110;
          margin-bottom: 0.6rem;
        }

        .feature-description {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 0.9rem;
          line-height: 1.7;
          color: #b0b0c0;
        }

        /* ===== CTA ===== */
        .cta {
          text-align: center;
        }

        .cta-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .cta-title {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.02em;
        }

        .cta-description {
          max-width: 560px;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #a0a0b0;
        }

        .button-cta {
          font-size: 1.1rem;
          padding: 1rem 2.5rem;
        }

        /* ===== Footer ===== */
        .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 2rem 0;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-logo {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f0c110;
        }

        .footer-text {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          font-size: 0.85rem;
          color: #606070;
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          section {
            padding: 3rem 0;
          }

          .about-grid,
          .features-grid {
            grid-template-columns: 1fr;
          }

          .tech-grid {
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          }

          .hero-title {
            font-size: clamp(2rem, 8vw, 3rem);
          }
        }

        @media (max-width: 480px) {
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .tech-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
