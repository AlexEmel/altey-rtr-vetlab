import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAppState {
  ui: {
    isSidebarCollapsed: boolean;
  }
}

const initialState: IAppState = {
  ui: {
    isSidebarCollapsed: false,
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetApp: () => initialState,
    setIsCollapsedSidebar: (state, action: PayloadAction<boolean>) => {
      state.ui.isSidebarCollapsed = action.payload;
    },
  },
});

export const { resetApp, setIsCollapsedSidebar } = appSlice.actions;
