# Appalachian Nutrition — Official Business Site & Multi-User Dashboard

Located at **851 W Elk Ave, Elizabethton, TN**.

## Features Included
1. **Brand-Matched Storefront**: Styled around the official Appalachian Nutrition mountain logo (`public/logo.png`) with signature vibrant berry pink, lime green, and deep mountain purple accents.
2. **6 Drink & Flavor Sections**:
   - **Loaded Tea**
   - **Specialty Tea**
   - **Coffee**
   - **Shakes**
   - **Dirty Soda**
   - **Dirty Alani**
   *(Pre-seeded with popular recipes from your recipe book!)*
3. **Integrated Google Map & Contact Section**: Embeds a live interactive map pinned to **851 W Elk Ave, Elizabethton, TN**, store hours, and click-to-call phone number.
4. **Multi-User Email & Password Staff Dashboard (`/admin`)**:
   - Supports multiple team members logging in with their own email and password (stored securely with `bcryptjs` password hashes in PostgreSQL).
   - **Edit & Add Flavors**: Edit existing flavors, mark items in/out of stock, or add new drinks.
   - **Future Online Ordering Ready**: Every drink already supports prices, sizes (`24oz, 32oz`), and customization add-ons (`Extra Boost`, `Cold Foam`, etc.). When you are ready to launch online pickup ordering, flip the **"Enable Live Online Ordering"** switch inside `/admin`!

## Quick Setup & Deployment
1. Copy `.env.example` to `.env` (make sure it is named `.env` so Prisma CLI detects it automatically).
2. Add your `DATABASE_URL`, `NEXTAUTH_SECRET`, `INITIAL_ADMIN_EMAIL`, and `INITIAL_ADMIN_PASSWORD`.
3. Install dependencies and push the Prisma schema:
   ```bash
   npm install
   npx prisma db push
   npm run dev
   ```
4. Log into `/admin` using your `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`, then add additional staff emails and passwords under the **Team & Multi-User Access** tab.
