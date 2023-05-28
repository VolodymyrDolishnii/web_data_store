import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Folder } from './FolderComonent/Folder';
import { InsideFolder } from './InsideFolder/InsideFolder';
import { useDispatch, useSelector } from 'react-redux';
import { getFolders } from './api/foldersData';
import { setFoldersDispatch } from './folders/forders';

function App() {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFolders()
      .then(res => dispatch(setFoldersDispatch(res)))
      .catch(() => setIsError(true))
      .finally(() => setTimeout(() => setIsLoading(false), 500));
  }, []);

  return (
   <>
      <Router>
          <Routes>
            <Route path='/' element={<Folder folders={folders} isLoading={isLoading} isError={isError} />}></Route>
            <Route path='/:id' element={<InsideFolder folders={folders} />}></Route>
          </Routes>
      </Router>
   </>
  );
}

export default App;
