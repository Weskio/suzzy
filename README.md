# Suzzy - Smart Web Assistant

A Chrome extension that helps you interact with web pages using AI. Ask questions about the content, navigate to specific elements, and get intelligent responses powered by Groq AI.

## Features

- 🤖 **AI-Powered Web Assistant**: Ask questions about any webpage content
- 🔍 **Smart Content Analysis**: Automatically extracts and analyzes page content
- 🎯 **Element Navigation**: Find and navigate to specific elements on the page
- ✨ **Text Highlighting**: Highlight relevant content based on your queries
- 🔧 **Easy Setup**: Simple API key configuration for Groq AI
- 🎨 **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS

## Installation

### For Development

1. **Clone the repository**

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd suzzy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from your project

### For Users

1. Download the extension from the Chrome Web Store (coming soon)
2. Or follow the development installation steps above

## Setup

1. **Get a Groq API Key**

   - Visit [Groq Console](https://console.groq.com/)
   - Create an account and generate an API key
   - Copy your API key

2. **Configure the Extension**
   - Click the Suzzy extension icon in your browser
   - Enter your Groq API key in the setup screen
   - The extension will remember your key for future use

## Usage

1. **Navigate to any webpage** you want to analyze
2. **Click the Suzzy extension icon** in your browser toolbar
3. **Ask questions** about the page content, such as:
   - "What does this organization do?"
   - "Take me to the contact page"
   - "Does this site mention donations?"
   - "Find the pricing information"
4. **Get intelligent responses** with confidence scores and source references
5. **Use suggested actions** like highlighting text or navigating to elements

## Example Queries

- **Content Analysis**: "Summarize the main points of this article"
- **Navigation**: "Where can I find the login button?"
- **Information**: "What are the business hours?"
- **Comparison**: "Does this page mention pricing?"
- **Action**: "Take me to the FAQ section"

## Technical Details

### Built With

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Groq AI** - High-performance AI inference

### Architecture

- **Popup Interface**: React-based popup for user interaction
- **Content Script**: Extracts and analyzes webpage content
- **Background Script**: Handles communication between components
- **AI Integration**: Secure API calls to Groq for intelligent responses

### File Structure

```
src/
├── components/          # UI components
│   ├── SuzzyPopup.tsx  # Main popup interface
│   ├── ApiKeySetup.tsx # API key configuration
│   └── ui/             # shadcn/ui components
├── services/           # API services
│   └── groqApi.ts      # Groq AI integration
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build extension for production
- `npm run preview` - Preview production build

### Environment Variables

No environment variables required - API keys are stored securely in browser storage.

## Privacy & Security

- **Local Storage**: API keys are stored locally in your browser
- **No Data Collection**: We don't collect or store your queries or data
- **Secure API Calls**: Direct communication with Groq AI API
- **Content Analysis**: All processing happens locally in your browser

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the troubleshooting section below
- Ensure your Groq API key is valid and has sufficient credits

## Troubleshooting

### Common Issues

1. **Extension not loading**

   - Ensure you're loading the `dist` folder, not the root project folder
   - Check that the build completed successfully

2. **API key errors**

   - Verify your Groq API key is correct
   - Check your Groq account has available credits
   - Try resetting the API key in the extension settings

3. **Content not loading**

   - Refresh the webpage you're trying to analyze
   - Check that the page has loaded completely
   - Some dynamic content may not be captured immediately

4. **Popup not responding**
   - Check the browser console for errors (right-click popup → Inspect)
   - Try reloading the extension in `chrome://extensions/`

---

**Suzzy** - Making the web more intelligent, one page at a time. 🚀
