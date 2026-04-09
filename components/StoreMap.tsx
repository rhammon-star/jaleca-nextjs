'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'
import { franqueados } from '@/lib/franqueados'

// Fix Leaflet default icon issue with webpack
function fixLeafletIcon() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

// Center of Southeast Brazil showing all stores
const CENTER: LatLngExpression = [-20.5, -42.5]
const ZOOM = 6

export default function StoreMap() {
  useEffect(() => {
    fixLeafletIcon()
  }, [])

  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {franqueados.map(loja => {
        const waNumber = loja.whatsapp.replace(/\D/g, '')
        const waLink = `https://wa.me/${waNumber}?text=Olá!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informações%20sobre%20a%20loja%20de%20${encodeURIComponent(loja.cidade)}.`

        return (
          <Marker key={loja.id} position={[loja.lat, loja.lng]}>
            <Popup className="jaleca-popup">
              <div style={{ fontFamily: 'sans-serif', minWidth: 180 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px' }}>
                  {loja.estado}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>
                  {loja.cidade}
                </p>
                <p style={{ fontSize: 12, color: '#555', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {loja.endereco}
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#25D366', color: '#fff',
                    padding: '7px 12px', fontSize: 11,
                    fontWeight: 700, textDecoration: 'none',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}
                >
                  WhatsApp
                </a>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
