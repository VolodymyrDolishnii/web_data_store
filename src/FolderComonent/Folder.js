/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import '../App.css';
import { addFolderDispatch, removeFolderDispatch } from '../folders/forders';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../loader/Loader';
import { postFolder, removeFolder } from '../api/foldersData';

import Cross from '../assets/cross.svg';

export function Folder({ folders, isLoading, isError }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [allFoldersDeleting, setAllFoldersDeleting] = useState(false);
  const navigate = useNavigate();

  function deleteAllFolders() {
    folders.forEach((folder) => {
      removeFolder(folder.id);
      dispatch(removeFolderDispatch(folder));
    });
  }

  return (
    <div className="App">
      {isLoading
        ? (<Loader />)
        : (
          <>
            <div className='folders-panel'>
              {folders.length === 0 ? (
                <h1 className='folder-counter'>You do not have any folders yet</h1>
              ) : (
                <h1 className='folder-counter'>Folders count: {folders.length}</h1>
              )}
              <button 
                className='delete-all-folders' 
                disabled={folders.length <= 0}
                onClick={() => {
                  if (allFoldersDeleting === true) {
                    setAllFoldersDeleting(false);
                  } else {
                    setAllFoldersDeleting(true)
                  }
                }}
              >
                Delete all folders
              </button>
            </div>
            <button
              className='add-folder'
              onClick={() => setIsAdding(true)}
              style={folders?.length > 0
                ? { position: 'fixed', bottom: '20px', right: '20px' }
                : { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'left' }
              }
              disabled={allFoldersDeleting}
            >
              Add folder
            </button>
            {allFoldersDeleting && (
              <div className='deleting-modal'>
                <button
                  className='remove-button'
                  style={{ top: '13px' }}
                  onClick={() => setAllFoldersDeleting(false)}
                >
                  <img src={Cross} height={20} width={10} />
                </button>
                <p className='deleting-modal_text'>Are you sure you want to delete all folders and their contents?</p>
                <div className='deleting-modal_buttons-block'>
                  <button 
                    className='deleting-modal_button'
                    onClick={() => {
                      deleteAllFolders();
                      setAllFoldersDeleting(false);
                    }}
                  >
                      Yes
                  </button>
                  <button 
                    className='deleting-modal_button'
                    onClick={() => setAllFoldersDeleting(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            {isAdding && (
              <div className='add-modal'>
                <button
                  className='remove-button'
                  onClick={() => setIsAdding(false)}
                  style={{ top: '23.5px' }}
                >
                  <img src={Cross} height={20} width={10} />
                </button>
                <h1 className='add-modal-header'>Add folder menu</h1>
                <div className='form__group field'>
                  <input
                    type="text"
                    className="form__field"
                    placeholder="Enter a folder name"
                    name="name"
                    id='name'
                    required
                    autoComplete='off'
                    value={inputValue}
                    onChange={(event) => {
                      setInputValue(event.target.value.trimStart());
                    }}
                  />
                  <label htmlFor="name" className="form__label">Folder name</label>
                </div>
                <button
                  className='add-modal-button'
                  onClick={() => {
                    const newFolder = { name: inputValue, date: new Date().getTime(), id: uuidv4(), content: [] };
                    dispatch(addFolderDispatch(newFolder));
                    postFolder(newFolder);
                    setIsAdding('');
                    setInputValue('');
                  }}
                  disabled={inputValue.length === 0}
                >
                  Add folder
                </button>
              </div>
            )}
            <ul className='folders-list'>
              {folders?.map(folder => (
                <li className='folder' key={folder.date} onClick={() => navigate(folder.id)}>
                  <button
                    className='remove-button'
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFolder(folder.id);
                      dispatch(removeFolderDispatch(folder));
                    }}
                    style={{ top: '28.5px' }}
                  >
                    <img src={Cross} height={20} width={10} alt={'Remove button'} />
                  </button>
                  {folder.name.length > 40 ? (
                    <p className='folder-header' full={folder.name}>{folder.name.slice(0, 40)}...</p>
                  ) : (<p className='folder-header'>{folder.name}</p>)}
                  <p>{moment(folder.date).format('MMMM Do YYYY HH:mm')}</p>
                </li>
              ))}
            </ul>
          </>
        )}
    </div>
  );
}