import { window, workspace } from 'vscode';

export const valueFinder = async () => {
  const envFileName = '/.env';
  const currentWorkspace = workspace.workspaceFolders;

  if (!currentWorkspace) {
    window.showErrorMessage('Must be in a workspace!');
    return;
  }

  let index = 0;
  if (currentWorkspace.length > 1) {
    const names = currentWorkspace.map(ws => ws.name);
    const pick = await window.showQuickPick(names);

    if (pick) {
      index = names.indexOf(pick);

      if (index < 0) {
        index = 0;
        window.showWarningMessage(`Workspace ${pick} not found, find from ${currentWorkspace[0].name} instead!`);
      }
    }
  }

  const path = currentWorkspace[index].uri.path;
  const editor = window.activeTextEditor;

  if (!editor) {
    window.showErrorMessage('Must be in an open file!');
    return;
  }

  const selection = editor?.selection;
  if (selection.isEmpty || !selection.isSingleLine) {
    window.showErrorMessage('Select something in a single line!');
    return;
  }

  let doc;
  try {
    doc = await workspace.openTextDocument(path + envFileName);
  } catch (e) {
    window.showErrorMessage('No .env file found in the root project!');
    return;
  }

  const keyword = editor.document.getText(selection);
  const matcher = doc.getText().match(new RegExp(`^${keyword}=(.*)`, 'gm'));

  if (!matcher) {
    window.showErrorMessage(`ENV "${keyword}"not found!`);
    return;
  }

  const line = matcher[matcher.length - 1];
  const value = line.substring(line.indexOf('=') + 1);

  window.showInformationMessage(value);
}
