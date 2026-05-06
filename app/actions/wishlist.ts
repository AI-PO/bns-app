'use server'

type WishlistState = { success: boolean; domain?: string; error?: string } | null

export async function submitWishlist(
  _prev: WishlistState,
  formData: FormData
): Promise<WishlistState> {
  const email  = formData.get('email')  as string
  const domain = formData.get('domain') as string

  if (!email) return { success: false, error: 'Email is required.' }
  // TODO: save to Supabase
  return { success: true, domain: domain || undefined }
}
