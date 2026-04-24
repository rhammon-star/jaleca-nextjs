export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">✅ SITE RESTAURADO!</h1>
        <p className="text-lg text-gray-600 mb-4">jaleca.com.br está funcionando</p>
        <p className="text-sm text-gray-500">Build: {Date.now()}</p>
        <a href="/produtos" className="inline-block mt-6 px-6 py-3 bg-black text-white">Ver Produtos</a>
      </div>
    </main>
  );
}
