const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function hasSupabaseEnv() {
  return Boolean(url && anonKey);
}

/** Supabase REST 호출 (익명 키). RLS로 insert만 허용되며, 조회는 RPC로만 가능. */
export async function supabaseRest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  if (!url || !anonKey) throw new Error("Supabase env is not configured");
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}
