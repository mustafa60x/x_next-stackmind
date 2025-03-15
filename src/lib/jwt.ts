import jwt from 'jsonwebtoken';

const SECRET = 'supersecretkey'; // Prod ortamda .env dosyasına konulacak!

export function generateToken(user: { id: string; username: string }) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: '1h',
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}