# Contributing to Xodeforces

Thank you for your interest in contributing to Xodeforces! We welcome contributions from the community and appreciate your help in making this extension better.

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) v1.0.0 or higher
- Node.js v18 or higher
- Basic knowledge of Vue.js, TypeScript, and browser extensions

### Development Setup
1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/xodeforces.git
   cd xodeforces
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Start Development Server**
   ```bash
   bun run dev          # For Chrome
   bun run dev:firefox  # For Firefox
   ```

4. **Load Extension in Browser**
   - **Chrome**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select `dist/` folder
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file in `dist/`

## 📝 Development Guidelines

### Code Style
- Use [Biome](https://biomejs.dev/) for formatting and linting
- Follow existing code patterns and conventions
- Use TypeScript for type safety
- Write meaningful variable and function names

### Commands
```bash
bun run dev           # Start development server
bun run build         # Build for production
bun run type-check    # Run TypeScript checks
bun run check:fix     # Format and lint code
```

### Project Structure
```
src/
├── background/       # Service worker/background scripts
├── components/       # Vue components
├── constants/        # Static data and configurations
├── services/         # API services (Judge0, storage)
├── stores/           # Pinia stores for state management
├── types/            # TypeScript type definitions
└── ui/               # UI entry points
    ├── action-popup/        # Extension popup
    └── content-script-iframe/  # Main editor interface
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Clear title**: Brief description of the issue
- **Steps to reproduce**: Detailed steps to reproduce the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, version, OS
- **Screenshots**: If applicable
- **Console errors**: Check browser console for errors

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).

## 💡 Feature Requests

For new features:
- **Clear description**: Explain the feature and its benefits
- **Use cases**: Provide specific scenarios where this would be useful
- **Mockups/Examples**: Visual aids help (if applicable)
- **Implementation ideas**: Any technical suggestions

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

## 🔧 Types of Contributions

### 🐛 Bug Fixes
- Fix existing functionality
- Improve error handling
- Resolve compatibility issues

### ✨ New Features
- Add Judge0 API integrations
- Enhance editor functionality
- Improve user interface
- Add new language support

### 📚 Documentation
- Improve README
- Add code comments
- Create user guides
- Update technical docs

### 🎨 UI/UX Improvements
- Enhance visual design
- Improve user experience
- Add themes
- Optimize layouts

## 🔄 Pull Request Process

### Before Submitting
1. **Check existing issues**: Ensure your contribution isn't already being worked on
2. **Create an issue**: For significant changes, create an issue first to discuss
3. **Fork the repository**: Work on your own fork
4. **Create a branch**: Use descriptive branch names (`feature/judge0-integration`, `fix/editor-crash`)

### Submission Checklist
- [ ] **Code Quality**: Run `bun run check:fix` to format code
- [ ] **Type Safety**: Ensure `bun run type-check` passes
- [ ] **Testing**: Test your changes thoroughly
- [ ] **Documentation**: Update relevant documentation
- [ ] **Commit Messages**: Use clear, descriptive commit messages

### Commit Message Guidelines
```
feat: add Judge0 API integration for code execution
fix: resolve editor crash on theme switching  
docs: update installation instructions
style: improve button hover effects
refactor: restructure store management
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] No console errors
- [ ] Functionality works as expected

## Screenshots (if applicable)
[Add screenshots here]
```

## 🧪 Testing

### Manual Testing
- Test your changes on both Chrome and Firefox
- Verify functionality on different Codeforces pages
- Check for console errors
- Test with different themes and settings

### Key Areas to Test
- **Editor functionality**: Syntax highlighting, auto-completion, themes
- **Code execution**: Judge0 integration, error handling
- **Settings**: Configuration persistence, validation
- **UI responsiveness**: Different screen sizes, panel resizing

## 💬 Communication

- **GitHub Issues**: For bugs, features, and technical discussions
- **GitHub Discussions**: For general questions and community chat
- **Pull Request Comments**: For code review and feedback

## 📄 Code of Conduct

### Our Standards
- **Be respectful**: Treat everyone with kindness and respect
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together towards common goals
- **Be inclusive**: Welcome contributors from all backgrounds

### Unacceptable Behavior
- Harassment, discrimination, or personal attacks
- Trolling, spamming, or off-topic discussions
- Publishing private information without consent
- Any conduct that would be inappropriate in a professional setting

## 🏷️ Issue and PR Labels

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation related
- `help wanted`: Community contributions welcome
- `good first issue`: Good for newcomers

### Priority Labels
- `priority: high`: Critical issues
- `priority: medium`: Important improvements
- `priority: low`: Nice to have features

## 🚀 Release Process

1. **Development**: Contributors create PRs
2. **Review**: Maintainers review and approve changes
3. **Merge**: Approved changes are merged to main branch
4. **Testing**: Automated and manual testing
5. **Release**: New versions are tagged and published

## 🙋‍♂️ Getting Help

- **New to the project?** Look for `good first issue` labels
- **Need guidance?** Ask questions in GitHub Discussions
- **Stuck on something?** Mention maintainers in issues/PRs

## 📞 Contact

- **GitHub Issues**: Primary communication channel
- **GitHub Discussions**: Community questions and ideas


---

Thank you for contributing to Xodeforces! Your efforts help make competitive programming more accessible and enjoyable for everyone. 🎉