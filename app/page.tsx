import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const sections = [
    {
      title: "Fiches Pathologies",
      description: "Consultez les fiches détaillées des pathologies hématologiques",
      href: "/fiches-pathologies",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Orientation Diagnostique",
      description: "Guide pour l'orientation et le diagnostic des patients",
      href: "/orientation-diagnostique",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Situations Graves",
      description: "Urgences et situations critiques en hématologie",
      href: "/situations-graves",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: "Situations Fréquentes",
      description: "Cas cliniques courants et leurs prises en charge",
      href: "/situations-frequentes",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <section className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Bienvenue sur <span className="text-[#a50000]">Hématoclic</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Votre ressource complète pour l'hématologie clinique. Accédez rapidement aux informations essentielles pour votre pratique médicale.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-[#a50000]/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#a50000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="text-[#a50000] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#a50000] transition-colors duration-300">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.description}
                </p>

                <div className="mt-6 flex items-center text-[#a50000] font-medium group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">Accéder</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#a50000]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </section>

        {/* Footer note */}
        <section className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Application développée pour la pratique clinique en hématologie
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
