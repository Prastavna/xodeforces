# xodeforces

A powerful Chrome extension that enhances your Codeforces experience with an integrated code editor and additional features.

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

1. Install from the [Chrome Web Store](https://chromewebstore.google.com/detail/xodeforces/lnfgjljnmoickkgbjedecbkcmhhdncpk)
2. Navigate to any Codeforces problem page
3. The xodeforces editor will automatically appear below the problem statement

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
   bun run dev
   ```

### Building for Production

```bash
bun run build
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