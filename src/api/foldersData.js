import { items } from "./Fetch";

export function getFolders() {
    return items.get('/folders');
}

export function postFolder(folder) {
    return items.post('/folders', folder);
}

export function removeFolder(folderId) {
    return items.delete(`/folders/${folderId}`)
}

export function updateFolder(folderId, object) {
    return items.patch(`/folders/${folderId}`, object);
}