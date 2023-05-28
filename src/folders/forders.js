export function setFoldersDispatch(arg) {
  return { type: 'setFolders', payload: arg }
}

export function addFolderDispatch(arg) {
  return { type: 'addFolder', payload: arg }
}

export function removeFolderDispatch(arg) {
  return { type: 'removeFolder', payload: arg }
}

export function addContentToFolderDispatch(folderId, object) {
  return { type: 'updateFolder', payload: { folderId, object } };
}

export function setFolderContentDispatch(idFolder, array) {
  return { type: 'setFolderContent', payload: { idFolder, array } };
}

const initialState = {
  folders: []
};

export default function foldersReducer(state = initialState, action) {
  switch (action.type) {
    case 'setFolders':
      return {
        ...state,
        folders: action.payload,
      };
    case 'addFolder':
      return {
        ...state,
        folders: [...state.folders, action.payload]
      }
    case 'removeFolder':
      return {
        ...state,
        folders: state.folders.filter(folder => folder !== action.payload)
      }
    case 'updateFolder':
      const { folderId, object } = action.payload;
      const updatedFolders = state.folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            content: [...folder.content, object],
          };
        }
        return folder;
      });
      return {
        ...state,
        folders: updatedFolders,
      };
    case 'setFolderContent':
      const { idFolder, array } = action.payload;
      const newFolders = state.folders.map((folder) => {
        if (folder.id === idFolder) {
          return { ...folder, content: [ ...array ] }
        }
        return folder;
      })
      return {
        ...state,
        folders: newFolders,
      }
    default:
      return state;
  }
}