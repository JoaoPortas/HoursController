# About this project
This is an application that serves to track extra hours, which are paid according to a released Portuguese law, with different values depending on the amount of extra hours, the day the worker works, and whether it is the first or second extra hour of that day.
The workers can register their extra hours, and then the application is able to generate a report with all the users and the extra hours worked, along with the extra pay each one should receive.
This software has the restriction of not being built as a website and must be a desktop application with the data stored locally (SQLite), as requested by the person who commissioned the project. Additionally, the software is required to be built with React and TypeScript (which I found not so easy to develop with Electron as an offline application).
This software is not affiliated with any company and does not have any commercial objectives.

# electron-app

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

# After run the command for `npm run build:win`
Copy the content inside /resources/resources folder to the previous one, the /resource. If this isn't do when exporting the hours report will not
work because of template files are not in the correct path.
