import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../contexts/AuthContext'
import { sellerAPI } from '../../lib/api'
import { useCart } from '../../contexts/CartContext'

export default function SellerUpload() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { showToast } = useCart()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock_quantity: '',
    featured: false,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'artisan')) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload: any = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
      }

      // If user picked a local file preview, send it as the image_url (data URL)
      if (previewUrl) payload.image_url = previewUrl

      await sellerAPI.createProduct(payload)
      showToast?.('Product created')
      router.push('/seller')
    } catch (error) {
      console.error('Failed to create product:', error)
      showToast?.('Failed to create product')
    }
  }

  const handleFileChange = (file?: File) => {
    setFileError(null)
    setUploadProgress(null)
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setFileError('Only JPG, PNG or WEBP images are allowed')
      setPreviewUrl(null)
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB (Cloudinary can handle larger; allow slightly bigger)
    if (file.size > maxSize) {
      setFileError('Image too large (max 5 MB)')
      setPreviewUrl(null)
      return
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    // If Cloudinary is configured, upload the file directly and use the returned secure_url
    if (cloudName && uploadPreset) {
      setUploading(true)
      // upload via XMLHttpRequest so we can show progress
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', uploadPreset)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        setUploading(false)
        try {
          const res = JSON.parse(xhr.responseText)
          if (res && res.secure_url) {
            setPreviewUrl(res.secure_url)
            setFormData((s) => ({ ...s, image_url: res.secure_url }))
          } else {
            setFileError('Upload failed')
          }
        } catch (err) {
          console.error('Cloudinary parse error', err)
          setFileError('Upload failed')
        }
      }
      xhr.onerror = (err) => {
        console.error('Cloudinary upload error', err)
        setUploading(false)
        setFileError('Upload failed')
      }
      xhr.send(fd)
      return
    }

    // Fallback: convert to data URL (existing behavior)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      // also populate the text field so the existing API receives image_url
      setFormData((s) => ({ ...s, image_url: result }))
    }
    reader.onerror = (err) => {
      console.error('File read error', err)
      setFileError('Failed to read image file')
      setPreviewUrl(null)
    }
    reader.readAsDataURL(file)
  }

  if (authLoading || !user || user.role !== 'artisan') {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Loading...</p>
        </main>
        <Footer onSubscribe={() => {}} subscribed={false} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Upload Product - Seller - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '20px' }}>Add New Product</h1>

          <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title *</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 8 }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Price *</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 8 }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 8 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                <input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Stock Quantity</label>
                <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Image</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : undefined)}
                />
                <input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="/assets/product-1.jpeg or https://..." style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 8 }} />
              </div>
              {fileError && <div style={{ color: '#c24c3d', marginTop: 8 }}>{fileError}</div>}
              {previewUrl && (
                <div style={{ marginTop: 12 }}>
                  <img src={previewUrl} alt="preview" style={{ maxWidth: '240px', maxHeight: '180px', borderRadius: 8, objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                <span>Featured</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn primary">Create Product</button>
              <button type="button" className="btn outline" onClick={() => router.push('/seller')}>Cancel</button>
            </div>
          </form>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}
