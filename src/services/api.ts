import type { Event, ApiResponse } from '../types';

// Base URL da API Laravel — ajuste conforme seu ambiente
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

/**
 * Busca todos os eventos ativos
 */
export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error('Falha ao carregar eventos');
  const json: ApiResponse<Event[]> = await res.json();
  return json.data;
}

/**
 * Busca um evento pelo ID
 */
export async function fetchEvent(id: number): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/${id}`);
  if (!res.ok) throw new Error('Evento não encontrado');
  const json: ApiResponse<Event> = await res.json();
  return json.data;
}

/**
 * Busca apenas eventos em destaque
 */
export async function fetchFeaturedEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/events?featured=1`);
  if (!res.ok) throw new Error('Falha ao carregar eventos em destaque');
  const json: ApiResponse<Event[]> = await res.json();
  return json.data;
}

/**
 * Busca as configurações globais do site
 */
export async function fetchSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Falha ao carregar configurações');
  const json = await res.json();
  return json.data || {};
}
/**
 * Inscreve um e-mail na newsletter/leads
 */
export async function subscribeNewsletter(email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Falha ao assinar newsletter');
  return true;
}

/**
 * Cria um pedido (checkout)
 */
export async function createOrder(data: { buyer_name: string; buyer_email: string; payment_method: string; items: any[] }): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Falha ao processar pedido');
  return res.json();
}