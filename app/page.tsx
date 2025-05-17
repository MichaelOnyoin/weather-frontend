import { Forecast } from "@/components/Forecast";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      
      {/* <Weather/> */}
     
      <Forecast/>
    </main>
  );
}
