
import { memoizeOneFactory } from 'core/memoizer';
import { ICellFactoryOptions } from 'dash-table/components/Table/props';
import cellEventHandler, { Handler } from 'dash-table/derived/cell/eventHandler';
import { ICellHandlerProps } from 'dash-table/components/CellInput/props';

type CacheArgs = [number, number];

export type CacheFn = (...args: CacheArgs) => ICellHandlerProps;
export type HandlerFn = (...args: any[]) => any;

const getter = (propsFn: () => ICellFactoryOptions): CacheFn => {
    const derivedHandlers = cellEventHandler()(propsFn);

    return (...args: CacheArgs) => {
        const [
            rowIndex,
            columnIndex
        ] = args;

        const {
            viewport
        } = propsFn();

        const realIndex = viewport.indices[rowIndex];

        return {
            onChange: derivedHandlers(Handler.Change, realIndex, columnIndex),
            onClick: derivedHandlers(Handler.Click, rowIndex, columnIndex),
            onDoubleClick: derivedHandlers(Handler.DoubleClick, rowIndex, columnIndex),
            onPaste: derivedHandlers(Handler.Paste, rowIndex, columnIndex)
        } as ICellHandlerProps;
    };
};

export default memoizeOneFactory(getter);