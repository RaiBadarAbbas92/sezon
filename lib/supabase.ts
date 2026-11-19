// Tiny Supabase REST (PostgREST) client — plain fetch, no SDK. Server-only: never import from a client component.
// Uses the same tables as the Bustaniya store backend, so its admin panel can manage this storefront's data.

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const anonKey =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY;

export const supabaseConfigured = Boolean(url && (anonKey || serviceKey));
export const supabaseAdminConfigured = Boolean(url && serviceKey);

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
  admin?: boolean; // use the service role key (writes, orders)
  revalidate?: number | false; // Next fetch cache, GET only
  tags?: string[];
}

export async function supabaseRequest<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const key = opts.admin ? serviceKey : anonKey || serviceKey;
  if (!url || !key) throw new Error("Supabase is not configured (SUPABASE_URL / keys missing in .env.local)");

  const method = opts.method ?? "GET";
  const res = await fetch(`${url}/rest/v1/${path.replace(/^\//, "")}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(opts.prefer ? { Prefer: opts.prefer } : {}),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: AbortSignal.timeout(12_000),
    ...(method === "GET"
      ? { next: { revalidate: opts.revalidate ?? 60, tags: opts.tags } }
      : { cache: "no-store" as const }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase ${method} ${path.split("?")[0]} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
