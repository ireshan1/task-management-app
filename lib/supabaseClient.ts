// import { createClient } from '@supabase/supabase-js';


// const superbaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
// const superbaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// if (!superbaseURL || !superbaseKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(superbaseURL,superbaseKey);

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createBrowserSupabaseClient();