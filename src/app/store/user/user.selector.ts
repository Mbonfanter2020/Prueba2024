import {createSelector, createFeatureSelector} from '@ngrx/store';
import { UserState } from './user.reducer';
import { state } from '@angular/animations';

export const getUserState = createFeatureSelector<UserState>('user');

export const getUser = createSelector(
  getUserState,(state) => state.loading
)

export const getLoading = createSelector(
  getUserState,
  (state) => state.id
)

export const getIsAutorized = createSelector(
  getUserState,
  (state) => !!state.id
)
