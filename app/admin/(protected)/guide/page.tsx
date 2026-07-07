import Link from 'next/link';

export default function AdminGuidePage() {
  return (
    <>
      <div className="topbar-admin">
        <h2>Admin Kullanım Kılavuzu</h2>
      </div>
      <div className="page-content" style={{ maxWidth: 800 }}>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Dashboard</h3></div>
          <div className="card-body" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <p>Dashboard, admin panelinin ana sayfasıdır. Burada şunları görürsünüz:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong>İstatistik kartları</strong> — Toplam sayfa, yayınlanan/taslak blog yazıları sayısı</li>
              <li><strong>Hızlı işlemler</strong> — En sık kullanılan sayfalara tek tıkla erişim</li>
              <li><strong>Son blog yazıları</strong> — En son eklenen blog yazılarının listesi</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Pages (Sayfalar)</h3></div>
          <div className="card-body" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <p>Tüm site sayfalarını buradan yönetirsiniz:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong>Sayfa listesi</strong> — Tüm sayfaları türüne ve yayın durumuna göre görüntüleyin</li>
              <li><strong>Sayfa düzenleme</strong> — Her sayfanın başlığını, meta description'ını ve yayın durumunu değiştirebilirsiniz</li>
              <li><strong>Sayfa türleri:</strong> homepage, service, location, brand, zip code bazlı sayfalar</li>
            </ul>
            <div style={{ padding: 12, background: '#fef3c7', borderRadius: 6, fontSize: 13, color: '#92400e', marginTop: 8 }}>
              <strong>Not:</strong> Sayfa içerikleri şu an statik HTML sayfalardan yönetilmektedir. Başlık ve meta açıklamalarını admin panelden değiştirebilirsiniz. İçerik düzenlemesi için ilgili HTML dosyasını düzenlemeniz gerekir.
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Blog Yönetimi</h3></div>
          <div className="card-body" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <p>Blog yazılarını tamamen admin panelden yönetebilirsiniz:</p>

            <h4 style={{ marginTop: 16, marginBottom: 8, fontSize: 14 }}>Yeni Blog Yazısı Ekleme</h4>
            <ol style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Blog sayfasında <strong>"New Post"</strong> butonuna tıklayın</li>
              <li><strong>Başlık</strong> girin — otomatik olarak URL dostu hale getirilir</li>
              <li><strong>Kategori</strong> seçin (Lockout Guides, Automotive Keys, Security Tips, Company News)</li>
              <li><strong>Etiketler</strong> ekleyin (virgülle ayırın, örn: "Orlando, emergency, lockout")</li>
              <li><strong>Meta Description</strong> girin — arama sonuçlarında görünecek açıklama</li>
              <li><strong>HTML içerik</strong> girin — blog yazınızın tam HTML kodunu yazın</li>
              <li><strong>"Publish immediately"</strong> seçeneği ile hemen yayınlayın veya taslak olarak kaydedin</li>
            </ol>

            <h4 style={{ marginTop: 16, marginBottom: 8, fontSize: 14 }}>Blog Yazısı Düzenleme</h4>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Blog listesinde yazının yanındaki <strong>"Edit"</strong> butonuna tıklayın</li>
              <li>İstediğiniz alanı değiştirin (başlık, kategori, etiketler, meta description, HTML içerik)</li>
              <li><strong>"Save Changes"</strong> ile kaydedin</li>
              <li>Yayın durumunu değiştirmek için <strong>"Published"</strong> kutusunu işaretleyin/boşaltın</li>
            </ul>

            <h4 style={{ marginTop: 16, marginBottom: 8, fontSize: 14 }}>Blog Yazısı Silme</h4>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Blog listesinde yazının yanındaki <strong>"Delete"</strong> butonuna tıklayın</li>
              <li>Silme işlemi geri alınamaz — dikkatli kullanın</li>
            </ul>

            <div style={{ padding: 12, background: '#f0f9ff', borderRadius: 6, fontSize: 13, color: '#1e40af', marginTop: 12, border: '1px solid #bae6fd' }}>
              <strong>HTML İçerik İpuçları:</strong>
              <ul style={{ margin: '4px 0 0 16px' }}>
                <li>Paragraf için: <code>{'<p>metin</p>'}</code></li>
                <li>Başlık için: <code>{'<h2>başlık</h2>'}</code> veya <code>{'<h3>alt başlık</h3>'}</code></li>
                <li>Liste için: <code>{'<ul><li>madde</li></ul>'}</code></li>
                <li>Görsel için: <code>{'<img src="url" alt="açıklama" />'}</code></li>
                <li>Link için: <code>{'<a href="url">metin</a>'}</code></li>
                <li>Kalın: <code>{'<strong>metin</strong>'}</code>, İtalik: <code>{'<em>metin</em>'}</code></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>SEO (Arama Motoru Optimizasyonu)</h3></div>
          <div className="card-body" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <p>SEO sayfasında tüm sayfaların meta bilgilerini tek yerden yönetebilirsiniz:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong>Meta Title</strong> — Her sayfanın arama sonuçlarında görünen başlığı (50-60 karakter önerilir)</li>
              <li><strong>Meta Description</strong> — Arama sonuçlarındaki kısa açıklama (150-160 karakter önerilir)</li>
              <li><strong>Slug/URL</strong> — Sayfanın URL adresini değiştirebilirsiniz</li>
              <li><strong>Yayın durumu</strong> — Taslak sayfalar arama motorlarında görünmez</li>
              <li><strong>Sitemap & Schema</strong> — Otomatik sitemap oluşturma ve yapısal veri işaretleme</li>
            </ul>
            <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 6, fontSize: 13, color: '#166534', marginTop: 8, border: '1px solid #bbf7d0' }}>
              <strong>SEO Altın Kural:</strong> Her sayfanın title ve description'ı <u>benzersiz</u> olmalıdır. Aynı meta bilgileri kopya içerik olarak algılanabilir.
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Settings (Ayarlar)</h3></div>
          <div className="card-body" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong>İşletme Bilgileri</strong> — Firma adı, telefon, adres, e-posta ve hizmet bölgesini güncelleyin</li>
              <li><strong>Google Services</strong> — Search Console ve Analytics kurulum rehberi</li>
              <li><strong>Deployment Info</strong> — GitHub, Vercel ve canlı site bağlantıları</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Sık Sorulan Sorular</h3></div>
          <div className="card-body" style={{ fontSize: 14, lineHeight: 1.8 }}>
            <p><strong>S: Admin panele nasıl giriş yaparım?</strong></p>
            <p style={{ color: '#6b7280', marginBottom: 12 }}>Adres: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>https://eastorlandolocksmith.com/admin</code> Kullanıcı adı: <strong>admin</strong>, Şifre: <strong>eoladmin2026</strong></p>

            <p><strong>S: Değişiklikler sitede ne zaman görünür?</strong></p>
            <p style={{ color: '#6b7280', marginBottom: 12 }}>Blog yazıları anında kaydedilir. Statik sayfa değişiklikleri için HTML dosyasını düzenlemeniz ve GitHub'a push yapmanız gerekir, ardından Vercel otomatik deploy eder.</p>

            <p><strong>S: Blog yazısında görsel nasıl eklerim?</strong></p>
            <p style={{ color: '#6b7280', marginBottom: 12 }}>HTML içeriğinize <code>{'<img src="..." alt="..." />'}</code> etiketi ekleyin. Görselleri siteye yüklemek için GitHub repo'sunun <code>/public/images/</code> klasörüne koyun.</p>

            <p><strong>S: Siteye nasıl yeni sayfa eklerim?</strong></p>
            <p style={{ color: '#6b7280', marginBottom: 12 }}>Yeni sayfa eklemek için HTML dosyası oluşturmalı, <code>site-content.json</code>'a yeni page girişi eklemeli ve Vercel routing ayarlarını güncellemelisiniz.</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #fefce8, #fef3c7)', border: '1px solid #fde68a' }}>
          <div className="card-header"><h3>İletişim & Destek</h3></div>
          <div className="card-body" style={{ fontSize: 14 }}>
            <p>Teknik destek veya ek özellik talepleri için:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>E-posta: <strong>theeastorlandolocksmith@gmail.com</strong></li>
              <li>GitHub repo: busebolova/east-orlando-locksmith</li>
              <li>Vercel dashboard: vercel.com üzerinden proje takibi</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: 20, fontSize: 12, color: '#9ca3af' }}>
          East Orlando Locksmith Admin Panel v1.0 — Son güncelleme: Temmuz 2026
        </div>
      </div>
    </>
  );
}
