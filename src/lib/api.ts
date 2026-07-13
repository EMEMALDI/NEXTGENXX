import { auth } from './firebase';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = 'admin-dev-token'; // Fallback for local bypass
  
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  } else if (localStorage.getItem('admin_login') === 'true') {
    token = 'admin-dev-token';
  }
  
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = response.statusText;
    try {
      const errData = await response.json();
      errMessage = errData.error || errData.message || errMessage;
    } catch (e) {}
    throw new Error(errMessage);
  }

  return response.json();
}
