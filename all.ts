import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
import * as React from 'react';
import { useAppDispatch, useAppSelector } from './store/store';
import { fetchProducts } from './store/postSlice';

export default function App() {
  const posts = useAppSelector((state) => state.posts.posts);

  const dispatсh = useAppDispatch();

  React.useEffect(() => {
    dispatсh(fetchProducts());
  }, []);

  return (
    <div>
      <h1>Пиздец! я ебал ваш редакс!</h1>
      <p>Start editing to see some magic happen :)</p>
      <div>{posts.map((e) => e.title)}</div>
    </div>
  );
}
export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
import { configureStore } from '@reduxjs/toolkit';
import PostsSlice from './postSlice';

const store = configureStore({
  reducer: {
    posts: PostsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IPost } from '../types/types';

export const fetchProducts = createAsyncThunk(
  'posts/fetchProducts',
  async function ({ rejectWithValue }) {
    try {
      const response = await axios.get<IPost[]>(
        'https://jsonplaceholder.typicode.com/posts'
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface IState {
  posts: IPost[];
}

const initialState: IState = {
  posts: [],
};

export const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      //do something on pending
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.posts = action.payload;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      // do something on rejected
    });
  },
});

export default PostsSlice.reducer;
