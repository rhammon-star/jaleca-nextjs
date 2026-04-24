export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Site Jaleca</h1>
        <p className="text-lg text-gray-600 mb-4">Timestamp: {new Date().toISOString()}</p>
        <p className="text-sm text-gray-500">Versão minimalista - teste de diagnóstico</p>
      </div>
    </main>
  );
}
