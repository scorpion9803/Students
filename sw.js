// Service Worker — تخزين مؤقت للتطبيق ليعمل دون اتصال
const CACHE = 'sm-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/pages.css',
  './js/app.js',
  './js/router.js',
  './js/store/db.js',
  './js/store/students.js',
  './js/store/attendance.js',
  './js/store/settings.js',
  './js/components/appBar.js',
  './js/components/bottomNav.js',
  './js/components/modal.js',
  './js/components/toast.js',
  './js/pages/home.js',
  './js/pages/students.js',
  './js/pages/studentForm.js',
  './js/pages/attendance.js',
  './js/pages/reports.js',
  './js/pages/settings.js',
  './js/utils/dom.js',
  './js/utils/date.js',
  './js/utils/id.js',
  './js/utils/backup.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match('./index.html'))
    )
  );
});