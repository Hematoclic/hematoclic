import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <main>
      <Header />
        <section className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-2 gap-8 mt-12">
            <Link className="flex items-center justify-center w-70 h-70 border border-[#a50000] rounded-2xl text-center text-lg font-medium hover:bg-[#a50000] hover:border-0 hover:text-white transition" href={'/fiches-pathologies'}>fiches pathologies</Link>
            <Link className="flex items-center justify-center w-70 h-70 border border-[#a50000] rounded-2xl text-center text-lg font-medium hover:bg-[#a50000] hover:border-0 hover:text-white transition" href={'/orientation-diagnostique'}>orientation diagnostique</Link>
            <Link className="flex items-center justify-center w-70 h-70 border border-[#a50000] rounded-2xl text-center text-lg font-medium hover:bg-[#a50000] hover:border-0 hover:text-white transition" href={'/situations-graves'}>situations graves</Link>
            <Link className="flex items-center justify-center w-70 h-70 border border-[#a50000] rounded-2xl text-center text-lg font-medium hover:bg-[#a50000] hover:border-0 hover:text-white transition" href={'/situations-frequentes'}>situations fréquentes</Link>
          </div>
        </section>
    </main>
  );
}
