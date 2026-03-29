import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-4">GNG</h1>
        <p className="text-xl text-gray-400 mb-2">Good New Guys</p>
        <p className="text-lg text-gray-300 mb-8">
          Making real friends as a guy is hard. GNG matches you with men at the same life stage, with shared interests, nearby.
        </p>
        <Link
          href="/onboarding"
          className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition"
        >
          Find your guys
        </Link>
      </div>
    </main>
  )
}