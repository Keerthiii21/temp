import React, { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

export default function PiMapViewer() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)
  const [mapUrl, setMapUrl] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0]
      if (f.name.endsWith('.zip')) {
        setFile(f)
        setPreview(f.name)
      } else {
        setMessage('Please drop a ZIP file')
        setSuccess(false)
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      if (f.name.endsWith('.zip')) {
        setFile(f)
        setPreview(f.name)
      } else {
        setMessage('Only ZIP files are allowed')
        setSuccess(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('No file selected')
      setSuccess(false)
      return
    }

    setMessage(null)
    setSuccess(false)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/zip/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Upload failed')
      }

      const data = await res.json()
      setMapUrl(data.mapUrl)
      setSuccess(true)
      setMessage('✓ ZIP uploaded and extracted successfully!')
      setFile(null)
      setPreview(null)
    } catch (err) {
      setMessage(err.message || 'Upload failed')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (mapUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800 flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-poppins font-bold mb-2">Pi Folium Map</h1>
              <p className="text-dark-400">Raspberry Pi generated pothole map visualization</p>
            </div>
            <button
              onClick={() => {
                setMapUrl(null)
                setFile(null)
                setPreview(null)
              }}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
            >
              Upload New
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-7xl w-full mx-auto px-6 pb-12">
          <Card className="!p-0 overflow-hidden h-[600px]">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Pi Pothole Map"
            />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-2">Upload Pi Map</h1>
          <p className="text-dark-400">Upload a ZIP file from your Raspberry Pi containing pothole_map.html</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ZIP Upload */}
          <Card className="!p-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/20'
              }`}
            >
              {preview ? (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="font-semibold">{preview}</p>
                  <p className="text-sm text-dark-400">Ready to upload</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex p-4 bg-blue-500/20 rounded-lg">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="font-semibold">Drag and drop your ZIP file here</p>
                  <p className="text-sm text-dark-400">or</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">browse files</span>
                  </label>
                  <p className="text-xs text-dark-500 mt-4">Expected contents: pothole_map.html, potholes.jsonl, frames/, best_frames/, gps_raw.log</p>
                </div>
              )}
            </div>
          </Card>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
              success
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {success ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={success ? 'text-green-400' : 'text-red-400'}>{message}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            disabled={loading || !file}
            type="submit"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload ZIP
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
