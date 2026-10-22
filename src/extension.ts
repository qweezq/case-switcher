import * as vscode from 'vscode';

function splitIntoWords(str: string): string[] {
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
        .replace(/[-_]+/g, ' ')
        .trim()
        .split(/\s+/)
        .map(w => w.toLowerCase());
}

const toCamelCase = (words: string[]) => 
    words.map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('');

const toPascalCase = (words: string[]) => 
    words.map(w => w[0].toUpperCase() + w.slice(1)).join('');

const toSnakeCase = (words: string[]) => 
    words.join('_');

const toConstantCase = (words: string[]) => 
    words.join('_').toUpperCase();

const toKebabCase = (words: string[]) => 
    words.join('-');

function getNextCase(str: string, words: string[]): string {
    if (str === toCamelCase(words)) {
        return toPascalCase(words);
    }
    if (str === toPascalCase(words)) {
        return toSnakeCase(words);
    }
    if (str === toSnakeCase(words)) {
        return toConstantCase(words);
    }
    if (str === toConstantCase(words)) {
        return toKebabCase(words);
    }
    return toCamelCase(words);
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('case-switcher.cycleCase', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (!text.trim()) {
            vscode.window.showInformationMessage('Выделите текст для смены регистра!');
            return;
        }

        const words = splitIntoWords(text);
        if (words.length === 0 || words[0] === '') {
            return;
        }

        const nextText = getNextCase(text, words);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, nextText);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}	