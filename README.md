# Ghost Shooter TypeScript
This is the [Ghost Shooter Code](https://editor.construct.net/#open=ghost-shooter-code) Construct example, which is originally written in JavaScript, but ported to [TypeScript](https://www.typescriptlang.org/). It serves to demonstrate how TypeScript can be used for writing code in Construct. This project requires Construct 3 r362+.

[This commit](https://github.com/Scirra/Ghost-Shooter-TypeScript/commit/24fe366ce4db861b222b6b3dc9a694a6a1a999b6) shows how to update JavaScript code to be compatible with TypeScript. It may be a useful reference for the kinds of changes that need to be made to update other existing JavaScript-based projects to TypeScript.

To learn more about using TypeScript in Construct, see the guide [Using TypeScript in Construct](https://www.construct.net/en/tutorials/using-typescript-construct-3003).

## Get the files
To get the files, click the green *Code* button and choose *Download ZIP*. Extract the ZIP contents to a folder on your system. Then use Construct's *Open local project folder* option and select the folder where the project files are.

> [!NOTE]
> The *Open local project folder* is currently only supported in Chromium-based browsers, such as Google Chrome and Microsoft Edge. It is not currently supported in Safari or Firefox.

## Set up TypeScript
Since Construct's TypeScript definition files change over time, they are not included in this repository. You can get Construct to create them by right-clicking on the *Scripts* folder in the Project Bar and selecting *TypeScript - Update TypeScript definitions*.

## Edit the code
Next try opening the project folder in a TypeScript-compatible code editor such as [VS Code](https://code.visualstudio.com/).

> [!NOTE]
> With VS Code, you need to install the TypeScript compiler separately. See [TypeScript in Visual Studio Code](https://code.visualstudio.com/docs/languages/typescript) for more details.

The code can be found in the *scripts* subfolder of the project. As you edit the code, you should find that VS Code is able to use type information to provide useful tools such as exact autocomplete suggestions, navigating and refactoring code, and identifying errors.

You can also use Construct's *Auto reload all on preview* mode to automatically load changes made from an external editor when previewing your project.