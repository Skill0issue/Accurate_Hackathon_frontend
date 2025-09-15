# Accurate Hackathon Frontend

This project is built with **Next.js**, **TypeScript**, and **TailwindCSS v4.0**.  
We also use **shadcn/ui** for ready-made components, **framer-motion** for animations, **recharts** for charts, and **lucide-react** for icons.

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Skill0issue/Accurate_Hackathon_frontend.git
cd Accurate_Hackathon_frontend
```

### 2. Install dependencies
```bash
npm install
```

This installs:
- `next` → React framework  
- `react` & `react-dom` → core React  
- `tailwindcss@next` → TailwindCSS v4.0  
- `postcss` & `autoprefixer` → Tailwind build tools  
- `framer-motion` → animations  
- `recharts` → charts  
- `lucide-react` → icons  
- `shadcn/ui` → UI components  

### 3. Run the dev server
```bash
npm run dev
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure (Next.js `app/` router)
```
app/
 ├─ page.tsx          → homepage
 ├─ layout.tsx        → root layout
 ├─ globals.css       → global styles (Tailwind base)
 └─ components/ui/    → shadcn/ui components (Button, Card, etc.)
```

---

## 🎨 TailwindCSS v4.0 Notes

### Default Colors
Colors are defined in `tailwind.config.ts` under `theme.extend.colors`.

Example:
```ts
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1d4ed8",
          light: "#3b82f6",
          dark: "#1e40af",
        },
      },
    },
  },
}
export default config
```

Usage in components:
```tsx
<div className="bg-brand text-white">Hello World</div>
```

### CSS Variables with Tailwind 4.0
Tailwind 4 uses **design tokens** via CSS variables.  
You can override them in `globals.css`:

```css
@theme {
  --color-primary: #1d4ed8;
  --color-secondary: #9333ea;
}
```

Then use in classes:
```tsx
<div className="bg-primary text-secondary">
  Custom Colors
</div>
```

---

## 🛠️ shadcn/ui Setup

Add a new component:
```bash
npx shadcn@latest add button
```

This creates `components/ui/button.tsx` which you can fully customize.  
Other useful components:
```bash
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
```

---

## 📊 Libraries

### Animations
```bash
npm install framer-motion
```
Usage:
```tsx
import { motion } from "framer-motion";

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Fades in
</motion.div>
```

### Charts
```bash
npm install recharts
```
Usage:
```tsx
import { LineChart, Line, XAxis, YAxis } from "recharts";

const data = [{ name: "A", uv: 400 }, { name: "B", uv: 300 }];

<LineChart width={300} height={200} data={data}>
  <XAxis dataKey="name" />
  <YAxis />
  <Line type="monotone" dataKey="uv" stroke="#8884d8" />
</LineChart>
```

### Icons
```bash
npm install lucide-react
```
Usage:
```tsx
import { Home } from "lucide-react";

<Home className="w-6 h-6 text-primary" />
```

---

## 🔑 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npx shadcn@latest add <component>` | Add shadcn/ui component |
| `npx tailwindcss -o output.css --watch` | Compile Tailwind (manual mode) |

---

## 👨‍💻 For New Developers
- Start editing in `app/page.tsx`  
- Change global styles in `app/globals.css`  
- Change colors in `tailwind.config.ts` or `globals.css` with `@theme`  
- Add reusable UI in `components/ui/` via shadcn/ui  

---

Happy hacking! 🚀
