import * as bcrypt from 'bcrypt';

export async function generateHash(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePass(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
