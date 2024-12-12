import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSecret(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateURL(mainURL:string,query:Record<string,string>){
  const url = new URL(mainURL)
  const searchParams = new URLSearchParams(url.search)
  Object.keys(query).forEach(k=>{
    searchParams.append(k,query[k])
  })
  url.search = searchParams.toString()
  return url.toString()
}