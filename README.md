# E-E-A-T Analyzer

A free web tool to analyze pages against Google's Search Quality Rater Guidelines for Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T).

## 🚀 Quick Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy (Easiest)

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
3. Click "New Project" → Import your repository
4. Click "Deploy" - that's it!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project folder
cd eeat-app

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

## 🔑 API Key Options

This app uses the Anthropic Claude API for analysis. You have two options:

### Option A: Users Bring Their Own Key (Default)
- Users enter their own Anthropic API key in the app settings
- Key is stored in their browser's localStorage
- No cost to you as the app owner

### Option B: You Provide a Shared Key
- Add your API key as an environment variable in Vercel:
  1. Go to your Vercel project dashboard
  2. Settings → Environment Variables
  3. Add: `ANTHROPIC_API_KEY` = `sk-ant-...`
- Users won't need to enter their own key
- You pay for all API usage

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

For local API testing, create a `.env` file:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 📁 Project Structure

```
eeat-app/
├── api/
│   └── analyze.js      # Serverless API function
├── src/
│   ├── App.jsx         # Main React component
│   ├── main.jsx        # React entry point
│   └── index.css       # Tailwind styles
├── public/
│   └── favicon.svg     # App icon
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🔧 Customization

### Change the Model
Edit `api/analyze.js` line 73:
```javascript
model: 'claude-sonnet-4-20250514'  // or other Claude model
```

### Add More E-E-A-T Signals
Edit `src/App.jsx` - add items to the `EEAT_CRITERIA` object.

### Modify Styling
The app uses Tailwind CSS. Edit classes directly in `App.jsx`.

## 📊 Features

- ✅ Analyze up to 50 URLs at once
- ✅ 46 E-E-A-T signals across Brand, Content, and Author levels
- ✅ Automatic scoring for Experience, Expertise, Authority, and Trust
- ✅ Priority-ranked recommendations
- ✅ CSV export for Excel
- ✅ Manual rating adjustments
- ✅ YMYL detection
- ✅ Mobile responsive

## 🆓 Hosting Alternatives

### Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. "Add new site" → "Import an existing project"
4. Connect GitHub and select repo
5. Build settings are auto-detected
6. Add environment variable if using Option B

### Railway
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Railway auto-detects settings
4. Add environment variable in dashboard

### Render
1. Go to [render.com](https://render.com)
2. "New" → "Static Site"
3. Connect GitHub repo
4. Build Command: `npm run build`
5. Publish Directory: `dist`

## 📝 License

MIT - Free to use and modify.

## 🙏 Credits

- Based on [Google's Search Quality Rater Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- E-E-A-T checklist inspired by [Digitaloft](https://digitaloft.co.uk/)
- Powered by [Claude AI](https://anthropic.com)
