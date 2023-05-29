/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { addFolderDispatch, removeFolderDispatch } from '../folders/forders';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../loader/Loader';
import { postFolder, removeFolder } from '../api/foldersData';
import CsvDownloadButton from 'react-json-to-csv';
import MyWorker from 'worker-loader!./generateFileData.js';

import Cross from '../assets/cross.svg';
import Download from '../assets/download-svg.svg';

import '../App.css';

export function Folder({ folders, isLoading, isError }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [allFoldersDeleting, setAllFoldersDeleting] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [separator, setSeparator] = useState(',');
  const [fileData, setFileData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(null);
  const [uniqueValue, setUniqueValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsGenerating(false);
    setFileData([]);
  }, [folders]);

  useEffect(() => {
    const newFolders = folders?.filter((item) => {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        return item;
      }
    });
    setFilteredFolders(newFolders);
  }, [query, folders]);

  function deleteAllFolders() {
    folders.forEach((folder) => {
      removeFolder(folder.id);
      dispatch(removeFolderDispatch(folder));
    });
  }

  const getKeys = (data) => {
    let arr = [];
    if (data) {
      Object.keys(data).map((key) => {
        arr = Object.keys(data[key]);
      });
    }
    return arr;
  };

  useEffect(() => {
    const worker = new MyWorker();
    worker.onmessage = function (event) {
      setFileData(event.data.payload.fileData);
      setIsGenerating(false);
    }
    worker.postMessage({ folders });
  }, [uniqueValue]);

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
            <div style={{
              position: 'relative',
              marginTop: '30px',
              paddingLeft: '100px',
              paddingRight: '150px',
              display: 'flex',
              justifyContent: 'space-between'
            }}
            >
              <div>
                <input
                  type="text"
                  className="form__field-folder"
                  placeholder="What are you looking for?"
                  name="folder"
                  id='folder'
                  required
                  autoComplete='off'
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  disabled={isAdding}
                  style={{ cursor: isAdding ? 'not-allowed' : 'pointer' }}
                />
                <label
                  htmlFor="folder"
                  className="form__label-folder"
                  style={{ cursor: isAdding ? 'not-allowed' : 'pointer' }}
                >
                  Folder name
                </label>
                {query.length > 0 && (
                  <p style={{ marginTop: '10px' }}>Search result: {filteredFolders.length}</p>
                )}
              </div>
              {filteredFolders.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      if (isVisible) {
                        setIsVisible(false);
                      } else {
                        setIsVisible(true);
                      }
                    }}
                    className='file-export-button'
                  >
                    <p style={{ fontSize: '20px' }}>Export file</p> <img src={Download} width={20} height={20} />
                  </button>
                  {isVisible && (
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className='export-menu'
                    >
                      <div className='separators-list'>
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                            setSeparator(',');
                          }}
                        >
                          <input
                            type={'radio'}
                            id={'comma'}
                            name={'group1'}
                            defaultChecked
                          />
                          <label
                            htmlFor={'comma'}
                          >
                            Comma
                          </label>
                        </div>
                        <div
                          onClick={() => setSeparator(';')}
                        >
                          <input
                            type={'radio'}
                            id={'semicolon'}
                            name={'group1'}
                          />
                          <label
                            htmlFor={'semicolon'}
                          >
                            Semicolon
                          </label>
                        </div>
                        <div
                          onClick={() => setSeparator('\t')}
                        >
                          <input
                            type={'radio'}
                            id={'tab'}
                            name={'group1'}
                          />
                          <label
                            htmlFor={'tab'}
                          >
                            Tab
                          </label>
                        </div>
                      </div>
                      {fileData.length > 0 ? (
                        <CsvDownloadButton
                          data={fileData}
                          filename={`${moment().format('YYYY-MM-DD_HHmm')}_Folders.csv`}
                          delimiter={separator}
                          headers={getKeys(fileData)}
                          className='download-file-button'
                        >
                          Download
                        </CsvDownloadButton>
                      ) : (
                        <>
                          {isGenerating ? (
                            <div className='export-loader'>
                              <Loader />
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setUniqueValue(new Date().valueOf());
                                setIsGenerating(true);
                              }}
                              className='download-file-button'
                            >
                              Export
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
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
              {filteredFolders?.map(folder => (
                <li
                  className='folder'
                  key={folder.date}
                  onClick={() => {
                    if (isAdding) {
                      return;
                    }
                    navigate(folder.id);
                    setUniqueValue(new Date().valueOf());
                  }}
                  style={{ cursor: isAdding ? 'not-allowed' : 'pointer' }}
                >
                  <button
                    className='remove-button'
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFolder(folder.id);
                      dispatch(removeFolderDispatch(folder));
                    }}
                    style={{ top: '28.5px', cursor: isAdding ? 'not-allowed' : 'pointer' }}
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