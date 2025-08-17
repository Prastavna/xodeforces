# xodeforces

A powerful browser extension that enhances your Codeforces experience with an integrated code editor and additional features. Compatible with both Chrome and Firefox.

**Currently not accepting any Pull Requests, until the extension is ready for release**

## Features

- **Integrated Code Editor**: Built with Monaco Editor (the same editor that powers VS Code) for a familiar coding experience
- **Seamless Integration**: Works directly on Codeforces problem pages
- **Multiple Language Support**: Supports all programming languages available on Codeforces
- **Dark/Light Theme**: Choose between light and dark themes to match your preference
- **Local Storage**: Your code is automatically saved as you type
- **Quick Submit**: Submit solutions directly from the editor
- **Keyboard Shortcuts**: Use familiar keyboard shortcuts for better productivity

## Installation

### Chrome
1. Install from the [Chrome Web Store](https://chromewebstore.google.com/detail/xodeforces/lnfgjljnmoickkgbjedecbkcmhhdncpk)
2. Navigate to any Codeforces problem page
3. The xodeforces editor will automatically appear below the problem statement

### Firefox
1. Download the latest Firefox extension from the [releases page](https://github.com/prastavna/xodeforces/releases)
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded `.xpi` file
5. Navigate to any Codeforces problem page

## Development

### Prerequisites

- Bunjs

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/prastavna/xodeforces.git
   cd xodeforces
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Start development server
   ```bash
   # For Chrome
   bun run dev
   
   # For Firefox
   bun run dev:firefox
   ```

### Building for Production

```bash
# For Chrome
bun run build

# For Firefox
bun run build:firefox
```

## Technologies Used

- Vue.js 3
- TypeScript
- Monaco Editor
- Pinia for state management
- Vite for building

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the [GitHub repository](https://github.com/prastavna/xodeforces/issues).