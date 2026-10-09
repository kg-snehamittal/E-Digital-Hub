// Small helpers for talking to the backend API
export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const authHeaders = () => {
  const session = getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
  };
};

export const isAdmin = () => getSession()?.user?.role === 'admin';
