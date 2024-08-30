import Image from "next/image";
import CsvCombiner from "./components/CsvCombiner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CsvCombiner />
    </main>
  );
}
