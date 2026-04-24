export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>✅ HOMEPAGE FUNCIONANDO!</h1>
      <p>Se você vê esta página, o problema não é a rota /</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  )
}
