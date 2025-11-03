# Installed Packages

This document lists all packages installed on your computer for this Angular project, separated by installation type.

## ✅ Installation Summary

The following have been installed on your system:

1. **Node.js v25.1.0** & **npm 11.6.2** (via Homebrew) - ✅ Installed
2. **Angular CLI 20.3.8** (global npm package) - ✅ Installed
3. **891 local project packages** (in node_modules) - ✅ Installed

**Total disk space used**: ~500-600 MB

## Global Packages

These packages are installed globally on your system and persist outside of this project:

### 1. Angular CLI
- **Package**: `@angular/cli`
- **Version installed**: 20.3.8
- **Installation command**: `npm install -g @angular/cli`
- **Removal command**: `npm uninstall -g @angular/cli`
- **Purpose**: Command-line interface for Angular development
- **Location**: Global npm directory (check with `npm root -g`)
- **Status**: ✅ INSTALLED

### 2. Node.js & npm
- **Version installed**: Node.js v25.1.0, npm 11.6.2
- **Installation**: Via Homebrew (`brew install node`)
- **Status**: ✅ INSTALLED
- **Removal**:
  - **macOS (Homebrew)**: `brew uninstall node`
  - **macOS (Manual)**: 
    ```bash
    sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/npm*
    sudo rm -rf /usr/local/bin/node
    sudo rm -rf /usr/local/include/node
    ```
  - **Windows**: Use "Add or Remove Programs" control panel
  - **Linux**: Use your package manager (e.g., `sudo apt remove nodejs npm`)

## Local Project Dependencies

These packages are installed locally in the `node_modules` folder within this project directory. They will be removed automatically when you delete the project folder.

### Runtime Dependencies (in `package.json` -> `dependencies`)

1. **@angular/animations** (^17.0.0) - Angular animations library
2. **@angular/common** (^17.0.0) - Angular common utilities and directives
3. **@angular/compiler** (^17.0.0) - Angular template compiler
4. **@angular/core** (^17.0.0) - Angular core framework
5. **@angular/forms** (^17.0.0) - Angular forms handling
6. **@angular/platform-browser** (^17.0.0) - Angular browser platform
7. **@angular/platform-browser-dynamic** (^17.0.0) - Angular dynamic browser platform
8. **@angular/router** (^17.0.0) - Angular routing library
9. **rxjs** (~7.8.0) - Reactive programming library
10. **tslib** (^2.3.0) - TypeScript runtime library
11. **zone.js** (~0.14.2) - Zone execution context library

### Development Dependencies (in `package.json` -> `devDependencies`)

1. **@angular-devkit/build-angular** (^17.0.0) - Angular build tools
2. **@angular/cli** (^17.0.0) - Angular CLI (local copy)
3. **@angular/compiler-cli** (^17.0.0) - Angular compiler CLI
4. **@types/jasmine** (~5.1.0) - TypeScript definitions for Jasmine
5. **jasmine-core** (~5.1.0) - Jasmine testing framework
6. **karma** (~6.4.0) - Test runner
7. **karma-chrome-launcher** (~3.2.0) - Karma launcher for Chrome
8. **karma-coverage** (~2.2.0) - Code coverage for Karma
9. **karma-jasmine** (~5.1.0) - Jasmine adapter for Karma
10. **karma-jasmine-html-reporter** (~2.1.0) - HTML reporter for Karma
11. **typescript** (~5.2.2) - TypeScript compiler

## How to Check Installed Global Packages

To see all globally installed npm packages on your system:

```bash
npm list -g --depth=0
```

## Complete Removal Instructions

### To Remove Only This Project

1. Delete the project directory:
   ```bash
   cd /Users/mavpa/dev/null/personal/rug/sa
   rm -rf sa-demo
   ```

### To Remove Global Packages

1. **Remove Angular CLI**:
   ```bash
   npm uninstall -g @angular/cli
   ```

2. **Check for other global packages** (optional):
   ```bash
   npm list -g --depth=0
   ```

3. **Remove any other unwanted global packages**:
   ```bash
   npm uninstall -g <package-name>
   ```

### To Remove Node.js and npm Completely

**⚠️ Warning**: Only do this if you're sure you don't need Node.js for other projects!

#### macOS (Homebrew installation)
```bash
brew uninstall node
brew cleanup
```

#### macOS (Manual installation)
```bash
sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/npm*
sudo rm -rf /usr/local/bin/node
sudo rm -rf /usr/local/include/node
sudo rm -rf /usr/local/lib/dtrace/node.d
sudo rm -rf ~/.npm
sudo rm -rf ~/.node-gyp
```

#### Windows
1. Go to "Add or Remove Programs"
2. Find "Node.js" and uninstall it
3. Delete these folders if they exist:
   - `C:\Program Files\nodejs`
   - `C:\Users\{YourUsername}\AppData\Roaming\npm`
   - `C:\Users\{YourUsername}\AppData\Roaming\npm-cache`

#### Linux (Ubuntu/Debian)
```bash
sudo apt remove nodejs npm
sudo apt autoremove
```

## Cache Cleanup

After removing packages, you may want to clean npm cache:

```bash
npm cache clean --force
```

## Notes

- Local project dependencies (`node_modules` folder) take up most of the disk space (~200-400 MB)
- Global packages are much smaller (~50-100 MB for Angular CLI)
- Node.js itself is approximately 50-70 MB
- Simply deleting the project folder removes all local dependencies
- Global packages must be uninstalled separately using the commands above

