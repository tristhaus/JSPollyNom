import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculateScore, Dot, Dots, getDotsWithStatus } from '../service/dot';
import { Data, evaluate } from '../service/evaluation';

interface GameState {
    expression: string,
    graphData: Data,
    goodDotsInactive: Dot[],
    goodDotsActive: Dot[],
    badDotsInactive: Dot[],
    badDotsActive: Dot[],
    score: number,
}

const initialState: GameState = {
    expression: '',
    graphData: [],
    goodDotsInactive: [],
    goodDotsActive: [],
    badDotsInactive: [],
    badDotsActive: [],
    score: 0,
};

export const gameSlice = createSlice(
    {
        name: 'game',
        initialState,
        reducers: {
            updateExpression: (state, action: PayloadAction<string>) => {
                state.expression = action.payload;
                const data = evaluate(action.payload); 
                state.graphData = data;
                const dots: Dots = getDotsWithStatus(state.goodDotsActive.concat(state.goodDotsInactive), state.badDotsActive.concat(state.badDotsInactive), data);
                state.goodDotsActive = dots.goodActive;
                state.goodDotsInactive = dots.goodInactive;
                state.badDotsActive = dots.badActive;
                state.badDotsInactive = dots.badInactive;
                state.score = calculateScore(dots);
            },
            reset: (state, action: PayloadAction<Dots>) => {
                state.expression = '';
                state.goodDotsInactive = action.payload.goodInactive;
                state.goodDotsActive = action.payload.goodActive;
                state.badDotsInactive = action.payload.badInactive;
                state.badDotsActive = action.payload.badActive;
                state.score = 0;
            },
        }
    }
);

export const { updateExpression, reset } = gameSlice.actions;

export default gameSlice.reducer;
