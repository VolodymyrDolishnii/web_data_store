/* eslint-disable no-restricted-globals */
import moment from 'moment';

self.onmessage = function (event) {
  const { folders } = event.data;

  const newFileData = [];
  
    folders.forEach((folder) => {
        folder.content.forEach((content) => {
            const fileItem = {
                Folder: folder.name,
                FolderId: folder.id,
                FolderDate: moment(folder.date).format(),
                ContentName: content.name,
                ContentId: content.id,
                ContentDate: moment(content.date).format(),
                ContentType: content.fileContentType
            };
            newFileData.push(fileItem);
        })
    });

  self.postMessage({ type: 'result', payload: { fileData: newFileData } });
};