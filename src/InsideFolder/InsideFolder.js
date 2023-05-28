/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Dropzone, { useDropzone } from "react-dropzone";

import Cross from '../assets/cross.svg';
import Copy from '../assets/copy-icon.svg';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { updateFolder } from "../api/foldersData";
import { addContentToFolderDispatch, setFolderContentDispatch } from "../folders/forders";
import moment from "moment";
import { Loader } from "../loader/Loader";
import EditText from '../assets/edit-text.svg';

export function InsideFolder({ folders }) {
    const dispatch = useDispatch();
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isContentAdding, setIsContentAdding] = useState(false);
    const params = useParams();
    const folderId = params.id;
    const [contentType] = useState([{
        id: 1, name: 'Text content',
    }, {
        id: 2, name: "Image",
    }, {
        id: 3, name: 'Audio file'
    }, {
        id: 4, name: 'Any file type (only for download)'
    }]);
    const [selectedContentType, setSelectedContentType] = useState('Text content');
    const [textContent, setTextContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isContentExtended, setIsContentExtended] = useState(null);
    const [isTextEditable, setIsTextEditable] = useState(false);
    // const [changedText, setChangedText] = useState('');
    // const [changedName, setChangedName] = useState('');
    const changedTextRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [filteredContent, setFilteredContent] = useState([]);
    const [usedContentTypes, setUsedContentTypes] = useState([]);
    const [filterBy, setFilterBy] = useState(null);
    // const [sortList] = useState(['Date', 'Name']);
    // const [sortBy, setSortBy] = useState('Date');


    useEffect(() => {
        const typesArr = [];

        filteredContent?.forEach((item) => {
            typesArr.push(item.fileContentType);
        });

        const uniqueValues = Array.from(new Set(typesArr));

        setUsedContentTypes(uniqueValues);
    }, [filteredContent]);

    useEffect(() => {
        setFilteredContent(selectedFolder?.content);
    }, [selectedFolder?.content]);

    useEffect(() => {
        const newContent = selectedFolder?.content?.filter((item) => {
            if (item.name.toLowerCase().includes(query.toLowerCase())) {
                return item;
            }
        });

        if (filterBy) {
            const filteredNewContent = newContent.filter((item) => {
                if (item.fileContentType === filterBy) {
                    return item;
                }
            });
            setFilteredContent(filteredNewContent);
        } else {
            setFilteredContent(newContent);
        }
    }, [query, filterBy]);

    // function sortingBy() {
    //     if (!sortBy) {
    //         return;
    //     }
    //     if (sortBy === 'Name') {
    //         const sortedContent = filteredContent.sort((a, b) => b.name.localeCompare(a.name));
    //         return sortedContent;
    //     }
    //     if (sortBy === 'Date') {
    //         const sortedContent = filteredContent.sort((a, b) => moment(b.date).diff(moment(a.date)));
    //         return sortedContent;
    //     }
    // }

    useEffect(() => {
        if (selectedFolder) {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [selectedFolder])

    useEffect(() => {
        setSelectedFolder(folders.find(folder => folder.id === folderId));
    }, [folders, folderId])

    function copyToClipboard() {
        navigator.clipboard.writeText(selectedFolder?.name)
            .then(() => {
                setIsVisible(true);
                setTimeout(() => {
                    setIsVisible(false);
                }, 5000);
            })
            .catch((error) => {
                console.error('The error is related to copying the folder name: ', error);
            });
    };

    function addTextContentToFolder() {
        const newContent = {
            date: new Date().getTime(),
            id: uuidv4(),
            text: textContent,
            name: fileName,
            fileContentType: selectedContentType,
        };
        const newFolder = { ...selectedFolder, content: [...selectedFolder.content, newContent] };
        dispatch(addContentToFolderDispatch(selectedFolder.id, newContent));
        updateFolder(selectedFolder.id, newFolder);
        setTextContent('');
        setFileName('');
        setIsContentAdding(false);
    }

    function addImageContentToFolder() {
        const newContent = {
            date: new Date().getTime(),
            id: uuidv4(),
            imageUrl: selectedFile,
            name: fileName,
            fileContentType: selectedContentType,
        };
        const newFolder = { ...selectedFolder, content: [...selectedFolder.content, newContent] };
        dispatch(addContentToFolderDispatch(selectedFolder.id, newContent));
        updateFolder(selectedFolder.id, newFolder);
        setFileName('');
        setSelectedFile(null);
        setIsContentAdding(false);
    }

    function addAudioContentToFolder() {
        const newContent = {
            date: new Date().getTime(),
            id: uuidv4(),
            audioUrl: selectedFile,
            name: fileName,
            fileContentType: selectedContentType,
        };
        const newFolder = { ...selectedFolder, content: [...selectedFolder.content, newContent] };
        dispatch(addContentToFolderDispatch(selectedFolder.id, newContent));
        updateFolder(selectedFolder.id, newFolder);
        setFileName('');
        setSelectedFile(null);
        setIsContentAdding(false);
    }

    function addAnyContentToFolder() {
        const newContent = {
            date: new Date().getTime(),
            id: uuidv4(),
            anyFileUrl: selectedFile,
            name: fileName,
            fileContentType: selectedContentType,
        };
        const newFolder = { ...selectedFolder, content: [...selectedFolder.content, newContent] };
        dispatch(addContentToFolderDispatch(selectedFolder.id, newContent));
        updateFolder(selectedFolder.id, newFolder);
        setFileName('');
        setSelectedFile(null);
        setIsContentAdding(false);
    }

    // const handleConfirmClick = () => {
    //     const value = changedTextRef.current.textContent;
    //     setChangedText(value);
    //     if (changedText === '') {
    //         const newValue = changedTextRef.current.textContent;
    //         setChangedText(newValue);
    //     }
    //     // const newContent = { ...isContentExtended, text: changedText };
    //     setIsTextEditable(false);
    // };

    // const handleUndoClick = () => {
    //     setIsTextEditable(false);
    //     setIsContentExtended(null);
    // };

    useEffect(() => {
        setIsTextEditable(false);
    }, [isContentExtended]);

    const isImageFile = (file) => {
        return file.type.startsWith('image/');
    };

    const isAudioFile = (file) => {
        return file.type.startsWith('audio/');
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (selectedContentType === 'Image') {
                if (isImageFile(file)) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64Data = reader.result;
                        setSelectedFile(base64Data);
                        setError('');
                    };
                    reader.readAsDataURL(file);
                } else {
                    setSelectedFile(null);
                    setError('Only image files');
                }
            }
            if (selectedContentType === 'Audio file') {
                if (isAudioFile(file)) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64Data = reader.result;
                        setSelectedFile(base64Data);
                        setError('');
                    };
                    reader.readAsDataURL(file);
                } else {
                    setSelectedFile(null);
                    setError('Only audio files');
                }
            }
            if (selectedContentType === 'Any file type (only for download)') {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Data = reader.result;
                    setSelectedFile(base64Data);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
    });

    useEffect(() => {
        setFileName('');
        setSelectedContentType('Text content');
        setTextContent('');
        setSelectedFile(null);
    }, [isContentAdding]);

    useEffect(() => {
        setError('');
    }, [selectedFile]);

    const downloadFile = (fileBase64) => {
        const element = document.createElement('a');
        element.setAttribute('href', `${fileBase64}`);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="folder-content-page">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header className="folder-content-page_header">
                        {selectedFolder?.name.length <= 40 ? (
                            <>
                                <h1 className='inside-folder-header'>{selectedFolder?.name}
                                    <img
                                        src={Copy}
                                        width={20}
                                        height={20}
                                        className="copy-button"
                                        onClick={() => {
                                            if (isVisible) {
                                                navigator.clipboard.writeText(selectedFolder?.name);
                                                return;
                                            } else {
                                                copyToClipboard();
                                            }
                                        }}
                                    />
                                    {isVisible && <p className="copy-message">The folder name has been copied!</p>}
                                </h1>
                            </>
                        ) : (
                            <div style={{ display: "flex", gap: '10px', alignItems: 'center' }}>
                                <h1
                                    className='inside-folder-header'
                                    full={selectedFolder?.name}
                                >
                                    {selectedFolder?.name.slice(0, 40)}...
                                </h1>
                                {isVisible && <p className="copy-message">The text has been copied!</p>}
                                <img
                                    src={Copy}
                                    width={20}
                                    height={20}
                                    className="copy-button"
                                    onClick={() => {
                                        if (isVisible) {
                                            navigator.clipboard.writeText(selectedFolder?.name);
                                            return;
                                        } else {
                                            copyToClipboard();
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <div className="folder-content-page-functions">
                            <button
                                className="add-folder-item"
                                onClick={() => {
                                    if (isContentAdding === true) {
                                        setIsContentAdding(false);
                                    } else {
                                        setIsContentAdding(true);
                                    }
                                }}
                                disabled={!!isContentExtended}
                            >
                                Add folder content
                            </button>
                            <div
                                className='form__group field'
                                style={{ display: selectedFolder.content.length > 0 ? 'block' : 'none' }}
                            >
                                <input
                                    type="text"
                                    className="form__field"
                                    placeholder="What are you looking for?"
                                    name="name"
                                    id='name'
                                    required
                                    autoComplete='off'
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                    }}
                                />
                                <label htmlFor="name" className="form__label">Item name</label>
                                <button
                                    className='remove-button'
                                    style={{ top: '23px', right: '-20px' }}
                                    onClick={() => setQuery('')}
                                >
                                    <img src={Cross} height={20} width={10} />
                                </button>
                            </div>
                        </div>
                    </header>
                    {isContentAdding && (
                        <div className='add-content-modal'>
                            <button
                                className='remove-button'
                                style={{ top: '13px' }}
                                onClick={() => setIsContentAdding(false)}
                            >
                                <img src={Cross} height={20} width={10} />
                            </button>
                            <p className='add-content-modal_text'>
                                Select the type of content you want to add
                            </p>
                            <div className='add-content-modal_content-type-block'>
                                {contentType.map((item, index) => (
                                    <div key={item.id}>
                                        <input
                                            type="radio"
                                            id={item.id}
                                            defaultChecked={index === 0}
                                            name="content-type"
                                            onClick={() => setSelectedContentType(item.name)}
                                        />
                                        <label htmlFor={item.name} className='radio-label'>
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {selectedContentType === 'Text content' && (
                                <>
                                    <textarea
                                        style={{
                                            width: '290px',
                                            height: '175px',
                                            marginTop: '20px',
                                            resize: 'none',
                                            fontSize: '20px',
                                        }}
                                        placeholder="Write the text you need"
                                        onChange={(event) => {
                                            setTextContent(event.target.value.trimStart());
                                        }}
                                        value={textContent}
                                    >
                                    </textarea>
                                    <p style={{ width: '100%', textAlign: 'center', marginTop: '15px', color: '#FFFFFF' }}>
                                        Enter file name:
                                    </p>
                                    <input value={fileName} onChange={(event) => {
                                        setFileName(event.target.value.trimStart());
                                    }} />
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '295px',
                                            justifyContent: 'space-between',
                                            marginTop: '15px'
                                        }}
                                    >
                                        <button
                                            className="add-content-modal_button"
                                            disabled={textContent.length === 0 || fileName.length === 0}
                                            onClick={() => addTextContentToFolder()}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="add-content-modal_button"
                                            style={{ backgroundColor: textContent.length === 0 ? '#d4d4d4' : '#ff8080', color: 'black' }}
                                            onClick={() => setTextContent('')}
                                            disabled={textContent.length === 0}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </>
                            )}
                            {selectedContentType === 'Image' && (
                                <>
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                                        style={{
                                            background: 'white',
                                            width: '100%',
                                            height: '150px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '15px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {selectedFile ? (
                                            <img
                                                src={selectedFile}
                                                alt="Selected"
                                                width={150}
                                                height={150}
                                                style={{ objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <p style={{
                                                color: 'black',
                                                textAlign: 'center',
                                                display: error
                                                    ? 'none'
                                                    : 'block'
                                            }}
                                            >
                                                Drag <br /> or <br /> select
                                            </p>
                                        )}
                                        {error && (
                                            <p style={{ position: 'absolute' }}>{error}</p>
                                        )}
                                    </div>
                                    <p style={{ width: '100%', textAlign: 'center', marginTop: '15px', color: '#FFFFFF' }}>
                                        Enter file name:
                                    </p>
                                    <input value={fileName} onChange={(event) => {
                                        setFileName(event.target.value.trimStart());
                                    }} />
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '295px',
                                            justifyContent: 'space-between',
                                            marginTop: '15px'
                                        }}
                                    >
                                        <button
                                            className="add-content-modal_button"
                                            disabled={selectedFile?.length === 0 || fileName?.length === 0}
                                            onClick={() => addImageContentToFolder()}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="add-content-modal_button"
                                            style={{
                                                backgroundColor: (selectedFile?.length === 0 || !!!selectedFile)
                                                    ? '#d4d4d4'
                                                    : '#ff8080',
                                                color: 'black'
                                            }}
                                            onClick={() => setSelectedFile('')}
                                            disabled={selectedFile?.length === 0 || !!!selectedFile}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </>
                            )}
                            {selectedContentType === 'Audio file' && (
                                <>
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                                        style={{
                                            background: 'white',
                                            width: '100%',
                                            height: '150px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '15px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {selectedFile ? (
                                            // <img
                                            //     src={selectedFile}
                                            //     alt="Selected"
                                            //     width={150}
                                            //     height={150}
                                            //     style={{ objectFit: 'contain' }}
                                            // />
                                            <audio src={selectedFile} controls />
                                        ) : (
                                            <p style={{
                                                color: 'black',
                                                textAlign: 'center',
                                                display: error
                                                    ? 'none'
                                                    : 'block'
                                            }}
                                            >
                                                Drag <br /> or <br /> select
                                            </p>
                                        )}
                                        {error && (
                                            <p style={{ position: 'absolute' }}>{error}</p>
                                        )}
                                    </div>
                                    <p style={{ width: '100%', textAlign: 'center', marginTop: '15px', color: '#FFFFFF' }}>
                                        Enter file name:
                                    </p>
                                    <input value={fileName} onChange={(event) => {
                                        setFileName(event.target.value.trimStart());
                                    }} />
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '295px',
                                            justifyContent: 'space-between',
                                            marginTop: '15px'
                                        }}
                                    >
                                        <button
                                            className="add-content-modal_button"
                                            disabled={selectedFile?.length === 0 || fileName?.length === 0}
                                            onClick={() => addAudioContentToFolder()}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="add-content-modal_button"
                                            style={{
                                                backgroundColor: (selectedFile?.length === 0 || !!!selectedFile)
                                                    ? '#d4d4d4'
                                                    : '#ff8080',
                                                color: 'black'
                                            }}
                                            onClick={() => setSelectedFile('')}
                                            disabled={selectedFile?.length === 0 || !!!selectedFile}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </>
                            )}
                            {selectedContentType === 'Any file type (only for download)' && (
                                <>
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                                        style={{
                                            background: 'white',
                                            width: '100%',
                                            height: '150px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '15px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {selectedFile ? (
                                            <p style={{
                                                color: 'black',
                                                textAlign: 'center',
                                            }}>
                                                File added successfully
                                            </p>
                                        ) : (
                                            <p style={{
                                                color: 'black',
                                                textAlign: 'center',
                                            }}
                                            >
                                                Drag <br /> or <br /> select
                                            </p>
                                        )}
                                    </div>
                                    <p style={{ width: '100%', textAlign: 'center', marginTop: '15px', color: '#FFFFFF' }}>
                                        Enter file name:
                                    </p>
                                    <input value={fileName} onChange={(event) => {
                                        setFileName(event.target.value.trimStart());
                                    }} />
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '295px',
                                            justifyContent: 'space-between',
                                            marginTop: '15px'
                                        }}
                                    >
                                        <button
                                            className="add-content-modal_button"
                                            disabled={selectedFile?.length === 0 || fileName?.length === 0}
                                            onClick={() => addAnyContentToFolder()}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="add-content-modal_button"
                                            style={{
                                                backgroundColor: (selectedFile?.length === 0 || !!!selectedFile)
                                                    ? '#d4d4d4'
                                                    : '#ff8080',
                                                color: 'black'
                                            }}
                                            onClick={() => setSelectedFile('')}
                                            disabled={selectedFile?.length === 0 || !!!selectedFile}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '100px',
                        paddingRight: '150px',
                        marginTop: '30px'
                    }}
                    >
                        {usedContentTypes.length > 0 && (
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <h2>Filter by</h2>
                                <div style={{ display: "flex", gap: '15px', position: 'relative' }}>
                                    {usedContentTypes.map((type) => (
                                        <button
                                            key={type}
                                            className="filter-by-button"
                                            style={{
                                                borderRadius: '15px',
                                                cursor: 'pointer',
                                                backgroundColor: type === filterBy ? 'rgba(69, 189, 153, 0.8)' : '#e8e8e8',
                                                border: 'none',
                                                color: type === filterBy ? '#FFFFFF' : '#000000',
                                                fontWeight: type === filterBy ? 700 : 400,
                                            }}
                                            onClick={() => {
                                                if (filterBy === type) {
                                                    setFilterBy(null);
                                                } else {
                                                    setFilterBy(type);
                                                }
                                            }}
                                        >
                                            {type === 'Any file type (only for download)' ? ('Only for download') : (type)}
                                        </button>
                                    ))}
                                    <button
                                        className='remove-button'
                                        style={{ top: '5px', right: '-30px' }}
                                        onClick={() => setFilterBy(null)}
                                    >
                                        <img src={Cross} height={20} width={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* <div style={{ display: 'flex', gap: '20px' }}>
                            <h2>Sort by</h2>
                            <div style={{ display: "flex", gap: '15px', position: 'relative' }}>
                                {sortList.map((sort) => (
                                    <button
                                        key={sort}
                                        className="filter-by-button"
                                        style={{
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            backgroundColor: sort === sortBy ? 'rgba(69, 189, 153, 0.8)' : '#e8e8e8',
                                            border: 'none',
                                            color: sort === sortBy ? '#FFFFFF' : '#000000',
                                            fontWeight: sort === sortBy ? 700 : 400,
                                        }}
                                        onClick={() => {
                                            setSortBy(sort);
                                        }}
                                        disabled={sort === sortBy}
                                    >
                                        {sort}
                                    </button>
                                ))}
                            </div>
                        </div> */}
                    </div>
                    <main>
                        <ul className="folders-list">
                            {selectedFolder?.content?.length > 0 ? (
                                <>
                                    {filteredContent?.map((item) => (
                                        <>
                                            <li
                                                key={item?.id}
                                                className='content'
                                                style={{
                                                    backgroundColor: '#e8e8e8',
                                                    alignItems: 'start',
                                                    cursor: isContentExtended ? 'not-allowed' : 'pointer',
                                                    scale: isContentExtended ? '1' : '1.05',
                                                }}
                                                onClick={() => {
                                                    if (isContentExtended || isContentAdding) {
                                                        return;
                                                    } else {
                                                        setIsContentExtended(item)
                                                    }
                                                }}
                                            >
                                                {item?.name.length <= 33 ? (
                                                    <p className='content-name'>
                                                        {item?.name}
                                                    </p>
                                                ) : (
                                                    <p className='content-name' full={item?.name}>
                                                        {item?.name.slice(0, 33)}...
                                                    </p>
                                                )}
                                                <p className='content-type'>
                                                    {item?.fileContentType === 'Any file type (only for download)'
                                                        ? ('Only for download')
                                                        : (item?.fileContentType)
                                                    }
                                                </p>
                                                <p className='content-date'>
                                                    {moment(item.date).format('MMMM Do YYYY HH:mm')}
                                                </p>
                                                <button
                                                    className='remove-button'
                                                    style={{
                                                        top: '13px',
                                                        cursor: isContentExtended ? 'not-allowed' : 'pointer'
                                                    }}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        const newContent = selectedFolder.content
                                                            .filter((con) => con.id !== item.id);
                                                        const newFolder = { ...selectedFolder, content: newContent };
                                                        updateFolder(selectedFolder.id, newFolder);
                                                        dispatch(setFolderContentDispatch(selectedFolder.id, newContent));
                                                    }}
                                                    disabled={isContentExtended}
                                                >
                                                    <img src={Cross} height={20} width={10} />
                                                </button>
                                            </li>
                                            {isContentExtended && isContentExtended?.fileContentType === 'Text content' && (
                                                <div className='content-modal'>
                                                    {isContentExtended?.name.length <= 65 ? (
                                                        <p className='content-name' contentEditable={isTextEditable}>
                                                            {isContentExtended?.name}
                                                        </p>
                                                    ) : (
                                                        <p className='content-name' full={isContentExtended?.name} contentEditable={isTextEditable}>
                                                            {isContentExtended?.name.slice(0, 65)}...
                                                        </p>
                                                    )}
                                                    <div className="content-modal-functions">
                                                        <p className='content-type'>
                                                            {isContentExtended?.fileContentType}
                                                        </p>
                                                        {isTextEditable && (
                                                            <p className="change-content-message">
                                                                Now you can change the content
                                                            </p>
                                                        )}
                                                        {/* <button
                                                            className='edit-text-button'
                                                            onClick={() => {
                                                                if (isTextEditable) {
                                                                    setIsTextEditable(false);
                                                                } else {
                                                                    setIsTextEditable(true);
                                                                }
                                                            }}
                                                        >
                                                            <img src={EditText} width={15} height={15} />
                                                        </button> */}
                                                    </div>
                                                    <p
                                                        className='content-modal-text'
                                                        contentEditable={isTextEditable}
                                                        ref={changedTextRef}
                                                    >
                                                        {isContentExtended?.text}
                                                    </p>
                                                    <button
                                                        className='remove-button'
                                                        style={{ top: '13px' }}
                                                        onClick={() => setIsContentExtended(null)}
                                                    >
                                                        <img src={Cross} height={20} width={10} />
                                                    </button>
                                                    {isTextEditable && (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                width: '400px',
                                                                justifyContent: 'space-between',
                                                                position: 'absolute',
                                                                bottom: '10px',
                                                            }}
                                                        >
                                                            <button
                                                                className="add-content-modal_button"
                                                            // onClick={handleConfirmClick}
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                className="add-content-modal_button"
                                                            // onClick={handleUndoClick}
                                                            >
                                                                Undo
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {isContentExtended && isContentExtended?.fileContentType === 'Image' && (
                                                <div className='content-modal' style={{ height: 'fit-content' }}>
                                                    {isContentExtended?.name.length <= 65 ? (
                                                        <p className='content-name' contentEditable={isTextEditable}>
                                                            {isContentExtended?.name}
                                                        </p>
                                                    ) : (
                                                        <p className='content-name' full={isContentExtended?.name} contentEditable={isTextEditable}>
                                                            {isContentExtended?.name.slice(0, 65)}...
                                                        </p>
                                                    )}
                                                    <div className="content-modal-functions">
                                                        <p className='content-type'>
                                                            {isContentExtended?.fileContentType}
                                                        </p>
                                                        {isTextEditable && (
                                                            <p className="change-content-message">
                                                                Now you can change the content
                                                            </p>
                                                        )}
                                                        {/* <button
                                                            className='edit-text-button'
                                                            onClick={() => {
                                                                if (isTextEditable) {
                                                                    setIsTextEditable(false);
                                                                } else {
                                                                    setIsTextEditable(true);
                                                                }
                                                            }}
                                                        >
                                                            <img src={EditText} width={15} height={15} />
                                                        </button> */}
                                                    </div>
                                                    <button
                                                        className='remove-button'
                                                        style={{ top: '13px' }}
                                                        onClick={() => setIsContentExtended(null)}
                                                    >
                                                        <img src={Cross} height={20} width={10} />
                                                    </button>
                                                    <img
                                                        src={isContentExtended.imageUrl}
                                                        width={400}
                                                        height={300}
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            )}
                                            {isContentExtended && isContentExtended?.fileContentType === 'Audio file' && (
                                                <div className='content-modal' style={{ height: 'fit-content' }}>
                                                    {isContentExtended?.name.length <= 65 ? (
                                                        <p className='content-name' contentEditable={isTextEditable}>
                                                            {isContentExtended?.name}
                                                        </p>
                                                    ) : (
                                                        <p className='content-name' full={isContentExtended?.name} contentEditable={isTextEditable}>
                                                            {isContentExtended?.name.slice(0, 65)}...
                                                        </p>
                                                    )}
                                                    <div className="content-modal-functions">
                                                        <p className='content-type'>
                                                            {isContentExtended?.fileContentType}
                                                        </p>
                                                        {isTextEditable && (
                                                            <p className="change-content-message">
                                                                Now you can change the content
                                                            </p>
                                                        )}
                                                        {/* <button
                                                            className='edit-text-button'
                                                            onClick={() => {
                                                                if (isTextEditable) {
                                                                    setIsTextEditable(false);
                                                                } else {
                                                                    setIsTextEditable(true);
                                                                }
                                                            }}
                                                        >
                                                            <img src={EditText} width={15} height={15} />
                                                        </button> */}
                                                    </div>
                                                    <button
                                                        className='remove-button'
                                                        style={{ top: '13px' }}
                                                        onClick={() => setIsContentExtended(null)}
                                                    >
                                                        <img src={Cross} height={20} width={10} />
                                                    </button>
                                                    <audio controls autobuffer="autobuffer" style={{ paddingLeft: '50px' }}>
                                                        <source src={isContentExtended?.audioUrl} />
                                                    </audio>
                                                </div>
                                            )}
                                            {isContentExtended && isContentExtended?.fileContentType === 'Any file type (only for download)' && (
                                                <div className='content-modal' style={{ height: 'fit-content' }}>
                                                    {isContentExtended?.name.length <= 65 ? (
                                                        <p className='content-name' contentEditable={isTextEditable}>
                                                            {isContentExtended?.name}
                                                        </p>
                                                    ) : (
                                                        <p className='content-name' full={isContentExtended?.name} contentEditable={isTextEditable}>
                                                            {isContentExtended?.name.slice(0, 65)}...
                                                        </p>
                                                    )}
                                                    <button
                                                        className='remove-button'
                                                        style={{ top: '13px' }}
                                                        onClick={() => setIsContentExtended(null)}
                                                    >
                                                        <img src={Cross} height={20} width={10} />
                                                    </button>
                                                    <button
                                                        className="download-button"
                                                        onClick={() => downloadFile(isContentExtended?.anyFileUrl)}
                                                    >
                                                        Download file
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ))}
                                    {filteredContent.length === 0 && (
                                        <p
                                            style={{ position: 'absolute', left: '50%', translate: '-50%', fontWeight: 700, fontSize: '22px' }}
                                        >
                                            Such content does not exist
                                        </p>
                                    )}
                                </>
                            ) : (
                                <h1>This folder is currently empty</h1>
                            )}
                        </ul>
                    </main>
                </>
            )}
        </div>
    )
}